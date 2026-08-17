import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const DeliverymanProfileScreen = () => {
    const navigation = useNavigation<any>();
    const [userData, setUserData] = useState({
        name: 'Delivery Partner',
        phone: '',
        id: ''
    });

    useEffect(() => {
        const loadUser = async () => {
            const session = await AsyncStorage.getItem('userSession');
            if (session) {
                const parsed = JSON.parse(session);
                const userObj = parsed.user || {};
                
                setUserData({
                    name: userObj.full_name || parsed.full_name || 'Delivery Partner',
                    phone: userObj.mobile || parsed.mobile || parsed.phoneNumber || '',
                    id: userObj.id ? `DM${userObj.id}` : ''
                });
            }
        };
        loadUser();
    }, []);

    const handleLogout = async () => {
        await AsyncStorage.removeItem('userSession');
        navigation.replace('Login');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Profile</Text>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                
                {/* Profile Identity Card */}
                <View style={styles.profileCard}>
                    <View style={styles.avatarContainer}>
                        <Icon name="account" size={48} color="#3B82F6" />
                        <View style={styles.badgeContainer}>
                            <Icon name="check-decagram" size={18} color="#10B981" />
                        </View>
                    </View>
                    <Text style={styles.nameText}>{userData.name}</Text>
                    <Text style={styles.phoneText}>{userData.phone || 'Unknown Mobile'}</Text>
                    {userData.id ? (
                        <View style={styles.idBadge}>
                            <Text style={styles.idBadgeText}>ID: {userData.id}</Text>
                        </View>
                    ) : null}
                </View>

                {/* Options List */}
                <View style={styles.optionsContainer}>
                    <View style={styles.optionItem}>
                        <View style={styles.optionIconBox}>
                            <Icon name="motorbike" size={24} color="#6366F1" />
                        </View>
                        <View style={styles.optionTexts}>
                            <Text style={styles.optionTitle}>Role</Text>
                            <Text style={styles.optionSub}>Delivery Partner</Text>
                        </View>
                    </View>
                </View>

                {/* Logout Button */}
                <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn} activeOpacity={0.8}>
                    <Icon name="logout" size={22} color="#EF4444" />
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>

                <Text style={styles.versionText}>App Version 1.0.0</Text>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    header: {
        padding: 20,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9'
    },
    headerTitle: { fontSize: 24, fontWeight: '800', color: '#0F172A' },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    profileCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#64748B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
        marginBottom: 24,
    },
    avatarContainer: {
        width: 88,
        height: 88,
        borderRadius: 44,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 3,
        borderColor: '#FFFFFF',
        position: 'relative',
    },
    badgeContainer: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 2,
    },
    nameText: { fontSize: 22, fontWeight: '800', color: '#1E293B', marginBottom: 4 },
    phoneText: { fontSize: 15, color: '#64748B', marginBottom: 12 },
    idBadge: {
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 8,
    },
    idBadgeText: { fontSize: 13, fontWeight: '700', color: '#475569' },
    
    optionsContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 8,
        marginBottom: 24,
        elevation: 2,
        shadowColor: '#64748B',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
    },
    optionIconBox: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#EEF2FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    optionTexts: {
        flex: 1,
    },
    optionTitle: { fontSize: 16, fontWeight: '600', color: '#1E293B' },
    optionSub: { fontSize: 13, color: '#64748B', marginTop: 2 },
    divider: {
        height: 1,
        backgroundColor: '#F1F5F9',
        marginLeft: 72,
        marginRight: 12,
    },
    
    logoutBtn: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#FEF2F2',
        borderWidth: 1,
        borderColor: '#FECDD3',
        padding: 16,
        borderRadius: 16,
        marginBottom: 24,
    },
    logoutText: { color: '#EF4444', fontSize: 16, fontWeight: '800', marginLeft: 8 },
    versionText: { textAlign: 'center', fontSize: 13, color: '#94A3B8', fontWeight: '500' }
});

export default DeliverymanProfileScreen;
