import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
    StatusBar,
    ActivityIndicator,
    Modal,
    Dimensions,
    Vibration,
    Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Sound from 'react-native-sound';
import { useAlert } from '../context/AlertContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../utils/apiConfig';

const { width } = Dimensions.get('window');

Sound.setCategory('Playback');
const notificationSound = new Sound('notification.mp3', Sound.MAIN_BUNDLE, (error) => {
    if (error) {
        console.log('failed to load the sound', error);
    }
});

type OrderStatus = 'pending' | 'packed' | 'packaging' | 'accepted' | 'completed' | 'delivered';

interface Order {
    id: string;
    displayId: string;
    userId: string;
    userName: string;
    customerMobile?: string;
    addressLine?: string;
    city?: string;
    pincode?: string;
    items: { name: string; quantity: number; price: number; subtotal: number }[];
    total: number;
    finalAmount: number;
    redeemDiscount: number;
    earnedPoints: number;
    redeemedPoints: number;
    paymentStatus: string;
    status: OrderStatus;
    pointsAssigned?: number;
}

const COLORS = {
    background: '#F9FAFB', // Very light gray
    surface: '#FFFFFF', // Pure white
    primary: '#0066FF', // Blue buttons
    textPrimary: '#111827', // Black / very dark gray text
    textSecondary: '#4B5563', // Dark gray text
    textTertiary: '#9CA3AF', // Medium gray text
    accent: '#0066FF', 
    accentLight: '#EFF6FF', 
    success: '#10B981', // Green for success
    successLight: '#D1FAE5',
    warning: '#F59E0B', // Orange for warning
    warningLight: '#FEF3C7',
    border: '#E5E7EB', // Light gray border
    divider: '#F3F4F6', // Light gray divider
    error: '#EF4444',
    errorLight: '#FEE2E2',
};

