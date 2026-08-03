import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    TextInput,
    Alert,
    KeyboardAvoidingView,
    Platform,
    RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ENDPOINTS } from '../utils/apiConfig';
import { useAlert } from '../context/AlertContext';

const ProfileScreen = ({ navigation }: any) => {
    const { t, i18n } = useTranslation();
    const { showAlert } = useAlert();
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState({
        name: t('profile.default_name') || 'Service User',
        phone: '',
        email: '',
        location: ''
    });
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isGuest, setIsGuest] = useState(false);

    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchProfileData = async () => {
        setLoading(true);
        try {
            const sessionStr = await AsyncStorage.getItem('userSession');
            if (sessionStr) {
                setIsGuest(false);
                const session = JSON.parse(sessionStr);
                const sessionUser = session.user || {};
                
                setUserData(prev => ({
                    ...prev,
                    name: sessionUser.full_name || sessionUser.fullName || sessionUser.name || prev.name,
                    phone: sessionUser.mobile || sessionUser.phoneNumber || session.phoneNumber || prev.phone,
                    email: sessionUser.email || prev.email,
                    location: sessionUser.location || prev.location
                }));
            } else {
                setIsGuest(true);
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchProfileData();
        setRefreshing(false);
    };

    const toggleLanguage = async () => {
        const languages = ['en', 'ta', 'th'];
        const currentIndex = languages.indexOf(i18n.language);
        const nextIndex = (currentIndex + 1) % languages.length;
        const newLang = languages[nextIndex];
        
        await i18n.changeLanguage(newLang);
        try {
            await AsyncStorage.setItem('user-language', newLang);
        } catch (error) {
            console.error('Error saving language preference:', error);
        }
    };

    const MENU_ITEMS = [
        {
            id: '7',
            title: t('profile.my_orders') || 'My Orders',
            subtitle: 'View your food and service orders',
            icon: 'shopping-outline',
            color: '#FF5200',
            bg: '#FFF0E6',
            onPress: () => navigation.navigate('Bookings')
        },
        {
            id: '6',
            title: t('profile.language'),
            subtitle: i18n.language === 'en' ? 'English' : i18n.language === 'ta' ? 'தமிழ்' : 'Thanglish',
            icon: 'translate',
            color: '#F43F5E',
            bg: '#FFF1F2',
            onPress: () => navigation.navigate('LanguageSelection')
        },
        {
            id: '5',
            title: t('profile.help_support'),
            icon: 'help-circle-outline',
            color: '#64748B',
            bg: '#F1F5F9',
            onPress: () => navigation.navigate('HelpSupport')
        },
    ];

    const handleSave = () => {
        setIsEditing(false);
        showAlert(t('settings.profile_updated'), t('settings.profile_saved'));
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                    stickyHeaderIndices={[0]}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={['#3B82F6']}
                            tintColor="#3B82F6"
                        />
                    }
                >
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>{t('profile.title')}</Text>
                    </View>

                    {/* Profile Header Card */}
                    <View style={styles.profileCard}>
                        {isGuest ? (
                            <View style={styles.guestInfo}>
                                <View style={styles.avatarContainer}>
                                    <Icon name="account-outline" size={40} color="#FFFFFF" />
                                </View>
                                <View style={styles.profileInfo}>
                                    <Text style={styles.name}>{t('profile.guest_user') || 'Guest User'}</Text>
                                    <Text style={styles.infoText}>{t('profile.login_to_access') || 'Login to access all features'}</Text>
                                </View>
                                <TouchableOpacity 
                                    style={styles.cornerLoginButton}
                                    onPress={() => navigation.navigate('Login')}
                                >
                                    <Text style={styles.loginButtonText}>{t('profile.login') || 'Login'}</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <>
                                <View style={styles.avatarContainer}>
                                    <Text style={styles.avatarText}>{userData.name[0]}</Text>
                                    {isEditing && (
                                        <View style={styles.cameraIcon}>
                                            <Icon name="camera" size={14} color="#FFFFFF" />
                                        </View>
                                    )}
                                </View>

                                {!isEditing ? (
                                    <>
                                        <View style={styles.profileInfo}>
                                            <Text style={styles.name}>{userData.name}</Text>
                                            <View style={styles.infoRow}>
                                                <Icon name="phone-outline" size={14} color="#64748B" />
                                                <Text style={styles.infoText}>{userData.phone}</Text>
                                            </View>
                                            <View style={styles.infoRow}>
                                                <Icon name="email-outline" size={14} color="#64748B" />
                                                <Text style={styles.infoText}>{userData.email}</Text>
                                            </View>
                                        </View>
                                        <TouchableOpacity
                                            style={styles.cornerEditButton}
                                            onPress={() => setIsEditing(true)}
                                        >
                                            <Icon name="pencil-outline" size={20} color="#3B82F6" />
                                        </TouchableOpacity>
                                    </>
                                ) : (
                                    <View style={styles.editForm}>
                                        <View style={styles.editFormHeader}>
                                            <Text style={styles.editFormTitle}>{t('profile.update_info')}</Text>
                                            <TouchableOpacity onPress={() => setIsEditing(false)}>
                                                <Icon name="close" size={20} color="#64748B" />
                                            </TouchableOpacity>
                                        </View>
                                        <TextInput
                                            style={styles.input}
                                            value={userData.name}
                                            onChangeText={(text) => setUserData({ ...userData, name: text })}
                                            placeholder={t('profile.name_label')}
                                        />
                                        <TextInput
                                            style={styles.input}
                                            value={userData.phone}
                                            onChangeText={(text) => setUserData({ ...userData, phone: text })}
                                            placeholder={t('profile.phone_label')}
                                            keyboardType="phone-pad"
                                        />
                                        <TextInput
                                            style={styles.input}
                                            value={userData.email}
                                            onChangeText={(text) => setUserData({ ...userData, email: text })}
                                            placeholder={t('profile.email_label')}
                                            keyboardType="email-address"
                                        />
                                        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                                            <Text style={styles.saveButtonText}>{t('profile.save_changes')}</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </>
                        )}
                    </View>



                    {/* Menu Options */}
                    <View style={styles.menuContainer}>
                        {MENU_ITEMS.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.menuItem}
                                onPress={item.onPress}
                            >
                                <View style={[styles.menuIconContainer, { backgroundColor: item.bg }]}>
                                    <Icon name={item.icon} size={22} color={item.color} />
                                </View>
                                <View style={styles.menuTitleContainer}>
                                    <Text style={styles.menuTitle}>{item.title}</Text>
                                    {item.subtitle && <Text style={styles.menuSubtitle}>{item.subtitle}</Text>}
                                </View>
                                <Icon name="chevron-right" size={20} color="#CBD5E1" />
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Security & Legal */}
                    <View style={styles.menuContainer}>
                        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('PrivacySecurity')}>
                            <View style={[styles.menuIconContainer, { backgroundColor: '#F8FAFC' }]}>
                                <Icon name="shield-check-outline" size={22} color="#64748B" />
                            </View>
                            <Text style={styles.menuTitle}>{t('profile.privacy_security')}</Text>
                            <Icon name="chevron-right" size={20} color="#CBD5E1" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('AboutApp')}>
                            <View style={[styles.menuIconContainer, { backgroundColor: '#F8FAFC' }]}>
                                <Icon name="information-outline" size={22} color="#64748B" />
                            </View>
                            <Text style={styles.menuTitle}>{t('profile.about_app')}</Text>
                            <Icon name="chevron-right" size={20} color="#CBD5E1" />
                        </TouchableOpacity>
                    </View>

                    {/* Logout Button */}
                    {!isGuest && (
                        <TouchableOpacity
                            style={styles.logoutButton}
                            onPress={() => {
                                showAlert(
                                    t('profile.logout_confirm_title'),
                                    t('profile.logout_confirm_msg'),
                                    [
                                        { text: t('profile.cancel'), style: 'cancel' },
                                        {
                                            text: t('profile.logout_confirm_title'),
                                            style: 'destructive',
                                            onPress: async () => {
                                                await AsyncStorage.removeItem('userSession');
                                                const parent = navigation.getParent();
                                                if (parent) {
                                                    parent.reset({ index: 0, routes: [{ name: 'Login' }] });
                                                } else {
                                                    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
                                                }
                                            }
                                        }
                                    ]
                                );
                            }}
                        >
                            <Icon name="logout" size={22} color="#EF4444" />
                            <Text style={styles.logoutText}>{t('profile.logout')}</Text>
                        </TouchableOpacity>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 20,
        backgroundColor: '#FFFFFF',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '900',
        color: '#0F172A',
        letterSpacing: -0.5,
        lineHeight: 38,
        includeFontPadding: false,
    },
    editModeToggle: {
        fontSize: 14,
        fontWeight: '700',
    },
    profileCard: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        marginHorizontal: 16,
        padding: 24,
        borderRadius: 24,
        marginBottom: 20,
        shadowColor: '#64748B',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    guestInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    cornerLoginButton: {
        backgroundColor: '#3B82F6',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
        marginLeft: 'auto',
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 13,
    },
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#3B82F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
        position: 'relative',
    },
    avatarText: {
        fontSize: 32,
        fontWeight: '800',
        color: '#FFFFFF',
        lineHeight: 51,
        includeFontPadding: false,
    },
    cameraIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#1E293B',
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    profileInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    name: {
        fontSize: 20,
        fontWeight: '900',
        color: '#1E293B',
        marginBottom: 6,
        lineHeight: 32,
        includeFontPadding: false,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
        gap: 6,
    },
    infoText: {
        fontSize: 13,
        color: '#64748B',
        fontWeight: '500',
        lineHeight: 21,
        includeFontPadding: false,
    },
    editForm: {
        flex: 1,
        gap: 10,
    },
    input: {
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 13,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        color: '#1E293B',
        minHeight: 44,
        lineHeight: 21,
        includeFontPadding: false,
    },
    saveButton: {
        backgroundColor: '#3B82F6',
        paddingVertical: 10,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 4,
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 13,
        lineHeight: 21,
        includeFontPadding: false,
    },
    cornerEditButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    editFormHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    editFormTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: '#64748B',
        textTransform: 'uppercase',
        letterSpacing: 1,
        lineHeight: 21,
        includeFontPadding: false,
    },

    menuContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        marginHorizontal: 16,
        marginBottom: 16,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
    },
    menuIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    menuTitleContainer: {
        flex: 1,
    },
    menuTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#334155',
        lineHeight: 22,
        includeFontPadding: false,
    },
    menuSubtitle: {
        fontSize: 11,
        color: '#94A3B8',
        fontWeight: '600',
        marginTop: 2,
        lineHeight: 18,
        includeFontPadding: false,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FEF2F2',
        marginHorizontal: 16,
        marginTop: 8,
        paddingVertical: 16,
        borderRadius: 24,
        gap: 10,
        borderWidth: 1,
        borderColor: '#FEE2E2',
    },
    logoutText: {
        color: '#EF4444',
        fontWeight: '800',
        fontSize: 14,
        lineHeight: 22,
        includeFontPadding: false,
    },
    footer: {
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 20,
    },
    versionText: {
        fontSize: 12,
        color: '#94A3B8',
        fontWeight: '600',
        marginBottom: 4,
    },
});

export default ProfileScreen;
