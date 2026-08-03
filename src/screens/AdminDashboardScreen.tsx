import React, { useCallback, useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    StatusBar,
    Dimensions,
    ScrollView,
    RefreshControl,
    Alert,
    Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';
import { useAlert } from '../context/AlertContext';
import {
    deleteMissedCall,
    clearMissedCalls,
} from '../utils/missedCallsStore';
import { ENDPOINTS } from '../utils/apiConfig';

export interface CallLogRecord {
    id: number | string;
    customer: string;
    customer_number: string;
    user_name: string;
    user_number: string;
    status: string;
    remarks: string;
    call_time: string;
}

type RootStackParamList = {
    LanguageSelection: undefined;
    Login: undefined;
    UserSignup: undefined;
    UserMainTabs: undefined;
    AdminDashboard: undefined;
};

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'AdminDashboard'>;
};

const { width } = Dimensions.get('window');

const AdminDashboardScreen = ({ navigation }: Props) => {
    const { t } = useTranslation();
    const { showAlert } = useAlert();
    const [callLogs, setCallLogs] = useState<CallLogRecord[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    const loadData = useCallback(async () => {
        try {
            const response = await fetch(ENDPOINTS.callRequestList, {
                method: 'GET',
                headers: {
                    'ngrok-skip-browser-warning': 'true',
                    'Accept': 'application/json',
                },
            });

            if (response.ok) {
                const json = await response.json();
                
                // Map the new API structure to the UI expected structure
                const mappedLogs = Array.isArray(json) ? json.map((item: any) => ({
                    id: item.id,
                    customer: item.expert_name || 'Unknown Expert', // The expert/portfolio called
                    customer_number: item.expert_mobile || 'N/A',
                    user_name: item.customer_name || `Customer #${item.customer}`, // The person who called
                    user_number: item.customer_mobile || 'Unknown Number', // Assuming the API might add it
                    status: item.status === 'not_answered' ? 'not_attended' : 'attended',
                    remarks: '',
                    call_time: item.created_at
                })) : [];
                
                setCallLogs(mappedLogs);
            }
        } catch (e) {
            console.error('AdminDashboardScreen: loadData error', e);
        }
    }, []);

    // Reload every time admin screen is focused
    useEffect(() => {
        loadData();
        const unsubscribe = navigation.addListener('focus', loadData);
        return unsubscribe;
    }, [navigation, loadData]);

    const onRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    };

    const handleDismiss = (id: string) => {
        showAlert(t('admin.resolve_confirm_title'), t('admin.resolve_confirm_msg'), [
            { text: t('admin.cancel'), style: 'cancel' },
            {
                text: t('admin.resolve'),
                style: 'destructive',
                onPress: async () => {
                    await deleteMissedCall(id);
                    await loadData();
                },
            },
        ]);
    };

    const handleClearAll = () => {
        if (callLogs.length === 0) return;
        showAlert(t('admin.clear_all_title'), t('admin.clear_all_msg'), [
            { text: t('admin.cancel'), style: 'cancel' },
            {
                text: t('admin.clear_all_title'),
                style: 'destructive',
                onPress: async () => {
                    await clearMissedCalls();
                    await loadData();
                },
            },
        ]);
    };

    const formatTime = (iso: string) => {
        if (!iso) return '';
        const d = new Date(iso);
        return d.toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* ── Ultra Hero Header ── */}
            <View style={styles.heroHeader}>
                {/* Decorative background blobs */}
                <View style={styles.heroBlob1} />
                <View style={styles.heroBlob2} />

                <View style={styles.headerInner}>
                    {/* Profile row */}
                    <View style={styles.profileSection}>
                        <View style={styles.avatarWrapper}>
                            <View style={styles.avatar}>
                                <Text style={styles.avatarText}>A</Text>
                            </View>
                            <View style={styles.avatarOnlineDot} />
                        </View>
                        <View style={styles.headerTextBlock}>
                            <Text style={styles.welcomeText}>{t('admin.welcome')}</Text>
                            <Text style={styles.roleText}>{t('admin.role')}</Text>
                        </View>
                    </View>

                    {/* Logout */}
                    <TouchableOpacity
                        style={styles.logoutButton}
                        onPress={async () => {
                            await AsyncStorage.removeItem('userSession');
                            navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
                        }}
                        activeOpacity={0.8}
                    >
                        <Icon name="logout-variant" size={14} color="#EF4444" />
                        <Text style={styles.logoutText}>{t('admin.logout')}</Text>
                    </TouchableOpacity>
                </View>

                {/* ── Inline Stats Strip ── */}
                <View style={styles.statsStrip}>
                    {/* System Status card */}
                    <View style={styles.statPill}>
                        <Icon name="shield-check-outline" size={15} color="#16A34A" />
                        <View style={styles.statPillText}>
                            <Text style={styles.statPillLabel}>{t('admin.stats')}</Text>
                            <View style={styles.statusBadge}>
                                <View style={styles.statusDot} />
                                <Text style={styles.statusText}>{t('admin.active')}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.statsDivider} />

                    {/* Total calls card */}
                    <View style={styles.statPill}>
                        <Icon name="phone-log" size={15} color={callLogs.length > 0 ? '#3B82F6' : '#64748B'} />
                        <View style={styles.statPillText}>
                            <Text style={styles.statPillLabel}>{t('admin.missed_calls') || 'CALL LOGS'}</Text>
                            <Text style={[styles.statValue, callLogs.length > 0 && { color: '#3B82F6' }]}>
                                {callLogs.length}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#3B82F6']}
                        tintColor="#3B82F6"
                    />
                }
            >


                {/* ── Missed Calls Section Header ── */}
                <View style={styles.sectionHeader}>
                    <View style={styles.sectionTitleRow}>
                        <View style={styles.sectionIconBox}>
                            <Icon name="phone-log" size={15} color="#3B82F6" />
                        </View>
                        <Text style={[styles.sectionTitle, { marginBottom: 0, marginLeft: 10 }]}>
                            Call Logs
                        </Text>
                        {callLogs.length > 0 && (
                            <View style={[styles.countBadge, { backgroundColor: '#3B82F6' }]}>
                                <Text style={styles.countBadgeText}>{callLogs.length}</Text>
                            </View>
                        )}
                    </View>
                    {callLogs.length > 0 && (
                        <TouchableOpacity onPress={handleClearAll} style={styles.clearBtn} activeOpacity={0.8}>
                            <Icon name="delete-sweep-outline" size={13} color="#EF4444" />
                            <Text style={styles.clearBtnText}>{t('admin.clear_all_title')}</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* ── Empty State ── */}
                {callLogs.length === 0 ? (
                    <View style={styles.emptyCard}>
                        <View style={styles.emptyIconWrap}>
                            <Icon name="phone-check-outline" size={36} color="#CBD5E1" />
                        </View>
                        <Text style={styles.emptyTitle}>{t('admin.all_attended') || 'No Call Logs'}</Text>
                        <Text style={styles.emptySubtitle}>{t('admin.no_requests') || 'There are no calls logged in the system.'}</Text>
                        <View style={styles.emptyPulse} />
                    </View>
                ) : (
                    callLogs.map((record, index) => {
                        const isAttended = record.status === 'attended';
                        const accentColor = isAttended ? '#16A34A' : '#EF4444';
                        
                        return (
                            <View key={`${record.id}-${index}`} style={[styles.missedCard, { borderColor: isAttended ? '#BBF7D0' : '#FEE2E2', shadowColor: accentColor }]}>
                                {/* Left accent stripe */}
                                <View style={[styles.cardAccent, { backgroundColor: accentColor }]} />

                                <View style={styles.cardBody}>
                                    {/* ── Top: Avatar + Name + Resolve ── */}
                                    <View style={styles.cardTopRow}>
                                        <View style={[styles.userAvatar, { backgroundColor: isAttended ? '#DCFCE7' : '#FEE2E2', borderColor: isAttended ? '#BBF7D0' : '#FECACA' }]}>
                                            <Text style={[styles.userAvatarText, { color: accentColor }]}>
                                                {record.user_name ? record.user_name.charAt(0).toUpperCase() : '?'}
                                            </Text>
                                        </View>
                                        <View style={styles.userInfo}>
                                            <Text style={styles.userName}>{record.user_name || 'Unknown'}</Text>
                                            <View style={styles.phoneTagRow}>
                                                <Icon name="phone" size={10} color="#64748B" />
                                                <Text style={styles.userPhone}>{record.user_number || 'Unknown'}</Text>
                                            </View>
                                        </View>
                                        <View style={[styles.resolveBtn, { backgroundColor: isAttended ? '#DCFCE7' : '#FEE2E2', borderColor: isAttended ? '#BBF7D0' : '#FECACA', width: 'auto', paddingHorizontal: 8 }]}>
                                            <Icon name={isAttended ? "check-circle" : "alert-circle"} size={14} color={accentColor} style={{ marginRight: 4 }} />
                                            <Text style={{ fontSize: 10, fontWeight: '700', color: accentColor, textTransform: 'uppercase' }}>
                                                {isAttended ? 'Attended' : 'Missed'}
                                            </Text>
                                        </View>
                                    </View>

                                    {/* ── Info Chips Row ── */}
                                    <View style={styles.chipsRow}>
                                        {/* Portfolio chip */}
                                        <View style={styles.chipBox}>
                                            <Icon name="briefcase-outline" size={11} color="#3B82F6" />
                                            <Text style={styles.chipLabel}>{t('admin.tried_to_contact') || 'CALLED'}</Text>
                                            <Text style={styles.chipValue} numberOfLines={1}>{record.customer}</Text>
                                        </View>

                                        {/* Dialled chip */}
                                        <View style={[styles.chipBox, styles.chipBoxAlt]}>
                                            <Icon name="phone-dial-outline" size={11} color="#64748B" />
                                            <Text style={styles.chipLabel}>{t('admin.dialled_number') || 'EXPERT NO.'}</Text>
                                            <Text style={styles.dialledNumber}>{record.customer_number}</Text>
                                        </View>
                                    </View>

                                    {/* ── Timestamp row ── */}
                                    <View style={styles.timeRow}>
                                        <Icon name="clock-outline" size={11} color="#94A3B8" />
                                        <Text style={styles.timeText}>{formatTime(record.call_time)}</Text>
                                    </View>

                                    {/* ── Call Back button ── */}
                                    <TouchableOpacity
                                        style={styles.callbackBtn}
                                        onPress={() => Linking.openURL(`tel:${record.user_number}`)}
                                        activeOpacity={0.85}
                                    >
                                        <View style={styles.callbackBtnInner}>
                                            <Icon name="phone-outgoing" size={16} color="#FFFFFF" />
                                            <Text style={styles.callbackBtnText}>Call Back User</Text>
                                        </View>
                                        <View style={styles.callbackBtnArrow}>
                                            <Icon name="arrow-right" size={16} color="#FFFFFF" />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        );
                    })
                )}

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },

    // ── Hero Header ──────────────────────────────────────────────────
    heroHeader: {
        backgroundColor: '#FFFFFF',
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        paddingHorizontal: width * 0.06,
        paddingTop: 16,
        paddingBottom: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.07,
        shadowRadius: 18,
    },
    heroBlob1: {
        position: 'absolute',
        width: width * 0.55,
        height: width * 0.55,
        borderRadius: width * 0.275,
        backgroundColor: '#EFF6FF',
        top: -(width * 0.2),
        right: -(width * 0.12),
        opacity: 0.7,
    },
    heroBlob2: {
        position: 'absolute',
        width: width * 0.4,
        height: width * 0.4,
        borderRadius: width * 0.2,
        backgroundColor: '#FEE2E2',
        bottom: -(width * 0.12),
        left: -(width * 0.08),
        opacity: 0.5,
    },
    headerInner: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatarWrapper: {
        position: 'relative',
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: '#0F172A',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
    },
    avatarText: {
        color: '#FFFFFF',
        fontWeight: '800',
        fontSize: 20,
    },
    avatarOnlineDot: {
        position: 'absolute',
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#16A34A',
        bottom: -1,
        right: -1,
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    headerTextBlock: {
        gap: 2,
    },
    welcomeText: {
        fontSize: 11,
        color: '#64748B',
        fontWeight: '500',
        letterSpacing: 0.3,
    },
    roleText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#1E293B',
        letterSpacing: 0.1,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 12,
        backgroundColor: '#FEE2E2',
        borderWidth: 1,
        borderColor: '#FECACA',
    },
    logoutText: {
        color: '#EF4444',
        fontWeight: '700',
        fontSize: 12,
    },

    // ── Stats Strip ──────────────────────────────────────────────────
    statsStrip: {
        flexDirection: 'row',
        backgroundColor: '#F8FAFC',
        borderRadius: 18,
        padding: 14,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        gap: 4,
    },
    statPill: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    statPillText: {
        flex: 1,
        gap: 4,
    },
    statPillLabel: {
        fontSize: 10,
        color: '#64748B',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    statsDivider: {
        width: 1,
        backgroundColor: '#E2E8F0',
        marginHorizontal: 8,
    },
    statValue: {
        fontSize: 22,
        fontWeight: '800',
        color: '#1E293B',
        lineHeight: 26,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: '#DCFCE7',
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#16A34A',
    },
    statusText: {
        color: '#16A34A',
        fontSize: 11,
        fontWeight: '700',
    },

    // ── Scroll Content ───────────────────────────────────────────────
    scrollContent: {
        paddingHorizontal: width * 0.06,
        paddingTop: 24,
        paddingBottom: 20,
    },

    // ── Section Titles & Headers ─────────────────────────────────────
    sectionTitle: {
        fontSize: 17,
        fontWeight: '800',
        color: '#1E293B',
        marginBottom: 14,
        letterSpacing: 0.1,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14,
    },
    sectionTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sectionIconBox: {
        width: 30,
        height: 30,
        borderRadius: 9,
        backgroundColor: '#FEE2E2',
        justifyContent: 'center',
        alignItems: 'center',
    },
    countBadge: {
        backgroundColor: '#EF4444',
        borderRadius: 10,
        paddingHorizontal: 7,
        paddingVertical: 2,
        marginLeft: 8,
    },
    countBadgeText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '800',
    },
    clearBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 12,
        paddingVertical: 7,
        backgroundColor: '#FEE2E2',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#FECACA',
    },
    clearBtnText: {
        color: '#EF4444',
        fontSize: 11,
        fontWeight: '700',
    },



    // ── Empty State ──────────────────────────────────────────────────
    emptyCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 28,
        paddingVertical: 48,
        paddingHorizontal: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
        overflow: 'hidden',
        position: 'relative',
    },
    emptyIconWrap: {
        width: 80,
        height: 80,
        borderRadius: 28,
        backgroundColor: '#F8FAFC',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#1E293B',
        marginBottom: 6,
        letterSpacing: 0.1,
    },
    emptySubtitle: {
        fontSize: 12,
        color: '#94A3B8',
        textAlign: 'center',
        lineHeight: 19,
        maxWidth: '75%',
    },
    emptyPulse: {
        position: 'absolute',
        bottom: -40,
        right: -40,
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#DCFCE7',
        opacity: 0.4,
    },

    // ── Missed Call Card ─────────────────────────────────────────────
    missedCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 22,
        marginBottom: 14,
        flexDirection: 'row',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#FEE2E2',
        elevation: 4,
        shadowColor: '#EF4444',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
    },
    cardAccent: {
        width: 5,
        backgroundColor: '#EF4444',
    },
    cardBody: {
        flex: 1,
        padding: 16,
        gap: 10,
    },

    // Card top row
    cardTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    userAvatar: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: '#FEE2E2',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#FECACA',
    },
    userAvatarText: {
        fontSize: 17,
        fontWeight: '900',
        color: '#EF4444',
    },
    userInfo: {
        flex: 1,
        gap: 3,
    },
    userName: {
        fontSize: 14,
        fontWeight: '800',
        color: '#0F172A',
        letterSpacing: 0.1,
    },
    phoneTagRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    userPhone: {
        fontSize: 12,
        color: '#64748B',
        fontWeight: '500',
    },
    resolveBtn: {
        width: 36,
        height: 36,
        borderRadius: 12,
        backgroundColor: '#DCFCE7',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#BBF7D0',
    },

    // Chips row
    chipsRow: {
        flexDirection: 'row',
        gap: 8,
    },
    chipBox: {
        flex: 1,
        backgroundColor: '#EFF6FF',
        borderRadius: 12,
        padding: 10,
        gap: 2,
        borderWidth: 1,
        borderColor: '#DBEAFE',
    },
    chipBoxAlt: {
        backgroundColor: '#F8FAFC',
        borderColor: '#E2E8F0',
    },
    chipLabel: {
        fontSize: 9,
        color: '#94A3B8',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.4,
    },
    chipValue: {
        fontSize: 11,
        fontWeight: '800',
        color: '#1E293B',
    },
    portfolioRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    portfolioLabel: {
        fontSize: 11,
        color: '#94A3B8',
        fontWeight: '600',
    },
    portfolioName: {
        fontSize: 12,
        fontWeight: '800',
        color: '#1E293B',
    },
    dialledNumber: {
        fontSize: 11,
        fontWeight: '800',
        color: '#3B82F6',
    },

    // Time row
    timeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    timeText: {
        fontSize: 10,
        color: '#94A3B8',
        fontWeight: '500',
        letterSpacing: 0.2,
    },

    // Callback button
    callbackBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#20830cff',
        borderRadius: 14,
        marginTop: 4,
        paddingVertical: 11,
        paddingHorizontal: 16,
        elevation: 3,
        shadowColor: '#29ea17ff',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
    },
    callbackBtnInner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    callbackBtnArrow: {
        width: 28,
        height: 28,
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.18)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    callbackBtnText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '800',
        letterSpacing: 0.2,
    },
});

export default AdminDashboardScreen;
