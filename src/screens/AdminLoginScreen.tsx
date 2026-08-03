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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useAlert } from '../context/AlertContext';

type RootStackParamList = {
    LanguageSelection: undefined;
    LoginSelection: undefined;
    UserLogin: undefined;
    UserSignup: undefined;
    AdminLogin: undefined;
    UserMainTabs: undefined;
    AdminDashboard: undefined;
};

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'AdminLogin'>;
};

const { width, height } = Dimensions.get('window');

const AdminLoginScreen = ({ navigation }: Props) => {
    const { t } = useTranslation();
    const { showAlert } = useAlert();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Thiran members only — strict credential check
    const ADMIN_EMAIL = 'thiran360@gmail.com';
    const ADMIN_PASSWORD = 'thiran@123';
    const ADMIN2_ID = '1234567890';
    const ADMIN2_PASSWORD = '123456';

    const handleAdminLogin = () => {
        if (!email.trim() || !password.trim()) {
            showAlert(
                t('admin.missing_creds_title'),
                t('admin.missing_creds_msg'),
                [{ text: t('admin.resolve') }]
            );
            return;
        }

        const id = email.trim().toLowerCase();
        const code = password.trim();

        if (
            (id === ADMIN_EMAIL && code === ADMIN_PASSWORD) ||
            (id === ADMIN2_ID && code === ADMIN2_PASSWORD)
        ) {
            navigation.replace('AdminDashboard');
        } else {
            showAlert(
                t('admin.access_denied_title'),
                t('admin.access_denied_msg'),
                [{ text: t('admin.resolve') }]
            );
        }
    };

    return (
        <SafeAreaView style={styles.container}>
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

                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                    <View style={styles.content}>
                        <View style={styles.header}>
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{t('admin.login_badge')}</Text>
                            </View>
                            <Text style={styles.title}>{t('admin.secure_access')}</Text>
                            <Text style={styles.subtitle}>{t('admin.enter_credentials')}</Text>
                        </View>

                        <View style={styles.form}>
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>{t('admin.admin_email')}</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="thiran360@gmail.com"
                                    placeholderTextColor="#94A3B8"
                                    value={email}
                                    onChangeText={setEmail}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                    autoCorrect={false}
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>{t('admin.password')}</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="••••••••"
                                    placeholderTextColor="#94A3B8"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                            </View>

                            <TouchableOpacity
                                style={styles.button}
                                onPress={handleAdminLogin}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.buttonText}>{t('admin.authenticate')}</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.warningContainer}>
                            <Text style={styles.warningText}>
                                {t('admin.unauthorized_warning')}
                            </Text>
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
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
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
    badge: {
        backgroundColor: '#FEF3C7',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        alignSelf: 'flex-start',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#FDE68A',
    },
    badgeText: {
        color: '#D97706',
        fontSize: width > 380 ? 11 : 9,
        fontWeight: '800',
        letterSpacing: 1,
        lineHeight: width > 380 ? 18 : 14,
        includeFontPadding: false,
    },
    title: {
        fontSize: width > 380 ? 32 : 28,
        fontWeight: '800',
        color: '#0F172A',
        marginBottom: 8,
        letterSpacing: -1,
        lineHeight: width > 380 ? 51 : 45,
        includeFontPadding: false,
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
        gap: 8,
    },
    label: {
        fontSize: 12,
        fontWeight: '700',
        color: '#475569',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginLeft: 4,
        lineHeight: 19,
        includeFontPadding: false,
    },
    input: {
        backgroundColor: '#F8FAFC',
        minHeight: height > 700 ? 60 : 50,
        borderRadius: 16,
        paddingHorizontal: 20,
        fontSize: width > 380 ? 15 : 13,
        color: '#0F172A',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        lineHeight: width > 380 ? 24 : 21,
        includeFontPadding: false,
    },
    button: {
        backgroundColor: '#0F172A',
        minHeight: height > 700 ? 60 : 50,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 6,
        paddingVertical: 12,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: width > 380 ? 16 : 15,
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: 1,
        lineHeight: width > 380 ? 27 : 26,
        includeFontPadding: false,
    },
    warningContainer: {
        marginTop: 'auto',
        marginBottom: 40,
        backgroundColor: '#FEF2F2',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FECACA',
    },
    warningText: {
        color: '#EF4444',
        fontSize: 12,
        textAlign: 'center',
        lineHeight: 21,
        includeFontPadding: false,
    },
});

export default AdminLoginScreen;
