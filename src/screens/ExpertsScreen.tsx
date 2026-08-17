import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Dimensions, ScrollView, ActivityIndicator, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { checkSessionAndNavigate } from '../utils/auth';
import { triggerCall } from '../utils/callTracker';
import { API_ENDPOINTS } from '../utils/api';

const { width } = Dimensions.get('window');

const EXPERTS_DATA = [
    {
        id: 'skyline',
        name: 'Skyline Team',
        job: 'Construction & Interior',
        rating: '4.8',
        reviews: 450,
        experience: '10 years',
        image: require('../assets/images/skyline_construction.png'),
        tags: ['Construction', 'Interior', 'Painting', 'Builders'],
        phone: '8754944026',
    },
    {
        id: 'hindi',
        name: 'Surendar J',
        job: 'Master Hindi Trainer',
        rating: '4.9',
        reviews: 280,
        experience: '8 years',
        image: require('../assets/images/hindi_cover.png'),
        tags: ['Hindi', 'Language', 'Speaking', 'Education'],
        phone: '6397255377',
    },
    {
        id: 'woodzone',
        name: 'Wood Zone',
        job: 'Tiles & furniture Expert',
        rating: '4.9',
        reviews: 580,
        experience: '11 years',
        image: require('../assets/images/skyline_modular_4.png'),
        tags: ['Tiles', 'Furniture', 'Interior Decor', 'Flooring'],
        phone: '9092743053',
    },
    {
        id: 'thiran',
        name: 'Manickavasagar',
        job: 'IT & Software Expert',
        rating: '5.0',
        reviews: 150,
        experience: '12 years',
        image: require('../assets/images/thiran360ai_logo.png'),
        tags: ['IT & Software', 'App Development', 'AI Solutions', 'Cloud'],
        phone: '7708805630',
    },
    {
        id: 'manojsteels',
        name: 'ManojKumar anandhan',
        job: 'Building Materials Specialist',
        rating: '4.9',
        reviews: 340,
        experience: '12 years',
        image: require('../assets/images/portfolio/manojsteels/manojsteels_hero.png'),
        tags: ['Construction', 'Cement', 'TMT Bars', 'Building Blocks'],
        phone: '9994488447',
    },
    {
        id: 'mejestic',
        name: 'K. Arun (Majastic Studio)',
        job: 'Professional Photographer',
        rating: '4.9',
        reviews: 290,
        experience: '14 years',
        image: 'https://images.unsplash.com/photo-1554080353-a576cf803bda?q=80&w=400&auto=format&fit=crop',
        tags: ['Photography', 'Photo Studio', 'Wedding Shoots', 'Portraits'],
        phone: '9791797777',
    },
    {
        id: 'ganagathara',
        name: 'S. Senthilkumar',
        job: 'Electrical & Hardware Expert',
        rating: '4.9',
        reviews: 205,
        experience: '8 years',
        image: require('../assets/images/portfolio/ganagathara/hero.png'),
        tags: ['Electricals', 'Hardwares', 'Fittings', 'Wires'],
        phone: '9790629888',
    },
    {
        id: 'srijeyam',
        name: 'C. Prakash',
        job: 'Glass & UPVC Expert',
        rating: '4.9',
        reviews: 180,
        experience: '12 years',
        image: require('../assets/images/portfolio/srijeyam/hero.png'),
        tags: ['Glass', 'UPVC', 'Ceiling', 'Aluminum'],
        phone: '6374822433',
    },
    {
        id: 'abirami',
        name: 'Prabhu & Manikandan',
        job: 'Stationeries & Printing',
        rating: '4.8',
        reviews: 210,
        experience: '20+ years',
        image: require('../assets/images/portfolio/abirami/hero.png'),
        tags: ['Stationeries', 'Printing', 'Books', 'Office Supplies'],
        phone: '9842940548',
    },
    {
        id: 'swaraj',
        name: 'Saravanan',
        job: 'Tractor Sales & Service Expert',
        rating: '4.8',
        reviews: 215,
        experience: '10 years',
        image: require('../assets/images/portfolio/swaraj/hero.jpg'),
        tags: ['Tractors', 'Sales', 'Service', 'Swaraj', 'Smart Auto'],
        phone: '9489359090',
    },
    {
        id: 'sunpower',
        name: 'Jc S.R.S. Prabakaran',
        job: 'Solar & Water RO Specialist',
        rating: '4.9',
        reviews: 320,
        experience: '22 years',
        image: require('../assets/images/portfolio/sunpower/ro_system.png'),
        tags: ['Solar', 'Water RO', 'UPS', 'Batteries', 'Smart Auto'],
        phone: '9865088885',
    },
    {
        id: 'sakthi',
        name: 'Sri Sakthi Team',
        job: 'Electrical & Electronics Expert',
        rating: '4.9',
        reviews: 410,
        experience: '15 years',
        image: require('../assets/images/sakthi_hero.png'),
        tags: ['Electrical', 'Electronics', 'Repair', 'Service', 'Smart Auto'],
        phone: '6383816267',
    }
];

