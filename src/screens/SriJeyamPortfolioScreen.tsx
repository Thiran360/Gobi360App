import React, { useRef, useState } from 'react';
import FloatingCartButton from '../components/FloatingCartButton';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    StatusBar,
    Dimensions,
    ScrollView,
    Animated,
    Linking,
    Image,
    ImageBackground,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FloatingContactButtons from '../components/FloatingContactButtons';

import { checkSessionAndNavigate } from '../utils/auth';
import { triggerCall } from '../utils/callTracker';

const { width, height } = Dimensions.get('window');
const HERO_HEIGHT = height * 0.42;

const PHONE = '6374822433';
const WHATSAPP_PHONE = '916374822433';

const SERVICES = [
    {
        id: 1,
        title: 'UPVC Windows & Doors',
        icon: 'window-closed-variant',
        color: '#0EA5E9',
        bg: '#E0F2FE',
        desc: 'Premium UPVC frames with superior insulation, noise reduction and durability for homes and offices.',
        image: require('../assets/images/portfolio/srijeyam/upvc.png'),
        analysis: 'High-tensile UPVC profiles for 20+ years of structural integrity and weather resistance.'
    },
    {
        id: 2,
        title: 'Glass Partitions & Works',
        icon: 'image-filter-frames',
        color: '#8B5CF6',
        bg: '#EDE9FE',
        desc: 'Toughened glass partitions, shower enclosures, railings and decorative glass solutions.',
        image: require('../assets/images/portfolio/srijeyam/glass.png'),
        analysis: 'Standard safety toughened glass with high impact resistance.'
    },
    {
        id: 3,
        title: 'PVC Doors & Panels',
        icon: 'door',
        color: '#10B981',
        bg: '#D1FAE5',
        desc: 'Lightweight, waterproof PVC doors suitable for bathrooms, kitchens and utility areas.',
        image: require('../assets/images/portfolio/srijeyam/pvc.png'),
        analysis: '100% Waterproof and Termite proof material ensuring longevity.'
    },
    {
        id: 4,
        title: 'Aluminium Fabrication',
        icon: 'tools',
        color: '#F59E0B',
        bg: '#FEF3C7',
        desc: 'Custom aluminium sections for windows, sliding doors, curtain walls and structural glazing.',
        image: require('../assets/images/portfolio/srijeyam/alum.png'),
        analysis: 'Anodized aluminium sections to prevent corrosion and wear.'
    },
    {
        id: 5,
        title: 'False Ceiling & Interiors',
        icon: 'ceiling-light',
        color: '#EF4444',
        bg: '#FEE2E2',
        desc: 'Gypsum and PVC false ceiling installations with integrated lighting designs.',
        image: require('../assets/images/portfolio/srijeyam/ceiling.png'),
        analysis: 'Fire-resistant gypsum boards with seamless finish.'
    },
];

const GALLERY = [
    require('../assets/images/portfolio/srijeyam/gallery1.png'),
    require('../assets/images/portfolio/srijeyam/gallery2.png'),
    require('../assets/images/portfolio/srijeyam/gallery3.png'),
    require('../assets/images/portfolio/srijeyam/gallery4.png'),
];

const STATS = [
    { label: 'Years Active', value: '10+' },
    { label: 'Projects Done', value: '500+' },
    { label: 'Happy Clients', value: '450+' },
    { label: 'Rating', value: '4.9★' },
];

