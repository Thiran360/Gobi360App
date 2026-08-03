import React, { useEffect, useRef, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    StatusBar,
    FlatList,
    Animated,
    Easing,
    RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';

type RootStackParamList = {
    ServiceCategory: { category: string; icon: string; color: string; bg: string };
};

type Props = NativeStackScreenProps<RootStackParamList, 'ServiceCategory'>;

const { width, height } = Dimensions.get('window');

const SUB_SERVICE_PRICES = [
    { id: 1, priceKey: 'standard', price: '₹299', time: '1 hr' },
    { id: 2, priceKey: 'deep_repair', price: '₹799', time: '3 hrs' },
    { id: 3, priceKey: 'installation', price: '₹999', time: '2 hrs' },
    { id: 4, priceKey: 'maintenance', price: '₹499', time: '1.5 hrs' },
];

const ServiceCategoryScreen = ({ route, navigation }: Props) => {
    const { t } = useTranslation();
    const { category, icon, color, bg } = route.params;

    const SUB_SERVICES = SUB_SERVICE_PRICES.map(s => ({
        ...s,
        name: t(`service_category.services.${s.priceKey}`),
        desc: t(`service_category.services.${s.priceKey}_desc`),
    }));
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 2000);
    };

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideUpAnim = useRef(new Animated.Value(30)).current;
    const headerScale = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.timing(slideUpAnim, {
                toValue: 0,
                duration: 600,
                easing: Easing.out(Easing.back(1)),
                useNativeDriver: true,
            }),
            Animated.spring(headerScale, {
                toValue: 1,
                friction: 8,
                tension: 40,
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    const renderHeader = () => (
        <Animated.View style={[
            styles.header,
            {
                backgroundColor: bg,
                opacity: fadeAnim,
                transform: [{ scale: headerScale }]
            }
        ]}>
            <View style={styles.headerTop}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="arrow-left" size={24} color="#1E293B" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.shareButton}>
                    <Icon name="share-variant-outline" size={24} color="#1E293B" />
                </TouchableOpacity>
            </View>
            <View style={styles.headerContent}>
                <Animated.View style={[
                    styles.iconContainer,
                    {
                        backgroundColor: '#FFFFFF',
                        transform: [{ scale: headerScale }]
                    }
                ]}>
                    <Icon name={icon} size={48} color={color} />
                </Animated.View>
                <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>{category}</Animated.Text>
                <Animated.Text style={[styles.subtitle, { opacity: fadeAnim }]}>{t('service_category.subtitle')}</Animated.Text>

                <Animated.View style={[styles.badgeRow, { opacity: fadeAnim, transform: [{ translateY: slideUpAnim }] }]}>
                    <View style={styles.badge}>
                        <Icon name="star" size={14} color="#F59E0B" />
                        <Text style={styles.badgeText}>{t('service_category.rating_badge')}</Text>
                    </View>
                    <View style={styles.badge}>
                        <Icon name="shield-check" size={14} color="#10B981" />
                        <Text style={styles.badgeText}>{t('service_category.verified_badge')}</Text>
                    </View>
                </Animated.View>
            </View>
        </Animated.View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
            <ScrollView 
                showsVerticalScrollIndicator={false} 
                stickyHeaderIndices={[0]}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#3B82F6']}
                        tintColor="#3B82F6"
                    />
                }
            >
                {renderHeader()}

                <Animated.View style={[
                    styles.content,
                    {
                        opacity: fadeAnim,
                        transform: [{ translateY: slideUpAnim }]
                    }
                ]}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>{t('service_category.available_services')}</Text>
                        <TouchableOpacity>
                            <Text style={styles.seeAllText}>{t('service_category.filter')}</Text>
                        </TouchableOpacity>
                    </View>

                    {SUB_SERVICES.map((item, index) => (
                        <Animated.View
                            key={item.id}
                            style={{
                                opacity: fadeAnim,
                                transform: [{ translateY: slideUpAnim }]
                            }}
                        >
                            <TouchableOpacity style={styles.serviceCard}>
                                <View style={styles.serviceInfo}>
                                    <Text style={styles.serviceName}>{item.name}</Text>
                                    <Text style={styles.serviceDesc}>{item.desc}</Text>
                                    <View style={styles.serviceMeta}>
                                        <View style={styles.metaItem}>
                                            <Icon name="clock-outline" size={14} color="#64748B" />
                                            <Text style={styles.metaText}>{item.time}</Text>
                                        </View>
                                        <View style={styles.metaItem}>
                                            <Icon name="tag-outline" size={14} color="#10B981" />
                                            <Text style={[styles.metaText, { color: '#10B981' }]}>{t('service_category.free_consultation')}</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.priceContainer}>
                                    <Text style={styles.price}>{item.price}</Text>
                                    <TouchableOpacity style={styles.addButton}>
                                        <Text style={styles.addButtonText}>{t('service_category.add')}</Text>
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        </Animated.View>
                    ))}

                    <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: headerScale }] }}>
                        <View style={styles.promoBanner}>
                            <View style={styles.promoContent}>
                                <Text style={styles.promoTitle}>{t('service_category.promo_title')}</Text>
                                <Text style={styles.promoDesc}>{t('service_category.promo_desc')}</Text>
                                <TouchableOpacity style={styles.promoButton}>
                                    <Text style={styles.promoButtonText}>{t('service_category.explore_plans')}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.promoIconBg, { backgroundColor: color }]}>
                                <Icon name="brightness-percent" size={40} color="#FFFFFF" />
                            </View>
                        </View>
                    </Animated.View>

                    <Animated.View style={{ opacity: fadeAnim }}>
                        <Text style={styles.sectionTitle}>{t('service_category.recommended_experts')}</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.expertsScroll}>
                            {[1, 2, 3].map((i) => (
                                <TouchableOpacity key={i} style={styles.expertCardMini}>
                                    <View style={styles.expertAvatar} />
                                    <View style={styles.expertInfoMini}>
                                        <Text style={styles.expertName}>{t('service_category.expert_name')} {i}</Text>
                                        <View style={styles.expertRating}>
                                            <Icon name="star" size={12} color="#F59E0B" />
                                            <Text style={styles.expertRatingText}>4.9 (120+)</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </Animated.View>
                </Animated.View>

            </ScrollView>

            <View style={styles.footer}>
                <View>
                    <Text style={styles.footerLabel}>{t('service_category.starting_from')}</Text>
                    <Text style={styles.footerPrice}>₹299</Text>
                </View>
                <TouchableOpacity
                    style={[styles.bookButton, { backgroundColor: color || '#3B82F6' }]}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.bookButtonText}>{t('service_category.book_appointment')}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        paddingTop: StatusBar.currentHeight || 50,
        paddingBottom: 30,
        paddingHorizontal: 24,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    shareButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    headerContent: {
        alignItems: 'center',
    },
    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: '#1E293B',
        marginBottom: 8,
        lineHeight: 54,
        includeFontPadding: false,
    },
    subtitle: {
        fontSize: 14,
        color: '#64748B',
        fontWeight: '600',
        marginBottom: 20,
        lineHeight: 24,
        includeFontPadding: false,
    },
    badgeRow: {
        flexDirection: 'row',
        gap: 12,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    badgeText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#334155',
        lineHeight: 18,
        includeFontPadding: false,
    },
    content: {
        padding: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1E293B',
        lineHeight: 29,
        includeFontPadding: false,
    },
    seeAllText: {
        color: '#3B82F6',
        fontWeight: '700',
        lineHeight: 24,
        includeFontPadding: false,
    },
    serviceCard: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 2,
    },
    serviceInfo: {
        flex: 1,
        marginRight: 12,
    },
    serviceName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: 4,
        lineHeight: 26,
        includeFontPadding: false,
    },
    serviceDesc: {
        fontSize: 12,
        color: '#64748B',
        lineHeight: 19,
        marginBottom: 12,
        includeFontPadding: false,
    },
    serviceMeta: {
        flexDirection: 'row',
        gap: 12,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metaText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#64748B',
        lineHeight: 16,
        includeFontPadding: false,
    },
    priceContainer: {
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
    price: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1E293B',
        lineHeight: 29,
        includeFontPadding: false,
    },
    addButton: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    addButtonText: {
        color: '#3B82F6',
        fontWeight: '800',
        fontSize: 12,
        lineHeight: 19,
        includeFontPadding: false,
    },
    promoBanner: {
        flexDirection: 'row',
        backgroundColor: '#1E293B',
        borderRadius: 24,
        padding: 24,
        marginTop: 10,
        marginBottom: 32,
        alignItems: 'center',
    },
    promoContent: {
        flex: 1,
    },
    promoTitle: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: '900',
        marginBottom: 4,
        lineHeight: 32,
        includeFontPadding: false,
    },
    promoDesc: {
        color: '#94A3B8',
        fontSize: 13,
        fontWeight: '500',
        marginBottom: 16,
        lineHeight: 21,
        includeFontPadding: false,
    },
    promoButton: {
        backgroundColor: '#3B82F6',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 10,
        alignSelf: 'flex-start',
    },
    promoButtonText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 12,
        lineHeight: 21,
        includeFontPadding: false,
    },
    promoIconBg: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.8,
    },
    expertsScroll: {
        marginTop: 16,
        marginBottom: 20,
    },
    expertCardMini: {
        padding: 12,
        backgroundColor: '#F8FAFC',
        borderRadius: 20,
        marginRight: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        width: 180,
    },
    expertAvatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#E2E8F0',
    },
    expertInfoMini: {
        flex: 1,
    },
    expertName: {
        fontSize: 12,
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: 2,
        lineHeight: 19,
        includeFontPadding: false,
    },
    expertRating: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    expertRatingText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#64748B',
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 16,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
        minHeight: 90,
    },
    footerLabel: {
        fontSize: 12,
        color: '#64748B',
        fontWeight: '600',
    },
    footerPrice: {
        fontSize: 24,
        fontWeight: '900',
        color: '#1E293B',
    },
    bookButton: {
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 16,
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    bookButtonText: {
        color: '#FFFFFF',
        fontWeight: '800',
        fontSize: 15,
        lineHeight: 24,
        includeFontPadding: false,
    },
});

export default ServiceCategoryScreen;
