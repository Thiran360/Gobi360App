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

const { width, height } = Dimensions.get('window');
const HEADER_MAX_HEIGHT = height * 0.45;

const SriJeyamServiceDetailScreen = () => {
    const { t } = useTranslation();
    const route = useRoute<RouteProp<{ SriJeyamServiceDetail: { service: any } }, 'SriJeyamServiceDetail'>>();
    const navigation = useNavigation<any>();
    const { service } = route.params;
    const scrollY = useRef(new Animated.Value(0)).current;

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
                Linking.openURL('tel:6374822433');
            } else {
                const msg = `Hi, I am interested in ${service.title} services.`;
                Linking.openURL(`whatsapp://send?phone=916374822433&text=${encodeURIComponent(msg)}`);
            }
        });
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            
            {/* Parallax Header */}
            <Animated.View style={[styles.parallaxHeader, { transform: [{ translateY: headerTranslate }] }]}>
                <Animated.Image
                    source={service.image}
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
                        <View style={[styles.iconBox, { backgroundColor: '#E0F2FE' }]}>
                            <Icon name="tools" size={32} color="#0EA5E9" />
                        </View>
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>{service.title}</Text>
                            <Text style={styles.tagline}>Premium Quality Service</Text>
                        </View>
                    </View>

                    <View style={styles.descriptionSection}>
                        <Text style={styles.description}>
                            {service.desc}
                        </Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.subHeader}>Gallery</Text>
                        {/* The user specifically asked for "one by one cart not 2 cart" which means 1 column */}
                        <View style={styles.galleryList}>
                            {service.gallery.map((img: any, idx: number) => (
                                <View key={idx} style={styles.galleryItem}>
                                    <Image 
                                        source={img} 
                                        style={styles.galleryImage} 
                                    />
                                </View>
                            ))}
                        </View>
                    </View>

                    <View style={styles.ctaSection}>
                        <Text style={styles.ctaHeading}>Need this service?</Text>
                        <View style={styles.buttonRow}>
                            <TouchableOpacity
                                style={[styles.mainButton, { backgroundColor: '#0EA5E9' }]}
                                onPress={() => contactExpert('call')}
                            >
                                <Icon name="phone" size={20} color="#FFFFFF" />
                                <Text style={styles.btnText}>Call Now</Text>
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
            </Animated.ScrollView>

            {/* Top Bar */}
            <View style={styles.topBar}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" size={24} color="#FFFFFF" />
                </TouchableOpacity>
            </View>

            <FloatingContactButtons 
                phoneNumber="6374822433"
                businessName="Sri Jayam Glass House" 
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
    subHeader: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1E293B',
        marginBottom: 16,
    },
    galleryList: {
        flexDirection: 'column',
        gap: 16,
    },
    galleryItem: {
        width: '100%',
        height: 220,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#F8FAFC',
        elevation: 4,
        shadowColor: '#0EA5E9',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    galleryImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
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

export default SriJeyamServiceDetailScreen;
