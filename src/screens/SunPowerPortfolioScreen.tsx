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
    FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import React, { useRef, useState } from 'react';
import FloatingCartButton from '../components/FloatingCartButton';
import { useTranslation } from 'react-i18next';
import FloatingContactButtons from '../components/FloatingContactButtons';

import { triggerCall } from '../utils/callTracker';

const { width, height } = Dimensions.get('window');

/* â”€â”€â”€ Product gallery images â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const GALLERY = [
    {
        id: '1',
        label: 'R.O Systems',
        image: require('../assets/images/portfolio/sunpower/ro_system.png'),
    },
    {
        id: '2',
        label: 'Solar Panels',
        image: { uri: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=600&auto=format&fit=crop' },
    },
    {
        id: '3',
        label: 'Water Purifier',
        image: require('../assets/images/portfolio/sunpower/water_purifier.png'),
    },
    {
        id: '4',
        label: 'Water Cooler',
        image: require('../assets/images/portfolio/sunpower/water_cooler.png'),
    },
    {
        id: '5',
        label: 'Solar Pump',
        image: { uri: 'https://i.pinimg.com/736x/27/e6/23/27e623b6da6cf84ec0e0a43f88d46eb2.jpg' },
    },
    {
        id: '6',
        label: 'UPS Battery',
        image: require('../assets/images/portfolio/sunpower/microtek_battery.png'),
    },
];

/* â”€â”€â”€ Service data with images â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const WATER_SERVICES = [
    {
        key: 's1',
        titleKey: 'sunpower.water_ro.s1_title',
        descKey: 'sunpower.water_ro.s1_desc',
        analysisKey: 'sunpower.water_ro.s1_analysis',
        icon: 'water',
        iconBg: '#EFF6FF',
        iconColor: '#2563EB',
        accentColor: '#2563EB',
        image: 'https://i.pinimg.com/1200x/6f/17/5e/6f175eb19cd3d4f374ac23928af67230.jpg',
    },
    {
        key: 's2',
        titleKey: 'sunpower.water_ro.s2_title',
        descKey: 'sunpower.water_ro.s2_desc',
        analysisKey: 'sunpower.water_ro.s2_analysis',
        icon: 'water-pump',
        iconBg: '#ECFDF5',
        iconColor: '#059669',
        accentColor: '#059669',
        image: 'https://i.pinimg.com/1200x/ad/ce/ff/adceff7fd7a936c73f4b6051f229f9f7.jpg',
    },
    {
        key: 's3',
        titleKey: 'sunpower.water_ro.s3_title',
        descKey: 'sunpower.water_ro.s3_desc',
        analysisKey: 'sunpower.water_ro.s3_analysis',
        icon: 'hammer-wrench',
        iconBg: '#FDF2F8',
        iconColor: '#DB2777',
        accentColor: '#DB2777',
        image: 'https://i.pinimg.com/1200x/81/97/66/819766bc4f6a811e98fd755fe0dbfeb0.jpg',
    },
    {
        key: 's5',
        title: 'Water Softeners',
        desc: 'Advanced water softening systems to remove hardness, scale deposits and mineral impurities from water supply.',
        analysis: 'Ion exchange resin technology with automatic regeneration cycle.',
        icon: 'water-circle',
        iconBg: '#EFF6FF',
        iconColor: '#0EA5E9',
        accentColor: '#0EA5E9',
        image: 'https://image.pollinations.ai/prompt/water-softener-system-installed-home?width=800&height=500&nologo=true',
    },
];

const SOLAR_SERVICES = [
    {
        key: 's1',
        titleKey: 'sunpower.power_solar.s1_title',
        descKey: 'sunpower.power_solar.s1_desc',
        analysisKey: 'sunpower.power_solar.s1_analysis',
        icon: 'solar-panel-large',
        iconBg: '#FEF3C7',
        iconColor: '#D97706',
        accentColor: '#D97706',
        image: 'https://i.pinimg.com/736x/27/e6/23/27e623b6da6cf84ec0e0a43f88d46eb2.jpg',
    },
    {
        key: 's2',
        titleKey: 'sunpower.power_solar.s2_title',
        descKey: 'sunpower.power_solar.s2_desc',
        analysisKey: 'sunpower.power_solar.s2_analysis',
        icon: 'lightbulb-on',
        iconBg: '#FFF7ED',
        iconColor: '#EA580C',
        accentColor: '#EA580C',
        image: 'https://i.pinimg.com/1200x/ae/99/30/ae9930a2221cd1c71773bc7f1cd0529e.jpg',
    },
    {
        key: 's3',
        titleKey: 'sunpower.power_solar.s3_title',
        descKey: 'sunpower.power_solar.s3_desc',
        analysisKey: 'sunpower.power_solar.s3_analysis',
        icon: 'transmission-tower',
        iconBg: '#F0FDF4',
        iconColor: '#16A34A',
        accentColor: '#16A34A',
        image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=800&auto=format&fit=crop',
    },
    {
        key: 's4',
        titleKey: 'sunpower.power_solar.s4_title',
        descKey: 'sunpower.power_solar.s4_desc',
        analysisKey: 'sunpower.power_solar.s4_analysis',
        icon: 'battery-charging-100',
        iconBg: '#FAF5FF',
        iconColor: '#7C3AED',
        accentColor: '#7C3AED',
        image: require('../assets/images/portfolio/sunpower/microtek_battery.png'),
    },
    {
        key: 's5',
        title: 'Servo Stabilizers',
        desc: 'High-performance servo voltage stabilizers to protect your electrical appliances from voltage fluctuations.',
        analysis: 'Precision voltage correction and overload protection.',
        icon: 'flash',
        iconBg: '#FEF3C7',
        iconColor: '#D97706',
        accentColor: '#D97706',
        image: require('../assets/images/portfolio/sunpower/servo_stabilizer.png'),
    },
    {
        key: 's7',
        title: 'CCTV Systems',
        desc: 'Complete CCTV surveillance and security camera installation for residential, commercial and industrial premises.',
        analysis: 'HD/4K resolution cameras with night vision, remote viewing and cloud storage.',
        icon: 'cctv',
        iconBg: '#FEF2F2',
        iconColor: '#DC2626',
        accentColor: '#DC2626',
        image: 'https://image.pollinations.ai/prompt/CCTV-security-cameras-installed-on-wall?width=800&height=500&nologo=true',
    },
    {
        key: 's8',
        title: 'Maintenance & Services',
        desc: 'Annual maintenance contracts (AMC) and on-call service support for all solar, water, UPS and CCTV systems supplied.',
        analysis: '24/7 customer support with certified technicians and genuine spare parts.',
        icon: 'tools',
        iconBg: '#FDF4FF',
        iconColor: '#9333EA',
        accentColor: '#9333EA',
        image: 'https://image.pollinations.ai/prompt/technician-repairing-solar-panel-equipment?width=800&height=500&nologo=true',
    },
];

const SunPowerPortfolioScreen = ({ navigation }: any) => {
    const { t } = useTranslation();
    const scrollY = useRef(new Animated.Value(0)).current;
    const [activeTab, setActiveTab] = useState<'water' | 'solar'>('water');

    const handleCallPrimary = () => {
        triggerCall('9865088885', 'Mega Sun Power Equipments (Prabakaran)');
    };

    const handleCallSecondary = () => {
        triggerCall('9095270567', 'Mega Sun Power Equipments (Prabakaran)');
    };

    const handleWhatsApp = () => {
        const msg = t('sunpower.whatsapp_msg');
        Linking.openURL(`whatsapp://send?phone=919865088885&text=${encodeURIComponent(msg)}`);
    };

    const headerHeight = scrollY.interpolate({
        inputRange: [0, 200],
        outputRange: [height * 0.42, height * 0.15],
        extrapolate: 'clamp',
    });

    const headerOpacity = scrollY.interpolate({
        inputRange: [0, 150],
        outputRange: [1, 0],
        extrapolate: 'clamp',
    });

    const services = activeTab === 'water' ? WATER_SERVICES : SOLAR_SERVICES;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            <Animated.View style={[styles.header, { height: headerHeight }]}>
                <ImageBackground
                    source={{ uri: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=800&auto=format&fit=crop' }}
                    style={styles.heroImg}
                >
                    <Animated.View style={[styles.heroOverlay, { opacity: headerOpacity }]}>
                        <View style={styles.badgeRow}>
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{t('sunpower.service_tag')}</Text>
                            </View>
                            <View style={styles.badgeAlt}>
                                <Text style={styles.badgeText}>ESTD 2002</Text>
                            </View>
                        </View>
                        <View style={styles.heroContent}>
                            <Text style={styles.brandTitle}>{t('dashboard.portfolios.sunpower.name')}</Text>
                            <Text style={styles.brandSubtitle}>{t('dashboard.portfolios.sunpower.tagline')}</Text>
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
                    {/* Owner & Expertise Card */}
                    <View style={styles.ownerCard}>
                        <View style={styles.ownerInfo}>
                            <View style={styles.avatar}>
                                <Image
                                    source={{ uri: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop&crop=face' }}
                                    style={styles.avatarImg}
                                    resizeMode="cover"
                                />
                                <View style={styles.avatarBadge}>
                                    <Icon name="shield-check" size={10} color="#FFF" />
                                </View>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.ownerTitle}>{t('sunpower.team_title')}</Text>
                                <Text style={styles.ownerSub}>{t('sunpower.team_desc')}</Text>
                            </View>
                        </View>
                        <View style={styles.statsRow}>
                            <View style={styles.statItem}>
                                <Text style={styles.statVal}>24+</Text>
                                <Text style={styles.statLab}>Years Exp</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <Text style={styles.statVal}>ISO</Text>
                                <Text style={styles.statLab}>Certified</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <Text style={styles.statVal}>Erode</Text>
                                <Text style={styles.statLab}>Kavindapadi</Text>
                            </View>
                        </View>
                    </View>

                    {/* â”€â”€â”€ Product Gallery Strip â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
                    <View style={styles.gallerySection}>
                        <View style={styles.gallerySectionHeader}>
                            <Icon name="image-multiple-outline" size={18} color="#D97706" />
                            <Text style={styles.gallerySectionTitle}>Our Products</Text>
                        </View>
                        <FlatList
                            data={GALLERY}
                            keyExtractor={item => item.id}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.galleryList}
                            renderItem={({ item }) => (
                                <View style={styles.galleryCard}>
                                    <Image
                                        source={item.image}
                                        style={styles.galleryImg}
                                        resizeMode="cover"
                                    />
                                    <View style={styles.galleryOverlay}>
                                        <Text style={styles.galleryLabel}>{item.label}</Text>
                                    </View>
                                </View>
                            )}
                        />
                    </View>

                    {/* Dual-Pillar Interactive Tabs */}
                    <View style={styles.tabContainer}>
                        <TouchableOpacity
                            onPress={() => setActiveTab('water')}
                            style={[styles.tabBtn, activeTab === 'water' && styles.tabBtnActiveWater]}
                        >
                            <Icon name="water-filter" size={20} color={activeTab === 'water' ? '#FFF' : '#64748B'} />
                            <Text style={[styles.tabTxt, activeTab === 'water' && styles.tabTxtActive]}>
                                Water R.O
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setActiveTab('solar')}
                            style={[styles.tabBtn, activeTab === 'solar' && styles.tabBtnActiveSolar]}
                        >
                            <Icon name="solar-power" size={20} color={activeTab === 'solar' ? '#FFF' : '#64748B'} />
                            <Text style={[styles.tabTxt, activeTab === 'solar' && styles.tabTxtActive]}>
                                Solar & Power
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Section Header */}
                    <View style={styles.sectionHeaderBox}>
                        <Text style={styles.sectionMainTitle}>
                            {activeTab === 'water' ? t('sunpower.water_ro.title') : t('sunpower.power_solar.title')}
                        </Text>
                        <Text style={styles.sectionSubTitle}>
                            {activeTab === 'water' ? t('sunpower.water_ro.desc') : t('sunpower.power_solar.desc')}
                        </Text>
                    </View>

                    {/* Service Cards with Images */}
                    <View style={styles.pillarSection}>
                        {services.map((svc) => (
                            <View key={svc.key} style={styles.cardItem}>
                                {/* Card Image Banner */}
                                <Image
                                    source={typeof svc.image === 'string' ? { uri: svc.image } : svc.image}
                                    style={styles.cardBannerImg}
                                    resizeMode="cover"
                                />
                                {/* Accent stripe */}
                                <View style={[styles.cardAccentStripe, { backgroundColor: svc.accentColor }]} />

                                <View style={styles.cardBody}>
                                    <View style={styles.cardHeaderRow}>
                                        <View style={[styles.cardIconBox, { backgroundColor: svc.iconBg }]}>
                                            <Icon name={svc.icon} size={26} color={svc.iconColor} />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.cardItemTitle}>{(svc as any).title || ((svc as any).titleKey ? t((svc as any).titleKey) : '')}</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.cardItemDesc}>{(svc as any).desc || ((svc as any).descKey ? t((svc as any).descKey) : '')}</Text>
                                    <View style={[styles.analysisBox, { borderLeftColor: svc.accentColor }]}>
                                        <Text style={styles.analysisTag}>{t('sunpower.analysis_label')}</Text>
                                        <Text style={styles.analysisTxt}>{(svc as any).analysis || ((svc as any).analysisKey ? t((svc as any).analysisKey) : '')}</Text>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>

                    {/* Location Card */}
                    <View style={styles.locationCard}>
                        <View style={styles.locHeader}>
                            <Icon name="map-marker-radius" size={24} color="#D97706" />
                            <Text style={styles.locTitle}>Location</Text>
                        </View>
                        {/* Map preview image */}
                        <TouchableOpacity
                            onPress={() => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(t('sunpower.location'))}`)}
                        >
                            <Image
                                source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop' }}
                                style={styles.mapPreviewImg}
                                resizeMode="cover"
                            />
                        </TouchableOpacity>
                        <Text style={styles.locAddress}>{t('sunpower.location')}</Text>
                        <TouchableOpacity
                            style={styles.mapBtn}
                            onPress={() => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(t('sunpower.location'))}`)}
                        >
                            <Text style={styles.mapBtnTxt}>View on Map</Text>
                            <Icon name="arrow-right" size={16} color="#D97706" />
                        </TouchableOpacity>
                    </View>

                    {/* Premium Dialers & Consultations Block */}
                    <View style={styles.contactSection}>
                        <Text style={styles.ctaHead}>{t('sunpower.cta_heading')}</Text>
                        <View style={styles.contactRow}>
                            <TouchableOpacity style={styles.callPrimaryBtn} onPress={handleCallPrimary}>
                                <Icon name="phone" size={20} color="#FFF" />
                                <Text style={styles.contactBtnTxt}>9865088885</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.callSecondaryBtn} onPress={handleCallSecondary}>
                                <Icon name="phone-outgoing" size={20} color="#FFF" />
                                <Text style={styles.contactBtnTxt}>9095270567</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={styles.whatsappBtn} onPress={handleWhatsApp}>
                            <Icon name="whatsapp" size={20} color="#FFF" />
                            <Text style={styles.contactBtnTxt}>WhatsApp Enquiry</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            {/* Custom Premium Floating Header Bar */}
            <View style={styles.navBar}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Icon name="chevron-left" size={28} color="#0F172A" />
                </TouchableOpacity>
                <Text style={styles.navTitle}>{t('sunpower.nav_title')}</Text>
                <TouchableOpacity style={styles.shareBtn} onPress={handleWhatsApp}>
                    <Icon name="share-variant-outline" size={24} color="#0F172A" />
                </TouchableOpacity>
            </View>

            {/* Standard Floating buttons for safe area compliance */}
            <FloatingContactButtons
                phoneNumber="9865088885"
                whatsappNumber="9865088885"
                businessName={t('dashboard.portfolios.sunpower.name')}
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
        backgroundColor: 'rgba(15, 23, 42, 0.45)',
        padding: 20,
        paddingTop: Platform.OS === 'ios' ? 70 : 60,
        justifyContent: 'flex-end',
    },
    badgeRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 12,
    },
    badge: {
        backgroundColor: '#D97706',
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 20,
    },
    badgeAlt: {
        backgroundColor: '#EA580C',
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 20,
    },
    badgeText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    heroContent: {
        marginBottom: 20,
    },
    brandTitle: {
        fontSize: 30,
        fontWeight: '900',
        color: '#FFF',
        lineHeight: 36,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    brandSubtitle: {
        fontSize: 15,
        color: 'rgba(248, 250, 252, 0.95)',
        marginTop: 6,
        fontWeight: '600',
    },
    scrollContainer: {
        paddingTop: height * 0.42,
    },
    mainContent: {
        backgroundColor: '#F8FAFC',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        marginTop: -32,
        paddingTop: 30,
        paddingHorizontal: 20,
        paddingBottom: 120,
    },

    /* â”€â”€ Owner card â”€â”€ */
    ownerCard: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 20,
        elevation: 8,
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.06,
        shadowRadius: 16,
        marginBottom: 24,
    },
    ownerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 18,
    },
    avatar: {
        width: 62,
        height: 62,
        borderRadius: 22,
        marginRight: 16,
        position: 'relative',
    },
    avatarImg: {
        width: 62,
        height: 62,
        borderRadius: 22,
        borderWidth: 2,
        borderColor: '#D97706',
    },
    avatarBadge: {
        position: 'absolute',
        bottom: -2,
        right: -2,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#D97706',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFF',
    },
    ownerTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#0F172A',
    },
    ownerSub: {
        fontSize: 12,
        color: '#475569',
        marginTop: 3,
        lineHeight: 18,
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
        color: '#D97706',
    },
    statLab: {
        fontSize: 10,
        color: '#64748B',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginTop: 2,
    },
    statDivider: {
        width: 1,
        height: 26,
        backgroundColor: '#E2E8F0',
    },

    /* â”€â”€ Gallery â”€â”€ */
    gallerySection: {
        marginBottom: 24,
    },
    gallerySectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 14,
    },
    gallerySectionTitle: {
        fontSize: 16,
        fontWeight: '900',
        color: '#0F172A',
    },
    galleryList: {
        gap: 12,
        paddingRight: 4,
    },
    galleryCard: {
        width: 130,
        height: 100,
        borderRadius: 18,
        overflow: 'hidden',
        position: 'relative',
        elevation: 4,
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    galleryImg: {
        width: '100%',
        height: '100%',
    },
    galleryOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(15,23,42,0.55)',
        paddingVertical: 6,
        paddingHorizontal: 10,
    },
    galleryLabel: {
        fontSize: 11,
        fontWeight: '800',
        color: '#FFF',
    },

    /* â”€â”€ Tabs â”€â”€ */
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#E2E8F0',
        padding: 4,
        borderRadius: 20,
        marginBottom: 20,
    },
    tabBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 16,
        gap: 8,
    },
    tabBtnActiveWater: {
        backgroundColor: '#2563EB',
        elevation: 6,
        shadowColor: '#2563EB',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
    },
    tabBtnActiveSolar: {
        backgroundColor: '#D97706',
        elevation: 6,
        shadowColor: '#D97706',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
    },
    tabTxt: {
        fontSize: 14,
        fontWeight: '800',
        color: '#475569',
    },
    tabTxtActive: {
        color: '#FFF',
    },

    /* â”€â”€ Section header â”€â”€ */
    pillarSection: {
        gap: 20,
    },
    sectionHeaderBox: {
        marginBottom: 16,
        paddingHorizontal: 4,
    },
    sectionMainTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: '#0F172A',
    },
    sectionSubTitle: {
        fontSize: 13,
        color: '#64748B',
        lineHeight: 20,
        marginTop: 4,
    },

    /* â”€â”€ Service card with image â”€â”€ */
    cardItem: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
    },
    cardBannerImg: {
        width: '100%',
        height: 160,
    },
    cardAccentStripe: {
        height: 4,
        width: '100%',
    },
    cardBody: {
        padding: 20,
    },
    cardHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginBottom: 12,
    },
    cardIconBox: {
        width: 52,
        height: 52,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardItemTitle: {
        fontSize: 16,
        fontWeight: '900',
        color: '#0F172A',
    },
    cardItemDesc: {
        fontSize: 13,
        color: '#475569',
        lineHeight: 20,
    },
    analysisBox: {
        marginTop: 14,
        backgroundColor: '#F8FAFC',
        borderRadius: 14,
        padding: 14,
        borderLeftWidth: 3,
        borderLeftColor: '#2563EB',
    },
    analysisTag: {
        fontSize: 10,
        fontWeight: '900',
        color: '#64748B',
        letterSpacing: 1,
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    analysisTxt: {
        fontSize: 12,
        color: '#334155',
        lineHeight: 18,
    },

    /* â”€â”€ Location card â”€â”€ */
    locationCard: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        overflow: 'hidden',
        marginTop: 28,
        elevation: 4,
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 12,
    },
    mapPreviewImg: {
        width: '100%',
        height: 130,
    },
    locHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 16,
        paddingHorizontal: 20,
        marginBottom: 8,
    },
    locTitle: {
        fontSize: 16,
        fontWeight: '900',
        color: '#0F172A',
    },
    locAddress: {
        fontSize: 13,
        color: '#475569',
        lineHeight: 20,
        paddingHorizontal: 20,
    },
    mapBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 14,
        paddingHorizontal: 20,
        paddingBottom: 20,
        gap: 4,
    },
    mapBtnTxt: {
        fontSize: 13,
        fontWeight: '700',
        color: '#D97706',
    },

    /* â”€â”€ Contact section â”€â”€ */
    contactSection: {
        marginTop: 36,
        backgroundColor: '#FFF',
        borderRadius: 28,
        padding: 20,
        alignItems: 'center',
        elevation: 6,
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.05,
        shadowRadius: 16,
    },
    ctaHead: {
        fontSize: 17,
        fontWeight: '900',
        color: '#0F172A',
        marginBottom: 18,
        textAlign: 'center',
    },
    contactRow: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
        marginBottom: 12,
    },
    callPrimaryBtn: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#D97706',
        paddingVertical: 14,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        elevation: 4,
    },
    callSecondaryBtn: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#EA580C',
        paddingVertical: 14,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        elevation: 4,
    },
    whatsappBtn: {
        width: '100%',
        flexDirection: 'row',
        backgroundColor: '#25D366',
        paddingVertical: 14,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        elevation: 4,
    },
    contactBtnTxt: {
        color: '#FFF',
        fontWeight: '900',
        fontSize: 13,
    },

    /* â”€â”€ Navbar â”€â”€ */
    navBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: Platform.OS === 'ios' ? 110 : 90,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 50 : 35,
        zIndex: 100,
    },
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    navTitle: {
        fontSize: 13,
        fontWeight: '900',
        color: '#FFF',
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    shareBtn: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
});

export default SunPowerPortfolioScreen;

