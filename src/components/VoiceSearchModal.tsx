import React, { useEffect, useRef, useState } from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    ScrollView,
    Platform,
    PermissionsAndroid,
    ActivityIndicator,
    Linking,
    Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Voice, {
    SpeechResultsEvent,
    SpeechErrorEvent,
} from '@react-native-voice/voice';
import { useTranslation } from 'react-i18next';
import { findPortfolioMatches, PortfolioMatch } from '../utils/voiceSearchKeywords';

const { width } = Dimensions.get('window');

const SUGGESTIONS = [
    { key: 'Kaykar', color: '#10B981', bg: '#ECFDF5' },
    { key: 'BAAS', color: '#7C3AED', bg: '#F5F3FF' },
    { key: 'Skyline', color: '#2563EB', bg: '#EFF6FF' },
    { key: 'Hindi', color: '#0EA5E9', bg: '#F0F9FF' },
    { key: 'Wood Zone', color: '#D97706', bg: '#FFFBEB' },
    { key: 'GV Build', color: '#4F46E5', bg: '#EEF2FF' },
];

type VoiceState = 'checking_perm' | 'perm_request' | 'idle' | 'listening' | 'processing' | 'results' | 'no_match' | 'error' | 'perm_denied';

interface Props {
    visible: boolean;
    onClose: () => void;
    onNavigate: (item: PortfolioMatch) => void;
    onResult?: (text: string) => void;
    onFinalResult?: (text: string) => void;
}

