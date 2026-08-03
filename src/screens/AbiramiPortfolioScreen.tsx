import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Platform,
    StatusBar,
    Dimensions,
    ScrollView,
    Animated,
    Linking,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import React, { useRef } from 'react';
import FloatingCartButton from '../components/FloatingCartButton';
import { useTranslation } from 'react-i18next';
import FloatingContactButtons from '../components/FloatingContactButtons';

import { checkSessionAndNavigate } from '../utils/auth';
import { triggerCall } from '../utils/callTracker';

const { width, height } = Dimensions.get('window');

const AbiramiPortfolioScreen = ({ navigation }: any) => {
    const { t } = useTranslation();
    const scrollY = useRef(new Animated.Value(0)).current;

    const handleCallPrimary = () => {
        checkSessionAndNavigate(navigation, () => {
            triggerCall('9842940548', 'Sri Abirami Book Binding (Primary)');
        });
    };

    const handleCallSecondary = () => {
        checkSessionAndNavigate(navigation, () => {
            triggerCall('8667704165', 'Sri Abirami Book Binding (Secondary)');
        });
    };

    const handleWhatsApp = () => {
        checkSessionAndNavigate(navigation, () => {
            const msg = 'Hi Sri Abirami Book Binding Works, I found you on the Service App and need some stationery/printing services.';
            Linking.openURL(`whatsapp://send?phone=919842940548&text=${encodeURIComponent(msg)}`);
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
                    source={require('../assets/images/portfolio/abirami/hero.png')}
                    style={[styles.heroImg, { transform: [{ scale: headerScale }] }]}
                    resizeMode="cover"
                />
                <Animated.View style={[styles.heroOverlay, { opacity: headerOpacity }]}>
                    <View style={styles.badgeRow}>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>Stationeries & Binding</Text>
                        </View>
                    </View>
                    <View style={styles.heroContent}>
                        <Text style={styles.brandTitle}>Sri Abirami Book Binding Works</Text>
                        <Text style={styles.brandSubtitle}>Wholesale & Retail Stationeries</Text>
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
                                <Icon name="book-open-page-variant" size={36} color="#4F46E5" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.brandLeadTitle}>R. Prabhu & R. Manikandan</Text>
                                <Text style={styles.brandLeadRole}>Owners</Text>
                                <Text style={styles.brandLeadDesc}>59, Near Pariur Corner, Erode Main Road, Gobi.</Text>
                            </View>
                        </View>
                    </View>

                    {/* About Us Section */}
                    <View style={styles.aboutSection}>
                        <Text style={styles.sectionTitle}>About Us</Text>
                        <Text style={styles.aboutText}>
                            Sri Abirami Book Binding Works is your one-stop shop for all premium office and school stationery. We provide top-quality notebooks, calendars, and professional book binding and printing services for all your business and personal needs. Wholesale and Retail options available.
                        </Text>
                        
                        <View style={styles.statsRow}>
                            <View style={styles.statBox}>
                                <Text style={styles.statNumber}>100%</Text>
                                <Text style={styles.statLabel}>Quality</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statBox}>
                                <Text style={styles.statNumber}>Bulk</Text>
                                <Text style={styles.statLabel}>Orders</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statBox}>
                                <Text style={styles.statNumber}>Fast</Text>
                                <Text style={styles.statLabel}>Delivery</Text>
                            </View>
                        </View>
                    </View>

                    {/* Products For Sale & Services */}
                    <Text style={styles.sectionTitle}>Our Products & Services</Text>
                    <View style={styles.servicesGrid}>
                        
                        <View style={styles.serviceCard}>
                            <Image source={{uri: 'https://i.pinimg.com/736x/36/e6/ba/36e6ba5f779d1e7bfcd4c2c3c6e3f32d.jpg'}} style={styles.serviceCardImg} />
                            <Text style={styles.serviceTitle}>Note Books</Text>
                            <Text style={styles.serviceDesc}>High-quality notebooks for schools, colleges, and offices.</Text>
                        </View>
                        
                        <View style={styles.serviceCard}>
                            <Image source={{uri: 'https://i.pinimg.com/1200x/6e/35/af/6e35afdad61c2f665e9acbeae90988af.jpg'}} style={styles.serviceCardImg} />
                            <Text style={styles.serviceTitle}>Stationeries</Text>
                            <Text style={styles.serviceDesc}>Complete range of office and educational stationery supplies.</Text>
                        </View>
                        
                        <View style={styles.serviceCard}>
                            <Image source={{uri: 'https://i.pinimg.com/1200x/37/20/26/372026b0e1874befc8e1d371b5063434.jpg'}} style={styles.serviceCardImg} />
                            <Text style={styles.serviceTitle}>Bill Book</Text>
                            <Text style={styles.serviceDesc}>Custom printed bill books, invoice pads, and receipt books.</Text>
                        </View>
                        
                        <View style={styles.serviceCard}>
                            <Image source={{uri: 'https://i.pinimg.com/1200x/ab/15/e8/ab15e88c2f88160c88b2e70199eae1ad.jpg'}} style={styles.serviceCardImg} />
                            <Text style={styles.serviceTitle}>Calendars</Text>
                            <Text style={styles.serviceDesc}>Daily and Monthly calendars with beautiful designs.</Text>
                        </View>

                        <View style={styles.serviceCard}>
                            <Image source={{uri: 'https://i.pinimg.com/1200x/62/5a/70/625a70d96d2d062ea274dae7b1c6a840.jpg'}} style={styles.serviceCardImg} />
                            <Text style={styles.serviceTitle}>Notices & Flyers</Text>
                            <Text style={styles.serviceDesc}>Professional offset printing for marketing notices and flyers.</Text>
                        </View>

                        <View style={styles.serviceCard}>
                            <View style={styles.serviceIconWrap}>
                                <Icon name="book-open-blank-variant" size={24} color="#4F46E5" />
                            </View>
                            <Text style={styles.serviceTitle}>Book Binding</Text>
                            <Text style={styles.serviceDesc}>Professional, durable book binding for records and projects.</Text>
                        </View>

                    </View>

                    {/* Why Choose Us */}
                    <View style={styles.featuresSection}>
                        <Text style={styles.sectionTitle}>Why Choose Us?</Text>
                        <View style={styles.featureItem}>
                            <View style={styles.featureIconWrap}>
                                <Icon name="tag-multiple" size={20} color="#10B981" />
                            </View>
                            <View style={styles.featureContent}>
                                <Text style={styles.featureTitle}>Wholesale & Retail</Text>
                                <Text style={styles.featureDesc}>We provide options for bulk wholesale purchases or retail.</Text>
                            </View>
                        </View>
                        <View style={styles.featureItem}>
                            <View style={styles.featureIconWrap}>
                                <Icon name="printer" size={20} color="#F59E0B" />
                            </View>
                            <View style={styles.featureContent}>
                                <Text style={styles.featureTitle}>Custom Printing</Text>
                                <Text style={styles.featureDesc}>Tailored printing solutions to match your exact business needs.</Text>
                            </View>
                        </View>
                    </View>

                    {/* Business Hours */}
                    <View style={styles.hoursCard}>
                        <View style={styles.hoursHeader}>
                            <Icon name="clock-outline" size={24} color="#FFF" />
                            <Text style={styles.hoursTitle}>Working Hours</Text>
                        </View>
                        <View style={styles.hoursContent}>
                            <View style={styles.hoursRow}>
                                <Text style={styles.hoursDay}>Monday - Saturday</Text>
                                <Text style={styles.hoursTime}>9:00 AM - 8:30 PM</Text>
                            </View>
                            <View style={styles.hoursRow}>
                                <Text style={styles.hoursDay}>Sunday</Text>
                                <Text style={[styles.hoursTime, { color: '#EF4444' }]}>Closed</Text>
                            </View>
                        </View>
                    </View>

                    {/* Contact details callout panel */}
                    <View style={styles.actionCard}>
                        <Text style={styles.actionTitle}>Get Your Stationery Needs Sorted</Text>
                        <View style={styles.contactRow}>
                            <TouchableOpacity style={styles.actionBtnCall} onPress={handleCallPrimary}>
                                <Icon name="phone" size={22} color="#FFF" />
                                <Text style={styles.actionBtnTxt}>Call Prabhu</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionBtnCallAlt} onPress={handleCallSecondary}>
                                <Icon name="phone-outline" size={22} color="#FFF" />
                                <Text style={styles.actionBtnTxt}>Call Manikandan</Text>
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
                phoneNumber="9842940548"
                businessName="Sri Abirami Book Binding"
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
        backgroundColor: '#4F46E5',
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
        backgroundColor: '#4F46E5',
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
        color: '#C7D2FE',
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
        backgroundColor: '#EEF2FF',
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
        backgroundColor: '#4F46E5',
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
    serviceIconWrap: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#EEF2FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
        marginLeft: 12,
        marginBottom: 12,
    },
    brandLeadRole: {
        fontSize: 13,
        color: '#4F46E5',
        fontWeight: '700',
        marginTop: 2,
    },
    aboutSection: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 24,
        marginBottom: 24,
        shadowColor: '#1E293B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    aboutText: {
        fontSize: 14,
        color: '#475569',
        lineHeight: 22,
        marginBottom: 20,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        padding: 16,
        borderRadius: 16,
    },
    statBox: {
        alignItems: 'center',
        flex: 1,
    },
    statNumber: {
        fontSize: 20,
        fontWeight: '900',
        color: '#4F46E5',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#64748B',
        fontWeight: '600',
    },
    statDivider: {
        width: 1,
        height: 30,
        backgroundColor: '#CBD5E1',
    },
    featuresSection: {
        marginBottom: 24,
    },
    featureItem: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        alignItems: 'center',
        shadowColor: '#64748B',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },
    featureIconWrap: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#F8FAFC',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    featureContent: {
        flex: 1,
    },
    featureTitle: {
        fontSize: 15,
        fontWeight: '800',
        color: '#1E293B',
        marginBottom: 4,
    },
    featureDesc: {
        fontSize: 13,
        color: '#64748B',
        lineHeight: 18,
    },
    hoursCard: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        marginBottom: 24,
        overflow: 'hidden',
        shadowColor: '#1E293B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    hoursHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1E293B',
        padding: 16,
        gap: 12,
    },
    hoursTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#FFF',
    },
    hoursContent: {
        padding: 20,
    },
    hoursRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    hoursDay: {
        fontSize: 14,
        color: '#475569',
        fontWeight: '600',
    },
    hoursTime: {
        fontSize: 14,
        color: '#4F46E5',
        fontWeight: '700',
    }
});

export default AbiramiPortfolioScreen;

