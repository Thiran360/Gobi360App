import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, StatusBar, ActivityIndicator, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ENDPOINTS } from '../utils/apiConfig';
import { useAlert } from '../context/AlertContext';

const getPointsData = (data: any): { available: number; earned: number; redeemed: number; minRedeem: number; redeemPointsRatio: number; redeemAmountRatio: number; expertName?: string } => {
    let obj = data;
    if (Array.isArray(data) && data.length > 0) obj = data[0];
    else if (data && typeof data === 'object' && !data.available_points && !data.earned_points && (data.data || data.setting || (typeof data.reward_points === 'object' && data.reward_points !== null))) {
        obj = data.data || data.setting || data.reward_points;
    }

    if (!obj || typeof obj !== 'object') {
        const num = typeof obj === 'number' ? obj : (parseFloat(obj) || 0);
        return { available: num, earned: num, redeemed: 0, minRedeem: 1, redeemPointsRatio: 1, redeemAmountRatio: 1 };
    }

    const earned = Number(obj.earned_points ?? obj.total_points ?? obj.available_points ?? 0);
    const redeemed = Number(obj.redeemed_points ?? 0);
    const available = obj.available_points !== undefined ? Number(obj.available_points) : Math.max(0, earned - redeemed);
    const minRedeem = Number(obj.minimum_redeem_points ?? 1);
    const redeemPointsRatio = Number(obj.redeem_points ?? 1);
    const redeemAmountRatio = Number(obj.redeem_amount ?? 1);
    const expertName = typeof obj.expert === 'string' ? obj.expert : (obj.expert?.expert_name || undefined);

    return { available, earned, redeemed, minRedeem, redeemPointsRatio, redeemAmountRatio, expertName };
};

