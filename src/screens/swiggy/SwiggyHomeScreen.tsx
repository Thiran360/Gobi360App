import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Dimensions, StatusBar, FlatList, PermissionsAndroid, Platform, ActivityIndicator, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from 'react-native-geolocation-service';
import { useCart } from '../../context/CartContext';
import { BASE_URL } from '../../utils/apiConfig';
import { useLocationFetcher } from '../../hooks/useLocationFetcher';

const { width } = Dimensions.get('window');

const getSearchPlaceholder = (categoryName: string) => {
  const name = categoryName.toLowerCase();
  if (name.includes('food')) return 'Search for "Biryani"';
  if (name.includes('supermarket') || name.includes('grocery')) return 'Search for "Milk, Bread"';
  if (name.includes('organic')) return 'Search for "Organic Fruits"';
  if (name.includes('electronic') || name.includes('electrical')) return 'Search for "Cables, Switches"';
  if (name.includes('wood') || name.includes('hardware')) return 'Search for "Plywood"';
  if (name.includes('animal') || name.includes('pet') || name.includes('feed')) return 'Search for "Pet Food, Supplements"';
  return `Search in ${categoryName}...`;
};

const getDynamicBanners = (categoryName: string) => {
  const name = categoryName.toLowerCase();
  if (name.includes('supermarket') || name.includes('grocery')) {
    return [
      { id: '1', img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800&auto=format&fit=crop', title: 'FRESH VEGGIES', subtitle: 'Farm to your home' },
      { id: '2', img: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=800&auto=format&fit=crop', title: 'SUPER DEALS', subtitle: 'Upto 40% Off' },
      { id: '3', img: 'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?q=80&w=800&auto=format&fit=crop', title: 'DAILY ESSENTIALS', subtitle: 'Delivered in minutes' }
    ];
  }
  if (name.includes('electronic') || name.includes('electrical')) {
    return [
      { id: '1', img: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=800&auto=format&fit=crop', title: 'GADGET MANIA', subtitle: 'Top Electronics Deals' },
      { id: '2', img: 'https://images.unsplash.com/photo-1526406915894-7bcd65f60845?q=80&w=800&auto=format&fit=crop', title: 'SMART DEVICES', subtitle: 'Upgrade your home' }
    ];
  }
  if (name.includes('wood') || name.includes('hardware')) {
    return [
      { id: '1', img: 'https://images.unsplash.com/photo-1620575647573-0ff76b1778c1?q=80&w=800&auto=format&fit=crop', title: 'PREMIUM WOOD', subtitle: 'Best for furniture' },
      { id: '2', img: 'https://images.unsplash.com/photo-1581428982868-e410dd047a90?q=80&w=800&auto=format&fit=crop', title: 'HARDWARE TOOLS', subtitle: 'Top quality supplies' }
    ];
  }
  if (name.includes('animal') || name.includes('pet') || name.includes('feed')) {
    return [
      { id: '1', img: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=800&auto=format&fit=crop', title: 'HEALTHY PETS', subtitle: 'Premium Feeds' },
      { id: '2', img: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=800&auto=format&fit=crop', title: 'PET ESSENTIALS', subtitle: 'Toys & Accessories' }
    ];
  }
  // Default (Food)
  return [
    { id: '1', img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop', title: '50% OFF', subtitle: 'On your first order' },
    { id: '2', img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800&auto=format&fit=crop', title: 'FREE DELIVERY', subtitle: 'On orders above ₹199' },
    { id: '3', img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop', title: 'PIZZA PARTY', subtitle: 'Buy 1 Get 1 Free' }
  ];
};

const getDynamicMainServices = (categoryName: string) => {
  const name = categoryName.toLowerCase();
  if (name.includes('supermarket') || name.includes('grocery')) {
    return [{ id: 1, title: 'Grocery Delivery', subtitle: 'IN 10 MINS', icon: 'basket', color: '#16A34A', bg: '#DCFCE7' }];
  }
  if (name.includes('electronic') || name.includes('electrical')) {
    return [{ id: 1, title: 'Electronics', subtitle: 'SAME DAY DELIVERY', icon: 'lightning-bolt', color: '#2563EB', bg: '#DBEAFE' }];
  }
  if (name.includes('wood') || name.includes('hardware')) {
    return [{ id: 1, title: 'Hardware & Wood', subtitle: 'PREMIUM QUALITY', icon: 'hammer-wrench', color: '#B45309', bg: '#FEF3C7' }];
  }
  if (name.includes('animal') || name.includes('pet') || name.includes('feed')) {
    return [{ id: 1, title: 'Animal Feeds & Pets', subtitle: 'PREMIUM QUALITY', icon: 'paw', color: '#059669', bg: '#D1FAE5' }];
  }
  return [{ id: 1, title: 'Food Delivery', subtitle: 'UPTO 60% OFF', icon: 'food', color: '#3B82F6', bg: '#FFF0E6' }];
};

const RESTAURANTS = [
  { id: 'r1', name: 'Pannari Amman Restaurant', img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=400&auto=format&fit=crop' },
  { id: 'r2', name: 'Meghana Foods', img: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=400&auto=format&fit=crop' },
  { id: 'r3', name: 'A2B Adyar Ananda Bhavan', img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=400&auto=format&fit=crop' },
  { id: 'r4', name: 'Punjabi Dhaba', img: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=400&auto=format&fit=crop' },
  { id: 'r5', name: 'Domino\'s Pizza', img: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=400&auto=format&fit=crop' },
];

const MENU_CATEGORIES = [
  { id: '1', name: 'Biryani', icon: 'rice', img: 'https://i.pinimg.com/736x/87/90/92/879092970fe224f734b11609174f6b95.jpg' },
  { id: '2', name: 'Dosa', icon: 'food', img: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?q=80&w=400&auto=format&fit=crop' },
  { id: '3', name: 'Idly', icon: 'food-variant', img: 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?q=80&w=400&auto=format&fit=crop' },
  { id: '4', name: 'Noodles', icon: 'noodles', img: 'https://images.unsplash.com/photo-1612929633738-8fe01f7c2725?q=80&w=400&auto=format&fit=crop' },
];

const FOOD_ITEMS: Record<string, any[]> = {
  'Biryani': [
    { id: '1', name: 'Chicken Biryani', price: '₹220', img: 'https://i.pinimg.com/736x/87/90/92/879092970fe224f734b11609174f6b95.jpg', rating: 4.5, type: 'non-veg' },
    { id: '2', name: 'Mutton Biryani', price: '₹350', img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=400&auto=format&fit=crop', rating: 4.8, type: 'non-veg' },
  ],
  'Dosa': [
    { id: '1', name: 'Masala Dosa', price: '₹80', img: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?q=80&w=400&auto=format&fit=crop', rating: 4.6, type: 'veg' },
    { id: '2', name: 'Ghee Roast', price: '₹120', img: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?q=80&w=400&auto=format&fit=crop', rating: 4.9, type: 'veg' },
  ],
  'Idly': [
    { id: '1', name: 'Sambar Idly (2 pcs)', price: '₹40', img: 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?q=80&w=400&auto=format&fit=crop', rating: 4.5, type: 'veg' },
  ],
  'Noodles': [
    { id: '1', name: 'Veg Hakka Noodles', price: '₹160', img: 'https://images.unsplash.com/photo-1612929633738-8fe01f7c2725?q=80&w=400&auto=format&fit=crop', rating: 4.4, type: 'veg' },
  ]
};

const getDynamicTopPicks = (categoryName: string) => {
  const name = categoryName.toLowerCase();
  if (name.includes('supermarket') || name.includes('grocery')) {
    return [
      { id: '1', name: 'Fresh Apples (1kg)', restaurant: 'PVR Supermarket', rating: 4.8, time: '10-15 mins', price: '₹150', img: 'https://loremflickr.com/400/400/apples', offer: '20% OFF' },
      { id: '2', name: 'Aashirvaad Atta (5kg)', restaurant: 'Zha Supermarket', rating: 4.7, time: '15-20 mins', price: '₹280', img: 'https://loremflickr.com/400/400/flour', offer: 'Best Seller' },
      { id: '3', name: 'Nandini Toned Milk (500ml)', restaurant: 'PVR Supermarket', rating: 4.9, time: '10-15 mins', price: '₹24', img: 'https://loremflickr.com/400/400/milk', offer: 'Daily Essential' }
    ];
  }
  if (name.includes('electronic') || name.includes('electrical')) {
    return [
      { id: '1', name: 'Apple AirPods Pro', restaurant: 'Sakthi Electricals', rating: 4.8, time: 'Same Day', price: '₹18,500', img: 'https://loremflickr.com/400/400/airpods', offer: '10% Cashback' },
      { id: '2', name: 'Anchor Switches (10 Pcs)', restaurant: 'Sakthi Electricals', rating: 4.5, time: '2-3 Hours', price: '₹450', img: 'https://loremflickr.com/400/400/switches', offer: 'Bulk Discount' }
    ];
  }
  if (name.includes('wood') || name.includes('hardware')) {
    return [
      { id: '1', name: 'Century Plywood (8x4)', restaurant: 'Sai Plywoods', rating: 4.6, time: 'Same Day', price: '₹1,200', img: 'https://loremflickr.com/400/400/plywood', offer: 'Free Delivery' },
      { id: '2', name: 'Godrej Mortise Lock', restaurant: 'Wood Zone', rating: 4.7, time: 'Same Day', price: '₹850', img: 'https://loremflickr.com/400/400/padlock', offer: 'Secure Home' }
    ];
  }
  if (name.includes('animal') || name.includes('pet') || name.includes('feed')) {
    return [
      { id: '1', name: 'Premium Dog Food (3kg)', restaurant: 'Pet Care Center', rating: 4.7, time: 'Same Day', price: '₹850', img: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=400&auto=format&fit=crop', offer: '10% OFF' },
      { id: '2', name: 'Bird Seed Mix (1kg)', restaurant: 'Pet Care Center', rating: 4.5, time: 'Same Day', price: '₹150', img: 'https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=400&auto=format&fit=crop', offer: 'Best Seller' }
    ];
  }
  // Default (Food)
  return [
    { id: '1', name: 'Hyderabadi Dum Biryani', restaurant: 'Meghana Foods', rating: 4.5, time: '30-35 mins', price: '₹320', img: 'https://i.pinimg.com/736x/87/90/92/879092970fe224f734b11609174f6b95.jpg', offer: '60% OFF up to ₹120' },
    { id: '2', name: 'Paneer Butter Masala', restaurant: 'Punjabi Dhaba', rating: 4.2, time: '25-30 mins', price: '₹240', img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=800&auto=format&fit=crop', offer: 'Flat ₹50 OFF' },
    { id: '3', name: 'Farmhouse Pizza', restaurant: 'Domino\'s Pizza', rating: 4.1, time: '30 mins', price: '₹399', img: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=800&auto=format&fit=crop', offer: 'Buy 1 Get 1 Free' },
    { id: '4', name: 'Ghee Roast Dosa', restaurant: 'A2B - Adyar Ananda Bhavan', rating: 4.6, time: '20-25 mins', price: '₹120', img: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?q=80&w=800&auto=format&fit=crop', offer: '20% OFF' },
  ];
};

const SwiggyHomeScreen = ({ route }: any) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const categoryId = route?.params?.categoryId || 1;
  const categoryName = route?.params?.categoryName || 'Food Delivery';
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { userLocation, fetchExactLocation: fetchRealLocation, loadSavedLocation } = useLocationFetcher();
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string | null>(null);
  const { items, addToCart, updateQuantity, getTotalItems, getTotalPrice } = useCart();
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [menuCategories, setMenuCategories] = useState<any[]>([]);
  const [foodItems, setFoodItems] = useState<Record<string, any[]>>({});
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(route?.params?.autoSearch || '');

  React.useEffect(() => {
    if (route?.params?.autoSearch) {
      setSearchQuery(route.params.autoSearch);
    }
  }, [route?.params?.autoSearch]);

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const lowerQuery = searchQuery.toLowerCase().trim();
    const matches: any[] = [];
    Object.keys(foodItems).forEach(cat => {
      foodItems[cat].forEach(item => {
        if (item.name.toLowerCase().includes(lowerQuery)) {
          matches.push(item);
        }
      });
    });
    return matches;
  }, [searchQuery, foodItems]);

  const filteredShops = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const lowerQuery = searchQuery.toLowerCase().trim();
    return restaurants.filter(r => r.name.toLowerCase().includes(lowerQuery));
  }, [searchQuery, restaurants]);

  useEffect(() => {
    const fetchMenuAndFoods = async () => {
      try {
        let fetchedCategories: any[] = [];
        const catUrl = categoryId ? `${BASE_URL}/gobi360/product-categories/?category=${categoryId}` : `${BASE_URL}/gobi360/product-categories/`;
        const catRes = await fetch(catUrl);
        if (catRes.ok) {
          const catData = await catRes.json();
          if (Array.isArray(catData)) {
            fetchedCategories = catData.map((cat: any) => {
              let imageUrl = cat.image_url || cat.image || 'https://via.placeholder.com/400';
              if (imageUrl.startsWith('/')) {
                  imageUrl = `${BASE_URL}${imageUrl}`;
              } else if (imageUrl.startsWith('http://')) {
                  imageUrl = imageUrl.replace('http://', 'https://');
              }
              return {
                id: cat.id.toString(),
                name: cat.name,
                icon: 'food', 
                img: imageUrl,
                shop: cat.shop?.toString()
              };
            });
            // Only set if we actually have dynamic categories, else keep empty
            setMenuCategories(fetchedCategories);
          }
        }

        const prodUrl = categoryId ? `${BASE_URL}/gobi360/products/?category=${categoryId}` : `${BASE_URL}/gobi360/products/`;
        const varUrl = `${BASE_URL}/gobi360/product-variations/`;
        const prodRes = await fetch(prodUrl);
        const varRes = await fetch(varUrl);
        
        if (prodRes.ok) {
          const prodData = await prodRes.json();
          let varData: any[] = [];
          if (varRes.ok) {
              const rawVarData = await varRes.json();
              if (Array.isArray(rawVarData)) {
                varData = rawVarData;
              } else if (rawVarData && Array.isArray(rawVarData.results)) {
                varData = rawVarData.results;
              } else if (rawVarData && Array.isArray(rawVarData.data)) {
                varData = rawVarData.data;
              } else if (rawVarData && typeof rawVarData === 'object') {
                const foundArray = Object.values(rawVarData).find(v => Array.isArray(v));
                if (foundArray) varData = foundArray as any[];
              }
          }

          if (prodData && prodData.length > 0) {
            const newFoodItems: Record<string, any[]> = {};
            
            prodData.forEach((prod: any) => {
              const category = fetchedCategories.find(c => c.id === prod.product_category?.toString());
              const catName = category ? category.name : 'Other';
              const shopId = category ? category.shop?.toString() : null;

              if (!newFoodItems[catName]) {
                newFoodItems[catName] = [];
              }
              
              let imageUrl = prod.image_url || prod.image || 'https://via.placeholder.com/400';
              if (imageUrl.startsWith('/')) {
                  imageUrl = `${BASE_URL}${imageUrl}`;
              } else if (imageUrl.startsWith('http://')) {
                  imageUrl = imageUrl.replace('http://', 'https://');
              }

              const variations = varData.filter((v: any) => v.product?.toString() === prod.id?.toString());

              newFoodItems[catName].push({
                id: prod.id.toString(),
                name: prod.name,
                price: prod.price ? `₹${Number(prod.price).toFixed(0)}` : null,
                img: imageUrl,
                rating: prod.rating || 4.5,
                type: prod.is_veg ? 'veg' : 'non-veg',
                variations: variations,
                shopId: shopId
              });
            });

              if (Object.keys(newFoodItems).length > 0) {
                  setFoodItems(newFoodItems);
                  setSelectedCategoryName(Object.keys(newFoodItems)[0]);
              } else {
                  setFoodItems({});
                  setSelectedCategoryName(null);
              }
            } else {
              setFoodItems({});
            }
          } else {
            setFoodItems({});
          }
        } catch (error) {
          console.log('Error fetching products:', error);
          setFoodItems({});
        }
      };
    fetchMenuAndFoods();
  }, [categoryId]);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const shopsUrl = categoryId ? `${BASE_URL}/gobi360/shops/?category=${categoryId}` : `${BASE_URL}/gobi360/shops/`;
        const res = await fetch(shopsUrl);
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            const mappedShops = data.map((shop: any) => {
              let imageUrl = shop.image_url || shop.shop_image || shop.image || 'https://via.placeholder.com/400';
              if (imageUrl.startsWith('/')) {
                  // Prepend the backend base URL if it's a relative path
                  imageUrl = `${BASE_URL}${imageUrl}`;
              } else if (imageUrl.startsWith('http://')) {
                  // Force HTTPS for Android
                  imageUrl = imageUrl.replace('http://', 'https://');
              }
              return {
                id: shop.id.toString(),
                name: shop.name || shop.shop_name || 'Unnamed Shop',
                img: imageUrl,
                phone: shop.description?.match(/^\d{10}$/) ? shop.description : null
              };
            });
            
            // Since we pass category to backend, we can just use the response.
            // If backend doesn't filter, we'll manually filter just in case.
            const filteredShops = categoryId 
                ? mappedShops.filter((s: any) => data.find((d: any) => d.id.toString() === s.id && d.category?.toString() === categoryId.toString()))
                : mappedShops;
                
            setRestaurants(filteredShops.length > 0 ? filteredShops : []);
          } else {
            setRestaurants([]);
          }
        } else {
          setRestaurants([]);
        }
      } catch (error) {
        console.log('Error fetching shops:', error);
        setRestaurants([]);
      }
    };
    fetchShops();
  }, [categoryId]);

  const handleUpdateCart = useCallback((product: any, variation: any, delta: number) => {
    const cartItemId = variation ? `${product.id}_var_${variation.id}` : product.id;
    const existingItem = items.find((i: any) => i.id === cartItemId);
    
    if (existingItem) {
        updateQuantity(cartItemId, delta);
    } else if (delta > 0) {
        // Add new item
        addToCart({
            id: cartItemId,
            productId: product.id,
            name: product.name,
            price: variation ? Number(variation.price) : Number(product.price?.replace('₹', '') || 0),
            quantity: 1,
            variationName: variation ? variation.variation_value : undefined,
            type: product.type,
            shopId: product.shopId ?? null,
        });
    }
  }, [items, updateQuantity, addToCart]);

  const getQty = useCallback((cartItemId: string) => {
    return items.find((i: any) => i.id === cartItemId)?.quantity || 0;
  }, [items]);

  const renderFoodItem = useCallback(({ item }: any) => {
    const shop = item.shopId ? restaurants.find((r: any) => r.id === item.shopId) : null;
    const shopName = shop ? shop.name : null;

    return (
      <FoodItemCard 
        key={item.id} 
        item={item} 
        shopName={shopName} 
        searchQuery={searchQuery} 
        getQty={getQty} 
        handleUpdateCart={handleUpdateCart} 
      />
    );
  }, [restaurants, searchQuery, getQty, handleUpdateCart]);

  useEffect(() => {
    loadSavedLocation();
    fetchRealLocation();
  }, []);

  // Auto Slider Logic (Disabled to prevent heavy UI lag on all mobiles)
  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     if (searchQuery.trim().length > 0) return;
  //     let nextIndex = currentIndex + 1;
  //     const banners = getDynamicBanners(categoryName);
  //     if (banners.length === 0) return;
  //     if (nextIndex >= banners.length) {
  //       nextIndex = 0;
  //     }
  //     try {
  //       if (flatListRef.current) {
  //         flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
  //         setCurrentIndex(nextIndex);
  //       }
  //     } catch (error) {
  //       // Ignore scroll errors when unmounted or layout not ready
  //     }
  //   }, 4000);
  //
  //   return () => clearInterval(timer);
  // }, [currentIndex, searchQuery, categoryName]);

  const renderBanner = ({ item }: { item: any }) => (
    <View style={styles.bannerContainer}>
      <Image source={{ uri: item.img }} style={styles.bannerImage} />
      <View style={styles.bannerOverlay}>
        <Text style={styles.bannerTitle}>{item.title}</Text>
        <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* ── Ultra UI Header ── */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} activeOpacity={0.7}>
            <View style={styles.backIconBg}>
              <Icon name="arrow-left" size={24} color="#0F172A" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.locationContainer, { marginLeft: 12 }]} 
            onPress={() => fetchRealLocation(true)}
            activeOpacity={0.7}
          >
            <View style={styles.locationIconWrap}>
              <Icon name="navigation-variant" size={24} color="#3B82F6" />
            </View>
            <View style={styles.locationTextContainer}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.locationTitle}>Home</Text>
                <Icon name="chevron-down" size={20} color="#1E293B" style={{ marginLeft: 4 }} />
              </View>
              <Text style={styles.locationDesc} numberOfLines={1}>{userLocation}</Text>
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.profileIconWrap} onPress={() => navigation.navigate('SwiggyProfile')} activeOpacity={0.8}>
          <Image source={{uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'}} style={styles.profileImage} />
        </TouchableOpacity>
      </View>

      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        data={searchQuery.trim().length > 0 ? filteredProducts : (selectedRestaurantId && selectedCategoryName && foodItems[selectedCategoryName] ? foodItems[selectedCategoryName] : [])}
        keyExtractor={(item, index) => 'prod_' + item.id + '_' + index}
        renderItem={renderFoodItem}
        initialNumToRender={10}
        windowSize={11}
        maxToRenderPerBatch={10}
        ListHeaderComponent={
          <>
        
        {/* ── Search Bar ── */}
        <View style={styles.searchWrapper}>
          <View style={styles.searchContainer}>
            <Icon name="magnify" size={26} color="#3B82F6" style={styles.searchIcon} />
            <TextInput
              style={{ flex: 1, padding: 0, margin: 0, color: '#1E293B', fontSize: 15, fontWeight: '600' }}
              placeholder={getSearchPlaceholder(categoryName)}
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')} style={{ padding: 4, marginRight: 8 }}>
                <Icon name="close-circle" size={20} color="#94A3B8" />
              </TouchableOpacity>
            )}
            <View style={styles.micDivider} />
            <Icon name="microphone" size={24} color="#3B82F6" style={styles.micIcon} />
          </View>
        </View>

        {searchQuery.trim().length > 0 ? (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Search Results</Text>
            
            {filteredShops.length > 0 && (
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: '#1E293B', marginBottom: 12 }}>Shops</Text>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.foodCatsList}
                  data={filteredShops}
                  keyExtractor={item => 'shop_' + item.id}
                  initialNumToRender={5}
                  maxToRenderPerBatch={5}
                  windowSize={5}
                  renderItem={({ item }) => (
                    <TouchableOpacity 
                      style={styles.foodCatItem} 
                      activeOpacity={0.8}
                      onPress={() => {
                        setSearchQuery('');
                        setSelectedRestaurantId(item.id);
                        setSelectedCategoryName(null);
                      }}
                    >
                      <Image source={{ uri: item.img }} style={styles.foodCatImg} />
                      <Text style={styles.foodCatName} numberOfLines={1}>{item.name}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}

            {filteredProducts.length > 0 && (
              <View>
                <Text style={{ fontSize: 16, fontWeight: '700', color: '#1E293B', marginBottom: 12 }}>Products</Text>
              </View>
            )}

            {filteredProducts.length === 0 && filteredShops.length === 0 && (
              <Text style={{ textAlign: 'center', marginTop: 20, color: '#64748B' }}>No results found for "{searchQuery}"</Text>
            )}
          </View>
        ) : (
          <>
        {/* ── Auto Slider Top ── */}
        <View style={styles.sliderWrapper}>
          <FlatList
            ref={flatListRef}
            data={getDynamicBanners(categoryName)}
            renderItem={renderBanner}
            keyExtractor={item => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(event.nativeEvent.contentOffset.x / width);
              setCurrentIndex(index);
            }}
          />
          <View style={styles.pagination}>
            {getDynamicBanners(categoryName).map((_, idx) => (
              <View key={idx} style={[styles.dot, currentIndex === idx && styles.activeDot]} />
            ))}
          </View>
        </View>

        {/* ── Restaurants (What's on your mind?) ── */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{categoryName ? `${categoryName} Shops` : 'Restaurants / Shops'}</Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.foodCatsList}
            data={restaurants}
            keyExtractor={item => 'rest_' + item.id}
            initialNumToRender={4}
            maxToRenderPerBatch={4}
            windowSize={5}
            renderItem={({ item }) => {
              const isSelected = selectedRestaurantId === item.id;
              return (
                <TouchableOpacity 
                  style={[styles.foodCatItem, isSelected && styles.selectedRestaurantItem]} 
                  activeOpacity={0.8}
                  onPress={() => {
                    if (isSelected) {
                      setSelectedRestaurantId(null);
                      setSelectedCategoryName(null);
                    } else {
                      setSelectedRestaurantId(item.id);
                      setSelectedCategoryName(null);
                    }
                  }}
                >
                  <Image source={{ uri: item.img }} style={[styles.foodCatImg, isSelected && styles.selectedImgBorder]} />
                  <Text style={[styles.foodCatName, isSelected && styles.selectedText]} numberOfLines={1}>{item.name}</Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>

        {/* ── Inline Categories for Selected Restaurant ── */}
        {selectedRestaurantId && (
          <View style={styles.inlineSectionContainer}>
            <Text style={styles.inlineSectionTitle}>Categories</Text>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.foodCatsList}
              data={menuCategories.filter(c => c.shop === selectedRestaurantId)}
              keyExtractor={item => 'cat_' + item.id}
              initialNumToRender={4}
              maxToRenderPerBatch={4}
              windowSize={5}
              renderItem={({ item }) => {
                const isSelected = selectedCategoryName === item.name;
                return (
                  <TouchableOpacity 
                    style={styles.inlineCategoryWrapper} 
                    activeOpacity={0.8}
                    onPress={() => {
                      if (isSelected) {
                        setSelectedCategoryName(null);
                      } else {
                        setSelectedCategoryName(item.name);
                      }
                    }}
                  >
                    <View style={[styles.inlineCategoryCard, isSelected && styles.selectedCategoryCard]}>
                      <Image source={{ uri: item.img }} style={styles.inlineCatImg} />
                      <View style={styles.inlineCatOverlay} />
                    </View>
                    <Text style={[styles.inlineCatNameBelow, isSelected && styles.selectedText]}>{item.name}</Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        )}

        {/* ── Inline Food Items for Selected Category ── */}
        {selectedRestaurantId && selectedCategoryName && (
          (() => {
            const activeCategoryName = selectedCategoryName;
            
            // Only render if there's a valid category with items
            if (!activeCategoryName || !foodItems[activeCategoryName] || foodItems[activeCategoryName].length === 0) {
              return (
                <View style={[styles.inlineSectionContainer, { paddingVertical: 20 }]}>
                   <Text style={[styles.inlineSectionTitle, { textAlign: 'center', color: '#9CA3AF' }]}>No items available for this shop yet.</Text>
                </View>
              );
            }

            return (
              <View style={styles.inlineSectionContainer}>
                <Text style={styles.inlineSectionTitle}>{activeCategoryName}</Text>
              </View>
            );
          })()
        )}
          </>
        )}
          </>
        }
        ListFooterComponent={
          !searchQuery.trim().length ? (
            <>

        {/* ── Main Services (Instamart, Genie, etc) ── */}
        <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Quick Access</Text>
            <View style={styles.servicesGrid}>
            {getDynamicMainServices(categoryName).map((item, index) => (
                <TouchableOpacity 
                key={item.id} 
                style={styles.serviceCard}
                onPress={() => {
                    // Do nothing for now, it's just quick access UI
                }}
                activeOpacity={0.9}
                >
                <View style={[styles.serviceIconBg, { backgroundColor: item.bg }]}>
                    <Icon name={item.icon} size={28} color={item.color} />
                </View>
                <View style={styles.serviceTextContainer}>
                    <Text style={styles.serviceTitle}>{item.title}</Text>
                    <Text style={styles.serviceSubtitle}>{item.subtitle}</Text>
                </View>
                <Icon name="chevron-right" size={24} color="#CBD5E1" />
                </TouchableOpacity>
            ))}
            </View>
        </View>

        <View style={styles.divider} />


            </>
          ) : null
        }
      />

      {/* ── Floating View Cart Button ── */}
      {getTotalItems() > 0 && (
        <View style={styles.floatingCartWrap}>
          <TouchableOpacity 
            style={styles.floatingCartBtn} 
            activeOpacity={0.9}
            onPress={() => navigation.navigate('SwiggyCart')}
          >
            <View>
              <Text style={styles.floatingCartItems}>{getTotalItems()} items added</Text>
              <Text style={styles.floatingCartSub}>Extra charges may apply</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.floatingCartViewText}>View Cart</Text>
              <Icon name="chevron-right" size={24} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
        </View>
      )}

      {/* ── Floating Call Button for Selected Shop ── */}
      {(() => {
        const selectedShopObj = selectedRestaurantId ? restaurants.find(r => r.id === selectedRestaurantId) : null;
        if (selectedShopObj && selectedShopObj.phone) {
          return (
            <TouchableOpacity 
              style={{
                position: 'absolute',
                bottom: getTotalItems() > 0 ? 100 : 24,
                right: 16,
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: '#10B981',
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#10B981',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 6,
                zIndex: 100
              }} 
              activeOpacity={0.9}
              onPress={() => Linking.openURL(`tel:${selectedShopObj.phone}`)}
            >
              <Icon name="phone" size={28} color="#FFFFFF" />
            </TouchableOpacity>
          );
        }
        return null;
      })()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  backIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationIconWrap: {
    backgroundColor: '#FFF0E6',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  locationTextContainer: {
    flex: 1,
  },
  locationTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 0.2,
  },
  locationDesc: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '600',
    paddingRight: 20,
  },
  profileIconWrap: {
    marginLeft: 16,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  profileImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  scrollContent: {
    paddingBottom: 120,
    backgroundColor: '#F8FAFC',
  },
  searchWrapper: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingBottom: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 4,
    zIndex: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    height: 60,
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#94A3B8',
  },
  searchIcon: {
    marginRight: 12,
  },
  micDivider: {
    width: 2,
    height: 24,
    backgroundColor: '#F1F5F9',
    marginHorizontal: 12,
    borderRadius: 1,
  },
  micIcon: {
    marginLeft: 4,
  },
  sliderWrapper: {
    marginTop: 24,
    position: 'relative',
  },
  bannerContainer: {
    width: width,
    paddingHorizontal: 16,
  },
  bannerImage: {
    width: '100%',
    height: 200,
    borderRadius: 24,
  },
  bannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 16,
    right: 16,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 24,
    padding: 24,
    justifyContent: 'flex-end',
  },
  bannerTitle: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  bannerSubtitle: {
    color: '#E2E8F0',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 6,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 4,
  },
  activeDot: {
    width: 20,
    backgroundColor: '#3B82F6',
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 20,
    letterSpacing: -0.5,
  },
  foodCatsList: {
    paddingRight: 16,
  },
  foodCatItem: {
    alignItems: 'center',
    marginRight: 20,
  },
  foodCatImg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  foodCatName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#334155',
    textAlign: 'center',
    width: 80,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  serviceCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#FFF0E6',
  },
  serviceIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  serviceTextContainer: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#1E293B',
  },
  serviceSubtitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    marginTop: 4,
  },
  foodCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    marginBottom: 20,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 6,
    overflow: 'hidden',
  },
  foodImgWrap: {
    position: 'relative',
    width: '100%',
    height: 200,
  },
  foodImage: {
    width: '100%',
    height: '100%',
  },
  offerBadge: {
    position: 'absolute',
    top: 16,
    left: -8,
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  offerText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '900',
  },
  timeBadge: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(255,255,255,0.95)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E293B',
    marginLeft: 4,
  },
  foodInfo: {
    padding: 20,
  },
  foodInfoTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  foodName: {
    flex: 1,
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    marginRight: 16,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16A34A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
    marginRight: 2,
  },
  foodRestaurant: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 12,
  },
  foodPrice: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1E293B',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 12,
    marginHorizontal: 16,
  },
  exploreGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  exploreItem: {
    alignItems: 'center',
    width: '31%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 24,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F8FAFC',
  },
  exploreIconBg: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  exploreText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#334155',
    textAlign: 'center',
  },
  selectedRestaurantItem: {
    transform: [{ scale: 1.05 }],
  },
  selectedImgBorder: {
    borderColor: '#3B82F6',
    borderWidth: 3,
  },
  selectedText: {
    color: '#3B82F6',
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
  },
  callButtonText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  inlineSectionContainer: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F8FAFC',
  },
  inlineSectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  inlineCategoryWrapper: {
    alignItems: 'center',
    marginRight: 16,
    width: 80,
  },
  inlineCategoryCard: {
    width: 90,
    height: 100,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    backgroundColor: '#F1F5F9',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCategoryCard: {
    borderColor: '#3B82F6',
  },
  inlineCatImg: {
    width: '100%',
    height: '100%',
  },
  inlineCatOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  inlineCatNameBelow: {
    color: '#1E293B',
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
  },
  inlineFoodCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 16,
    marginBottom: 28,
    shadowColor: '#475569',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
    borderWidth: 0,
  },
  inlineFoodInfo: {
    flex: 1,
    paddingRight: 16,
  },
  inlineFoodName: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1E293B',
    marginBottom: 6,
  },
  inlineFoodPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
  },
  inlineRatingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  inlineRatingText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#D97706',
    marginLeft: 4,
  },
  inlineFoodImageContainer: {
    width: 140,
    height: 140,
    borderRadius: 24,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
  inlineFoodImage: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
  },
  inlineAddBtn: {
    position: 'absolute',
    bottom: -16,
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 28,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  inlineAddBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#3B82F6',
    letterSpacing: 0.5,
  },
  inlineQuantityControl: {
    position: 'absolute',
    bottom: -16,
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 96,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  qtyBtn: {
    paddingHorizontal: 4,
  },
  qtyText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#3B82F6',
  },
  floatingCartWrap: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    zIndex: 100,
  },
  floatingCartBtn: {
    backgroundColor: '#16A34A',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  floatingCartItems: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  floatingCartSub: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  floatingCartViewText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    marginRight: 4,
  }
});