type ParamList = {
    Experts: { filter?: string; categoryId?: number };
};

interface UnifiedExpert {
    id: string;
    name: string;
    job: string;
    rating: string;
    reviews: number;
    experience: string;
    image: any;
    tags: string[];
    phone: string;
    isDynamic?: boolean;
    rawApiData?: any;
}

const STATIC_CATEGORY_MAP: { [key: string]: string[] } = {
    'CONSTRUCTIONS & RELATED WORKS': ['skyline', 'woodzone', 'manojsteels', 'srijeyam'],
    'IT CONCERNS': ['thiran'],
    'HARDWARE & ELECTRONICS': ['ganagathara', 'sakthi', 'sunpower'],
    'STUDIO / PRINTING WORKS': ['mejestic', 'abirami'],
    'VEHICLE SERVICES': ['swaraj'],
    'SCHOOL / ACADEMY': ['hindi'],
    'STATIONARIES': ['abirami'],
};

const ExpertsScreen = () => {
    const { t } = useTranslation();
    const navigation = useNavigation<any>();
    const route = useRoute<RouteProp<ParamList, 'Experts'>>();
    
    const [selectedFilter, setSelectedFilter] = useState('__ALL__');
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [searchFilter, setSearchFilter] = useState<string | null>(null);
    const [categories, setCategories] = useState<any[]>([]);
    const [unifiedExperts, setUnifiedExperts] = useState<UnifiedExpert[]>([]);
    const [loading, setLoading] = useState(true);

    const dynamicFilters = [
        { key: '__ALL__', label: t('experts.filter_all'), id: null },
        ...categories.map(cat => ({
            key: cat.name || cat.category_name,
            label: cat.name || cat.category_name,
            id: cat.id
        }))
    ];

    const fetchExpertsData = async (catId: number | null, searchStr: string | null, currentCats?: any[]) => {
        try {
            setLoading(true);
            const url = catId !== null 
                ? API_ENDPOINTS.categoryExperts(catId) 
                : API_ENDPOINTS.experts;

            const response = await fetch(url, {
                headers: {
                    'ngrok-skip-browser-warning': 'true',
                    'Accept': 'application/json',
                },
            });
            let dynamicData: UnifiedExpert[] = [];

            if (response.ok) {
                const apiData = await response.json();
                dynamicData = apiData.map((expert: any): UnifiedExpert => ({
                    id: `dyn_${expert.id}`,
                    name: expert.expert_name,
                    job: expert.category,
                    rating: '5.0',
                    reviews: 120,
                    experience: 'Professional',
                    image: expert.logo || expert.expert_image, // Use logo if available, fallback to expert_image
                    tags: [expert.badge || 'Expert'],
                    phone: expert.contact_number,
                    isDynamic: true,
                    rawApiData: expert
                }));
            }

            // Determine matching static experts
            let staticList = EXPERTS_DATA;
            if (catId !== null) {
                const activeCategoriesList = currentCats || categories;
                const categoryObj = activeCategoriesList.find(c => c.id === catId);
                const categoryName = categoryObj ? (categoryObj.name || categoryObj.category_name) : '';
                const allowedIds = STATIC_CATEGORY_MAP[categoryName] || [];
                staticList = EXPERTS_DATA.filter(exp => allowedIds.includes(exp.id));
            }

            let combined = [...dynamicData, ...staticList];

            // Apply search string filter if present
            if (searchStr) {
                const lowSearch = searchStr.toLowerCase();
                combined = combined.filter(expert => 
                    expert.name.toLowerCase().includes(lowSearch) ||
                    expert.job.toLowerCase().includes(lowSearch) ||
                    expert.tags.some(tag => tag.toLowerCase().includes(lowSearch))
                );
            }

            if (catId !== null) {
                const activeCategoriesList = currentCats || categories;
                const categoryObj = activeCategoriesList.find(c => c.id === catId);
                const categoryName = categoryObj ? (categoryObj.name || categoryObj.category_name) : '';
                if (categoryName === 'IT CONCERNS') {
                    combined.sort((a, b) => {
                        const aIsManick = a.id === 'thiran' || a.name.toLowerCase().includes('manickavasagar');
                        const bIsManick = b.id === 'thiran' || b.name.toLowerCase().includes('manickavasagar');
                        if (aIsManick && !bIsManick) return -1;
                        if (!aIsManick && bIsManick) return 1;
                        return 0;
                    });
                }
            }

            setUnifiedExperts(combined);
        } catch (err) {
            console.error('Failed to fetch dynamic experts, loading matching static only.', err);
            let staticList = EXPERTS_DATA;
            if (catId !== null) {
                const activeCategoriesList = currentCats || categories;
                const categoryObj = activeCategoriesList.find(c => c.id === catId);
                const categoryName = categoryObj ? (categoryObj.name || categoryObj.category_name) : '';
                const allowedIds = STATIC_CATEGORY_MAP[categoryName] || [];
                staticList = EXPERTS_DATA.filter(exp => allowedIds.includes(exp.id));
            }
            if (searchStr) {
                const lowSearch = searchStr.toLowerCase();
                staticList = staticList.filter(expert => 
                    expert.name.toLowerCase().includes(lowSearch) ||
                    expert.job.toLowerCase().includes(lowSearch) ||
                    expert.tags.some(tag => tag.toLowerCase().includes(lowSearch))
                );
            }

            if (catId !== null) {
                const activeCategoriesList = currentCats || categories;
                const categoryObj = activeCategoriesList.find(c => c.id === catId);
                const categoryName = categoryObj ? (categoryObj.name || categoryObj.category_name) : '';
                if (categoryName === 'IT CONCERNS') {
                    staticList.sort((a, b) => {
                        const aIsManick = a.id === 'thiran' || a.name.toLowerCase().includes('manickavasagar');
                        const bIsManick = b.id === 'thiran' || b.name.toLowerCase().includes('manickavasagar');
                        if (aIsManick && !bIsManick) return -1;
                        if (!aIsManick && bIsManick) return 1;
                        return 0;
                    });
                }
            }

            setUnifiedExperts(staticList);
        } finally {
            setLoading(false);
        }
    };

    // Track last-fetched params to avoid duplicate fetches on focus
    const lastParamsRef = useRef<{ categoryId?: number | string; filter?: string }>({});

    const loadInitialData = useCallback(async () => {
        try {
            setLoading(true);
            // 1. Fetch categories list
            const catRes = await fetch(API_ENDPOINTS.expertCategories, {
                headers: {
                    'ngrok-skip-browser-warning': 'true',
                    'Accept': 'application/json',
                },
            });
            let loadedCategories: any[] = [];
            if (catRes.ok) {
                loadedCategories = await catRes.json();
                setCategories(loadedCategories);
            }

            // 2. Resolve initial category selection from route params
            let initialCatId: number | null = null;
            let initialFilterText = '__ALL__';
            let initialSearchFilter: string | null = null;

            const routeCategoryId = route.params?.categoryId;
            const routeFilter = route.params?.filter;

            if (routeCategoryId !== undefined && routeCategoryId !== null) {
                // Direct category ID from Dashboard tap — most reliable path
                const numId = Number(routeCategoryId);
                initialCatId = numId;
                const matchedCat = loadedCategories.find(
                    (c: any) => Number(c.id) === numId
                );
                if (matchedCat) {
                    initialFilterText = matchedCat.name || matchedCat.category_name;
                }
            } else if (routeFilter) {
                const legacyKeyMap: { [key: string]: string } = {
                    'smart_auto': 'HARDWARE & ELECTRONICS',
                    'robotics': 'HARDWARE & ELECTRONICS',
                    'electronics': 'HARDWARE & ELECTRONICS',
                    'upvc_nets': 'CONSTRUCTIONS & RELATED WORKS',
                    'tiles_furn': 'CONSTRUCTIONS & RELATED WORKS',
                    'cctv_net': 'HARDWARE & ELECTRONICS',
                    'hindi': 'SCHOOL / ACADEMY',
                    'construction': 'CONSTRUCTIONS & RELATED WORKS',
                    'painting': 'CONSTRUCTIONS & RELATED WORKS',
                    'carpentry': 'CONSTRUCTIONS & RELATED WORKS',
                    'plumbing': 'CONSTRUCTIONS & RELATED WORKS',
                    'electrical': 'HARDWARE & ELECTRONICS',
                    'cleaning': 'CONSTRUCTIONS & RELATED WORKS',
                    'ac_repair': 'IT CONCERNS',
                    'roofing': 'CONSTRUCTIONS & RELATED WORKS',
                    'More': '__ALL__'
                };

                const resolvedFilter = legacyKeyMap[routeFilter] || routeFilter;

                // Match dynamic category by name
                const matchedCat = loadedCategories.find((c: any) => {
                    const cName = (c.name || c.category_name || '').toLowerCase();
                    const rFilter = resolvedFilter.toLowerCase();
                    return cName === rFilter || cName.includes(rFilter) || rFilter.includes(cName);
                });

                if (matchedCat) {
                    initialCatId = matchedCat.id;
                    initialFilterText = matchedCat.name || matchedCat.category_name;
                } else if (resolvedFilter !== '__ALL__') {
                    initialCatId = null;
                    initialFilterText = '__ALL__';
                    initialSearchFilter = resolvedFilter;
                }
            }

            setSelectedCategoryId(initialCatId);
            setSelectedFilter(initialFilterText);
            setSearchFilter(initialSearchFilter);

            // 3. Fetch experts
            await fetchExpertsData(initialCatId, initialSearchFilter, loadedCategories);
        } catch (err) {
            console.error('Failed to load initial data:', err);
            setUnifiedExperts([...EXPERTS_DATA]);
            setLoading(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [route.params?.categoryId, route.params?.filter]);

    // Re-run every time this screen gains focus — ensures params from Dashboard are applied
    // even when the Experts tab was already mounted (bottom tabs stay mounted).
    useFocusEffect(
        useCallback(() => {
            const currentCatId = route.params?.categoryId;
            const currentFilter = route.params?.filter;
            const prev = lastParamsRef.current;
            if (prev.categoryId !== currentCatId || prev.filter !== currentFilter) {
                lastParamsRef.current = { categoryId: currentCatId, filter: currentFilter };
                loadInitialData();
            }
        }, [route.params?.categoryId, route.params?.filter, loadInitialData])
    );

    // Initial mount load
    useEffect(() => {
        lastParamsRef.current = {
            categoryId: route.params?.categoryId,
            filter: route.params?.filter,
        };
        loadInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleFilterPress = async (filterItem: { key: string; label: string; id: number | null }) => {
        setSelectedFilter(filterItem.key);
        setSelectedCategoryId(filterItem.id);
        setSearchFilter(null);
        await fetchExpertsData(filterItem.id, null);
    };

    const filteredData = React.useMemo(() => {
        if (!searchFilter) return unifiedExperts;
        const lowSearch = searchFilter.toLowerCase();
        return unifiedExperts.filter(expert => 
            (expert.name && expert.name.toLowerCase().includes(lowSearch)) ||
            (expert.job && expert.job.toLowerCase().includes(lowSearch)) ||
            (expert.tags && expert.tags.some(tag => tag.toLowerCase().includes(lowSearch)))
        );
    }, [unifiedExperts, searchFilter]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} activeOpacity={0.7}>
                        <View style={styles.backIconBg}>
                            <Icon name="arrow-left" size={24} color="#0F172A" />
                        </View>
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.headerTitle}>{t('experts.header_title')}</Text>
                        <Text style={styles.headerSubtitle}>{t('experts.header_subtitle')}</Text>
                    </View>
                </View>
            </View>

            {/* Search Bar */}
            <View style={styles.searchBarContainer}>
                <Icon name="magnify" size={22} color="#94A3B8" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder={t('dashboard.search_placeholder', { defaultValue: 'Search experts by name, category, or skills...' })}
                    placeholderTextColor="#94A3B8"
                    value={searchFilter || ''}
                    onChangeText={(text) => {
                        setSearchFilter(text);
                        // Filter is applied locally in render so we don't spam the API
                    }}
                />
                {searchFilter ? (
                    <TouchableOpacity onPress={() => setSearchFilter('')} style={styles.clearSearchBtn}>
                        <Icon name="close-circle" size={20} color="#94A3B8" />
                    </TouchableOpacity>
                ) : null}
            </View>

            <View style={styles.filterContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
                    {dynamicFilters.map((filter, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.filterChip,
                                selectedFilter === filter.key && styles.filterChipActive
                            ]}
                            onPress={() => handleFilterPress(filter)}
                        >
                            <Text style={[
                                styles.filterChipText,
                                selectedFilter === filter.key && styles.filterChipTextActive
                            ]}>
                                {filter.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {loading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#3B82F6" />
                </View>
            ) : (
                <FlatList
                    data={filteredData}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => {
                        const handlePress = () => {
                            if (item.isDynamic && item.rawApiData) {
                                checkSessionAndNavigate(navigation, () => {
                                    navigation.navigate('DynamicExpertServices', {
                                        expertId: item.rawApiData.id,
                                        expertName: item.rawApiData.expert_name,
                                        expertImage: item.rawApiData.expert_image,
                                        category: item.rawApiData.category,
                                        phone: item.rawApiData.contact_number,
                                        initialServices: item.rawApiData.services
                                    });
                                });
                            } else {
                                if (item.id === 'ganagathara') {
                                    checkSessionAndNavigate(navigation, () => navigation.navigate('GanagatharaPortfolio'));
                                } else if (item.id === 'srijeyam') {
                                    checkSessionAndNavigate(navigation, () => navigation.navigate('SriJeyamPortfolio'));
                                } else if (item.id === 'abirami') {
                                    checkSessionAndNavigate(navigation, () => navigation.navigate('AbiramiPortfolio'));
                                } else if (item.id === 'swaraj') {
                                    checkSessionAndNavigate(navigation, () => navigation.navigate('SwarajTractorPortfolio'));
                                } else if (item.id === 'sunpower') {
                                    checkSessionAndNavigate(navigation, () => navigation.navigate('SunPowerPortfolio'));
                                } else if (item.id === 'sakthi') {
                                    checkSessionAndNavigate(navigation, () => navigation.navigate('SakthiElectricalsPortfolio'));
                                } else if (item.id === 'mejestic') {
                                    checkSessionAndNavigate(navigation, () => navigation.navigate('MejesticStudioPortfolio'));
                                } else if (item.id === 'skyline') {
                                    checkSessionAndNavigate(navigation, () => navigation.navigate('SkylinePortfolio'));
                                } else if (item.id === 'woodzone') {
                                    checkSessionAndNavigate(navigation, () => navigation.navigate('WoodZonePortfolio'));
                                } else if (item.id === 'manojsteels') {
                                    checkSessionAndNavigate(navigation, () => navigation.navigate('ManojSteelsPortfolio'));
                                } else if (item.id === 'thiran') {
                                    checkSessionAndNavigate(navigation, () => navigation.navigate('Thiran360AIPortfolio'));
                                } else if (item.id === 'hindi') {
                                    checkSessionAndNavigate(navigation, () => navigation.navigate('SpokenHindiPortfolio'));
                                }
                            }
                        };
                        
                        return (
                            <TouchableOpacity style={styles.expertCard} onPress={handlePress} activeOpacity={0.9}>
                                <View style={styles.cardMain}>
                                    <View style={styles.imageContainer}>
                                        <Image 
                                            source={typeof item.image === 'string' ? { uri: item.image } : item.image} 
                                            style={styles.expertImage} 
                                            resizeMode="cover"
                                            resizeMethod="resize"
                                        />
                                        <View style={styles.verifiedBadge}>
                                            <Icon name="check-decagram" size={14} color="#3B82F6" />
                                        </View>
                                    </View>

                                    <View style={styles.infoContainer}>
                                        <View style={styles.nameRow}>
                                            <Text style={styles.expertName} numberOfLines={1}>
                                                {item.isDynamic ? item.name : t(`dashboard.experts.${item.id}_name`, item.name)}
                                            </Text>
                                        </View>

                                        <Text style={styles.expertJob} numberOfLines={1}>
                                            {item.isDynamic ? item.job : t(`dashboard.experts.${item.id}_job`, item.job)}
                                        </Text>

                                        <View style={styles.metaRow}>
                                            <Icon name="briefcase-outline" size={14} color="#64748B" />
                                            <Text style={styles.metaText}>{item.experience} {item.isDynamic ? '' : t('experts.exp_label')}</Text>
                                            <View style={styles.dot} />
                                            <Icon name="star" size={14} color="#F59E0B" />
                                            <Text style={styles.ratingText}>{item.rating}</Text>
                                        </View>

                                        <View style={styles.tagContainer}>
                                            {item.tags.map((tag, idx) => (
                                                <View key={idx} style={styles.tag}>
                                                    <Text style={styles.tagText}>{tag}</Text>
                                                </View>
                                            ))}
                                        </View>
                                    </View>
                                </View>

                                <TouchableOpacity
                                    style={styles.hireButton}
                                    onPress={() => checkSessionAndNavigate(navigation, () => triggerCall(item.phone, item.name, item.id))}
                                >
                                    <Text style={styles.hireButtonText}>{t('experts.book_appointment')}</Text>
                                </TouchableOpacity>
                            </TouchableOpacity>
                        );
                    }}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    header: {
        padding: 24,
        paddingTop: 40,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    backButton: {
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    backIconBg: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    filterContainer: {
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        marginHorizontal: 16,
        marginTop: 12,
        marginBottom: 4,
        paddingHorizontal: 12,
        borderRadius: 16,
        height: 48,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: '#1E293B',
        fontWeight: '500',
    },
    clearSearchBtn: {
        padding: 4,
    },
    filterScroll: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 10,
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F1F5F9',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    filterChipActive: {
        backgroundColor: '#EFF6FF',
        borderColor: '#3B82F6',
    },
    filterChipText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#64748B',
        lineHeight: 21,
    },
    filterChipTextActive: {
        color: '#3B82F6',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#1E293B',
        lineHeight: 35,
    },
    headerSubtitle: {
        fontSize: 13,
        color: '#64748B',
        marginTop: 4,
        fontWeight: '500',
        lineHeight: 21,
    },
    listContainer: {
        padding: 16,
        gap: 16,
        paddingBottom: 100, // Extra space for tab bar
    },
    expertCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 16,
        shadowColor: '#64748B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    cardMain: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    imageContainer: {
        position: 'relative',
    },
    expertImage: {
        width: 80,
        height: 80,
        borderRadius: 20,
        backgroundColor: '#F1F5F9',
    },
    verifiedBadge: {
        position: 'absolute',
        top: -6,
        left: -6,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    infoContainer: {
        flex: 1,
        marginLeft: 16,
        justifyContent: 'center',
    },
    nameRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    expertName: {
        fontSize: 16,
        fontWeight: '800',
        color: '#1E293B',
        lineHeight: 26,
        flex: 1,
    },
    expertJob: {
        fontSize: 13,
        color: '#3B82F6',
        fontWeight: '700',
        marginBottom: 8,
        lineHeight: 21,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    metaText: {
        fontSize: 11,
        color: '#64748B',
        fontWeight: '600',
        marginLeft: 4,
        lineHeight: 18,
    },
    ratingText: {
        fontSize: 11,
        color: '#D97706',
        fontWeight: '800',
        marginLeft: 4,
    },
    dot: {
        width: 3,
        height: 3,
        borderRadius: 1.5,
        backgroundColor: '#CBD5E1',
        marginHorizontal: 8,
    },
    tagContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    tag: {
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    tagText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#475569',
        textTransform: 'uppercase',
        lineHeight: 17,
    },
    hireButton: {
        backgroundColor: '#1E293B',
        borderRadius: 16,
        paddingVertical: 12,
        alignItems: 'center',
    },
    hireButtonText: {
        color: '#FFFFFF',
        fontWeight: '800',
        fontSize: 15,
        lineHeight: 26,
    },
});

export default ExpertsScreen;
