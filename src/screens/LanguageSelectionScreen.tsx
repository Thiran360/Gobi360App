import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    StatusBar,
    Dimensions,
    Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
    LanguageSelection: undefined;
    Login: undefined;
    UserSignup: undefined;
    UserMainTabs: undefined;
    AdminDashboard: undefined;
};

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'LanguageSelection'>;
};

const { width, height } = Dimensions.get('window');

const LanguageSelectionScreen = ({ navigation }: Props) => {
    const { t, i18n } = useTranslation();
    const [selectedLanguage, setSelectedLanguage] = useState<string | null>(
        i18n.language === 'ta' ? 'tamil' : i18n.language === 'th' ? 'thanglish' : 'english'
    );

    const handleLanguageSelect = async (lang: string) => {
        setSelectedLanguage(lang);
        let langCode = 'en';
        if (lang === 'tamil') langCode = 'ta';
        if (lang === 'thanglish') langCode = 'th';

        await i18n.changeLanguage(langCode);

        try {
            await AsyncStorage.setItem('user-language', langCode);
        } catch (error) {
            console.error('Error saving language preference:', error);
        }

        setTimeout(() => {
            if (navigation.canGoBack()) {
                navigation.goBack();
            } else {
                navigation.replace('UserMainTabs');
            }
        }, 600);
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

            {/* Premium Background Elements */}
            <View style={styles.backgroundContainer}>
                <View style={styles.circle1} />
                <View style={styles.circle2} />
                <View style={styles.circle3} />
            </View>

            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={styles.setupBadge}>
                        <Text style={styles.setupBadgeText}>PREFERENCE</Text>
                    </View>
                    <Text style={styles.mainTitle}>Choose Your{"\n"}Language</Text>
                    <Text style={styles.mainSubtitle}>Select a primary language to personalize your experience</Text>
                </View>

                <View style={styles.selectionGrid}>
                    <TouchableOpacity
                        style={[
                            styles.langCard,
                            selectedLanguage === 'english' && styles.langCardSelected
                        ]}
                        onPress={() => handleLanguageSelect('english')}
                        activeOpacity={0.9}
                    >
                        <View style={[
                            styles.langIconCircle,
                            selectedLanguage === 'english' && styles.langIconCircleActive
                        ]}>
                            <Text style={[styles.langIconChar, selectedLanguage === 'english' && styles.langIconCharActive]}>A</Text>
                        </View>
                        <View style={styles.langTextContainer}>
                            <Text style={styles.langName}>English</Text>
                            <Text style={styles.langDesc}>Native international</Text>
                        </View>
                        <View style={[styles.customRadio, selectedLanguage === 'english' && styles.customRadioActive]}>
                            {selectedLanguage === 'english' && <View style={styles.customRadioInner} />}
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.langCard,
                            selectedLanguage === 'tamil' && styles.langCardSelected
                        ]}
                        onPress={() => handleLanguageSelect('tamil')}
                        activeOpacity={0.9}
                    >
                        <View style={[
                            styles.langIconCircle,
                            selectedLanguage === 'tamil' && styles.langIconCircleActive
                        ]}>
                            <Text style={[styles.langIconChar, selectedLanguage === 'tamil' && styles.langIconCharActive]}>த</Text>
                        </View>
                        <View style={styles.langTextContainer}>
                            <Text style={styles.langName}>Tamil</Text>
                            <Text style={styles.langDesc}>Generation language</Text>
                        </View>
                        <View style={[styles.customRadio, selectedLanguage === 'tamil' && styles.customRadioActive]}>
                            {selectedLanguage === 'tamil' && <View style={styles.customRadioInner} />}
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.langCard,
                            selectedLanguage === 'thanglish' && styles.langCardSelected
                        ]}
                        onPress={() => handleLanguageSelect('thanglish')}
                        activeOpacity={0.9}
                    >
                        <View style={[
                            styles.langIconCircle,
                            selectedLanguage === 'thanglish' && styles.langIconCircleActive
                        ]}>
                            <Text style={[styles.langIconChar, selectedLanguage === 'thanglish' && styles.langIconCharActive]}>Ta</Text>
                        </View>
                        <View style={styles.langTextContainer}>
                            <Text style={styles.langName}>Thanglish</Text>
                            <Text style={styles.langDesc}>Tamil in English script</Text>
                        </View>
                        <View style={[styles.customRadio, selectedLanguage === 'thanglish' && styles.customRadioActive]}>
                            {selectedLanguage === 'thanglish' && <View style={styles.customRadioInner} />}
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={styles.footerInfo}>
                    <Text style={styles.footerNote}>You can change this later in settings</Text>
                </View>
            </View>
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
        overflow: 'hidden',
    },
    circle1: {
        position: 'absolute',
        top: -height * 0.15,
        right: -width * 0.2,
        width: width * 0.9,
        height: width * 0.9,
        borderRadius: (width * 0.9) / 2,
        backgroundColor: '#DBEAFE',
        opacity: 0.6,
    },
    circle2: {
        position: 'absolute',
        bottom: -height * 0.1,
        left: -width * 0.3,
        width: width * 1.1,
        height: width * 1.1,
        borderRadius: (width * 1.1) / 2,
        backgroundColor: '#EFF6FF',
        opacity: 0.7,
    },
    circle3: {
        position: 'absolute',
        top: height * 0.4,
        right: -width * 0.3,
        width: width * 0.6,
        height: width * 0.6,
        borderRadius: (width * 0.6) / 2,
        backgroundColor: '#F1F5F9',
        opacity: 0.5,
    },
    content: {
        flex: 1,
        paddingHorizontal: width * 0.07,
        justifyContent: 'center',
    },
    header: {
        marginBottom: 48,
    },
    setupBadge: {
        backgroundColor: '#3B82F6',
        alignSelf: 'flex-start',
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 30,
        marginBottom: 20,
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    setupBadgeText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1.5,
        lineHeight: 16,
        includeFontPadding: false,
    },
    mainTitle: {
        fontSize: 38,
        fontWeight: '900',
        color: '#0F172A',
        lineHeight: 61,
        letterSpacing: -1.5,
        marginBottom: 16,
        includeFontPadding: false,
    },
    mainSubtitle: {
        fontSize: 15,
        color: '#64748B',
        lineHeight: 24,
        fontWeight: '500',
        maxWidth: '90%',
        includeFontPadding: false,
    },
    selectionGrid: {
        gap: 16,
    },
    langCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: 24,
        borderRadius: 30,
        borderWidth: 1.5,
        borderColor: '#F1F5F9',
        shadowColor: '#1E293B',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05,
        shadowRadius: 20,
        elevation: 5,
    },
    langCardSelected: {
        borderColor: '#3B82F6',
        backgroundColor: '#FFFFFF',
        transform: [{ scale: 1.02 }],
    },
    langIconCircle: {
        width: 60,
        height: 60,
        borderRadius: 22,
        backgroundColor: '#F8FAFC',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    langIconCircleActive: {
        backgroundColor: '#3B82F6',
        borderColor: '#3B82F6',
    },
    langIconChar: {
        fontSize: 24,
        fontWeight: '900',
        color: '#475569',
        lineHeight: 41,
        includeFontPadding: false,
    },
    langIconCharActive: {
        color: '#FFFFFF',
    },
    langTextContainer: {
        flex: 1,
    },
    langName: {
        fontSize: 18,
        fontWeight: '800',
        color: '#0F172A',
        marginBottom: 4,
        lineHeight: 29,
        includeFontPadding: false,
    },
    langDesc: {
        fontSize: 12,
        color: '#94A3B8',
        fontWeight: '600',
        lineHeight: 19,
        includeFontPadding: false,
    },
    customRadio: {
        width: 26,
        height: 26,
        borderRadius: 13,
        borderWidth: 2,
        borderColor: '#E2E8F0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    customRadioActive: {
        borderColor: '#3B82F6',
    },
    customRadioInner: {
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#3B82F6',
    },
    footerInfo: {
        marginTop: 40,
        alignItems: 'center',
    },
    footerNote: {
        fontSize: 12,
        color: '#94A3B8',
        fontWeight: '600',
        lineHeight: 19,
        includeFontPadding: false,
    },
});

export default LanguageSelectionScreen;

