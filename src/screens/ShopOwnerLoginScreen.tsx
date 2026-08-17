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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useAlert } from '../context/AlertContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ENDPOINTS } from '../utils/apiConfig';

type RootStackParamList = {
    ShopOwnerLogin: undefined;
    ShopOwnerMainTabs: undefined;
};

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'ShopOwnerLogin'>;
};

const { width, height } = Dimensions.get('window');

const ShopOwnerLoginScreen = ({ navigation }: Props) => {
    const { t } = useTranslation();
    const { showAlert } = useAlert();
    const [mobileNumber, setMobileNumber] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!mobileNumber.trim() || !password.trim()) {
            showAlert('Missing Information', 'Please enter your Mobile Number and Password.');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(ENDPOINTS.shopkeeperLogin, {
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
                await AsyncStorage.setItem('userSession', JSON.stringify({
                    phoneNumber: mobileNumber,
                    role: 'shopOwner',
                    ...data
                }));
                navigation.replace('ShopOwnerMainTabs');
            } else {
                showAlert('Login Failed', data.error || data.message || 'Invalid credentials');
            }
        } catch (error) {
            showAlert('Error', 'Network request failed. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.topCurve} />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.keyboardView}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <View style={styles.backButtonCircle}>
                        <Icon name="arrow-left" size={24} color="#1E293B" />
                    </View>
                </TouchableOpacity>

                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                    <View style={styles.content}>
                        <View style={styles.header}>
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>SHOP OWNER PORTAL</Text>
                            </View>
                            <Text style={styles.title}>Manage Your Shop</Text>
                            <Text style={styles.subtitle}>Sign in to view orders and reward your customers</Text>
                        </View>

                        <View style={styles.form}>
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Mobile Number</Text>
                                <View style={styles.inputWrapper}>
                                    <Icon name="phone-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="e.g. 9876543210"
                                        placeholderTextColor="#94A3B8"
                                        value={mobileNumber}
                                        onChangeText={setMobileNumber}
                                        keyboardType="phone-pad"
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                    />
                                </View>
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Password</Text>
                                <View style={styles.inputWrapper}>
                                    <Icon name="lock-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="••••••••"
                                        placeholderTextColor="#94A3B8"
                                        value={password}
                                        onChangeText={setPassword}
                                        secureTextEntry={!showPassword}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                    />
                                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                                        <Icon name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#94A3B8" />
                                    </TouchableOpacity>
                                </View>
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
                                    <>
                                        <Text style={styles.buttonText}>Sign In</Text>
                                        <Icon name="arrow-right" size={20} color="#FFFFFF" style={{ marginLeft: 8 }} />
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    topCurve: {
        position: 'absolute',
        top: -width * 0.6,
        left: -width * 0.2,
        right: -width * 0.2,
        height: width * 1.2,
        borderRadius: width,
        backgroundColor: '#EFF6FF', // Light blue hint
        borderWidth: 1,
        borderColor: '#DBEAFE',
    },
    keyboardView: { flex: 1 },
    backButton: {
        padding: 16,
        position: 'absolute',
        top: Platform.OS === 'android' ? 12 : 8,
        left: 8,
        zIndex: 10,
    },
    backButtonCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    scrollContent: { flexGrow: 1 },
    content: {
        flexGrow: 1,
        paddingHorizontal: width * 0.08,
        paddingTop: height * 0.15,
        paddingBottom: 24,
    },
    header: { marginBottom: height * 0.04 },
    badge: {
        backgroundColor: '#DBEAFE',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        alignSelf: 'flex-start',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#BFDBFE',
    },
    badgeText: {
        color: '#2563EB',
        fontSize: width > 380 ? 11 : 9,
        fontWeight: '900',
        letterSpacing: 1,
    },
    title: {
        fontSize: width > 380 ? 32 : 28,
        fontWeight: '900',
        color: '#0F172A',
        marginBottom: 8,
        letterSpacing: -1,
    },
    subtitle: {
        fontSize: width > 380 ? 15 : 13,
        color: '#64748B',
        lineHeight: 24,
        fontWeight: '500',
    },
    form: { gap: 24 },
    inputContainer: { gap: 8 },
    label: {
        fontSize: 12,
        fontWeight: '800',
        color: '#475569',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginLeft: 4,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        minHeight: height > 700 ? 56 : 50,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        paddingHorizontal: 16,
    },
    inputIcon: { marginRight: 10 },
    eyeIcon: { padding: 4 },
    input: {
        flex: 1,
        fontSize: width > 380 ? 15 : 14,
        color: '#0F172A',
        fontWeight: '600',
        height: '100%',
    },
    button: {
        backgroundColor: '#3B82F6', // Blue for shop owner
        minHeight: height > 700 ? 56 : 50,
        borderRadius: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 6,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: width > 380 ? 16 : 15,
        fontWeight: '900',
        letterSpacing: 0.5,
    },
});

export default ShopOwnerLoginScreen;
