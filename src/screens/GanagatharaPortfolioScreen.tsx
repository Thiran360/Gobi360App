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

const GanagatharaPortfolioScreen = ({ navigation }: any) => {
    const { t } = useTranslation();
    const scrollY = useRef(new Animated.Value(0)).current;

    const handleCallPrimary = () => {
        checkSessionAndNavigate(navigation, () => {
            triggerCall('9790629888', 'Sri Ganagathara Agency (Primary)');
        });
    };

    const handleCallSecondary = () => {
        checkSessionAndNavigate(navigation, () => {
            triggerCall('9976954448', 'Sri Ganagathara Agency (Secondary)');
        });
    };

    const handleWhatsApp = () => {
        checkSessionAndNavigate(navigation, () => {
            const msg = 'Hi Sri Ganagathara Agency, I found you on the Service App and need some electrical/hardware supplies.';
            Linking.openURL(`whatsapp://send?phone=919790629888&text=${encodeURIComponent(msg)}`);
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
                    source={require('../assets/images/portfolio/ganagathara/hero.png')}
                    style={[styles.heroImg, { transform: [{ scale: headerScale }] }]}
                    resizeMode="cover"
                />
                <Animated.View style={[styles.heroOverlay, { opacity: headerOpacity }]}>
                    <View style={styles.badgeRow}>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>Hardware & Electricals</Text>
                        </View>
                    </View>
                    <View style={styles.heroContent}>
                        <Text style={styles.brandTitle}>Sri Ganagathara Agency</Text>
                        <Text style={styles.brandSubtitle}>Electricals & Hardwares</Text>
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
                                <Icon name="power-plug" size={32} color="#EAB308" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.brandLeadTitle}>S. Senthilkumar</Text>
                                <Text style={styles.brandLeadDesc}>135/1, Erode Main Road, Kullamapalayam Privu, Gobi.</Text>
                            </View>
                        </View>
                    </View>

                    {/* Authorized Brands */}
                    <Text style={styles.sectionTitle}>Authorized Brands</Text>
                    <View style={styles.brandsContainer}>
                        <View style={styles.brandBadge}><Text style={styles.brandBadgeText}>Philips</Text></View>
                        <View style={styles.brandBadge}><Text style={styles.brandBadgeText}>KUNDAN CAB</Text></View>
                        <View style={styles.brandBadge}><Text style={styles.brandBadgeText}>GM</Text></View>
                        <View style={styles.brandBadge}><Text style={styles.brandBadgeText}>WATERTEC</Text></View>
                        <View style={styles.brandBadge}><Text style={styles.brandBadgeText}>TAPS & FITTINGS</Text></View>
                        <View style={styles.brandBadge}><Text style={styles.brandBadgeText}>TRUFLO by hindware</Text></View>
                    </View>

                    {/* Products For Sale */}
                    <Text style={styles.sectionTitle}>Our Products (Wholesale & Retail)</Text>
                    <View style={styles.servicesGrid}>
                        <View style={styles.serviceCard}>
                            <Image source={require('../assets/images/portfolio/ganagathara/elec.png')} style={styles.serviceCardImg} />
                            <Text style={styles.serviceTitle}>Electricals Sales</Text>
                            <Text style={styles.serviceDesc}>Dealers in all kinds of electrical goods: switches, sockets, MCBs, and PVC boxes.</Text>
                        </View>
                        <View style={styles.serviceCard}>
                            <Image source={require('../assets/images/portfolio/ganagathara/hard.png')} style={styles.serviceCardImg} />
                            <Text style={styles.serviceTitle}>Hardwares Supply</Text>
                            <Text style={styles.serviceDesc}>Retail and wholesale supply of building hardwares, tools, locks, and fitting accessories.</Text>
                        </View>
                        <View style={styles.serviceCard}>
                            <Image source={require('../assets/images/portfolio/ganagathara/plumb.png')} style={styles.serviceCardImg} />
                            <Text style={styles.serviceTitle}>Plumbing Materials</Text>
                            <Text style={styles.serviceDesc}>Authorized dealers for PVC pipes, sanitary wares, water taps, and bathroom fittings.</Text>
                        </View>
                        <View style={styles.serviceCard}>
                            <Image source={require('../assets/images/portfolio/ganagathara/light.png')} style={styles.serviceCardImg} />
                            <Text style={styles.serviceTitle}>Lighting & Cables</Text>
                            <Text style={styles.serviceDesc}>Wide range of LED bulbs, tube lights, copper wires, and industrial cables.</Text>
                        </View>
                        <View style={styles.serviceCard}>
                            <Image source={{ uri: 'https://image.pollinations.ai/prompt/large-plastic-water-storage-tanks-hardware?width=400&height=300&nologo=true' }} style={styles.serviceCardImg} />
                            <Text style={styles.serviceTitle}>Watertanks</Text>
                            <Text style={styles.serviceDesc}>Durable and high-capacity plastic water storage tanks for residential and commercial use.</Text>
                        </View>
                        <View style={styles.serviceCard}>
                            <Image source={{ uri: 'https://image.pollinations.ai/prompt/agriculture-farming-tools-spade-shovel-hardware?width=400&height=300&nologo=true' }} style={styles.serviceCardImg} />
                            <Text style={styles.serviceTitle}>Agri Tools</Text>
                            <Text style={styles.serviceDesc}>Quality agricultural implements, farming tools, and gardening equipment.</Text>
                        </View>
                    </View>

                    {/* Showroom Gallery */}
                    <View style={styles.galleryHeader}>
                        <Text style={styles.sectionTitle}>Shop & Product Gallery</Text>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.galleryScroll}>
                        <Image source={require('../assets/images/portfolio/ganagathara/elec.png')} style={styles.galleryImage} />
                        <Image source={require('../assets/images/portfolio/ganagathara/hard.png')} style={styles.galleryImage} />
                        <Image source={require('../assets/images/portfolio/ganagathara/plumb.png')} style={styles.galleryImage} />
                        <Image source={require('../assets/images/portfolio/ganagathara/light.png')} style={styles.galleryImage} />
                    </ScrollView>

                    {/* Contact details callout panel */}
                    <View style={styles.actionCard}>
                        <Text style={styles.actionTitle}>Get the Best Deals on Hardwares</Text>
                        <View style={styles.contactRow}>
                            <TouchableOpacity style={styles.actionBtnCall} onPress={handleCallPrimary}>
                                <Icon name="phone" size={22} color="#FFF" />
                                <Text style={styles.actionBtnTxt}>Call Senthilkumar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionBtnCallAlt} onPress={handleCallSecondary}>
                                <Icon name="phone-outline" size={22} color="#FFF" />
                                <Text style={styles.actionBtnTxt}>Alt Number</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={styles.actionBtnWhatsapp} onPress={handleWhatsApp}>
                            <Icon name="whatsapp" size={24} color="#FFF" />
                            <Text style={styles.actionBtnTxt}>WhatsApp Enquiry</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ height: 80 }} />
                </View>
            </ScrollView>

            {/* Nav Header */}
            <View style={styles.navBar}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" size={24} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.navTitle}>PORTFOLIO</Text>
                <View style={{ width: 44 }} />
            </View>

            {/* Standard safe contact button */}
            <FloatingContactButtons
                phoneNumber="9790629888"
                businessName="Sri Ganagathara Agency"
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
        backgroundColor: '#EAB308',
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
        backgroundColor: '#EAB308',
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
    brandTitle: {
        fontSize: 24,
        fontWeight: '900',
        color: '#FFF',
        lineHeight: 32,
    },
    brandSubtitle: {
        fontSize: 13,
        color: '#FEF08A',
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
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 15,
        backgroundColor: '#FEF08A',
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
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#0F172A',
        marginBottom: 12,
    },
    brandsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 24,
    },
    brandBadge: {
        backgroundColor: '#E0F2FE',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#BAE6FD',
    },
    brandBadgeText: {
        color: '#0369A1',
        fontWeight: '700',
        fontSize: 12,
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
        gap: 8,
    },
    actionBtnCallAlt: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#334155',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 12,
        gap: 8,
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
    },
    actionBtnTxt: {
        fontSize: 14,
        fontWeight: '800',
        color: '#FFF',
    },
    navBar: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 50 : 40,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        zIndex: 20,
    },
    backBtn: {
        width: 44,
        height: 44,
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    navTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#FFF',
        letterSpacing: 1,
    },
    servicesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    serviceCard: {
        width: '48%',
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 0,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        shadowColor: '#64748B',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        overflow: 'hidden',
    },
    serviceCardImg: {
        width: '100%',
        height: 110,
        backgroundColor: '#F1F5F9',
        marginBottom: 12,
    },
    serviceTitle: {
        fontSize: 15,
        fontWeight: '800',
        color: '#1E293B',
        marginBottom: 8,
        paddingHorizontal: 12,
    },
    serviceDesc: {
        fontSize: 12,
        color: '#64748B',
        lineHeight: 18,
        paddingHorizontal: 12,
        paddingBottom: 16,
    },
    galleryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    galleryScroll: {
        gap: 12,
        marginBottom: 24,
        paddingRight: 20,
    },
    galleryImage: {
        width: width * 0.6,
        height: 160,
        borderRadius: 16,
        backgroundColor: '#F1F5F9',
    },
});

export default GanagatharaPortfolioScreen;

