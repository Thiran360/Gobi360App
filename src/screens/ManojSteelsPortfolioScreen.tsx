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

const HERO_IMAGE = require('../assets/images/portfolio/manojsteels/manojsteels_hero.png');
const STEEL_IMAGE = require('../assets/images/portfolio/manojsteels/manojsteels_steel.png');
const CEMENT_IMAGE = require('../assets/images/portfolio/manojsteels/manojsteels_cement.png');
const AGGREGATE_IMAGE = require('../assets/images/portfolio/manojsteels/manojsteels_aggregate.png');
const BLOCKS_IMAGE = require('../assets/images/portfolio/manojsteels/manojsteels_blocks.png');
const SAND_IMAGE = require('../assets/images/portfolio/manojsteels/manojsteels_sand.png');
const AVATAR_IMAGE = require('../assets/images/ai_human_male_open.jpg');
const LOGO_IMAGE = require('../assets/images/portfolio/manojsteels/manojsteels_logo.png');

/* ─── Product gallery images ─────────────────────────────────────── */
const GALLERY = [
    {
        id: '1',
        label: 'TMT Steel Bars',
        image: STEEL_IMAGE,
    },
    {
        id: '2',
        label: 'High-Grade Cement',
        image: CEMENT_IMAGE,
    },
    {
        id: '3',
        label: 'Blue Metal Aggregate',
        image: AGGREGATE_IMAGE,
    },
    {
        id: '4',
        label: 'Solid Concrete Blocks',
        image: BLOCKS_IMAGE,
    },
    {
        id: '5',
        label: 'M-Sand & P-Sand',
        image: SAND_IMAGE,
    },
];

/* ─── Service data with images ───────────────────────────────────── */
const CEMENT_STEEL_SERVICES = [
    {
        key: 'cs1',
        titleKey: 'portfolio.manojsteels.cement_steel.s1_title',
        descKey: 'portfolio.manojsteels.cement_steel.s1_desc',
        analysisKey: 'portfolio.manojsteels.cement_steel.s1_analysis',
        icon: 'wall',
        iconBg: '#FFF7ED',
        iconColor: '#EA580C',
        accentColor: '#EA580C',
        image: CEMENT_IMAGE,
    },
    {
        key: 'cs2',
        titleKey: 'portfolio.manojsteels.cement_steel.s2_title',
        descKey: 'portfolio.manojsteels.cement_steel.s2_desc',
        analysisKey: 'portfolio.manojsteels.cement_steel.s2_analysis',
        icon: 'blur-linear',
        iconBg: '#F0FDFA',
        iconColor: '#0EA5E9',
        accentColor: '#0EA5E9',
        image: STEEL_IMAGE,
    },
    {
        key: 'cs3',
        titleKey: 'portfolio.manojsteels.cement_steel.s3_title',
        descKey: 'portfolio.manojsteels.cement_steel.s3_desc',
        analysisKey: 'portfolio.manojsteels.cement_steel.s3_analysis',
        icon: 'truck-delivery',
        iconBg: '#F5F3FF',
        iconColor: '#8B5CF6',
        accentColor: '#8B5CF6',
        image: HERO_IMAGE,
    },
];

const AGGREGATES_BLOCKS_SERVICES = [
    {
        key: 'ab1',
        titleKey: 'portfolio.manojsteels.aggregates_blocks.s1_title',
        descKey: 'portfolio.manojsteels.aggregates_blocks.s1_desc',
        analysisKey: 'portfolio.manojsteels.aggregates_blocks.s1_analysis',
        icon: 'texture',
        iconBg: '#FEF3C7',
        iconColor: '#D97706',
        accentColor: '#D97706',
        image: AGGREGATE_IMAGE,
    },
    {
        key: 'ab2',
        titleKey: 'portfolio.manojsteels.aggregates_blocks.s2_title',
        descKey: 'portfolio.manojsteels.aggregates_blocks.s2_desc',
        analysisKey: 'portfolio.manojsteels.aggregates_blocks.s2_analysis',
        icon: 'cube-outline',
        iconBg: '#EFF6FF',
        iconColor: '#2563EB',
        accentColor: '#2563EB',
        image: BLOCKS_IMAGE,
    },
    {
        key: 'ab3',
        titleKey: 'portfolio.manojsteels.aggregates_blocks.s3_title',
        descKey: 'portfolio.manojsteels.aggregates_blocks.s3_desc',
        analysisKey: 'portfolio.manojsteels.aggregates_blocks.s3_analysis',
        icon: 'grain',
        iconBg: '#ECFDF5',
        iconColor: '#059669',
        accentColor: '#059669',
        image: SAND_IMAGE,
    },
];

