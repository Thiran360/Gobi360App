import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    StatusBar,
    Dimensions,
    ScrollView,
    ImageBackground,
    Animated,
    Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import React, { useRef, useState } from 'react';
import FloatingCartButton from '../components/FloatingCartButton';
import { useTranslation } from 'react-i18next';
import FloatingContactButtons from '../components/FloatingContactButtons';

import { checkSessionAndNavigate } from '../utils/auth';
import { triggerCall } from '../utils/callTracker';

// Local Assets
const HINDI_HERO = require('../assets/images/hindi1.png');
const MILITARY_TEACHER = require('../assets/images/military_teacher.png');
const GROUP_DISCUSSION = require('../assets/images/group_discussion.png');
const CORPORATE_HINDI = require('../assets/images/corporate_hindi.png');
const HINDI_CEREMONY = require('../assets/images/hindi_certifications.png');

const { width, height } = Dimensions.get('window');


const SpokenHindiPortfolioScreen = ({ navigation }: any) => {
    const { t } = useTranslation();
    const scrollY = useRef(new Animated.Value(0)).current;

    const SERVICES = [
        {
            id: 1,
            title: t('portfolio.spoken.services.s1_title'),
            desc: t('portfolio.spoken.services.s1_desc'),
            icon: 'microphone-variant',
            color: '#0EA5E9',
            accent: '#F0F9FF',
            analysis: t('portfolio.spoken.services.s1_analysis'),
            image: MILITARY_TEACHER
        },
        {
            id: 2,
            title: t('portfolio.spoken.services.s2_title'),
            desc: t('portfolio.spoken.services.s2_desc'),
            icon: 'briefcase-outline',
            color: '#0EA5E9',
            accent: '#F0F9FF',
            analysis: t('portfolio.spoken.services.s2_analysis'),
            image: CORPORATE_HINDI
        },
        {
            id: 3,
            title: t('portfolio.spoken.services.s3_title'),
            desc: t('portfolio.spoken.services.s3_desc'),
            icon: 'account-group-outline',
            color: '#0EA5E9',
            accent: '#F0F9FF',
            analysis: t('portfolio.spoken.services.s3_analysis'),
            image: GROUP_DISCUSSION
        },
        {
            id: 4,
            title: t('portfolio.spoken.services.s4_title'),
            desc: t('portfolio.spoken.services.s4_desc'),
            icon: 'certificate-outline',
            color: '#0EA5E9',
            accent: '#F0F9FF',
            analysis: t('portfolio.spoken.services.s4_analysis'),
            image: HINDI_CEREMONY
        }
    ];

    const headerScale = scrollY.interpolate({
        inputRange: [-100, 0, 100],
        outputRange: [1.1, 1, 1],
    });

    const contactExpert = (type: 'call' | 'whatsapp') => {
        checkSessionAndNavigate(navigation, () => {
            if (type === 'call') {
                triggerCall('6397255377', 'Raunuva Veerans (Surendar)');
            } else {
                const msg = t('portfolio.spoken.whatsapp_msg');
                Linking.openURL(`whatsapp://send?phone=916397255377&text=${encodeURIComponent(msg)}`);
            }
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

            <ScrollView
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
            >
                {/* Hero Banner */}
                <Animated.View style={[styles.heroContainer, { transform: [{ scale: headerScale }] }]}>
                    <ImageBackground
                        source={HINDI_HERO}
                        style={styles.heroBackground}
                    >
                        <View style={styles.heroOverlay}>
                            <View style={styles.topBadges}>
                                <View style={styles.premiumBadge}>
                                    <Icon name="translate" size={14} color="#0EA5E9" />
                                    <Text style={styles.premiumBadgeText}>{t('portfolio.spoken.service_tag')}</Text>
                                </View>
                                <View style={styles.yearBadge}>
                                    <Text style={styles.yearBadgeText}>{t('portfolio.common.established')} 2022</Text>
                                </View>
                            </View>

                            <View style={styles.heroContent}>
                                <Text style={styles.businessTitle}>{t('dashboard.portfolios.hindi.name')}</Text>
                                <Text style={styles.businessSubtitle}>{t('dashboard.portfolios.hindi.tagline')}</Text>

                                <View style={styles.locationContainer}>
                                    <Icon name="map-marker-radius" size={18} color="#0EA5E9" />
                                    <Text style={styles.locationText}>{t('portfolio.spoken.location')}</Text>
                                </View>
                            </View>
                        </View>
                    </ImageBackground>
                </Animated.View>

                {/* Content Section */}
                <View style={styles.contentWrapper}>

                        <>
                            <View style={styles.introHeader}>
                                <View style={styles.dotLine} />
                                <Text style={styles.sectionTitle}>{t('portfolio.spoken.section_header')}</Text>
                                <View style={styles.dotLine} />
                            </View>

                            {/* Services Cards */}
                            {SERVICES.map((service) => (
                                <View key={service.id} style={styles.serviceSection}>
                                    <TouchableOpacity activeOpacity={0.9} style={styles.cardContainer}>
                                        <ImageBackground
                                            source={typeof service.image === 'number' ? service.image : { uri: service.image }}
                                            style={styles.cardImage}
                                            imageStyle={{ borderRadius: 24 }}
                                        >
                                            <View style={styles.imageOverlay} />
                                        </ImageBackground>

                                        <View style={styles.serviceInfo}>
                                            <View style={styles.titleRow}>
                                                <View style={[styles.iconBox, { backgroundColor: service.accent }]}>
                                                    <Icon name={service.icon} size={24} color={service.color} />
                                                </View>
                                                <View style={styles.titleTextContainer}>
                                                    <Text style={styles.serviceName}>{service.title}</Text>
                                                    <Text style={styles.serviceTag}>{t('portfolio.spoken.service_tag')}</Text>
                                                </View>
                                            </View>

                                            <Text style={styles.serviceDesc}>{service.desc}</Text>

                                            <View style={[styles.analysisCard, { borderLeftColor: service.color }]}>
                                                <View style={styles.analysisHeader}>
                                                    <Icon name="book-open-variant" size={14} color={service.color} />
                                                    <Text style={[styles.analysisLabel, { color: service.color }]}>{t('portfolio.spoken.analysis_label')}</Text>
                                                </View>
                                                <Text style={styles.analysisText}>{service.analysis}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            ))}

                            {/* Academy Highlights Visual Grid */}
                            <View style={styles.highlightsWrap}>
                                <Text style={styles.highlightsHeader}>{t('portfolio.spoken.classes_checklist.title')}</Text>
                                <View style={styles.highlightsGrid}>
                                    {(t('portfolio.spoken.classes_checklist.items', { returnObjects: true }) as string[]).map((item, idx) => (
                                        <View key={idx} style={styles.highlightMiniCard}>
                                            <View style={styles.miniIconBox}>
                                                <Icon name="check-circle" size={16} color="#0EA5E9" />
                                            </View>
                                            <Text style={styles.miniCardText}>{item}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        </>

                    {/* Team Section */}
                    <View style={styles.teamCard}>
                        <View style={styles.teamIconBox}>
                            <Icon name="account-tie-hat" size={32} color="#1E293B" />
                        </View>
                        <Text style={styles.teamTitle}>{t('portfolio.spoken.team_title')}</Text>
                        <Text style={styles.teamDesc}>{t('portfolio.spoken.team_desc')}</Text>
                    </View>

                    {/* Action Bar */}
                    <View style={styles.actionSection}>
                        <Text style={styles.actionHeading}>{t('portfolio.spoken.cta_heading')}</Text>
                        <View style={styles.buttonRow}>
                            <TouchableOpacity
                                style={[styles.mainButton, { backgroundColor: '#0EA5E9' }]}
                                onPress={() => contactExpert('call')}
                            >
                                <Icon name="phone" size={20} color="#FFFFFF" />
                                <Text style={styles.btnText}>{t('portfolio.spoken.cta_call')}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.mainButton, { backgroundColor: '#10B981' }]}
                                onPress={() => contactExpert('whatsapp')}
                            >
                                <Icon name="whatsapp" size={20} color="#FFFFFF" />
                                <Text style={styles.btnText}>{t('portfolio.common.whatsapp')}</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={styles.secondaryContact} onPress={() => triggerCall('6397255377', 'Raunuva Veerans (Admission)')}>
                            <Text style={styles.secLabel}>{t('portfolio.spoken.admission_label')}</Text>
                            <Text style={styles.secNumber}>+91 63972 55377</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.footerBranding}>
                        <Icon name="bullseye-arrow" size={20} color="#94A3B8" />
                        <Text style={styles.footerText}>{t('dashboard.portfolios.hindi.name')} {t('dashboard.portfolios.hindi.tagline')}</Text>
                    </View>

                    <View style={{ height: 40 }} />
                </View>
            </ScrollView>

            {/* Top Navigation */}
            <View style={styles.navBar}>
                <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="arrow-left" size={24} color="#1E293B" />
                </TouchableOpacity>
                <Text style={styles.navTitle}>{t('portfolio.spoken.nav_title')}</Text>
                <TouchableOpacity style={styles.shareBtn}>
                    <Icon name="share-variant-outline" size={22} color="#1E293B" />
                </TouchableOpacity>
            </View>
            <FloatingContactButtons 
                phoneNumber="6397255377"
                businessName={t('dashboard.portfolios.hindi.name')} 
            />

            <FloatingCartButton />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    heroContainer: {
        height: height * 0.45,
    },
    heroBackground: {
        flex: 1,
    },
    heroOverlay: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.45)',
        padding: 24,
        paddingTop: 100,
        justifyContent: 'space-between',
    },
    topBadges: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    premiumBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 100,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    premiumBadgeText: {
        fontSize: 10,
        fontWeight: '900',
        color: '#1E293B',
        marginLeft: 6,
        letterSpacing: 1,
    },
    yearBadge: {
        backgroundColor: '#1E293B',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 100,
    },
    yearBadgeText: {
        fontSize: 10,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    heroContent: {
        marginBottom: 20,
    },
    businessTitle: {
        fontSize: 30,
        fontWeight: '900',
        color: '#1E293B',
        letterSpacing: -1,
        lineHeight: 48,
        includeFontPadding: false,
    },
    businessSubtitle: {
        fontSize: 13,
        fontWeight: '800',
        color: '#F43F5E',
        letterSpacing: 5,
        marginTop: -5,
        lineHeight: 21,
        includeFontPadding: false,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        backgroundColor: 'rgba(255,255,255,0.8)',
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
    },
    locationText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#475569',
        marginLeft: 8,
        lineHeight: 19,
        includeFontPadding: false,
    },
    contentWrapper: {
        backgroundColor: '#FFFFFF',
        marginTop: -30,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 24,
        elevation: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
    },
    introHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
    },
    dotLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#F1F5F9',
    },
    sectionTitle: {
        fontSize: 11,
        fontWeight: '900',
        color: '#94A3B8',
        letterSpacing: 3,
        marginHorizontal: 15,
        lineHeight: 18,
        includeFontPadding: false,
    },
    serviceSection: {
        marginBottom: 32,
    },
    cardContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#F1F5F9',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
    },
    cardImage: {
        aspectRatio: 16 / 9,
        width: '100%',
    },
    imageOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.05)',
    },
    serviceInfo: {
        padding: 20,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleTextContainer: {
        marginLeft: 15,
    },
    serviceName: {
        fontSize: 15,
        fontWeight: '800',
        color: '#1E293B',
        lineHeight: 24,
        includeFontPadding: false,
    },
    serviceTag: {
        fontSize: 10,
        fontWeight: '700',
        color: '#F43F5E',
        letterSpacing: 1,
        marginTop: 2,
        lineHeight: 16,
        includeFontPadding: false,
    },
    serviceDesc: {
        fontSize: 13,
        lineHeight: 21,
        color: '#64748B',
        marginBottom: 16,
        fontWeight: '500',
        includeFontPadding: false,
    },
    analysisCard: {
        backgroundColor: '#F8FAFC',
        padding: 16,
        borderRadius: 16,
        borderLeftWidth: 4,
    },
    analysisHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    analysisLabel: {
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1.5,
        marginLeft: 8,
    },
    analysisText: {
        fontSize: 12,
        lineHeight: 19,
        color: '#475569',
        fontStyle: 'italic',
        includeFontPadding: false,
    },
    teamCard: {
        backgroundColor: '#F1F5F9',
        padding: 24,
        borderRadius: 24,
        alignItems: 'center',
        marginBottom: 40,
    },
    teamIconBox: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        elevation: 2,
    },
    teamTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#1E293B',
        marginBottom: 8,
        lineHeight: 26,
        includeFontPadding: false,
    },
    teamDesc: {
        fontSize: 12,
        textAlign: 'center',
        color: '#64748B',
        lineHeight: 19,
        includeFontPadding: false,
    },
    actionSection: {
        backgroundColor: '#1E293B',
        padding: 30,
        borderRadius: 28,
        alignItems: 'center',
    },
    actionHeading: {
        fontSize: 17,
        fontWeight: '900',
        color: '#FFFFFF',
        marginBottom: 24,
        textAlign: 'center',
        lineHeight: 27,
        includeFontPadding: false,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    mainButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 14,
    },
    btnText: {
        fontSize: 14,
        fontWeight: '800',
        color: '#FFFFFF',
        marginLeft: 8,
        lineHeight: 22,
        includeFontPadding: false,
    },
    secondaryContact: {
        alignItems: 'center',
    },
    secLabel: {
        fontSize: 10,
        fontWeight: '900',
        color: '#94A3B8',
        letterSpacing: 2,
        marginBottom: 4,
    },
    secNumber: {
        fontSize: 18,
        fontWeight: '900',
        color: '#FFFFFF',
    },
    footerBranding: {
        alignItems: 'center',
        marginTop: 40,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    footerText: {
        fontSize: 12,
        fontWeight: '900',
        color: '#94A3B8',
        letterSpacing: 2,
        marginLeft: 10,
    },
    navBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        minHeight: 100,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 45,
    },
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
    },
    navTitle: {
        fontSize: 14,
        fontWeight: '900',
        color: '#1E293B',
        letterSpacing: 3,
    },
    shareBtn: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
    },
    // Redesigned Shine-style Section Styles
    selectorContainer: {
        flexDirection: 'row',
        backgroundColor: '#F1F5F9',
        padding: 6,
        borderRadius: 16,
        marginBottom: 24,
    },
    selectorBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 12,
        gap: 8,
    },
    selectorBtnActive: {
        backgroundColor: '#0EA5E9',
        elevation: 4,
        shadowColor: '#0EA5E9',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    selectorTxt: {
        fontSize: 13,
        fontWeight: '700',
        color: '#64748B',
    },
    selectorTxtActive: {
        color: '#FFFFFF',
    },
    manpowerWrapper: {
        backgroundColor: '#F8FAFC',
    },
    // Academy Highlights visual-grid
    highlightsWrap: {
        marginTop: 8,
        marginBottom: 32,
    },
    highlightsHeader: {
        fontSize: 16,
        fontWeight: '900',
        color: '#1E293B',
        marginBottom: 16,
        paddingLeft: 4,
    },
    highlightsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    highlightMiniCard: {
        width: (width - 60) / 2,
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        elevation: 2,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    miniIconBox: {
        width: 28,
        height: 28,
        borderRadius: 8,
        backgroundColor: '#F0F9FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    miniCardText: {
        fontSize: 11,
        fontWeight: '900',
        color: '#334155',
        flex: 1,
    },
    // Manpower Tab Styles
    manpowerOuter: {
        marginTop: 10,
    },
    manpowerIntro: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    logoCircle: {
        width: 54,
        height: 54,
        borderRadius: 27,
        backgroundColor: '#F8FAFC',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    jsLogoSmall: {
        width: 34,
        height: 34,
    },
    manpowerIntroText: {
        flex: 1,
    },
    manpowerMainTitle: {
        fontSize: 15,
        fontWeight: '900',
        color: '#0F172A',
    },
    manpowerMainTag: {
        fontSize: 11,
        color: '#64748B',
        fontWeight: '700',
        marginTop: 2,
    },
    premiumGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 14,
    },
    manpowerSaleCard: {
        width: (width - 62) / 2,
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 28,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        elevation: 10,
        shadowColor: '#1E293B',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.08,
        shadowRadius: 15,
    },
    largeIconBox: {
        width: 60,
        height: 60,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    manpowerSaleTitle: {
        fontSize: 13,
        fontWeight: '900',
        color: '#1F2937',
        lineHeight: 18,
        minHeight: 36,
    },
    manpowerSaleFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 14,
        paddingTop: 14,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    featureStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        gap: 6,
    },
    statusDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
    },
    statusText: {
        fontSize: 8,
        fontWeight: '900',
        color: '#64748B',
        letterSpacing: 0.5,
    },
    manImgContainer: {
        width: '100%',
        height: 110,
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 12,
        backgroundColor: '#F8FAFC',
    },
    manImg: {
        flex: 1,
    },
    manImgOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.02)',
    }
});

export default SpokenHindiPortfolioScreen;

