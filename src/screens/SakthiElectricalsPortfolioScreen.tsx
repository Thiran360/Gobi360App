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

// Assets
const SAKTHI_HERO = require('../assets/images/sakthi_hero.png');
const GRINDER_IMG = require('../assets/images/sakthi_wet_grinder.png');
const FAN_IMG = require('../assets/images/sakthi_fan.png');
const STARTER_IMG = require('../assets/images/sakthi_starter.png');
const GEYSER_IMG = require('../assets/images/sakthi_geyser.png');
const WIRING_IMG = require('../assets/images/sakthi_wiring.png');
const PUMP_IMG = require('../assets/images/sakthi_pump.png');
const STOVE_IMG = require('../assets/images/sakthi_stove.png');
const THEATER_IMG = require('../assets/images/sakthi_theater.png');
const MIXER_IMG = require('../assets/images/sakthi_mixer.png');
const WASHING_IMG = require('../assets/images/sakthi_washing.png');
const TV_IMG = require('../assets/images/sakthi_tv.png');
const MICROWAVE_IMG = require('../assets/images/sakthi_microwave.png');
const PRINTING_IMG = require('../assets/images/sakthi_3d_printing.png');

const { width, height } = Dimensions.get('window');

const SakthiElectricalsPortfolioScreen = ({ navigation }: any) => {
    const { t } = useTranslation();
    const scrollY = useRef(new Animated.Value(0)).current;
    const [activeTab, setActiveTab] = useState<'electrical' | 'electronics'>('electrical');

    const handleCallPrimary = () => {
        checkSessionAndNavigate(navigation, () => {
            triggerCall('6383816267', 'Sri Sakthi Electricals (Primary)');
        });
    };

    // Removed secondary call

    const handleWhatsApp = () => {
        checkSessionAndNavigate(navigation, () => {
            const msg = t('portfolio.sakthi.whatsapp_msg');
            Linking.openURL(`whatsapp://send?phone=916383816267&text=${encodeURIComponent(msg)}`);
        });
    };

    const headerHeight = scrollY.interpolate({
        inputRange: [0, 200],
        outputRange: [height * 0.40, height * 0.15],
        extrapolate: 'clamp',
    });

    const headerOpacity = scrollY.interpolate({
        inputRange: [0, 150],
        outputRange: [1, 0],
        extrapolate: 'clamp',
    });

    const headerScale = scrollY.interpolate({
        inputRange: [-100, 0, 100],
        outputRange: [1.2, 1, 1],
    });

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            <Animated.View style={[styles.header, { height: headerHeight }]}>
                <Animated.Image
                    source={SAKTHI_HERO}
                    style={[styles.heroImg, { transform: [{ scale: headerScale }] }]}
                    resizeMode="cover"
                />
                <Animated.View style={[styles.heroOverlay, { opacity: headerOpacity }]}>
                    <View style={styles.badgeRow}>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{t('portfolio.sakthi.service_tag')}</Text>
                        </View>
                        <View style={styles.badgeAlt}>
                            <Text style={styles.badgeText}>EST. 2016</Text>
                        </View>
                    </View>
                    <View style={styles.heroContent}>
                        {/* Spiritual Slogan */}
                        <View style={styles.sloganContainer}>
                            <Icon name="om" size={14} color="#F59E0B" />
                            <Text style={styles.sloganText}>{t('portfolio.sakthi.slogan')}</Text>
                        </View>
                        <Text style={styles.brandTitle}>{t('dashboard.portfolios.sakthi.name')}</Text>
                        <Text style={styles.brandSubtitle}>{t('dashboard.portfolios.sakthi.tagline')}</Text>
                    </View>
                </Animated.View>
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
                    {/* Brand overview card */}
                    <View style={styles.brandCard}>
                        <View style={styles.brandInfo}>
                            <View style={styles.avatar}>
                                <Icon name="tools" size={32} color="#1E3A8A" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.brandLeadTitle}>{t('portfolio.sakthi.team_title')}</Text>
                                <Text style={styles.brandLeadDesc}>{t('portfolio.sakthi.team_desc')}</Text>
                            </View>
                        </View>
                        <View style={styles.statsRow}>
                            <View style={styles.statItem}>
                                <Text style={styles.statVal}>10+</Text>
                                <Text style={styles.statLab}>Years Exp</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <Text style={styles.statVal}>100%</Text>
                                <Text style={styles.statLab}>Copper Coil</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <Text style={styles.statVal}>Gobi</Text>
                                <Text style={styles.statLab}>Location</Text>
                            </View>
                        </View>
                    </View>

                    {/* All Services Available Banner */}
                    <View style={styles.servicesAvailableBanner}>
                        <Icon name="check-decagram" size={18} color="#1E3A8A" />
                        <Text style={styles.servicesAvailableText}>
                            {t('portfolio.sakthi.all_services_available')}
                        </Text>
                    </View>

                    {/* Dual-Pillar Navigation Tabs */}
                    <View style={styles.tabContainer}>
                        <TouchableOpacity
                            onPress={() => setActiveTab('electrical')}
                            style={[
                                styles.tabBtn,
                                activeTab === 'electrical' && styles.tabBtnActiveElectrical
                            ]}
                        >
                            <Icon name="flash" size={20} color={activeTab === 'electrical' ? '#FFF' : '#64748B'} />
                            <Text style={[styles.tabTxt, activeTab === 'electrical' && styles.tabTxtActive]}>
                                {t('portfolio.sakthi.electrical_tab')}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setActiveTab('electronics')}
                            style={[
                                styles.tabBtn,
                                activeTab === 'electronics' && styles.tabBtnActiveElectronics
                            ]}
                        >
                            <Icon name="chip" size={20} color={activeTab === 'electronics' ? '#FFF' : '#64748B'} />
                            <Text style={[styles.tabTxt, activeTab === 'electronics' && styles.tabTxtActive]}>
                                {t('portfolio.sakthi.electronics_tab')}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Dual Pillar Content Listings */}
                    {activeTab === 'electrical' ? (
                        <View style={styles.pillarSection}>
                            {/* Grinder Service */}
                            <View style={styles.cardItem}>
                                <Image source={GRINDER_IMG} style={styles.cardBannerImage} resizeMode="cover" />
                                <View style={styles.cardPadding}>
                                    <View style={styles.cardHeaderRow}>
                                        <View style={[styles.cardIconBox, { backgroundColor: '#FEE2E2' }]}>
                                            <Icon name="sync" size={26} color="#DC2626" />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.cardItemTitle}>{t('portfolio.sakthi.services.s1_title')}</Text>
                                            <Text style={styles.cardItemTag}>{t('portfolio.sakthi.service_tag')}</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.cardItemDesc}>{t('portfolio.sakthi.services.s1_desc')}</Text>
                                    <View style={[styles.analysisBox, { borderLeftColor: '#DC2626' }]}>
                                        <Text style={[styles.analysisTag, { color: '#DC2626' }]}>{t('portfolio.sakthi.analysis_label')}</Text>
                                        <Text style={styles.analysisTxt}>{t('portfolio.sakthi.services.s1_analysis')}</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Fan Service */}
                            <View style={styles.cardItem}>
                                <Image source={FAN_IMG} style={styles.cardBannerImage} resizeMode="cover" />
                                <View style={styles.cardPadding}>
                                    <View style={styles.cardHeaderRow}>
                                        <View style={[styles.cardIconBox, { backgroundColor: '#FEF3C7' }]}>
                                            <Icon name="fan" size={26} color="#D97706" />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.cardItemTitle}>{t('portfolio.sakthi.services.s2_title')}</Text>
                                            <Text style={styles.cardItemTag}>{t('portfolio.sakthi.service_tag')}</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.cardItemDesc}>{t('portfolio.sakthi.services.s2_desc')}</Text>
                                    <View style={[styles.analysisBox, { borderLeftColor: '#D97706' }]}>
                                        <Text style={[styles.analysisTag, { color: '#D97706' }]}>{t('portfolio.sakthi.analysis_label')}</Text>
                                        <Text style={styles.analysisTxt}>{t('portfolio.sakthi.services.s2_analysis')}</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Starter Panel Service */}
                            <View style={styles.cardItem}>
                                <Image source={STARTER_IMG} style={styles.cardBannerImage} resizeMode="cover" />
                                <View style={styles.cardPadding}>
                                    <View style={styles.cardHeaderRow}>
                                        <View style={[styles.cardIconBox, { backgroundColor: '#E0F2FE' }]}>
                                            <Icon name="tune-vertical" size={26} color="#0284C7" />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.cardItemTitle}>{t('portfolio.sakthi.services.s3_title')}</Text>
                                            <Text style={styles.cardItemTag}>{t('portfolio.sakthi.service_tag')}</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.cardItemDesc}>{t('portfolio.sakthi.services.s3_desc')}</Text>
                                    <View style={[styles.analysisBox, { borderLeftColor: '#0284C7' }]}>
                                        <Text style={[styles.analysisTag, { color: '#0284C7' }]}>{t('portfolio.sakthi.analysis_label')}</Text>
                                        <Text style={styles.analysisTxt}>{t('portfolio.sakthi.services.s3_analysis')}</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Water Heater / Geyser Service */}
                            <View style={styles.cardItem}>
                                <Image source={GEYSER_IMG} style={styles.cardBannerImage} resizeMode="cover" />
                                <View style={styles.cardPadding}>
                                    <View style={styles.cardHeaderRow}>
                                        <View style={[styles.cardIconBox, { backgroundColor: '#FCE7F3' }]}>
                                            <Icon name="water-boiler" size={26} color="#DB2777" />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.cardItemTitle}>{t('portfolio.sakthi.services.s7_title')}</Text>
                                            <Text style={styles.cardItemTag}>{t('portfolio.sakthi.service_tag')}</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.cardItemDesc}>{t('portfolio.sakthi.services.s7_desc')}</Text>
                                    <View style={[styles.analysisBox, { borderLeftColor: '#DB2777' }]}>
                                        <Text style={[styles.analysisTag, { color: '#DB2777' }]}>{t('portfolio.sakthi.analysis_label')}</Text>
                                        <Text style={styles.analysisTxt}>{t('portfolio.sakthi.services.s7_analysis')}</Text>
                                    </View>
                                </View>
                            </View>

                            {/* House Wiring */}
                            <View style={styles.cardItem}>
                                <Image source={WIRING_IMG} style={styles.cardBannerImage} resizeMode="cover" />
                                <View style={styles.cardPadding}>
                                    <View style={styles.cardHeaderRow}>
                                        <View style={[styles.cardIconBox, { backgroundColor: '#FEF3C7' }]}>
                                            <Icon name="lightning-bolt" size={26} color="#D97706" />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.cardItemTitle}>{t('portfolio.sakthi.services.s8_title')}</Text>
                                            <Text style={styles.cardItemTag}>{t('portfolio.sakthi.service_tag')}</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.cardItemDesc}>{t('portfolio.sakthi.services.s8_desc')}</Text>
                                    <View style={[styles.analysisBox, { borderLeftColor: '#D97706' }]}>
                                        <Text style={[styles.analysisTag, { color: '#D97706' }]}>{t('portfolio.sakthi.analysis_label')}</Text>
                                        <Text style={styles.analysisTxt}>{t('portfolio.sakthi.services.s8_analysis')}</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Submersible Pump */}
                            <View style={styles.cardItem}>
                                <Image source={PUMP_IMG} style={styles.cardBannerImage} resizeMode="cover" />
                                <View style={styles.cardPadding}>
                                    <View style={styles.cardHeaderRow}>
                                        <View style={[styles.cardIconBox, { backgroundColor: '#E0F2FE' }]}>
                                            <Icon name="water-pump" size={26} color="#0284C7" />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.cardItemTitle}>{t('portfolio.sakthi.services.s9_title')}</Text>
                                            <Text style={styles.cardItemTag}>{t('portfolio.sakthi.service_tag')}</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.cardItemDesc}>{t('portfolio.sakthi.services.s9_desc')}</Text>
                                    <View style={[styles.analysisBox, { borderLeftColor: '#0284C7' }]}>
                                        <Text style={[styles.analysisTag, { color: '#0284C7' }]}>{t('portfolio.sakthi.analysis_label')}</Text>
                                        <Text style={styles.analysisTxt}>{t('portfolio.sakthi.services.s9_analysis')}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    ) : (
                        <View style={styles.pillarSection}>
                            {/* Induction Stove */}
                            <View style={styles.cardItem}>
                                <Image source={STOVE_IMG} style={styles.cardBannerImage} resizeMode="cover" />
                                <View style={styles.cardPadding}>
                                    <View style={styles.cardHeaderRow}>
                                        <View style={[styles.cardIconBox, { backgroundColor: '#EDE9FE' }]}>
                                            <Icon name="heating-coil" size={26} color="#7C3AED" />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.cardItemTitle}>{t('portfolio.sakthi.services.s4_title')}</Text>
                                            <Text style={styles.cardItemTag}>{t('portfolio.sakthi.service_tag')}</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.cardItemDesc}>{t('portfolio.sakthi.services.s4_desc')}</Text>
                                    <View style={[styles.analysisBox, { borderLeftColor: '#7C3AED' }]}>
                                        <Text style={[styles.analysisTag, { color: '#7C3AED' }]}>{t('portfolio.sakthi.analysis_label')}</Text>
                                        <Text style={styles.analysisTxt}>{t('portfolio.sakthi.services.s4_analysis')}</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Home Theatre */}
                            <View style={styles.cardItem}>
                                <Image source={THEATER_IMG} style={styles.cardBannerImage} resizeMode="cover" />
                                <View style={styles.cardPadding}>
                                    <View style={styles.cardHeaderRow}>
                                        <View style={[styles.cardIconBox, { backgroundColor: '#FCE7F3' }]}>
                                            <Icon name="speaker" size={26} color="#DB2777" />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.cardItemTitle}>{t('portfolio.sakthi.services.s5_title')}</Text>
                                            <Text style={styles.cardItemTag}>{t('portfolio.sakthi.service_tag')}</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.cardItemDesc}>{t('portfolio.sakthi.services.s5_desc')}</Text>
                                    <View style={[styles.analysisBox, { borderLeftColor: '#DB2777' }]}>
                                        <Text style={[styles.analysisTag, { color: '#DB2777' }]}>{t('portfolio.sakthi.analysis_label')}</Text>
                                        <Text style={styles.analysisTxt}>{t('portfolio.sakthi.services.s5_analysis')}</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Mixer Grinder */}
                            <View style={styles.cardItem}>
                                <Image source={MIXER_IMG} style={styles.cardBannerImage} resizeMode="cover" />
                                <View style={styles.cardPadding}>
                                    <View style={styles.cardHeaderRow}>
                                        <View style={[styles.cardIconBox, { backgroundColor: '#E0F2FE' }]}>
                                            <Icon name="blender" size={26} color="#0284C7" />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.cardItemTitle}>{t('portfolio.sakthi.services.s6_title')}</Text>
                                            <Text style={styles.cardItemTag}>{t('portfolio.sakthi.service_tag')}</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.cardItemDesc}>{t('portfolio.sakthi.services.s6_desc')}</Text>
                                    <View style={[styles.analysisBox, { borderLeftColor: '#0284C7' }]}>
                                        <Text style={[styles.analysisTag, { color: '#0284C7' }]}>{t('portfolio.sakthi.analysis_label')}</Text>
                                        <Text style={styles.analysisTxt}>{t('portfolio.sakthi.services.s6_analysis')}</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Washing Machine */}
                            <View style={styles.cardItem}>
                                <Image source={WASHING_IMG} style={styles.cardBannerImage} resizeMode="cover" />
                                <View style={styles.cardPadding}>
                                    <View style={styles.cardHeaderRow}>
                                        <View style={[styles.cardIconBox, { backgroundColor: '#EDE9FE' }]}>
                                            <Icon name="washing-machine" size={26} color="#7C3AED" />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.cardItemTitle}>{t('portfolio.sakthi.services.s10_title')}</Text>
                                            <Text style={styles.cardItemTag}>{t('portfolio.sakthi.service_tag')}</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.cardItemDesc}>{t('portfolio.sakthi.services.s10_desc')}</Text>
                                    <View style={[styles.analysisBox, { borderLeftColor: '#7C3AED' }]}>
                                        <Text style={[styles.analysisTag, { color: '#7C3AED' }]}>{t('portfolio.sakthi.analysis_label')}</Text>
                                        <Text style={styles.analysisTxt}>{t('portfolio.sakthi.services.s10_analysis')}</Text>
                                    </View>
                                </View>
                            </View>

                            {/* TV Repair */}
                            <View style={styles.cardItem}>
                                <Image source={TV_IMG} style={styles.cardBannerImage} resizeMode="cover" />
                                <View style={styles.cardPadding}>
                                    <View style={styles.cardHeaderRow}>
                                        <View style={[styles.cardIconBox, { backgroundColor: '#FEE2E2' }]}>
                                            <Icon name="television" size={26} color="#DC2626" />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.cardItemTitle}>{t('portfolio.sakthi.services.s11_title')}</Text>
                                            <Text style={styles.cardItemTag}>{t('portfolio.sakthi.service_tag')}</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.cardItemDesc}>{t('portfolio.sakthi.services.s11_desc')}</Text>
                                    <View style={[styles.analysisBox, { borderLeftColor: '#DC2626' }]}>
                                        <Text style={[styles.analysisTag, { color: '#DC2626' }]}>{t('portfolio.sakthi.analysis_label')}</Text>
                                        <Text style={styles.analysisTxt}>{t('portfolio.sakthi.services.s11_analysis')}</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Microwave Oven */}
                            <View style={styles.cardItem}>
                                <Image source={MICROWAVE_IMG} style={styles.cardBannerImage} resizeMode="cover" />
                                <View style={styles.cardPadding}>
                                    <View style={styles.cardHeaderRow}>
                                        <View style={[styles.cardIconBox, { backgroundColor: '#FEF3C7' }]}>
                                            <Icon name="microwave" size={26} color="#D97706" />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.cardItemTitle}>{t('portfolio.sakthi.services.s12_title')}</Text>
                                            <Text style={styles.cardItemTag}>{t('portfolio.sakthi.service_tag')}</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.cardItemDesc}>{t('portfolio.sakthi.services.s12_desc')}</Text>
                                    <View style={[styles.analysisBox, { borderLeftColor: '#D97706' }]}>
                                        <Text style={[styles.analysisTag, { color: '#D97706' }]}>{t('portfolio.sakthi.analysis_label')}</Text>
                                        <Text style={styles.analysisTxt}>{t('portfolio.sakthi.services.s12_analysis')}</Text>
                                    </View>
                                </View>
                            </View>

                            {/* 3D Printing */}
                            <View style={styles.cardItem}>
                                <Image source={PRINTING_IMG} style={styles.cardBannerImage} resizeMode="cover" />
                                <View style={styles.cardPadding}>
                                    <View style={styles.cardHeaderRow}>
                                        <View style={[styles.cardIconBox, { backgroundColor: '#E0F2FE' }]}>
                                            <Icon name="printer-3d" size={26} color="#0284C7" />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.cardItemTitle}>3D Printing</Text>
                                            <Text style={styles.cardItemTag}>ELECTRONICS & PROTOTYPING</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.cardItemDesc}>High-precision 3D printing services for prototyping and custom parts.</Text>
                                    <View style={[styles.analysisBox, { borderLeftColor: '#0284C7' }]}>
                                        <Text style={[styles.analysisTag, { color: '#0284C7' }]}>PROCESS</Text>
                                        <Text style={styles.analysisTxt}>CAD design, slicing, and multi-material precision printing.</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Laser Engraving */}
                            <View style={styles.cardItem}>
                                <View style={[styles.cardBannerImage, { backgroundColor: '#1E1B4B', justifyContent: 'center', alignItems: 'center' }]}>
                                    <Icon name="laser-pointer" size={72} color="#A78BFA" />
                                </View>
                                <View style={styles.cardPadding}>
                                    <View style={styles.cardHeaderRow}>
                                        <View style={[styles.cardIconBox, { backgroundColor: '#EDE9FE' }]}>
                                            <Icon name="laser-pointer" size={26} color="#7C3AED" />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.cardItemTitle}>Laser Engraving</Text>
                                            <Text style={styles.cardItemTag}>PRECISION MARKING & ENGRAVING</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.cardItemDesc}>
                                        High-precision laser engraving on wood, acrylic, metal, leather, glass and more. Ideal for custom gifts, trophies, nameplates, logos and product marking.
                                    </Text>
                                    <View style={[styles.analysisBox, { borderLeftColor: '#7C3AED' }]}>
                                        <Text style={[styles.analysisTag, { color: '#7C3AED' }]}>PROCESS</Text>
                                        <Text style={styles.analysisTxt}>Digital design upload → laser path optimisation → precision engraving with micron-level accuracy.</Text>
                                    </View>
                                </View>
                            </View>

                            {/* UV Printing */}
                            <View style={styles.cardItem}>
                                <View style={[styles.cardBannerImage, { backgroundColor: '#0C4A6E', justifyContent: 'center', alignItems: 'center' }]}>
                                    <Icon name="printer" size={72} color="#38BDF8" />
                                </View>
                                <View style={styles.cardPadding}>
                                    <View style={styles.cardHeaderRow}>
                                        <View style={[styles.cardIconBox, { backgroundColor: '#E0F2FE' }]}>
                                            <Icon name="printer" size={26} color="#0284C7" />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.cardItemTitle}>UV Printing</Text>
                                            <Text style={styles.cardItemTag}>FULL-COLOUR UV FLATBED PRINTING</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.cardItemDesc}>
                                        Vibrant UV flatbed printing directly on rigid and flexible surfaces — mobile covers, acrylic boards, tiles, pens, bottles, banners and promotional merchandise.
                                    </Text>
                                    <View style={[styles.analysisBox, { borderLeftColor: '#0284C7' }]}>
                                        <Text style={[styles.analysisTag, { color: '#0284C7' }]}>PROCESS</Text>
                                        <Text style={styles.analysisTxt}>Artwork preparation → UV ink curing layer by layer → scratch-resistant, waterproof output with vivid colours.</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    )}

                    {/* Contact details callout panel */}
                    <View style={styles.actionCard}>
                        <Text style={styles.actionTitle}>{t('portfolio.sakthi.cta_heading')}</Text>
                        <View style={styles.contactRow}>
                            <TouchableOpacity style={styles.actionBtnCall} onPress={handleCallPrimary}>
                                <Icon name="phone" size={22} color="#FFF" />
                                <Text style={styles.actionBtnTxt}>{t('portfolio.sakthi.cta_call')}</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={styles.actionBtnWhatsapp} onPress={handleWhatsApp}>
                            <Icon name="whatsapp" size={24} color="#FFF" />
                            <Text style={styles.actionBtnTxt}>{t('portfolio.common.whatsapp_btn')}</Text>
                        </TouchableOpacity>
                        <View style={styles.directLineBox}>
                            <Text style={styles.directTitle}>{t('portfolio.sakthi.enquiry_label')}</Text>
                            <Text style={styles.directNumber}>+91 63838 16267</Text>
                        </View>
                    </View>

                    <View style={styles.footer}>
                        <Icon name="flash-circle" size={24} color="#94A3B8" />
                        <Text style={styles.footerTxt}>
                            {t('dashboard.portfolios.sakthi.name')} • {t('dashboard.portfolios.sakthi.tagline')}
                        </Text>
                    </View>
                    <View style={{ height: 80 }} />
                </View>
            </ScrollView>

            {/* Nav Header */}
            <View style={styles.navBar}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" size={24} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.navTitle}>{t('portfolio.sakthi.nav_title')}</Text>
                <View style={{ width: 44 }} />
            </View>

            {/* Standard safe contact button */}
            <FloatingContactButtons
                phoneNumber="6383816267"
                businessName={t('dashboard.portfolios.sakthi.name')}
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
        backgroundColor: '#1E3A8A',
    },
    heroImg: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
    },
    heroOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(3, 7, 18, 0.55)',
        padding: 24,
        paddingTop: Platform.OS === 'ios' ? 100 : 90,
        justifyContent: 'space-between',
    },
    badgeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    badge: {
        backgroundColor: '#EF4444',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 100,
    },
    badgeAlt: {
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 100,
    },
    badgeText: {
        fontSize: 11,
        fontWeight: '800',
        color: '#FFF',
        letterSpacing: 1,
    },
    heroContent: {
        marginBottom: 10,
    },
    sloganContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
        marginBottom: 8,
    },
    sloganText: {
        fontSize: 11,
        color: '#FEF3C7',
        fontWeight: 'bold',
        marginLeft: 6,
    },
    brandTitle: {
        fontSize: 24,
        fontWeight: '900',
        color: '#FFF',
        lineHeight: 32,
    },
    brandSubtitle: {
        fontSize: 13,
        color: '#93C5FD',
        fontWeight: '700',
        marginTop: 4,
        letterSpacing: 0.5,
    },
    scrollContainer: {
        paddingTop: height * 0.40,
    },
    mainContent: {
        backgroundColor: '#F8FAFC',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingTop: 24,
        marginTop: -25,
        zIndex: 12,
    },
    brandCard: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 20,
        elevation: 6,
        shadowColor: '#1E293B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        marginBottom: 24,
    },
    brandInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 15,
        backgroundColor: '#E0F2FE',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    brandLeadTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#0F172A',
    },
    brandLeadDesc: {
        fontSize: 12,
        color: '#64748B',
        lineHeight: 18,
        marginTop: 2,
    },
    statsRow: {
        flexDirection: 'row',
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
        fontSize: 17,
        fontWeight: '900',
        color: '#1E3A8A',
    },
    statLab: {
        fontSize: 10,
        color: '#64748B',
        fontWeight: '700',
        marginTop: 2,
    },
    statDivider: {
        width: 1,
        height: 24,
        backgroundColor: '#E2E8F0',
    },
    servicesAvailableBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#EFF6FF',
        borderWidth: 1,
        borderColor: '#BFDBFE',
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginBottom: 20,
        gap: 8,
    },
    servicesAvailableText: {
        fontSize: 13,
        fontWeight: '800',
        color: '#1E3A8A',
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#F1F5F9',
        borderRadius: 14,
        padding: 4,
        marginBottom: 24,
    },
    tabBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 10,
    },
    tabBtnActiveElectrical: {
        backgroundColor: '#1E3A8A',
    },
    tabBtnActiveElectronics: {
        backgroundColor: '#0284C7',
    },
    tabTxt: {
        fontSize: 13,
        fontWeight: '800',
        color: '#64748B',
        marginLeft: 8,
    },
    tabTxtActive: {
        color: '#FFF',
    },
    pillarSection: {
        marginBottom: 10,
    },
    cardItem: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 24,
        elevation: 6,
        shadowColor: '#1E293B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    cardBannerImage: {
        width: '100%',
        height: 180,
    },
    cardPadding: {
        padding: 20,
    },
    cardHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    cardIconBox: {
        width: 50,
        height: 50,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    cardItemTitle: {
        fontSize: 17,
        fontWeight: '900',
        color: '#0F172A',
    },
    cardItemTag: {
        fontSize: 10,
        fontWeight: '800',
        color: '#3B82F6',
        letterSpacing: 0.5,
        marginTop: 2,
    },
    cardItemDesc: {
        fontSize: 13,
        color: '#64748B',
        lineHeight: 20,
        marginBottom: 16,
    },
    analysisBox: {
        backgroundColor: '#F8FAFC',
        padding: 16,
        borderRadius: 14,
        borderLeftWidth: 4,
    },
    analysisTag: {
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1,
        marginBottom: 4,
    },
    analysisTxt: {
        fontSize: 12,
        color: '#475569',
        lineHeight: 18,
        fontStyle: 'italic',
    },
    actionCard: {
        backgroundColor: '#0F172A',
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 24,
    },
    actionTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#FFF',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 26,
    },
    contactRow: {
        flexDirection: 'row',
        width: '100%',
        gap: 12,
        marginBottom: 12,
    },
    actionBtnCall: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#EF4444',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 12,
        gap: 6,
    },
    actionBtnCallAlt: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#2563EB',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 12,
        gap: 6,
    },
    actionBtnWhatsapp: {
        flexDirection: 'row',
        backgroundColor: '#10B981',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 12,
        gap: 8,
        marginBottom: 20,
    },
    actionBtnTxt: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '800',
    },
    directLineBox: {
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#334155',
        width: '100%',
        paddingTop: 16,
    },
    directTitle: {
        fontSize: 10,
        fontWeight: '900',
        color: '#94A3B8',
        letterSpacing: 2,
        marginBottom: 4,
    },
    directNumber: {
        fontSize: 14,
        fontWeight: '800',
        color: '#FFF',
    },
    footer: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginTop: 16,
        paddingHorizontal: 20,
        gap: 8,
    },
    footerTxt: {
        fontSize: 11,
        fontWeight: '800',
        color: '#94A3B8',
        letterSpacing: 1,
    },
    navBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'ios' ? 50 : 35,
        height: Platform.OS === 'ios' ? 100 : 85,
    },
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    navTitle: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '900',
        letterSpacing: 2,
    },
});

export default SakthiElectricalsPortfolioScreen;

