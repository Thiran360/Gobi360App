import React, { useRef, useCallback } from 'react';
import FloatingCartButton from '../components/FloatingCartButton';
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
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';
import FloatingContactButtons from '../components/FloatingContactButtons';

import { checkSessionAndNavigate } from '../utils/auth';
import { triggerCall } from '../utils/callTracker';

const { width } = Dimensions.get('window');

const STGEsportsPortfolioScreen = ({ navigation }: any) => {
    const { t } = useTranslation();
    const scrollY = useRef(new Animated.Value(0)).current;

    const SERVICES = [
        {
            id: 1,
            title: 'Tournaments & Leagues',
            desc: 'Join weekly and monthly BGMI tournaments with massive prize pools and competitive lobbies.',
            icon: 'trophy',
            color: '#3B82F6',
            accent: '#EFF6FF',
            analysis: 'Professional matchmaking, live streaming, and dedicated spectator support.',
            image: { uri: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop' }
        },
        {
            id: 2,
            title: 'Custom Matches',
            desc: 'Book custom rooms for practice, scrims, or friendly battles with your squad.',
            icon: 'controller-classic',
            color: '#10B981',
            accent: '#ECFDF5',
            analysis: 'Instant room ID delivery, strict anti-hack monitoring, and lag-free hosting.',
            image: { uri: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=800&auto=format&fit=crop' }
        },
        {
            id: 3,
            title: 'Team Management & Services',
            desc: 'Find players, build your esports roster, and get premium coaching for rank push.',
            icon: 'account-group',
            color: '#EF4444',
            accent: '#FEF2F2',
            analysis: 'Connect with tier-1 players and elevate your gaming strategy.',
            image: { uri: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop' }
        }
    ];

    const headerScale = scrollY.interpolate({
        inputRange: [-100, 0, 100],
        outputRange: [1.1, 1, 1],
    });

    const contactExpert = useCallback((type: 'call' | 'whatsapp') => {
        checkSessionAndNavigate(navigation, () => {
            if (type === 'call') {
                triggerCall('8056823309', 'STG Esports');
            } else {
                const msg = 'Hi STG Esports, I am interested in joining the upcoming BGMI tournaments!';
                Linking.openURL(`whatsapp://send?phone=918056823309&text=${encodeURIComponent(msg)}`);
            }
        });
    }, [navigation]);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

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
                        source={require('../assets/images/stg_bg.png')}
                        style={styles.heroBackground}
                    >
                        <View style={styles.heroOverlay}>
                            <View style={styles.topBadges}>
                                <View style={styles.premiumBadge}>
                                    <Icon name="sword-cross" size={14} color="#EF4444" />
                                    <Text style={styles.premiumBadgeText}>Elite Gaming</Text>
                                </View>
                                <View style={styles.yearBadge}>
                                    <Text style={styles.yearBadgeText}>BGMI Experts</Text>
                                </View>
                            </View>

                            <View style={styles.heroContent}>
                                <Image 
                                    source={require('../assets/images/stg_logo.png')} 
                                    style={styles.logoImage} 
                                    resizeMode="contain" 
                                />
                                <Text style={styles.businessSubtitle}>Tournaments, Matches & BGMI Services</Text>

                                <View style={styles.locationContainer}>
                                    <Icon name="crosshairs-gps" size={18} color="#EF4444" />
                                    <Text style={styles.locationText}>Online Lobbies</Text>
                                </View>
                            </View>
                        </View>
                    </ImageBackground>
                </Animated.View>

                {/* Content Section */}
                <View style={styles.contentWrapper}>
                    <View style={styles.introHeader}>
                        <View style={styles.dotLine} />
                        <Text style={styles.sectionTitle}>OUR SERVICES</Text>
                        <View style={styles.dotLine} />
                    </View>

                    {/* Services Cards */}
                    {SERVICES.map((service) => (
                        <View key={service.id} style={styles.serviceSection}>
                            <TouchableOpacity activeOpacity={0.9} style={styles.cardContainer}>
                                <ImageBackground
                                    source={service.image}
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
                                            <Text style={styles.serviceTag}>Premium Access</Text>
                                        </View>
                                    </View>

                                    <Text style={styles.serviceDesc}>{service.desc}</Text>

                                    <View style={[styles.analysisCard, { borderLeftColor: service.color }]}>
                                        <View style={styles.analysisHeader}>
                                            <Icon name="gamepad-variant" size={14} color={service.color} />
                                            <Text style={[styles.analysisLabel, { color: service.color }]}>Gameplay Highlight</Text>
                                        </View>
                                        <Text style={styles.analysisText}>{service.analysis}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    ))}

                    {/* Action Bar */}
                    <View style={styles.actionSection}>
                        <Text style={styles.actionHeading}>Ready to drop in?</Text>
                        <View style={styles.buttonRow}>
                            <TouchableOpacity
                                style={[styles.mainButton, { backgroundColor: '#EF4444' }]}
                                onPress={() => contactExpert('call')}
                            >
                                <Icon name="phone" size={20} color="#FFFFFF" />
                                <Text style={styles.btnText}>Book Slot</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.mainButton, { backgroundColor: '#10B981' }]}
                                onPress={() => contactExpert('whatsapp')}
                            >
                                <Icon name="whatsapp" size={20} color="#FFFFFF" />
                                <Text style={styles.btnText}>WhatsApp</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>

            <FloatingContactButtons
                onCall={() => contactExpert('call')}
                onWhatsapp={() => contactExpert('whatsapp')}
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
        height: 380,
        width: '100%',
    },
    heroBackground: {
        width: '100%',
        height: '100%',
    },
    heroOverlay: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        padding: 24,
        paddingTop: 60,
        justifyContent: 'space-between',
    },
    topBadges: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    premiumBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEF2F2',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
    },
    premiumBadgeText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#EF4444',
    },
    yearBadge: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    yearBadgeText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    heroContent: {
        gap: 12,
        alignItems: 'center',
    },
    logoImage: {
        height: 120,
        width: 120,
        borderRadius: 60,
        borderWidth: 3,
        borderColor: '#EF4444',
        marginBottom: 16,
        backgroundColor: '#000',
    },
    businessSubtitle: {
        fontSize: 18,
        fontWeight: '800',
        fontFamily: 'sans-serif',
        color: '#F8FAFC',
        textShadowColor: 'rgba(239, 68, 68, 0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 8,
        letterSpacing: 0.5,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 8,
        marginTop: 4,
    },
    locationText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    contentWrapper: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        marginTop: -30,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingTop: 32,
        paddingBottom: 100,
    },
    introHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        marginBottom: 24,
        paddingHorizontal: 24,
    },
    dotLine: {
        height: 2,
        flex: 1,
        backgroundColor: '#1E293B',
        borderRadius: 2,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '800',
        color: '#38BDF8',
        letterSpacing: 1.5,
    },
    serviceSection: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    cardContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
        elevation: 4,
        overflow: 'hidden',
    },
    cardImage: {
        width: '100%',
        height: 160,
    },
    imageOverlay: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.4)',
        borderRadius: 24,
    },
    serviceInfo: {
        padding: 20,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginBottom: 16,
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleTextContainer: {
        flex: 1,
    },
    serviceName: {
        fontSize: 20,
        fontWeight: '900',
        fontFamily: 'sans-serif',
        color: '#1E293B',
        marginBottom: 4,
        letterSpacing: 0.5,
    },
    serviceTag: {
        fontSize: 12,
        fontWeight: '700',
        color: '#EF4444',
        textTransform: 'uppercase',
    },
    serviceDesc: {
        fontSize: 14,
        color: '#475569',
        lineHeight: 22,
        marginBottom: 16,
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
        gap: 8,
        marginBottom: 8,
    },
    analysisLabel: {
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    analysisText: {
        fontSize: 13,
        color: '#64748B',
        lineHeight: 20,
    },
    actionSection: {
        padding: 24,
        backgroundColor: '#FFFFFF',
        marginHorizontal: 20,
        borderRadius: 24,
        alignItems: 'center',
        marginTop: 8,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 4,
    },
    actionHeading: {
        fontSize: 20,
        fontWeight: '900',
        fontFamily: 'sans-serif',
        color: '#1E293B',
        marginBottom: 16,
        letterSpacing: 0.5,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    mainButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 16,
        gap: 8,
    },
    btnText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '700',
    }
});

export default STGEsportsPortfolioScreen;

