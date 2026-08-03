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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';
import { useAlert } from '../context/AlertContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ENDPOINTS } from '../utils/apiConfig';

type RootStackParamList = {
    LanguageSelection: undefined;
    Login: undefined;
    UserSignup: undefined;
    UserMainTabs: undefined;
    TermsAndConditions: undefined;
    AdminDashboard: undefined;
};

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'UserSignup'>;
};

const { width, height } = Dimensions.get('window');

const UserSignupScreen = ({ navigation }: Props) => {
    const { t } = useTranslation();
    const { showAlert } = useAlert();
    const [name, setName] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSignup = async () => {
        if (!name.trim() || !mobileNumber.trim() || !email.trim() || !password.trim()) {
            showAlert(t('auth_alerts.missing_info'), t('auth.create_account_msg'));
            return;
        }

        const mobileRegex = /^[6-9]\d{9}$/;
        if (!mobileRegex.test(mobileNumber.trim())) {
            showAlert(t('auth_alerts.error') || 'Invalid Mobile', 'Please enter a valid 10-digit mobile number.');
            return;
        }

        if (password.length < 6) {
            showAlert(t('auth.short_password_title'), t('auth.short_password_msg'));
            return;
        }

        if (!confirmPassword.trim()) {
            showAlert(t('auth_alerts.missing_info'), t('auth.create_account_msg'));
            return;
        }

        if (password !== confirmPassword) {
            showAlert(t('auth.password_mismatch_title'), t('auth.password_mismatch_msg'));
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(ENDPOINTS.signup, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true',
                },
                body: JSON.stringify({
                    full_name: name,
                    mobile: mobileNumber,
                    email: email,
                    password: password,
                    confirm_password: confirmPassword,
                    role: 'customer',
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Auto-login the user by hitting the login endpoint to get full profile data
                try {
                    const loginResponse = await fetch(ENDPOINTS.login, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'ngrok-skip-browser-warning': 'true',
                        },
                        body: JSON.stringify({
                            mobile: mobileNumber.trim(),
                            password: password.trim(),
                            role: 'customer'
                        }),
                    });
                    
                    const loginData = await loginResponse.json();
                    
                    if (loginResponse.ok && !loginData.error) {
                        const actualRole = loginData?.user?.role || 'customer';
                        await AsyncStorage.setItem('userSession', JSON.stringify({
                            phoneNumber: mobileNumber,
                            role: actualRole,
                            ...loginData,
                        }));
                    } else {
                        // Fallback if auto-login fails
                        await AsyncStorage.setItem('userSession', JSON.stringify({
                            phoneNumber: mobileNumber,
                            role: 'customer',
                            ...data,
                        }));
                    }
                } catch (e) {
                    // Silent fallback
                    await AsyncStorage.setItem('userSession', JSON.stringify({
                        phoneNumber: mobileNumber,
                        role: 'customer',
                        ...data,
                    }));
                }

                const termsAccepted = await AsyncStorage.getItem('termsAccepted');

                showAlert(t('auth.signup_success_title'), t('auth.signup_success_msg'), [
                    { 
                        text: "OK", 
                        onPress: () => {
                            navigation.replace(termsAccepted === 'true' ? 'UserMainTabs' : 'TermsAndConditions');
                        } 
                    }
                ]);
            } else {
                showAlert(t('auth.signup_failed_title'), data.message || t('auth.signup_failed_msg'));
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

            {/* Premium Background Elements */}
            <View style={styles.backgroundContainer}>
                <View style={[styles.circle, styles.circleTop]} />
                <View style={[styles.circle, styles.circleBottom]} />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.7}
                >
                    <View style={styles.backBtnCircle}>
                        <Icon name="arrow-left" size={24} color="#0F172A" />
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
                            <Text style={styles.mainTitle}>{t('auth.signup_title')}</Text>
                            <Text style={styles.mainSubtitle}>{t('auth.signup_subtitle')}</Text>
                        </View>

                        <View style={styles.formCard}>
                            <View style={styles.fieldGroup}>
                                <Text style={styles.fieldLabel}>{t('auth.full_name_label')}</Text>
                                <View style={styles.inputWrapper}>
                                    <Icon name="account-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.textInput}
                                        placeholder={t('auth.full_name_placeholder')}
                                        placeholderTextColor="#CBD5E1"
                                        value={name}
                                        onChangeText={setName}
                                        autoCapitalize="words"
                                    />
                                </View>
                            </View>

                            <View style={styles.fieldGroup}>
                                <Text style={styles.fieldLabel}>{t('auth.mobile_number_label')}</Text>
                                <View style={styles.inputWrapper}>
                                    <Icon name="phone-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.textInput}
                                        placeholder={t('auth.mobile_number_placeholder')}
                                        placeholderTextColor="#CBD5E1"
                                        value={mobileNumber}
                                        onChangeText={setMobileNumber}
                                        keyboardType="phone-pad"
                                    />
                                </View>
                            </View>

                            <View style={styles.fieldGroup}>
                                <Text style={styles.fieldLabel}>{t('auth.email_label')}</Text>
                                <View style={styles.inputWrapper}>
                                    <Icon name="email-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.textInput}
                                        placeholder={t('auth.email_placeholder')}
                                        placeholderTextColor="#CBD5E1"
                                        value={email}
                                        onChangeText={setEmail}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                    />
                                </View>
                            </View>

                             <View style={styles.fieldGroup}>
                                 <Text style={styles.fieldLabel}>{t('auth.password_label')}</Text>
                                 <View style={styles.inputWrapper}>
                                     <Icon name="lock-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
                                     <TextInput
                                         style={styles.textInput}
                                         placeholder={t('auth.password_placeholder')}
                                         placeholderTextColor="#CBD5E1"
                                         value={password}
                                         onChangeText={setPassword}
                                         secureTextEntry={!showPassword}
                                     />
                                     <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                                         <Icon name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#94A3B8" />
                                     </TouchableOpacity>
                                 </View>
                             </View>

                             <View style={styles.fieldGroup}>
                                 <Text style={styles.fieldLabel}>{t('auth.confirm_password_label')}</Text>
                                 <View style={styles.inputWrapper}>
                                     <Icon name="lock-check-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
                                     <TextInput
                                         style={styles.textInput}
                                         placeholder={t('auth.confirm_password_placeholder')}
                                         placeholderTextColor="#CBD5E1"
                                         value={confirmPassword}
                                         onChangeText={setConfirmPassword}
                                         secureTextEntry={!showConfirmPassword}
                                     />
                                     <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
                                         <Icon name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#94A3B8" />
                                     </TouchableOpacity>
                                 </View>
                             </View>

                            <TouchableOpacity
                                style={styles.mainBtn}
                                onPress={handleSignup}
                                activeOpacity={0.8}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#FFFFFF" />
                                ) : (
                                    <>
                                        <Text style={styles.mainBtnText}>{t('auth.create_account')}</Text>
                                        <Icon name="arrow-right" size={20} color="#FFFFFF" />
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>

                        <View style={styles.footerRegion}>
                            <View style={styles.loginPrompt}>
                                <Text style={styles.promptText}>{t('auth.already_have_account')}</Text>
                                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                    <Text style={styles.loginLink}>{t('auth.sign_in')}</Text>
                                </TouchableOpacity>
                            </View>
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
        backgroundColor: '#F8FAFC',
    },
    backgroundContainer: {
        ...StyleSheet.absoluteFillObject,
    },
    circle: {
        position: 'absolute',
        width: width * 1.2,
        height: width * 1.2,
        borderRadius: width * 0.6,
        backgroundColor: '#EFF6FF',
        opacity: 0.8,
    },
    circleTop: {
        top: -width * 0.5,
        right: -width * 0.3,
    },
    circleBottom: {
        bottom: -width * 0.4,
        left: -width * 0.4,
        backgroundColor: '#DBEAFE',
    },
    keyboardView: {
        flex: 1,
    },
    backBtn: {
        padding: 16,
        position: 'absolute',
        top: Platform.OS === 'android' ? 12 : 8,
        left: 8,
        zIndex: 10,
    },
    backBtnCircle: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#1E293B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 3,
    },
    scrollContent: {
        flexGrow: 1,
    },
    content: {
        flexGrow: 1,
        paddingHorizontal: width * 0.08,
        paddingTop: height * 0.12,
        paddingBottom: 40,
    },
    header: {
        marginBottom: 32,
    },
    mainTitle: {
        fontSize: 34,
        fontWeight: '900',
        color: '#0F172A',
        letterSpacing: -1.5,
        marginBottom: 12,
        lineHeight: 54,
        includeFontPadding: false,
    },
    mainSubtitle: {
        fontSize: 15,
        color: '#64748B',
        lineHeight: 24,
        fontWeight: '500',
        includeFontPadding: false,
    },
    formCard: {
        gap: 20,
    },
    fieldGroup: {
        gap: 8,
    },
    fieldLabel: {
        fontSize: 13,
        fontWeight: '800',
        color: '#334155',
        marginLeft: 4,
        lineHeight: 21,
        includeFontPadding: false,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        minHeight: 60,
        borderRadius: 18,
        paddingHorizontal: 16,
        borderWidth: 1.5,
        borderColor: '#F1F5F9',
        shadowColor: '#1E293B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
        elevation: 2,
    },
    inputIcon: {
        marginRight: 12,
    },
    eyeIcon: {
        padding: 4,
    },
    textInput: {
        flex: 1,
        fontSize: 15,
        color: '#0F172A',
        fontWeight: '600',
        lineHeight: 24,
        includeFontPadding: false,
    },
    mainBtn: {
        backgroundColor: '#3B82F6',
        minHeight: 60,
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 12,
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 15,
        elevation: 6,
        gap: 10,
        paddingVertical: 12,
    },
    mainBtnText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '900',
        lineHeight: 26,
        includeFontPadding: false,
    },
    footerRegion: {
        marginTop: 40,
    },
    loginPrompt: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    promptText: {
        color: '#64748B',
        fontSize: 14,
        fontWeight: '500',
        lineHeight: 22,
        includeFontPadding: false,
    },
    loginLink: {
        color: '#3B82F6',
        fontSize: 14,
        fontWeight: '800',
        lineHeight: 22,
        includeFontPadding: false,
    },
});

export default UserSignupScreen;

