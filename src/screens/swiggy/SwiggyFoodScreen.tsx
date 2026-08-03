import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, FlatList, StatusBar, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const { width } = Dimensions.get('window');

const FOOD_CATEGORIES = [
  { id: '1', name: 'Biryani', image: 'https://i.pinimg.com/736x/87/90/92/879092970fe224f734b11609174f6b95.jpg' },
  { id: '2', name: 'Pizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=400&auto=format&fit=crop' },
  { id: '3', name: 'Burger', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400&auto=format&fit=crop' },
  { id: '4', name: 'Chinese', image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=400&auto=format&fit=crop' },
  { id: '5', name: 'Desserts', image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=400&auto=format&fit=crop' },
];

const RESTAURANTS = [
  {
    id: 'r1',
    name: 'KFC',
    rating: '4.2',
    time: '25-30 mins',
    cuisines: 'Burgers, Fast Food',
    location: 'Main Road',
    image: 'https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?q=80&w=800&auto=format&fit=crop',
    offer: 'ITEMS AT ₹179',
    freeDelivery: true
  },
  {
    id: 'r2',
    name: 'Domino\'s Pizza',
    rating: '4.4',
    time: '30-35 mins',
    cuisines: 'Pizzas, Italian',
    location: 'Town Square',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop',
    offer: '₹125 OFF ABOVE ₹299',
    freeDelivery: false
  },
  {
    id: 'r3',
    name: 'Thalappakatti Biryani',
    rating: '4.3',
    time: '40-45 mins',
    cuisines: 'Biryani, South Indian',
    location: 'Bypass Road',
    image: 'https://i.pinimg.com/1200x/1a/6d/f1/1a6df1c7ed7cb1465fa511d3c62e4238.jpg',
    offer: '20% OFF UPTO ₹50',
    freeDelivery: true
  },
  {
    id: 'r4',
    name: 'A2B - Adyar Ananda Bhavan',
    rating: '4.5',
    time: '15-20 mins',
    cuisines: 'South Indian, Sweets',
    location: 'Bus Stand',
    image: 'https://i.pinimg.com/1200x/fe/eb/1c/feeb1cb659b8008713da7590394a93e3.jpg',
    offer: 'FLAT 10% OFF',
    freeDelivery: false
  },
  {
    id: 'r5',
    name: 'Burger King',
    rating: '4.1',
    time: '35-40 mins',
    cuisines: 'American, Fast Food',
    location: 'Gobi Main Road',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop',
    offer: '60% OFF UPTO ₹120',
    freeDelivery: true
  },
  {
    id: 'r6',
    name: 'Sri Krishna Sweets',
    rating: '4.7',
    time: '20-25 mins',
    cuisines: 'Desserts, Sweets',
    location: 'Bazaar Street',
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=800&auto=format&fit=crop',
    offer: 'BUY 1 GET 1 FREE',
    freeDelivery: false
  },
];

const SwiggyFoodScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const renderRestaurant = ({ item }: { item: typeof RESTAURANTS[0] }) => (
    <TouchableOpacity 
      style={styles.restaurantCard}
      onPress={() => navigation.navigate('SwiggyRestaurantDetail', { restaurantId: item.id })}
      activeOpacity={0.9}
    >
      <View style={styles.restaurantImageContainer}>
        <Image source={{ uri: item.image }} style={styles.restaurantImage} />
        <View style={styles.offerOverlay}>
          <Text style={styles.offerText}>{item.offer}</Text>
        </View>
        <TouchableOpacity style={styles.favoriteButton} activeOpacity={0.8}>
          <View style={styles.favoriteIconBg}>
            <Icon name="heart-outline" size={20} color="#334155" />
          </View>
        </TouchableOpacity>
        <View style={styles.timeBadge}>
            <Icon name="clock-outline" size={14} color="#1E293B" />
            <Text style={styles.timeBadgeText}>{item.time}</Text>
        </View>
      </View>
      <View style={styles.restaurantInfo}>
        <View style={styles.restaurantHeader}>
          <Text style={styles.restaurantName} numberOfLines={1}>{item.name}</Text>
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>{item.rating}</Text>
            <Icon name="star" size={12} color="#FFF" />
          </View>
        </View>
        <Text style={styles.cuisinesText} numberOfLines={1}>{item.cuisines}</Text>
        <Text style={styles.locationText}>{item.location}</Text>
        
        {item.freeDelivery && (
          <View style={styles.freeDeliveryBadge}>
            <View style={styles.freeDeliveryIconBg}>
                <Icon name="bike-fast" size={14} color="#8C31D8" />
            </View>
            <Text style={styles.freeDeliveryText}>FREE DELIVERY</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* ── Top Header ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} activeOpacity={0.7}>
          <View style={styles.backIconBg}>
            <Icon name="arrow-left" size={22} color="#0F172A" />
          </View>
        </TouchableOpacity>
        <View style={styles.addressContainer}>
          <Text style={styles.deliveryTo}>DELIVERING TO</Text>
          <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 2}}>
            <Text style={styles.addressText} numberOfLines={1}>Home - 123, Main Street</Text>
            <Icon name="chevron-down" size={18} color="#0F172A" style={{marginLeft: 4}} />
          </View>
        </View>
        <TouchableOpacity style={styles.searchButton} activeOpacity={0.7}>
          <View style={styles.searchIconBg}>
            <Icon name="magnify" size={24} color="#0F172A" />
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* ── What's on your mind? ── */}
        <View style={styles.mindSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>What's on your mind?</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mindScroll} contentContainerStyle={styles.mindScrollContent}>
            {FOOD_CATEGORIES.map(cat => (
              <TouchableOpacity key={cat.id} style={styles.mindItem} activeOpacity={0.8}>
                <View style={styles.mindImageWrap}>
                  <Image source={{ uri: cat.image }} style={styles.mindImage} />
                </View>
                <Text style={styles.mindName}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.divider} />

        {/* ── Restaurants Section ── */}
        <View style={styles.restaurantSection}>
          <Text style={styles.sectionTitleExplore}>Restaurants to explore</Text>
          
          {/* Filters */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll} contentContainerStyle={styles.filtersContent}>
            <TouchableOpacity style={[styles.filterChip, styles.filterChipActive]} activeOpacity={0.8}>
              <Text style={styles.filterTextActive}>Sort</Text>
              <Icon name="chevron-down" size={16} color="#FFF" style={{ marginLeft: 4 }} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterChip} activeOpacity={0.8}>
              <Text style={styles.filterText}>Fast Delivery</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterChip} activeOpacity={0.8}>
              <Text style={styles.filterText}>Rating 4.0+</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterChip} activeOpacity={0.8}>
              <Text style={styles.filterText}>Offers</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterChip} activeOpacity={0.8}>
              <Text style={styles.filterText}>Pure Veg</Text>
            </TouchableOpacity>
          </ScrollView>

          <FlatList
            data={RESTAURANTS}
            keyExtractor={item => item.id}
            renderItem={renderRestaurant}
            scrollEnabled={false}
            contentContainerStyle={styles.restaurantList}
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
    zIndex: 10,
  },
  backButton: { marginRight: 16 },
  backIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  addressContainer: { flex: 1 },
  deliveryTo: { fontSize: 11, color: '#3B82F6', fontWeight: '900', letterSpacing: 0.5 },
  addressText: { fontSize: 16, color: '#0F172A', fontWeight: '800' },
  searchButton: { marginLeft: 16 },
  searchIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  scrollContent: { paddingBottom: 100 },
  mindSection: { paddingVertical: 24, backgroundColor: '#FFFFFF' },
  sectionHeader: { paddingHorizontal: 16, marginBottom: 20 },
  sectionTitle: { fontSize: 22, fontWeight: '900', color: '#0F172A', letterSpacing: -0.5 },
  mindScroll: { flexGrow: 0 },
  mindScrollContent: { paddingHorizontal: 8 },
  mindItem: { alignItems: 'center', marginHorizontal: 10 },
  mindImageWrap: {
    width: 86,
    height: 86,
    borderRadius: 43,
    padding: 3,
    backgroundColor: '#FFFFFF',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 12,
  },
  mindImage: { width: '100%', height: '100%', borderRadius: 40 },
  mindName: { fontSize: 14, fontWeight: '800', color: '#334155' },
  divider: { height: 12, backgroundColor: '#F1F5F9' },
  restaurantSection: { paddingVertical: 24, backgroundColor: '#FFFFFF' },
  sectionTitleExplore: { fontSize: 22, fontWeight: '900', color: '#0F172A', letterSpacing: -0.5, paddingHorizontal: 16 },
  filtersScroll: { marginTop: 16, marginBottom: 24, flexGrow: 0 },
  filtersContent: { paddingHorizontal: 16 },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
    backgroundColor: '#FFFFFF',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  filterChipActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  filterText: { fontSize: 13, color: '#475569', fontWeight: '700' },
  filterTextActive: { fontSize: 13, color: '#FFFFFF', fontWeight: '800' },
  restaurantList: { paddingHorizontal: 16 },
  restaurantCard: { 
    marginBottom: 28,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 6,
    overflow: 'hidden',
  },
  restaurantImageContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
    backgroundColor: '#F1F5F9',
  },
  restaurantImage: { width: '100%', height: '100%' },
  offerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  offerText: { color: '#FFFFFF', fontSize: 14, fontWeight: '900', letterSpacing: 0.5 },
  favoriteButton: { 
    position: 'absolute', 
    top: 16, 
    right: 16,
  },
  favoriteIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  timeBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  timeBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E293B',
    marginLeft: 4,
  },
  restaurantInfo: { padding: 20 },
  restaurantHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  restaurantName: { fontSize: 20, fontWeight: '900', color: '#0F172A', flex: 1, marginRight: 12 },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16A34A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: { color: '#FFF', fontSize: 13, fontWeight: '900', marginRight: 4 },
  cuisinesText: { fontSize: 14, color: '#64748B', fontWeight: '600', marginBottom: 4 },
  locationText: { fontSize: 14, color: '#94A3B8', fontWeight: '500' },
  freeDeliveryBadge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 16, 
    backgroundColor: '#F4E8FF', 
    paddingRight: 12,
    paddingVertical: 6, 
    borderRadius: 16, 
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#E9D5FF'
  },
  freeDeliveryIconBg: {
    backgroundColor: '#FFFFFF',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#8C31D8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  freeDeliveryText: { fontSize: 11, color: '#8C31D8', fontWeight: '900', letterSpacing: 0.5 },
});

export default SwiggyFoodScreen;