const VoiceSearchModal: React.FC<Props> = ({ visible, onClose, onNavigate, onResult, onFinalResult }) => {
    const { t, i18n } = useTranslation();
    const isTa = i18n.language === 'ta';
    const isTh = i18n.language === 'th';

    const [voiceState, setVoiceState] = useState<VoiceState>('checking_perm');
    const [transcript, setTranscript] = useState('');
    const [matches, setMatches] = useState<PortfolioMatch[]>([]);
    const [permNeverAsk, setPermNeverAsk] = useState(false);
    const [errorDetails, setErrorDetails] = useState<{ message: string; code?: string }>({ message: '' });

    // Animations
    const backdropAnim = useRef(new Animated.Value(0)).current;
    const sheetAnim = useRef(new Animated.Value(80)).current;
    const breatheAnim = useRef(new Animated.Value(1)).current;
    const micScale = useRef(new Animated.Value(1)).current;
    const pulseRef = useRef<Animated.CompositeAnimation | null>(null);

    // ── Voice listeners ────────────────────────────────────────────
    // Voice listeners are managed in the visible useEffect below

    // ── On open: check permission status & setup listeners ──────────
    useEffect(() => {
        if (visible) {
            // Setup Listeners ONLY when visible
            Voice.onSpeechResults = (e: SpeechResultsEvent) => {
                const text = e.value?.[0] ?? '';
                setTranscript(text);
                if (text.trim()) {
                    onResult?.(text);
                    if (onFinalResult) {
                        onFinalResult(text);
                        return;
                    }
                    const found = findPortfolioMatches(text);
                    setMatches(found);
                    if (found.length > 0) setVoiceState('results');
                    else setVoiceState('no_match');
                } else {
                    setVoiceState('error');
                    setErrorDetails({ message: t('voice_search.errors.no_speech') });
                }
            };
            Voice.onSpeechPartialResults = (e: SpeechResultsEvent) => {
                const text = e.value?.[0] ?? '';
                if (text) {
                    setTranscript(text);
                    onResult?.(text);
                }
            };
            Voice.onSpeechStart = () => setVoiceState('listening');
            Voice.onSpeechError = (e: SpeechErrorEvent) => {
                const code = e.error?.code;
                let userMsg = t('voice_search.errors.general');
                if (code === '7') {
                    userMsg = t('voice_search.errors.no_speech');
                    setVoiceState('no_match');
                    return;
                } else if (code === '2' || code === '1') userMsg = t('voice_search.errors.network');
                else if (code === '8') userMsg = t('voice_search.errors.busy');
                else if (code === '6') userMsg = t('voice_search.errors.timeout');
                
                setErrorDetails({ message: userMsg, code: code?.toString() });
                setVoiceState('error');
            };
            Voice.onSpeechEnd = () => setVoiceState('processing');

            setVoiceState('checking_perm');
            setTranscript('');
            setMatches([]);
            // Animate sheet in
            Animated.parallel([
                Animated.timing(backdropAnim, { toValue: 1, duration: 280, useNativeDriver: true }),
                Animated.spring(sheetAnim, { toValue: 0, friction: 9, tension: 55, useNativeDriver: true }),
            ]).start();

            // Check current status
            checkInitialPermission();
        } else {
            stopVoice(); // Already calls destroy and removeAllListeners conceptually if needed
            Voice.removeAllListeners(); 
            Animated.parallel([
                Animated.timing(backdropAnim, { toValue: 0, duration: 220, useNativeDriver: true }),
                Animated.timing(sheetAnim, { toValue: 80, duration: 220, useNativeDriver: true }),
            ]).start();
        }
    }, [visible]);

    const checkInitialPermission = async () => {
        if (Platform.OS !== 'android') {
            startListening();
            return;
        }
        const already = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
        if (already) {
            startListening();
        } else {
            setVoiceState('perm_request');
        }
    };

    // ── Pulse rings while listening ────────────────────────────────
    useEffect(() => {
        if (voiceState === 'listening') {
            startRings();
            Animated.loop(
                Animated.sequence([
                    Animated.spring(micScale, { toValue: 1.08, friction: 3, useNativeDriver: true }),
                    Animated.spring(micScale, { toValue: 1, friction: 3, useNativeDriver: true }),
                ])
            ).start();
        } else {
            stopRings();
            micScale.setValue(1);
        }
    }, [voiceState]);

    const startRings = () => {
        pulseRef.current = Animated.loop(
            Animated.sequence([
                Animated.timing(breatheAnim, { toValue: 1.5, duration: 1200, useNativeDriver: true }),
                Animated.timing(breatheAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
            ])
        );
        pulseRef.current.start();
    };

    const stopRings = () => {
        pulseRef.current?.stop();
        breatheAnim.setValue(1);
    };

    // ── Permission Request Handler ─────────────────────────────────
    const requestMicrophonePermission = async () => {
        if (Platform.OS !== 'android') {
            setVoiceState('idle');
            return;
        }
        try {
            const result = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                {
                    title: t('voice_search.enable_mic'),
                    message: t('voice_search.mic_desc'),
                    buttonPositive: t('common.allow') || 'Allow',
                    buttonNegative: t('common.deny') || 'Deny',
                }
            );
            if (result === PermissionsAndroid.RESULTS.GRANTED) {
                setVoiceState('idle');
            } else if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
                setPermNeverAsk(true);
                setVoiceState('perm_denied');
            } else {
                setPermNeverAsk(false);
                setVoiceState('perm_denied');
            }
        } catch (err) {
            setVoiceState('error');
        }
    };

    // ── Start / stop voice ─────────────────────────────────────────
    const startListening = async () => {
        try {
            setTranscript('');
            setMatches([]);
            setVoiceState('listening');
            setErrorDetails({ message: '' });
            const locale = (isTa || isTh) ? 'ta-IN' : 'en-IN';
            await Voice.start(locale);
        } catch (e: any) {
            setErrorDetails({
                message: t('voice_search.errors.general'),
                code: e?.message || 'START_ERROR'
            });
            setVoiceState('error');
        }
    };

    const stopVoice = async () => {
        try { await Voice.stop(); await Voice.destroy(); } catch (_) { }
    };

    const handleClose = () => { stopVoice(); onClose(); };
    const handleNavigate = (item: PortfolioMatch) => {
        handleClose();
        setTimeout(() => onNavigate(item), 300);
    };

    // ─────────────────────────────────────────────────────────────
    //  Animated mic button
    // ─────────────────────────────────────────────────────────────
    const MicBtn = ({ onPress, active }: { onPress: () => void; active: boolean }) => (
        <View style={styles.micWrap}>
            {active && (
                <Animated.View
                    style={[
                        styles.breatheRing,
                        {
                            transform: [{ scale: breatheAnim }],
                            opacity: breatheAnim.interpolate({ inputRange: [1, 1.5], outputRange: [0.3, 0] }),
                        },
                    ]}
                />
            )}
            <Animated.View style={{ transform: [{ scale: micScale }] }}>
                <TouchableOpacity
                    style={[styles.micBtn, active && styles.micBtnActive]}
                    onPress={onPress}
                    activeOpacity={0.9}
                >
                    <Icon name={active ? 'microphone' : 'microphone-outline'} size={40} color="#FFF" />
                </TouchableOpacity>
            </Animated.View>
        </View>
    );

    // ─────────────────────────────────────────────────────────────
    //  Content per state
    // ─────────────────────────────────────────────────────────────
    const renderContent = () => {
        switch (voiceState) {

            case 'checking_perm':
                return (
                    <View style={styles.centerBox}>
                        <ActivityIndicator size="large" color="#6C63FF" />
                        <Text style={styles.stateLabel}>
                            {t('voice_search.loading')}
                        </Text>
                    </View>
                );

            case 'perm_request':
                return (
                    <View style={styles.permBox}>
                        <View style={styles.permIconCircle}>
                            <Icon name="microphone" size={44} color="#6C63FF" />
                        </View>
                        <Text style={styles.permTitle}>
                            {t('voice_search.enable_mic')}
                        </Text>
                        <Text style={styles.permSub}>
                            {t('voice_search.mic_desc')}
                        </Text>
                        <TouchableOpacity style={styles.settingsBtn} onPress={requestMicrophonePermission}>
                            <Text style={styles.settingsBtnTxt}>{t('voice_search.grant_perm')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleClose} style={{ marginTop: 14 }}>
                            <Text style={styles.laterTxt}>{t('voice_search.maybe_later')}</Text>
                        </TouchableOpacity>
                    </View>
                );

            case 'idle':
                return (
                    <View style={styles.idleBox}>
                        <MicBtn onPress={startListening} active={false} />
                        <Text style={styles.idleTitle}>
                            {t('voice_search.tap_speak')}
                        </Text>
                        <Text style={styles.idleSub}>
                            {t('voice_search.speak_hint')}
                        </Text>

                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.chipScroll}
                            style={styles.chipScrollOuter}
                        >
                            {SUGGESTIONS.map((s) => (
                                <TouchableOpacity
                                    key={s.key}
                                    style={[styles.chip, { backgroundColor: s.bg }]}
                                    onPress={() => {
                                        setTranscript(s.key);
                                        onResult?.(s.key);
                                        setVoiceState('processing');
                                    }}
                                >
                                    <Text style={[styles.chipText, { color: s.color }]}>
                                        {t(`dashboard.portfolios.${s.key.toLowerCase().split(' ')[0]}.name`, { defaultValue: s.key })}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                );

            case 'listening':
                return (
                    <View style={styles.listenBox}>
                        <MicBtn onPress={stopVoice} active={true} />
                        <Text style={styles.listenLabel}>
                            {t('voice_search.listening')}
                        </Text>
                        {/* Waveform bars */}
                        <View style={styles.barsRow}>
                            {[28, 16, 38, 22, 42, 18, 32, 14, 36, 20].map((h, i) => (
                                <Bar key={i} height={h} delay={i * 80} />
                            ))}
                        </View>
                        <Text style={styles.listenHint}>
                            {t('voice_search.tap_stop')}
                        </Text>
                    </View>
                );

            case 'processing':
                return (
                    <View style={styles.centerBox}>
                        <View style={styles.spinnerRing}>
                            <ActivityIndicator size={40} color="#6C63FF" />
                        </View>
                        <Text style={styles.stateLabel}>{t('voice_search.finding_matches')}</Text>
                        {transcript ? (
                            <View style={styles.pill}>
                                <Icon name="microphone-variant" size={13} color="#6C63FF" />
                                <Text style={styles.pillText}>{transcript}</Text>
                            </View>
                        ) : null}
                    </View>
                );

            case 'results':
                return (
                    <View style={styles.resultsBox}>
                        <View style={styles.pill}>
                            <Icon name="microphone-variant" size={13} color="#6C63FF" />
                            <Text style={styles.pillText}>{transcript}</Text>
                        </View>

                        <Text style={styles.resultsCount}>
                            {t('voice_search.results_count', { count: matches.length })}
                        </Text>

                        <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 320 }}>
                            {matches.slice(0, 8).map(m => (
                                <TouchableOpacity
                                    key={m.screen}
                                    style={[styles.card, { borderLeftColor: m.color }]}
                                    onPress={() => handleNavigate(m)}
                                    activeOpacity={0.8}
                                >
                                    <View style={[styles.cardIcon, { backgroundColor: m.bg }]}>
                                        <Icon name={m.icon} size={24} color={m.color} />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.cardName}>
                                            {m.category 
                                                ? t(`dashboard.services.${m.category}`)
                                                : t(`dashboard.portfolios.${m.screen.replace('Portfolio', '').toLowerCase() === 'spokenhindi' ? 'hindi' : m.screen.replace('Portfolio', '').toLowerCase()}.name`, { defaultValue: m.name })}
                                        </Text>
                                        <Text style={styles.cardDesc} numberOfLines={1}>
                                            {m.category
                                                ? t('experts.header_subtitle')
                                                : t(`dashboard.portfolios.${m.screen.replace('Portfolio', '').toLowerCase() === 'spokenhindi' ? 'hindi' : m.screen.replace('Portfolio', '').toLowerCase()}.tagline`, { defaultValue: m.description })}
                                        </Text>
                                    </View>
                                    <View style={styles.cardArrow}>
                                        <Icon name="chevron-right" size={20} color="#CBD5E1" />
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        <TouchableOpacity style={styles.retryRow} onPress={startListening}>
                            <Icon name="microphone" size={15} color="#6C63FF" />
                            <Text style={styles.retryTxt}>{t('voice_search.search_again')}</Text>
                        </TouchableOpacity>
                    </View>
                );

            case 'no_match':
                return (
                    <View style={styles.centerBox}>
                        <View style={styles.noMatchIcon}>
                            <Icon name="magnify-remove-outline" size={38} color="#94A3B8" />
                        </View>
                        <Text style={styles.stateLabel}>{t('voice_search.no_match')}</Text>
                        {transcript ? (
                            <View style={styles.pill}>
                                <Text style={styles.pillText}>"{transcript}"</Text>
                            </View>
                        ) : null}
                        <TouchableOpacity style={styles.retryRow} onPress={startListening}>
                            <Icon name="microphone" size={15} color="#6C63FF" />
                            <Text style={styles.retryTxt}>{t('voice_search.try_again')}</Text>
                        </TouchableOpacity>
                    </View>
                );

            case 'error':
                return (
                    <View style={styles.centerBox}>
                        <View style={styles.errorIcon}>
                            <Icon name="alert-circle-outline" size={38} color="#F97316" />
                        </View>
                        <Text style={styles.stateLabel}>
                            {errorDetails.message || t('voice_search.error')}
                        </Text>
                        <Text style={styles.stateSub}>
                            {t('voice_search.retry')}
                            {errorDetails.code ? ` (${errorDetails.code})` : ''}
                        </Text>
                        <TouchableOpacity style={styles.retryRow} onPress={startListening}>
                            <Icon name="refresh" size={15} color="#6C63FF" />
                            <Text style={styles.retryTxt}>{t('voice_search.retry')}</Text>
                        </TouchableOpacity>
                    </View>
                );

            case 'perm_denied':
                return (
                    <View style={styles.permBox}>
                        <View style={styles.permIconWrap}>
                            <View style={[styles.permIconCircle, { backgroundColor: '#FEF2F2', borderColor: '#FECACA' }]}>
                                <Icon name="microphone-off" size={44} color="#EF4444" />
                            </View>
                            <View style={styles.lockBadge}>
                                <Icon name="lock" size={11} color="#FFF" />
                            </View>
                        </View>

                        <Text style={styles.permTitle}>
                            {t('voice_search.perm_denied')}
                        </Text>

                        {permNeverAsk ? (
                            <>
                                <Text style={styles.permSub}>
                                    {t('voice_search.dont_ask_desc')}
                                </Text>
                                <TouchableOpacity style={styles.settingsBtn} onPress={() => Linking.openSettings()}>
                                    <Icon name="cog" size={17} color="#FFF" />
                                    <Text style={styles.settingsBtnTxt}>{t('voice_search.open_settings')}</Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <>
                                <Text style={styles.permSub}>
                                    {t('voice_search.mic_access_needed')}
                                </Text>
                                <TouchableOpacity
                                    style={styles.settingsBtn}
                                    onPress={requestMicrophonePermission}
                                >
                                    <Icon name="microphone" size={17} color="#FFF" />
                                    <Text style={styles.settingsBtnTxt}>
                                        {t('voice_search.grant_again')}
                                    </Text>
                                </TouchableOpacity>
                            </>
                        )}

                        <TouchableOpacity onPress={handleClose} style={{ marginTop: 14 }}>
                            <Text style={styles.laterTxt}>{t('voice_search.maybe_later')}</Text>
                        </TouchableOpacity>
                    </View>
                );

            default:
                return null;
        }
    };

    return (
        <Modal visible={visible} transparent animationType="none" statusBarTranslucent onRequestClose={handleClose}>
            {/* Backdrop */}
            <Animated.View style={[StyleSheet.absoluteFill, styles.backdrop, { opacity: backdropAnim }]}>
                <TouchableOpacity style={StyleSheet.absoluteFill} onPress={handleClose} />
            </Animated.View>

            {/* Sheet */}
            <View style={styles.sheetWrap} pointerEvents="box-none">
                <Animated.View style={[styles.sheet, { transform: [{ translateY: sheetAnim }] }]}>
                    {/* Drag handle */}
                    <View style={styles.handle} />

                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.headerLeft}>
                            <View style={styles.headerIconBg}>
                                <Icon name="microphone-variant" size={16} color="#6C63FF" />
                            </View>
                            <Text style={styles.headerTxt}>{t('voice_search.header')}</Text>
                        </View>
                        <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
                            <Icon name="close" size={20} color="#64748B" />
                        </TouchableOpacity>
                    </View>

                    {renderContent()}
                </Animated.View>
            </View>
        </Modal>
    );
};

