import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    StatusBar,
    Dimensions,
    ScrollView,
    TextInput,
    ImageBackground,
    Animated,
    Easing,
    Linking,
    RefreshControl,
    PermissionsAndroid,
    Platform,
    Image,
    FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import VoiceSearchModal from '../components/VoiceSearchModal';
import { triggerCall } from '../utils/callTracker';
import { SERVICE_KEYWORDS, EXPERT_KEYWORDS } from '../utils/searchKeywords';
import { findPortfolioMatches } from '../utils/voiceSearchKeywords';
import { checkSessionAndNavigate } from '../utils/auth';
import AIBotGuide, { AIBotGuideRef } from '../components/AIBotGuide';
import Voice from '@react-native-voice/voice';
import { API_ENDPOINTS } from '../utils/api';
import { BASE_URL } from '../utils/apiConfig';

// Local Assets
const HINDI_ASSET = require('../assets/images/hindi1.png');
const BOT_HUMAN = require('../assets/images/ai_human_male_closed.jpg');

type RootStackParamList = {
    LanguageSelection: undefined;
    LoginSelection: undefined;
    UserLogin: undefined;
    AdminLogin: undefined;
    UserDashboard: undefined;
    AdminDashboard: undefined;
    UserMainTabs: undefined;
    ServiceCategory: { category: string; icon: string; color: string; bg: string };
    SkylinePortfolio: undefined;
    SkylineServiceDetail: { serviceId: number };
    BaasPortfolio: undefined;
    SpokenHindiPortfolio: undefined;
    KaykarPortfolio: undefined;
    WoodZonePortfolio: undefined;
    GVBuildtechPortfolio: undefined;
    ShinePortfolio: undefined;
    Thiran360AIPortfolio: undefined;
    SwarajTractorPortfolio: undefined;
    SunPowerPortfolio: undefined;
    ManojSteelsPortfolio: undefined;
    MejesticStudioPortfolio: undefined;
    SakthiElectricalsPortfolio: undefined;
    GanagatharaPortfolio: undefined;
    SriJeyamPortfolio: undefined;
    AbiramiPortfolio: undefined;
    Experts: { filter?: string };
    SwiggyMainTabs: undefined;
    DynamicExpertServices: { expertId: number; expertName: string; expertImage: string; category: string; phone: string; initialServices?: any[] };
};

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'UserDashboard'>;
};

const { width, height } = Dimensions.get('window');

const SLIDER_IMAGES = [
    'https://i.pinimg.com/736x/3f/69/95/3f69954648606d95f1762f16ce5ebb8c.jpg',
    'https://i.pinimg.com/1200x/7d/96/48/7d964890271b934926094e61b4575b39.jpg',
    'https://i.pinimg.com/736x/3b/80/24/3b8024af9c87e7200c17144ac4c6143c.jpg',
    'https://i.pinimg.com/736x/be/98/65/be986515b9930bfc4ab22b2cc29e6533.jpg',
    'https://i.pinimg.com/1200x/0e/c9/72/0ec972955eed959e1e42fb70e5dacd73.jpg',
    'https://i.pinimg.com/1200x/79/49/c7/7949c7cab56db96786a0adf9f392ac73.jpg',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop',
];

const SERVICE_ICONS = [
    { id: 1, key: 'smart_auto', icon: 'home-automation', color: '#8B5CF6', bg: '#EDE9FE' },
    { id: 2, key: 'robotics', icon: 'robot-outline', color: '#D946EF', bg: '#FCE7F3' },
    { id: 3, key: 'it_software', icon: 'xml', color: '#14B8A6', bg: '#F0FDFA' },
    { id: 4, key: 'upvc_nets', icon: 'window-closed-variant', color: '#3B82F6', bg: '#DBEAFE' },
    { id: 5, key: 'tiles_furn', icon: 'floor-plan', color: '#D97706', bg: '#FEF3C7' },
    { id: 6, key: 'construction', icon: 'office-building', color: '#475569', bg: '#F8FAFC' },
    { id: 7, key: 'cctv_net', icon: 'cctv', color: '#10B981', bg: '#D1FAE5' },
    { id: 8, key: 'hindi', icon: 'alphabet-a', color: '#F59E0B', bg: '#FEF3C7' },
    { id: 9, key: 'carpentry', icon: 'saw-blade', color: '#8B5CF6', bg: '#EDE9FE' },
    { id: 10, key: 'roofing', icon: 'home-roof', color: '#EF4444', bg: '#FEE2E2' },
    { id: 11, key: 'painting', icon: 'format-paint', color: '#EC4899', bg: '#FCE7F3' },
    { id: 12, key: 'electronics', icon: 'chip', color: '#10B981', bg: '#D1FAE5' },
    { id: 13, key: 'swaraj', icon: 'tractor', color: '#D32F2F', bg: '#FEE2E2' },
    { id: 15, key: 'solar_power', icon: 'solar-power', color: '#D97706', bg: '#FEF3C7' },
    { id: 16, key: 'glass_upvc', icon: 'window-closed-variant', color: '#0EA5E9', bg: '#E0F2FE' },
    { id: 17, key: 'stationeries', icon: 'book-open-page-variant', color: '#4F46E5', bg: '#EEF2FF' },
    { id: 18, key: 'electrical', icon: 'lightning-bolt', color: '#EAB308', bg: '#FEF9C3' },
    { id: 19, key: 'food_delivery', icon: 'food-takeout-box', color: '#F97316', bg: '#FFEDD5' },
    { id: 20, key: '3d_printing', icon: 'printer-3d', color: '#14B8A6', bg: '#F0FDFA' },
    { id: 21, key: 'gaming', icon: 'gamepad-variant', color: '#EF4444', bg: '#FEF2F2' },
];

const FEATURED_PORTFOLIOS = [
    {
        id: 'skyline',
        name: 'Skyline Builders & Interiors',
        key: 'skyline',
        screen: 'SkylinePortfolio',
        badgeColor: '#2563EB',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop',
        icon: 'star'
    },
    {
        id: 'hindi',
        name: 'Spoken Hindi Academy',
        key: 'hindi',
        screen: 'SpokenHindiPortfolio',
        badgeColor: '#0EA5E9',
        image: HINDI_ASSET,
        icon: 'translate'
    },
    {
        id: 'srijeyam',
        name: 'Sri Jayam Glass House',
        key: 'srijeyam',
        screen: 'SriJeyamPortfolio',
        badgeColor: '#0EA5E9',
        image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=800&auto=format&fit=crop',
        icon: 'window-closed-variant'
    },
    {
        id: 'gvbuildtech',
        name: 'GV BuildTech Solutions',
        key: 'gvbuildtech',
        screen: 'GVBuildtechPortfolio',
        badgeColor: '#10B981',
        image: require('../assets/images/gv_builtech_dashboard.png'),
        icon: 'domain'
    },
    {
        id: 'woodzone',
        name: 'Wood Zone',
        key: 'woodzone',
        screen: 'WoodZonePortfolio',
        badgeColor: '#D97706',
        image: require('../assets/images/skyline_modular_4.png'),
        icon: 'palette'
    },

    {
        id: 'thiran',
        name: 'THIRAN360AI',
        key: 'thiran',
        screen: 'Thiran360AIPortfolio',
        badgeColor: '#14B8A6',
        image: require('../assets/images/thiran360ai_logo.png'),
        icon: 'robot'
    },
    {
        id: 'swaraj',
        name: 'Saaral Motors Swaraj Tractors',
        key: 'swaraj',
        screen: 'SwarajTractorPortfolio',
        badgeColor: '#D32F2F',
        image: require('../assets/images/portfolio/swaraj/hero.jpg'),
        icon: 'tractor'
    },
    {
        id: 'sunpower',
        name: 'Mega Sun Power Equipments',
        key: 'sunpower',
        screen: 'SunPowerPortfolio',
        badgeColor: '#D97706',
        image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=800&auto=format&fit=crop',
        icon: 'solar-power'
    },
    {
        id: 'manojsteels',
        name: 'Manojsteels',
        key: 'manojsteels',
        screen: 'ManojSteelsPortfolio',
        badgeColor: '#B45309',
        image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=800&auto=format&fit=crop',
        icon: 'warehouse'
    },
    {
        id: 'mejestic',
        name: 'Mejestic Studio',
        key: 'mejestic',
        screen: 'MejesticStudioPortfolio',
        badgeColor: '#FFB300',
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop',
        icon: 'camera-iris'
    },
    {
        id: 'sakthi',
        name: 'Sri Sakthi Electricals & Electronics',
        key: 'sakthi',
        screen: 'SakthiElectricalsPortfolio',
        badgeColor: '#EF4444',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop',
        icon: 'flash-circle'
    },
    {
        id: 'ganagathara',
        name: 'Sri Ganagathara Agency',
        key: 'ganagathara',
        screen: 'GanagatharaPortfolio',
        badgeColor: '#EAB308',
        image: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?q=80&w=800&auto=format&fit=crop',
        icon: 'power-plug'
    },
    {
        id: 'abirami',
        name: 'R. Prabhu & Manikandan',
        key: 'abirami',
        screen: 'AbiramiPortfolio',
        badgeColor: '#4F46E5',
        image: require('../assets/images/portfolio/abirami/hero.png'),
        icon: 'book-open-page-variant'
    },
    {
        id: 'stgesports',
        name: 'STG Esports',
        key: 'stgesports',
        screen: 'STGEsportsPortfolio',
        badgeColor: '#EF4444',
        image: require('../assets/images/stg_bg.png'),
        icon: 'gamepad-variant'
    },
    {
        id: 'swiggy',
        name: 'Food Delivery',
        key: 'swiggy',
        screen: 'SwiggyMainTabs',
        badgeColor: '#FC8019',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop',
        icon: 'food'
    }
];

