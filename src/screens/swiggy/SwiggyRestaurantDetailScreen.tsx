import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, StatusBar, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const { width } = Dimensions.get('window');

const MENU_DATA = [
  {
    category: 'Recommended',
    items: [
      { id: 'm1', name: 'Chicken Dum Biryani', price: 220, isVeg: false, desc: 'Aromatic basmati rice cooked with tender chicken pieces and secret spices.', image: 'https://images.unsplash.com/photo-1633940521590-111fb9b626e2?q=80&w=400&auto=format&fit=crop', rating: 4.5, votes: 120 },
      { id: 'm2', name: 'Mutton Biryani', price: 350, isVeg: false, desc: 'Rich and flavorful mutton biryani cooked in traditional style.', image: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?q=80&w=400&auto=format&fit=crop', rating: 4.8, votes: 95 },
    ]
  },
  {
    category: 'Main Course',
    items: [
      { id: 'm3', name: 'Paneer Butter Masala', price: 180, isVeg: true, desc: 'Soft paneer cubes in a creamy and slightly sweet tomato gravy.', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=400&auto=format&fit=crop', rating: 4.3, votes: 80 },
      { id: 'm4', name: 'Butter Naan', price: 45, isVeg: true, desc: 'Soft and fluffy Indian bread cooked in tandoor and brushed with butter.', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=400&auto=format&fit=crop', rating: 4.6, votes: 150 },
    ]
  }
];

const SwiggyRestaurantDetailScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const route = useRoute<any>();
  const [cartCount, setCartCount] = useState(0);

  const handleAddToCart = () => {
    setCartCount(prev => prev + 1);
  };

  const renderMenuItem = (item: any) => (
    <View key={item.id} style={styles.menuItem}>
      <View style={styles.menuInfo}>
        <View style={styles.vegNonVegWrap}>
          <Icon name="square-circle" size={16} color={item.isVeg ? '#16A34A' : '#DC2626'} />
        </View>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>₹{item.price}</Text>
        <View style={styles.itemRatingWrap}>
          <Icon name="star" size={14} color="#16A34A" />
          <Text style={styles.ratingText}>{item.rating}</Text>
          <Text style={styles.votesText}>({item.votes})</Text>
        </View>
        <Text style={styles.itemDesc} numberOfLines={2}>{item.desc}</Text>
      </View>
      <View style={styles.menuImageContainer}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.menuImage} />
        ) : <View style={styles.menuImagePlaceholder} />}
        <TouchableOpacity style={styles.addButton} onPress={handleAddToCart} activeOpacity={0.8}>
          <Text style={styles.addButtonText}>ADD</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      
      {/* ── Ultra UI Header ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton} activeOpacity={0.7}>
          <View style={styles.iconBg}>
            <Icon name="arrow-left" size={24} color="#0F172A" />
          </View>
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
            <View style={styles.iconBg}>
              <Icon name="heart-outline" size={22} color="#0F172A" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
            <View style={styles.iconBg}>
              <Icon name="share-variant-outline" size={22} color="#0F172A" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
            <View style={styles.iconBg}>
              <Icon name="magnify" size={24} color="#0F172A" />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* ── Restaurant Info Card ── */}
        <View style={styles.restaurantInfoCard}>
          <Text style={styles.restaurantName}>Thalappakatti Biryani</Text>
          <Text style={styles.restaurantCuisines}>Biryani, South Indian • ₹400 for two</Text>
          <View style={styles.infoRow}>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingBadgeText}>4.3</Text>
              <Icon name="star" size={14} color="#fff" style={{marginLeft: 4}} />
            </View>
            <Text style={styles.infoText}>1.2K+ ratings</Text>
          </View>
          
          <View style={styles.deliveryInfo}>
            <View style={styles.deliveryRow}>
              <View style={styles.bikeIconWrap}>
                <Icon name="bike-fast" size={18} color="#3B82F6" />
              </View>
              <Text style={styles.deliveryText}>40-45 mins • 3.5 km away</Text>
            </View>
          </View>
        </View>

        {/* ── Offers Scroll ── */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.offerScroll} contentContainerStyle={styles.offerScrollContent}>
          <View style={styles.offerCard}>
            <View style={styles.offerHeader}>
                <Icon name="brightness-percent" size={18} color="#3B82F6" />
                <Text style={styles.offerTitle}>20% OFF UPTO ₹50</Text>
            </View>
            <Text style={styles.offerCode}>USE TRYNEW | ABOVE ₹149</Text>
          </View>
          <View style={styles.offerCard}>
            <View style={styles.offerHeader}>
                <Icon name="brightness-percent" size={18} color="#8C31D8" />
                <Text style={styles.offerTitle}>FLAT ₹100 OFF</Text>
            </View>
            <Text style={styles.offerCode}>USE RUPAY100 | ABOVE ₹599</Text>
          </View>
        </ScrollView>

        {/* ── Menu Section ── */}
        <View style={styles.menuContainer}>
          <View style={styles.vegToggleContainer}>
            <View style={styles.vegToggleBadge}>
              <Icon name="leaf" size={16} color="#16A34A" />
              <Text style={styles.vegToggleText}>VEG ONLY</Text>
            </View>
            <View style={styles.toggleSwitch} />
          </View>

          {MENU_DATA.map((section, idx) => (
            <View key={idx} style={styles.menuSection}>
              <View style={styles.sectionTitleRow}>
                <Text style={styles.sectionTitle}>{section.category}</Text>
                <Icon name="chevron-up" size={24} color="#0F172A" />
              </View>
              {section.items.map(renderMenuItem)}
              <View style={styles.sectionDivider} />
            </View>
          ))}
        </View>

      </ScrollView>

      {/* ── Premium Floating Cart Footer ── */}
      {cartCount > 0 && (
        <View style={styles.floatingCartWrap}>
          <View style={styles.cartFooter}>
            <View>
              <Text style={styles.cartItemsText}>{cartCount} ITEM{cartCount > 1 ? 'S' : ''} ADDED</Text>
              <Text style={styles.cartExtraText}>Extra charges may apply</Text>
            </View>
            <TouchableOpacity 
              style={styles.viewCartButton}
              onPress={() => navigation.navigate('SwiggyCart')}
              activeOpacity={0.8}
            >
              <Text style={styles.viewCartText}>View Cart</Text>
              <Icon name="chevron-right-circle" size={24} color="#fff" style={{ marginLeft: 8 }} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#F8FAFC'
  },
  iconButton: { padding: 4 },
  iconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerActions: { flexDirection: 'row', gap: 8 },
  scrollContent: { paddingBottom: 120 },
  restaurantInfoCard: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 32,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 6,
  },
  restaurantName: { fontSize: 26, fontWeight: '900', color: '#0F172A', letterSpacing: -0.5 },
  restaurantCuisines: { fontSize: 14, color: '#64748B', fontWeight: '600', marginTop: 8 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginTop: 16 },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#16A34A', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  ratingBadgeText: { color: '#fff', fontSize: 13, fontWeight: '900' },
  infoText: { fontSize: 13, color: '#334155', marginLeft: 12, fontWeight: '700' },
  deliveryInfo: { marginTop: 20, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  deliveryRow: { flexDirection: 'row', alignItems: 'center' },
  bikeIconWrap: { backgroundColor: '#FFF0E6', padding: 6, borderRadius: 12 },
  deliveryText: { fontSize: 14, color: '#0F172A', marginLeft: 12, fontWeight: '800' },
  offerScroll: { marginTop: 24, marginBottom: 8, flexGrow: 0 },
  offerScrollContent: { paddingHorizontal: 16, gap: 16 },
  offerCard: { 
    borderWidth: 1.5, 
    borderColor: '#F1F5F9', 
    borderRadius: 20, 
    padding: 16, 
    backgroundColor: '#FFFFFF', 
    alignSelf: 'flex-start',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  offerHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  offerTitle: { fontSize: 15, fontWeight: '900', color: '#0F172A', marginLeft: 6 },
  offerCode: { fontSize: 12, color: '#64748B', fontWeight: '800' },
  menuContainer: { backgroundColor: '#FFFFFF', marginTop: 24, paddingTop: 24, borderTopLeftRadius: 32, borderTopRightRadius: 32 },
  vegToggleContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, marginBottom: 24 },
  vegToggleBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0FDF4', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, borderWidth: 1, borderColor: '#DCFCE7' },
  vegToggleText: { fontSize: 13, fontWeight: '800', color: '#16A34A', marginLeft: 6 },
  toggleSwitch: { width: 44, height: 24, backgroundColor: '#E2E8F0', borderRadius: 12 },
  menuSection: { paddingTop: 8 },
  sectionTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: '900', color: '#0F172A' },
  menuItem: { flexDirection: 'row', paddingHorizontal: 24, marginBottom: 32 },
  menuInfo: { flex: 1, paddingRight: 20 },
  vegNonVegWrap: { marginBottom: 8 },
  itemName: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
  itemPrice: { fontSize: 16, fontWeight: '800', color: '#334155', marginTop: 6 },
  itemRatingWrap: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  ratingText: { fontSize: 13, color: '#16A34A', fontWeight: '800', marginLeft: 4 },
  votesText: { fontSize: 12, color: '#94A3B8', fontWeight: '600', marginLeft: 4 },
  itemDesc: { fontSize: 13, color: '#64748B', marginTop: 10, lineHeight: 20, fontWeight: '500' },
  menuImageContainer: { width: 130, alignItems: 'center', position: 'relative' },
  menuImage: { width: 130, height: 130, borderRadius: 24 },
  menuImagePlaceholder: { width: 130, height: 130, borderRadius: 24, backgroundColor: '#F1F5F9' },
  addButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 32,
    position: 'absolute',
    bottom: -16,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  addButtonText: { color: '#16A34A', fontWeight: '900', fontSize: 16 },
  sectionDivider: { height: 1, backgroundColor: '#F1F5F9', marginHorizontal: 24, marginVertical: 8 },
  floatingCartWrap: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
  },
  cartFooter: {
    backgroundColor: '#60B246',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 24,
    shadowColor: '#60B246',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  cartItemsText: { color: '#FFFFFF', fontSize: 14, fontWeight: '900' },
  cartExtraText: { color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: '600', marginTop: 2 },
  viewCartButton: { flexDirection: 'row', alignItems: 'center' },
  viewCartText: { color: '#FFFFFF', fontSize: 16, fontWeight: '900' }
});

export default SwiggyRestaurantDetailScreen;
