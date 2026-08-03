import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, TextInput, ScrollView, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ENDPOINTS } from '../utils/apiConfig';

const ExpertPointsScreen = () => {
    const [expertId, setExpertId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [pointsConfig, setPointsConfig] = useState({
        purchaseAmount: '100',
        rewardPoints: '10',
        redeemPoints: '1',
        redeemAmount: '1',
        minimumRedeemPoints: '5'
    });

    useEffect(() => {
        const init = async () => {
            const sessionData = await AsyncStorage.getItem('userSession');
            if (sessionData) {
                const user = JSON.parse(sessionData);
                const uId = user.user?.id || user.id;
                if (uId) {
                    setExpertId(uId);
                    await fetchRewardSettings(uId);
                }
            }
        };
        init();
    }, []);

    const fetchRewardSettings = async (uId: number) => {
        try {
            const response = await fetch(ENDPOINTS.expertRewardSetting(uId), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'User-Agent': 'CustomApp/1.0',
                    'ngrok-skip-browser-warning': 'true'
                }
            });
            const data = await response.json();
            if (response.ok && data) {
                const setting = data.setting || data;
                setPointsConfig({
                    purchaseAmount: setting.purchase_amount?.toString() || '100',
                    rewardPoints: setting.reward_points?.toString() || '10',
                    redeemPoints: setting.redeem_points?.toString() || '1',
                    redeemAmount: setting.redeem_amount?.toString() || '1',
                    minimumRedeemPoints: setting.minimum_redeem_points?.toString() || '5'
                });
            }
        } catch (error) {
            console.error("Fetch Reward Settings Error:", error);
        }
    };

    const handleSave = async () => {
        if (!expertId) return;
        setLoading(true);
        try {
            const response = await fetch(ENDPOINTS.expertRewardSettingUpdate(expertId), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'User-Agent': 'CustomApp/1.0',
                    'ngrok-skip-browser-warning': 'true'
                },
                body: JSON.stringify({
                    purchase_amount: parseFloat(pointsConfig.purchaseAmount),
                    reward_points: parseInt(pointsConfig.rewardPoints),
                    redeem_points: parseInt(pointsConfig.redeemPoints),
                    redeem_amount: parseFloat(pointsConfig.redeemAmount),
                    minimum_redeem_points: parseInt(pointsConfig.minimumRedeemPoints)
                })
            });
            const data = await response.json();
            if (response.ok) {
                Alert.alert("Success", "Reward points configuration saved successfully!");
            } else {
                Alert.alert("Error", data.message || "Failed to save reward settings.");
            }
        } catch (error) {
            console.error("Save Reward Settings Error:", error);
            Alert.alert("Error", "Could not connect to the server.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Reward Settings</Text>
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.infoCard}>
                    <Icon name="information-outline" size={24} color="#3B82F6" />
                    <Text style={styles.infoText}>Configure how customers earn and redeem points for your services.</Text>
                </View>

                <View style={styles.formCard}>
                    <Text style={styles.sectionTitle}>Earning Rules</Text>
                    
                    <Text style={styles.label}>For every (₹) spent</Text>
                    <TextInput
                        style={styles.input}
                        value={pointsConfig.purchaseAmount}
                        onChangeText={(val) => setPointsConfig({...pointsConfig, purchaseAmount: val})}
                        keyboardType="number-pad"
                    />

                    <Text style={styles.label}>Customer earns (Points)</Text>
                    <TextInput
                        style={styles.input}
                        value={pointsConfig.rewardPoints}
                        onChangeText={(val) => setPointsConfig({...pointsConfig, rewardPoints: val})}
                        keyboardType="number-pad"
                    />

                    <View style={styles.divider} />

                    <Text style={styles.sectionTitle}>Redemption Rules</Text>
                    
                    <Text style={styles.label}>For every (Points) redeemed</Text>
                    <TextInput
                        style={styles.input}
                        value={pointsConfig.redeemPoints}
                        onChangeText={(val) => setPointsConfig({...pointsConfig, redeemPoints: val})}
                        keyboardType="number-pad"
                    />

                    <Text style={styles.label}>Customer gets discount of (₹)</Text>
                    <TextInput
                        style={styles.input}
                        value={pointsConfig.redeemAmount}
                        onChangeText={(val) => setPointsConfig({...pointsConfig, redeemAmount: val})}
                        keyboardType="number-pad"
                    />

                    <Text style={styles.label}>Minimum Points Required to Redeem</Text>
                    <TextInput
                        style={styles.input}
                        value={pointsConfig.minimumRedeemPoints}
                        onChangeText={(val) => setPointsConfig({...pointsConfig, minimumRedeemPoints: val})}
                        keyboardType="number-pad"
                    />

                    <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                        {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.saveBtnText}>Save Configuration</Text>}
                    </TouchableOpacity>
                </View>
                
                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
    header: {
        padding: 20,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#0F172A',
    },
    content: {
        flex: 1,
        padding: 16,
    },
    infoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EFF6FF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#DBEAFE',
    },
    infoText: {
        flex: 1,
        marginLeft: 12,
        color: '#1E3A8A',
        fontSize: 14,
        fontWeight: '600',
        lineHeight: 20,
    },
    formCard: {
        backgroundColor: '#FFFFFF',
        padding: 24,
        borderRadius: 20,
        shadowColor: '#64748B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#0F172A',
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '700',
        color: '#475569',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#F1F5F9',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: '#0F172A',
        fontWeight: '600',
        marginBottom: 20,
    },
    divider: {
        height: 1,
        backgroundColor: '#E2E8F0',
        marginVertical: 10,
        marginBottom: 26,
    },
    saveBtn: {
        backgroundColor: '#3B82F6',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 8,
    },
    saveBtnText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '800',
    }
});

export default ExpertPointsScreen;
