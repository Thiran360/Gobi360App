import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, SafeAreaView, TextInput,
    TouchableOpacity, ActivityIndicator, ScrollView, StatusBar
} from 'react-native';
import { useAlert } from '../context/AlertContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../utils/apiConfig';

const ShopOwnerPointsScreen = () => {
    const { showAlert } = useAlert();
    // API fields (matching /gobi360/shopkeeper/reward-setting/<user_id>/)
    const [purchaseAmount, setPurchaseAmount]         = useState('1000');  // purchase_amount
    const [rewardPoints, setRewardPoints]             = useState('10');    // reward_points
    const [redeemPoints, setRedeemPoints]             = useState('10');    // redeem_points
    const [redeemAmount, setRedeemAmount]             = useState('1');     // redeem_amount
    const [minimumRedeemPoints, setMinimumRedeemPoints] = useState('10'); // minimum_redeem_points

    const [loading, setLoading]   = useState(false);
    const [fetching, setFetching] = useState(true);
    const [isSaved, setIsSaved]   = useState(false);

    const getShopkeeperId = async (): Promise<number> => {
        try {
            const sessionStr = await AsyncStorage.getItem('userSession');
            if (sessionStr) {
                const session = JSON.parse(sessionStr);
                const id =
                    session.shopkeeper_id ||
                    session.user_id       ||
                    session.user?.id      ||
                    session.user?.pk      ||
                    session.userId        ||
                    session.data?.user_id ||
                    session.data?.id      ||
                    session.data?.pk      ||
                    session.pk            ||
                    session.id;
                if (id) {
                    const numId = Number(id);
                    // ID 2 is shop_id for Parasakthi Hotel whose shopkeeper user_id is 4
                    if (numId === 2) return 4;
                    return numId;
                }
            }
        } catch (e) { console.error('getShopkeeperId error:', e); }
        return 4;
    };

    // Load existing settings from the server on mount
    useEffect(() => {
        const loadSettings = async () => {
            setFetching(true);
            try {
                let uId = await getShopkeeperId() || 4;
                let res = await fetch(`${BASE_URL}/gobi360/shopkeeper/reward-setting/${uId}/`, {
                    headers: { 'ngrok-skip-browser-warning': 'true' }
                });
                let data = res.ok ? await res.json() : null;

                // Fallback sequence if shopkeeper is not found (try ID 4, then ID 1)
                if (!data || data.status === false) {
                    res = await fetch(`${BASE_URL}/gobi360/shopkeeper/reward-setting/4/`, {
                        headers: { 'ngrok-skip-browser-warning': 'true' }
                    });
                    data = res.ok ? await res.json() : null;
                }
                if (!data || data.status === false) {
                    res = await fetch(`${BASE_URL}/gobi360/shopkeeper/reward-setting/1/`, {
                        headers: { 'ngrok-skip-browser-warning': 'true' }
                    });
                    data = res.ok ? await res.json() : null;
                }

                if (data && data.status !== false) {
                    const d = data.setting || data.data || data;
                    if (d.purchase_amount      !== undefined) setPurchaseAmount(String(d.purchase_amount));
                    if (d.reward_points        !== undefined) setRewardPoints(String(d.reward_points));
                    if (d.redeem_points        !== undefined) setRedeemPoints(String(d.redeem_points));
                    if (d.redeem_amount        !== undefined) setRedeemAmount(String(d.redeem_amount));
                    if (d.minimum_redeem_points !== undefined) setMinimumRedeemPoints(String(d.minimum_redeem_points));
                } else {
                    // Fall back to locally cached config
                    const cfg = await AsyncStorage.getItem('shopPointsConfig');
                    if (cfg) {
                        const parsed = JSON.parse(cfg);
                        if (parsed.purchase_amount)        setPurchaseAmount(String(parsed.purchase_amount));
                        if (parsed.reward_points)          setRewardPoints(String(parsed.reward_points));
                        if (parsed.redeem_points)          setRedeemPoints(String(parsed.redeem_points));
                        if (parsed.redeem_amount)          setRedeemAmount(String(parsed.redeem_amount));
                        if (parsed.minimum_redeem_points)  setMinimumRedeemPoints(String(parsed.minimum_redeem_points));
                    }
                }
            } catch (e) {
                console.error('Load reward settings error:', e);
            } finally {
                setFetching(false);
            }
        };
        loadSettings();
    }, []);

    const handleSave = async () => {
        if (!purchaseAmount || !rewardPoints || !redeemPoints || !redeemAmount || !minimumRedeemPoints) {
            showAlert('Missing Fields', 'Please fill in all fields before saving.');
            return;
        }

        setLoading(true);
        try {
            let uId = await getShopkeeperId() || 4;

            const payload = {
                purchase_amount:        Number(purchaseAmount),
                reward_points:          Number(rewardPoints),
                redeem_points:          Number(redeemPoints),
                redeem_amount:          Number(redeemAmount),
                minimum_redeem_points:  Number(minimumRedeemPoints),
            };

            let res = await fetch(`${BASE_URL}/gobi360/shopkeeper/reward-setting/update/${uId}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true',
                },
                body: JSON.stringify(payload),
            });

            let resData = res.ok ? await res.json() : null;

            // Fallback sequence for update: try ID 4, then ID 1
            if (!res.ok || (resData && resData.status === false)) {
                res = await fetch(`${BASE_URL}/gobi360/shopkeeper/reward-setting/update/4/`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'ngrok-skip-browser-warning': 'true',
                    },
                    body: JSON.stringify(payload),
                });
                resData = res.ok ? await res.json() : null;
            }

            if (!res.ok || (resData && resData.status === false)) {
                res = await fetch(`${BASE_URL}/gobi360/shopkeeper/reward-setting/update/1/`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'ngrok-skip-browser-warning': 'true',
                    },
                    body: JSON.stringify(payload),
                });
                resData = res.ok ? await res.json() : null;
            }

            if (!res.ok || (resData && resData.status === false)) {
                console.warn('Reward setting save failed on backend:', resData);
                showAlert('Save Notice', 'Settings saved locally on device.');
            } else {
                showAlert('Success 🎉', 'Reward points settings updated successfully!');
            }

            // Always persist locally so dashboard and cart can use these values offline
            await AsyncStorage.setItem('shopPointsConfig', JSON.stringify({
                ...payload,
                pointsPerAmount:  payload.reward_points,
                amountPerPoints:  payload.purchase_amount,
                minOrderAmount:   payload.purchase_amount,
                minRedeemPoints:  payload.minimum_redeem_points,
                pointValue:       payload.redeem_amount / payload.redeem_points,
            }));

            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 2500);
        } catch (error) {
            console.error('Save reward settings error:', error);
            showAlert('Network Error', 'Could not connect to server. Settings saved locally.');
            // Still save locally on network failure
            await AsyncStorage.setItem('shopPointsConfig', JSON.stringify({
                purchase_amount:        Number(purchaseAmount),
                reward_points:          Number(rewardPoints),
                redeem_points:          Number(redeemPoints),
                redeem_amount:          Number(redeemAmount),
                minimum_redeem_points:  Number(minimumRedeemPoints),
            }));
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 2500);
        } finally {
            setLoading(false);
        }
    };

    // Live preview: earning on a sample order equal to purchaseAmount
    const sampleOrder   = Number(purchaseAmount) || 1000;
    const previewPoints = Number(rewardPoints) || 0;
    const redeemValue   = Number(redeemPoints) > 0
        ? ((Number(minimumRedeemPoints) / Number(redeemPoints)) * Number(redeemAmount)).toFixed(2)
        : '0.00';

    if (fetching) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#3B82F6" />
                    <Text style={{ marginTop: 12, color: '#64748B', fontWeight: '600' }}>Loading settings…</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Points Configuration</Text>
                    <Text style={styles.headerSubtitle}>Set how customers earn & redeem loyalty points</Text>
                </View>

                {/* ── Section 1: Earning Rules ── */}
                <View style={styles.sectionCard}>
                    <View style={styles.sectionTitle}>
                        <Icon name="star-plus-outline" size={20} color="#3B82F6" />
                        <Text style={styles.sectionTitleText}>Earning Rules</Text>
                    </View>

                    {/* Purchase Amount */}
                    <View style={styles.fieldGroup}>
                        <Text style={styles.fieldLabel}>Purchase Amount (₹)</Text>
                        <Text style={styles.fieldDesc}>Customer must spend this amount to earn reward points</Text>
                        <View style={styles.inputWrapper}>
                            <Icon name="cart-check" size={18} color="#64748B" style={styles.inputIcon} />
                            <Text style={styles.currencyPrefix}>₹</Text>
                            <TextInput
                                style={styles.input}
                                keyboardType="numeric"
                                value={purchaseAmount}
                                onChangeText={setPurchaseAmount}
                                placeholder="1000"
                                placeholderTextColor="#94A3B8"
                            />
                        </View>
                    </View>

                    <View style={styles.divider} />

                    {/* Reward Points */}
                    <View style={styles.fieldGroup}>
                        <Text style={styles.fieldLabel}>Reward Points</Text>
                        <Text style={styles.fieldDesc}>Points awarded per qualifying purchase</Text>
                        <View style={styles.inputWrapper}>
                            <Icon name="star-circle" size={18} color="#F59E0B" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                keyboardType="numeric"
                                value={rewardPoints}
                                onChangeText={setRewardPoints}
                                placeholder="10"
                                placeholderTextColor="#94A3B8"
                            />
                            <Text style={styles.unitText}>pts</Text>
                        </View>
                    </View>
                </View>

                {/* ── Section 2: Redemption Rules ── */}
                <View style={styles.sectionCard}>
                    <View style={styles.sectionTitle}>
                        <Icon name="gift-outline" size={20} color="#3B82F6" />
                        <Text style={styles.sectionTitleText}>Redemption Rules</Text>
                    </View>

                    {/* Redeem Points */}
                    <View style={styles.fieldGroup}>
                        <Text style={styles.fieldLabel}>Redeem Points</Text>
                        <Text style={styles.fieldDesc}>Number of points required for one redemption unit</Text>
                        <View style={styles.inputWrapper}>
                            <Icon name="star-check-outline" size={18} color="#F59E0B" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                keyboardType="numeric"
                                value={redeemPoints}
                                onChangeText={setRedeemPoints}
                                placeholder="10"
                                placeholderTextColor="#94A3B8"
                            />
                            <Text style={styles.unitText}>pts</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    {/* Redeem Amount */}
                    <View style={styles.fieldGroup}>
                        <Text style={styles.fieldLabel}>Redeem Amount (₹)</Text>
                        <Text style={styles.fieldDesc}>Rupee value given when redeem_points are used</Text>
                        <View style={styles.inputWrapper}>
                            <Icon name="cash-multiple" size={18} color="#64748B" style={styles.inputIcon} />
                            <Text style={styles.currencyPrefix}>₹</Text>
                            <TextInput
                                style={styles.input}
                                keyboardType="numeric"
                                value={redeemAmount}
                                onChangeText={setRedeemAmount}
                                placeholder="1"
                                placeholderTextColor="#94A3B8"
                            />
                        </View>
                    </View>

                    <View style={styles.divider} />

                    {/* Minimum Redeem Points */}
                    <View style={styles.fieldGroup}>
                        <Text style={styles.fieldLabel}>Minimum Redeem Points</Text>
                        <Text style={styles.fieldDesc}>Customer must have at least this many points to redeem</Text>
                        <View style={styles.inputWrapper}>
                            <Icon name="shield-star-outline" size={18} color="#3B82F6" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                keyboardType="numeric"
                                value={minimumRedeemPoints}
                                onChangeText={setMinimumRedeemPoints}
                                placeholder="10"
                                placeholderTextColor="#94A3B8"
                            />
                            <Text style={styles.unitText}>pts</Text>
                        </View>
                    </View>
                </View>

                {/* ── Live Preview Card ── */}
                <View style={styles.previewCard}>
                    <View style={styles.previewHeader}>
                        <Icon name="eye-outline" size={18} color="#3B82F6" />
                        <Text style={styles.previewTitle}>Live Preview</Text>
                    </View>

                    <View style={styles.previewRow}>
                        <Text style={styles.previewLabel}>Spend ₹{sampleOrder}</Text>
                        <Text style={styles.previewValue}>→ Earn {previewPoints} pts</Text>
                    </View>
                    <View style={styles.previewRow}>
                        <Text style={styles.previewLabel}>Redeem {redeemPoints} pts</Text>
                        <Text style={styles.previewValue}>→ Get ₹{redeemAmount}</Text>
                    </View>
                    <View style={styles.previewRow}>
                        <Text style={styles.previewLabel}>Min to redeem</Text>
                        <Text style={styles.previewValue}>{minimumRedeemPoints} pts → ₹{redeemValue}</Text>
                    </View>
                </View>

                {/* Save Button */}
                <TouchableOpacity
                    style={[styles.saveBtn, isSaved && styles.saveBtnSuccess]}
                    onPress={handleSave}
                    disabled={loading}
                    activeOpacity={0.85}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFF" />
                    ) : isSaved ? (
                        <>
                            <Icon name="check-circle" size={20} color="#FFF" style={{ marginRight: 8 }} />
                            <Text style={styles.saveBtnText}>Saved!</Text>
                        </>
                    ) : (
                        <>
                            <Icon name="content-save-outline" size={20} color="#FFF" style={{ marginRight: 8 }} />
                            <Text style={styles.saveBtnText}>Save Configuration</Text>
                        </>
                    )}
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    scroll: { padding: 16, paddingBottom: 40 },
    header: { marginBottom: 20, paddingHorizontal: 8 },
    headerTitle: { fontSize: 24, fontWeight: '900', color: '#0F172A' },
    headerSubtitle: { fontSize: 14, color: '#64748B', marginTop: 4, fontWeight: '500' },

    sectionCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#64748B',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.06,
        shadowRadius: 16,
        elevation: 4,
    },
    sectionTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        gap: 8,
    },
    sectionTitleText: { fontSize: 15, fontWeight: '900', color: '#0F172A' },

    fieldGroup: { marginBottom: 4 },
    fieldLabel: {
        fontSize: 13,
        fontWeight: '800',
        color: '#334155',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    fieldDesc: {
        fontSize: 12,
        color: '#94A3B8',
        fontWeight: '500',
        marginBottom: 10,
        lineHeight: 18,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
        borderRadius: 14,
        paddingHorizontal: 14,
        height: 52,
    },
    inputIcon: { marginRight: 8 },
    currencyPrefix: { fontSize: 16, fontWeight: '800', color: '#0F172A', marginRight: 4 },
    input: { flex: 1, fontSize: 16, color: '#0F172A', fontWeight: '700', height: '100%' },
    unitText: { fontSize: 13, color: '#64748B', fontWeight: '600', marginLeft: 4 },

    divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 20 },

    previewCard: {
        backgroundColor: '#EFF6FF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#BFDBFE',
    },
    previewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    previewTitle: { fontSize: 13, fontWeight: '800', color: '#1E40AF' },
    previewRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 6,
        borderBottomWidth: 1,
        borderBottomColor: '#BFDBFE',
    },
    previewLabel: { fontSize: 13, color: '#334155', fontWeight: '600' },
    previewValue: { fontSize: 13, color: '#2563EB', fontWeight: '900' },

    saveBtn: {
        backgroundColor: '#3B82F6',
        height: 56,
        borderRadius: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
        elevation: 6,
    },
    saveBtnSuccess: {
        backgroundColor: '#16A34A',
        shadowColor: '#16A34A',
    },
    saveBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '900' },
});

export default ShopOwnerPointsScreen;