let isInitialAppLaunch = true;

const UserDashboardScreen = ({ navigation }: Props) => {
    const { t } = useTranslation();
    const [activeIndex, setActiveIndex] = useState(0);
    const [voiceModalVisible, setVoiceModalVisible] = useState(false);

    // Dynamic image states
    const [foodImageUrl, setFoodImageUrl] = useState<string | null>(null);
    const [extraPortfolios, setExtraPortfolios] = useState<any[]>([]);
    const [ecomCategories, setEcomCategories] = useState<any[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(`${BASE_URL}/gobi360/categories/`);
                if (res.ok) {
                    const data = await res.json();
                    // Store ALL categories for the Ecom section
                    setEcomCategories(data);

                    const foodCategory = data.find((cat: any) => cat.id === 1 || cat.name.includes('Food'));
                    if (foodCategory && foodCategory.image_url) {
                        setFoodImageUrl(foodCategory.image_url);
                    }

                    const others = data.filter((cat: any) => cat.id !== 1 && !cat.name.includes('Food'));
                    const newCards = others.map((cat: any) => ({
                        id: `api_${cat.id}`,
                        name: cat.name,
                        key: cat.name.toLowerCase().replace(/[^a-z0-9]/g, '_'),
                        screen: 'SwiggyMainTabs',
                        badgeColor: '#10B981',
                        image: cat.image_url,
                        icon: 'store',
                        isDynamic: true,
                        tagline: 'Order Groceries & Essentials',
                        categoryId: cat.id
                    }));
                    setExtraPortfolios(newCards);
                }
            } catch (error) {
                console.log('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);
    const [isBotOpen, setIsBotOpen] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [dynamicExperts, setDynamicExperts] = useState<any[]>([]);
    const [dynamicCategories, setDynamicCategories] = useState<any[]>([]);
    const [loadingExperts, setLoadingExperts] = useState(true);
    const [globalProducts, setGlobalProducts] = useState<any[]>([]);
    const [globalShops, setGlobalShops] = useState<any[]>([]);
    const [globalCategories, setGlobalCategories] = useState<any[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [activeSearchFilter, setActiveSearchFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const scrollViewRef = useRef<ScrollView>(null);
    const aiBotRef = useRef<AIBotGuideRef>(null);
    const { i18n } = useTranslation();
    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideUpAnim = useRef(new Animated.Value(30)).current;
    const searchScale = useRef(new Animated.Value(0.9)).current;
    const gridOpacity = useRef(new Animated.Value(0)).current;
    const expertScale = useRef(new Animated.Value(0.95)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const floatAnim = useRef(new Animated.Value(0)).current;

    // Entrance & Auto Animations
    useEffect(() => {
        // Entrance sequence
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(slideUpAnim, {
                toValue: 0,
                duration: 800,
                easing: Easing.out(Easing.back(1)),
                useNativeDriver: true,
            }),
            Animated.spring(searchScale, {
                toValue: 1,
                friction: 8,
                tension: 40,
                useNativeDriver: true,
            }),
            Animated.timing(gridOpacity, {
                toValue: 1,
                duration: 1000,
                delay: 400,
                useNativeDriver: true,
            }),
            Animated.spring(expertScale, {
                toValue: 1,
                friction: 6,
                delay: 600,
                useNativeDriver: true,
            })
        ]).start();

        // Continuous Auto Animations
        const pulseLoop = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.2,
                    duration: 1000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        );
        pulseLoop.start();

        const floatLoop = Animated.loop(
            Animated.sequence([
                Animated.timing(floatAnim, {
                    toValue: -4,
                    duration: 2000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(floatAnim, {
                    toValue: 0,
                    duration: 2000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        );
        floatLoop.start();

        return () => {
            pulseLoop.stop();
            floatLoop.stop();
        };
    }, []); // Run ONLY once on mount

    // Slider Interval
    useEffect(() => {
        const interval = setInterval(() => {
            if (scrollViewRef.current) {
                const nextIndex = (activeIndex + 1) % SLIDER_IMAGES.length;
                scrollViewRef.current.scrollTo({
                    x: nextIndex * width,
                    animated: true,
                });
                setActiveIndex(nextIndex);
            }
        }, 4000);

        return () => clearInterval(interval);
    }, [activeIndex]);

    // Wakeword Listener ("Hey Bot") - Disabled for microphone privacy as requested
    /*
    useEffect(() => {
        let isActive = true;
        
        const startListening = async () => {
            if (!isActive || isBotOpen || voiceModalVisible) return;
            try {
                const locale = i18n.language === 'ta' ? 'ta-IN' : 'en-IN';
                await Voice.stop().catch(() => {});
                await new Promise<void>(resolve => setTimeout(resolve, 500));
                if (!isActive || isBotOpen || voiceModalVisible) return;
                await Voice.start(locale);
            } catch (e) {
                if (isActive && !isBotOpen && !voiceModalVisible) {
                    setTimeout(startListening, 1500);
                }
            }
        };

        const initVoice = async () => {
            if (!isActive || isBotOpen || voiceModalVisible) return;
            try {
                if (Platform.OS === 'android') {
                    const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
                    if (!granted) {
                        const requested = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
                        if (requested !== PermissionsAndroid.RESULTS.GRANTED) return;
                    }
                }

                await Voice.destroy();
                
                Voice.onSpeechStart = () => console.log('ðŸŽ¤ Wakeword Monitor: LISTENING...');
                Voice.onSpeechPartialResults = (e) => {
                    const text = e.value?.[0]?.toLowerCase() || '';
                    console.log('ðŸŽ¤ Wakeword Monitor (Partial):', text);
                    
                    const matchesHayBot = text.includes('hey bot') || text.includes('heybot') || 
                                       text.includes('hi bot') || text.includes('à®¹à¯‡ à®ªà®¾à®Ÿà¯') ||
                                       text.includes('à®¹à¯‡ à®ªà¯‹à®Ÿà¯') || text.includes('à®’à®©à¯ à®Ÿà®šà¯') ||
                                       text.includes('one touch');
                                       
                    if (matchesHayBot) {
                        console.log('ðŸš€ WAKEWORD TRIGGERED! Opening Bot...');
                        setIsBotOpen(true);
                        aiBotRef.current?.open();
                    }
                };
                
                Voice.onSpeechResults = (e) => {
                    const text = e.value?.[0]?.toLowerCase() || '';
                    console.log('ðŸŽ¤ Wakeword Monitor (Final):', text);
                };
                
                Voice.onSpeechError = (e) => {
                    if (isActive && !isBotOpen && !voiceModalVisible) {
                        const code = e.error?.code;
                        console.warn('âš ï¸ Wakeword Monitor Error:', code, e.error?.message);
                        const delay = code === '7' ? 200 : 1000;
                        setTimeout(startListening, delay);
                    }
                };

                Voice.onSpeechEnd = () => {
                    if (isActive && !isBotOpen && !voiceModalVisible) {
                        setTimeout(startListening, 1000);
                    }
                };

                await startListening();
            } catch (e) {
                console.warn('Wakeword Init Error:', e);
            }
        };

        const timer = setTimeout(initVoice, 1000);

        return () => {
            isActive = false;
            clearTimeout(timer);
            Voice.destroy().then(Voice.removeAllListeners);
        };
    }, [i18n.language, isBotOpen, voiceModalVisible]);
    */

    const fetchDynamicExperts = async () => {
        try {
            const response = await fetch(API_ENDPOINTS.experts);
            if (response.ok) {
                const data = await response.json();
                setDynamicExperts(data);
            }
        } catch (error) {
            console.error('Error fetching dynamic experts:', error);
        } finally {
            setLoadingExperts(false);
        }
    };

    // Dedicated fetch for All Services categories from ngrok endpoint
    const fetchExpertCategories = async () => {
        try {
            const res = await fetch(API_ENDPOINTS.expertCategories, {
                headers: {
                    'ngrok-skip-browser-warning': 'true',
                    'Accept': 'application/json',
                },
            });
            if (res.ok) {
                const data = await res.json();
                setDynamicCategories(Array.isArray(data) ? data : (data.results || []));
            } else {
                console.warn('Expert categories fetch failed:', res.status);
            }
        } catch (error) {
            console.error('Error fetching expert categories:', error);
        }
    };

    const fetchGlobalProductsAndShops = async () => {
        try {
            const [prodRes, shopRes, catRes] = await Promise.all([
                fetch(`${BASE_URL}/gobi360/products/`),
                fetch(`${BASE_URL}/gobi360/shops/`),
                fetch(`${BASE_URL}/gobi360/categories/`),
            ]);

            if (prodRes.ok) {
                const prodData = await prodRes.json();
                setGlobalProducts(Array.isArray(prodData) ? prodData : (prodData.results || []));
            }
            if (shopRes.ok) {
                const shopData = await shopRes.json();
                setGlobalShops(Array.isArray(shopData) ? shopData : (shopData.results || []));
            }
            if (catRes.ok) {
                const catData = await catRes.json();
                setGlobalCategories(Array.isArray(catData) ? catData : (catData.results || []));
            }
        } catch (error) {
            console.error('Error fetching global catalog:', error);
        }
    };

    useEffect(() => {
        fetchDynamicExperts();
        fetchGlobalProductsAndShops();
        fetchExpertCategories();   // All Services - ngrok endpoint with bypass header
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        Promise.all([
            fetchDynamicExperts(),
            fetchGlobalProductsAndShops(),
            fetchExpertCategories(),
        ]).then(() => setRefreshing(false));
    };

    const handleScroll = (event: any) => {
        const scrollPosition = event.nativeEvent.contentOffset.x;
        const newIndex = Math.round(scrollPosition / width);
        if (newIndex !== activeIndex) {
            setActiveIndex(newIndex);
        }
    };

    const EXPERTS_LIST = useMemo(() => [
        { id: 'skyline', name: 'Skyline Team', rating: '4.8', reviews: 450, image: require('../assets/images/skyline_construction.png'), phone: '8754944026' },
        { id: 'woodzone', name: 'Wood Zone', rating: '4.9', reviews: 580, image: require('../assets/images/skyline_modular_4.png'), phone: '9092743053' },
        { id: 'hindi', name: 'Surendar J', rating: '4.9', reviews: 280, image: require('../assets/images/hindi_cover.png'), phone: '6397255377' },
        { id: 'thiran', name: 'Manickavasagar', rating: '5.0', reviews: 150, image: require('../assets/images/thiran360ai_logo.png'), phone: '7708805630' },
        { id: 'swaraj', name: 'Saravanan (Saaral Motors)', rating: '5.0', reviews: 200, image: require('../assets/images/portfolio/swaraj/hero.jpg'), phone: '9489359090' },
        { id: 'mejestic', name: 'K. Arun (Mejestic Studio)', rating: '4.9', reviews: 290, image: 'https://images.unsplash.com/photo-1554080353-a576cf803bda?q=80&w=400&auto=format&fit=crop', phone: '9791797777' },
        { id: 'sakthi', name: 'Sri Sakthi Team', rating: '4.9', reviews: 310, image: require('../assets/images/sakthi_hero.png'), phone: '6383816267' },
        { id: 'ganagathara', name: 'S. Senthilkumar (Ganagathara Agency)', rating: '4.9', reviews: 205, image: require('../assets/images/portfolio/ganagathara/hero.png'), phone: '9790629888' },
        { id: 'srijeyam', name: 'C. Prakash (Sri Jayam)', rating: '4.9', reviews: 180, image: require('../assets/images/portfolio/srijeyam/hero.png'), phone: '6374822433' },
        { id: 'manojsteels', name: 'ManojKumar anandhan', rating: '4.9', reviews: 340, image: require('../assets/images/portfolio/manojsteels/manojsteels_hero.png'), phone: '9994488447' },
        { id: 'sunpower', name: 'Jc S.R.S. Prabakaran', rating: '4.9', reviews: 320, image: require('../assets/images/portfolio/sunpower/ro_system.png'), phone: '9865088885' },
        { id: 'abirami', name: 'R. Prabhu & Manikandan', rating: '4.8', reviews: 210, image: require('../assets/images/portfolio/abirami/hero.png'), phone: '9842940548' },
    ], []);

    const filteredServices = useMemo(() => {
        if (!searchQuery) return dynamicCategories;
        const lowQuery = searchQuery.toLowerCase().trim();
        return dynamicCategories.filter(item => {
            const name = (item.name || item.category_name || '').toLowerCase();
            const nameWithService = name.endsWith('service') ? name : name + ' service';
            return name.includes(lowQuery) || nameWithService.includes(lowQuery) || lowQuery === 'service' || lowQuery === 'services';
        });
    }, [searchQuery, dynamicCategories]);

    const filteredGlobalCategories = useMemo(() => {
        if (!searchQuery) return globalCategories;
        const lowQuery = searchQuery.toLowerCase().trim();
        return globalCategories.filter(item => {
            const name = (item.name || '').toLowerCase();
            return name.includes(lowQuery);
        });
    }, [searchQuery, globalCategories]);

    const filteredGlobalShops = useMemo(() => {
        if (!searchQuery) return globalShops;
        const lowQuery = searchQuery.toLowerCase().trim();
        return globalShops.filter(item => {
            const name = (item.shop_name || '').toLowerCase();
            return name.includes(lowQuery);
        });
    }, [searchQuery, globalShops]);

    const filteredExperts = useMemo(() => {
        if (!searchQuery) return EXPERTS_LIST;
        const lowQuery = searchQuery.toLowerCase().trim();
        return EXPERTS_LIST.filter(expert => {
            const name = expert.name.toLowerCase();
            const job = t(`dashboard.experts.${expert.id}`).toLowerCase();
            const keywords = EXPERT_KEYWORDS[expert.id] || [];
            return name.includes(lowQuery) ||
                job.includes(lowQuery) ||
                keywords.some(k => k.toLowerCase().includes(lowQuery));
        });
    }, [searchQuery, EXPERTS_LIST]);

    const filteredDynamicExperts = useMemo(() => {
        if (!searchQuery) return dynamicExperts;
        const lowQuery = searchQuery.toLowerCase().trim();
        return dynamicExperts.filter((expert: any) => {
            const name = (expert.expert_name || '').toLowerCase();
            const category = (expert.category || '').toLowerCase();
            return name.includes(lowQuery) || category.includes(lowQuery);
        });
    }, [searchQuery, dynamicExperts]);

    const filteredPortfolios = useMemo(() => {
        const combinedPortfolios = [...FEATURED_PORTFOLIOS, ...extraPortfolios];
        if (!searchQuery) return combinedPortfolios;
        const lowQuery = searchQuery.toLowerCase().trim();
        const matched = findPortfolioMatches(searchQuery);
        const matchedScreens = new Set(matched.map(m => m.screen));
        return combinedPortfolios.filter(p => {
            return matchedScreens.has(p.screen as any) ||
                p.name.toLowerCase().includes(lowQuery) ||
                (p.tagline && p.tagline.toLowerCase().includes(lowQuery));
        });
    }, [searchQuery, extraPortfolios]);

    const hasResults = filteredServices.length > 0 || filteredExperts.length > 0 || filteredPortfolios.length > 0 || filteredDynamicExperts.length > 0;

    // Unified suggestions for the dropdown - ALL portfolio matches shown
    const searchSuggestions = useMemo(() => {
        if (!searchQuery || searchQuery.trim().length === 0) return [];
        const suggestions: Array<{ type: 'service' | 'expert' | 'portfolio' | 'product' | 'shop' | 'category'; label: string; sublabel: string; icon: string; color: string; bg: string; action: () => void }> = [];

        const safeQuery = searchQuery.toLowerCase().trim();
        const isGenericServiceSearch = safeQuery === 'service' || safeQuery === 'services';

        // 1. Services
        const servicesLimit = isGenericServiceSearch ? filteredServices.length : 3;
        filteredServices.slice(0, servicesLimit).forEach(item => {
            const rawName = item.name || item.category_name || '';
            const displayLabel = rawName.toLowerCase().endsWith('service') ? rawName : `${rawName} Service`;
            
            suggestions.push({
                type: 'service',
                label: displayLabel,
                sublabel: item.description || item.type || 'Service Category',
                icon: 'wrench',
                color: '#3B82F6',
                bg: '#EFF6FF',
                action: () => {
                    checkSessionAndNavigate(navigation, () => {
                        setSearchQuery(displayLabel);
                        setShowSuggestions(false);
                        navigation.navigate('Experts' as any, {
                            filter: rawName,
                            categoryId: item.id
                        });
                    });
                }
            });
        });

        // 2. Global Categories (top 2)
        if (globalCategories && Array.isArray(globalCategories)) {
            const matchedCategories = globalCategories.filter(c => {
                const cName = c.name || c.category_name || c.title || '';
                const safeName = cName.toLowerCase().trim();
                return safeName && (safeName.includes(safeQuery) || safeQuery.includes(safeName));
            });
            matchedCategories.slice(0, 2).forEach(category => {
                const cName = category.name || category.category_name || category.title;
                suggestions.push({
                    type: 'category',
                    label: cName,
                    sublabel: 'Category',
                    icon: 'format-list-bulleted',
                    color: '#FF5200',
                    bg: '#FFF0E6',
                    action: () => {
                        checkSessionAndNavigate(navigation, () => {
                            setSearchQuery(cName);
                            setShowSuggestions(false);
                            navigation.navigate('SwiggyMainTabs' as any, { autoSearch: cName });
                        });
                    }
                });
            });
        }

        // 3. Global Shops (top 3)
        if (globalShops && Array.isArray(globalShops)) {
            const matchedShops = globalShops.filter(s => {
                const sName = s.name || s.shop_name || s.title || '';
                const safeName = sName.toLowerCase().trim();
                return safeName && (safeName.includes(safeQuery) || safeQuery.includes(safeName));
            });
            matchedShops.slice(0, 3).forEach(shop => {
                const sName = shop.name || shop.shop_name || shop.title;
                suggestions.push({
                    type: 'shop',
                    label: sName,
                    sublabel: shop.shop_type || 'Shop / Restaurant',
                    icon: 'storefront',
                    color: '#FF5200',
                    bg: '#FFF0E6',
                    action: () => {
                        checkSessionAndNavigate(navigation, () => {
                            setSearchQuery(sName);
                            setShowSuggestions(false);
                            navigation.navigate('SwiggyMainTabs' as any, { autoSearch: sName });
                        });
                    }
                });
            });
        }

        // 4. Global Products (top 5)
        if (globalProducts && Array.isArray(globalProducts)) {
            const matchedProducts = globalProducts.filter(p => {
                const pName = p.name || p.product_name || p.title || '';
                const safeName = pName.toLowerCase().trim();
                return safeName && (safeName.includes(safeQuery) || safeQuery.includes(safeName));
            });
            matchedProducts.slice(0, 5).forEach(product => {
                const pName = product.name || product.product_name || product.title;
                suggestions.push({
                    type: 'product',
                    label: pName,
                    sublabel: product.category || 'Product / Dish',
                    icon: 'food',
                    color: '#FF5200',
                    bg: '#FFF0E6',
                    action: () => {
                        checkSessionAndNavigate(navigation, () => {
                            setSearchQuery(pName);
                            setShowSuggestions(false);
                            navigation.navigate('SwiggyMainTabs' as any, { autoSearch: pName });
                        });
                    }
                });
            });
        }

        // 5. Portfolios
        if (!isGenericServiceSearch) {
            const matchedPortfolios = findPortfolioMatches(searchQuery);
            const matchedScreens = new Set(matchedPortfolios.map(m => m.screen));

            matchedPortfolios.slice(0, 3).forEach(portfolio => {
                suggestions.push({
                    type: 'portfolio',
                    label: portfolio.name,
                    sublabel: portfolio.description,
                    icon: portfolio.icon || 'briefcase',
                    color: portfolio.color,
                    bg: portfolio.bg,
                    action: () => {
                        checkSessionAndNavigate(navigation, () => {
                            setShowSuggestions(false);
                            if (portfolio.screen === 'SkylineServiceDetail' && portfolio.serviceId) {
                                navigation.navigate('SkylineServiceDetail' as any, { serviceId: portfolio.serviceId });
                            } else {
                                navigation.navigate(portfolio.screen as any);
                            }
                        });
                    }
                });
            });

            // Backend extra portfolios
            filteredPortfolios.forEach(p => {
                if (!matchedScreens.has(p.screen)) {
                    suggestions.push({
                        type: 'portfolio',
                        label: p.name,
                        sublabel: p.tagline || 'Portfolio',
                        icon: p.icon || 'store',
                        color: '#FFFFFF',
                        bg: p.badgeColor || '#3B82F6',
                        action: () => {
                            checkSessionAndNavigate(navigation, () => {
                                setShowSuggestions(false);
                                navigation.navigate(p.screen as any, p.isDynamic ? { categoryId: p.categoryId, categoryName: p.name } : undefined);
                            });
                        }
                    });
                }
            });
        }

        // 6. Dynamic Experts (top 2)
        filteredDynamicExperts.slice(0, 2).forEach((expert: any) => {
            suggestions.push({
                type: 'expert',
                label: expert.expert_name,
                sublabel: expert.category,
                icon: 'account-star',
                color: '#10B981',
                bg: '#D1FAE5',
                action: () => {
                    checkSessionAndNavigate(navigation, () => {
                        setSearchQuery(expert.expert_name);
                        setShowSuggestions(false);
                        navigation.navigate('DynamicExpertServices', {
                            expertId: expert.id,
                            expertName: expert.expert_name,
                            expertImage: expert.expert_image,
                            category: expert.category,
                            phone: expert.contact_number,
                            initialServices: expert.services
                        });
                    });
                }
            });
        });

        // 7. Experts (top 2)
        filteredExperts.slice(0, 2).forEach(expert => {
            suggestions.push({
                type: 'expert',
                label: expert.name,
                sublabel: t(`dashboard.experts.${expert.id}`),
                icon: 'account-star',
                color: '#10B981',
                bg: '#D1FAE5',
                action: () => {
                    checkSessionAndNavigate(navigation, () => {
                        setSearchQuery(expert.name);
                        setShowSuggestions(false);
                        navigation.navigate('Experts', { filter: expert.name });
                    });
                }
            });
        });
        if (activeSearchFilter !== 'All') {
            const filterMap: Record<string, string[]> = {
                'Services': ['service', 'category'],
                'Experts': ['expert'],
                'Portfolios': ['portfolio'],
                'Products': ['product'],
                'Shops': ['shop']
            };
            const validTypes = filterMap[activeSearchFilter] || [];
            return suggestions.filter(s => validTypes.includes(s.type));
        }

        return suggestions; // no overall cap - show everything
    }, [searchQuery, activeSearchFilter, filteredServices, filteredExperts, t]);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.topCurve} />

            <Animated.View style={[
                styles.header,
                {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideUpAnim }]
                }
            ]}>
                <View style={styles.appTitleContainer}>
                    <Image source={require('../assets/images/gobi360_logo.png')} style={styles.appLogo} resizeMode="contain" />
                </View>
                <TouchableOpacity style={styles.notificationButton}>
                    <Icon name="bell-outline" size={24} color="#1E293B" />
                    <Animated.View style={[
                        styles.notificationDot,
                        { transform: [{ scale: pulseAnim }] }
                    ]} />
                </TouchableOpacity>
            </Animated.View>

            <View style={{ paddingHorizontal: width * 0.06, zIndex: 100 }}>
                {/* Search Bar - Modernized */}
                <Animated.View style={[
                    styles.searchContainer,
                    {
                        opacity: fadeAnim,
                        transform: [{ scale: searchScale }]
                    }
                ]}>
                    <Icon name="magnify" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder={t('dashboard.search_placeholder')}
                        placeholderTextColor="#94A3B8"
                        value={searchQuery}
                        onFocus={() => {
                            setShowSuggestions(true);
                        }}
                        onChangeText={(text) => {
                            // Remove special characters, keep letters, numbers, and spaces (supports Tamil/Hindi via unicode if engine allows, otherwise safe basic replace)
                            const sanitizedText = text.replace(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/g, '');
                            setSearchQuery(sanitizedText);
                            setShowSuggestions(true);
                        }}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => { setSearchQuery(''); setShowSuggestions(false); }} style={{ padding: 4 }}>
                            <Icon name="close-circle" size={18} color="#94A3B8" />
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity
                        style={styles.voiceButton}
                        onPress={() => checkSessionAndNavigate(navigation, () => setVoiceModalVisible(true))}
                    >
                        <View style={styles.voiceIconBg}>
                            <Icon name="microphone" style={styles.voiceIcon} />
                        </View>
                    </TouchableOpacity>
                </Animated.View>

                {/* Search Suggestions Dropdown */}
                {showSuggestions && (
                    <View style={[styles.suggestionsDropdown, { position: 'absolute', top: 65, left: width * 0.06, right: width * 0.06, zIndex: 200, marginHorizontal: 0 }]}>
                        
                        {/* ── Filter Chips ── */}
                        <ScrollView 
                            horizontal 
                            showsHorizontalScrollIndicator={false} 
                            keyboardShouldPersistTaps="handled"
                            style={styles.filterChipContainer}
                            contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 10 }}
                        >
                            {['All', 'Services', 'Experts', 'Portfolios', 'Products', 'Shops'].map((filterItem) => {
                                const isActive = activeSearchFilter === filterItem;
                                return (
                                    <TouchableOpacity
                                        key={filterItem}
                                        style={[styles.filterChip, isActive && styles.filterChipActive]}
                                        onPress={() => setActiveSearchFilter(filterItem)}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                                            {filterItem}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                        {/* ── End Filter Chips ── */}

                        {searchSuggestions.length > 0 ? (
                            <ScrollView
                                nestedScrollEnabled
                                keyboardShouldPersistTaps="handled"
                                style={{ maxHeight: 320 }}
                                showsVerticalScrollIndicator={false}
                            >
                                {searchSuggestions.map((item, index) => (
                                <TouchableOpacity
                                    key={`${item.type}-${index}`}
                                    style={[styles.suggestionItem, index < searchSuggestions.length - 1 && styles.suggestionItemBorder]}
                                    onPress={item.action}
                                    activeOpacity={0.7}
                                >
                                    <View style={[styles.suggestionIcon, { backgroundColor: item.bg }]}>
                                        <Icon name={item.icon} size={16} color={item.color} />
                                    </View>
                                    <View style={styles.suggestionText}>
                                        <Text style={styles.suggestionLabel} numberOfLines={1}>{item.label}</Text>
                                        <Text style={styles.suggestionSublabel} numberOfLines={1}>{item.sublabel}</Text>
                                    </View>
                                    <View style={[styles.suggestionTypePill, { backgroundColor: item.bg }]}>
                                        <Text style={[styles.suggestionTypeText, { color: item.color }]}>
                                            {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        ) : (
                            <View style={{ padding: 16, alignItems: 'center' }}>
                                <Text style={{ color: '#64748B', fontSize: 14 }}>No results found for {activeSearchFilter}</Text>
                            </View>
                        )}
                    </View>
                )}
            </View>

            <FlatList
                style={styles.content}
                contentContainerStyle={{ paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#3B82F6']} // Android
                        tintColor="#3B82F6" // iOS
                    />
                }
                data={[
                    ...filteredPortfolios.map(p => ({ ...p, _itemType: 'portfolio' })),
                    ...(loadingExperts ? [] : filteredDynamicExperts.map((e: any) => ({ ...e, _itemType: 'expert' })))
                ]}
                keyExtractor={(item) => item._itemType === 'portfolio' ? 'port_' + item.id : 'exp_' + item.id}
                initialNumToRender={4}
                maxToRenderPerBatch={4}
                windowSize={5}
                removeClippedSubviews={Platform.OS === 'android'}
                ListHeaderComponent={

                    <View>
                        {/* Modern Auto-sliding Banner */}
                        <Animated.View style={[
                            styles.carouselContainer,
                            {
                                opacity: fadeAnim,
                                transform: [{ translateY: slideUpAnim }]
                            }
                        ]}>
                            <ScrollView
                                ref={scrollViewRef}
                                horizontal
                                pagingEnabled
                                showsHorizontalScrollIndicator={false}
                                onMomentumScrollEnd={handleScroll}
                                style={styles.sliderScrollView}
                                keyboardShouldPersistTaps="handled"
                            >
                                {[
                                    { id: 1, title: t('dashboard.slider.plumber_title'), subtitle: t('dashboard.slider.plumber_subtitle'), color: '#DBEAFE', image: SLIDER_IMAGES[0], target: 'Experts' },
                                    { id: 2, title: t('dashboard.slider.ac_title'), subtitle: t('dashboard.slider.ac_subtitle'), color: '#DCFCE7', image: SLIDER_IMAGES[1], target: 'Experts' },
                                    { id: 3, title: t('dashboard.slider.electrical_title'), subtitle: t('dashboard.slider.electrical_subtitle'), color: '#FEF3C7', image: SLIDER_IMAGES[2], target: 'SakthiElectricalsPortfolio' },
                                    { id: 4, title: t('dashboard.slider.cleaning_title'), subtitle: t('dashboard.slider.cleaning_subtitle'), color: '#FCE7F3', image: SLIDER_IMAGES[3], target: 'Experts' },
                                    { id: 5, title: t('dashboard.slider.furniture_title'), subtitle: t('dashboard.slider.furniture_subtitle'), color: '#EDE9FE', image: SLIDER_IMAGES[4], target: 'WoodZonePortfolio' },
                                    { id: 6, title: t('dashboard.slider.painting_title'), subtitle: t('dashboard.slider.painting_subtitle'), color: '#FFE4E6', image: SLIDER_IMAGES[5], target: 'SkylinePortfolio' },
                                    { id: 7, title: t('dashboard.slider.food_title'), subtitle: t('dashboard.slider.food_subtitle'), color: '#FFEDD5', image: SLIDER_IMAGES[6], target: 'SwiggyMainTabs' },
                                ].map((item) => (
                                    <View key={item.id} style={styles.slideWrapper}>
                                        <TouchableOpacity
                                            style={styles.slideImage}
                                            activeOpacity={0.9}
                                            onPress={() => {
                                                checkSessionAndNavigate(navigation, () => {
                                                    navigation.navigate(item.target as any);
                                                });
                                            }}
                                        >
                                            <ImageBackground
                                                source={{ uri: item.image }}
                                                style={styles.slideOverlay}
                                                imageStyle={styles.imageBackgroundStyle}
                                            >
                                                <Text style={styles.slideTitle}>{item.title}</Text>
                                                <Text style={styles.slideSubtitle}>{item.subtitle}</Text>
                                                <View style={styles.slideButton}>
                                                    <Text style={styles.slideButtonText}>{t('dashboard.book_now')}</Text>
                                                </View>
                                            </ImageBackground>
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </ScrollView>

                            {/* Pagination Dots */}
                            <View style={styles.paginationContainer}>
                                {Array.from({ length: SLIDER_IMAGES.length }).map((_: unknown, index: number) => (
                                    <View
                                        key={index}
                                        style={[
                                            styles.paginationDot,
                                            activeIndex === index ? styles.paginationDotActive : styles.paginationDotInactive
                                        ]}
                                    />
                                ))}
                            </View>
                        </Animated.View>

                        {/* All Services Grid */}
                        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideUpAnim }] }}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>{t('dashboard.all_services')}</Text>
                            </View>
                            <View style={styles.servicesGrid}>
                                {dynamicCategories.length === 0
                                    ? Array.from({ length: 8 }).map((_, idx) => (
                                        <View key={`skel_${idx}`} style={styles.serviceItem}>
                                            <View style={[styles.serviceIconContainer, { backgroundColor: '#E2E8F0' }]} />
                                            <View style={{ width: 44, height: 9, backgroundColor: '#E2E8F0', borderRadius: 5, marginTop: 7 }} />
                                        </View>
                                    ))
                                    : filteredServices.map((item: any) => (
                                        <TouchableOpacity
                                            key={`cat_${item.id}`}
                                            style={styles.serviceItem}
                                            activeOpacity={0.75}
                                            onPress={() => {
                                                checkSessionAndNavigate(navigation, () => {
                                                    navigation.navigate('Experts' as any, {
                                                        filter: item.name || item.category_name,
                                                        categoryId: item.id
                                                    });
                                                });
                                            }}
                                        >
                                            <View style={styles.serviceIconContainer}>
                                                <Image
                                                    source={{ uri: item.image || item.category_image }}
                                                    style={styles.serviceImg}
                                                    resizeMode="cover"
                                                    fadeDuration={0}
                                                    resizeMethod="resize"
                                                />
                                            </View>
                                            <Text style={styles.serviceName} numberOfLines={2}>{item.name || item.category_name}</Text>
                                        </TouchableOpacity>
                                    ))
                                }
                            </View>
                        </Animated.View>
                        
                        {/* Ecom Section - Categories from API */}
                        {ecomCategories.length > 0 && (
                            <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideUpAnim }] }}>
                                <View style={styles.sectionHeader}>
                                    <Text style={styles.sectionTitle}>Ecom</Text>
                                </View>
                                <View style={styles.servicesGrid}>
                                    {ecomCategories.map((cat: any) => (
                                        <TouchableOpacity
                                            key={`ecom_cat_${cat.id}`}
                                            style={styles.serviceItem}
                                            activeOpacity={0.75}
                                            onPress={() => {
                                                checkSessionAndNavigate(navigation, () => {
                                                    navigation.navigate('SwiggyMainTabs' as any, {
                                                        categoryId: cat.id,
                                                        categoryName: cat.name,
                                                    });
                                                });
                                            }}
                                        >
                                            <View style={styles.serviceIconContainer}>
                                                <Image
                                                    source={{ uri: cat.image_url }}
                                                    style={styles.serviceImg}
                                                    resizeMode="cover"
                                                    fadeDuration={0}
                                                    resizeMethod="resize"
                                                />
                                            </View>
                                            <Text style={styles.serviceName} numberOfLines={2}>{cat.name}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </Animated.View>
                        )}

                        {/* Featured Portfolio Selection Header */}
                        {(filteredPortfolios.length > 0 || (!loadingExperts && dynamicExperts.length > 0)) && (
                            <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideUpAnim }] }}>
                                <View style={styles.sectionHeader}>
                                    <Text style={styles.sectionTitle}>{t('dashboard.experts_services')}</Text>
                                </View>
                            </Animated.View>
                        )}
                    </View>

                }
                ListFooterComponent={

                    <View>
                        {/* Top Rated Professionals */}
                        {filteredExperts.length > 0 && (
                            <>
                                <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideUpAnim }] }}>
                                    <View style={styles.sectionHeader}>
                                        <Text style={styles.sectionTitle}>{t('dashboard.top_rated_experts')}</Text>
                                        <TouchableOpacity onPress={() => navigation.navigate('Experts' as any)}>
                                            <Text style={styles.seeAllText}>{t('dashboard.view_all')}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </Animated.View>

                                <Animated.View style={{ opacity: gridOpacity, transform: [{ scale: expertScale }] }}>
                                    <FlatList
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        data={filteredExperts}
                                        keyExtractor={(item) => item.id}
                                        contentContainerStyle={styles.expertsContainer}
                                        initialNumToRender={3}
                                        maxToRenderPerBatch={3}
                                        windowSize={3}
                                        removeClippedSubviews={Platform.OS === 'android'}
                                        renderItem={({ item: expert }) => (
                                            <TouchableOpacity
                                                style={styles.expertCard}
                                                onPress={() => navigation.navigate('Experts' as any)}
                                            >
                                                <View style={styles.expertImageContainer}>
                                                    <ImageBackground
                                                        source={typeof expert.image === 'string' ? { uri: expert.image } : expert.image}
                                                        style={styles.expertImage}
                                                        imageStyle={{ borderRadius: 40 }}
                                                    />
                                                    <View style={styles.verifiedBadge}>
                                                        <Icon name="check-decagram" size={16} color="#3B82F6" />
                                                    </View>
                                                </View>
                                                <Text style={styles.expertName} numberOfLines={2}>{expert.name}</Text>
                                                <Text style={styles.expertJob} numberOfLines={1}>{t(`dashboard.experts.${expert.id}`)}</Text>
                                                <View style={styles.expertRatingContainer}>
                                                    <Icon name="star" size={14} color="#F59E0B" />
                                                    <Text style={styles.expertRatingText}>{expert.rating}</Text>
                                                    <Text style={styles.expertReviewsText}>({expert.reviews})</Text>
                                                </View>
                                                <TouchableOpacity
                                                    style={styles.hireButton}
                                                    onPress={() => checkSessionAndNavigate(navigation, () => triggerCall(expert.phone, expert.name, expert.id))}
                                                >
                                                    <Text style={styles.hireButtonText}>{t('dashboard.hire_now')}</Text>
                                                </TouchableOpacity>
                                            </TouchableOpacity>
                                        )}
                                    />
                                </Animated.View>
                            </>
                        )}

                        {/* No Results found */}
                        {searchQuery !== '' && !hasResults && (
                            <View style={styles.noResultsContainer}>
                                <Icon name="magnify-close" size={80} color="#CBD5E1" />
                                <Text style={styles.noResultsTitle}>{t('dashboard.no_results.title')}</Text>
                                <Text style={styles.noResultsDesc}>
                                    {t('dashboard.no_results.desc', { query: searchQuery })}
                                </Text>
                                <TouchableOpacity
                                    style={styles.clearSearchBtn}
                                    onPress={() => setSearchQuery('')}
                                >
                                    <Text style={styles.clearSearchText}>{t('dashboard.no_results.clear')}</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {/* How it Works Section */}
                        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideUpAnim }] }}>
                            <View style={[styles.sectionHeader, { marginTop: 10 }]}>
                                <Text style={styles.sectionTitle}>{t('dashboard.how_it_works')}</Text>
                            </View>

                            <View style={styles.howItWorksContainer}>
                                {[
                                    { id: 1, titleKey: 'choose_title', descKey: 'choose_desc', icon: 'clipboard-list-outline', color: '#8B5CF6', bg: '#EDE9FE' },
                                    { id: 2, titleKey: 'schedule_title', descKey: 'schedule_desc', icon: 'calendar-clock', color: '#EC4899', bg: '#FCE7F3' },
                                    { id: 3, titleKey: 'relax_title', descKey: 'relax_desc', icon: 'home-heart', color: '#10B981', bg: '#D1FAE5' },
                                ].map((step, index) => (
                                    <View key={step.id} style={styles.stepContainer}>
                                        <View style={[styles.stepIconBg, { backgroundColor: step.bg }]}>
                                            <Icon name={step.icon} size={24} color={step.color} />
                                        </View>
                                        <View style={styles.stepContent}>
                                            <Text style={styles.stepTitle}>{t('dashboard.step')} {index + 1}: {t(`dashboard.steps.${step.titleKey}`)}</Text>
                                            <Text style={styles.stepDesc}>{t(`dashboard.steps.${step.descKey}`)}</Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </Animated.View>

                        {/* Bottom Padding for scrollview */}
                    </View>

                }
                ItemSeparatorComponent={() => <View style={{ height: 24 }} />}
                renderItem={({ item }) => {
                    if (item._itemType === 'portfolio') {
                        const portfolio = item;
                        return (
                            <View style={{ paddingHorizontal: 20 }}>
                                <TouchableOpacity
                                    style={styles.featuredPortfolioCard}
                                    onPress={() => navigation.navigate(portfolio.screen, { categoryId: portfolio.categoryId, categoryName: portfolio.name })}
                                    activeOpacity={0.9}
                                >
                                    <ImageBackground
                                        source={
                                            portfolio.id === 'swiggy' && foodImageUrl
                                                ? { uri: foodImageUrl }
                                                : (typeof portfolio.image === 'string' ? { uri: portfolio.image } : portfolio.image)
                                        }
                                        style={styles.featuredImage}
                                        imageStyle={{ borderRadius: 28 }}
                                        resizeMode="cover"
                                        resizeMethod="resize"
                                    >
                                        <View style={styles.featuredOverlayGradient}>
                                            <View style={styles.cardHeader}>
                                                <View style={[styles.featuredBadge, { backgroundColor: portfolio.badgeColor }]}>
                                                    <Icon name={portfolio.icon} size={12} color="#FFFFFF" />
                                                    <Text style={styles.featuredBadgeText}>{portfolio.isDynamic ? portfolio.name : t(`dashboard.portfolios.${portfolio.key}.badge`)}</Text>
                                                </View>
                                            </View>
                                            <View style={styles.cardInfoBox}>
                                                {portfolio.logo && (
                                                    <View style={{ marginBottom: 12, alignItems: 'flex-start' }}>
                                                        <Image source={portfolio.logo} style={{ width: 60, height: 60, borderRadius: 12 }} resizeMode="contain" />
                                                    </View>
                                                )}
                                                <View style={styles.cardTitleRow}>
                                                    <View style={styles.cardTextContainer}>
                                                        <Text style={styles.featuredName} numberOfLines={1}>{portfolio.isDynamic ? portfolio.name : (t(`dashboard.portfolios.${portfolio.key}.name`) !== `dashboard.portfolios.${portfolio.key}.name` ? t(`dashboard.portfolios.${portfolio.key}.name`) : portfolio.name)}</Text>
                                                        <Text style={styles.featuredTagline} numberOfLines={1}>{portfolio.isDynamic ? portfolio.tagline : (t(`dashboard.portfolios.${portfolio.key}.tagline`) !== `dashboard.portfolios.${portfolio.key}.tagline` ? t(`dashboard.portfolios.${portfolio.key}.tagline`) : 'Expert Services')}</Text>
                                                    </View>
                                                    <View style={[styles.cardActionBtn, { backgroundColor: portfolio.badgeColor }]}>
                                                        <Icon name="arrow-right" size={20} color="#FFFFFF" />
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </ImageBackground>
                                </TouchableOpacity>
                            </View>
                        );
                    } else {
                        const expert = item;
                        return (
                            <View style={{ paddingHorizontal: 20 }}>
                                <TouchableOpacity
                                    style={styles.featuredPortfolioCard}
                                    onPress={() => {
                                        checkSessionAndNavigate(navigation, () => {
                                            navigation.navigate('DynamicExpertServices', {
                                                expertId: expert.id,
                                                expertName: expert.expert_name,
                                                expertImage: expert.expert_image,
                                                category: expert.category,
                                                phone: expert.contact_number,
                                                initialServices: expert.services
                                            });
                                        });
                                    }}
                                    activeOpacity={0.9}
                                >
                                    <ImageBackground
                                        source={{ uri: expert.expert_image }}
                                        style={styles.featuredImage}
                                        imageStyle={{ borderRadius: 28 }}
                                        resizeMode="cover"
                                        resizeMethod="resize"
                                    >
                                        <View style={styles.featuredOverlayGradient}>
                                            <View style={styles.cardHeader}>
                                                <View style={[styles.featuredBadge, { backgroundColor: '#10B981' }]}>
                                                    <Icon name="check-decagram" size={12} color="#FFFFFF" />
                                                    <Text style={styles.featuredBadgeText}>{expert.badge || 'Verified Expert'}</Text>
                                                </View>
                                            </View>
                                            <View style={styles.cardInfoBox}>
                                                <View style={styles.cardTitleRow}>
                                                    <View style={styles.cardTextContainer}>
                                                        <Text style={styles.featuredName} numberOfLines={1}>{expert.expert_name}</Text>
                                                        <Text style={styles.featuredTagline} numberOfLines={1}>{expert.category}</Text>
                                                    </View>
                                                    <View style={[styles.cardActionBtn, { backgroundColor: '#10B981' }]}>
                                                        <Icon name="arrow-right" size={20} color="#FFFFFF" />
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </ImageBackground>
                                </TouchableOpacity>
                            </View>
                        );
                    }
                }}
            />

            {/* Voice Search Modal */}
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
                    setShowSuggestions(true);
                }}
                onFinalResult={(text) => {
                    setSearchQuery(text);
                    setShowSuggestions(true);
                    setVoiceModalVisible(false);
                }}
            />
            <AIBotGuide
                ref={aiBotRef}
                onClose={() => setIsBotOpen(false)}
            />

            {/* AI Bot Trigger Button (Floating Fallback) */}
            <TouchableOpacity
                style={styles.floatingBotBtn}
                onPress={() => {
                    setIsBotOpen(true);
                    aiBotRef.current?.open();
                }}
                activeOpacity={0.8}
            >
                <View style={styles.botBtnInner}>
                    <Image source={BOT_HUMAN} style={styles.botBtnIcon} resizeMode="cover" />
                    <View style={styles.botBtnTextContainer}>
                        <Text style={styles.botBtnText}>{t('dashboard.ai_bot_label')}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    topCurve: {
        position: 'absolute',
        top: -width * 0.5,
        left: -width * 0.1,
        right: -width * 0.1,
        height: width,
        borderRadius: width,
        backgroundColor: '#EFF6FF',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: width * 0.06,
        paddingTop: height * 0.05,
        paddingBottom: 24,
    },
    headerPlaceholder: {
        width: 44,
    },
    appTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    appLogo: {
        width: 200,
        height: 80,
        marginLeft: -40, // Slight negative margin to compensate for any internal whitespace in the logo image
    },
    appTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: '#1E293B',
        letterSpacing: -0.5,
        lineHeight: 32,
        includeFontPadding: false,
    },
    notificationButton: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    notificationDot: {
        position: 'absolute',
        top: 10,
        right: 12,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#EF4444',
        borderWidth: 1.5,
        borderColor: '#FFFFFF',
    },
    content: {
        flex: 1,
        paddingHorizontal: width * 0.06,
        paddingBottom: 20,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        paddingLeft: 20,
        paddingRight: 8,
        paddingVertical: 8,
        marginBottom: 24,
        shadowColor: '#64748B',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
        elevation: 5,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    searchIcon: {
        fontSize: 20,
        marginRight: 12,
        opacity: 0.6,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        fontWeight: '500',
        color: '#1E293B',
        padding: 0,
        minHeight: 44,
    },
    voiceButton: {
        marginLeft: 10,
    },
    voiceIconBg: {
        backgroundColor: '#3B82F6',
        width: 44,
        height: 44,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    voiceIcon: {
        fontSize: 18,
        color: '#FFF',
    },
    carouselContainer: {
        marginBottom: 32,
        alignItems: 'center',
    },
    sliderScrollView: {
        width: width,
    },
    slideWrapper: {
        width: width,
        paddingHorizontal: width * 0.06,
        alignItems: 'center',
        justifyContent: 'center',
    },
    slideImage: {
        width: '100%',
        height: 160,
        borderRadius: 24,
        overflow: 'hidden',
    },
    imageBackgroundStyle: {
        borderRadius: 24,
    },
    slideOverlay: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
        borderRadius: 24,
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
    },
    slideTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#FFFFFF',
        marginBottom: 8,
        letterSpacing: -0.5,
        lineHeight: 35,
        includeFontPadding: false,
    },
    slideSubtitle: {
        fontSize: 13,
        color: '#F1F5F9',
        fontWeight: '600',
        marginBottom: 16,
        lineHeight: 21,
        includeFontPadding: false,
    },
    slideButton: {
        backgroundColor: '#3B82F6',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    slideButtonText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '700',
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
        gap: 6,
    },
    paginationDot: {
        height: 6,
        borderRadius: 3,
    },
    paginationDotActive: {
        width: 20,
        backgroundColor: '#3B82F6',
    },
    paginationDotInactive: {
        width: 6,
        backgroundColor: '#CBD5E1',
    },
    dynamicServicesScroll: {
        paddingHorizontal: 20,
        paddingBottom: 10,
        gap: 16,
    },
    dynamicServiceCard: {
        width: 140,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 10,
        shadowColor: '#64748B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
        alignItems: 'center',
        marginRight: 16,
    },
    dynamicServiceImage: {
        width: '100%',
        height: 100,
        borderRadius: 16,
        marginBottom: 10,
        backgroundColor: '#F1F5F9',
    },
    dynamicServiceTitle: {
        fontSize: 14,
        fontWeight: '800',
        color: '#1E293B',
        textAlign: 'center',
        lineHeight: 20,
    },
    sectionTitle: {
        fontSize: width > 380 ? 20 : 18,
        fontWeight: '900',
        color: '#0F172A',
        marginBottom: 8,
        letterSpacing: -0.5,
        lineHeight: width > 380 ? 32 : 29,
        includeFontPadding: false,
    },
    servicesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 8,
        paddingTop: 4,
    },
    servicesGridList: {
        paddingTop: 4,
        paddingBottom: 36,
    },
    serviceRow: {
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    serviceItem: {
        width: '25%',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 4,
    },
    serviceImg: {
        width: '100%',
        height: '100%',
    },
    serviceIconContainer: {
        width: width > 380 ? 76 : 64,
        height: width > 380 ? 76 : 64,
        borderRadius: width > 380 ? 38 : 32,
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 6,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    serviceIcon: {
        fontSize: 28,
    },
    serviceName: {
        fontSize: 10,
        fontWeight: '700',
        color: '#475569',
        textAlign: 'center',
        marginTop: 2,
        lineHeight: 14,
        includeFontPadding: false,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        marginTop: 10,
    },
    seeAllText: {
        color: '#3B82F6',
        fontWeight: '700',
        fontSize: 14,
        marginBottom: 4,
    },
    verticalCardsContainer: {
        gap: 24,
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    expertsContainer: {
        paddingRight: width * 0.06,
        gap: 16,
        marginBottom: 32,
    },
    expertCard: {
        width: width * 0.42,
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 24,
        alignItems: 'center',
        shadowColor: '#64748B',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    expertImageContainer: {
        position: 'relative',
        marginBottom: 12,
    },
    expertImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    verifiedBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 2,
    },
    expertName: {
        fontSize: 14,
        fontWeight: '800',
        color: '#1E293B',
        marginBottom: 2,
        textAlign: 'center',
        lineHeight: 22,
        minHeight: 44,
        includeFontPadding: false,
    },
    expertJob: {
        fontSize: 11,
        color: '#64748B',
        fontWeight: '500',
        marginBottom: 8,
        lineHeight: 18,
        textAlign: 'center',
        includeFontPadding: false,
    },
    expertRatingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    expertRatingText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#334155',
        marginLeft: 4,
        marginRight: 4,
        lineHeight: 19,
        includeFontPadding: false,
    },
    expertReviewsText: {
        fontSize: 11,
        color: '#94A3B8',
        fontWeight: '500',
    },
    hireButton: {
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 12,
        width: '100%',
        alignItems: 'center',
    },
    hireButtonText: {
        color: '#3B82F6',
        fontWeight: '700',
        fontSize: 13,
    },
    howItWorksContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 20,
        shadowColor: '#64748B',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.05,
        shadowRadius: 16,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#F8FAFC',
    },
    stepContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    stepIconBg: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    featuredPortfolioCard: {
        width: '100%',
        minHeight: 220,
        borderRadius: 28,
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
        elevation: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
    },
    featuredImage: {
        flex: 1,
    },
    featuredOverlayGradient: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.3)',
        padding: 20,
        justifyContent: 'space-between',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    favoriteBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardInfoBox: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    cardTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    featuredName: {
        fontSize: 17,
        fontWeight: '900',
        color: '#1E293B',
        marginBottom: 2,
        lineHeight: 22,
        includeFontPadding: false,
    },
    featuredTagline: {
        fontSize: 11,
        color: '#64748B',
        fontWeight: '600',
        lineHeight: 18,
        includeFontPadding: false,
    },
    cardTextContainer: {
        flex: 1,
        marginRight: 8,
    },
    cardActionBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    featuredBadge: {
        backgroundColor: '#2563EB',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        gap: 6,
    },
    featuredBadgeText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1,
        lineHeight: 17,
        includeFontPadding: false,
    },
    stepContent: {
        flex: 1,
        marginLeft: 16,
    },
    stepTitle: {
        fontSize: 15,
        fontWeight: '800',
        color: '#1E293B',
        marginBottom: 4,
        lineHeight: 24,
        includeFontPadding: false,
    },
    stepDesc: {
        fontSize: 12,
        color: '#64748B',
        lineHeight: 19,
        includeFontPadding: false,
    },
    noResultsContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        paddingHorizontal: 40,
    },
    noResultsTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1E293B',
        marginTop: 16,
    },
    noResultsDesc: {
        fontSize: 14,
        color: '#64748B',
        textAlign: 'center',
        marginTop: 8,
        lineHeight: 20,
    },
    clearSearchBtn: {
        marginTop: 24,
        paddingVertical: 12,
        paddingHorizontal: 24,
        backgroundColor: '#3B82F6',
        borderRadius: 12,
    },
    clearSearchText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 14,
    },
    // Filter Chips
    filterChipContainer: {
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F8FAFC',
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    filterChipActive: {
        backgroundColor: '#3B82F6',
        borderColor: '#3B82F6',
    },
    filterChipText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#64748B',
    },
    filterChipTextActive: {
        color: '#FFFFFF',
    },

    // Search Suggestions Dropdown
    suggestionsDropdown: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 16,
        marginTop: -4,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#1E293B',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
        elevation: 10,
        zIndex: 100,
        overflow: 'hidden',
    },
    suggestionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 12,
    },
    suggestionItemBorder: {
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    suggestionIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    suggestionText: {
        flex: 1,
    },
    suggestionLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1E293B',
        lineHeight: 20,
        includeFontPadding: false,
    },
    suggestionSublabel: {
        fontSize: 11,
        color: '#94A3B8',
        fontWeight: '500',
        lineHeight: 16,
        includeFontPadding: false,
    },
    suggestionTypePill: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
    },
    suggestionTypeText: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 0.5,
        lineHeight: 14,
        includeFontPadding: false,
    },
    floatingBotBtn: {
        position: 'absolute',
        bottom: 30,
        right: 25,
        zIndex: 1000,
    },
    botBtnInner: {
        backgroundColor: '#FFFFFF',
        height: 56,
        borderRadius: 28,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 4,
        paddingRight: 20,
        shadowColor: '#2563EB',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 12,
        borderWidth: 2,
        borderColor: '#2563EB',
    },
    botBtnIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
    },
    botBtnTextContainer: {
        marginLeft: 10,
    },
    botBtnText: {
        color: '#2563EB',
        fontWeight: '900',
        fontSize: 14,
        letterSpacing: 0.5,
    },
});

export default UserDashboardScreen;
