import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Modal, ScrollView, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../utils/apiConfig';

const BookingsScreen = () => {
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

    useEffect(() => {
        fetchOrders();
        fetchProducts();
    }, []);

    const handleCancelOrder = async (orderId: number) => {
        Alert.alert('Cancel Order', 'Are you sure you want to cancel this order?', [
            { text: 'No' },
            { text: 'Yes, Cancel', style: 'destructive', onPress: async () => {
                try {
                    const response = await fetch(`${BASE_URL}/gobi360/order/cancel/`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ order_id: orderId })
                    });
                    if (response.ok) {
                        Alert.alert('Success', 'Order cancelled successfully');
                        fetchOrders();
                    } else {
                        Alert.alert('Error', 'Failed to cancel order');
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
            return order.status === 'pending' || order.status === 'processing';
        } else {
            return order.status !== 'pending' && order.status !== 'processing';
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
                <Text style={styles.headerTitle}>My Orders</Text>
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
                    renderItem={({ item }) => {
                        const isCompleted = item.status === 'completed' || item.status === 'delivered';
                        const isCancelled = item.status === 'cancelled';
                        const badgeStyle = isCancelled ? styles.statusCancelled : isCompleted ? styles.statusCompleted : styles.statusUpcoming;
                        const badgeTextStyle = isCancelled ? styles.statusCancelledText : isCompleted ? styles.statusCompletedText : styles.statusUpcomingText;

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
                                    <View style={[styles.statusBadge, badgeStyle]}>
                                        <View style={[styles.statusDot, { backgroundColor: badgeTextStyle.color }]} />
                                        <Text style={[styles.statusText, badgeTextStyle]}>{item.status.toUpperCase()}</Text>
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
                                        <Text style={[styles.orderDetailValue, {color: selectedOrder.status === 'cancelled' ? '#EF4444' : '#10B981'}]}>
                                            {selectedOrder.status.toUpperCase()}
                                        </Text>
                                    </View>
                                </View>

                                <Text style={styles.itemsTitle}>Your Items</Text>
                                
                                {selectedOrder.items && selectedOrder.items.map((item: any, idx: number) => {
                                    const productName = products[item.product] || `Item #${item.product}`;
                                    return (
                                    <View key={idx} style={styles.orderItemRow}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <View style={styles.qtyBadge}>
                                                <Text style={styles.qtyBadgeText}>{item.quantity}x</Text>
                                            </View>
                                            <Text style={styles.orderItemName}>{productName}</Text>
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
        height: 2,
        borderStyle: 'dashed',
        backgroundColor: '#E2E8F0',
        marginVertical: 20,
    }
});

export default BookingsScreen;