const SriJeyamPortfolioScreen = ({ navigation }: any) => {
    const scrollY = useRef(new Animated.Value(0)).current;
    const [activeService, setActiveService] = useState(0);

    const heroTranslate = scrollY.interpolate({
        inputRange: [0, HERO_HEIGHT],
        outputRange: [0, -HERO_HEIGHT * 0.4],
        extrapolate: 'clamp',
    });

    const heroScale = scrollY.interpolate({
        inputRange: [-100, 0],
        outputRange: [1.2, 1],
        extrapolate: 'clamp',
    });

    const heroOpacity = scrollY.interpolate({
        inputRange: [0, HERO_HEIGHT * 0.6],
        outputRange: [1, 0],
        extrapolate: 'clamp',
    });

    const handleCall = () => {
        checkSessionAndNavigate(navigation, () => {
            triggerCall(PHONE, 'Sri Jayam Glass House');
        });
    };

    const handleWhatsApp = () => {
        checkSessionAndNavigate(navigation, () => {
            const msg = 'Hi Sri Jayam Glass House, I found you on Gobi-360 and I\'m interested in your services.';
            Linking.openURL(`whatsapp://send?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent(msg)}`);
        });
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            {/* Parallax Hero */}
            <Animated.View
                style={[
                    styles.heroWrapper,
                    { transform: [{ translateY: heroTranslate }] },
                ]}
            >
                <Animated.Image
                    source={require('../assets/images/portfolio/srijeyam/hero.png')}
                    style={[styles.heroImage, { transform: [{ scale: heroScale }] }]}
                    resizeMode="cover"
                />
                <Animated.View style={[styles.heroOverlay, { opacity: heroOpacity }]}>
                    <View style={styles.badge}>
                        <Icon name="shield-check" size={14} color="#FFFFFF" />
                        <Text style={styles.badgeText}>Glass & UPVC Expert</Text>
                    </View>
                    <Text style={styles.heroTitle}>Sri Jayam{'\n'}Glass House</Text>
                    <Text style={styles.heroSub}>C. Prakash · Gobichettipalayam</Text>
                    <View style={styles.heroActions}>
                        <TouchableOpacity style={styles.heroCallBtn} onPress={handleCall}>
                            <Icon name="phone" size={16} color="#FFFFFF" />
                            <Text style={styles.heroCallText}>Call Now</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.heroWABtn} onPress={handleWhatsApp}>
                            <Icon name="whatsapp" size={16} color="#25D366" />
                            <Text style={styles.heroWAText}>WhatsApp</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </Animated.View>

            {/* Top Bar */}
            <View style={styles.topBar}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" size={22} color="#FFFFFF" />
                </TouchableOpacity>
            </View>

            {/* Scrollable Content */}
            <Animated.ScrollView
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: true }
                )}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingTop: HERO_HEIGHT }}
            >
                <View style={styles.content}>
                    <View style={styles.pill} />

                    {/* Stats Row */}
                    <View style={styles.statsRow}>
                        {STATS.map((s, i) => (
                            <View key={i} style={styles.statCard}>
                                <Text style={styles.statValue}>{s.value}</Text>
                                <Text style={styles.statLabel}>{s.label}</Text>
                            </View>
                        ))}
                    </View>

                    {/* About */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>About Us</Text>
                        <Text style={styles.aboutText}>
                            Sri Jayam Glass House has been the trusted choice for premium glass, UPVC, aluminium and interior solutions in Gobichettipalayam for over 10 years. Led by C. Prakash, our team delivers precision craftsmanship with quality materials sourced from top brands.
                        </Text>
                    </View>

                    {/* Services */}
                    <View style={styles.section}>
                        <View style={styles.introHeader}>
                            <View style={styles.dotLine} />
                            <Text style={styles.sectionTitle}>OUR CAPABILITIES</Text>
                            <View style={styles.dotLine} />
                        </View>

                        {SERVICES.map((service) => (
                            <View key={service.id} style={styles.serviceSection}>
                                <TouchableOpacity
                                    activeOpacity={0.9}
                                    style={styles.cardContainer}
                                    onPress={handleWhatsApp}
                                >
                                    <ImageBackground
                                        source={service.image}
                                        resizeMode="cover"
                                        style={styles.cardImage}
                                        imageStyle={{ borderRadius: 24 }}
                                    >
                                        <View style={styles.imageOverlay} />
                                    </ImageBackground>

                                    <View style={styles.serviceInfo}>
                                        <View style={styles.titleRow}>
                                            <View style={[styles.iconBox, { backgroundColor: service.bg }]}>
                                                <Icon name={service.icon} size={24} color={service.color} />
                                            </View>
                                            <View style={styles.titleTextContainer}>
                                                <Text style={styles.serviceName}>{service.title}</Text>
                                                <Text style={styles.serviceTag}>Premium Solution</Text>
                                            </View>
                                        </View>

                                        <Text style={styles.serviceDesc}>{service.desc}</Text>

                                        <View style={[styles.analysisCard, { borderLeftColor: service.color }]}>
                                            <View style={styles.analysisHeader}>
                                                <Icon name="shield-check" size={14} color={service.color} />
                                                <Text style={[styles.analysisLabel, { color: service.color }]}>TECHNICAL ANALYSIS</Text>
                                            </View>
                                            <Text style={styles.analysisText}>{service.analysis}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>

                    {/* Gallery */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Gallery</Text>
                        <View style={styles.galleryGrid}>
                            {GALLERY.map((img, i) => (
                                <View key={i} style={[styles.galleryItem, i % 3 === 0 && styles.galleryItemWide]}>
                                    <Image source={img} style={styles.galleryImage} resizeMode="cover" fadeDuration={0} />
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Contact CTA */}
                    <View style={styles.ctaSection}>
                        <Icon name="window-closed-variant" size={40} color="#0EA5E9" style={{ marginBottom: 12 }} />
                        <Text style={styles.ctaTitle}>Need a Quote?</Text>
                        <Text style={styles.ctaSubtitle}>Get a free estimate for UPVC, Glass, or Aluminium work</Text>
                        <View style={styles.ctaButtons}>
                            <TouchableOpacity style={styles.ctaCallBtn} onPress={handleCall}>
                                <Icon name="phone" size={18} color="#FFFFFF" />
                                <Text style={styles.ctaBtnText}>Call Us</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.ctaWABtn} onPress={handleWhatsApp}>
                                <Icon name="whatsapp" size={18} color="#FFFFFF" />
                                <Text style={styles.ctaBtnText}>WhatsApp</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ height: 100 }} />
                </View>
            </Animated.ScrollView>

            <FloatingContactButtons phoneNumber={PHONE} businessName="Sri Jayam Glass House" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    heroWrapper: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: HERO_HEIGHT,
        overflow: 'hidden',
        zIndex: 0,
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    heroOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'flex-end',
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0EA5E9',
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        marginBottom: 12,
        gap: 5,
    },
    badgeText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    heroTitle: {
        fontSize: 32,
        fontWeight: '900',
        color: '#FFFFFF',
        lineHeight: 40,
        marginBottom: 4,
    },
    heroSub: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        fontWeight: '600',
        marginBottom: 20,
    },
    heroActions: {
        flexDirection: 'row',
        gap: 12,
    },
    heroCallBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0EA5E9',
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 12,
        gap: 6,
    },
    heroCallText: {
        color: '#FFFFFF',
        fontWeight: '800',
        fontSize: 13,
    },
    heroWABtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.4)',
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 12,
        gap: 6,
    },
    heroWAText: {
        color: '#FFFFFF',
        fontWeight: '800',
        fontSize: 13,
    },
    topBar: {
        position: 'absolute',
        top: Platform.OS === 'android' ? 44 : 52,
        left: 16,
        zIndex: 10,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(0,0,0,0.35)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        marginTop: -28,
        paddingHorizontal: 20,
        paddingTop: 16,
        minHeight: height,
    },
    pill: {
        width: 36,
        height: 4,
        backgroundColor: '#E2E8F0',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 24,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 28,
    },
    statCard: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        marginHorizontal: 4,
        paddingVertical: 12,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    statValue: {
        fontSize: 16,
        fontWeight: '900',
        color: '#0EA5E9',
    },
    statLabel: {
        fontSize: 9,
        fontWeight: '600',
        color: '#94A3B8',
        marginTop: 2,
        textAlign: 'center',
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: '#0F172A',
        marginBottom: 16,
        letterSpacing: -0.3,
    },
    aboutText: {
        fontSize: 14,
        lineHeight: 22,
        color: '#475569',
        fontWeight: '500',
    },
    serviceTabsRow: {
        paddingBottom: 12,
        gap: 8,
    },
    serviceTab: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 6,
    },
    serviceTabText: {
        fontSize: 12,
        fontWeight: '700',
        maxWidth: 110,
    },
    serviceCard: {
        borderRadius: 20,
        overflow: 'hidden',
        borderTopWidth: 3,
        backgroundColor: '#F8FAFC',
        elevation: 3,
        shadowColor: '#0EA5E9',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
    },
    serviceCardImage: {
        width: '100%',
        height: 180,
    },
    serviceCardBody: {
        flexDirection: 'row',
        padding: 16,
        gap: 14,
        alignItems: 'flex-start',
    },
    serviceIconBox: {
        width: 52,
        height: 52,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        flexShrink: 0,
    },
    serviceCardText: {
        flex: 1,
    },
    serviceCardTitle: {
        fontSize: 15,
        fontWeight: '800',
        color: '#1E293B',
        marginBottom: 6,
    },
    serviceCardDesc: {
        fontSize: 13,
        lineHeight: 20,
        color: '#64748B',
        fontWeight: '500',
    },
    serviceEnquireBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 14,
        marginTop: 0,
        paddingVertical: 12,
        borderRadius: 12,
        gap: 8,
    },
    serviceEnquireText: {
        fontSize: 13,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    galleryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    galleryItem: {
        width: (width - 48) / 2,
        height: 130,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#F1F5F9',
    },
    galleryItemWide: {
        width: width - 40,
        height: 200,
    },
    galleryImage: {
        width: '100%',
        height: '100%',
    },
    ctaSection: {
        backgroundColor: '#0F172A',
        borderRadius: 24,
        padding: 28,
        alignItems: 'center',
        marginBottom: 20,
    },
    ctaTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#FFFFFF',
        marginBottom: 8,
        textAlign: 'center',
    },
    ctaSubtitle: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.65)',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 20,
    },
    ctaButtons: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    ctaCallBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0EA5E9',
        paddingVertical: 14,
        borderRadius: 14,
        gap: 8,
    },
    ctaWABtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#25D366',
        paddingVertical: 14,
        borderRadius: 14,
        gap: 8,
    },
    ctaBtnText: {
        fontSize: 14,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    introHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    dotLine: {
        height: 1,
        flex: 1,
        backgroundColor: '#E2E8F0',
    },
    serviceSection: {
        marginBottom: 32,
    },
    cardContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.06,
        shadowRadius: 24,
    },
    cardImage: {
        width: '100%',
        height: 200,
        justifyContent: 'flex-end',
    },
    imageOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderRadius: 24,
    },
    serviceInfo: {
        padding: 24,
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
    },
    serviceTag: {
        fontSize: 10,
        fontWeight: '700',
        color: '#2563EB',
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
        lineHeight: 19,
        color: '#475569',
        fontStyle: 'italic',
    },
});

export default SriJeyamPortfolioScreen;

