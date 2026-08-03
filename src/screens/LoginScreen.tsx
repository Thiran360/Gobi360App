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
    ActivityIndicator,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAlert } from '../context/AlertContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ENDPOINTS } from '../utils/apiConfig';

type RootStackParamList = {
    LanguageSelection: undefined;
    Login: undefined;
    UserSignup: undefined;
    UserMainTabs: undefined;
    AdminDashboard: undefined;
    ShopOwnerMainTabs: undefined;
    TermsAndConditions: undefined;
    ExpertMainTabs: undefined;
};

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

const { width } = Dimensions.get('window');

const ADMIN_EMAIL = 'thiran360@gmail.com';
const ADMIN_PASSWORD = 'thiran@123';
const ADMIN2_ID = '1234567890';
const ADMIN2_PASSWORD = '123456';

const LoginScreen = ({ navigation }: Props) => {
    const { showAlert } = useAlert();

    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // Hidden admin mode — tap the logo 5 times to unlock
    const [adminMode, setAdminMode] = useState(false);
    const [logoTaps, setLogoTaps] = useState(0);
    const [adminEmail, setAdminEmail] = useState('');
    const [adminCode, setAdminCode] = useState('');
    const [showAdminCode, setShowAdminCode] = useState(false);

    const handleLogoTap = () => {
        const next = logoTaps + 1;
        setLogoTaps(next);
        if (next >= 5) {
            setAdminMode(true);
            setLogoTaps(0);
        }
    };

    const handleAdminLogin = () => {
        if (!adminEmail.trim() || !adminCode.trim()) {
            showAlert('Missing Info', 'Please enter Admin ID and Access Code.');
            return;
        }

        const id = adminEmail.trim().toLowerCase();
        const code = adminCode.trim();

        if (
            (id === ADMIN_EMAIL && code === ADMIN_PASSWORD) ||
            (id === ADMIN2_ID && code === ADMIN2_PASSWORD)
        ) {
            navigation.replace('AdminDashboard');
        } else {
            showAlert('Access Denied', 'Invalid admin credentials.');
        }
    };

    const handleLogin = async () => {
        if (!mobile.trim() || !password.trim()) {
            showAlert('Missing Info', 'Please enter your Mobile Number and Password.');
            return;
        }

        setLoading(true);

        // Check if they entered static admin credentials in the main login
        const loginId = mobile.trim().toLowerCase();
        const loginCode = password.trim();
        if (
            (loginId === ADMIN_EMAIL && loginCode === ADMIN_PASSWORD) ||
            (loginId === ADMIN2_ID && loginCode === ADMIN2_PASSWORD)
        ) {
            setLoading(false);
            navigation.replace('AdminDashboard');
            return;
        }

        try {
            // Helper function to process a successful login
            const processLogin = async (loginData: any, role: string) => {
                const actualRole = loginData?.user?.role || role;
                await AsyncStorage.setItem('userSession', JSON.stringify({
                    phoneNumber: mobile,
                    role: actualRole,
                    ...loginData,
                }));
                
                if (actualRole === 'experts' || actualRole === 'expert' || role === 'experts' || role === 'expert') {
                    navigation.replace('ExpertMainTabs');
                } else if (actualRole === 'shopkeeper' || actualRole === 'shopOwner' || role === 'shopkeeper') {
                    navigation.replace('ShopOwnerMainTabs');
                } else {
                    const termsAccepted = await AsyncStorage.getItem('termsAccepted');
                    navigation.replace(termsAccepted === 'true' ? 'UserMainTabs' : 'TermsAndConditions');
                }
            };

            // Step 1: Try Expert login
            let response = await fetch(ENDPOINTS.login, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true',
                },
                body: JSON.stringify({
                    mobile: mobile.trim(),
                    password: password.trim(),
                    role: 'expert'
                }),
            });

            let data = await response.json();

            if (response.ok && !data.error) {
                // If it worked, but backend says they are customer, don't force expert!
                const serverRole = data.user?.role || data.role;
                if (serverRole === 'experts' || serverRole === 'expert') {
                    return processLogin(data, 'expert');
                }
                // If it wasn't really an expert, let it fall through
            } 
            
            // Step 2: Try Shopkeeper login
            response = await fetch(ENDPOINTS.login, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true',
                },
                body: JSON.stringify({
                    mobile: mobile.trim(),
                    password: password.trim(),
                    role: 'shopkeeper'
                }),
            });

            data = await response.json();

            if (response.ok && !data.error) {
                const serverRole = data.user?.role || data.role;
                if (serverRole === 'shopkeeper' || serverRole === 'shopOwner') {
                    return processLogin(data, 'shopkeeper');
                }
            } 
            
            // Step 3: Try Customer login
            response = await fetch(ENDPOINTS.login, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true',
                },
                body: JSON.stringify({
                    mobile: mobile.trim(),
                    password: password.trim(),
                    role: 'customer'
                }),
            });

            data = await response.json();
            
            if (!response.ok || data.error) {
                // All failed
                showAlert('Login Failed', data.error || data.message || 'Invalid mobile number or password.');
                return;
            }
            
            // Check the role returned from customer login just in case
            const serverRole = data.user?.role || data.role || 'customer';
            if (serverRole === 'shopkeeper' || serverRole === 'shopOwner') {
                return processLogin(data, 'shopkeeper');
            } else if (serverRole === 'experts' || serverRole === 'expert') {
                return processLogin(data, 'experts');
            } else {
                return processLogin(data, 'customer');
            }

        } catch (error) {
            showAlert('Network Error', 'Could not connect to server. Please check your internet connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

            {/* Background blobs */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <ScrollView
                    contentContainerStyle={styles.scroll}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.innerContainer}>
                        {/* ── Logo / Header ── */}
                        <View style={styles.header}>
                            <TouchableOpacity onPress={handleLogoTap} activeOpacity={1} style={{ width: '100%', alignItems: 'center' }}>
                                <View style={styles.logoWrap}>
                                    <Image 
                                        source={require('../assets/images/gobi360_logo.png')} 
                                        style={{ width: 140, height: 140, resizeMode: 'contain' }} 
                                    />
                                </View>
                            </TouchableOpacity>
                            <Text style={styles.tagline}>
                                {adminMode ? 'Admin Portal Access' : 'Welcome back! Sign in to continue'}
                            </Text>
                        </View>

                        {/* ── Middle / Center Wrapper ── */}
                        <View style={styles.cardContainer}>
                            {/* ── Login Card ── */}
                            <View style={styles.card}>

                        {!adminMode ? (
                            /* Standard Login (Customer + Shop Owner + Expert) */
                            <>
                                <View style={styles.fieldGroup}>
                                    <Text style={styles.fieldLabel}>Mobile Number</Text>
                                    <View style={styles.inputWrap}>
                                        <Icon name="phone-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Enter your mobile number"
                                            placeholderTextColor="#94A3B8"
                                            value={mobile}
                                            onChangeText={setMobile}
                                            keyboardType="phone-pad"
                                            maxLength={10}
                                        />
                                    </View>
                                </View>

                                <View style={styles.fieldGroup}>
                                    <Text style={styles.fieldLabel}>Password</Text>
                                    <View style={styles.inputWrap}>
                                        <Icon name="lock-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Enter your password"
                                            placeholderTextColor="#94A3B8"
                                            value={password}
                                            onChangeText={setPassword}
                                            secureTextEntry={!showPassword}
                                        />
                                        <TouchableOpacity onPress={() => setShowPassword(p => !p)} style={styles.eyeBtn}>
                                            <Icon name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={20} color="#94A3B8" />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <TouchableOpacity
                                    style={styles.loginBtn}
                                    onPress={handleLogin}
                                    disabled={loading}
                                    activeOpacity={0.88}
                                >
                                    {loading ? (
                                        <ActivityIndicator color="#FFF" />
                                    ) : (
                                        <>
                                            <Text style={styles.loginBtnText}>Sign In</Text>
                                            <Icon name="arrow-right" size={20} color="#FFF" />
                                        </>
                                    )}
                                </TouchableOpacity>

                                {loading && (
                                    <Text style={styles.loadingHint}>Verifying your credentials…</Text>
                                )}
                            </>
                        ) : (
                            /* ── Admin Login ── */
                            <>
                                <View style={styles.adminBanner}>
                                    <Icon name="shield-account" size={18} color="#6366F1" />
                                    <Text style={styles.adminBannerText}>Thiran Admin Access</Text>
                                    <TouchableOpacity onPress={() => { setAdminMode(false); setAdminEmail(''); setAdminCode(''); }}>
                                        <Icon name="close" size={18} color="#94A3B8" />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.fieldGroup}>
                                    <Text style={styles.fieldLabel}>Admin ID</Text>
                                    <View style={styles.inputWrap}>
                                        <Icon name="badge-account-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Email or Mobile Number"
                                            placeholderTextColor="#94A3B8"
                                            value={adminEmail}
                                            onChangeText={setAdminEmail}
                                            autoCapitalize="none"
                                            keyboardType="default"
                                        />
                                    </View>
                                </View>

                                <View style={styles.fieldGroup}>
                                    <Text style={styles.fieldLabel}>Access Code</Text>
                                    <View style={styles.inputWrap}>
                                        <Icon name="key-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.input}
                                            placeholder="••••••••"
                                            placeholderTextColor="#94A3B8"
                                            value={adminCode}
                                            onChangeText={setAdminCode}
                                            secureTextEntry={!showAdminCode}
                                            autoCapitalize="none"
                                        />
                                        <TouchableOpacity onPress={() => setShowAdminCode(p => !p)} style={styles.eyeBtn}>
                                            <Icon name={showAdminCode ? 'eye-outline' : 'eye-off-outline'} size={20} color="#94A3B8" />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <TouchableOpacity
                                    style={[styles.loginBtn, styles.loginBtnAdmin]}
                                    onPress={handleAdminLogin}
                                    activeOpacity={0.88}
                                >
                                    <Text style={styles.loginBtnText}>Launch Console</Text>
                                    <Icon name="arrow-right" size={20} color="#FFF" />
                                </TouchableOpacity>
                            </>
                        )}
                    </View>

                    {/* Sign Up link */}
                    {!adminMode && (
                        <View style={styles.signupRow}>
                            <Text style={styles.signupText}>New to Gobi 360? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('UserSignup')} activeOpacity={0.8}>
                                <Text style={styles.signupLink}>Create Account</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },

    blob: {
        position: 'absolute',
        width: width * 1.1,
        height: width * 1.1,
        borderRadius: width * 0.55,
        opacity: 0.45,
    },
    blobTop: { backgroundColor: '#DBEAFE', top: -width * 0.55, right: -width * 0.35 },
    blobBottom: { backgroundColor: '#EDE9FE', bottom: -width * 0.55, left: -width * 0.4 },

    scroll: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingVertical: 30,
    },
    innerContainer: {
        flex: 1,
    },
    header: { 
        alignItems: 'center',
        marginBottom: 10,
    },
    cardContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    logoWrap: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    tagline: { fontSize: 14, color: '#64748B', fontWeight: '500' },

    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 24,
        shadowColor: '#334155',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.08,
        shadowRadius: 24,
        elevation: 8,
    },

    fieldGroup: { marginBottom: 16 },
    fieldLabel: {
        fontSize: 12,
        fontWeight: '800',
        color: '#334155',
        textTransform: 'uppercase',
        letterSpacing: 0.6,
        marginBottom: 8,
    },
    inputWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        height: 56,
        borderRadius: 14,
        paddingHorizontal: 14,
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
    },
    inputIcon: { marginRight: 10 },
    input: { flex: 1, fontSize: 15, color: '#0F172A', fontWeight: '600', height: '100%' },
    eyeBtn: { padding: 6, marginRight: -6 },

    loginBtn: {
        height: 56,
        borderRadius: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        marginTop: 8,
        backgroundColor: '#3B82F6',
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 16,
        elevation: 8,
    },
    loginBtnAdmin: {
        backgroundColor: '#0F172A',
        shadowColor: '#0F172A',
    },
    loginBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '900' },

    loadingHint: {
        textAlign: 'center',
        marginTop: 16,
        fontSize: 13,
        color: '#64748B',
        fontWeight: '600'
    },

    adminBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#EEF2FF',
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#C7D2FE',
    },
    adminBannerText: { flex: 1, color: '#4338CA', fontSize: 13, fontWeight: '800' },

    signupRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 28,
    },
    signupText: { color: '#64748B', fontSize: 14, fontWeight: '500' },
    signupLink: { color: '#3B82F6', fontSize: 14, fontWeight: '900' },
});

export default LoginScreen;
