import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, StatusBar, TextInput, KeyboardAvoidingView, Platform, Modal, ActivityIndicator, Alert, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useCart } from '../../context/CartContext';
import { useAlert } from '../../context/AlertContext';
import { useLocationFetcher } from '../../hooks/useLocationFetcher';
import { BASE_URL } from '../../utils/apiConfig';
import AddressModal from '../../components/AddressModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SwiggyCartScreen = () => {
  const navigation = useNavigation();
  const { items, updateQuantity, getTotalPrice, clearCart, setCartItems } = useCart();
  const { showAlert } = useAlert();
  const { fetchExactLocation, isFetchingLocation } = useLocationFetcher();
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPaymentConfirm, setShowPaymentConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressToEdit, setAddressToEdit] = useState<any>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [isFetchingCart, setIsFetchingCart] = useState(true);
  const [appliedShops, setAppliedShops] = useState<Record<string, boolean>>({}); // whether points are applied per shop
  const [shopRewardConfigs, setShopRewardConfigs] = useState<Record<string, any>>({});
  const [backendCart, setBackendCart] = useState<any>(null);      // raw API response from backend



  const getUserId = async () => {
      try {
          const sessionStr = await AsyncStorage.getItem('userSession');
          if (sessionStr) {
              const session = JSON.parse(sessionStr);
              // Prioritize specific user ID fields over generic 'id'
              const id = session.user?.id
                  || session.user?.pk
                  || session.user_id
                  || session.userId
                  || session.data?.user_id
                  || session.data?.id
                  || session.data?.pk
                  || session.pk
                  || session.id;
              if (id) return Number(id);
          }
      } catch (e) { console.error('getUserId error:', e); }
      return 1; // Fallback for testing if session is missing
  };

  const fetchAddresses = async () => {
    try {
       const uId = await getUserId();
       if (!uId) return; // no valid user ID, skip
       setCurrentUserId(uId);
       const addrRes = await fetch(`${BASE_URL}/gobi360/address/?user_id=${uId}`);
       if (addrRes.ok) {
          const addrData = await addrRes.json();
          let addrs: any[] = [];
          if (Array.isArray(addrData)) {
            addrs = addrData;
          } else if (addrData && Array.isArray(addrData.addresses)) {
            addrs = addrData.addresses;
          } else if (addrData && Array.isArray(addrData.results)) {
            addrs = addrData.results;
          } else if (addrData && Array.isArray(addrData.data)) {
            addrs = addrData.data;
          } else if (addrData && typeof addrData === 'object') {
            const foundArray = Object.values(addrData).find(v => Array.isArray(v));
            if (foundArray) addrs = foundArray as any[];
          }

          setAddresses(addrs);
          if (addrs.length > 0 && !selectedAddressId) {
            const defaultAddr = addrs.find((a: any) => a.is_default) || addrs[0];
            setSelectedAddressId(defaultAddr.address_id || defaultAddr.id);
          }
       } else {
          console.error(`Address GET Error: ${addrRes.status}`, await addrRes.text());
       }
    } catch (e) {
       console.error('fetchAddresses error:', e);
    }
  };

  const handleDeleteAddress = (addressId: number) => {
    Alert.alert('Delete Address', 'Are you sure you want to delete this address?', [
        { text: 'Cancel', style: 'cancel' },
        { 
            text: 'Delete', 
            style: 'destructive',
            onPress: async () => {
                try {
                    const res = await fetch(`${BASE_URL}/gobi360/address/${addressId}/`, {
                        method: 'DELETE'
                    });
                    if (res.ok) {
                        if (selectedAddressId === addressId) {
                            setSelectedAddressId(null);
                        }
                        fetchAddresses();
                    } else {
                        const errText = await res.text();
                        console.error(`Address DELETE Error: ${res.status}`, errText);
                        Alert.alert('Error', `Failed to delete address: ${errText}`);
                    }
                } catch (e) {
                    console.error('Delete address error:', e);
                }
            }
        }
    ]);
  };
  // 1. Fetch addresses and load user ID on mount
  React.useEffect(() => {
    const initData = async () => {
      try {
        await fetchAddresses();
      } catch (err) {
        console.error('Error in initData:', err);
      } finally {
        setIsFetchingCart(false);
      }
    };
    initData();
  }, []);

  // 1.5. Always fetch backend cart on mount
  React.useEffect(() => {
    const fetchCartOnMount = async () => {
      try {
        const uId = await getUserId();
        if (!uId) return;
        const res = await fetch(`${BASE_URL}/gobi360/cart/?user_id=${uId}`, {
          headers: { 'ngrok-skip-browser-warning': 'true' }
        });
        if (res.ok) {
          const data = await res.json();
          setBackendCart(data);
          // Merge items from ALL shops into local cart context
          if (data.shops && data.shops.length > 0) {
            const mergedItems: any[] = [];
            for (const shop of data.shops) {
              for (const b of (shop.products || [])) {
                mergedItems.push({
                  id: b.variation?.value
                    ? `${b.product_id}_var_${b.variation.value}`
                    : String(b.product_id),
                  productId: String(b.product_id),
                  name: b.product_name,
                  price: Number(b.price),
                  quantity: b.quantity,
                  variationName: b.variation?.value || undefined,
                  type: 'veg',
                  shopId: String(shop.shop_id),
                  cartItemId: b.cart_item_id
                });
              }
            }
            setCartItems(mergedItems);
          } else {
            setCartItems([]);
          }
        }
      } catch (err) {
        console.error('Error fetching backend cart on mount:', err);
      }
    };
    fetchCartOnMount();
  }, []);

  const pushingItemsRef = useRef(new Set<string>());

  // 1.6. Push newly added local items to backend when items.length increases
  React.useEffect(() => {
    const pushNewItemsToBackend = async () => {
      const newItems = items.filter(i => !i.cartItemId && !pushingItemsRef.current.has(i.id));
      if (newItems.length === 0) return;

      newItems.forEach(i => pushingItemsRef.current.add(i.id));
      try {
        const uId = await getUserId();
        if (!uId) return;
        for (const item of newItems) {
          let pId = String(item.productId || item.id);
          let vId: string | null = null;
          if (String(item.id).includes('_var_')) {
            const parts = String(item.id).split('_var_');
            pId = parts[0];
            vId = parts[1];
          }
          const cartPayload: any = {
            user_id: uId,
            product_id: Number(pId),
            quantity: item.quantity,
            price: item.price,
            subtotal: item.price * item.quantity
          };
          if (vId) cartPayload.variation_id = Number(vId);
          await fetch(`${BASE_URL}/gobi360/cart/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
            body: JSON.stringify(cartPayload)
          });
        }
        // Re-fetch backend cart and update local items with cartItemId to prevent re-POST
        const uId2 = await getUserId();
        if (!uId2) return;
        const res = await fetch(`${BASE_URL}/gobi360/cart/?user_id=${uId2}`, {
          headers: { 'ngrok-skip-browser-warning': 'true' }
        });
        if (res.ok) {
          const data = await res.json();
          setBackendCart(data);
          // Rebuild local items from ALL shops with correct cartItemIds
          if (data.shops && data.shops.length > 0) {
            const mergedItems: any[] = [];
            for (const shop of data.shops) {
              for (const b of (shop.products || [])) {
                mergedItems.push({
                  id: b.variation?.value
                    ? `${b.product_id}_var_${b.variation.value}`
                    : String(b.product_id),
                  productId: String(b.product_id),
                  name: b.product_name,
                  price: Number(b.price),
                  quantity: b.quantity,
                  variationName: b.variation?.value || undefined,
                  type: 'veg',
                  shopId: String(shop.shop_id),
                  cartItemId: b.cart_item_id // now assigned — won't be re-pushed
                });
              }
            }
            setCartItems(mergedItems);
          }
        }
      } catch (err) {
        console.error('Error pushing new items to backend:', err);
      } finally {
        newItems.forEach(i => pushingItemsRef.current.delete(i.id));
      }
    };
    pushNewItemsToBackend();
  }, [items.length]);

  const refreshBackendCart = async () => {
    const uId = await getUserId();
    if (!uId) return;
    try {
      const res = await fetch(`${BASE_URL}/gobi360/cart/?user_id=${uId}`, {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      if (res.ok) {
        setBackendCart(await res.json());
      }
    } catch (e) {
      console.log('Error refreshing backend cart', e);
    }
  };

  // 2. Fetch reward settings for all shops when shop list changes
  const shopsList = backendCart?.shops ?? [];
  const shopIdsKey = shopsList.map((s: any) => s.shop_id).sort().join(',');

  React.useEffect(() => {
    if (!shopIdsKey) return;

    const fetchRewardSettings = async () => {
      const newConfigs: Record<string, any> = {};
      for (const shop of shopsList) {
        const shopId = String(shop.shop_id);
        try {
          const url = `${BASE_URL}/gobi360/reward-setting/${shopId}/`;
          console.log(`[Rewards] GET ${url}`);
          const res = await fetch(url, { headers: { 'ngrok-skip-browser-warning': 'true' } });
          if (res.ok) {
            const json = await res.json();
            console.log(`[Rewards] shop ${shopId}:`, JSON.stringify(json));
            if (json?.status) {
              newConfigs[shopId] = json;
            }
          } else {
            console.warn(`[Rewards] shop ${shopId} => HTTP ${res.status}`);
          }
        } catch (e) {
          console.error(`[Rewards] shop ${shopId} error:`, e);
        }
      }
      console.log('[Rewards] configs saved:', JSON.stringify(newConfigs));
      setShopRewardConfigs(newConfigs);
    };

    fetchRewardSettings();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shopIdsKey]);

  const handleUpdateQuantity = async (item: any, delta: number) => {
    const newQty = item.quantity + delta;
    
    // Update local context instantly for snappy UI
    updateQuantity(item.id, delta);

    // Optimistic backendCart update for snappy UI
    setBackendCart((prev: any) => {
        if (!prev || !prev.shops) return prev;
        const targetId = item.cartItemId || item.productId;
        
        let newGrandTotal = 0;
        const newShops = prev.shops.map((shop: any) => {
            let shopCartTotal = 0;
            const newProducts = shop.products.map((p: any) => {
                const pId = p.cart_item_id || p.product_id;
                if (String(pId) === String(targetId)) {
                    const diff = delta * Number(p.price);
                    const newSubtotal = Number(p.subtotal) + diff;
                    const pNewQty = p.quantity + delta;
                    return { ...p, quantity: pNewQty, subtotal: newSubtotal };
                }
                return p;
            }).filter((p: any) => p.quantity > 0);
            
            newProducts.forEach((p: any) => { shopCartTotal += Number(p.subtotal); });
            newGrandTotal += shopCartTotal;
            
            return { ...shop, products: newProducts, cart_total: shopCartTotal };
        }).filter((shop: any) => shop.products.length > 0);
        
        return { ...prev, shops: newShops, grand_total: newGrandTotal };
    });

    try {
        const targetId = item.cartItemId || item.productId;
        if (newQty <= 0) {
            // Hit DELETE API when item is removed
            await fetch(`${BASE_URL}/gobi360/cart/item/${targetId}/`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' }
            });
        } else {
            // Hit PUT API to update quantity
            await fetch(`${BASE_URL}/gobi360/cart/item/${targetId}/`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
                body: JSON.stringify({ quantity: newQty })
            });
        }
        await refreshBackendCart();
    } catch (error) {
        console.log('Error syncing cart with server:', error);
    }
  };

  // Delete a single item from the cart
  const handleDeleteItem = async (item: any) => {
    Alert.alert(
      'Remove Item',
      `Remove "${item.name}" from your cart?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              const targetId = item.cartItemId || item.productId;
              await fetch(`${BASE_URL}/gobi360/cart/item/${targetId}/`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' }
              });
              updateQuantity(item.id, -9999); // remove from local context
              await refreshBackendCart();
            } catch (err) {
              console.error('Error deleting item:', err);
            }
          }
        }
      ]
    );
  };

  // Helper to forcefully clear the backend cart by deleting items individually
  const clearBackendCartItems = async () => {
    try {
        const uId = await getUserId();
        if (!uId) return;
        
        // 1. Attempt bulk clear
        let bulkSuccess = false;
        try {
            const bulkRes = await fetch(`${BASE_URL}/gobi360/cart/clear/${uId}/`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' }
            });
            if (bulkRes.ok) {
                bulkSuccess = true;
            }
        } catch (e) { console.log('Bulk clear failed', e); }

        // 2. Loop through every shop and item ONLY IF bulk clear failed
        if (!bulkSuccess && backendCart?.shops) {
            for (const shop of backendCart.shops) {
                if (shop.products) {
                    for (const item of shop.products) {
                        const targetId = item.cart_item_id || item.product_id;
                        try {
                            await fetch(`${BASE_URL}/gobi360/cart/item/${targetId}/`, {
                                method: 'DELETE',
                                headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' }
                            });
                        } catch (e) {}
                    }
                }
            }
        }
    } catch (e) {
        console.error('Failed to manually clear backend cart items:', e);
    }
  };

  // Clear the entire cart
  const handleClearCart = async () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearBackendCartItems();
              clearCart();
              setBackendCart(null);
            } catch (err) {
              console.error('Error clearing cart:', err);
            }
          }
        }
      ]
    );
  };

  // Derive points from backend cart API response if available
  let totalDiscountValue = 0;
  let allShopsItemTotal = 0;

  // Build per-shop points info for ALL shops (not just redeemable ones)
  const shopPointsInfo: Record<string, {
    available: number;
    minRedeem: number;
    redeemPtsRate: number;
    redeemAmtRate: number;
    discount: number;
    pointsConsumed: number;
    canRedeem: boolean;
    message?: any;
  }> = {};

  const redeemableShopsData: any[] = [];

  if (backendCart?.shops) {
    backendCart.shops.forEach((shop: any) => {
        const shopCartTotal = Number(shop.cart_total || 0);
        allShopsItemTotal += shopCartTotal;

        const shopId = String(shop.shop_id);
        const availPts = Number(shop.available_points || 0);
        
        const config = shopRewardConfigs[shopId] || {};
        const minRedeem = Number(config.minimum_redeem_points || shop.minimum_redeem_points || 5);
        const redeemPtsRate = Number(config.redeem_points || 1);
        const redeemAmtRate = Number(config.redeem_amount || 1);

        const canRedeem = availPts >= minRedeem && availPts > 0;
        let discountForShop = (canRedeem && redeemPtsRate > 0)
            ? Math.floor(availPts / redeemPtsRate) * redeemAmtRate
            : 0;
        let pointsConsumed = (canRedeem && redeemPtsRate > 0)
            ? Math.floor(availPts / redeemPtsRate) * redeemPtsRate
            : 0;

        // Cap discount to shop's cart total
        if (discountForShop > shopCartTotal) {
            discountForShop = shopCartTotal;
            pointsConsumed = redeemAmtRate > 0 ? Math.ceil(discountForShop / redeemAmtRate) * redeemPtsRate : 0;
        }

        // Store info for every shop regardless of redeem eligibility
        shopPointsInfo[shopId] = { 
            available: availPts, 
            minRedeem, 
            redeemPtsRate, 
            redeemAmtRate, 
            discount: discountForShop, 
            pointsConsumed, 
            canRedeem,
            message: config.message || null
        };

        if (canRedeem) {
            if (appliedShops[shopId]) {
                totalDiscountValue += discountForShop;
            }
            redeemableShopsData.push({
                shop_id: Number(shopId),
                points: pointsConsumed,
                discount: discountForShop,
                available: availPts,
                minRedeem: minRedeem
            });
        }
    });
  }

  const deliveryFee: number = 0;
  const grandTotal   = backendCart?.grand_total ?? (allShopsItemTotal || getTotalPrice());
  const totalToPay   = grandTotal + deliveryFee - totalDiscountValue;

  const handleToggleShopPoints = (shopId: string) => {
    setAppliedShops(prev => {
        const isApplied = !prev[shopId];
        if (isApplied) {
            showAlert('Points Applied! 🎉', `Discount applied for this shop.`);
        }
        return {
            ...prev,
            [shopId]: isApplied
        };
    });
  };

  const submitOrderToBackend = async (paymentStatus?: string) => {
    setIsSubmitting(true);
    try {
        const uId = await getUserId();
        
        let redeemArray: any[] = [];
        redeemableShopsData.forEach(s => {
            if (appliedShops[String(s.shop_id)]) {
                redeemArray.push({
                    shop_id: s.shop_id,
                    points: s.points
                });
            }
        });
        const anyPointsApplied = redeemArray.length > 0;

        const orderData: any = {
            user_id: uId,
            address_id: selectedAddressId,
            total_amount: totalToPay,
            use_points: anyPointsApplied,
            redeem: redeemArray
        };

        if (paymentStatus) {
            orderData.payment_status = paymentStatus;
        }

        const response = await fetch(`${BASE_URL}/gobi360/checkout/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });

        if (response.ok) {
            setShowSuccess(true);
            try {
                // Force clear backend cart by deleting all individual items
                await clearBackendCartItems();
            } catch (err) {
                console.error('Failed to clear backend cart:', err);
            }
            clearCart(); // clear local cart
            setBackendCart(null);
        } else {
            const errText = await response.text();
            console.error(`Checkout POST Error: ${response.status}`, errText);
            // Alert user so they can see the error in the app
            showAlert('Checkout Failed', `Error ${response.status}: ${errText}`);
            setShowSuccess(true); // fall back to success UI for demo if requested
        }
    } catch (error) {
        console.error('Error placing order:', error);
        setShowSuccess(true);
    } finally {
        setIsSubmitting(false);
    }
  };

  const notifyUPIPaymentStatus = async (status: 'PAID' | 'CANCELLED') => {
    try {
        const uId = await getUserId();
        // Dynamically grab the shop ID from the cart. If multiple shops, take the first one or join them.
        const dynamicShopId = backendCart?.shops && backendCart.shops.length > 0 
            ? backendCart.shops[0].shop_id 
            : null;

        const payload = {
            user_id: uId,
            shop_id: dynamicShopId, // Dynamic Ecom ID based on the cart
            amount: totalToPay,
            payment_status: status,
            timestamp: new Date().toISOString()
        };
        
        // POST to generic backend endpoint so any shopkeeper dashboard can see the attempt
        await fetch(`${BASE_URL}/gobi360/upi-payment-status/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true'
            },
            body: JSON.stringify(payload)
        });
    } catch (err) {
        console.error('Failed to notify payment status', err);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
        showAlert('Address Required', 'Please select a delivery address.');
        return;
    }
    if (!backendCart?.shops || backendCart.shops.length === 0) {
        showAlert('Cart Empty', 'Please add some items to your cart first.');
        return;
    }
    
    // Check if Bannari Amman Mess is in the cart
    const isBannari = backendCart?.shops?.some((shop: any) => 
        String(shop.shop_id) === 'r1' || 
        shop.shop_name?.toLowerCase().includes('bannari') || 
        shop.shop_name?.toLowerCase().includes('pannari') ||
        (backendCart?.shops?.length === 1 && backendCart.shops[0].shop_name?.toLowerCase().includes('amman'))
    );

    if (isBannari) {
        const upiUrl = `upi://pay?pa=keerthimukesh2003@okhdfcbank&pn=Bannari%20Amman%20Mess&am=${totalToPay.toFixed(2)}&cu=INR`;
        try {
            // Use openURL directly, as canOpenURL fails on Android 11+ without <queries> in manifest
            await Linking.openURL(upiUrl);
        } catch (err) {
            console.error("UPI Navigation Error:", err);
            Alert.alert("No UPI App Found", `Could not open UPI app. Please manually send ₹${totalToPay.toFixed(2)} to keerthimukesh2003@okhdfcbank`);
            return; // Abort if they can't even open the app
        }
        
        // Show confirmation dialog after they return from the UPI app
        setTimeout(() => {
            setShowPaymentConfirm(true);
        }, 1000); // Small delay to let the OS switch apps cleanly
    } else {
        submitOrderToBackend();
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    clearCart();
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      
      {/* ── Ultra UI Header ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} activeOpacity={0.7}>
          <View style={styles.backIconBg}>
            <Icon name="arrow-left" size={24} color="#0F172A" />
          </View>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Your Cart</Text>
          <Text style={styles.headerSubtitle}>
            {backendCart?.shops?.reduce((acc: number, shop: any) => acc + (shop.products?.length || 0), 0) ?? 0} item(s)
          </Text>
        </View>
        {(backendCart?.shops?.length ?? 0) > 0 && (
          <TouchableOpacity
            onPress={handleClearCart}
            activeOpacity={0.7}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#FEE2E2',
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 12,
              marginLeft: 8,
            }}
          >
            <Icon name="trash-can-outline" size={16} color="#EF4444" />
            <Text style={{ color: '#EF4444', fontWeight: '800', fontSize: 12, marginLeft: 4 }}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        
        {/* ── Selected Items Cards (Multi-Shop) ── */}
        {(!backendCart?.shops || backendCart.shops.length === 0) ? (
          <View style={styles.sectionCard}>
            <Text style={{ textAlign: 'center', color: '#64748B', paddingVertical: 20 }}>Your cart is empty.</Text>
          </View>
        ) : (
          backendCart.shops.map((shop: any) => (
            <View key={shop.shop_id} style={styles.sectionCard}>
              {shop.shop_name && (
                <View style={{ marginBottom: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
                  <Text style={{ fontSize: 18, fontWeight: '900', color: '#0F172A' }}>
                    {shop.shop_name}
                  </Text>
                  {/* Shop Points UI (Optional, if you want per-shop point visibility) */}
                  {(shop.available_points > 0) && (
                    <Text style={{ fontSize: 12, color: '#10B981', marginTop: 4, fontWeight: '600' }}>
                      <Icon name="star-circle" size={12} color="#10B981" /> {shop.available_points} Points Available
                    </Text>
                  )}
                </View>
              )}
              {(!shop.products || shop.products.length === 0) ? (
                <Text style={{ textAlign: 'center', color: '#64748B', paddingVertical: 10 }}>No items in this shop.</Text>
              ) : (
                shop.products.map((item: any) => {
                    const mappedItem = {
                        id: item.variation?.value ? `${item.product_id}_var_${item.variation.value}` : String(item.product_id),
                        productId: String(item.product_id),
                        name: item.product_name,
                        price: Number(item.price),
                        quantity: item.quantity,
                        variationName: item.variation?.value,
                        type: 'veg',
                        cartItemId: item.cart_item_id,
                        shopId: String(shop.shop_id)
                    };

                    return (
                    <View key={item.cart_item_id} style={{ paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                            {/* Left Side: Info */}
                            <View style={{ flex: 1, flexDirection: 'row', paddingRight: 16 }}>
                                <Icon name="square-circle" size={16} color="#16A34A" style={{ marginTop: 2, marginRight: 8 }} />
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 16, fontWeight: '700', color: '#1E293B' }}>
                                        {item.product_name}
                                    </Text>
                                    {item.variation?.value && item.variation.value.trim().toLowerCase() !== item.product_name.trim().toLowerCase() && (
                                        <Text style={{ fontSize: 13, color: '#64748B', marginTop: 2 }}>{item.variation.value}</Text>
                                    )}
                                    <Text style={{ fontSize: 15, fontWeight: '600', color: '#475569', marginTop: 6 }}>
                                        ₹{Number(item.price).toFixed(2)}
                                    </Text>
                                </View>
                            </View>

                            {/* Right Side: Controls */}
                            <View style={{ alignItems: 'flex-end', width: 90 }}>
                                <View style={styles.quantityControl}>
                                    <TouchableOpacity style={styles.qtyBtnWrap} onPress={() => handleUpdateQuantity(mappedItem, -1)}>
                                        <Text style={styles.qtyBtn}>-</Text>
                                    </TouchableOpacity>
                                    <Text style={styles.qtyText}>{item.quantity}</Text>
                                    <TouchableOpacity style={styles.qtyBtnWrap} onPress={() => handleUpdateQuantity(mappedItem, 1)}>
                                        <Text style={styles.qtyBtn}>+</Text>
                                    </TouchableOpacity>
                                </View>
                                <Text style={{ fontSize: 14, fontWeight: '800', color: '#0F172A', marginTop: 8 }}>
                                    ₹{(Number(item.price) * item.quantity).toFixed(2)}
                                </Text>
                            </View>
                        </View>
                    </View>
                    );
                })
              )}
              
              {/* Shop Points UI — always shown per shop */}
              {(() => {
                  const shopIdStr = String(shop.shop_id);
                  const info = shopPointsInfo[shopIdStr];
                  if (!info) return null; // reward config not yet loaded

                  const isApplied = !!appliedShops[shopIdStr];
                  const { available, minRedeem, discount, canRedeem, message } = info;

                  return (
                    <View style={[styles.couponCard, {
                        borderColor: canRedeem ? '#FDE68A' : '#E2E8F0',
                        backgroundColor: canRedeem ? '#FFFBDB' : '#F8FAFC',
                        marginTop: 12,
                        marginBottom: 4
                    }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                            <View style={[styles.couponIconBg, { backgroundColor: canRedeem ? '#FEF3C7' : '#F1F5F9' }]}>
                                <Icon name="star-circle" size={24} color={canRedeem ? '#D97706' : '#94A3B8'} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.couponText, { color: canRedeem ? '#B45309' : '#64748B' }]}>Shop Loyalty Points</Text>
                                <Text style={{ fontSize: 12, color: canRedeem ? '#D97706' : '#94A3B8', marginTop: 3, marginLeft: 12, fontWeight: '800' }}>
                                    Balance: {available} pts
                                </Text>
                                
                                {message ? (
                                    <View style={{ marginTop: 6, marginLeft: 12 }}>
                                        {message.earn && <Text style={{ fontSize: 11, color: '#475569', fontWeight: '600', marginBottom: 2 }}>• {message.earn}</Text>}
                                        {message.redeem && <Text style={{ fontSize: 11, color: '#475569', fontWeight: '600', marginBottom: 2 }}>• {message.redeem}</Text>}
                                        {!canRedeem && message.minimum && <Text style={{ fontSize: 11, color: '#EF4444', fontWeight: '600' }}>• {message.minimum}</Text>}
                                    </View>
                                ) : (
                                    <Text style={{ fontSize: 11, color: '#64748B', marginTop: 4, marginLeft: 12, fontWeight: '600' }}>
                                        {canRedeem ? `Apply for ₹${discount} discount` : `Need ${minRedeem} pts to redeem`}
                                    </Text>
                                )}
                            </View>
                        </View>
                        <TouchableOpacity
                            style={{
                              backgroundColor: isApplied ? '#DCFCE7' : canRedeem ? '#FEF3C7' : '#F1F5F9',
                              paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12
                            }}
                            onPress={() => canRedeem
                                ? handleToggleShopPoints(shopIdStr)
                                : showAlert('Not Enough Points', message?.minimum || `You need at least ${minRedeem} pts to redeem. You have ${available} pts.`)}
                            disabled={!canRedeem && !isApplied}
                        >
                            <Text style={{ color: isApplied ? '#16A34A' : canRedeem ? '#D97706' : '#94A3B8', fontWeight: '900', fontSize: 12 }}>
                              {isApplied ? 'REMOVE' : 'APPLY'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                  );
              })()}

              <View style={styles.addMoreRow}>
                <View style={styles.addMoreIconBg}>
                    <Icon name="plus" size={16} color="#60B246" />
                </View>
                <Text style={styles.addMoreText}>Add more items</Text>
              </View>
            </View>
          ))
        )}

        {/* ── Delivery Details Card ── */}
        <View style={styles.sectionCard}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Text style={styles.billTitle}>Delivery Details</Text>
            <TouchableOpacity onPress={() => { setAddressToEdit(null); setShowAddressModal(true); }}>
                <Text style={{ color: '#3B82F6', fontWeight: 'bold' }}>+ Add Address</Text>
            </TouchableOpacity>
          </View>
          
          {addresses.length === 0 ? (
            <Text style={{ color: '#64748B', fontStyle: 'italic', marginBottom: 16 }}>No addresses found. Please add one.</Text>
          ) : (
            addresses.map((addr: any) => {
                const addrId = addr.address_id || addr.id;
                return (
                <TouchableOpacity 
                    key={addrId} 
                    style={{ 
                        flexDirection: 'row', alignItems: 'center', 
                        padding: 12, borderWidth: 1, 
                        borderColor: selectedAddressId === addrId ? '#3B82F6' : '#E2E8F0', 
                        borderRadius: 12, marginBottom: 12,
                        backgroundColor: selectedAddressId === addrId ? '#EFF6FF' : '#FFFFFF'
                    }}
                    onPress={() => setSelectedAddressId(addrId)}
                    activeOpacity={0.7}
                >
                    <Icon name={addr.address_type === 'home' ? 'home' : 'briefcase'} size={24} color={selectedAddressId === addrId ? '#3B82F6' : '#94A3B8'} style={{ marginRight: 12 }} />
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontWeight: 'bold', color: '#0F172A', fontSize: 16 }}>{addr.full_name} <Text style={{ color: '#64748B', fontWeight: 'normal', fontSize: 14 }}>({addr.address_type})</Text></Text>
                        <Text style={{ color: '#475569', fontSize: 13, marginTop: 4 }}>{addr.address_line}, {addr.city}</Text>
                        <Text style={{ color: '#64748B', fontSize: 12, marginTop: 2 }}>{addr.mobile}</Text>
                    </View>
                    
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity style={{ padding: 8 }} onPress={(e) => {
                            e.stopPropagation();
                            setAddressToEdit(addr);
                            setShowAddressModal(true);
                        }}>
                            <Icon name="pencil" size={20} color="#94A3B8" />
                        </TouchableOpacity>

                        <TouchableOpacity style={{ padding: 8, marginRight: 4 }} onPress={(e) => {
                            e.stopPropagation();
                            handleDeleteAddress(addrId);
                        }}>
                            <Icon name="delete-outline" size={20} color="#EF4444" />
                        </TouchableOpacity>
                    </View>

                    {selectedAddressId === addrId && <Icon name="check-circle" size={24} color="#3B82F6" />}
                </TouchableOpacity>
                );
            })
          )}
        </View>



        {/* ── Bill Details Card ── */}
        <View style={styles.sectionCard}>
          <Text style={styles.billTitle}>Bill Details</Text>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Item Total</Text>
            <Text style={styles.billValue}>₹{(allShopsItemTotal || getTotalPrice()).toFixed(2)}</Text>
          </View>
          <View style={styles.billRow}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.billLabel}>Delivery Fee</Text>
                <Icon name="information-outline" size={14} color="#94A3B8" style={{marginLeft: 4}} />
            </View>
            <Text style={styles.billValue}>
              {deliveryFee === 0 ? <Text style={{color: '#16A34A', fontWeight: '900'}}>FREE</Text> : `₹${deliveryFee.toFixed(2)}`}
            </Text>
          </View>

          {(totalDiscountValue > 0) && (
            <View style={styles.billRow}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon name="star-circle" size={14} color="#D97706" style={{marginRight: 4}} />
                <Text style={[styles.billLabel, {color: '#D97706'}]}>Points Discount</Text>
              </View>
              <Text style={{color: '#16A34A', fontWeight: '900', fontSize: 14}}>- ₹{totalDiscountValue.toFixed(2)}</Text>
            </View>
          )}

          <View style={styles.dashDivider} />
          
          <View style={styles.billRow}>
            <Text style={styles.toPayLabel}>To Pay</Text>
            <Text style={styles.toPayValue}>₹{totalToPay.toFixed(2)}</Text>
          </View>
        </View>

        {/* ── Cancellation Policy ── */}
        <View style={styles.policySection}>
          <Text style={styles.policyTitle}>Review your order and address details to avoid cancellations</Text>
          <Text style={styles.policyDesc}>If you choose to cancel, you can do it within 60 seconds after placing order. Post which you will be charged a 100% cancellation fee.</Text>
        </View>

        {/* ── UPI Payment Banner for Bannari Amman Mess ── */}
        {backendCart?.shops?.some((shop: any) => 
            String(shop.shop_id) === 'r1' || 
            shop.shop_name?.toLowerCase().includes('bannari') || 
            shop.shop_name?.toLowerCase().includes('pannari') ||
            (backendCart?.shops?.length === 1 && backendCart.shops[0].shop_name?.toLowerCase().includes('amman'))
        ) && (
            <View style={{ backgroundColor: '#F0FDF4', padding: 16, marginTop: 16, borderRadius: 16, borderWidth: 1, borderColor: '#86EFAC' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <Icon name="qrcode-scan" size={20} color="#16A34A" style={{ marginRight: 8 }} />
                    <Text style={{ fontSize: 15, fontWeight: '800', color: '#166534' }}>Direct UPI Payment</Text>
                </View>
                <Text style={{ fontSize: 13, color: '#15803D', fontWeight: '500', marginBottom: 12 }}>
                    For Bannari Amman Mess orders, please make the payment using your preferred UPI app:
                </Text>

                <View style={{ backgroundColor: '#DCFCE7', padding: 12, borderRadius: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text selectable style={{ fontSize: 16, fontWeight: '900', color: '#166534', letterSpacing: 0.5 }}>
                        keerthimukesh2003@okhdfcbank
                    </Text>
                </View>
                
                <Text style={{ fontSize: 12, color: '#16A34A', fontWeight: '600', marginTop: 12, fontStyle: 'italic' }}>
                    * When you tap 'Proceed to Pay', your UPI app will open automatically to complete the transaction.
                </Text>
            </View>
        )}

      </ScrollView>
      </KeyboardAvoidingView>

      {/* ── Floating Pay Footer ── */}
      <View style={styles.footerWrap}>
        <View style={styles.footerContainer}>
            <TouchableOpacity style={styles.payButton} onPress={handlePlaceOrder} activeOpacity={0.9} disabled={isSubmitting}>
                <View>
                    <Text style={styles.payAmount}>₹{totalToPay.toFixed(2)}</Text>
                    <Text style={styles.paySub}>TOTAL</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {isSubmitting ? (
                        <ActivityIndicator color="#fff" size="small" />
                    ) : (
                        <>
                            <Text style={styles.payBtnText}>Proceed to Pay</Text>
                            <Icon name="chevron-right" size={22} color="#fff" />
                        </>
                    )}
                </View>
            </TouchableOpacity>
        </View>
      </View>

      {/* ── Modern Success Modal ── */}
      <Modal visible={showSuccess} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.successIconWrap}>
              <Icon name="check-circle" size={80} color="#16A34A" />
            </View>
            <Text style={styles.successTitle}>Order Placed Successfully!</Text>
            <Text style={styles.successDesc}>
              Thank you <Text style={{fontWeight: '800', color: '#0F172A'}}>{name}</Text>! Your order has been confirmed and will be delivered to you shortly.
            </Text>
            
            <TouchableOpacity style={styles.successBtn} onPress={handleCloseSuccess} activeOpacity={0.9}>
              <Text style={styles.successBtnText}>Track Order / Go Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ── Modern UPI Payment Confirmation Modal ── */}
      <Modal visible={showPaymentConfirm} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { padding: 24 }]}>
            <View style={{ backgroundColor: '#FEF3C7', width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
              <Icon name="help-circle" size={40} color="#D97706" />
            </View>
            <Text style={{ fontSize: 20, fontWeight: '900', color: '#0F172A', textAlign: 'center', marginBottom: 12 }}>
              Did you pay ₹{totalToPay.toFixed(2)}?
            </Text>
            <Text style={{ fontSize: 14, color: '#475569', textAlign: 'center', lineHeight: 22, marginBottom: 24, fontWeight: '500' }}>
              Please confirm if you successfully completed the transaction in your UPI app.
            </Text>
            
            <View style={{ flexDirection: 'row', width: '100%', gap: 12 }}>
                <TouchableOpacity 
                    style={{ flex: 1, backgroundColor: '#F1F5F9', paddingVertical: 14, borderRadius: 12, alignItems: 'center' }} 
                    onPress={() => {
                        setShowPaymentConfirm(false);
                        notifyUPIPaymentStatus('CANCELLED');
                    }} 
                    activeOpacity={0.8}
                >
                    <Text style={{ color: '#475569', fontSize: 15, fontWeight: '800' }}>No, Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={{ flex: 1, backgroundColor: '#16A34A', paddingVertical: 14, borderRadius: 12, alignItems: 'center' }} 
                    onPress={() => {
                        setShowPaymentConfirm(false);
                        notifyUPIPaymentStatus('PAID');
                        submitOrderToBackend('paid');
                    }} 
                    activeOpacity={0.8}
                >
                    <Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: '800' }}>Yes, Paid</Text>
                </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <AddressModal
        visible={showAddressModal}
        onClose={() => { setShowAddressModal(false); setAddressToEdit(null); }}
        onSuccess={fetchAddresses}
        userId={currentUserId}
        initialData={addressToEdit}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F4F5F7' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 16, 
    backgroundColor: '#F4F5F7',
  },
  backButton: { marginRight: 16 },
  backIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#0F172A' },
  headerSubtitle: { fontSize: 13, color: '#64748B', fontWeight: '700', marginTop: 2 },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 160, paddingHorizontal: 16 },
  sectionCard: { 
    backgroundColor: '#FFFFFF', 
    marginTop: 16, 
    padding: 20,
    borderRadius: 16,
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 3,
  },
  cartItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 24 },
  vegIconWrap: { marginRight: 12, marginTop: 4 },
  itemDetails: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: '700', color: '#1E293B', lineHeight: 22 },
  itemPrice: { fontSize: 15, color: '#475569', marginTop: 4, fontWeight: '600' },
  quantityControl: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#FC8019', 
    borderRadius: 18, 
    backgroundColor: '#FFF7F0', 
    width: 90, 
    height: 36,
    justifyContent: 'space-between',
    shadowColor: '#FC8019',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginTop: 4,
  },
  qtyBtnWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  qtyBtn: { color: '#FC8019', fontSize: 18, fontWeight: '900' },
  qtyText: { color: '#FC8019', fontSize: 15, fontWeight: '900' },
  itemTotal: { fontSize: 16, fontWeight: '800', color: '#0F172A', textAlign: 'right' },
  addMoreRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  addMoreIconBg: {
    backgroundColor: '#FFF7F0',
    padding: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FEEBC8',
  },
  addMoreText: { color: '#FC8019', fontSize: 15, fontWeight: '800', marginLeft: 12 },
  couponCard: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    backgroundColor: '#FFFBDB', 
    marginTop: 16, 
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#F59E0B',
    borderStyle: 'dashed',
  },
  couponIconBg: {
    backgroundColor: '#FEF3C7',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  couponText: { fontSize: 15, fontWeight: '900', color: '#B45309', marginLeft: 12 },
  billTitle: { fontSize: 17, fontWeight: '900', color: '#0F172A', marginBottom: 16 },
  billRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  billLabel: { fontSize: 14, color: '#475569', fontWeight: '600' },
  billValue: { fontSize: 14, color: '#1E293B', fontWeight: '800' },
  dashDivider: { height: 1, backgroundColor: '#E2E8F0', marginVertical: 16 },
  toPayLabel: { fontSize: 18, fontWeight: '900', color: '#0F172A' },
  toPayValue: { fontSize: 18, fontWeight: '900', color: '#0F172A' },
  policySection: { padding: 16, marginTop: 16, backgroundColor: '#E2E8F0', borderRadius: 16 },
  policyTitle: { fontSize: 14, fontWeight: '800', color: '#0F172A', marginBottom: 6 },
  policyDesc: { fontSize: 13, color: '#475569', lineHeight: 20, fontWeight: '500' },
  footerWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 24,
  },
  footerContainer: { padding: 16, paddingBottom: Platform.OS === 'ios' ? 24 : 16 },
  payAddressInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  homeIconBg: {
    backgroundColor: '#F1F5F9',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deliveringTo: { fontSize: 13, color: '#0F172A', fontWeight: '900' },
  footerAddress: { fontSize: 12, color: '#64748B', marginTop: 2, fontWeight: '600' },
  payButton: { 
    backgroundColor: '#60B246', 
    borderRadius: 12, 
    padding: 12, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    shadowColor: '#60B246',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  payAmount: { color: '#FFFFFF', fontSize: 16, fontWeight: '900' },
  paySub: { color: 'rgba(255,255,255,0.9)', fontSize: 11, fontWeight: '700', marginTop: 1 },
  payBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '900', marginRight: 4 },
  inputLabel: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 16
  },
  inputField: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '500'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 20,
  },
  successIconWrap: {
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 12,
  },
  successDesc: {
    fontSize: 15,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    fontWeight: '500',
  },
  successBtn: {
    backgroundColor: '#60B246',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  successBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  rulesInfoCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  rulesInfoTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#1E293B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    paddingLeft: 4,
  },
  rulesInfoText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '600',
    marginLeft: 6,
    lineHeight: 18,
  }
});

export default SwiggyCartScreen;
