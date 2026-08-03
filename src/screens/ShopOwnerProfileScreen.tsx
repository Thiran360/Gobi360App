import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useAlert } from '../context/AlertContext';

const ShopOwnerProfileScreen = () => {
    const navigation = useNavigation<any>();
    const { showAlert } = useAlert();
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const sessionStr = await AsyncStorage.getItem('userSession');
                if (sessionStr) {
                    const session = JSON.parse(sessionStr);
                    // The backend payload returns { user: { full_name, mobile, email, role } }
                    if (session.user) {
                        setUserData(session.user);
                    } else {
                        setUserData(session);
                    }
                }
            } catch (error) {
                console.error("Error reading session:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleLogout = () => {
        showAlert(
            'Logout',
            'Are you sure you want to log out?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        await AsyncStorage.removeItem('userSession');
                        navigation.replace('Login');
                    }
                }
            ]
        );
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#3B82F6" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Profile</Text>
            </View>

            <View style={styles.content}>
                <View style={styles.profileHeader}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{userData?.full_name?.charAt(0) || 'S'}</Text>
                    </View>
                    <Text style={styles.name}>{userData?.full_name || 'Shop Owner'}</Text>
                    <View style={styles.roleBadge}>
                        <Text style={styles.roleText}>{(userData?.role || 'Shopkeeper').toUpperCase()}</Text>
                    </View>
                </View>

                <View style={styles.infoCard}>
                    <View style={styles.infoRow}>
                        <Icon name="phone" size={22} color="#64748B" />
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.infoLabel}>Mobile Number</Text>
                            <Text style={styles.infoValue}>{userData?.mobile || '+91 -'}</Text>
                        </View>
                    </View>
                    
                    <View style={styles.divider} />
                    
                    <View style={styles.infoRow}>
                        <Icon name="email" size={22} color="#64748B" />
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.infoLabel}>Email Address</Text>
                            <Text style={styles.infoValue}>{userData?.email || 'Not provided'}</Text>
                        </View>
                    </View>
                </View>

                <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
                    <Icon name="logout" size={20} color="#EF4444" style={{ marginRight: 8 }} />
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' },
    header: { padding: 24, paddingBottom: 16 },
    headerTitle: { fontSize: 24, fontWeight: '900', color: '#0F172A' },
    content: { padding: 16, flex: 1 },
    profileHeader: { alignItems: 'center', marginBottom: 32 },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#DBEAFE',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 2,
        borderColor: '#BFDBFE',
    },
    avatarText: { fontSize: 32, fontWeight: '900', color: '#3B82F6' },
    name: { fontSize: 22, fontWeight: '900', color: '#0F172A', marginBottom: 8 },
    roleBadge: {
        backgroundColor: '#0066FF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    roleText: { color: '#FFFFFF', fontSize: 11, fontWeight: '800', letterSpacing: 1 },
    
    infoCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 20,
        shadowColor: '#64748B',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.05,
        shadowRadius: 16,
        elevation: 4,
    },
    infoRow: { flexDirection: 'row', alignItems: 'center' },
    infoTextContainer: { marginLeft: 16, flex: 1 },
    infoLabel: { fontSize: 12, color: '#64748B', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
    infoValue: { fontSize: 16, color: '#0F172A', fontWeight: '700', marginTop: 4 },
    divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 16 },
    
    logoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FEF2F2',
        marginTop: 32,
        paddingVertical: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#FECACA',
    },
    logoutText: { color: '#EF4444', fontSize: 16, fontWeight: '800' }
});

export default ShopOwnerProfileScreen;
