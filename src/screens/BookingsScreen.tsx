import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Modal, ScrollView, ActivityIndicator, Platform, RefreshControl, Linking } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../utils/apiConfig';
const getStatusConfig = (status: string) => {
    switch(status.toLowerCase()) {
        case 'cancelled': return { bg: '#FEE2E2', text: '#EF4444', label: 'CANCELLED' };
        case 'completed': 
        case 'delivered': return { bg: '#DCFCE7', text: '#10B981', label: 'DELIVERED' };
        case 'packaging':
        case 'packed': return { bg: '#FEF3C7', text: '#D97706', label: 'PACKED' };
        default: return { bg: '#FFEDD5', text: '#F97316', label: status.toUpperCase() };
    }
};

const BookingsScreen = () => {
    const navigation = useNavigation();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Upcoming'); // Upcoming or History
    const [products, setProducts] = useState<any>({}); // Map of id -> name
    
    // Order Detail Modal State
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [detailsLoading, setDetailsLoading] = useState(false);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            let userId = 1; // Default fallback
            const sessionStr = await AsyncStorage.getItem('userSession');
            if (sessionStr) {
                const session = JSON.parse(sessionStr);
                if (session.user && session.user.id) {
                    userId = session.user.id;
                } else if (session.id) {
                    userId = session.id;
                }
            }

            const response = await fetch(`${BASE_URL}/gobi360/orders/${userId}/`);
            if (response.ok) {
                const data = await response.json();
                if (data && data.orders) {
                    setOrders(data.orders);
                }
            } else {
                console.error('Failed to fetch orders:', await response.text());
            }
        } catch (error) {
            console.error('Fetch orders error:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await fetch(`${BASE_URL}/gobi360/products/`);
            if (response.ok) {
                const data = await response.json();
                if (Array.isArray(data)) {
                    const prodMap: any = {};
                    data.forEach(p => { prodMap[p.id] = p.name; });
                    setProducts(prodMap);
                }
            }
        } catch (error) {
            console.error('Fetch products error:', error);
        }
    };

    const [refreshing, setRefreshing] = useState(false);

    useFocusEffect(
        useCallback(() => {
            fetchOrders();
            fetchProducts();

            // Auto-refresh orders every 5 seconds
            const intervalId = setInterval(() => {
                fetchOrders();
            }, 5000);

            return () => clearInterval(intervalId);
        }, [])
    );

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchOrders();
        await fetchProducts();
        setRefreshing(false);
    };

    const handleCancelOrder = async (orderId: number) => {
        Alert.alert('Cancel Order', 'Are you sure you want to cancel this order?', [
            { text: 'No' },
            { text: 'Yes, Cancel', style: 'destructive', onPress: async () => {
                try {
                    let userId = 1;
                    const sessionStr = await AsyncStorage.getItem('userSession');
                    if (sessionStr) {
                        const session = JSON.parse(sessionStr);
                        if (session.user && session.user.id) {
                            userId = session.user.id;
                        } else if (session.id) {
                            userId = session.id;
                        }
                    }

                    const response = await fetch(`${BASE_URL}/gobi360/order/cancel/`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ order_id: orderId, user_id: userId })
                    });
                    
                    const responseText = await response.text();
                    try {
                        const data = JSON.parse(responseText);
                        if (response.ok && data.status !== false) {
                            Alert.alert('Success', 'Order cancelled successfully');
                            fetchOrders();
                        } else {
                            Alert.alert('Error', data.message || 'Failed to cancel order');
                        }
                    } catch (e) {
                        if (response.ok) {
                            Alert.alert('Success', 'Order cancelled successfully');
                            fetchOrders();
                        } else {
                            Alert.alert('Error', 'Failed to cancel order');
                        }
                    }
                } catch (error) {
                    console.error('Cancel order error:', error);
                }
            }}
        ]);
    };

    const handleViewOrder = async (orderId: number) => {
        setModalVisible(true);
        setDetailsLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/gobi360/order/${orderId}/`);
            if (response.ok) {
                const data = await response.json();
                if (data && data.order) {
                    setSelectedOrder(data.order);
                }
            }
        } catch (error) {
            console.error('Fetch order detail error:', error);
        } finally {
            setDetailsLoading(false);
        }
    };

    const filteredOrders = orders.filter(order => {
        if (activeTab === 'Upcoming') {
            return order.status === 'pending' || order.status === 'processing' || order.status === 'packed' || order.status === 'packaging';
        } else {
            return order.status !== 'pending' && order.status !== 'processing' && order.status !== 'packed' && order.status !== 'packaging';
        }
    });

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, marginBottom: 16 }}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12, padding: 4 }}>
                        <Icon name="arrow-left" size={28} color="#0F172A" />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { paddingHorizontal: 0, marginBottom: 0 }]}>My Orders</Text>
                </View>
                <View style={styles.tabContainer}>
                    <TouchableOpacity 
                        style={[styles.tab, activeTab === 'Upcoming' && styles.activeTab]}
                        onPress={() => setActiveTab('Upcoming')}
                        activeOpacity={0.8}
                    >
                        <Text style={activeTab === 'Upcoming' ? styles.activeTabText : styles.inactiveTabText}>Active</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.tab, activeTab === 'History' && styles.activeTab]}
                        onPress={() => setActiveTab('History')}
                        activeOpacity={0.8}
                    >
                        <Text style={activeTab === 'History' ? styles.activeTabText : styles.inactiveTabText}>Past Orders</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {loading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#FF5200" />
                </View>
            ) : filteredOrders.length === 0 ? (
                <View style={styles.centerContainer}>
                    <Icon name="food-off-outline" size={64} color="#CBD5E1" style={{ marginBottom: 16 }} />
                    <Text style={styles.emptyText}>No {activeTab.toLowerCase()} orders found.</Text>
                </View>
            ) : (
                <FlatList
                    contentContainerStyle={styles.listContainer}
                    data={filteredOrders}
                    keyExtractor={(item) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#FF5200']} />
                    }
                    renderItem={({ item }) => {
                        const statusCfg = getStatusConfig(item.status);

                        return (
                        <TouchableOpacity style={styles.card} onPress={() => handleViewOrder(item.id)} activeOpacity={0.95}>
                            <View style={styles.cardHeader}>
                                <View style={styles.serviceInfo}>
                                    <View style={styles.iconContainer}>
                                        <Icon name="silverware-fork-knife" size={24} color="#FF5200" />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.serviceTitle} numberOfLines={1}>
                                            {item.items && item.items.length > 0 
                                                ? (products[item.items[0].product] || `Order #${item.id}`) 
                                                : `Order #${item.id}`}
                                            {item.items && item.items.length > 1 && (
                                                <Text style={{color: '#94A3B8', fontSize: 13, fontWeight: '500'}}> + {item.items.length - 1} more</Text>
                                            )}
                                        </Text>
                                        <Text style={styles.serviceDate}>{formatDate(item.created_at)}</Text>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.divider} />

                            <View style={styles.cardFooter}>
                                <View style={styles.priceContainer}>
                                    <Text style={styles.priceLabel}>Total amount</Text>
                                    <Text style={styles.price}>₹{item.total_amount || '0.00'}</Text>
                                </View>
                                
                                <View style={{ alignItems: 'flex-end', gap: 10 }}>
                                    <View style={[styles.statusBadge, { backgroundColor: statusCfg.bg }]}>
                                        <View style={[styles.statusDot, { backgroundColor: statusCfg.text }]} />
                                        <Text style={[styles.statusText, { color: statusCfg.text }]}>{statusCfg.label}</Text>
                                    </View>

                                    {item.status === 'pending' && (
                                        <TouchableOpacity 
                                            style={styles.cancelBtn}
                                            activeOpacity={0.8}
                                            onPress={(e) => {
                                                e.stopPropagation();
                                                handleCancelOrder(item.id);
                                            }}
                                        >
                                            <Text style={styles.cancelBtnText}>Cancel Order</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}}
                />
            )}

            {/* Order Details Modal */}
            <Modal visible={modalVisible} transparent={true} animationType="fade" onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Order Summary</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                                <Icon name="close-circle" size={28} color="#94A3B8" />
                            </TouchableOpacity>
                        </View>
                        
                        {detailsLoading ? (
                            <View style={{padding: 40, alignItems: 'center', height: 300, justifyContent: 'center'}}>
                                <ActivityIndicator size="large" color="#FF5200" />
                            </View>
                        ) : selectedOrder ? (
                            <ScrollView style={{padding: 24}} showsVerticalScrollIndicator={false}>
                                <View style={styles.detailHeaderCard}>
                                    <View style={styles.orderDetailRow}>
                                        <Text style={styles.orderDetailLabel}>Order ID</Text>
                                        <Text style={styles.orderDetailValue}>#{selectedOrder.id}</Text>
                                    </View>
                                    <View style={styles.orderDetailRow}>
                                        <Text style={styles.orderDetailLabel}>Date</Text>
                                        <Text style={styles.orderDetailValue}>{formatDate(selectedOrder.created_at)}</Text>
                                    </View>
                                    <View style={styles.orderDetailRow}>
                                        <Text style={styles.orderDetailLabel}>Status</Text>
                                        <Text style={[styles.orderDetailValue, {color: getStatusConfig(selectedOrder.status).text}]}>
                                            {getStatusConfig(selectedOrder.status).label}
                                        </Text>
                                    </View>
                                </View>

                                {selectedOrder.deliveryman && (
                                    <View style={styles.deliverymanCard}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                                            <Icon name="moped-outline" size={24} color="#FF5200" />
                                            <Text style={styles.deliverymanTitle}>Delivery Partner</Text>
                                        </View>
                                        <View style={styles.deliverymanDetails}>
                                            <View>
                                                <Text style={styles.deliverymanName}>{selectedOrder.deliveryman.name}</Text>
                                                <Text style={styles.deliverymanMobile}>{selectedOrder.deliveryman.mobile}</Text>
                                            </View>
                                            <TouchableOpacity 
                                                style={styles.callBtn} 
                                                onPress={() => Linking.openURL(`tel:${selectedOrder.deliveryman.mobile}`)}
                                                activeOpacity={0.8}
                                            >
                                                <Icon name="phone" size={20} color="#FFFFFF" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}

                                <Text style={styles.itemsTitle}>Your Items</Text>
                                
                                {selectedOrder.items && selectedOrder.items.map((item: any, idx: number) => {
                                    const productName = products[item.product] || `Item #${item.product}`;
                                    return (
                                    <View key={idx} style={styles.orderItemRow}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, paddingRight: 16 }}>
                                            <View style={styles.qtyBadge}>
                                                <Text style={styles.qtyBadgeText}>{item.quantity}x</Text>
                                            </View>
                                            <Text style={styles.orderItemName} numberOfLines={2}>{productName}</Text>
                                        </View>
                                        <Text style={styles.orderItemPrice}>₹{item.price}</Text>
                                    </View>
                                )})}

                                {(!selectedOrder.items || selectedOrder.items.length === 0) && (
                                    <Text style={{color: '#94A3B8', fontStyle: 'italic', marginTop: 10, textAlign: 'center'}}>No items found.</Text>
                                )}
                                
                                <View style={styles.billDivider} />
                                
                                <View style={[styles.orderDetailRow, { marginTop: 10 }]}>
                                    <Text style={[styles.orderDetailLabel, { fontSize: 16, color: '#1E293B', fontWeight: 'bold' }]}>Grand Total</Text>
                                    <Text style={[styles.orderDetailValue, { fontSize: 20, color: '#FF5200', fontWeight: '900' }]}>₹{selectedOrder.total_amount || '0.00'}</Text>
                                </View>

                                <View style={{height: 60}} />
                            </ScrollView>
                        ) : null}
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    header: {
        paddingTop: Platform.OS === 'ios' ? 20 : 40,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
        elevation: 3,
        zIndex: 10,
    },
    headerTitle: {
        fontSize: 26,
        fontWeight: '900',
        color: '#0F172A',
        paddingHorizontal: 24,
        marginBottom: 16,
    },
    tabContainer: {
        flexDirection: 'row',
        paddingHorizontal: 24,
        paddingBottom: 16,
        gap: 12,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 12,
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    activeTab: {
        backgroundColor: '#FF5200',
        borderColor: '#FF5200',
    },
    activeTabText: {
        color: '#FFFFFF',
        fontWeight: '800',
        fontSize: 14,
    },
    inactiveTabText: {
        color: '#64748B',
        fontWeight: '700',
        fontSize: 14,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    emptyText: {
        color: '#94A3B8',
        fontSize: 16,
        fontWeight: '600',
    },
    listContainer: {
        padding: 16,
        gap: 16,
        paddingBottom: 40,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 18,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 12,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    serviceInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        flex: 1,
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 14,
        backgroundColor: '#FFF4ED',
        justifyContent: 'center',
        alignItems: 'center',
    },
    serviceTitle: {
        fontSize: 17,
        fontWeight: '800',
        color: '#1E293B',
        marginBottom: 4,
    },
    serviceDate: {
        fontSize: 13,
        color: '#64748B',
        fontWeight: '600',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
        gap: 6,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    statusText: {
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    statusUpcoming: { backgroundColor: '#FFF4ED' },
    statusUpcomingText: { color: '#FF5200' },
    statusCompleted: { backgroundColor: '#ECFDF5' },
    statusCompletedText: { color: '#10B981' },
    statusCancelled: { backgroundColor: '#FEF2F2' },
    statusCancelledText: { color: '#EF4444' },
    divider: {
        height: 1,
        backgroundColor: '#F1F5F9',
        marginVertical: 16,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    priceContainer: {},
    priceLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#64748B',
        marginBottom: 4,
    },
    price: {
        fontSize: 20,
        fontWeight: '900',
        color: '#1E293B',
    },
    cancelBtn: {
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#FECDD3',
        backgroundColor: '#FFF1F2',
    },
    cancelBtnText: {
        color: '#E11D48',
        fontSize: 12,
        fontWeight: '800',
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 28,
        width: '100%',
        maxHeight: '85%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: '#0F172A',
    },
    closeButton: {
        padding: 4,
    },
    detailHeaderCard: {
        backgroundColor: '#F8FAFC',
        padding: 20,
        borderRadius: 20,
        marginBottom: 24,
        gap: 12,
    },
    orderDetailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    orderDetailLabel: {
        color: '#64748B',
        fontSize: 14,
        fontWeight: '600',
    },
    orderDetailValue: {
        color: '#1E293B',
        fontSize: 15,
        fontWeight: '800',
    },
    itemsTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#0F172A',
        marginBottom: 16,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    
    // Deliveryman Card Styles
    deliverymanCard: {
        backgroundColor: '#FFF7ED',
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#FFEDD5',
    },
    deliverymanTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#9A3412',
        marginLeft: 8,
    },
    deliverymanDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 12,
        borderRadius: 12,
    },
    deliverymanName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: 4,
    },
    deliverymanMobile: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748B',
    },
    callBtn: {
        backgroundColor: '#10B981',
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    orderItemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    qtyBadge: {
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        marginRight: 12,
    },
    qtyBadgeText: {
        fontSize: 13,
        fontWeight: '800',
        color: '#475569',
    },
    orderItemName: {
        color: '#1E293B',
        fontSize: 15,
        fontWeight: '600',
        flex: 1,
    },
    orderItemPrice: {
        color: '#0F172A',
        fontSize: 16,
        fontWeight: '800',
    },
    billDivider: {
        height: 1,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#CBD5E1',
        marginVertical: 20,
        borderRadius: 1, // Required on Android for dashed borders
    }
});

export default BookingsScreen;
