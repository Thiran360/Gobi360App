import { useState, useCallback } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useLocationFetcher = () => {
  const [userLocation, setUserLocation] = useState<string>('Gobichettipalayam, Erode, Tamil Nadu');
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

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
              const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`, {
                headers: {
                  'User-Agent': 'ServiceAppGeolocation/1.0 (Mobile App)',
                  'Accept-Language': 'en-US,en;q=0.9',
                }
              });
              if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
              
              const data = await res.json();
              if (data && data.address) {
                const addr = data.address;
                const building = addr.house_number || addr.building || '';
                const street = addr.road || addr.street || addr.pedestrian || '';
                const area = addr.suburb || addr.neighbourhood || addr.village || addr.city_district || '';
                const city = addr.city || addr.town || addr.county || '';
                const state = addr.state || '';
                const pincode = addr.postcode || '';

                const formattedParts = [building, street, area, city, state, pincode].filter(Boolean);
                const exactAddress = formattedParts.length > 0 ? formattedParts.join(', ') : data.display_name;

                setUserLocation(exactAddress);
                await AsyncStorage.setItem('@swiggy_user_location', exactAddress);
                setIsFetchingLocation(false);
                resolve(exactAddress);
              } else if (data && data.display_name) {
                const exactAddress = data.display_name;
                setUserLocation(exactAddress);
                await AsyncStorage.setItem('@swiggy_user_location', exactAddress);
                setIsFetchingLocation(false);
                resolve(exactAddress);
              } else {
                setUserLocation('Location Found (Unknown Address)');
                setIsFetchingLocation(false);
                resolve('Location Found (Unknown Address)');
              }
            } catch (e) {
              console.error('Geocoding error', e);
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

  return { userLocation, isFetchingLocation, fetchExactLocation, loadSavedLocation, setUserLocation };
};
