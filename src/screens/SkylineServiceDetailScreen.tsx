import React, { useRef } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Image,
    Animated,
    StatusBar,
    Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import FloatingContactButtons from '../components/FloatingContactButtons';
import { checkSessionAndNavigate } from '../utils/auth';
// Removed circular import from App.tsx

const { width, height } = Dimensions.get('window');
const HEADER_MAX_HEIGHT = height * 0.45;

const SkylineServiceDetailScreen = () => {
    const { t } = useTranslation();
    const route = useRoute<RouteProp<{ SkylineServiceDetail: { serviceId: number } }, 'SkylineServiceDetail'>>();
    const navigation = useNavigation<any>();
    const { serviceId } = route.params;
    const scrollY = useRef(new Animated.Value(0)).current;

    // Service specific static data
    const SERVICE_DETAILS: { [key: number]: any } = {
        1: {
            icon: 'office-building',
            color: '#2563EB',
            bg: '#EFF6FF',
            gallery: [
                require('../assets/images/skyline_construction.png'),
                require('../assets/images/skyline_construction_2.png'),
                require('../assets/images/skyline_construction_3.png'),
                require('../assets/images/skyline_construction_4.png'),
                require('../assets/images/skyline_construction_5.png'),
                'https://i.pinimg.com/1200x/3d/8d/a7/3d8da7ded61e57cd2f8c8991ea285efd.jpg'
            
            ]
        },
        2: {
            icon: 'home-edit',
            color: '#0891B2',
            bg: '#ECFEFF',
            gallery: [
                require('../assets/images/skyline_renovation.png'),
                require('../assets/images/skyline_renovation_2.png'),
                require('../assets/images/skyline_renovation_3.png'),
                require('../assets/images/skyline_renovation_4.png'),
                'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=800&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800&auto=format&fit=crop'
            ]
        },
        3: {
            icon: 'countertop',
            color: '#4F46E5',
            bg: '#EEF2FF',
            gallery: [
                require('../assets/images/skyline_modular.png'),
                require('../assets/images/skyline_modular_2.png'),
                require('../assets/images/skyline_modular_3.png'),
                require('../assets/images/skyline_modular_4.png'),
                'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop',
                'https://i.pinimg.com/736x/10/ff/96/10ff96885c4544dfc0c30a2b2c6f182f.jpg'
            ]
        },
        4: {
            icon: 'factory',
            color: '#1E293B',
            bg: '#F1F5F9',
            gallery: [
                require('../assets/images/skyline_roofing.png'),
                require('../assets/images/skyline_roofing_2.png'),
                require('../assets/images/skyline_roofing_3.png'),
                require('../assets/images/skyline_roofing_4.png'),
                'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=800&auto=format&fit=crop',
                'https://i.pinimg.com/1200x/74/50/b0/7450b0c448fbf5bdaf0fcb05aba790fd.jpg',
                'https://images.unsplash.com/photo-1513828583688-c52646db42da?q=80&w=800&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop'
            ]
        }
    };

    const details = SERVICE_DETAILS[serviceId] || SERVICE_DETAILS[1];
    const serviceKey = `s${serviceId}`;

    const headerTranslate = scrollY.interpolate({
        inputRange: [0, HEADER_MAX_HEIGHT],
        outputRange: [0, -HEADER_MAX_HEIGHT],
        extrapolate: 'clamp',
    });

    const imageOpacity = scrollY.interpolate({
        inputRange: [0, HEADER_MAX_HEIGHT / 2, HEADER_MAX_HEIGHT],
        outputRange: [1, 1, 0],
        extrapolate: 'clamp',
    });

    const contactExpert = (type: 'call' | 'whatsapp') => {
        checkSessionAndNavigate(navigation, () => {
            if (type === 'call') {
                Linking.openURL('tel:8754944026');
            } else {
                const msg = t('portfolio.skyline.whatsapp_msg');
                Linking.openURL(`whatsapp://send?phone=918754944026&text=${encodeURIComponent(msg)}`);
            }
        });
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            
            {/* Parallax Header */}
            <Animated.View style={[styles.parallaxHeader, { transform: [{ translateY: headerTranslate }] }]}>
                <Animated.Image
                    source={typeof details.gallery[0] === 'string' ? { uri: details.gallery[0] } : details.gallery[0]}
                    style={[styles.headerImage, { opacity: imageOpacity }]}
                />
                <View style={styles.headerOverlay} />
            </Animated.View>

            <Animated.ScrollView
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: true }
                )}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingTop: HEADER_MAX_HEIGHT }}
                style={styles.scrollView}
            >
                <View style={styles.content}>
                    <View style={styles.indicator} />
                    
                    <View style={styles.headerInfo}>
                        <View style={[styles.iconBox, { backgroundColor: details.bg }]}>
                            <Icon name={details.icon} size={32} color={details.color} />
                        </View>
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>{t(`portfolio.skyline.services.${serviceKey}_title`)}</Text>
                            <Text style={styles.tagline}>{t('portfolio.skyline.service_tag')}</Text>
                        </View>
                    </View>

                    <View style={styles.descriptionSection}>
                        <Text style={styles.description}>
                            {t(`portfolio.skyline.services.${serviceKey}_long_desc`, { defaultValue: t(`portfolio.skyline.services.${serviceKey}_desc`) })}
                        </Text>
                    </View>

                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Icon name="shield-check" size={20} color={details.color} />
                            <Text style={[styles.sectionTitle, { color: details.color }]}>{t('portfolio.skyline.analysis_label')}</Text>
                        </View>
                        <View style={styles.analysisCard}>
                            <Text style={styles.analysisText}>{t(`portfolio.skyline.services.${serviceKey}_analysis`)}</Text>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.subHeader}>{t('portfolio.common.gallery')}</Text>
                        <View style={styles.galleryGrid}>
                            {details.gallery.map((img: string, idx: number) => (
                                <View key={idx} style={styles.galleryItem}>
                                    <Image 
                                        source={typeof img === 'string' ? { uri: img } : img} 
                                        style={styles.galleryImage} 
                                    />
                                </View>
                            ))}
                        </View>
                    </View>

                    <View style={styles.infoCardsRow}>
                        <View style={styles.infoCard}>
                            <Icon name="clock-fast" size={24} color="#3B82F6" />
                            <Text style={styles.infoCardTitle}>{t('portfolio.common.turnaround')}</Text>
                            <Text style={styles.infoCardValue}>{t('portfolio.skyline.turnaround_value')}</Text>
                        </View>
                        <View style={styles.infoCard}>
                            <Icon name="medal" size={24} color="#F59E0B" />
                            <Text style={styles.infoCardTitle}>{t('portfolio.common.warranty')}</Text>
                            <Text style={styles.infoCardValue}>{t('portfolio.skyline.warranty_value')}</Text>
                        </View>
                    </View>

                    <View style={styles.ctaSection}>
                        <Text style={styles.ctaHeading}>{t('portfolio.skyline.cta_heading')}</Text>
                        <View style={styles.buttonRow}>
                            <TouchableOpacity
                                style={[styles.mainButton, { backgroundColor: details.color }]}
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
                                <Text style={styles.btnText}>{t('portfolio.common.whatsapp_btn')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Animated.ScrollView>

            {/* Top Bar */}
            <View style={styles.topBar}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.shareBtn}>
                    <Icon name="share-variant" size={22} color="#FFFFFF" />
                </TouchableOpacity>
            </View>

            <FloatingContactButtons 
                phoneNumber="9443822122"
                businessName={t('dashboard.portfolios.skyline.name')} 
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    parallaxHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: HEADER_MAX_HEIGHT,
        overflow: 'hidden',
        zIndex: 0,
    },
    scrollView: {
        flex: 1,
        zIndex: 1,
        backgroundColor: 'transparent',
    },
    headerImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    headerOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    topBar: {
        position: 'absolute',
        top: 50,
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        zIndex: 10,
    },
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    shareBtn: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        minHeight: height,
        padding: 24,
        marginTop: -30,
    },
    indicator: {
        width: 40,
        height: 4,
        backgroundColor: '#E2E8F0',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 24,
    },
    headerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    iconBox: {
        width: 64,
        height: 64,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleContainer: {
        marginLeft: 20,
        flex: 1,
    },
    title: {
        fontSize: 22,
        fontWeight: '900',
        color: '#1E293B',
        lineHeight: 32,
    },
    tagline: {
        fontSize: 12,
        fontWeight: '800',
        color: '#64748B',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginTop: 4,
    },
    descriptionSection: {
        marginBottom: 32,
    },
    description: {
        fontSize: 15,
        lineHeight: 24,
        color: '#475569',
        fontWeight: '500',
    },
    section: {
        marginBottom: 32,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '900',
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    analysisCard: {
        backgroundColor: '#F8FAFC',
        padding: 20,
        borderRadius: 20,
        borderLeftWidth: 4,
        borderColor: '#E2E8F0',
    },
    analysisText: {
        fontSize: 14,
        lineHeight: 22,
        color: '#64748B',
        fontStyle: 'italic',
    },
    subHeader: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1E293B',
        marginBottom: 16,
    },
    galleryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    galleryItem: {
        width: (width - 60) / 2,
        aspectRatio: 1,
        borderRadius: 16,
        overflow: 'hidden',
    },
    galleryImage: {
        width: '100%',
        height: '100%',
    },
    infoCardsRow: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 32,
    },
    infoCard: {
        flex: 1,
        backgroundColor: '#F1F5F9',
        padding: 20,
        borderRadius: 24,
        alignItems: 'center',
    },
    infoCardTitle: {
        fontSize: 10,
        fontWeight: '800',
        color: '#64748B',
        textTransform: 'uppercase',
        marginTop: 12,
        marginBottom: 4,
    },
    infoCardValue: {
        fontSize: 14,
        fontWeight: '900',
        color: '#1E293B',
    },
    ctaSection: {
        backgroundColor: '#1E293B',
        padding: 24,
        borderRadius: 28,
        alignItems: 'center',
        marginBottom: 100,
    },
    ctaHeading: {
        fontSize: 18,
        fontWeight: '900',
        color: '#FFFFFF',
        marginBottom: 20,
        textAlign: 'center',
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
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
    },
});

export default SkylineServiceDetailScreen;
