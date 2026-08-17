import React, { useRef, useState } from 'react';
import FloatingCartButton from '../components/FloatingCartButton';
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
import { useTranslation } from 'react-i18next';
import FloatingContactButtons from '../components/FloatingContactButtons';

import { triggerCall } from '../utils/callTracker';

const { width, height } = Dimensions.get('window');

const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 44 : (StatusBar.currentHeight || 24);
const HEADER_EXPANDED = 300;
const HEADER_COLLAPSED = STATUS_BAR_HEIGHT + 56;

// Curated top-tier photography assets
const HERO_IMAGE = { uri: 'https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?q=80&w=800&auto=format&fit=crop' };
const PORTRAIT_IMAGE = { uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop' };
const WEDDING_IMAGE = { uri: 'https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?q=80&w=800&auto=format&fit=crop' };
const OUTDOOR_IMAGE = { uri: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=800&auto=format&fit=crop' };
const PRODUCT_IMAGE = { uri: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop' };
// AVATAR_IMAGE removed per user request

/* ─── Media gallery images ───────────────────────────────────────── */
const GALLERY = [
    {
        id: '1',
        label: 'Studio Portraits',
        image: PORTRAIT_IMAGE,
    },
    {
        id: '2',
        label: 'Wedding & Events',
        image: WEDDING_IMAGE,
    },
    {
        id: '3',
        label: 'Outdoor & Fashion',
        image: OUTDOOR_IMAGE,
    },
    {
        id: '4',
        label: 'Commercial Product',
        image: PRODUCT_IMAGE,
    },
];

/* ─── Service data with image mappings ───────────────────────────── */
const PORTRAIT_SERVICES = [
    {
        key: 'ps1',
        titleKey: 'portfolio.mejestic.studio_portraits.s1_title',
        descKey: 'portfolio.mejestic.studio_portraits.s1_desc',
        analysisKey: 'portfolio.mejestic.studio_portraits.s1_analysis',
        icon: 'camera-account',
        iconBg: '#1E1B4B',
        iconColor: '#F59E0B',
        accentColor: '#F59E0B',
        image: PORTRAIT_IMAGE,
    },
    {
        key: 'ps2',
        titleKey: 'portfolio.mejestic.studio_portraits.s2_title',
        descKey: 'portfolio.mejestic.studio_portraits.s2_desc',
        analysisKey: 'portfolio.mejestic.studio_portraits.s2_analysis',
        icon: 'baby-face-outline',
        iconBg: '#1E1B4B',
        iconColor: '#3B82F6',
        accentColor: '#3B82F6',
        image: OUTDOOR_IMAGE,
    },
    {
        key: 'ps3',
        titleKey: 'portfolio.mejestic.studio_portraits.s3_title',
        descKey: 'portfolio.mejestic.studio_portraits.s3_desc',
        analysisKey: 'portfolio.mejestic.studio_portraits.s3_analysis',
        icon: 'card-account-details-outline',
        iconBg: '#1E1B4B',
        iconColor: '#10B981',
        accentColor: '#10B981',
        image: PRODUCT_IMAGE,
    },
];

const WEDDING_SERVICES = [
    {
        key: 'ws1',
        titleKey: 'portfolio.mejestic.events_weddings.s1_title',
        descKey: 'portfolio.mejestic.events_weddings.s1_desc',
        analysisKey: 'portfolio.mejestic.events_weddings.s1_analysis',
        icon: 'ring',
        iconBg: '#1E1B4B',
        iconColor: '#EC4899',
        accentColor: '#EC4899',
        image: WEDDING_IMAGE,
    },
    {
        key: 'ws2',
        titleKey: 'portfolio.mejestic.events_weddings.s2_title',
        descKey: 'portfolio.mejestic.events_weddings.s2_desc',
        analysisKey: 'portfolio.mejestic.events_weddings.s2_analysis',
        icon: 'video-vintage',
        iconBg: '#1E1B4B',
        iconColor: '#8B5CF6',
        accentColor: '#8B5CF6',
        image: HERO_IMAGE,
    },
    {
        key: 'ws3',
        titleKey: 'portfolio.mejestic.events_weddings.s3_title',
        descKey: 'portfolio.mejestic.events_weddings.s3_desc',
        analysisKey: 'portfolio.mejestic.events_weddings.s3_analysis',
        icon: 'image-filter-hdr',
        iconBg: '#1E1B4B',
        iconColor: '#06B6D4',
        accentColor: '#06B6D4',
        image: OUTDOOR_IMAGE,
    },
];

interface Props {
    navigation: any;
}

const MejesticStudioPortfolioScreen = ({ navigation }: Props) => {
    const { t } = useTranslation();
    const scrollY = useRef(new Animated.Value(0)).current;
    const [activeTab, setActiveTab] = useState<'studio' | 'wedding'>('studio');

    // Phone number from user requirement
    const phoneNumber = '9791797777';

    // Map parameters
    const lat = 11.4552;
    const lng = 77.4338;
    const label = 'Majastic Studio, Gobi';

    const handleCall = () => {
        triggerCall(phoneNumber, 'Majastic Studio');
    };

    const handleWhatsApp = () => {
        const message = t('portfolio.mejestic.whatsapp_msg');
        const url = `whatsapp://send?phone=+91${phoneNumber}&text=${encodeURIComponent(message)}`;
        Linking.canOpenURL(url).then((supported) => {
            if (supported) {
                Linking.openURL(url);
            } else {
                Linking.openURL(`https://api.whatsapp.com/send?phone=91${phoneNumber}&text=${encodeURIComponent(message)}`);
            }
        });
    };

    const handleMapOpen = () => {
        const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
        const latLng = `${lat},${lng}`;
        const query = encodeURIComponent(label);
        const url = Platform.select({
            ios: `${scheme}${query}@${latLng}`,
            android: `${scheme}${latLng}(${query})`,
        });

        if (url) {
            Linking.canOpenURL(url).then((supported) => {
                if (supported) {
                    Linking.openURL(url);
                } else {
                    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`);
                }
            });
        }
    };

    // Parallax animations
    const headerHeight = scrollY.interpolate({
        inputRange: [0, 240],
        outputRange: [HEADER_EXPANDED, HEADER_COLLAPSED],
        extrapolate: 'clamp',
    });

    const bannerOpacity = scrollY.interpolate({
        inputRange: [0, 180],
        outputRange: [1, 0],
        extrapolate: 'clamp',
    });

    const headerTitleOpacity = scrollY.interpolate({
        inputRange: [120, 200],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });

    const headerTitleTranslate = scrollY.interpolate({
        inputRange: [120, 200],
        outputRange: [15, 0],
        extrapolate: 'clamp',
    });

    const renderGalleryItem = ({ item }: { item: typeof GALLERY[0] }) => (
        <View style={styles.galleryCard}>
            <ImageBackground source={item.image} style={styles.galleryImg} resizeMode="cover">
                <View style={styles.galleryOverlay}>
                    <Text style={styles.galleryText}>{item.label}</Text>
                </View>
            </ImageBackground>
        </View>
    );

    const activeServicesList = activeTab === 'studio' ? PORTRAIT_SERVICES : WEDDING_SERVICES;

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <StatusBar barStyle="light-content" backgroundColor="#121212" />

            {/* Floating Contact Action Drawer */}
            <FloatingContactButtons
                phoneNumber={phoneNumber}
                businessName="Majastic Studio"
            />

            {/* Back Arrow Floating Header Overlay */}
            <View style={styles.floatingHeader}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.7}
                >
                    <Icon name="arrow-left" size={24} color="#0F172A" />
                </TouchableOpacity>
            </View>

            {/* Animated Header Banner */}
            <Animated.View style={[styles.heroContainer, { height: headerHeight }]}>
                <Animated.Image
                    source={HERO_IMAGE}
                    style={[styles.heroImage, { opacity: bannerOpacity }]}
                />
                <Animated.View style={[styles.heroDarkOverlay, { opacity: bannerOpacity }]} />

                {/* Parallax Content Layer */}
                <Animated.View style={[styles.heroContent, { opacity: bannerOpacity }]}>
                    <View style={styles.shutterTag}>
                        <Icon name="camera-iris" size={14} color="#F59E0B" />
                        <Text style={styles.shutterTagText}>
                            {t('dashboard.portfolios.mejestic.badge')}
                        </Text>
                    </View>
                    <Text style={styles.brandTitle}>
                        {t('dashboard.portfolios.mejestic.name')}
                    </Text>
                    <Text style={styles.brandSubtitle}>
                        {t('dashboard.portfolios.mejestic.tagline')}
                    </Text>
                </Animated.View>

                {/* Collapsed Top Header Title */}
                <Animated.View
                    style={[
                        styles.collapsedHeaderContent,
                        {
                            opacity: headerTitleOpacity,
                            transform: [{ translateY: headerTitleTranslate }],
                        },
                    ]}
                >
                    <Text style={styles.collapsedTitle} numberOfLines={1}>
                        {t('dashboard.portfolios.mejestic.name')}
                    </Text>
                </Animated.View>
            </Animated.View>

            <ScrollView
                style={styles.scrollView}
                scrollEventThrottle={16}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Statistics Highlights */}
                <View style={styles.statsStrip}>
                    <View style={styles.statCell}>
                        <Text style={styles.statValue}>14+</Text>
                        <Text style={styles.statLabel}>Years Exp</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statCell}>
                        <Text style={styles.statValue}>500+</Text>
                        <Text style={styles.statLabel}>Weddings</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statCell}>
                        <View style={styles.ratingRow}>
                            <Text style={styles.statValue}>4.9</Text>
                            <Icon name="star" size={18} color="#FFB300" style={{ marginLeft: 2 }} />
                        </View>
                        <Text style={styles.statLabel}>Rating</Text>
                    </View>
                </View>

                {/* Studio Portfolio Gallery Section */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionHeader}>
                        {t('portfolio.mejestic.section_header')}
                    </Text>
                    <Text style={styles.sectionSubtitle}>
                        {t('portfolio.mejestic.service_tag')}
                    </Text>

                    <FlatList
                        data={GALLERY}
                        renderItem={renderGalleryItem}
                        keyExtractor={(item) => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.galleryList}
                    />
                </View>

                {/* Interactive Dynamic Tabs */}
                <View style={styles.tabSection}>
                    <View style={styles.tabHeader}>
                        <TouchableOpacity
                            style={[styles.tabButton, activeTab === 'studio' && styles.tabButtonActive]}
                            onPress={() => setActiveTab('studio')}
                            activeOpacity={0.8}
                        >
                            <Icon
                                name="camera-enhance"
                                size={18}
                                color={activeTab === 'studio' ? '#FFD700' : '#888'}
                            />
                            <Text style={[styles.tabButtonText, activeTab === 'studio' && styles.tabButtonTextActive]}>
                                Studio & Portrait
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.tabButton, activeTab === 'wedding' && styles.tabButtonActive]}
                            onPress={() => setActiveTab('wedding')}
                            activeOpacity={0.8}
                        >
                            <Icon
                                name="human-greeting-proximity"
                                size={18}
                                color={activeTab === 'wedding' ? '#FFD700' : '#888'}
                            />
                            <Text style={[styles.tabButtonText, activeTab === 'wedding' && styles.tabButtonTextActive]}>
                                Weddings & Outdoor
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Services Cards */}
                    <View style={styles.cardsWrapper}>
                        {activeServicesList.map((item) => (
                            <View key={item.key} style={styles.serviceCard}>
                                <Image source={item.image} style={styles.cardImage} />
                                <View style={styles.cardInfo}>
                                    <View style={styles.cardTitleHeader}>
                                        <View style={[styles.cardIconBox, { backgroundColor: item.iconBg }]}>
                                            <Icon name={item.icon} size={20} color={item.iconColor} />
                                        </View>
                                        <Text style={styles.cardTitle}>
                                            {t(item.titleKey)}
                                        </Text>
                                    </View>
                                    <Text style={styles.cardDescription}>
                                        {t(item.descKey)}
                                    </Text>
                                    <View style={styles.specLabelContainer}>
                                        <Text style={styles.specLabel}>
                                            {t('portfolio.mejestic.analysis_label')}
                                        </Text>
                                    </View>
                                    <Text style={styles.specDescription}>
                                        {t(item.analysisKey)}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>



                {/* Custom Booking CTA */}
                <View style={styles.bookingCard}>
                    <Icon name="camera-iris" size={48} color="#D97706" style={styles.bookingIcon} />
                    <Text style={styles.bookingTitle}>
                        {t('portfolio.mejestic.cta_heading')}
                    </Text>
                    <Text style={styles.bookingDesc}>
                        High-quality cinematic edits, framing, and full-resolution digital albums delivered within 7 business days.
                    </Text>
                    <View style={styles.bookingButtonsRow}>
                        <TouchableOpacity
                            style={[styles.bookingBtn, styles.bookingPrimaryBtn]}
                            onPress={handleCall}
                            activeOpacity={0.8}
                        >
                            <Icon name="phone" size={18} color="#FFFFFF" />
                            <Text style={styles.bookingPrimaryText}>
                                {t('portfolio.mejestic.cta_call')}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.bookingBtn, styles.bookingSecondaryBtn]}
                            onPress={handleWhatsApp}
                            activeOpacity={0.8}
                        >
                            <Icon name="whatsapp" size={18} color="#D97706" />
                            <Text style={styles.bookingSecondaryText}>
                                WhatsApp
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Location Map Widget */}
                <View style={styles.locationSection}>
                    <Text style={styles.locationTitle}>STUDIO LOCATION</Text>
                    <TouchableOpacity
                        style={styles.mapCard}
                        onPress={handleMapOpen}
                        activeOpacity={0.9}
                    >
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=600&auto=format&fit=crop' }}
                            style={styles.mapPlaceholderImage}
                        />
                        <View style={styles.mapOverlay}>
                            <View style={styles.pinWrapper}>
                                <Icon name="map-marker-radius" size={32} color="#EF4444" />
                            </View>
                            <Text style={styles.mapLabelText}>
                                Majestic Studio
                            </Text>
                            <Text style={styles.mapSubLabelText}>
                                {t('portfolio.mejestic.location')}
                            </Text>
                            <View style={styles.navigateBadge}>
                                <Icon name="navigation" size={14} color="#FFF" />
                                <Text style={styles.navigateBadgeText}>Navigate</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={styles.footerSpacing} />
            </ScrollView>

            <FloatingCartButton />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    floatingHeader: {
        position: 'absolute',
        top: STATUS_BAR_HEIGHT + (56 - 42) / 2,
        left: 16,
        zIndex: 10,
    },
    backButton: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
    },
    heroContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        overflow: 'hidden',
        backgroundColor: '#F8FAFC',
        zIndex: 5,
    },
    heroImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    heroDarkOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
    },
    heroContent: {
        position: 'absolute',
        bottom: 24,
        left: 20,
        right: 20,
    },
    shutterTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 215, 0, 0.15)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: 'flex-start',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: 'rgba(255, 215, 0, 0.3)',
    },
    shutterTagText: {
        color: '#F59E0B',
        fontSize: 10,
        fontWeight: 'bold',
        marginLeft: 4,
        letterSpacing: 1,
    },
    brandTitle: {
        color: '#FFFFFF',
        fontSize: 28,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    brandSubtitle: {
        color: '#CCCCCC',
        fontSize: 13,
        marginTop: 4,
        lineHeight: 18,
    },
    collapsedHeaderContent: {
        position: 'absolute',
        top: STATUS_BAR_HEIGHT,
        left: 70,
        right: 16,
        height: 56,
        justifyContent: 'center',
    },
    collapsedTitle: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    scrollView: {
        flex: 1,
        zIndex: 2,
    },
    scrollContent: {
        paddingTop: HEADER_EXPANDED,
        backgroundColor: '#F8FAFC',
    },
    statsStrip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        marginHorizontal: 16,
        marginTop: 20,
        borderRadius: 16,
        paddingVertical: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    statCell: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#F59E0B',
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statLabel: {
        fontSize: 11,
        color: '#64748B',
        marginTop: 3,
    },
    statDivider: {
        width: 1,
        height: 28,
        backgroundColor: '#E2E8F0',
    },
    sectionContainer: {
        marginTop: 24,
    },
    sectionHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0F172A',
        letterSpacing: 0.5,
        paddingHorizontal: 16,
    },
    sectionSubtitle: {
        fontSize: 12,
        color: '#64748B',
        marginTop: 2,
        marginBottom: 16,
        paddingHorizontal: 16,
    },
    galleryList: {
        paddingHorizontal: 16,
    },
    galleryCard: {
        width: 160,
        height: 120,
        borderRadius: 12,
        marginRight: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    galleryImg: {
        width: '100%',
        height: '100%',
    },
    galleryOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
        padding: 10,
    },
    galleryText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
    tabSection: {
        marginTop: 28,
        backgroundColor: '#FFFFFF',
        paddingVertical: 20,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#E2E8F0',
    },
    tabHeader: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 16,
        marginBottom: 20,
    },
    tabButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        backgroundColor: '#F8FAFC',
    },
    tabButtonActive: {
        backgroundColor: 'rgba(245, 158, 11, 0.12)',
        borderColor: '#F59E0B',
    },
    tabButtonText: {
        color: '#64748B',
        fontSize: 13,
        fontWeight: '600',
        marginLeft: 6,
    },
    tabButtonTextActive: {
        color: '#F59E0B',
    },
    cardsWrapper: {
        paddingHorizontal: 16,
    },
    serviceCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    cardImage: {
        width: '100%',
        height: 140,
        resizeMode: 'cover',
    },
    cardInfo: {
        padding: 16,
    },
    cardTitleHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    cardIconBox: {
        width: 32,
        height: 32,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0F172A',
        flex: 1,
    },
    cardDescription: {
        fontSize: 13,
        color: '#475569',
        lineHeight: 18,
        marginBottom: 12,
    },
    specLabelContainer: {
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
        paddingTop: 8,
        marginBottom: 4,
    },
    specLabel: {
        fontSize: 10,
        color: '#D97706',
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    specDescription: {
        fontSize: 12,
        color: '#64748B',
        lineHeight: 16,
    },
    teamContainer: {
        paddingHorizontal: 16,
        marginTop: 28,
    },
    subHeading: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#FFD700',
        letterSpacing: 1.5,
        marginBottom: 12,
    },
    teamCard: {
        flexDirection: 'row',
        backgroundColor: '#1E1E1E',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#2D2D2D',
        alignItems: 'center',
    },
    avatarImg: {
        width: 72,
        height: 72,
        borderRadius: 36,
        borderWidth: 2,
        borderColor: '#FFD700',
        marginRight: 16,
    },
    teamTextContainer: {
        flex: 1,
    },
    teamMemberName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFF',
    },
    teamMemberRole: {
        fontSize: 12,
        color: '#FFD700',
        marginTop: 2,
        marginBottom: 6,
    },
    teamBio: {
        fontSize: 12,
        color: '#AAAAAA',
        lineHeight: 16,
    },
    bookingCard: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 16,
        marginTop: 28,
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
    },
    bookingIcon: {
        marginBottom: 12,
    },
    bookingTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0F172A',
        textAlign: 'center',
        marginBottom: 8,
    },
    bookingDesc: {
        fontSize: 12,
        color: '#475569',
        textAlign: 'center',
        lineHeight: 16,
        marginBottom: 20,
    },
    bookingButtonsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    bookingBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 44,
        borderRadius: 12,
        marginHorizontal: 6,
    },
    bookingPrimaryBtn: {
        backgroundColor: '#F59E0B',
    },
    bookingSecondaryBtn: {
        borderWidth: 1,
        borderColor: '#F59E0B',
        backgroundColor: 'transparent',
    },
    bookingPrimaryText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: 'bold',
        marginLeft: 6,
    },
    bookingSecondaryText: {
        color: '#D97706',
        fontSize: 13,
        fontWeight: 'bold',
        marginLeft: 6,
    },
    locationSection: {
        marginTop: 28,
        paddingHorizontal: 16,
    },
    locationTitle: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#D97706',
        letterSpacing: 1.5,
        marginBottom: 12,
    },
    mapCard: {
        borderRadius: 16,
        overflow: 'hidden',
        height: 180,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        backgroundColor: '#FFFFFF',
    },
    mapPlaceholderImage: {
        width: '100%',
        height: '100%',
        opacity: 0.8,
    },
    mapOverlay: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
    },
    pinWrapper: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(239, 68, 68, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 6,
    },
    mapLabelText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#0F172A',
    },
    mapSubLabelText: {
        fontSize: 12,
        color: '#475569',
        marginTop: 2,
        textAlign: 'center',
    },
    navigateBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#3B82F6',
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 12,
        marginTop: 10,
    },
    navigateBadgeText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
        marginLeft: 4,
    },
    footerSpacing: {
        height: 120,
    },
});

export default MejesticStudioPortfolioScreen;

