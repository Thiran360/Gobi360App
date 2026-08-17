import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity, ActivityIndicator, Alert, Vibration } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Sound from 'react-native-sound';
import { BASE_URL } from '../utils/apiConfig';
import { useNavigation } from '@react-navigation/native';

Sound.setCategory('Playback');
const notificationSound = new Sound('notification.mp3', Sound.MAIN_BUNDLE, (error) => {
    if (error) console.log('Failed to load notification sound', error);
});

const DeliverymanOrdersScreen = () => {
    const navigation = useNavigation<any>();
    const [name, setName] = useState('Partner');
    const [deliverymanId, setDeliverymanId] = useState<number | null>(null);
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const previousOrderIdsRef = useRef<number[]>([]);

    useEffect(() => {
        const loadUser = async () => {
            const session = await AsyncStorage.getItem('userSession');
            if (session) {
                const parsed = JSON.parse(session);
                const userObj = parsed.user || {};
                const fullName = userObj.full_name || parsed.full_name || '';
                if (fullName) {
                    setName(fullName.split(' ')[0]);
                }
                const dId = userObj.id || parsed.id || null;
                setDeliverymanId(dId);
                if (dId) {
                    fetchOrders(dId);
                } else {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };
        loadUser();
    }, []);

    // Auto-refresh orders in the background every 15 seconds
    useEffect(() => {
        let intervalId: any;
        if (deliverymanId) {
            intervalId = setInterval(() => {
                fetchOrders(deliverymanId, true);
            }, 5000);
        }
        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [deliverymanId]);

    const fetchOrders = async (dId: number, isBackground = false) => {
        try {
            if (!isBackground) setLoading(true);
            // Use the actual deliveryman available-orders endpoint
            const res = await fetch(`${BASE_URL}/gobi360/deliveryman/available-orders/${dId}/`, {
                headers: { 'ngrok-skip-browser-warning': 'true' }
            });
            if (res.ok) {
                const data = await res.json();
                let fetchedOrders = data.orders || data.data || data || [];

                if (Array.isArray(fetchedOrders)) {
                    // Attach root shop name to each order if available
                    if (data.shop) {
                        fetchedOrders = fetchedOrders.map(o => ({ ...o, shop_name: data.shop }));
                    }

                    // Show orders that are ready to pick up, or already out for delivery
                    const activeOrders = fetchedOrders.filter((o: any) =>
                        o.status === 'ready_for_pickup' ||
                        o.status === 'ready_to_pickup' ||
                        o.status === 'packed' ||
                        o.status === 'assigned' ||
                        o.status === 'out_for_delivery'
                    );

                    const currentOrderIds = activeOrders.map((o: any) => o.order_id || o.id);
                    let hasNewOrder = false;
                    const prevIds = Array.isArray(previousOrderIdsRef.current) ? previousOrderIdsRef.current : [];
                    currentOrderIds.forEach((id: any) => {
                        if (!prevIds.includes(id)) {
                            hasNewOrder = true;
                        }
                    });

                    if (isBackground && hasNewOrder) {
                        Vibration.vibrate(1000);
                        notificationSound.play();
                    }
                    previousOrderIdsRef.current = currentOrderIds;

                    setOrders(activeOrders);
                } else {
                    setOrders([]);
                }
            }
        } catch (error) {
            console.error('Error fetching delivery orders', error);
        } finally {
            if (!isBackground) setLoading(false);
        }
    };

    const handleRefresh = async () => {
        if (!deliverymanId) return;
        setRefreshing(true);
        await fetchOrders(deliverymanId);
        setRefreshing(false);
    };

    const updateOrderStatus = async (orderId: string | number, status: string, successMessage: string) => {
        if (!deliverymanId) return;
        try {
            const payload = {
                order_id: orderId,
                status: status
            };
            // Use the actual endpoint provided by the user
            const res = await fetch(`http://api.codingboss.in/gobi360/deliveryman/update-order-status/${deliverymanId}/`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                Alert.alert('Success', successMessage);
                fetchOrders(deliverymanId);
            } else {
                Alert.alert('Error', `Failed to update order to ${status}`);
            }
        } catch (error) {
            console.error('Error updating order status', error);
            Alert.alert('Error', 'An error occurred while updating status');
        }
    };

    const acceptDelivery = async (orderId: string | number) => {
        if (!deliverymanId) return;
        try {
            const payload = {
                user_id: deliverymanId
            };
            // Using the exact ngrok URL provided by the user for accepting delivery
            const res = await fetch(`http://api.codingboss.in/gobi360/deliveryman/accept-delivery/${orderId}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                Alert.alert('Success', 'Order successfully picked up!');
                fetchOrders(deliverymanId);
            } else {
                Alert.alert('Error', 'Failed to pick up order.');
            }
        } catch (error) {
            console.error('Error accepting delivery', error);
            Alert.alert('Error', 'An error occurred while picking up order.');
        }
    };

    const renderOrderItem = ({ item }: { item: any }) => {
        const isReady = item.status === 'ready_for_pickup' || item.status === 'ready_to_pickup' || item.status === 'packed' || item.status === 'assigned';
        const isOut = item.status === 'out_for_delivery';

        return (
            <View style={styles.orderCard}>
                <View style={styles.orderHeader}>
                    <View>
                        <Text style={styles.orderId}>Order #{item.order_id || item.id}</Text>
                        <Text style={styles.orderDate}>{new Date(item.created_at || Date.now()).toLocaleDateString()}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: isReady ? '#DBEAFE' : '#FEF3C7' }]}>
                        <Text style={[styles.statusText, { color: isReady ? '#1D4ED8' : '#D97706' }]}>
                            {isReady ? 'Ready for Pickup' : 'Out for Delivery'}
                        </Text>
                    </View>
                </View>

                <View style={styles.orderDetails}>
                    <View style={styles.detailRow}>
                        <Icon name="storefront-outline" size={20} color="#64748B" />
                        <Text style={styles.detailText}>{item.shop?.shop_name || item.shop_name || item.shop || 'Assigned Shop'}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Icon name="account-outline" size={20} color="#64748B" />
                        <Text style={styles.detailText}>{item.address?.full_name || item.customer?.customer_name || item.customer_name || 'Customer'}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Icon name="phone-outline" size={20} color="#64748B" />
                        <Text style={styles.detailText}>{item.address?.mobile || item.customer?.customer_mobile || item.customer_mobile || 'No Contact'}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Icon name="map-marker-outline" size={20} color="#64748B" />
                        <Text style={styles.detailText}>{item.address?.address_line || item.delivery_address || 'Delivery Address'}</Text>
                    </View>
                </View>

                {/* Items & Total */}
                <View style={styles.itemsBlock}>
                    <Text style={styles.sectionMiniTitle}>ORDER DETAILS</Text>
                    {item.products && item.products.length > 0 ? (
                        item.products.map((prod: any, idx: number) => (
                            <View key={idx} style={styles.itemRow}>
                                <Text style={styles.itemQty}>{prod.quantity || prod.qty || 1}×</Text>
                                <Text style={styles.itemName} numberOfLines={1}>{prod.product_name || prod.name || prod.product?.name || 'Item'}</Text>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.noItemsText}>Items not listed</Text>
                    )}

                    <View style={styles.dashedDivider} />

                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total Amount</Text>
                        <Text style={styles.totalValue}>₹{item.total_amount || 0}</Text>
                    </View>
                </View>

                {isReady && (
                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: '#F59E0B' }]}
                        onPress={() => acceptDelivery(item.order_id || item.id)}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.actionButtonText}>Picked Up</Text>
                        <Icon name="moped-outline" size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                )}

                {isOut && (
                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: '#10B981' }]}
                        onPress={() => updateOrderStatus(item.order_id || item.id, 'delivered', 'Order marked as delivered!')}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.actionButtonText}>Mark as Delivered</Text>
                        <Icon name="check-circle-outline" size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.greetingText}>Hello, {name} 👋</Text>
                        <Text style={styles.subGreetingText}>Ready for today's deliveries?</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.notificationBell}
                        onPress={() => navigation.navigate('DeliverymanNotifications')}
                    >
                        <Icon name="bell-outline" size={24} color="#1E293B" />
                        <View style={styles.notificationBadge} />
                    </TouchableOpacity>
                </View>
                <View style={styles.statsRow}>
                    <View style={[styles.statCard, { backgroundColor: '#EEF2FF' }]}>
                        <Icon name="package-variant" size={24} color="#6366F1" />
                        <Text style={styles.statNumber}>{orders.length}</Text>
                        <Text style={styles.statLabel}>Pending</Text>
                    </View>
                    <View style={[styles.statCard, { backgroundColor: '#F0FDF4' }]}>
                        <Icon name="check-circle-outline" size={24} color="#10B981" />
                        <Text style={styles.statNumber}>0</Text>
                        <Text style={styles.statLabel}>Completed</Text>
                    </View>
                    <View style={[styles.statCard, { backgroundColor: '#FFF7ED' }]}>
                        <Icon name="clipboard-text-multiple-outline" size={24} color="#F97316" />
                        <Text style={styles.statNumber}>{orders.length}</Text>
                        <Text style={styles.statLabel}>Total Orders</Text>
                    </View>
                </View>
            </View>

            <View style={styles.contentHeader}>
                <Text style={styles.sectionTitle}>Active Orders</Text>
                <Icon name="filter-variant" size={24} color="#64748B" />
            </View>

            {loading ? (
                <View style={styles.centerLoading}>
                    <ActivityIndicator size="large" color="#6366F1" />
                </View>
            ) : (
                <FlatList
                    data={orders}
                    keyExtractor={(item, index) => (item.order_id || item.id)?.toString() || index.toString()}
                    renderItem={renderOrderItem}
                    contentContainerStyle={styles.scrollContent}
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <View style={styles.emptyIconCircle}>
                                <Icon name="moped-outline" size={56} color="#94A3B8" />
                            </View>
                            <Text style={styles.emptyTitle}>No Orders Yet!</Text>
                            <Text style={styles.emptySubText}>When a new delivery order is assigned to you, it will appear right here.</Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC'
    },
    header: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 24,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        elevation: 8,
        shadowColor: '#64748B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        zIndex: 10,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    greetingText: {
        fontSize: 24,
        fontWeight: '800',
        color: '#0F172A',
        marginBottom: 4,
    },
    subGreetingText: {
        fontSize: 14,
        color: '#64748B',
        fontWeight: '500',
    },
    notificationBell: {
        position: 'relative',
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    notificationBadge: {
        position: 'absolute',
        top: 10,
        right: 12,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#EF4444',
        borderWidth: 1.5,
        borderColor: '#F1F5F9',
    },
    statusBadgeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ECFCCB',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ECFCCB',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#65A30D',
        marginRight: 6,
    },
    statusText: {
        color: '#4D7C0F',
        fontSize: 12,
        fontWeight: '700',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    statCard: {
        flex: 1,
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1E293B',
        marginTop: 8,
        marginBottom: 2,
    },
    statLabel: {
        fontSize: 12,
        color: '#64748B',
        fontWeight: '600',
    },
    contentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        marginTop: 24,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#0F172A',
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 60,
    },
    emptyIconCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1E293B',
        marginBottom: 12,
    },
    emptySubText: {
        fontSize: 15,
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: 32,
    },
    centerLoading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    orderCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#64748B',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    orderId: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 4,
    },
    orderDate: {
        fontSize: 12,
        color: '#64748B',
    },
    statusBadgeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ECFCCB',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    statusBadgeText: {
        color: '#4D7C0F',
        fontSize: 12,
        fontWeight: '700',
    },
    orderDetails: {
        backgroundColor: '#F8FAFC',
        padding: 12,
        borderRadius: 12,
        marginBottom: 16,
        gap: 8,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    detailText: {
        fontSize: 14,
        color: '#334155',
        marginLeft: 8,
        flex: 1,
    },

    // Items & Total Styles
    itemsBlock: {
        backgroundColor: '#F8FAFC',
        padding: 12,
        borderRadius: 12,
        marginBottom: 16,
    },
    sectionMiniTitle: {
        fontSize: 10,
        fontWeight: '800',
        color: '#94A3B8',
        letterSpacing: 1,
        marginBottom: 8,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    itemQty: {
        fontSize: 14,
        fontWeight: '700',
        color: '#64748B',
        width: 24,
    },
    itemName: {
        flex: 1,
        fontSize: 14,
        color: '#334155',
        fontWeight: '500',
    },
    noItemsText: {
        fontSize: 13,
        color: '#94A3B8',
        fontStyle: 'italic',
        marginBottom: 8,
    },
    dashedDivider: {
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: '#CBD5E1',
        marginVertical: 10,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: '#475569',
    },
    totalValue: {
        fontSize: 18,
        fontWeight: '800',
        color: '#0F172A',
    },

    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 12,
        gap: 8,
    },
    actionButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '700',
    },
});

export default DeliverymanOrdersScreen;
