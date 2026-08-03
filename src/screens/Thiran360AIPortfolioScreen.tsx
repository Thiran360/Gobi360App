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
const THIRAN_LOGO = require('../assets/images/thiran360ai_logo.png');

const { width, height } = Dimensions.get('window');

const Thiran360AIPortfolioScreen = ({ navigation }: any) => {
    const { t } = useTranslation();
    const scrollY = useRef(new Animated.Value(0)).current;

    const SERVICES = [
        {
            id: 1,
            title: t('portfolio.thiran.services.s1_title'),
            desc: t('portfolio.thiran.services.s1_desc'),
            icon: 'cellphone-link',
            color: '#14B8A6',
            accent: '#F0FDFA',
            analysis: t('portfolio.thiran.services.s1_analysis'),
            image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=800&auto=format&fit=crop'
        },
        {
            id: 2,
            title: t('portfolio.thiran.services.s2_title'),
            desc: t('portfolio.thiran.services.s2_desc'),
            icon: 'web',
            color: '#0EA5E9',
            accent: '#F0F9FF',
            analysis: t('portfolio.thiran.services.s2_analysis'),
            image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop'
        },
        {
            id: 3,
            title: t('portfolio.thiran.services.s3_title'),
            desc: t('portfolio.thiran.services.s3_desc'),
            icon: 'console-line',
            color: '#8B5CF6',
            accent: '#F5F3FF',
            analysis: t('portfolio.thiran.services.s3_analysis'),
            image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop'
        },
        {
            id: 4,
            title: t('portfolio.thiran.services.s4_title'),
            desc: t('portfolio.thiran.services.s4_desc'),
            icon: 'brain',
            color: '#2563EB',
            accent: '#EFF6FF',
            analysis: t('portfolio.thiran.services.s4_analysis'),
            image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop'
        },
        {
            id: 5,
            title: t('portfolio.thiran.services.s5_title'),
            desc: t('portfolio.thiran.services.s5_desc'),
            icon: 'brush',
            color: '#EC4899',
            accent: '#FDF2F8',
            analysis: t('portfolio.thiran.services.s5_analysis'),
            image: 'https://i.pinimg.com/736x/c5/98/24/c59824e5b82c286b55415d17823b3dc4.jpg'
        },
        {
            id: 6,
            title: t('portfolio.thiran.services.s6_title'),
            desc: t('portfolio.thiran.services.s6_desc'),
            icon: 'cloud-sync',
            color: '#6366F1',
            accent: '#EEF2FF',
            analysis: t('portfolio.thiran.services.s6_analysis'),
            image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=800&auto=format&fit=crop'
        }
    ];

    const headerScale = scrollY.interpolate({
        inputRange: [-100, 0, 100],
        outputRange: [1.1, 1, 1],
    });

    const contactExpert = (type: 'call' | 'whatsapp') => {
        checkSessionAndNavigate(navigation, () => {
            if (type === 'call') {
                triggerCall('7708805630', 'Thiran360AI (Manickavasagar)');
            } else {
                const msg = t('portfolio.thiran.whatsapp_msg', { defaultValue: 'Hi THIRAN360AI Team, I am interested in your IT services.' });
                Linking.openURL(`whatsapp://send?phone=917708805630&text=${encodeURIComponent(msg)}`);
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
                        source={THIRAN_LOGO}
                        style={styles.heroBackground}
                    >
                        <View style={styles.heroOverlay}>
                            <View style={styles.topBadges}>
                                <View style={styles.premiumBadge}>
                                    <Icon name="robot" size={14} color="#14B8A6" />
                                    <Text style={styles.premiumBadgeText}>{t('portfolio.thiran.service_tag')}</Text>
                                </View>
                                <View style={styles.yearBadge}>
                                    <Text style={styles.yearBadgeText}>{t('portfolio.common.established')} 2023</Text>
                                </View>
                            </View>

                            <View style={styles.heroContent}>
                                <Text style={styles.businessTitle}>{t('dashboard.portfolios.thiran.name')}</Text>
                                <Text style={styles.businessSubtitle}>{t('dashboard.portfolios.thiran.tagline').toUpperCase()}</Text>

                                <View style={styles.locationContainer}>
                                    <Icon name="map-marker-radius" size={18} color="#14B8A6" />
                                    <Text style={styles.locationText}>{t('portfolio.thiran.location')}</Text>
                                </View>
                            </View>
                        </View>
                    </ImageBackground>
                </Animated.View>

                {/* Content Section */}
                <View style={styles.contentWrapper}>
                    <View style={styles.introHeader}>
                        <View style={styles.dotLine} />
                        <Text style={styles.sectionTitle}>{t('portfolio.thiran.section_header')}</Text>
                        <View style={styles.dotLine} />
                    </View>

                    {/* Services Cards */}
                    {SERVICES.map((service) => (
                        <View key={service.id} style={styles.serviceSection}>
                            <TouchableOpacity activeOpacity={0.9} style={styles.cardContainer}>
                                <ImageBackground
                                    source={{ uri: service.image }}
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
                                            <Text style={styles.serviceTag}>{t('portfolio.thiran.service_tag')}</Text>
                                        </View>
                                    </View>

                                    <Text style={styles.serviceDesc}>{service.desc}</Text>

                                    <View style={[styles.analysisCard, { borderLeftColor: service.color }]}>
                                        <View style={styles.analysisHeader}>
                                            <Icon name="cog-outline" size={14} color={service.color} />
                                            <Text style={[styles.analysisLabel, { color: service.color }]}>{t('portfolio.thiran.analysis_label')}</Text>
                                        </View>
                                        <Text style={styles.analysisText}>{service.analysis}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    ))}

                    {/* Owner Section */}
                    <View style={styles.teamCard}>
                        <View style={styles.teamIconBox}>
                            <Icon name="account-tie" size={32} color="#1E293B" />
                        </View>
                        <Text style={styles.teamTitle}>{t('portfolio.thiran.team_title')}</Text>
                        <Text style={styles.teamDesc}>{t('portfolio.thiran.team_desc')}</Text>
                    </View>

                    {/* Action Bar */}
                    <View style={styles.actionSection}>
                        <Text style={styles.actionHeading}>{t('portfolio.thiran.cta_heading')}</Text>
                        <View style={styles.buttonRow}>
                            <TouchableOpacity
                                style={[styles.mainButton, { backgroundColor: '#14B8A6' }]}
                                onPress={() => contactExpert('call')}
                            >
                                <Icon name="phone" size={20} color="#FFFFFF" />
                                <Text style={styles.btnText}>{t('portfolio.thiran.cta_call')}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.mainButton, { backgroundColor: '#10B981' }]}
                                onPress={() => contactExpert('whatsapp')}
                            >
                                <Icon name="whatsapp" size={20} color="#FFFFFF" />
                                <Text style={styles.btnText}>{t('portfolio.common.whatsapp')}</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={styles.secondaryContact} onPress={() => triggerCall('7708805630', 'Thiran360AI (Enquiry)')}>
                            <Text style={styles.secLabel}>{t('portfolio.thiran.enquiry_label')}</Text>
                            <Text style={styles.secNumber}>+91 77088 05630</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.footerBranding}>
                        <Icon name="robot" size={20} color="#94A3B8" />
                        <Text style={styles.footerText}>{t('dashboard.portfolios.thiran.name')} {t('dashboard.portfolios.thiran.tagline')}</Text>
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
                <Text style={styles.navTitle}>{t('portfolio.thiran.nav_title')}</Text>
                <TouchableOpacity style={styles.shareBtn}>
                    <Icon name="share-variant-outline" size={22} color="#1E293B" />
                </TouchableOpacity>
            </View>
            <FloatingContactButtons
                phoneNumber="7708805630"
                businessName={t('dashboard.portfolios.thiran.name')}
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
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
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
    },
    premiumBadgeText: {
        fontSize: 10,
        fontWeight: '900',
        color: '#14B8A6',
        marginLeft: 6,
        letterSpacing: 1,
    },
    yearBadge: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 100,
    },
    yearBadgeText: {
        fontSize: 10,
        fontWeight: '800',
        color: '#1E293B',
    },
    heroContent: {
        marginBottom: 20,
    },
    businessTitle: {
        fontSize: 32,
        fontWeight: '900',
        color: '#FFFFFF',
        letterSpacing: -1,
    },
    businessSubtitle: {
        fontSize: 13,
        fontWeight: '800',
        color: '#14B8A6',
        letterSpacing: 4,
        marginTop: 4,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
    },
    locationText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#FFFFFF',
        marginLeft: 8,
    },
    contentWrapper: {
        backgroundColor: '#FFFFFF',
        marginTop: -30,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 24,
        elevation: 20,
    },
    introHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
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
    },
    logoContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    logoImage: {
        width: 120,
        height: 120,
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
    },
    cardImage: {
        aspectRatio: 16 / 9,
        width: '100%',
    },
    imageOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.1)',
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
        fontSize: 16,
        fontWeight: '800',
        color: '#1E293B',
    },
    serviceTag: {
        fontSize: 10,
        fontWeight: '700',
        color: '#14B8A6',
        letterSpacing: 1,
        marginTop: 2,
    },
    serviceDesc: {
        fontSize: 13,
        lineHeight: 21,
        color: '#64748B',
        marginBottom: 16,
        fontWeight: '500',
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
        lineHeight: 18,
        color: '#475569',
        fontStyle: 'italic',
    },
    teamCard: {
        backgroundColor: '#F1F5F9',
        padding: 24,
        borderRadius: 24,
        alignItems: 'center',
        marginBottom: 30,
    },
    teamIconBox: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    teamTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#1E293B',
        marginBottom: 8,
    },
    teamDesc: {
        fontSize: 12,
        textAlign: 'center',
        color: '#64748B',
        lineHeight: 18,
    },
    actionSection: {
        backgroundColor: '#1E293B',
        padding: 30,
        borderRadius: 28,
        alignItems: 'center',
    },
    actionHeading: {
        fontSize: 18,
        fontWeight: '900',
        color: '#FFFFFF',
        marginBottom: 24,
        textAlign: 'center',
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
        fontSize: 20,
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
        fontSize: 11,
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
    },
    navTitle: {
        fontSize: 14,
        fontWeight: '900',
        color: '#FFFFFF',
        letterSpacing: 2,
    },
    shareBtn: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
    }
});

export default Thiran360AIPortfolioScreen;