// Animated waveform bar
const Bar: React.FC<{ height: number; delay: number }> = ({ height, delay }) => {
    const anim = useRef(new Animated.Value(height * 0.4)).current;
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.delay(delay),
                Animated.timing(anim, { toValue: height, duration: 280, useNativeDriver: false }),
                Animated.timing(anim, { toValue: height * 0.3, duration: 280, useNativeDriver: false }),
            ])
        ).start();
    }, []);
    return (
        <Animated.View style={[styles.bar, { height: anim }]} />
    );
};

const styles = StyleSheet.create({
    backdrop: { backgroundColor: 'rgba(15, 23, 42, 0.45)' },
    sheetWrap: { flex: 1, justifyContent: 'flex-end' },
    sheet: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        paddingBottom: 40,
        minHeight: 450,
        maxHeight: '94%',
        elevation: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -15 },
        shadowOpacity: 0.15, shadowRadius: 30,
    },
    handle: { width: 36, height: 4, backgroundColor: '#F1F5F9', borderRadius: 2, alignSelf: 'center', marginTop: 12 },

    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 24, paddingVertical: 18,
        borderBottomWidth: 1, borderBottomColor: '#F8FAFC',
    },
    headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    headerIconBg: {
        width: 36, height: 36, borderRadius: 12, backgroundColor: '#EFF6FF',
        alignItems: 'center', justifyContent: 'center',
    },
    headerTxt: { fontSize: 16, fontWeight: '800', color: '#1E293B', letterSpacing: 0.4, lineHeight: 24, includeFontPadding: false },
    closeBtn: {
        width: 36, height: 36, borderRadius: 18, backgroundColor: '#F8FAFC',
        alignItems: 'center', justifyContent: 'center',
    },

    // ── Idle ──────────────────────────────────────────────────────
    idleBox: { alignItems: 'center', paddingTop: 32, paddingBottom: 10, width: '100%' },
    idleTitle: { fontSize: 24, fontWeight: '900', color: '#0F172A', marginTop: 24, letterSpacing: -0.6, lineHeight: 32, textAlign: 'center', width: '100%', includeFontPadding: false },
    idleSub: { fontSize: 13, color: '#64748B', marginTop: 8, textAlign: 'center', lineHeight: 21, includeFontPadding: false, paddingHorizontal: 48, opacity: 0.8 },
    chipScrollOuter: { marginTop: 32, width: '100%' },
    chipScroll: { paddingHorizontal: 24, gap: 12 },
    chip: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 24, elevation: 1 },
    chipText: { fontSize: 12, fontWeight: '800', lineHeight: 19, includeFontPadding: false },

    // ── Mic ───────────────────────────────────────────────────────
    micWrap: { alignItems: 'center', justifyContent: 'center', width: 140, height: 140 },
    breatheRing: {
        position: 'absolute',
        width: 100, height: 100, borderRadius: 50,
        backgroundColor: '#6C63FF',
    },
    micBtn: {
        width: 88, height: 88, borderRadius: 44, backgroundColor: '#6C63FF',
        alignItems: 'center', justifyContent: 'center',
        shadowColor: '#6C63FF', shadowOffset: { width: 0, height: 15 },
        shadowOpacity: 0.4, shadowRadius: 20, elevation: 18,
        borderWidth: 4, borderColor: 'rgba(255,255,255,0.25)',
    },
    micBtnActive: { backgroundColor: '#F43F5E', shadowColor: '#F43F5E' },

    // ── Listening ─────────────────────────────────────────────────
    listenBox: { alignItems: 'center', paddingTop: 32, paddingHorizontal: 24 },
    listenLabel: { fontSize: 26, fontWeight: '900', color: '#6C63FF', marginTop: 24, lineHeight: 32, includeFontPadding: false },
    barsRow: {
        flexDirection: 'row', alignItems: 'flex-end', gap: 6,
        height: 60, marginTop: 24,
    },
    bar: { width: 6, borderRadius: 3, backgroundColor: '#6C63FF', opacity: 0.8 },
    listenHint: { fontSize: 12, color: '#94A3B8', marginTop: 18, lineHeight: 19, includeFontPadding: false, fontWeight: '700' },

    // ── Center box ────────────────────────────────────────────────
    centerBox: { alignItems: 'center', paddingVertical: 60, paddingHorizontal: 28 },
    spinnerRing: {
        width: 80, height: 80, borderRadius: 40,
        backgroundColor: '#F5F3FF', alignItems: 'center', justifyContent: 'center',
        borderWidth: 2, borderColor: '#EDE9FE',
    },
    stateLabel: { fontSize: 16, fontWeight: '800', color: '#1E293B', marginTop: 20, lineHeight: 26, includeFontPadding: false },
    stateSub: { fontSize: 13, color: '#94A3B8', marginTop: 8, textAlign: 'center', lineHeight: 21, includeFontPadding: false },

    noMatchIcon: {
        width: 80, height: 80, borderRadius: 40, backgroundColor: '#F8FAFC',
        alignItems: 'center', justifyContent: 'center',
    },
    errorIcon: {
        width: 80, height: 80, borderRadius: 40, backgroundColor: '#FFF1F2',
        alignItems: 'center', justifyContent: 'center',
    },

    // ── Pill ──────────────────────────────────────────────────────
    pill: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        backgroundColor: '#F8FAFC', borderRadius: 24,
        paddingHorizontal: 16, paddingVertical: 10, marginTop: 16,
        borderWidth: 1, borderColor: '#F1F5F9',
    },
    pillText: { fontSize: 13, color: '#475569', fontStyle: 'italic', fontWeight: '800', lineHeight: 21, includeFontPadding: false },

    // ── Results ───────────────────────────────────────────────────
    resultsBox: { paddingHorizontal: 24, paddingTop: 18 },
    resultsCount: {
        fontSize: 11, fontWeight: '900', color: '#6C63FF',
        textTransform: 'uppercase', letterSpacing: 1.5, marginVertical: 14,
        lineHeight: 18, includeFontPadding: false,
    },
    card: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#FFFFFF', borderRadius: 24, padding: 16,
        marginBottom: 14, borderLeftWidth: 5,
        elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06, shadowRadius: 10,
        gap: 16,
    },
    cardIcon: { width: 56, height: 56, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
    cardName: { fontSize: 16, fontWeight: '800', color: '#0F172A', lineHeight: 24, includeFontPadding: false },
    cardDesc: { fontSize: 11, color: '#64748B', marginTop: 4, lineHeight: 18, includeFontPadding: false },
    cardArrow: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC' },

    // ── Retry row ─────────────────────────────────────────────────
    retryRow: {
        flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'center',
        marginTop: 20, paddingVertical: 12, paddingHorizontal: 32,
        borderRadius: 28, backgroundColor: '#F5F3FF',
        alignSelf: 'center',
        borderWidth: 1, borderColor: '#EDE9FE',
    },
    retryTxt: { fontSize: 13, fontWeight: '800', color: '#6C63FF', lineHeight: 21, includeFontPadding: false },

    // ── Permission Box ────────────────────────────────────────────
    permBox: { alignItems: 'center', paddingHorizontal: 32, paddingTop: 40, paddingBottom: 10 },
    permIconWrap: { position: 'relative' },
    permIconCircle: {
        width: 100, height: 100, borderRadius: 50,
        backgroundColor: '#F5F3FF', borderWidth: 2, borderColor: '#E0E7FF',
        alignItems: 'center', justifyContent: 'center',
        marginBottom: 24,
    },
    permTitle: { fontSize: 26, fontWeight: '900', color: '#1E293B', textAlign: 'center', lineHeight: 40, includeFontPadding: false },
    permSub: { fontSize: 14, color: '#64748B', marginTop: 12, textAlign: 'center', lineHeight: 22, includeFontPadding: false, opacity: 0.9 },
    settingsBtn: {
        backgroundColor: '#6C63FF', borderRadius: 20,
        paddingVertical: 18, paddingHorizontal: 40, marginTop: 36, width: '100%',
        shadowColor: '#6C63FF', shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.4, shadowRadius: 20, elevation: 12,
        alignItems: 'center', justifyContent: 'center',
        flexDirection: 'row', gap: 10,
    },
    settingsBtnTxt: { fontSize: 16, fontWeight: '900', color: '#FFF', lineHeight: 26, includeFontPadding: false },
    laterTxt: { fontSize: 13, color: '#94A3B8', marginTop: 24, fontWeight: '700', letterSpacing: 0.5 },
    lockBadge: {
        position: 'absolute', bottom: 4, right: 4,
        width: 32, height: 32, borderRadius: 16, backgroundColor: '#F43F5E',
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 3, borderColor: '#FFF',
    },
});

export default VoiceSearchModal;