const ManojSteelsPortfolioScreen = ({ navigation }: any) => {
    const { t } = useTranslation();
    const scrollY = useRef(new Animated.Value(0)).current;
    const [activeTab, setActiveTab] = useState<'steel_cement' | 'aggregates_blocks'>('steel_cement');

    const handleCallPrimary = () => {
        triggerCall('9994488447', 'Manojsteels (ManojKumar anandhan)');
    };

    const handleCallSecondary = () => {
        triggerCall('9364476444', 'Manojsteels (Alternative Contact)');
    };

    const handleWhatsApp = () => {
        const msg = t('portfolio.manojsteels.whatsapp_msg');
        Linking.openURL(`whatsapp://send?phone=919994488447&text=${encodeURIComponent(msg)}`);
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

    const services = activeTab === 'steel_cement' ? CEMENT_STEEL_SERVICES : AGGREGATES_BLOCKS_SERVICES;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            <Animated.View style={[styles.header, { height: headerHeight }]}>
                <ImageBackground
                    source={HERO_IMAGE}
                    style={styles.heroImg}
                >
                    <Animated.View style={[styles.heroOverlay, { opacity: headerOpacity }]}>
                        <View style={styles.badgeRow}>
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{t('portfolio.manojsteels.service_tag')}</Text>
                            </View>
                            <View style={styles.badgeAlt}>
                                <Text style={styles.badgeText}>ESTD 2012</Text>
                            </View>
                        </View>
                        <View style={styles.heroContent}>
                            <View style={styles.logoContainer}>
                                <Image
                                    source={LOGO_IMAGE}
                                    style={styles.logoImg}
                                    resizeMode="contain"
                                />
                            </View>
                            <Text style={styles.brandTitle}>{t('dashboard.portfolios.manojsteels.name')}</Text>
                            <Text style={styles.brandSubtitle}>{t('dashboard.portfolios.manojsteels.tagline')}</Text>
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
                    {/* Owner Card */}
                    <View style={styles.ownerCard}>
                        <View style={styles.ownerInfo}>
                            <View style={styles.avatar}>
                                <Image
                                    source={LOGO_IMAGE}
                                    style={styles.avatarImg}
                                    resizeMode="contain"
                                />
                                <View style={styles.avatarBadge}>
                                    <Icon name="shield-check" size={10} color="#FFF" />
                                </View>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.ownerTitle}>{t('portfolio.manojsteels.team_title')}</Text>
                                <Text style={styles.ownerSub}>{t('portfolio.manojsteels.team_desc')}</Text>
                            </View>
                        </View>
                        <View style={styles.statsRow}>
                            <View style={styles.statItem}>
                                <Text style={styles.statVal}>14+</Text>
                                <Text style={styles.statLab}>Years Exp</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <Text style={styles.statVal}>IS</Text>
                                <Text style={styles.statLab}>Certified</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <Text style={styles.statVal}>Gobi</Text>
                                <Text style={styles.statLab}>T.N.Palayam</Text>
                            </View>
                        </View>
                    </View>

                    {/* Product Gallery */}
                    <View style={styles.gallerySection}>
                        <View style={styles.gallerySectionHeader}>
                            <Icon name="warehouse" size={18} color="#B45309" />
                            <Text style={styles.gallerySectionTitle}>Product Gallery</Text>
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

                    {/* Tabs */}
                    <View style={styles.tabContainer}>
                        <TouchableOpacity
                            onPress={() => setActiveTab('steel_cement')}
                            style={[styles.tabBtn, activeTab === 'steel_cement' && styles.tabBtnActiveCement]}
                        >
                            <Icon name="factory" size={20} color={activeTab === 'steel_cement' ? '#FFF' : '#64748B'} />
                            <Text style={[styles.tabTxt, activeTab === 'steel_cement' && styles.tabTxtActive]}>
                                Steel & Cement
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setActiveTab('aggregates_blocks')}
                            style={[styles.tabBtn, activeTab === 'aggregates_blocks' && styles.tabBtnActiveBlocks]}
                        >
                            <Icon name="office-building" size={20} color={activeTab === 'aggregates_blocks' ? '#FFF' : '#64748B'} />
                            <Text style={[styles.tabTxt, activeTab === 'aggregates_blocks' && styles.tabTxtActive]}>
                                Aggregates & Blocks
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Section Header */}
                    <View style={styles.sectionHeaderBox}>
                        <Text style={styles.sectionMainTitle}>
                            {activeTab === 'steel_cement' ? t('portfolio.manojsteels.cement_steel.title') : t('portfolio.manojsteels.aggregates_blocks.title')}
                        </Text>
                        <Text style={styles.sectionSubTitle}>
                            {activeTab === 'steel_cement' ? t('portfolio.manojsteels.cement_steel.desc') : t('portfolio.manojsteels.aggregates_blocks.desc')}
                        </Text>
                    </View>

                    {/* Service Cards */}
                    <View style={styles.pillarSection}>
                        {services.map((svc) => (
                            <View key={svc.key} style={styles.cardItem}>
                                <Image
                                    source={svc.image}
                                    style={styles.cardBannerImg}
                                    resizeMode="cover"
                                />
                                <View style={[styles.cardAccentStripe, { backgroundColor: svc.accentColor }]} />

                                <View style={styles.cardBody}>
                                    <View style={styles.cardHeaderRow}>
                                        <View style={[styles.cardIconBox, { backgroundColor: svc.iconBg }]}>
                                            <Icon name={svc.icon} size={26} color={svc.iconColor} />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.cardItemTitle}>{t(svc.titleKey)}</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.cardItemDesc}>{t(svc.descKey)}</Text>
                                    <View style={[styles.analysisBox, { borderLeftColor: svc.accentColor }]}>
                                        <Text style={styles.analysisTag}>{t('portfolio.manojsteels.analysis_label')}</Text>
                                        <Text style={styles.analysisTxt}>{t(svc.analysisKey)}</Text>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>

                    {/* Location Card */}
                    <View style={styles.locationCard}>
                        <View style={styles.locHeader}>
                            <Icon name="map-marker-radius" size={24} color="#B45309" />
                            <Text style={styles.locTitle}>Business Location</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(t('portfolio.manojsteels.location'))}`)}
                        >
                            <Image
                                source={{ uri: 'https://image.pollinations.ai/prompt/minimalist%20clean%20gps%20navigation%20map%20route%20isometric%20view' }}
                                style={styles.mapPreviewImg}
                                resizeMode="cover"
                            />
                        </TouchableOpacity>
                        <Text style={styles.locAddress}>{t('portfolio.manojsteels.location')}</Text>
                        <TouchableOpacity
                            style={styles.mapBtn}
                            onPress={() => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(t('portfolio.manojsteels.location'))}`)}
                        >
                            <Text style={styles.mapBtnTxt}>Get Navigation Directions</Text>
                            <Icon name="arrow-right" size={16} color="#B45309" />
                        </TouchableOpacity>
                    </View>

                    {/* Contact & Consultation Block */}
                    <View style={styles.contactSection}>
                        <Text style={styles.ctaHead}>{t('portfolio.manojsteels.cta_heading')}</Text>
                        <View style={styles.contactRow}>
                            <TouchableOpacity style={styles.callPrimaryBtn} onPress={handleCallPrimary}>
                                <Icon name="phone" size={20} color="#FFF" />
                                <Text style={styles.contactBtnTxt}>9994488447</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.callSecondaryBtn} onPress={handleCallSecondary}>
                                <Icon name="phone-outgoing" size={20} color="#FFF" />
                                <Text style={styles.contactBtnTxt}>9364476444</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={styles.whatsappBtn} onPress={handleWhatsApp}>
                            <Icon name="whatsapp" size={20} color="#FFF" />
                            <Text style={styles.contactBtnTxt}>WhatsApp Order Desk</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            {/* Custom Header Bar */}
            <View style={styles.navBar}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Icon name="chevron-left" size={28} color="#0F172A" />
                </TouchableOpacity>
                <Text style={styles.navTitle}>{t('portfolio.manojsteels.nav_title')}</Text>
                <TouchableOpacity style={styles.shareBtn} onPress={handleWhatsApp}>
                    <Icon name="share-variant-outline" size={24} color="#0F172A" />
                </TouchableOpacity>
            </View>

            <FloatingContactButtons
                phoneNumber="9994488447"
                whatsappNumber="9994488447"
                businessName={t('dashboard.portfolios.manojsteels.name')}
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
        backgroundColor: '#B45309',
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 20,
    },
    badgeAlt: {
        backgroundColor: '#475569',
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
    logoContainer: {
        backgroundColor: '#FFF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        alignSelf: 'flex-start',
        marginBottom: 14,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    logoImg: {
        width: 130,
        height: 40,
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
        borderColor: '#B45309',
        backgroundColor: '#FFF',
        padding: 4,
    },
    avatarBadge: {
        position: 'absolute',
        bottom: -2,
        right: -2,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#B45309',
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
        color: '#B45309',
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
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        paddingVertical: 6,
        paddingHorizontal: 8,
        alignItems: 'center',
    },
    galleryLabel: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: '800',
        textAlign: 'center',
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#E2E8F0',
        padding: 5,
        borderRadius: 18,
        marginBottom: 24,
    },
    tabBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 14,
        gap: 8,
    },
    tabBtnActiveCement: {
        backgroundColor: '#475569',
    },
    tabBtnActiveBlocks: {
        backgroundColor: '#B45309',
    },
    tabTxt: {
        fontSize: 13,
        fontWeight: '700',
        color: '#64748B',
    },
    tabTxtActive: {
        color: '#FFF',
    },
    sectionHeaderBox: {
        marginBottom: 20,
    },
    sectionMainTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: '#0F172A',
        letterSpacing: -0.2,
    },
    sectionSubTitle: {
        fontSize: 13,
        color: '#64748B',
        marginTop: 4,
        lineHeight: 18,
    },
    pillarSection: {
        gap: 20,
        marginBottom: 24,
    },
    cardItem: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        overflow: 'hidden',
        elevation: 6,
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
    },
    cardBannerImg: {
        width: '100%',
        height: 140,
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
        gap: 12,
        marginBottom: 12,
    },
    cardIconBox: {
        width: 48,
        height: 48,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardItemTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#0F172A',
    },
    cardItemDesc: {
        fontSize: 13,
        color: '#475569',
        lineHeight: 20,
        marginBottom: 16,
    },
    analysisBox: {
        backgroundColor: '#F8FAFC',
        borderLeftWidth: 3,
        padding: 12,
        borderRadius: 8,
    },
    analysisTag: {
        fontSize: 9,
        fontWeight: '900',
        color: '#64748B',
        letterSpacing: 1,
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    analysisTxt: {
        fontSize: 12,
        fontWeight: '600',
        color: '#1E293B',
        lineHeight: 16,
    },
    locationCard: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 20,
        elevation: 6,
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        marginBottom: 24,
    },
    locHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    locTitle: {
        fontSize: 16,
        fontWeight: '900',
        color: '#0F172A',
    },
    mapPreviewImg: {
        width: '100%',
        height: 150,
        borderRadius: 16,
        marginBottom: 12,
    },
    locAddress: {
        fontSize: 13,
        color: '#475569',
        lineHeight: 18,
        marginBottom: 14,
    },
    mapBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1.5,
        borderColor: '#F1F5F9',
        padding: 14,
        borderRadius: 16,
    },
    mapBtnTxt: {
        fontSize: 13,
        fontWeight: '700',
        color: '#B45309',
    },
    contactSection: {
        backgroundColor: '#1E293B',
        borderRadius: 24,
        padding: 20,
        alignItems: 'center',
    },
    ctaHead: {
        fontSize: 16,
        fontWeight: '800',
        color: '#FFF',
        marginBottom: 16,
        textAlign: 'center',
    },
    contactRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
    },
    callPrimaryBtn: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#B45309',
        paddingVertical: 14,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    callSecondaryBtn: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#475569',
        paddingVertical: 14,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    whatsappBtn: {
        width: '100%',
        flexDirection: 'row',
        backgroundColor: '#16A34A',
        paddingVertical: 14,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    contactBtnTxt: {
        color: '#FFF',
        fontSize: 13,
        fontWeight: '800',
    },
    navBar: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 50 : 20,
        left: 16,
        right: 16,
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 100,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
    },
    shareBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
    },
    navTitle: {
        fontSize: 16,
        fontWeight: '900',
        color: '#FFF',
        textShadowColor: 'rgba(0, 0, 0, 0.4)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
});

export default ManojSteelsPortfolioScreen;

