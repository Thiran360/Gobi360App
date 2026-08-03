import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ExpertProfileScreen = ({ navigation }: any) => {
    const [expertData, setExpertData] = useState<any>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const sessionData = await AsyncStorage.getItem('userSession');
            if (sessionData) {
                setExpertData(JSON.parse(sessionData));
            }
        };
        fetchUserData();
    }, []);

    const handleLogout = () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Logout", 
                    style: "destructive",
                    onPress: async () => {
                        await AsyncStorage.removeItem('userSession');
                        navigation.replace('Login');
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Expert Profile</Text>
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.profileCard}>
                    <View style={styles.avatarWrap}>
                        <Icon name="account" size={48} color="#3B82F6" />
                    </View>
                    <Text style={styles.nameText}>
                        {expertData?.user?.full_name || expertData?.full_name || expertData?.name || 'Expert Name'}
                    </Text>
                    <Text style={styles.phoneText}>
                        {expertData?.user?.mobile || expertData?.phoneNumber || expertData?.mobile || '+91-XXXXXXXXXX'}
                    </Text>
                    {expertData?.user?.email && (
                        <Text style={[styles.phoneText, { marginTop: -8, marginBottom: 12, fontSize: 13, color: '#94A3B8' }]}>
                            {expertData.user.email}
                        </Text>
                    )}
                    <View style={styles.badgeWrap}>
                        <Icon name="check-decagram" size={16} color="#16A34A" />
                        <Text style={styles.badgeText}>Verified Expert</Text>
                    </View>
                </View>

                <View style={styles.menuGroup}>
                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuIconBg}>
                            <Icon name="account-edit" size={22} color="#475569" />
                        </View>
                        <Text style={styles.menuText}>Edit Profile Details</Text>
                        <Icon name="chevron-right" size={24} color="#CBD5E1" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuIconBg}>
                            <Icon name="shield-lock" size={22} color="#475569" />
                        </View>
                        <Text style={styles.menuText}>Privacy & Security</Text>
                        <Icon name="chevron-right" size={24} color="#CBD5E1" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuIconBg}>
                            <Icon name="help-circle" size={22} color="#475569" />
                        </View>
                        <Text style={styles.menuText}>Help & Support</Text>
                        <Icon name="chevron-right" size={24} color="#CBD5E1" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                    <Icon name="logout" size={22} color="#EF4444" style={{ marginRight: 8 }} />
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>

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
    profileCard: {
        backgroundColor: '#FFFFFF',
        padding: 24,
        borderRadius: 20,
        alignItems: 'center',
        shadowColor: '#64748B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 3,
        marginBottom: 24,
    },
    avatarWrap: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    nameText: {
        fontSize: 20,
        fontWeight: '900',
        color: '#0F172A',
        marginBottom: 4,
    },
    phoneText: {
        fontSize: 15,
        color: '#64748B',
        fontWeight: '600',
        marginBottom: 12,
    },
    badgeWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#DCFCE7',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    badgeText: {
        color: '#16A34A',
        fontSize: 12,
        fontWeight: '700',
        marginLeft: 4,
    },
    menuGroup: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 8,
        shadowColor: '#64748B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 2,
        marginBottom: 24,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 12,
    },
    menuIconBg: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    menuText: {
        flex: 1,
        fontSize: 16,
        fontWeight: '700',
        color: '#1E293B',
    },
    logoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FEF2F2',
        paddingVertical: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#FECACA',
    },
    logoutText: {
        color: '#EF4444',
        fontSize: 16,
        fontWeight: '800',
    }
});

export default ExpertProfileScreen;