const ShopOwnerDashboardScreen = () => {
    const navigation = useNavigation();
    const { showAlert } = useAlert();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'packed' | 'delivered'>('all');

    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [showPointsModal, setShowPointsModal] = useState(false);
    const [pointsToAssign, setPointsToAssign] = useState('0');
    const [pointsConfig, setPointsConfig] = useState<any>(null);
    const [isAssigning, setIsAssigning] = useState(false);
    const [shopName, setShopName] = useState<string>('');
    const previousPendingCountRef = useRef(0);

    const getShopkeeperId = async () => {
        try {
            const sessionStr = await AsyncStorage.getItem('userSession');
            if (sessionStr) {
                const session = JSON.parse(sessionStr);
                const id = session.shopkeeper_id || session.user_id || session.user?.id || session.user?.pk || session.userId || session.data?.user_id || session.data?.id || session.data?.pk || session.pk || session.id;
                if (id) {
                    return Number(id);
                }
            }
        } catch (e) { console.error('getShopkeeperId error:', e); }
        return null;
    };

    const fetchOrders = async (isBackgroundPolling = false) => {
        try {
            const uId = await getShopkeeperId() || 4;
            const response = await fetch(`${BASE_URL}/gobi360/shopkeeper-orders/${uId}/`, {
                headers: { 'ngrok-skip-browser-warning': 'true' }
            });

            if (response.ok) {
                const resData = await response.json();
                if (resData.shop) setShopName(resData.shop);

                let orderList: any[] = [];
                if (Array.isArray(resData)) orderList = resData;
                else if (resData && Array.isArray(resData.orders)) orderList = resData.orders;
                else if (resData && Array.isArray(resData.results)) orderList = resData.results;
                else if (resData && Array.isArray(resData.data)) orderList = resData.data;

                const mappedOrders: Order[] = orderList.map((o: any, idx: number) => {
                    const rawItems = o.products || o.items || o.order_items || [];
                    const items = rawItems.map((item: any) => {
                        let nameStr = 'Item';
                        if (typeof item.product === 'string') nameStr = item.product;
                        else if (item.product?.name) nameStr = item.product.name;
                        else nameStr = item.product_name || item.name || 'Item';
                        if (item.variation?.value) nameStr += ` (${item.variation.value})`;
                        return {
                            name: nameStr,
                            quantity: item.quantity || item.qty || 1,
                            price: Number(item.price || 0),
                            subtotal: Number(item.subtotal || 0),
                        };
                    });
                    return {
                        id: String(o.order_id || o.id || o.pk || 'ORD-UNKNOWN'),
                        displayId: String(orderList.length - idx),
                        userId: String(o.customer_id || o.user?.id || o.user_id || 'user_unknown'),
                        userName: o.customer_name || o.user?.full_name || o.user?.username || 'Customer',
                        customerMobile: o.customer_mobile || o.user?.mobile || '',
                        addressLine: o.address?.address_line || '',
                        city: o.address?.city || '',
                        pincode: o.address?.pincode || '',
                        items,
                        total: Number(o.total_amount || o.total || 0),
                        finalAmount: Number(o.final_amount ?? o.total_amount ?? 0),
                        redeemDiscount: Number(o.redeem_discount || 0),
                        earnedPoints: Number(o.earned_points || 0),
                        redeemedPoints: Number(o.redeemed_points || 0),
                        paymentStatus: o.payment_status || 'pending',
                        status: o.status || 'pending',
                        pointsAssigned: o.points_assigned || o.pointsAssigned || undefined,
                    };
                });
                
                const currentPendingCount = mappedOrders.filter(o => o.status === 'pending').length;
                if (isBackgroundPolling && currentPendingCount > previousPendingCountRef.current) {
                    Vibration.vibrate([0, 500, 200, 500]);
                    notificationSound.play();
                }
                previousPendingCountRef.current = currentPendingCount;
                
                setOrders(mappedOrders);
            } else {
                console.warn(`Fetch orders failed: ${response.status}`);
            }
        } catch (error) {
            console.error('Error fetching shopkeeper orders:', error);
        } finally {
            if (!isBackgroundPolling) setLoading(false);
        }
    };

    const fetchPointsConfig = async () => {
        try {
            const uId = await getShopkeeperId() || 4;
            const res = await fetch(`${BASE_URL}/gobi360/shopkeeper/reward-setting/${uId}/`, {
                headers: { 'ngrok-skip-browser-warning': 'true' }
            });
            if (res.ok) {
                const data = await res.json();
                if (data && data.status !== false) {
                    await AsyncStorage.setItem('shopPointsConfig', JSON.stringify(data));
                }
            }
        } catch (e) { console.warn('Dashboard points config fetch error:', e); }
    };

    useEffect(() => { 
        fetchOrders(); 
        fetchPointsConfig();
        const intervalId = setInterval(() => {
            fetchOrders(true);
        }, 5000); // Poll every 5 seconds
        return () => clearInterval(intervalId);
    }, []);

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchOrders();
        setRefreshing(false);
    };

    const handleAcceptOrder = async (order: Order) => {
        const cfgStr = await AsyncStorage.getItem('shopPointsConfig');
        let raw = cfgStr ? JSON.parse(cfgStr) : {};
        if (raw && raw.setting) {
            raw = raw.setting;
        }
        
        const cfg = {
            pointsPerAmount: raw.reward_points ?? raw.pointsPerAmount ?? 1,
            amountPerPoints: raw.purchase_amount ?? raw.amountPerPoints ?? 10,
            minOrderAmount: raw.purchase_amount ?? raw.minOrderAmount ?? 10,
            pointValue: raw.redeem_amount && raw.redeem_points
                ? raw.redeem_amount / raw.redeem_points
                : raw.pointValue ?? 0.1,
        };
        setPointsConfig(cfg);
        let pts = order.earnedPoints;
        if (!pts && order.total >= cfg.minOrderAmount) {
            pts = Math.floor(order.total / cfg.amountPerPoints) * cfg.pointsPerAmount;
        }
        setPointsToAssign(String(pts));
        setSelectedOrder(order);
        setShowPointsModal(true);
    };

    const submitPoints = async () => {
        if (!selectedOrder) return;
        setIsAssigning(true);
        try {
            const uId = await getShopkeeperId() || 4;
            const payload = {
                order_id: selectedOrder.id,
                user_id: uId, // The backend expects the shopkeeper's ID here to authenticate
                customer_id: selectedOrder.userId,
                points: Number(pointsToAssign),
                status: 'delivered',
            };
            const res = await fetch(`${BASE_URL}/gobi360/shopkeeper/order-status/${selectedOrder.id}/`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
                body: JSON.stringify(payload),
            });
            if (res.ok) {
                setOrders(prev => prev.map(o =>
                    o.id === selectedOrder.id
                        ? { ...o, status: 'delivered', pointsAssigned: Number(pointsToAssign) }
                        : o
                ));
                setShowPointsModal(false);
                showAlert('Delivered', `Order #${selectedOrder.id} marked as delivered.`);
            } else {
                showAlert('Error', 'Failed to update order.');
            }
        } catch (e) {
            showAlert('Error', 'Failed to update order status.');
        }
        setIsAssigning(false);
    };

    const updateOrderStatus = async (order: Order, status: string, successMessage: string) => {
        try {
            const uId = await getShopkeeperId() || 4;
            const payload = {
                order_id: order.id,
                user_id: uId,
                customer_id: order.userId,
                status: status,
            };
            const res = await fetch(`${BASE_URL}/gobi360/shopkeeper/order-status/${order.id}/`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
                body: JSON.stringify(payload),
            });
            if (res.ok) {
                setOrders(prev => prev.map(o =>
                    o.id === order.id
                        ? { ...o, status: status }
                        : o
                ));
                showAlert('Success', successMessage);
            } else {
                showAlert('Error', `Failed to update order status to ${status}.`);
            }
        } catch (e) {
            showAlert('Error', 'Failed to update order status.');
        }
    };

    const filteredOrders = orders.filter(o => {
        if (activeTab === 'pending') return o.status === 'pending';
        if (activeTab === 'packed') return o.status === 'packed' || o.status === 'packaging';
        if (activeTab === 'delivered') return o.status === 'delivered';
        return true;
    });

    const totalRevenue = orders.reduce((s, o) => s + Number(o.total || 0), 0);
    const pendingCount = orders.filter(o => o.status === 'pending').length;

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            <View style={styles.headerTop}>
                <View>
                    <Text style={styles.greetingText}>Overview</Text>
                    <Text style={styles.shopTitle} numberOfLines={1}>{shopName || 'My Dashboard'}</Text>
                </View>
                <View style={styles.iconButton}>
                    <Icon name="bell-outline" size={24} color={COLORS.textPrimary} />
                    {pendingCount > 0 && <View style={styles.notificationDot} />}
                </View>
            </View>

            {/* Main Stats Card - Clean, Soft, Professional */}
            <View style={styles.revenueCard}>
                <Text style={styles.revenueLabel}>Total Revenue</Text>
                <Text style={styles.revenueValue}>₹{totalRevenue.toLocaleString()}</Text>
                
                <View style={styles.statsRow}>
                    <View style={styles.statColumn}>
                        <Text style={styles.statColValue}>{orders.length}</Text>
                        <Text style={styles.statColLabel}>Total Orders</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statColumn}>
                        <Text style={styles.statColValue}>{pendingCount}</Text>
                        <Text style={styles.statColLabel}>Pending</Text>
                    </View>
                </View>
            </View>
            {/* Segmented Control */}
            <View style={styles.segmentedControl}>
                {(['all', 'pending', 'packed', 'delivered'] as const).map(tab => {
                    const isActive = activeTab === tab;
                    return (
                        <TouchableOpacity
                            key={tab}
                            style={[styles.segmentButton, isActive && styles.segmentActive]}
                            onPress={() => setActiveTab(tab)}
                            activeOpacity={0.8}
                        >
                            <Text style={[styles.segmentText, isActive && styles.segmentTextActive]}>
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
    const renderOrderItem = ({ item }: { item: Order }) => {
        const isPending = item.status === 'pending';
        const isPackaging = item.status === 'packaging';
        const isReady = item.status === 'ready_to_pickup' || item.status === 'packed';
        const statusColor = isPending ? COLORS.error : isPackaging ? COLORS.warning : COLORS.success;
        const statusBg = isPending ? COLORS.errorLight : isPackaging ? COLORS.warningLight : COLORS.successLight;
        
        let displayStatus = item.status.replace(/_/g, ' ').toUpperCase();
        return (
            <View style={styles.receiptCard}>
                {/* Header: ID and Status */}
                <View style={styles.receiptHeader}>
                    <View>
                        <Text style={styles.receiptId}>Order #{item.displayId}</Text>
                        <Text style={styles.receiptCustomer}>{item.userName}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
                        <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
                        <Text style={[styles.statusText, { color: statusColor }]}>
                            {displayStatus}
                        </Text>
                    </View>
                </View>

                {/* Customer Details */}
                <View style={styles.customerDetailsBlock}>
                    <Text style={styles.sectionMiniTitle}>DELIVERY INFO</Text>
                    {!!item.customerMobile && (
                        <TouchableOpacity 
                            style={styles.customerDetailRow}
                            onPress={() => Linking.openURL(`tel:${item.customerMobile}`)}
                            activeOpacity={0.7}
                        >
                            <Icon name="phone-outline" size={16} color={COLORS.primary} />
                            <Text style={[styles.customerDetailText, { color: COLORS.primary, fontWeight: '600' }]}>
                                {item.customerMobile}
                            </Text>
                        </TouchableOpacity>
                    )}
                    {!!item.addressLine && (
                        <View style={styles.customerDetailRow}>
                            <Icon name="map-marker-outline" size={16} color={COLORS.textTertiary} />
                            <Text style={styles.customerDetailText}>
                                {item.addressLine}{item.city ? `, ${item.city}` : ''}{item.pincode ? ` - ${item.pincode}` : ''}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Items List */}
                <View style={styles.itemsBlock}>
                    {item.items.map((i, idx) => (
                        <View key={idx} style={styles.itemLine}>
                            <Text style={styles.itemQty}>{i.quantity}×</Text>
                            <Text style={styles.itemName} numberOfLines={1}>{i.name}</Text>
                            <Text style={styles.itemAmt}>₹{Number(i.subtotal || i.price * i.quantity || 0).toFixed(0)}</Text>
                        </View>
                    ))}
                </View>

                {/* Dashed Divider */}
                <View style={styles.dashedLine} />

                {/* Totals */}
                <View style={styles.totalsBlock}>
                    <View style={styles.totalLine}>
                        <Text style={styles.totalLabel}>Subtotal</Text>
                        <Text style={styles.totalValue}>₹{Number(item.total || 0).toFixed(0)}</Text>
                    </View>
                    {item.redeemDiscount > 0 && (
                        <View style={styles.totalLine}>
                            <Text style={[styles.totalLabel, { color: COLORS.warning }]}>Points Discount</Text>
                            <Text style={[styles.totalValue, { color: COLORS.success }]}>− ₹{Number(item.redeemDiscount || 0).toFixed(0)}</Text>
                        </View>
                    )}
                    <View style={[styles.totalLine, { marginTop: 8, alignItems: 'flex-end' }]}>
                        <Text style={styles.grandTotalLabel}>Total Paid</Text>
                        <Text style={styles.grandTotalValue}>₹{Number(item.finalAmount ?? item.total ?? 0).toFixed(0)}</Text>
                    </View>
                </View>

                {/* Loyalty & Payment Info - Minimal Pills */}
                <View style={styles.infoPillsRow}>
                    <View style={[styles.infoPill, { backgroundColor: COLORS.divider }]}>
                        <Icon name={item.paymentStatus === 'paid' ? 'check' : 'clock'} size={12} color={COLORS.textSecondary} />
                        <Text style={styles.infoPillText}>{item.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}</Text>
                    </View>
                    {item.earnedPoints > 0 && (
                        <View style={[styles.infoPill, { backgroundColor: COLORS.successLight }]}>
                            <Icon name="star" size={12} color={COLORS.success} />
                            <Text style={[styles.infoPillText, { color: COLORS.success }]}>+{item.earnedPoints} pts</Text>
                        </View>
                    )}
                    {item.redeemedPoints > 0 && (
                        <View style={[styles.infoPill, { backgroundColor: COLORS.warningLight }]}>
                            <Icon name="star-outline" size={12} color={COLORS.warning} />
                            <Text style={[styles.infoPillText, { color: COLORS.warning }]}>-{item.redeemedPoints} pts</Text>
                        </View>
                    )}
                </View>

                {/* Actions */}
                {isPending && (
                    <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => updateOrderStatus(item, 'packaging', `Order #${item.displayId} is now packaging.`)}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.actionButtonText}>Mark as Packaging</Text>
                        <Icon name="package-variant" size={18} color={COLORS.surface} />
                    </TouchableOpacity>
                )}
                
                {isPackaging && (
                    <TouchableOpacity 
                        style={[styles.actionButton, { backgroundColor: COLORS.warning }]}
                        onPress={() => updateOrderStatus(item, 'ready_for_pickup', `Order #${item.displayId} is ready to picked.`)}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.actionButtonText}>Ready to Picked</Text>
                        <Icon name="check-circle-outline" size={18} color={COLORS.surface} />
                    </TouchableOpacity>
                )}
                
                {isReady && (
                    <View style={[styles.actionButton, { backgroundColor: '#F1F5F9' }]}>
                        <Text style={[styles.actionButtonText, { color: '#64748B' }]}>Waiting for Delivery Partner</Text>
                        <Icon name="moped" size={18} color="#64748B" />
                    </View>
                )}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
            
            <FlatList
                data={filteredOrders}
                keyExtractor={item => item.id}
                renderItem={renderOrderItem}
                ListHeaderComponent={renderHeader}
                contentContainerStyle={styles.listContent}
                onRefresh={handleRefresh}
                refreshing={refreshing}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    !loading ? (
                        <View style={styles.emptyState}>
                            <Icon name="text-box-search-outline" size={48} color={COLORS.textTertiary} />
                            <Text style={styles.emptyStateTitle}>No orders found</Text>
                            <Text style={styles.emptyStateSub}>When you receive orders, they will appear here.</Text>
                        </View>
                    ) : null
                }
            />

            {loading && orders.length === 0 && (
                <View style={styles.centerLoading}>
                    <ActivityIndicator size="large" color={COLORS.textPrimary} />
                </View>
            )}

            {/* Bottom Sheet style Modal for Delivery */}
            <Modal visible={showPointsModal} transparent animationType="slide">
                <View style={styles.modalBackdrop}>
                    <View style={styles.bottomSheet}>
                        <View style={styles.sheetHandle} />
                        
                        <View style={styles.sheetHeader}>
                            <Text style={styles.sheetTitle}>Complete Order</Text>
                            <TouchableOpacity onPress={() => setShowPointsModal(false)} style={styles.closeButton}>
                                <Icon name="close" size={24} color={COLORS.textPrimary} />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.sheetSub}>You are marking order #{selectedOrder?.displayId} as completed.</Text>
                        
                        <View style={styles.pointsRewardCard}>
                            <Icon name="star-face" size={32} color={COLORS.warning} />
                            <View style={styles.pointsRewardInfo}>
                                <Text style={styles.pointsRewardLabel}>Loyalty Points to Award</Text>
                                <Text style={styles.pointsRewardValue}>
                                    {Number(pointsToAssign) > 0 ? `+${pointsToAssign} pts` : 'No points (below min)'}
                                </Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={[styles.confirmButton, isAssigning && { opacity: 0.7 }]}
                            onPress={submitPoints}
                            disabled={isAssigning}
                            activeOpacity={0.9}
                        >
                            {isAssigning ? (
                                <ActivityIndicator size="small" color={COLORS.surface} />
                            ) : (
                                <Text style={styles.confirmButtonText}>Confirm Completion</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    centerLoading: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(244, 246, 248, 0.8)' },
    
    listContent: { paddingBottom: 40 },
    
    // Header & Stats
    headerContainer: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 4 },
    headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    greetingText: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '500', marginBottom: 2 },
    shopTitle: { fontSize: 24, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: -0.5 },
    iconButton: { width: 38, height: 38, borderRadius: 19, backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
    notificationDot: { position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.warning, borderWidth: 1, borderColor: COLORS.surface },

    revenueCard: {
        backgroundColor: COLORS.surface,
        borderRadius: 20,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#1E293B',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.04,
        shadowRadius: 16,
        elevation: 2,
    },
    revenueLabel: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '600', marginBottom: 4 },
    revenueValue: { fontSize: 32, fontWeight: '900', color: COLORS.textPrimary, letterSpacing: -1, marginBottom: 16 },
    
    statsRow: { flexDirection: 'row', alignItems: 'center' },
    statColumn: { flex: 1 },
    statColValue: { fontSize: 18, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 2 },
    statColLabel: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '500' },
    statDivider: { width: 1, height: 32, backgroundColor: COLORS.divider, marginHorizontal: 20 },

    // Segmented Control
    segmentedControl: {
        flexDirection: 'row',
        backgroundColor: COLORS.surface,
        padding: 4,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    segmentButton: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8 },
    segmentActive: { backgroundColor: COLORS.primary, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 2 },
    segmentText: { fontSize: 14, fontWeight: '600', color: COLORS.textSecondary },
    segmentTextActive: { color: COLORS.surface },

    // Empty State
    emptyState: { padding: 40, alignItems: 'center', marginTop: 40 },
    emptyStateTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary, marginTop: 16, marginBottom: 8 },
    emptyStateSub: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 20 },

    // Receipt Card (Order Card)
    receiptCard: {
        backgroundColor: COLORS.surface,
        marginHorizontal: 20,
        marginBottom: 16,
        borderRadius: 24,
        padding: 20,
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.05,
        shadowRadius: 16,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    receiptHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
    receiptId: { fontSize: 18, fontWeight: '900', color: COLORS.textPrimary, marginBottom: 4 },
    receiptCustomer: { fontSize: 14, color: COLORS.textSecondary, fontWeight: '700' },
    
    customerDetailsBlock: {
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        padding: 14,
        marginBottom: 16,
        gap: 6,
    },
    sectionMiniTitle: {
        fontSize: 10,
        fontWeight: '800',
        color: '#94A3B8',
        letterSpacing: 1,
        marginBottom: 4,
    },
    customerDetailRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    customerDetailText: {
        fontSize: 13,
        color: COLORS.textSecondary,
        marginLeft: 8,
        flex: 1,
        lineHeight: 18,
    },

    statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, gap: 6 },
    statusDot: { width: 6, height: 6, borderRadius: 3 },
    statusText: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },

    itemsBlock: { marginBottom: 16 },
    itemLine: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10, gap: 12 },
    itemQty: { fontSize: 14, fontWeight: '700', color: COLORS.textTertiary, width: 24 },
    itemName: { flex: 1, fontSize: 14, fontWeight: '500', color: COLORS.textPrimary, lineHeight: 20 },
    itemAmt: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },

    dashedLine: { height: 1, width: '100%', borderColor: COLORS.divider, borderWidth: 1, borderStyle: 'dashed', borderRadius: 1, marginBottom: 16 },

    totalsBlock: { marginBottom: 16 },
    totalLine: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
    totalLabel: { fontSize: 14, color: COLORS.textSecondary, fontWeight: '500' },
    totalValue: { fontSize: 14, color: COLORS.textPrimary, fontWeight: '600' },
    grandTotalLabel: { fontSize: 16, fontWeight: '800', color: COLORS.textPrimary },
    grandTotalValue: { fontSize: 20, fontWeight: '900', color: COLORS.textPrimary },

    infoPillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
    infoPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, gap: 4 },
    infoPillText: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary },

    actionButton: {
        backgroundColor: COLORS.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 16,
        gap: 8,
    },
    actionButtonText: { color: COLORS.surface, fontSize: 16, fontWeight: '700' },

    // Bottom Sheet Modal
    modalBackdrop: { flex: 1, backgroundColor: 'rgba(17, 24, 39, 0.4)', justifyContent: 'flex-end' },
    bottomSheet: {
        backgroundColor: COLORS.surface,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 20,
        paddingBottom: 24,
    },
    sheetHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: COLORS.divider, alignSelf: 'center', marginBottom: 16 },
    sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    sheetTitle: { fontSize: 20, fontWeight: '800', color: COLORS.textPrimary },
    closeButton: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.divider, justifyContent: 'center', alignItems: 'center' },
    sheetSub: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 20, lineHeight: 20 },

    pointsRewardCard: {
        flexDirection: 'row', alignItems: 'center', gap: 12,
        backgroundColor: COLORS.warningLight, padding: 16, borderRadius: 16, marginBottom: 20,
    },
    pointsRewardInfo: { flex: 1 },
    pointsRewardLabel: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '600', marginBottom: 2 },
    pointsRewardValue: { fontSize: 16, fontWeight: '800', color: COLORS.textPrimary },

    confirmButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 14,
        borderRadius: 16,
        alignItems: 'center',
    },
    confirmButtonText: { color: COLORS.surface, fontSize: 15, fontWeight: '700' },
});

export default ShopOwnerDashboardScreen;