const ServiceCartScreen = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { showAlert } = useAlert();
    const [userId, setUserId] = useState<number | null>(null);
    const [customerOrders, setCustomerOrders] = useState<any[]>([]);
    const [rewardPoints, setRewardPoints] = useState<any>(null);
    const [loadingData, setLoadingData] = useState(true);

    useFocusEffect(
        useCallback(() => {
            const fetchUserData = async () => {
                try {
                    const sessionData = await AsyncStorage.getItem('userSession');
                    if (sessionData) {
                        const user = JSON.parse(sessionData);
                        const uId = user.user?.id || user.id;
                        if (uId) {
                            setUserId(uId);
                            fetchCustomerOrdersAndPoints(uId);
                            return;
                        }
                    }
                    setLoadingData(false);
                } catch (error) {
                    setLoadingData(false);
                }
            };
            fetchUserData();
        }, [])
    );

    const fetchCustomerOrdersAndPoints = async (uId: number) => {
        try {
            const pointsEndpoint = route.params?.expertId 
                ? ENDPOINTS.customerExpertPoints(uId, route.params.expertId)
                : ENDPOINTS.customerRewardPoints(uId);

            const [ordersRes, pointsRes] = await Promise.all([
                fetch(ENDPOINTS.customerServiceOrders(uId), {
                    headers: { 'Accept': 'application/json', 'User-Agent': 'CustomApp/1.0', 'ngrok-skip-browser-warning': 'true' }
                }),
                fetch(pointsEndpoint, {
                    headers: { 'Accept': 'application/json', 'User-Agent': 'CustomApp/1.0', 'ngrok-skip-browser-warning': 'true' }
                })
            ]);
            
            let ordersList: any[] = [];
            if (ordersRes.ok) {
                const ordersData = await ordersRes.json();
                if (ordersData.service_orders) {
                    ordersList = ordersData.service_orders;
                    setCustomerOrders(ordersList);
                }
            }
            if (pointsRes.ok) {
                const pointsData = await pointsRes.json();
                setRewardPoints(pointsData);
            }
            
            // Explicitly fetch expert specific points if an expert is active or present in pending orders
            const targetExpertId = route.params?.expertId || (ordersList.length > 0 ? ordersList[0].expert?.id : null);
            if (targetExpertId) {
                try {
                    const expertPointsRes = await fetch(ENDPOINTS.customerExpertPoints(uId, targetExpertId), {
                        headers: { 'Accept': 'application/json', 'User-Agent': 'CustomApp/1.0', 'ngrok-skip-browser-warning': 'true' }
                    });
                    if (expertPointsRes.ok) {
                        const expData = await expertPointsRes.json();
                        setRewardPoints(expData);
                    }
                } catch (err) {
                    console.log("Expert points fetch error:", err);
                }
            }
        } catch (error) {
            console.error("Fetch Error:", error);
        } finally {
            setLoadingData(false);
        }
    };

    const handleApplyPoints = (order: any) => {
        if (!userId) return;
        const { available, minRedeem, redeemPointsRatio, redeemAmountRatio } = getPointsData(rewardPoints);

        if (available <= 0) {
            Alert.alert("No Points Available", "You don't have any available reward points earned with this expert to apply on this bill.");
            return;
        }
        if (available < minRedeem) {
            Alert.alert("Minimum Points Required", `You need a minimum of ${minRedeem} reward points to redeem for a discount on this order.`);
            return;
        }

        const possibleDiscount = (available / redeemPointsRatio) * redeemAmountRatio;
        const currentBill = parseFloat(order.final_amount || order.quotation_amount || '0');

        let discountToApply = Math.min(possibleDiscount, currentBill);
        let pointsToUse = Math.ceil((discountToApply / redeemAmountRatio) * redeemPointsRatio);
        
        if (pointsToUse > available) pointsToUse = available;
        const newFinalAmount = Math.max(0, currentBill - discountToApply).toFixed(2);

        showAlert(
            "Apply Reward Points",
            `Do you want to redeem ${pointsToUse} points for a discount of ₹${discountToApply.toFixed(2)} on this bill?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Apply",
                    onPress: async () => {
                        try {
                            setLoadingData(true);
                            const payload = JSON.stringify({
                                customer_id: userId,
                                user_id: userId,
                                use_points: true,
                                points: pointsToUse,
                                redeemed_points: pointsToUse,
                                redeem_discount: discountToApply.toFixed(2),
                                final_amount: newFinalAmount
                            });
                            
                            const res = await fetch(ENDPOINTS.customerServiceOrderRedeemPoints(order.id), {
                                method: 'POST',
                                headers: { 
                                    'Accept': 'application/json', 
                                    'Content-Type': 'application/json',
                                    'User-Agent': 'CustomApp/1.0', 
                                    'ngrok-skip-browser-warning': 'true' 
                                },
                                body: payload
                            });
                            
                            let resData: any = {};
                            try { resData = await res.json(); } catch (e) {}

                            if (res.ok || resData.status === true) {
                                showAlert("Success", resData.message || "Reward points successfully applied!");
                                fetchCustomerOrdersAndPoints(userId);
                            } else {
                                const putRes = await fetch(ENDPOINTS.customerServiceOrderRedeemPoints(order.id), {
                                    method: 'PUT',
                                    headers: { 
                                        'Accept': 'application/json', 
                                        'Content-Type': 'application/json',
                                        'User-Agent': 'CustomApp/1.0', 
                                        'ngrok-skip-browser-warning': 'true' 
                                    },
                                    body: payload
                                });
                                let putData: any = {};
                                try { putData = await putRes.json(); } catch (e) {}

                                if (putRes.ok || putData.status === true) {
                                    showAlert("Success", putData.message || "Reward points successfully applied!");
                                    fetchCustomerOrdersAndPoints(userId);
                                } else {
                                    showAlert("Error", resData.message || putData.message || "Failed to apply reward points. Please try again.");
                                    setLoadingData(false);
                                }
                            }
                        } catch (err) {
                            console.error("Apply Points Error:", err);
                            showAlert("Error", "Something went wrong applying reward points.");
                            setLoadingData(false);
                        }
                    }
                }
            ]
        );
    };

    const handleCheckout = () => {
        // Future booking flow
    };

    const filteredOrders = customerOrders.filter(order => {
        if (route.params?.expertId) {
            return order.expert?.id === route.params.expertId;
        }
        if (route.params?.expertName) {
            return order.expert?.expert_name === route.params.expertName;
        }
        return true;
    });

    const renderEmptyCart = () => {
        if (loadingData) return <ActivityIndicator size="large" color="#3B82F6" style={{ marginTop: 40 }} />;
        if (filteredOrders.length > 0) return null; // Let the orders show
        
        return (
            <View style={styles.emptyContainer}>
                <Icon name="card-account-details-outline" size={80} color="#CBD5E1" />
                <Text style={styles.emptyTitle}>No Pending Bills</Text>
                <Text style={styles.emptySubtext}>You don't have any pending service orders or bills at the moment.</Text>
                <TouchableOpacity style={styles.exploreBtn} onPress={() => navigation.goBack()}>
                    <Text style={styles.exploreBtnText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Icon name="arrow-left" size={24} color="#0F172A" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Service Orders</Text>
                <View style={{ width: 40 }} />
            </View>

            {filteredOrders.length === 0 ? (
                renderEmptyCart()
            ) : (
                <View style={{ flex: 1 }}>
                    <FlatList
                        data={[{ key: 'points' }, { key: 'orders' }]}
                        keyExtractor={(item) => item.key}
                        contentContainerStyle={styles.listContainer}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => {
                            if (item.key === 'points') {
                                const { available, earned, redeemed, expertName } = getPointsData(rewardPoints);
                                const displayName = expertName || route.params?.expertName;
                                const titleText = displayName ? `${displayName} Reward Points` : 'Available Reward Points';

                                return (
                                    <View style={styles.pointsCard}>
                                        <View style={styles.pointsRow}>
                                            <Icon name="star-circle" size={36} color="#F59E0B" />
                                            <View style={{ marginLeft: 12, flex: 1 }}>
                                                <Text style={styles.pointsTitle}>{titleText}</Text>
                                                <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                                                    <Text style={styles.pointsValue}>{available} pts </Text>
                                                    <Text style={styles.pointsAvailableTag}>(Available)</Text>
                                                </View>
                                                
                                                {(earned > 0 || redeemed > 0) && (
                                                    <View style={styles.pointsStatsRow}>
                                                        <Text style={styles.statText}>Total Earned: <Text style={styles.statBold}>{earned} pts</Text></Text>
                                                        <Text style={[styles.statText, { marginLeft: 16 }]}>Redeemed: <Text style={styles.statBold}>{redeemed} pts</Text></Text>
                                                    </View>
                                                )}
                                            </View>
                                        </View>
                                    </View>
                                );
                            }
                            if (item.key === 'orders' && filteredOrders.length > 0) {
                                return (
                                    <>
                                        <Text style={styles.sectionHeader}>Your Service Orders</Text>
                                        {filteredOrders.map((order, index) => (
                                            <View key={order.id || index} style={styles.orderCard}>
                                                <View style={styles.orderHeader}>
                                                    <View style={{ flex: 1, marginRight: 8 }}>
                                                        <Text style={styles.orderService}>{order.service?.service_name || 'Service'}</Text>
                                                        <Text style={styles.orderExpertName}>{order.expert?.expert_name || 'Expert'}</Text>
                                                    </View>
                                                    <View style={{ alignItems: 'flex-end' }}>
                                                        <Text style={[styles.orderStatus, { color: order.status === 'completed' ? '#10B981' : '#F59E0B' }]}>{order.status || 'Pending'}</Text>
                                                        {order.payment_status && (
                                                            <Text style={[styles.paymentStatus, { color: order.payment_status === 'paid' ? '#059669' : '#EF4444' }]}>
                                                                {order.payment_status === 'paid' ? '● Paid' : '● Unpaid'}
                                                            </Text>
                                                        )}
                                                    </View>
                                                </View>
                                                {(order.quotation_description || order.service?.short_description) ? (
                                                    <Text style={styles.orderDesc}>{order.quotation_description || order.service?.short_description}</Text>
                                                ) : null}

                                                {(order.earned_points > 0 || order.redeemed_points > 0) && (
                                                    <View style={styles.pointsBox}>
                                                        {order.earned_points > 0 && (
                                                            <View style={styles.pointsRowItem}>
                                                                <Icon name="star-plus" size={16} color="#10B981" />
                                                                <Text style={styles.earnedPointsText}>Earned: <Text style={{fontWeight: '800'}}>{order.earned_points} pts</Text></Text>
                                                            </View>
                                                        )}
                                                        {order.redeemed_points > 0 && (
                                                            <View style={[styles.pointsRowItem, { marginTop: order.earned_points > 0 ? 4 : 0 }]}>
                                                                <Icon name="star-minus" size={16} color="#F59E0B" />
                                                                <Text style={styles.redeemedPointsText}>Redeemed: <Text style={{fontWeight: '800'}}>{order.redeemed_points} pts</Text> {Number(order.redeem_discount) > 0 ? `(-₹${order.redeem_discount})` : ''}</Text>
                                                            </View>
                                                        )}
                                                    </View>
                                                )}

                                                <View style={styles.orderFooter}>
                                                    <View>
                                                        <Text style={styles.amountLabel}>Total Amount</Text>
                                                        <Text style={styles.orderAmount}>₹{order.final_amount || order.quotation_amount || '0.00'}</Text>
                                                    </View>
                                                    {order.payment_status !== 'paid' && order.status !== 'completed' && (!order.redeemed_points || order.redeemed_points === 0) && (
                                                        <TouchableOpacity style={styles.applyPointsBtn} onPress={() => handleApplyPoints(order)}>
                                                            <Icon name="star" size={16} color="#B45309" style={{ marginRight: 6 }} />
                                                            <Text style={styles.applyPointsBtnText}>Apply Points</Text>
                                                        </TouchableOpacity>
                                                    )}
                                                </View>
                                            </View>
                                        ))}
                                    </>
                                );
                            }
                            return null;
                        }}
                    />
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    backBtn: { padding: 8, marginLeft: -8 },
    headerTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
    clearBtnText: { color: '#EF4444', fontWeight: '600', fontSize: 14 },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyTitle: { fontSize: 20, fontWeight: '800', color: '#334155', marginTop: 24, marginBottom: 12 },
    emptySubtext: { fontSize: 14, color: '#64748B', textAlign: 'center', lineHeight: 22, marginBottom: 32 },
    exploreBtn: {
        backgroundColor: '#3B82F6',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 16,
        elevation: 4,
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    exploreBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
    listContainer: { padding: 20 },
    sectionHeader: { fontSize: 18, fontWeight: '800', color: '#0F172A', marginTop: 16, marginBottom: 12 },
    pointsCard: {
        backgroundColor: '#FFFBEB',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#FDE68A',
        marginBottom: 8,
    },
    pointsRow: { flexDirection: 'row', alignItems: 'flex-start' },
    pointsTitle: { fontSize: 13, fontWeight: '700', color: '#D97706', marginBottom: 2 },
    pointsValue: { fontSize: 22, fontWeight: '900', color: '#B45309' },
    pointsAvailableTag: { fontSize: 13, fontWeight: '700', color: '#B45309' },
    pointsStatsRow: { flexDirection: 'row', marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#FDE68A' },
    statText: { fontSize: 12, color: '#92400E', fontWeight: '600' },
    statBold: { fontWeight: '800', color: '#78350F' },
    orderCard: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    orderHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    orderService: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
    orderExpertName: { fontSize: 13, color: '#64748B', marginTop: 2, fontWeight: '600' },
    orderStatus: { fontSize: 13, fontWeight: '700', textTransform: 'capitalize' },
    paymentStatus: { fontSize: 12, fontWeight: '700', marginTop: 2, textTransform: 'capitalize' },
    orderDesc: { fontSize: 14, color: '#64748B', marginBottom: 12 },
    pointsBox: { backgroundColor: '#F8FAFC', padding: 10, borderRadius: 10, marginBottom: 12, borderWidth: 1, borderColor: '#F1F5F9' },
    pointsRowItem: { flexDirection: 'row', alignItems: 'center' },
    earnedPointsText: { fontSize: 13, color: '#047857', marginLeft: 6 },
    redeemedPointsText: { fontSize: 13, color: '#B45309', marginLeft: 6 },
    orderFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
    amountLabel: { fontSize: 11, color: '#64748B', fontWeight: '600', marginBottom: 2 },
    orderAmount: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
    payBtn: { backgroundColor: '#3B82F6', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
    payBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
    applyPointsBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF3C7', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, marginRight: 8, borderWidth: 1, borderColor: '#FDE68A' },
    applyPointsBtnText: { color: '#B45309', fontWeight: '700', fontSize: 13 }
});

export default ServiceCartScreen;
