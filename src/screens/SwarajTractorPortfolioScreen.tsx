import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Platform,
    StatusBar,
    Dimensions,
    ScrollView,
    ImageBackground,
    Animated,
    Linking,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import React, { useRef, useState } from 'react';
import FloatingCartButton from '../components/FloatingCartButton';
import { useTranslation } from 'react-i18next';
import FloatingContactButtons from '../components/FloatingContactButtons';

import { checkSessionAndNavigate } from '../utils/auth';
import { triggerCall } from '../utils/callTracker';

const { width, height } = Dimensions.get('window');

const SwarajTractorPortfolioScreen = ({ navigation }: any) => {
    const { t } = useTranslation();
    const scrollY = useRef(new Animated.Value(0)).current;
    const [activeTab, setActiveTab] = useState<'models' | 'service'>('models');

    const MODELS = [
        { id: 1, name: 'Swaraj 735 FE (2024)', hp: '40 HP', features: 'New Styling & High Mileage', image: require('../assets/images/portfolio/swaraj/735.jpg') },
        { id: 2, name: 'Swaraj 744 XT (2024)', hp: '50 HP', features: 'Extra Torque & Multi-Speed PTO', image: require('../assets/images/portfolio/swaraj/744.jpg') },
        { id: 3, name: 'Swaraj 855 FE (50th Anniv.)', hp: '55 HP', features: 'Golden Decals & M.S. Dhoni Edition', image: require('../assets/images/portfolio/swaraj/855.jpg') },
        { id: 4, name: 'Swaraj 963 FE 4WD (2024)', hp: '65 HP', features: 'Luxury AC Cabin & 4WD Power', image: require('../assets/images/portfolio/swaraj/963.jpg') },
    ];

    const SERVICES = [
        {
            id: 1,
            title: t('portfolio.swaraj.services.s1_title'),
            desc: t('portfolio.swaraj.services.s1_desc'),
            analysis: t('portfolio.swaraj.services.s1_analysis'),
            icon: 'tractor',
            color: '#D32F2F',
        },
        {
            id: 2,
            title: t('portfolio.swaraj.services.s2_title'),
            desc: t('portfolio.swaraj.services.s2_desc'),
            analysis: t('portfolio.swaraj.services.s2_analysis'),
            icon: 'wrench-clock',
            color: '#1976D2',
        },
        {
            id: 3,
            title: t('portfolio.swaraj.services.s3_title'),
            desc: t('portfolio.swaraj.services.s3_desc'),
            analysis: t('portfolio.swaraj.services.s3_analysis'),
            icon: 'cog-refresh',
            color: '#388E3C',
        },
        {
            id: 4,
            title: t('portfolio.swaraj.services.s4_title'),
            desc: t('portfolio.swaraj.services.s4_desc'),
            analysis: t('portfolio.swaraj.services.s4_analysis'),
            icon: 'finance',
            color: '#FBC02D',
        },
    ];

    const handleCall = () => {
        const name = t('dashboard.portfolios.swaraj.name');
        triggerCall('9489359090', name);
    };
    const handleWhatsApp = () => Linking.openURL('whatsapp://send?phone=919489359090');

    const headerHeight = scrollY.interpolate({
        inputRange: [0, 200],
        outputRange: [height * 0.45, height * 0.15],
        extrapolate: 'clamp',
    });

    const headerOpacity = scrollY.interpolate({
        inputRange: [0, 150],
        outputRange: [1, 0],
        extrapolate: 'clamp',
    });

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            
            <Animated.View style={[styles.header, { height: headerHeight }]}>
                <ImageBackground
                    source={require('../assets/images/portfolio/swaraj/hero.jpg')}
                    style={styles.heroImg}
                >
                    <Animated.View style={[styles.heroOverlay, { opacity: headerOpacity }]}>
                        <View style={styles.badgeRow}>
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{t('portfolio.swaraj.service_tag')}</Text>
                            </View>
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>SINCE 2021</Text>
                            </View>
                        </View>
                        <View style={styles.heroContent}>
                            <Text style={styles.brandTitle}>{t('dashboard.portfolios.swaraj.name')}</Text>
                            <Text style={styles.brandSubtitle}>{t('dashboard.portfolios.swaraj.tagline')}</Text>
                        </View>
                    </Animated.View>
                </ImageBackground>
            </Animated.View>

            <ScrollView
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContainer}
            >
                <View style={styles.mainContent}>
                    <View style={styles.ownerCard}>
                        <View style={styles.ownerInfo}>
                            <View style={styles.avatar}>
                                <Icon name="account-tie" size={30} color="#D32F2F" />
                            </View>
                            <View>
                                <Text style={styles.ownerTitle}>{t('portfolio.swaraj.team_title')}</Text>
                                <Text style={styles.ownerSub}>{t('portfolio.swaraj.team_desc')}</Text>
                            </View>
                        </View>
                        <View style={styles.statsRow}>
                            <View style={styles.statItem}>
                                <Text style={styles.statVal}>15+</Text>
                                <Text style={styles.statLab}>Models</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <Text style={styles.statVal}>100%</Text>
                                <Text style={styles.statLab}>Genuine</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <Text style={styles.statVal}>Expert</Text>
                                <Text style={styles.statLab}>Service</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.tabContainer}>
                        <TouchableOpacity 
                            onPress={() => setActiveTab('models')}
                            style={[styles.tabBtn, activeTab === 'models' && styles.tabBtnActive]}
                        >
                            <Icon name="tractor" size={20} color={activeTab === 'models' ? '#FFF' : '#64748B'} />
                            <Text style={[styles.tabTxt, activeTab === 'models' && styles.tabTxtActive]}>Models</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={() => setActiveTab('service')}
                            style={[styles.tabBtn, activeTab === 'service' && styles.tabBtnActive]}
                        >
                            <Icon name="tools" size={20} color={activeTab === 'service' ? '#FFF' : '#64748B'} />
                            <Text style={[styles.tabTxt, activeTab === 'service' && styles.tabTxtActive]}>Services</Text>
                        </TouchableOpacity>
                    </View>

                    {activeTab === 'models' ? (
                        <View style={styles.modelsGrid}>
                            {MODELS.map(model => (
                                <View key={model.id} style={styles.modelCard}>
                                    <Image source={model.image} style={styles.modelImg} resizeMode="cover" />
                                    <View style={styles.modelInfo}>
                                        <Text style={styles.modelName}>{model.name}</Text>
                                        <View style={styles.modelMeta}>
                                            <Text style={styles.modelHp}>{model.hp}</Text>
                                            <Text style={styles.modelFeat}>{model.features}</Text>
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <View style={styles.servicesList}>
                            {SERVICES.map(service => (
                                <View key={service.id} style={styles.serviceItem}>
                                    <View style={[styles.serviceIcon, { backgroundColor: service.color + '20' }]}>
                                        <Icon name={service.icon} size={28} color={service.color} />
                                    </View>
                                    <View style={styles.serviceContent}>
                                        <Text style={styles.serviceTitle}>{service.title}</Text>
                                        <Text style={styles.serviceDesc}>{service.desc}</Text>
                                        <View style={styles.analysisBox}>
                                            <Text style={styles.analysisTag}>{t('portfolio.swaraj.analysis_label')}</Text>
                                            <Text style={styles.analysisTxt}>{service.analysis}</Text>
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}

                    <View style={styles.locationCard}>
                        <View style={styles.locHeader}>
                            <Icon name="map-marker-radius" size={24} color="#D32F2F" />
                            <Text style={styles.locTitle}>Location</Text>
                        </View>
                        <Text style={styles.locAddress}>{t('portfolio.swaraj.location')}</Text>
                        <TouchableOpacity 
                            style={styles.mapBtn}
                            onPress={() => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(t('portfolio.swaraj.location'))}`)}
                        >
                            <Text style={styles.mapBtnTxt}>View on Map</Text>
                            <Icon name="arrow-right" size={16} color="#D32F2F" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.contactSection}>
                        <Text style={styles.ctaHead}>{t('portfolio.swaraj.cta_heading')}</Text>
                        <View style={styles.contactRow}>
                            <TouchableOpacity style={styles.callBtn} onPress={handleCall}>
                                <Icon name="phone" size={20} color="#FFF" />
                                <Text style={styles.contactBtnTxt}>9489359090</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.whatsappBtn} onPress={handleWhatsApp}>
                                <Icon name="whatsapp" size={20} color="#FFF" />
                                <Text style={styles.contactBtnTxt}>WhatsApp</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.altContact}>Alt: 9489159090</Text>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.navBar}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Icon name="chevron-left" size={28} color="#1E293B" />
                </TouchableOpacity>
                <Text style={styles.navTitle}>{t('portfolio.swaraj.nav_title')}</Text>
                <TouchableOpacity style={styles.shareBtn}>
                    <Icon name="share-variant-outline" size={24} color="#1E293B" />
                </TouchableOpacity>
            </View>

            <FloatingContactButtons 
                phoneNumber="9489359090"
                whatsappNumber="9489359090"
                businessName={t('dashboard.portfolios.swaraj.name')}
            />

            <FloatingCartButton />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        overflow: 'hidden',
        zIndex: 10,
    },
    heroImg: {
        width: '100%',
        height: '100%',
    },
    heroOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        padding: 20,
        paddingTop: 60,
        justifyContent: 'flex-end',
    },
    badgeRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 12,
    },
    badge: {
        backgroundColor: 'rgba(211, 47, 47, 0.9)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
    },
    badgeText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1,
    },
    heroContent: {
        marginBottom: 20,
    },
    brandTitle: {
        fontSize: 32,
        fontWeight: '900',
        color: '#FFF',
        lineHeight: 38,
    },
    brandSubtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 4,
    },
    scrollContainer: {
        paddingTop: height * 0.45,
    },
    mainContent: {
        backgroundColor: '#F8FAFC',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        marginTop: -32,
        paddingTop: 30,
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    ownerCard: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 20,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        marginBottom: 30,
    },
    ownerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#FEE2E2',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    ownerTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#1E293B',
    },
    ownerSub: {
        fontSize: 12,
        color: '#64748B',
        marginTop: 2,
        lineHeight: 18,
        width: width * 0.6,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
        paddingTop: 16,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statVal: {
        fontSize: 18,
        fontWeight: '900',
        color: '#D32F2F',
    },
    statLab: {
        fontSize: 10,
        color: '#94A3B8',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginTop: 2,
    },
    statDivider: {
        width: 1,
        height: 30,
        backgroundColor: '#F1F5F9',
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#F1F5F9',
        padding: 4,
        borderRadius: 16,
        marginBottom: 24,
    },
    tabBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 12,
        gap: 8,
    },
    tabBtnActive: {
        backgroundColor: '#D32F2F',
        elevation: 4,
        shadowColor: '#D32F2F',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    tabTxt: {
        fontSize: 14,
        fontWeight: '700',
        color: '#64748B',
    },
    tabTxtActive: {
        color: '#FFF',
    },
    modelsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    modelCard: {
        width: (width - 56) / 2,
        backgroundColor: '#FFF',
        borderRadius: 20,
        marginBottom: 16,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
    },
    modelImg: {
        width: '100%',
        height: 120,
    },
    modelInfo: {
        padding: 12,
    },
    modelName: {
        fontSize: 14,
        fontWeight: '900',
        color: '#1E293B',
    },
    modelMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 4,
    },
    modelHp: {
        fontSize: 10,
        fontWeight: '700',
        color: '#D32F2F',
    },
    modelFeat: {
        fontSize: 10,
        color: '#94A3B8',
    },
    servicesList: {
        gap: 16,
    },
    serviceItem: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
    },
    serviceIcon: {
        width: 56,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    serviceContent: {
        flex: 1,
    },
    serviceTitle: {
        fontSize: 16,
        fontWeight: '900',
        color: '#1E293B',
    },
    serviceDesc: {
        fontSize: 12,
        color: '#64748B',
        marginTop: 4,
        lineHeight: 18,
    },
    analysisBox: {
        marginTop: 12,
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        padding: 12,
        borderLeftWidth: 3,
        borderLeftColor: '#D32F2F',
    },
    analysisTag: {
        fontSize: 10,
        fontWeight: '900',
        color: '#94A3B8',
        letterSpacing: 1,
        marginBottom: 4,
    },
    analysisTxt: {
        fontSize: 11,
        color: '#475569',
        lineHeight: 16,
    },
    locationCard: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 20,
        marginTop: 30,
        elevation: 4,
    },
    locHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    locTitle: {
        fontSize: 16,
        fontWeight: '900',
        color: '#1E293B',
    },
    locAddress: {
        fontSize: 14,
        color: '#475569',
        lineHeight: 22,
    },
    mapBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
        gap: 4,
    },
    mapBtnTxt: {
        fontSize: 14,
        fontWeight: '700',
        color: '#D32F2F',
    },
    contactSection: {
        marginTop: 40,
        alignItems: 'center',
    },
    ctaHead: {
        fontSize: 18,
        fontWeight: '900',
        color: '#1E293B',
        marginBottom: 20,
    },
    contactRow: {
        flexDirection: 'row',
        gap: 12,
    },
    callBtn: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#D32F2F',
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    whatsappBtn: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#25D366',
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    contactBtnTxt: {
        color: '#FFF',
        fontWeight: '900',
        fontSize: 14,
    },
    altContact: {
        fontSize: 12,
        color: '#94A3B8',
        marginTop: 12,
    },
    navBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 100,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 45,
        zIndex: 100,
    },
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
    },
    navTitle: {
        fontSize: 14,
        fontWeight: '900',
        color: '#FFF',
        letterSpacing: 2,
    },
    shareBtn: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
    }
});

export default SwarajTractorPortfolioScreen;

