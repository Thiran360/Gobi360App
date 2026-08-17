import { useState, useCallback } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
// @ts-ignore
import Geocoder from 'react-native-geocoder';

export interface DetailedLocation {
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  fullAddress: string;
}

export const useLocationFetcher = () => {
  const [userLocation, setUserLocation] = useState<string>('Gobichettipalayam, Erode, Tamil Nadu');
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

  const fetchDetailedLocation = useCallback(async (forceRefresh = false): Promise<DetailedLocation | null> => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'We need access to your exact location for precise delivery.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Location permission denied');
          return null;
        }
      }

      setIsFetchingLocation(true);
      setUserLocation('Extracting exact location...');

      return new Promise<DetailedLocation | null>((resolve) => {
        Geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              const geoRes = await Geocoder.geocodePosition({ lat: latitude, lng: longitude });
              
              if (geoRes && geoRes.length > 0) {
                const addr = geoRes[0];
                
                const city = addr.locality || addr.subAdminArea || '';
                const state = addr.adminArea || '';
                const pincode = addr.postalCode || '';
                const exactAddress = addr.formattedAddress || [addr.feature, addr.streetName, addr.subLocality, city, state, pincode].filter(Boolean).join(', ');

                let addressLine = '';
                if (addr.formattedAddress) {
                    const parts = addr.formattedAddress.split(',').map((p: string) => p.trim());
                    // Remove macro regions and Plus Codes (which contain '+')
                    const filtered = parts.filter((p: string) => p !== city && p !== state && p !== pincode && !p.includes(pincode) && p !== 'India' && !p.includes('+'));
                    addressLine = filtered.join(', ');
                }

                if (!addressLine) {
                    const localPartsRaw = [addr.feature, addr.streetNumber, addr.streetName, addr.subLocality];
                    const uniqueLocal: string[] = [];
                    for (const p of localPartsRaw) {
                        // Exclude Plus Codes and duplicate macro elements
                        if (p && !uniqueLocal.includes(p) && p !== city && p !== state && !p.includes('+')) {
                            uniqueLocal.push(p);
                        }
                    }
                    addressLine = uniqueLocal.join(', ');
                }
                
                if (!addressLine) {
                    addressLine = addr.formattedAddress || exactAddress;
                }

                setUserLocation(exactAddress);
                await AsyncStorage.setItem('@swiggy_user_location', exactAddress);
                setIsFetchingLocation(false);
                
                resolve({
                    addressLine,
                    city,
                    state,
                    pincode,
                    fullAddress: exactAddress
                });
              } else {
                throw new Error("No address found");
              }
            } catch (e) {
              console.error('Geocoder error', e);
              // Fallback to nominatim if Geocoder fails (e.g. Play Services not available)
              try {
                  const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`, {
                    headers: {
                      'User-Agent': 'ServiceAppGeolocation/1.0 (Mobile App)',
                      'Accept-Language': 'en-US,en;q=0.9',
                    }
                  });
                  if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
                  const data = await res.json();
                  if (data && data.display_name) {
                      const exactAddress = data.display_name;
                      setUserLocation(exactAddress);
                      await AsyncStorage.setItem('@swiggy_user_location', exactAddress);
                      setIsFetchingLocation(false);
                      resolve({
                          addressLine: exactAddress,
                          city: data.address?.city || data.address?.town || '',
                          state: data.address?.state || '',
                          pincode: data.address?.postcode || '',
                          fullAddress: exactAddress
                      });
                      return;
                  }
              } catch(fallbackErr) {
                  console.error("Nominatim fallback failed", fallbackErr);
              }

              setUserLocation('Could not determine exact address');
              setIsFetchingLocation(false);
              resolve(null);
            }
          },
          (error) => {
            console.error('Geolocation error:', error.code, error.message);
            setUserLocation('GPS signal lost');
            setIsFetchingLocation(false);
            resolve(null);
          },
          { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
      });
    } catch (err) {
      console.warn(err);
      setIsFetchingLocation(false);
      return null;
    }
  }, []);

  const fetchExactLocation = useCallback(async (forceRefresh = false) => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'We need access to your exact location for precise delivery.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Location permission denied');
          return null;
        }
      }

      if (!forceRefresh) {
        const cachedLocation = await AsyncStorage.getItem('@swiggy_user_location');
        if (cachedLocation) {
          setUserLocation(cachedLocation);
          return cachedLocation;
        }
      }

      setIsFetchingLocation(true);
      setUserLocation('Extracting exact location...');

      return new Promise<string>((resolve) => {
        Geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              const geoRes = await Geocoder.geocodePosition({ lat: latitude, lng: longitude });
              if (geoRes && geoRes.length > 0) {
                  const exactAddress = geoRes[0].formattedAddress || [geoRes[0].feature, geoRes[0].streetName, geoRes[0].subLocality, geoRes[0].locality, geoRes[0].adminArea].filter(Boolean).join(', ');
                  setUserLocation(exactAddress);
                  await AsyncStorage.setItem('@swiggy_user_location', exactAddress);
                  setIsFetchingLocation(false);
                  resolve(exactAddress);
                  return;
              }
            } catch (e) {
              console.error('Geocoder exact error', e);
              try {
                  const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`, {
                    headers: {
                      'User-Agent': 'ServiceAppGeolocation/1.0 (Mobile App)',
                      'Accept-Language': 'en-US,en;q=0.9',
                    }
                  });
                  if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
                  
                  const data = await res.json();
                  if (data && data.display_name) {
                    const exactAddress = data.display_name;
                    setUserLocation(exactAddress);
                    await AsyncStorage.setItem('@swiggy_user_location', exactAddress);
                    setIsFetchingLocation(false);
                    resolve(exactAddress);
                    return;
                  }
              } catch(fallbackErr) {
                  console.error("Nominatim exact fallback failed", fallbackErr);
              }
              setUserLocation('Could not determine exact address');
              setIsFetchingLocation(false);
              resolve('Could not determine exact address');
            }
          },
          (error) => {
            console.error('Geolocation error:', error.code, error.message);
            setUserLocation('GPS signal lost');
            setIsFetchingLocation(false);
            resolve('GPS signal lost');
          },
          { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
      });
    } catch (err) {
      console.warn(err);
      setIsFetchingLocation(false);
      return null;
    }
  }, []);

  const loadSavedLocation = useCallback(async () => {
    const cachedLocation = await AsyncStorage.getItem('@swiggy_user_location');
    if (cachedLocation) {
      setUserLocation(cachedLocation);
    }
  }, []);

  return { userLocation, isFetchingLocation, fetchExactLocation, fetchDetailedLocation, loadSavedLocation, setUserLocation };
};
