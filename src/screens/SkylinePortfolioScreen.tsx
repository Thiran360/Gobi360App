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
    TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import FloatingContactButtons from '../components/FloatingContactButtons';

import FloatingCartButton from '../components/FloatingCartButton';
import VoiceSearchModal from '../components/VoiceSearchModal';
import { checkSessionAndNavigate } from '../utils/auth';
import { triggerCall } from '../utils/callTracker';

const { width, height } = Dimensions.get('window');


const SkylinePortfolioScreen = ({ navigation }: any) => {
    const { t } = useTranslation();
    const scrollY = useRef(new Animated.Value(0)).current;
    const [searchQuery, setSearchQuery] = useState('');
    const [voiceModalVisible, setVoiceModalVisible] = useState(false);

    const SERVICES = [
        {
            id: 1,
            title: t('portfolio.skyline.services.s1_title'),
            desc: t('portfolio.skyline.services.s1_desc'),
            icon: 'office-building',
            color: '#2563EB',
            accent: '#EFF6FF',
            analysis: t('portfolio.skyline.services.s1_analysis'),
            image: 'https://i.pinimg.com/736x/c8/60/d8/c860d8caaffe8061fd0fd3b5e9bb727d.jpg',
            keywords: ['construction', 'build', 'building', 'civil', 'contractor', 'architect', 'house construction', 'elevation']
        },
        {
            id: 2,
            title: t('portfolio.skyline.services.s2_title'),
            desc: t('portfolio.skyline.services.s2_desc'),
            icon: 'home-edit',
            color: '#0891B2',
            accent: '#ECFEFF',
            analysis: t('portfolio.skyline.services.s2_analysis'),
            image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80',
            keywords: ['renovation', 'interior', 'design', 'remodeling', 'home interior', 'false ceiling', 'paint', 'tiles']
        },
        {
            id: 3,
            title: t('portfolio.skyline.services.s3_title'),
            desc: t('portfolio.skyline.services.s3_desc'),
            icon: 'countertop',
            color: '#4F46E5',
            accent: '#EEF2FF',
            analysis: t('portfolio.skyline.services.s3_analysis'),
            image: 'https://i.pinimg.com/736x/fd/20/3f/fd203f1430afb0e89d5588636020d39b.jpg',
            keywords: ['modular', 'kitchen', 'wardrobe', 'cabinet', 'modular kitchen', 'shelf', 'tv unit']
        },
        {
            id: 4,
            title: t('portfolio.skyline.services.s4_title'),
            desc: t('portfolio.skyline.services.s4_desc'),
            icon: 'factory',
            color: '#1E293B',
            accent: '#F1F5F9',
            analysis: t('portfolio.skyline.services.s4_analysis'),
            image: 'https://i.pinimg.com/1200x/a0/31/d7/a031d70fd353890dd941d7a0694c8f6f.jpg',
            keywords: ['roofing', 'roof', 'shed', 'fabrication', 'metal roof', 'terrace', 'parking shade']
        },
        {
            id: 5,
            title: t('portfolio.skyline.services.s5_title', { defaultValue: 'Paint Contract' }),
            desc: t('portfolio.skyline.services.s5_desc', { defaultValue: 'Professional interior and exterior painting services. We offer complete wall care, textures, waterproofing, and premium finish coatings.' }),
            icon: 'format-paint',
            color: '#8B5CF6',
            accent: '#F5F3FF',
            analysis: t('portfolio.skyline.services.s5_analysis', { defaultValue: 'Premium quality paints with anti-fungal properties and durability.' }),
            image: 'https://image.pollinations.ai/prompt/professional-house-painters-painting-a-wall-with-roller-high-quality?width=800&height=600&nologo=true',
            keywords: ['paint', 'painting', 'wall', 'texture', 'exterior', 'interior', 'color']
        },
        {
            id: 6,
            title: t('portfolio.skyline.services.s6_title', { defaultValue: 'Carpentry Works' }),
            desc: t('portfolio.skyline.services.s6_desc', { defaultValue: 'Custom woodwork, furniture design, doors, windows, and modular cabinetry built by expert carpenters with premium wood materials.' }),
            icon: 'hammer',
            color: '#EA580C',
            accent: '#FFEDD5',
            analysis: t('portfolio.skyline.services.s6_analysis', { defaultValue: 'Termite-resistant wood and precision craftsmanship.' }),
            image: 'https://image.pollinations.ai/prompt/carpenter-working-with-wood-tape-measure-high-quality?width=800&height=600&nologo=true',
            keywords: ['carpentry', 'wood', 'furniture', 'doors', 'windows', 'woodwork', 'carpenter']
        }
    ];

    const filteredServices = SERVICES.filter(service => {
        const query = searchQuery.toLowerCase();
        return (
            service.title.toLowerCase().includes(query) ||
            service.desc.toLowerCase().includes(query) ||
            service.keywords.some(k => k.toLowerCase().includes(query))
        );
    });

    const headerScale = scrollY.interpolate({
        inputRange: [-100, 0, 100],
        outputRange: [1.1, 1, 1],
    });

    const contactExpert = (type: 'call' | 'whatsapp') => {
        checkSessionAndNavigate(navigation, () => {
            if (type === 'call') {
                triggerCall('8754944026', 'Skyline Builders & Interiors');
            } else {
                const msg = t('portfolio.skyline.whatsapp_msg', { defaultValue: 'Hi Skyline Team, I am interested in your construction services.' });
                Linking.openURL(`whatsapp://send?phone=918754944026&text=${encodeURIComponent(msg)}`);
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
                        source={{ uri: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80' }}
                        resizeMode="cover"
                        style={styles.heroBackground}
                    >
                        <View style={styles.heroOverlay}>
                            <View style={styles.topBadges}>
                                <View style={styles.premiumBadge}>
                                    <Icon name="check-decagram" size={14} color="#2563EB" />
                                    <Text style={styles.premiumBadgeText}>{t('portfolio.common.iso_certified')}</Text>
                                </View>
                                <View style={styles.yearBadge}>
                                    <Text style={styles.yearBadgeText}>{t('portfolio.common.established')} 2021</Text>
                                </View>
                            </View>

                            <View style={styles.heroContent}>
                                <Text style={styles.businessTitle}>{t('dashboard.portfolios.skyline.name')}</Text>
                                <Text style={styles.businessSubtitle}>{t('dashboard.portfolios.skyline.tagline')}</Text>

                                <View style={styles.locationContainer}>
                                    <Icon name="map-marker-radius" size={18} color="#2563EB" />
                                    <Text style={styles.locationText}>{t('portfolio.skyline.location')}</Text>
                                </View>
                            </View>
                        </View>
                    </ImageBackground>
                </Animated.View>

                {/* Content Section */}
                <View style={styles.contentWrapper}>
                    {/* Search Bar */}
                    <View style={styles.searchBox}>
                        <Icon name="magnify" size={20} color="#94A3B8" />
                        <TextInput
                            style={styles.searchInput}
                            placeholder={t('dashboard.search_placeholder')}
                            placeholderTextColor="#94A3B8"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        {searchQuery !== '' && (
                            <TouchableOpacity onPress={() => setSearchQuery('')} style={{ marginRight: 8 }}>
                                <Icon name="close-circle" size={18} color="#94A3B8" />
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity
                            onPress={() => checkSessionAndNavigate(navigation, () => setVoiceModalVisible(true))}
                            style={styles.voiceBtn}
                        >
                            <Icon name="microphone" size={20} color="#3B82F6" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.introHeader}>
                        <View style={styles.dotLine} />
                        <Text style={styles.sectionTitle}>{t('portfolio.skyline.section_header')}</Text>
                        <View style={styles.dotLine} />
                    </View>

                    {/* Services Cards */}
                    {filteredServices.length > 0 ? (
                        filteredServices.map((service) => (
                            <View key={service.id} style={styles.serviceSection}>
                                <TouchableOpacity
                                    activeOpacity={0.9}
                                    style={styles.cardContainer}
                                    onPress={() => navigation.navigate('SkylineServiceDetail', { serviceId: service.id })}
                                >
                                    <ImageBackground
                                        source={{ uri: service.image }}
                                        resizeMode="cover"
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
                                                <Text style={styles.serviceTag}>{t('portfolio.skyline.service_tag')}</Text>
                                            </View>
                                        </View>

                                        <Text style={styles.serviceDesc}>{service.desc}</Text>

                                        <View style={[styles.analysisCard, { borderLeftColor: service.color }]}>
                                            <View style={styles.analysisHeader}>
                                                <Icon name="shield-check" size={14} color={service.color} />
                                                <Text style={[styles.analysisLabel, { color: service.color }]}>{t('portfolio.skyline.analysis_label')}</Text>
                                            </View>
                                            <Text style={styles.analysisText}>{service.analysis}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        ))
                    ) : (
                        <View style={styles.noResultsBox}>
                            <Icon name="text-search-variant" size={48} color="#E2E8F0" />
                            <Text style={styles.noResultsText}>{t('dashboard.no_results.title')}</Text>
                        </View>
                    )}

                    {/* Team Section */}
                    <View style={styles.teamCard}>
                        <View style={styles.teamIconBox}>
                            <Icon name="account-group" size={32} color="#1E293B" />
                        </View>
                        <Text style={styles.teamTitle}>{t('portfolio.skyline.team_title')}</Text>
                        <Text style={styles.teamDesc}>{t('portfolio.skyline.team_desc')}</Text>
                    </View>

                    {/* Action Bar */}
                    <View style={styles.actionSection}>
                        <Text style={styles.actionHeading}>{t('portfolio.skyline.cta_heading')}</Text>
                        <View style={styles.buttonRow}>
                            <TouchableOpacity
                                style={[styles.mainButton, { backgroundColor: '#2563EB' }]}
                                onPress={() => contactExpert('call')}
                            >
                                <Icon name="phone" size={20} color="#FFFFFF" />
                                <Text style={styles.btnText}>{t('portfolio.skyline.cta_call')}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.mainButton, { backgroundColor: '#10B981' }]}
                                onPress={() => contactExpert('whatsapp')}
                            >
                                <Icon name="whatsapp" size={20} color="#FFFFFF" />
                                <Text style={styles.btnText}>{t('portfolio.common.whatsapp')}</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={styles.secondaryContact} onPress={() => Linking.openURL('tel:8754944026')}>
                            <Text style={styles.secLabel}>{t('portfolio.skyline.enquiry_label')}</Text>
                            <Text style={styles.secNumber}>+91 9443822122</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.footerBranding}>
                        <Icon name="rhombus-split" size={20} color="#94A3B8" />
                        <Text style={styles.footerText}>{t('dashboard.portfolios.skyline.name')} {t('dashboard.portfolios.skyline.tagline')}</Text>
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
                <Text style={styles.navTitle}>{t('portfolio.common.portfolio')}</Text>
                <TouchableOpacity style={styles.shareBtn}>
                    <Icon name="share-variant-outline" size={22} color="#1E293B" />
                </TouchableOpacity>
            </View>
            <FloatingContactButtons
                phoneNumber="9443822122"
                businessName={t('dashboard.portfolios.skyline.name')}
            />
            <VoiceSearchModal
                visible={voiceModalVisible}
                onClose={() => setVoiceModalVisible(false)}
                onNavigate={(item) => {
                    if (item.screen === 'SkylineServiceDetail' && item.serviceId) {
                        navigation.navigate('SkylineServiceDetail' as any, { serviceId: item.serviceId });
                    } else {
                        navigation.navigate(item.screen as any);
                    }
                }}
                onResult={(text) => {
                    setSearchQuery(text);
                }}
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
        backgroundColor: '#E2E8F0',
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
        color: '#2563EB',
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
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        fontWeight: '600',
        color: '#1E293B',
        marginLeft: 12,
        padding: 0,
    },
    voiceBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#EFF6FF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    noResultsBox: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    noResultsText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#94A3B8',
        marginTop: 12,
        letterSpacing: 0.5,
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
        backgroundColor: '#F1F5F9',
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
        fontSize: 15,
        fontWeight: '800',
        color: '#1E293B',
        lineHeight: 24,
        includeFontPadding: false,
    },
    serviceTag: {
        fontSize: 10,
        fontWeight: '700',
        color: '#2563EB',
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
    }
});

export default SkylinePortfolioScreen;

