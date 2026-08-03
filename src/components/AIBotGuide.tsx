import React, { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Dimensions,
    Modal,
    Platform,
    PermissionsAndroid,
    ActivityIndicator,
    Image,
    Easing,
    ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import Voice, { SpeechResultsEvent, SpeechErrorEvent } from '@react-native-voice/voice';
import Tts from 'react-native-tts';
const MALE_CLOSED = require('../assets/images/ai_human_male_closed.jpg');
const MALE_OPEN = require('../assets/images/ai_human_male_open.jpg');
const FEMALE_CLOSED = require('../assets/images/ai_human_female_closed.jpg');
const FEMALE_OPEN = require('../assets/images/ai_human_female_open.jpg');

import { PORTFOLIO_SEARCH_MAP, findPortfolioMatches, PortfolioMatch } from '../utils/voiceSearchKeywords';
import { SERVICE_KEYWORDS, EXPERT_KEYWORDS } from '../utils/searchKeywords';

const { width, height } = Dimensions.get('window');

interface Expert {
    id: string;
    name: string;
    job: string;
    rating: string;
    image: string;
    phone: string;
}

// EXPERTS_DATA removed - now using PORTFOLIO_SEARCH_MAP for all service matches

// Service mapping is now derived from PORTFOLIO_SEARCH_MAP in voiceSearchKeywords.ts

const AssistantState = {
    IDLE: 'idle',
    BOT_SPEAKING: 'bot_speaking',
    LISTENING: 'listening',
    PROCESSING: 'processing',
    RESULTS: 'results',
    NO_MATCH: 'no_match'
} as const;

type AssistantType = typeof AssistantState[keyof typeof AssistantState];

export interface AIBotGuideRef {
    open: () => void;
}

interface Props {
    onClose?: () => void;
}

const AIBotGuide = forwardRef<AIBotGuideRef, Props>((props, ref) => {
    const { t, i18n } = useTranslation();
    const botLanguage = i18n.language;
    const isTa = botLanguage === 'ta';
    const isTh = botLanguage === 'th';
    const navigation = useNavigation<any>();

    const [isVisible, setIsVisible] = useState(false);
    const [state, setState] = useState<AssistantType>(AssistantState.IDLE);
    const [botMsg, setBotMsg] = useState(t('bot.welcome'));
    const [userText, setUserText] = useState('');
    const [matchedPortfolios, setMatchedPortfolios] = useState<PortfolioMatch[]>([]);
    const [mouthOpen, setMouthOpen] = useState(false);

    // Animations
    const botSlide = useRef(new Animated.Value(50)).current;
    const botOpacity = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(0)).current;
    const rippleAnim = useRef(new Animated.Value(0)).current;
    const waveAnim = useRef(new Animated.Value(0)).current;
    const mouthInterval = useRef<ReturnType<typeof setInterval> | null>(null);
    const ttsRef = useRef<{
        ready: boolean;
        cachedVoices: any[] | null;
        currentLang: string | null;
    }>({
        ready: false,
        cachedVoices: null,
        currentLang: null
    });

    const setupTtsVoice = async (isTaLang: boolean): Promise<boolean> => {
        try {
            const targetLang = isTaLang ? 'ta-IN' : 'en-IN';
            
            // Skip if already setup for this language
            if (ttsRef.current.ready && ttsRef.current.currentLang === targetLang) {
                return true;
            }

            await Tts.getInitStatus().catch(() => {});

            // 1. Set language first (fast)
            await Tts.setDefaultLanguage(targetLang);
            ttsRef.current.currentLang = targetLang;

            // 2. Only fetch voices if not cached (slow call)
            if (!ttsRef.current.cachedVoices) {
                ttsRef.current.cachedVoices = await Tts.voices().catch(() => []);
            }
            
            const voices = ttsRef.current.cachedVoices || [];
            let bestVoice;

            if (isTaLang) {
                const taVoices = voices.filter(v => v.language.startsWith('ta'));
                bestVoice = taVoices.sort((a, b) => {
                    const isANet = a.id.toLowerCase().includes('network') || a.id.toLowerCase().includes('neural');
                    const isBNet = b.id.toLowerCase().includes('network') || b.id.toLowerCase().includes('neural');
                    return isANet && !isBNet ? -1 : (!isANet && isBNet ? 1 : 0);
                })[0];
            } else {
                const targetIds = ['en-in-x-end-network', 'en-in-x-ene-network', 'en-in-x-enf-network'];
                for (const id of targetIds) {
                    bestVoice = voices.find(v => v.id.toLowerCase().includes(id));
                    if (bestVoice) break;
                }
                if (!bestVoice) bestVoice = voices.find(v => v.language.startsWith('en-IN') || v.language.startsWith('en'));
            }

            if (bestVoice) {
                await Tts.setDefaultVoice(bestVoice.id).catch(() => {});
                Tts.setDefaultRate(isTaLang ? 0.48 : 0.52);
                Tts.setDefaultPitch(1.0);
            }
            
            ttsRef.current.ready = true;
            return true;
        } catch (e) {
            ttsRef.current.ready = false;
            return false;
        }
    };

    // Initialization handled inside startAssistant to avoid race conditions
    // and ensuring voice engine is ready before first speak command.

    useEffect(() => {
        // Pre-initialise TTS on mount to prevent "TTS not ready" on first open
        // Silence all early rejections to avoid "Uncaught in promise" errors
        Tts.getInitStatus()
            .then(() => { ttsRef.current.ready = true; })
            .catch(() => { ttsRef.current.ready = false; });

        // Mouth animation listeners
        const startListener = Tts.addListener('tts-start', () => {
            if (mouthInterval.current) clearInterval(mouthInterval.current);
            mouthInterval.current = setInterval(() => {
                setMouthOpen(prev => !prev);
            }, 120);
        });

        const finishListener = Tts.addListener('tts-finish', () => {
            if (mouthInterval.current) clearInterval(mouthInterval.current);
            mouthInterval.current = null;
            setMouthOpen(false);
        });

        const cancelListener = Tts.addListener('tts-cancel', () => {
            if (mouthInterval.current) clearInterval(mouthInterval.current);
            mouthInterval.current = null;
            setMouthOpen(false);
        });

        // Suppress unhandled promise rejection from TTS not being ready
        const errorListener = Tts.addListener('tts-error', (err: any) => {
            console.warn('TTS error (suppressed):', err);
        });

        return () => {
            Tts.stop();
            startListener.remove();
            finishListener.remove();
            cancelListener.remove();
            errorListener.remove();
            if (mouthInterval.current) clearInterval(mouthInterval.current);
        };
    }, [isTa, botLanguage]);

    // Safe speak helper — never throws, silently skips if TTS not ready
    const speakSafe = async (msg: string) => {
        try {
            if (!ttsRef.current.ready) {
                const ready = await Tts.getInitStatus().then(() => true).catch(() => false);
                if (!ready) return;
                ttsRef.current.ready = true;
            }
            // Use try-catch specifically for speak to handle "not ready" edge cases
            try {
                Tts.stop();
                Tts.speak(msg);
            } catch (e) {
                console.log('Speak failed:', e);
            }
        } catch (e) {}
    };

    useEffect(() => {
        if (isVisible) {
            Voice.onSpeechStart = () => {
                setState(AssistantState.LISTENING);
                // Waving animation when starts listening
                Animated.sequence([
                    Animated.timing(waveAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
                    Animated.timing(waveAnim, { toValue: -1, duration: 400, useNativeDriver: true }),
                    Animated.timing(waveAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
                ]).start();
            };
            Voice.onSpeechResults = (e: SpeechResultsEvent) => {
                const text = e.value?.[0] ?? '';
                setUserText(text);
                processVoiceInput(text);
            };
            Voice.onSpeechPartialResults = (e: SpeechResultsEvent) => {
                const text = e.value?.[0] ?? '';
                if (text.trim().length > 2) {
                    setUserText(text);
                    // Process partial results if they seem substantial
                    processVoiceInput(text, true);
                }
            };
            Voice.onSpeechError = (e: SpeechErrorEvent) => {
                console.warn('Voice Error:', e);
                if (state === AssistantState.LISTENING) {
                    setState(AssistantState.NO_MATCH);
                }
            };
        } else {
            Voice.removeAllListeners();
        }
        return () => { Voice.removeAllListeners(); };
    }, [isVisible, isTa, state]);

    useImperativeHandle(ref, () => ({
        open: () => startAssistant()
    }));

    useEffect(() => {
        if (state === AssistantState.LISTENING) {
            const loopPulse = Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
                    Animated.timing(pulseAnim, { toValue: 0, duration: 1000, useNativeDriver: true }),
                ])
            );
            loopPulse.start();

            const loopRipple = Animated.loop(
                Animated.timing(rippleAnim, { toValue: 1, duration: 2000, easing: Easing.out(Easing.quad), useNativeDriver: true })
            );
            loopRipple.start();

            return () => {
                loopPulse.stop();
                loopRipple.stop();
            };
        } else {
            pulseAnim.setValue(0);
            rippleAnim.setValue(0);
        }
    }, [state]);

    const startAssistant = async () => {
        setIsVisible(true);
        setState(AssistantState.BOT_SPEAKING);
        setBotMsg(t('bot.welcome', { lng: isTa ? 'ta' : 'en' }));

        Animated.parallel([
            Animated.spring(botSlide, { toValue: 0, friction: 8, useNativeDriver: true }),
            Animated.timing(botOpacity, { toValue: 1, duration: 800, useNativeDriver: true })
        ]).start();

        // Run setup and speak in background to not block the UI entry
        setupTtsVoice(isTa).then(ready => {
            if (ready) {
                speakSafe(t('bot.welcome', { lng: isTa ? 'ta' : 'en' }));
            }
        });
    };

    // Trigger voice recognition after welcome message
    useEffect(() => {
        if (isVisible && state === AssistantState.BOT_SPEAKING) {
            const timer = setTimeout(() => {
                startListening();
            }, 1800); // Reduced from 3500ms for faster interaction
            return () => clearTimeout(timer);
        }
    }, [isVisible, state]);

    const startListening = async () => {
        try {
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
                );
                if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                    setBotMsg(t('bot.mic_denied'));
                    setState(AssistantState.NO_MATCH);
                    return;
                }
            }

            setState(AssistantState.LISTENING);
            setUserText('');
            const locale = (isTa || isTh) ? 'ta-IN' : 'en-IN';

            try {
                await Voice.stop();
                await new Promise<void>(resolve => setTimeout(resolve, 300)); // Small delay for cleanup
            } catch (e) { }

            await Voice.start(locale);
        } catch (e) {
            console.warn('Start Listening Fail:', e);
            setState(AssistantState.NO_MATCH);
        }
    };

    const processVoiceInput = async (text: string, isPartial: boolean = false) => {
        const lowerText = text.toLowerCase();
        let currentIsTa = isTa;

        // Auto-detect Tamil characters or naturally spoken transliterated Tamil words
        const tamilTriggers = [
            'tamil', 'தமிழ்', 'enakku', 'enaku', 'venum', 'vendum', 'thevai', 'epadi', 'eppadi',
            'irukinga', 'irukkeenga', 'vanakkam', 'nandri', 'seiyya', 'seingal',
            'panuga', 'pannuga', 'yaar', 'yaaru', 'enga', 'enge', 'thanga', 'kudunga',
            'venam', 'vendaam', 'illai', 'ille'
        ];

        const isTamilDetect = /[\u0B80-\u0BFF]/.test(text) || tamilTriggers.some(word => lowerText.includes(word));
        const isEnglishDetect = lowerText.includes('english') || lowerText.includes('ஆங்கிலம்') || lowerText.includes('aangilam') || lowerText.includes('i want');

        if (isTamilDetect) {
            if (!currentIsTa) {
                await i18n.changeLanguage('ta');
                currentIsTa = true;
                await setupTtsVoice(true);
            }
        } else if (isEnglishDetect) {
            if (currentIsTa) {
                await i18n.changeLanguage('en');
                currentIsTa = false;
                await setupTtsVoice(false);
            }
        }

        // Small Talk
        if (lowerText.includes('how are you') || lowerText.includes('எப்படி இருக்கிறீர்கள்')) {
            const msg = currentIsTa ? 'நான் நன்றாக இருக்கிறேன், நன்றி! உங்களுக்கு எப்படி உதவட்டும்?' : "I'm doing great, thank you! How can I help you today?";
            setBotMsg(msg);
            if (await setupTtsVoice(currentIsTa)) {
                speakSafe(msg);
            }
            setState(AssistantState.IDLE);
            return;
        }

        setState(AssistantState.PROCESSING);
        const matches = findPortfolioMatches(text);

        if (matches.length > 0) {
            setMatchedPortfolios(matches);
            
            // Only speak if it's the final result or if we haven't found matches yet
            if (!isPartial) {
                let msg: string;
                if (matches.length === 1) {
                    const name = currentIsTa ? matches[0].name_ta : matches[0].name;
                    msg = t('bot.found_specialist', { name, lng: currentIsTa ? 'ta' : 'en' });
                } else {
                    msg = t('bot.match_multiple', { count: matches.length, lng: currentIsTa ? 'ta' : 'en' });
                }
                if (await setupTtsVoice(currentIsTa)) {
                    speakSafe(msg);
                }
            }
            setState(AssistantState.RESULTS);
        } else if (!isPartial) {
            const msg = t('bot.not_sure', { lng: currentIsTa ? 'ta' : 'en' });
            setBotMsg(msg);
            if (await setupTtsVoice(currentIsTa)) {
                speakSafe(msg);
            }
            setState(AssistantState.NO_MATCH);
        }
    };

    const toggleLanguage = async () => {
        const newLang = i18n.language === 'ta' ? 'en' : 'ta';
        const isNewLangTa = newLang === 'ta';

        // Stop currently playing voice
        Tts.stop();

        // Change global language
        await i18n.changeLanguage(newLang);

        // Await the native TTS engine changing completely before speaking
        await setupTtsVoice(isNewLangTa);

        const msg = isNewLangTa ? 'நான் இப்போது தமிழில் பேசுகிறேன்' : 'I am now speaking in English';

        setBotMsg(msg);

        if (await setupTtsVoice(isNewLangTa)) {
            speakSafe(msg);
        }
        setState(AssistantState.IDLE);
    };

    const navigateToExpert = (item: PortfolioMatch) => {
        setIsVisible(false);
        props.onClose?.();
        if (item.screen === 'SkylineServiceDetail' && item.serviceId) {
            navigation.navigate('SkylineServiceDetail' as any, { serviceId: item.serviceId });
        } else {
            navigation.navigate(item.screen || 'Experts', { filter: item.category });
        }
    };

    const handleClose = async () => {
        try {
            await Voice.stop();
            await Voice.destroy();
            Tts.stop();
        } catch (e) { }
        setIsVisible(false);
        props.onClose?.();
    };

    return (
        <Modal
            visible={isVisible}
            animationType="fade"
            transparent={true}
            onRequestClose={handleClose}
        >
            <View style={styles.container}>
                <View style={[styles.gradientBg, { backgroundColor: '#2563EB' }]} />

                <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
                    <Icon name="close" size={28} color="#FFFFFF" />
                </TouchableOpacity>

                <Animated.View style={[
                    styles.content,
                    { transform: [{ translateY: botSlide }], opacity: botOpacity }
                ]}>
                    <Text style={styles.mainTitle}>OneTouch AI Guide</Text>

                    <View style={styles.botContainer}>
                        {state === AssistantState.LISTENING && (
                            <Animated.View style={[
                                styles.ripple,
                                {
                                    transform: [{ scale: rippleAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 2.5] }) }],
                                    opacity: rippleAnim.interpolate({ inputRange: [0, 0.8, 1], outputRange: [0.6, 0.3, 0] })
                                }
                            ]} />
                        )}
                        <Animated.View style={[
                            styles.botAvatar,
                            {
                                transform: [
                                    { translateY: waveAnim.interpolate({ inputRange: [-1, 1], outputRange: [-5, 5] }) },
                                    { rotate: waveAnim.interpolate({ inputRange: [-1, 1], outputRange: ['-5deg', '5deg'] }) },
                                    { scale: pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.05] }) }
                                ]
                            }
                        ]}>
                            <Image
                                source={mouthOpen ? (botLanguage === 'ta' ? FEMALE_OPEN : MALE_OPEN) : (botLanguage === 'ta' ? FEMALE_CLOSED : MALE_CLOSED)}
                                style={styles.botAvatarImg}
                                resizeMode="cover"
                            />
                        </Animated.View>
                        <TouchableOpacity style={styles.langToggle} onPress={() => toggleLanguage()}>
                            <Text style={styles.langToggleText}>{botLanguage === 'ta' ? 'TA' : 'EN'}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.bubble}>
                        <Text style={styles.botText}>{botMsg}</Text>
                        <View style={styles.bubbleArrow} />
                    </View>



                    {state === AssistantState.LISTENING && (
                        <View style={styles.listeningContainer}>
                            <ActivityIndicator size="small" color="#FFFFFF" />
                            <Text style={styles.listeningText}>{t('bot.listening')}</Text>
                        </View>
                    )}

                    {userText !== '' && (
                        <Text style={styles.userTranscript}>"{userText}"</Text>
                    )}

                    {state === AssistantState.RESULTS && (
                        <View style={styles.resultsContainer}>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.expertScroll}>
                                {matchedPortfolios.map(item => (
                                    <TouchableOpacity
                                        key={item.screen + (item.category || item.name)}
                                        style={styles.expertCard}
                                        onPress={() => navigateToExpert(item)}
                                    >
                                        <Image 
                                            source={typeof item.image === 'string' ? { uri: item.image } : item.image} 
                                            style={styles.expertImage} 
                                        />
                                        <View style={styles.expertInfo}>
                                            <Text style={styles.expertName} numberOfLines={1}>
                                                {isTa ? item.name_ta : item.name}
                                            </Text>
                                            <Text style={styles.expertRatingText}>
                                                {isTa ? item.description_ta : item.description}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    )}

                    {state === AssistantState.NO_MATCH && (
                        <TouchableOpacity style={styles.retryBtn} onPress={startListening}>
                            <Icon name="microphone" size={20} color="#2563EB" />
                            <Text style={styles.retryText}>{t('bot.try_again')}</Text>
                        </TouchableOpacity>
                    )}

                    {(state === AssistantState.IDLE || state === AssistantState.BOT_SPEAKING || state === AssistantState.RESULTS) && (
                        <TouchableOpacity style={styles.micBtn} onPress={startListening}>
                            <Icon name="microphone" size={32} color="#2563EB" />
                        </TouchableOpacity>
                    )}
                </Animated.View>
            </View>
        </Modal>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    gradientBg: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.95,
    },
    closeBtn: {
        position: 'absolute',
        top: 50,
        right: 25,
        zIndex: 10,
    },
    content: {
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 20,
    },
    mainTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 40,
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    botContainer: {
        width: 160,
        height: 160,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    },
    botAvatar: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: '#FFFFFF',
        overflow: 'hidden',
    },
    botAvatarImg: {
        width: '100%',
        height: '100%',
    },

    langToggle: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    langToggleText: {
        color: '#2563EB',
        fontWeight: 'bold',
        fontSize: 12,
    },

    ripple: {
        position: 'absolute',
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#FFFFFF',
    },
    bubble: {
        backgroundColor: '#FFFFFF',
        padding: 24,
        borderRadius: 24,
        width: '90%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        elevation: 10,
        position: 'relative',
        marginBottom: 20,
        borderWidth: 2,
        borderColor: '#E0E7FF',
    },
    bubbleArrow: {
        position: 'absolute',
        top: -10,
        left: '50%',
        marginLeft: -10,
        width: 0,
        height: 0,
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderBottomWidth: 10,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: '#FFFFFF',
        transform: [{ rotate: '180deg' }],
    },
    botText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1E293B',
        textAlign: 'center',
        lineHeight: 26,
    },
    listeningContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    listeningText: {
        color: '#FFFFFF',
        marginLeft: 8,
        fontWeight: '700',
        fontSize: 14,
    },
    userTranscript: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 16,
        fontWeight: '700',
        fontStyle: 'italic',
        marginTop: 15,
        textAlign: 'center',
        backgroundColor: 'rgba(0,0,0,0.1)',
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 10,
    },

    resultsContainer: {
        marginTop: 30,
        width: '100%',
    },
    expertScroll: {
        paddingHorizontal: 20,
        gap: 15,
    },
    expertCard: {
        width: 150,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 10,
        shadowColor: '#000',
        elevation: 5,
    },
    expertImage: {
        width: '100%',
        height: 100,
        borderRadius: 15,
        marginBottom: 8,
    },
    expertInfo: {
        alignItems: 'center',
    },
    expertName: {
        fontSize: 13,
        fontWeight: '800',
        color: '#1E293B',
    },
    expertRatingText: {
        fontSize: 11,
        color: '#64748B',
        textAlign: 'center',
        marginTop: 2,
    },
    micBtn: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
    },
    retryBtn: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 30,
        marginTop: 30,
        alignItems: 'center',
    },
    retryText: {
        color: '#2563EB',
        fontWeight: '800',
        marginLeft: 8,
    },
});

export default AIBotGuide;