const FoodItemCard = React.memo(({ item, shopName, searchQuery, getQty, handleUpdateCart }: any) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
      <TouchableOpacity 
        style={[styles.inlineFoodCard, { flexDirection: 'column' }]} 
        activeOpacity={0.8}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View 
            style={styles.inlineFoodInfo}
          >
            <View style={{ marginBottom: 8, alignSelf: 'flex-start' }}>
              <Icon name="square-circle" size={18} color={item.type === 'veg' ? '#16A34A' : '#DC2626'} />
            </View>
            <Text style={styles.inlineFoodName}>{item.name}</Text>
            {searchQuery.trim().length > 0 && shopName && (
              <Text style={{ fontSize: 12, color: '#64748B', marginTop: 2, fontWeight: '600' }}>
                <Icon name="storefront-outline" size={12} /> {shopName}
              </Text>
            )}
            {item.price ? (
              <Text style={styles.inlineFoodPrice}>{item.price}</Text>
            ) : (
              item.variations && item.variations.length > 0 && (
                <Text style={[styles.inlineFoodPrice, { color: '#64748B', fontSize: 13, marginTop: 2 }]}>Customizable</Text>
              )
            )}
            <View style={styles.inlineRatingBadge}>
              <Icon name="star" size={12} color="#F59E0B" />
              <Text style={styles.inlineRatingText}>{item.rating}</Text>
            </View>
            {item.variations && item.variations.length > 0 && !isExpanded && (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12, backgroundColor: '#1E293B', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, alignSelf: 'flex-start', borderWidth: 1, borderColor: '#334155', elevation: 2 }}>
                <View style={{ backgroundColor: '#38BDF8', width: 6, height: 6, borderRadius: 3, marginRight: 6 }} />
                <Text style={{ fontSize: 11, color: '#F8FAFC', fontWeight: '800', letterSpacing: 0.5, marginRight: 4, textTransform: 'uppercase' }}>
                  Select Variations
                </Text>
                <Icon name="chevron-down" size={16} color="#94A3B8" />
              </View>
            )}
          </View>
          <View style={styles.inlineFoodImageContainer}>
            <Image source={{ uri: item.img }} style={styles.inlineFoodImage} />
            {(!item.variations || item.variations.length === 0) && (
              !getQty(item.id) ? (
                <TouchableOpacity style={styles.inlineAddBtn} activeOpacity={0.8} onPress={() => handleUpdateCart(item, null, 1)}>
                  <Text style={styles.inlineAddBtnText}>ADD</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.inlineQuantityControl}>
                  <TouchableOpacity onPress={() => handleUpdateCart(item, null, -1)} style={styles.qtyBtn}>
                    <Icon name="minus" size={16} color="#3B82F6" />
                  </TouchableOpacity>
                  <Text style={styles.qtyText}>{getQty(item.id)}</Text>
                  <TouchableOpacity onPress={() => handleUpdateCart(item, null, 1)} style={styles.qtyBtn}>
                    <Icon name="plus" size={16} color="#3B82F6" />
                  </TouchableOpacity>
                </View>
              )
            )}
          </View>
        </View>

        {/* Variations Section */}
        {isExpanded && item.variations && item.variations.length > 0 && (
          <View style={{ marginTop: 16, borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 16 }}>
            <Text style={{ fontSize: 14, fontWeight: '800', color: '#1E293B', marginBottom: 12 }}>Select Variation</Text>
            {item.variations.map((vari: any) => (
              <View key={vari.id} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC', padding: 12, borderRadius: 12, marginBottom: 8 }}>
                <View>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: '#334155' }}>{vari.variation_value}</Text>
                  <Text style={{ fontSize: 14, fontWeight: '900', color: '#1E293B', marginTop: 4 }}>₹{Number(vari.price).toFixed(0)}</Text>
                </View>
                {!getQty(`${item.id}_var_${vari.id}`) ? (
                  <TouchableOpacity 
                    style={{ backgroundColor: '#FFF', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: {width: 0, height: 2}, shadowRadius: 4, elevation: 2 }}
                    activeOpacity={0.8}
                    onPress={() => handleUpdateCart(item, vari, 1)}
                  >
                    <Text style={{ color: '#3B82F6', fontWeight: '900', fontSize: 13 }}>ADD</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 10, borderWidth: 1, borderColor: '#3B82F6', paddingHorizontal: 8, paddingVertical: 6, width: 80, justifyContent: 'space-between' }}>
                    <TouchableOpacity onPress={() => handleUpdateCart(item, vari, -1)} style={{ padding: 4 }}>
                      <Icon name="minus" size={14} color="#3B82F6" />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 14, fontWeight: '900', color: '#3B82F6' }}>{getQty(`${item.id}_var_${vari.id}`)}</Text>
                    <TouchableOpacity onPress={() => handleUpdateCart(item, vari, 1)} style={{ padding: 4 }}>
                      <Icon name="plus" size={14} color="#3B82F6" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </TouchableOpacity>
  );
});

export default SwiggyHomeScreen;
