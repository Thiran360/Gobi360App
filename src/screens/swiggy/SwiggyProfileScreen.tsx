import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const SwiggyProfileScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const [userData, setUserData] = useState({ name: 'Guest User', phone: '', location: '' });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const sessionStr = await AsyncStorage.getItem('userSession');
            if (sessionStr) {
                const session = JSON.parse(sessionStr);
                // Data can be flat in session or nested under user depending on login vs signup
                const user = session.user || session; 
                setUserData({
                    name: user.userName || user.full_name || user.fullName || user.name || 'Swiggy User',
                    phone: user.mobile || user.phoneNumber || session.phoneNumber || 'Add Phone',
                    location: user.location || session.location || 'Gobichettipalayam'
                });
            }
        } catch (e) {
            console.error('Failed to fetch profile', e);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-left" size={24} color="#1E293B" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Account</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                
                {/* Profile Banner */}
                <View style={styles.profileCard}>
                    <View style={styles.profileHeader}>
                        <View style={styles.avatarContainer}>
                            <Text style={styles.avatarText}>{userData.name.charAt(0).toUpperCase()}</Text>
                        </View>
                        <View style={styles.profileInfo}>
                            <Text style={styles.nameText}>{userData.name}</Text>
                            <Text style={styles.subText}>{userData.phone}  •  {userData.location}</Text>
                        </View>
                        <TouchableOpacity style={styles.editBtn}>
                            <Text style={styles.editBtnText}>EDIT</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Food Orders</Text>
                </View>

                {/* Options List */}
                <View style={styles.optionsContainer}>
                    <TouchableOpacity 
                        style={styles.optionItem}
                        onPress={() => navigation.navigate('Bookings')}
                    >
                        <View style={[styles.optionIconBox, { backgroundColor: '#FFF0E6' }]}>
                            <Icon name="shopping-outline" size={22} color="#3B82F6" />
                        </View>
                        <View style={styles.optionTextContainer}>
                            <Text style={styles.optionTitle}>Your Orders</Text>
                        </View>
                        <Icon name="chevron-right" size={20} color="#CBD5E1" />
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.optionItem}>
                        <View style={[styles.optionIconBox, { backgroundColor: '#F4E8FF' }]}>
                            <Icon name="heart-outline" size={22} color="#8C31D8" />
                        </View>
                        <View style={styles.optionTextContainer}>
                            <Text style={styles.optionTitle}>Favorite Orders</Text>
                        </View>
                        <Icon name="chevron-right" size={20} color="#CBD5E1" />
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.optionItem}>
                        <View style={[styles.optionIconBox, { backgroundColor: '#E5F0FF' }]}>
                            <Icon name="map-marker-outline" size={22} color="#0052CC" />
                        </View>
                        <View style={styles.optionTextContainer}>
                            <Text style={styles.optionTitle}>Address Book</Text>
                        </View>
                        <Icon name="chevron-right" size={20} color="#CBD5E1" />
                    </TouchableOpacity>
                </View>

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>More</Text>
                </View>

                <View style={styles.optionsContainer}>
                    <TouchableOpacity style={styles.optionItem}>
                        <View style={[styles.optionIconBox, { backgroundColor: '#F1F5F9' }]}>
                            <Icon name="help-circle-outline" size={22} color="#475569" />
                        </View>
                        <View style={styles.optionTextContainer}>
                            <Text style={styles.optionTitle}>Help & Support</Text>
                        </View>
                        <Icon name="chevron-right" size={20} color="#CBD5E1" />
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.optionItem}>
                        <View style={[styles.optionIconBox, { backgroundColor: '#F1F5F9' }]}>
                            <Icon name="cog-outline" size={22} color="#475569" />
                        </View>
                        <View style={styles.optionTextContainer}>
                            <Text style={styles.optionTitle}>Settings</Text>
                        </View>
                        <Icon name="chevron-right" size={20} color="#CBD5E1" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.logoutButton}>
                    <Icon name="logout" size={22} color="#EF4444" />
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFC', // Ultra light grey background
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F8FAFC',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#1E293B',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    profileCard: {
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginTop: 20,
        padding: 20,
        borderRadius: 24,
        shadowColor: '#64748B',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.06,
        shadowRadius: 16,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#F8FAFC',
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#3B82F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    avatarText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: '900',
    },
    profileInfo: {
        flex: 1,
    },
    nameText: {
        fontSize: 20,
        fontWeight: '900',
        color: '#1E293B',
        marginBottom: 4,
    },
    subText: {
        fontSize: 13,
        color: '#64748B',
        fontWeight: '600',
    },
    editBtn: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: '#FFF0E6',
        borderRadius: 12,
    },
    editBtnText: {
        fontSize: 12,
        fontWeight: '800',
        color: '#3B82F6',
    },
    sectionHeader: {
        marginTop: 24,
        marginBottom: 12,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '800',
        color: '#94A3B8',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    optionsContainer: {
        backgroundColor: '#fff',
        marginHorizontal: 16,
        borderRadius: 24,
        paddingHorizontal: 16,
        shadowColor: '#64748B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#F8FAFC',
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F8FAFC',
    },
    optionIconBox: {
        width: 44,
        height: 44,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    optionTextContainer: {
        flex: 1,
    },
    optionTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1E293B',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FEF2F2',
        marginHorizontal: 16,
        marginTop: 32,
        paddingVertical: 16,
        borderRadius: 20,
        gap: 8,
        borderWidth: 1,
        borderColor: '#FEE2E2',
    },
    logoutText: {
        color: '#EF4444',
        fontWeight: '800',
        fontSize: 15,
    }
});

export default SwiggyProfileScreen;
