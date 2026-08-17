import React, { useState, useEffect, useRef } from 'react';
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
    ActivityIndicator,
    Share
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import FloatingContactButtons from '../components/FloatingContactButtons';
import { checkSessionAndNavigate } from '../utils/auth';
import { triggerCall } from '../utils/callTracker';
import { API_ENDPOINTS } from '../utils/api';
import FloatingCartButton from '../components/FloatingCartButton';

const { width, height } = Dimensions.get('window');

type ParamList = {
    DynamicExpertServices: { expertId: number; expertName: string; expertImage: string; category: string; phone: string; initialServices?: any[] };
};

interface ExpertService {
    id: number;
    service_name: string;
    service_image: string;
    short_description: string;
    long_description: string;
    created_at: string;
}

const DynamicExpertServicesScreen = () => {
    const { t } = useTranslation();
    const navigation = useNavigation<any>();
    const route = useRoute<RouteProp<ParamList, 'DynamicExpertServices'>>();
    const { expertId, expertName, expertImage, category, phone, initialServices } = route.params;

    const [services, setServices] = useState<ExpertService[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const scrollY = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        fetchServices();
    }, [expertId]);

    const fetchServices = async () => {
        try {
            setLoading(true);
            setError(null);
            const rawId = String(expertId);
            const actualId = rawId.startsWith('dyn_') ? rawId.replace('dyn_', '') : rawId;
            
            const response = await fetch(`${API_ENDPOINTS.experts}${actualId}/services/`);
            if (response.ok) {
                const data = await response.json();
                if (Array.isArray(data)) {
                    setServices(data);
                } else if (data && Array.isArray(data.services)) {
                    setServices(data.services);
                } else {
                    setServices([]);
                }
            } else {
                setServices([]);
                console.error(`Failed to fetch expert detail: ${response.status}`);
            }
        } catch (err) {
            console.error('Error fetching expert services:', err);
            setError('Failed to load services.');
        } finally {
            setLoading(false);
        }
    };

    const headerScale = scrollY.interpolate({
        inputRange: [-100, 0, 100],
        outputRange: [1.1, 1, 1],
    });

    const contactExpert = (type: 'call' | 'whatsapp') => {
        checkSessionAndNavigate(navigation, () => {
            if (type === 'call') {
                triggerCall(phone, expertName, expertId);
            } else {
                const msg = `Hi ${expertName}, I am interested in your services.`;
                Linking.openURL(`whatsapp://send?phone=91${phone}&text=${encodeURIComponent(msg)}`);
            }
        });
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Check out ${expertName}'s professional services on Gobi360!\n\nCategory: ${category}\nView portfolio: https://gobi360.in/expert/${expertId}`,
                title: `${expertName} on Gobi360`
            });
        } catch (error: any) {
            console.error('Error sharing:', error.message);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

            {/* Floating Action Header */}
            <View style={styles.floatingHeader}>
                <TouchableOpacity style={styles.floatingButton} onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" size={24} color="#1E293B" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.floatingButton} onPress={handleShare}>
                    <Icon name="share-variant" size={24} color="#1E293B" />
                </TouchableOpacity>
            </View>

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
                        source={{ uri: expertImage || 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800' }}
                        style={styles.heroBackground}
                    >
                        <View style={styles.heroOverlay}>
                            <View style={styles.topBadges}>
                                <View style={styles.premiumBadge}>
                                    <Icon name="medal-outline" size={14} color="#D946EF" />
                                    <Text style={styles.premiumBadgeText}>EXPERT</Text>
                                </View>
                                <View style={styles.yearBadge}>
                                    <Text style={styles.yearBadgeText}>VERIFIED</Text>
                                </View>
                            </View>

                            <View style={styles.heroContent}>
                                <Text style={styles.businessTitle}>{expertName}</Text>
                                <Text style={styles.businessSubtitle}>{category}</Text>

                                <View style={styles.locationContainer}>
                                    <Icon name="map-marker-radius" size={18} color="#D946EF" />
                                    <Text style={styles.locationText}>Online Services</Text>
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

                    {loading ? (
                        <View style={styles.centerContainer}>
                            <ActivityIndicator size="large" color="#D946EF" />
                        </View>
                    ) : error ? (
                        <View style={styles.centerContainer}>
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    ) : services.length === 0 ? (
                        <View style={styles.centerContainer}>
                            <Text style={styles.emptyText}>No services listed yet.</Text>
                        </View>
                    ) : (
                        services.map((service, index) => {
                            const colors = ['#D946EF', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'];
                            const color = colors[index % colors.length];
                            const accents = ['#FDF4FF', '#EFF6FF', '#ECFDF5', '#FFFBEB', '#F5F3FF'];
                            const accent = accents[index % accents.length];
                            
                            return (
                                <View key={service.id} style={styles.serviceSection}>
                                    <TouchableOpacity activeOpacity={0.9} style={styles.cardContainer}>
                                        <ImageBackground
                                            source={{ uri: service.service_image }}
                                            style={styles.cardImage}
                                            imageStyle={{ borderRadius: 24 }}
                                            resizeMode="cover"
                                            resizeMethod="resize"
                                        >
                                            <View style={styles.imageOverlay} />
                                        </ImageBackground>

                                        <View style={styles.serviceInfo}>
                                            <View style={styles.titleRow}>
                                                <View style={[styles.iconBox, { backgroundColor: accent }]}>
                                                    <Icon name="star-circle" size={24} color={color} />
                                                </View>
                                                <View style={styles.titleTextContainer}>
                                                    <Text style={styles.serviceName}>{service.service_name}</Text>
                                                    <Text style={styles.serviceTag}>SPECIALIZED</Text>
                                                </View>
                                            </View>

                                            <Text style={styles.serviceDesc}>{service.short_description || service.long_description}</Text>

                                            {service.long_description ? (
                                                <View style={[styles.analysisCard, { borderLeftColor: color }]}>
                                                    <View style={styles.analysisHeader}>
                                                        <Icon name="radar" size={14} color={color} />
                                                        <Text style={[styles.analysisLabel, { color: color }]}>DETAILS</Text>
                                                    </View>
                                                    <Text style={styles.analysisText}>{service.long_description}</Text>
                                                </View>
                                            ) : null}
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            );
                        })
                    )}

                    {/* Founder Section */}
                    <View style={styles.teamCard}>
                        <View style={styles.teamIconBox}>
                            <Icon name="account-cog-outline" size={32} color="#1E293B" />
                        </View>
                        <Text style={styles.teamTitle}>Expert Professional</Text>
                        <Text style={styles.teamDesc}>Delivering quality services tailored to your needs. Connect with us to get started.</Text>
                    </View>

                    {/* Action Bar */}
                    <View style={styles.actionSection}>
                        <Text style={styles.actionHeading}>Ready for your appointment?</Text>
                        <View style={styles.buttonRow}>
                            <TouchableOpacity
                                style={[styles.mainButton, { backgroundColor: '#D946EF' }]}
                                onPress={() => contactExpert('call')}
                            >
                                <Icon name="phone" size={20} color="#FFFFFF" />
                                <Text style={styles.btnText}>Book Appointment</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.mainButton, { backgroundColor: '#10B981' }]}
                                onPress={() => contactExpert('whatsapp')}
                            >
                                <Icon name="whatsapp" size={20} color="#FFFFFF" />
                                <Text style={styles.btnText}>WhatsApp</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={styles.secondaryContact} onPress={() => contactExpert('call')}>
                            <Text style={styles.secLabel}>ENQUIRY DESK</Text>
                            <Text style={styles.secNumber}>+91 {phone}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.footerBranding}>
                        <Icon name="robot" size={20} color="#94A3B8" />
                        <Text style={styles.footerText}>{expertName} • {category}</Text>
                    </View>

                    <View style={{ height: 40 }} />
                </View>
            </ScrollView>



            <FloatingCartButton expertId={expertId} expertName={expertName} />

            <FloatingContactButtons 
                phoneNumber={phone}
                businessName={expertName} 
            />
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
        top: Platform.OS === 'ios' ? 50 : 40,
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        zIndex: 100,
    },
    floatingButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    heroContainer: {
        height: height * 0.45,
    },
    heroBackground: {
        flex: 1,
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
        color: '#D946EF',
        letterSpacing: 4,
        marginTop: 0,
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
    centerContainer: {
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    errorText: {
        color: '#EF4444',
        fontWeight: '600',
    },
    emptyText: {
        color: '#94A3B8',
        fontStyle: 'italic',
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
    },
    imageOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.05)',
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
        flex: 1,
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
        color: '#D946EF',
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
        backgroundColor: '#FDF4FF',
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
        flexDirection: 'column',
        width: '100%',
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
        flex: 1,
        textAlign: 'center',
        marginHorizontal: 10,
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

export default DynamicExpertServicesScreen;
