import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    Dimensions,
    ScrollView,
    Alert,
    RefreshControl,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useAlert } from '../context/AlertContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ENDPOINTS } from '../utils/apiConfig';

type RootStackParamList = {
    LanguageSelection: undefined;
    LoginSelection: undefined;
    UserLogin: undefined;
    UserSignup: undefined;
    AdminLogin: undefined;
    UserMainTabs: undefined;
    AdminDashboard: undefined;
    TermsAndConditions: undefined;
    ExpertMainTabs: undefined;
    ShopOwnerMainTabs: undefined;
};

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'UserLogin'>;
};

const { width, height } = Dimensions.get('window');

const UserLoginScreen = ({ navigation }: Props) => {
    const { t } = useTranslation();
    const { showAlert } = useAlert();
    const [mobileNumber, setMobileNumber] = useState('');
    const [password, setPassword] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!mobileNumber.trim() || !password.trim()) {
            showAlert(
                t('auth_alerts.missing_info'),
                t('auth_alerts.enter_user_details'),
                [{ text: "OK" }]
            );
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(ENDPOINTS.login, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true',
                },
                body: JSON.stringify({
                    mobile: mobileNumber,
                    password: password,
                }),
            });

            const data = await response.json();

            if (response.ok && !data.error) {
                const actualRole = data.user?.role || data.role || 'user';
                await AsyncStorage.setItem('userSession', JSON.stringify({
                    phoneNumber: mobileNumber,
                    role: actualRole,
                    userName: data.user?.full_name || data.full_name || data.name || data.username || data?.data?.full_name || data?.data?.name || data?.data?.username || '',
                    ...data 
                }));
                
                if (actualRole === 'expert' || actualRole === 'experts') {
                    navigation.replace('ExpertMainTabs');
                } else if (actualRole === 'shopkeeper' || actualRole === 'shopOwner') {
                    navigation.replace('ShopOwnerMainTabs');
                } else {
                    const termsAccepted = await AsyncStorage.getItem('termsAccepted');
                    if (termsAccepted === 'true') {
                        navigation.replace('UserMainTabs');
                    } else {
                        navigation.replace('TermsAndConditions');
                    }
                }
            } else {
                showAlert(t('auth_alerts.login_failed'), data.error || data.message || t('auth_alerts.invalid_creds'));
            }
        } catch (error) {
            showAlert(t('auth_alerts.error'), t('auth_alerts.network_error')); 
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 2000);
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="dark-content" />

            <View style={styles.topCurve} />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <View style={styles.backButtonCircle}>
                        <Text style={styles.backText}>←</Text>
                    </View>
                </TouchableOpacity>

                <ScrollView 
                    contentContainerStyle={styles.scrollContent} 
                    showsVerticalScrollIndicator={false} 
                    keyboardShouldPersistTaps="handled"
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={['#3B82F6']}
                            tintColor="#3B82F6"
                        />
                    }
                >
                    <View style={styles.content}>
                        <View style={styles.header}>
                            <Text style={styles.title}>{t('auth.user_login_title')}</Text>
                            <Text style={styles.subtitle}>{t('auth.user_login_subtitle')}</Text>
                        </View>

                        <View style={styles.form}>
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>{t('auth.mobile_number_label')}</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder={t('auth.mobile_number_placeholder')}
                                    placeholderTextColor="#94A3B8"
                                    value={mobileNumber}
                                    onChangeText={setMobileNumber}
                                    keyboardType="phone-pad"
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>{t('auth.password_label')}</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder={t('auth.password_placeholder')}
                                    placeholderTextColor="#94A3B8"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                />
                            </View>



                            <TouchableOpacity
                                style={styles.button}
                                onPress={handleLogin}
                                activeOpacity={0.8}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#FFFFFF" />
                                ) : (
                                    <Text style={styles.buttonText}>{t('auth.sign_in')}</Text>
                                )}
                            </TouchableOpacity>
                        </View>

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>{t('auth.dont_have_account')}</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('UserSignup')}>
                                <Text style={styles.signUpText}>{t('auth.sign_up')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    topCurve: {
        position: 'absolute',
        top: -width * 0.6,
        left: -width * 0.2,
        right: -width * 0.2,
        height: width * 1.2,
        borderRadius: width,
        backgroundColor: '#EFF6FF',
    },
    keyboardView: {
        flex: 1,
    },
    backButton: {
        padding: 16,
        position: 'absolute',
        top: Platform.OS === 'android' ? 12 : 8,
        left: 8,
        zIndex: 10,
    },
    backButtonCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    backText: {
        color: '#1E293B',
        fontSize: 18,
        fontWeight: 'bold',
        lineHeight: 29,
        includeFontPadding: false,
    },
    scrollContent: {
        flexGrow: 1,
    },
    content: {
        flexGrow: 1,
        paddingHorizontal: width * 0.08,
        paddingTop: height * 0.15,
        paddingBottom: 24,
    },
    header: {
        marginBottom: height * 0.04,
    },
    title: {
        fontSize: width > 380 ? 32 : 28,
        fontWeight: '800',
        color: '#1E293B',
        marginBottom: 8,
        letterSpacing: -1,
        lineHeight: width > 380 ? 42 : 38,
    },
    subtitle: {
        fontSize: width > 380 ? 15 : 13,
        color: '#64748B',
        lineHeight: width > 380 ? 24 : 21,
        includeFontPadding: false,
    },
    form: {
        gap: 24,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    label: {
        width: 100,
        fontSize: 12,
        fontWeight: '600',
        color: '#475569',
        lineHeight: 18,
    },
    input: {
        flex: 1,
        backgroundColor: '#F8FAFC',
        minHeight: height > 700 ? 48 : 44,
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: width > 380 ? 14 : 13,
        color: '#0F172A',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        lineHeight: width > 380 ? 24 : 21,
    },

    button: {
        backgroundColor: '#3B82F6',
        minHeight: height > 700 ? 52 : 48,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 6,
        paddingVertical: 10,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: width > 380 ? 16 : 15,
        fontWeight: '700',
        lineHeight: width > 380 ? 26 : 24,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 'auto',
        marginBottom: 40,
    },
    footerText: {
        color: '#64748B',
        fontSize: 14,
        lineHeight: 22,
    },
    signUpText: {
        color: '#3B82F6',
        fontSize: 14,
        fontWeight: '700',
        lineHeight: 22,
    },
});

export default UserLoginScreen;
