import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, Platform } from 'react-native';
import SpInAppUpdates, {
  IAUUpdateKind,
  StartUpdateOptions,
} from 'sp-react-native-in-app-updates';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { I18nextProvider } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from './src/i18n/config';
import { CartProvider } from './src/context/CartContext';
import { AlertProvider } from './src/context/AlertContext';
import CustomAlert from './src/components/CustomAlert';

// Import Screens
import LanguageSelectionScreen from './src/screens/LanguageSelectionScreen';
import LoginScreen from './src/screens/LoginScreen';
import UserSignupScreen from './src/screens/UserSignupScreen';
import AdminDashboardScreen from './src/screens/AdminDashboardScreen';
import ShopOwnerLoginScreen from './src/screens/ShopOwnerLoginScreen';
import ShopOwnerMainTabs from './src/navigation/ShopOwnerMainTabs';
import UserMainTabs from './src/navigation/UserMainTabs';
import ServiceCategoryScreen from './src/screens/ServiceCategoryScreen';
import SkylinePortfolioScreen from './src/screens/SkylinePortfolioScreen';
import SkylineServiceDetailScreen from "./src/screens/SkylineServiceDetailScreen";
import SpokenHindiPortfolioScreen from './src/screens/SpokenHindiPortfolioScreen';
import WoodZonePortfolioScreen from './src/screens/WoodZonePortfolioScreen';
import GVBuildtechPortfolioScreen from './src/screens/GVBuildtechPortfolioScreen';
import Thiran360AIPortfolioScreen from './src/screens/Thiran360AIPortfolioScreen';
import SwarajTractorPortfolioScreen from './src/screens/SwarajTractorPortfolioScreen';
import SunPowerPortfolioScreen from './src/screens/SunPowerPortfolioScreen';
import ManojSteelsPortfolioScreen from './src/screens/ManojSteelsPortfolioScreen';
import MejesticStudioPortfolioScreen from './src/screens/MejesticStudioPortfolioScreen';
import SakthiElectricalsPortfolioScreen from './src/screens/SakthiElectricalsPortfolioScreen';
import GanagatharaPortfolioScreen from './src/screens/GanagatharaPortfolioScreen';
import SriJeyamPortfolioScreen from './src/screens/SriJeyamPortfolioScreen';
import SriJeyamServiceDetailScreen from './src/screens/SriJeyamServiceDetailScreen';
import AbiramiPortfolioScreen from './src/screens/AbiramiPortfolioScreen';
import STGEsportsPortfolioScreen from './src/screens/STGEsportsPortfolioScreen';
import TermsAndConditionsScreen from './src/screens/TermsAndConditionsScreen';
import PrivacySecurityScreen from './src/screens/PrivacySecurityScreen';
import AboutAppScreen from './src/screens/AboutAppScreen';
import HelpSupportScreen from './src/screens/HelpSupportScreen';
import OfflineNotice from './src/components/OfflineNotice';
import GlobalCallTracker from './src/components/GlobalCallTracker';
import SwiggyMainTabs from './src/navigation/SwiggyMainTabs';
import SwiggyRestaurantDetailScreen from './src/screens/swiggy/SwiggyRestaurantDetailScreen';
import SwiggyCartScreen from './src/screens/swiggy/SwiggyCartScreen';
import SwiggyProfileScreen from './src/screens/swiggy/SwiggyProfileScreen';
import DynamicExpertServicesScreen from './src/screens/DynamicExpertServicesScreen';
import BookingsScreen from './src/screens/BookingsScreen';
import ExpertMainTabs from './src/navigation/ExpertMainTabs';
import ServiceCartScreen from './src/screens/ServiceCartScreen';
import ExpertBillsScreen from './src/screens/ExpertBillsScreen';
import DeliverymanMainTabs from './src/navigation/DeliverymanMainTabs';
import DeliverymanNotificationsScreen from './src/screens/DeliverymanNotificationsScreen';

// Define the parameter list for our stack
export type RootStackParamList = {
  LanguageSelection: undefined;
  Login: undefined;
  UserSignup: undefined;
  UserMainTabs: undefined;
  AdminDashboard: undefined;
  ShopOwnerLogin: undefined;
  ShopOwnerMainTabs: undefined;
  ServiceCategory: { category: string; icon: string; color: string; bg: string };
  SkylinePortfolio: undefined;
  SkylineServiceDetail: { serviceId: number };
  SpokenHindiPortfolio: undefined;
  WoodZonePortfolio: undefined;
  GVBuildtechPortfolio: undefined;
  Thiran360AIPortfolio: undefined;
  SwarajTractorPortfolio: undefined;
  SunPowerPortfolio: undefined;
  ManojSteelsPortfolio: undefined;
  MejesticStudioPortfolio: undefined;
  SakthiElectricalsPortfolio: undefined;
  GanagatharaPortfolio: undefined;
  SriJeyamPortfolio: undefined;
  SriJeyamServiceDetail: { serviceId: number };
  AbiramiPortfolio: undefined;
  STGEsportsPortfolio: undefined;
  Experts: { filter?: string };
  TermsAndConditions: undefined;
  PrivacySecurity: undefined;
  AboutApp: undefined;
  HelpSupport: undefined;
  SwiggyMainTabs: undefined;
  SwiggyRestaurantDetail: { restaurantId: string };
  SwiggyCart: undefined;
  SwiggyProfile: undefined;
  DynamicExpertServices: { expertId: number; expertName: string; expertImage: string; category: string; phone: string; initialServices?: any[] };
  Bookings: undefined;
  ExpertMainTabs: undefined;
  ServiceCart: undefined;
  ExpertBills: undefined;
  DeliverymanMainTabs: undefined;
  DeliverymanNotifications: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList>('LanguageSelection');

  useEffect(() => {
    try {
      const inAppUpdates = new SpInAppUpdates(false); // isDebug = false
      inAppUpdates.checkNeedsUpdate().then((result) => {
        if (result.shouldUpdate) {
          let updateOptions: StartUpdateOptions = {};
          if (Platform.OS === 'android') {
            updateOptions = {
              updateType: IAUUpdateKind.FLEXIBLE,
            };
          }
          inAppUpdates.startUpdate(updateOptions);
        }
      }).catch((err) => console.log('In-App Update Check Error:', err));
    } catch (error) {
      console.log('Error initializing SpInAppUpdates:', error);
    }
  }, []);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('user-language');
        const userSession = await AsyncStorage.getItem('userSession');
        const termsAccepted = await AsyncStorage.getItem('termsAccepted');

        if (!savedLanguage) {
          // First time: show language selection
          setInitialRoute('LanguageSelection');
        } else {
          // Language is saved, we can go to Dashboard (UserMainTabs)
          // But if there's a session, we must check terms first
          if (userSession) {
            const sessionObj = JSON.parse(userSession);
            const userRole = sessionObj.role || sessionObj.user?.role;
            
            if (userRole === 'shopOwner' || userRole === 'shopkeeper') {
              setInitialRoute('ShopOwnerMainTabs');
            } else if (userRole === 'experts' || userRole === 'expert') {
              setInitialRoute('ExpertMainTabs');
            } else if (userRole === 'deliveryman') {
              setInitialRoute('DeliverymanMainTabs');
            } else if (termsAccepted === 'true') {
              setInitialRoute('UserMainTabs');
            } else {
              setInitialRoute('TermsAndConditions');
            }
          } else {
            // No session -> allow dashboard access
            setInitialRoute('UserMainTabs');
          }
        }
      } catch (e) {
        console.error('Error during app boot:', e);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrap();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' }}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <I18nextProvider i18n={i18n}>
      <AlertProvider>
        <CartProvider>
          <SafeAreaProvider>
            <CustomAlert />
            <OfflineNotice />
            <GlobalCallTracker />
            <NavigationContainer>
              <Stack.Navigator
                initialRouteName={initialRoute}
                screenOptions={{
                  headerShown: false,
                  animation: 'slide_from_right',
                }}
              >
                <Stack.Screen
                  name="LanguageSelection"
                  component={LanguageSelectionScreen}
                />
                <Stack.Screen
                  name="Login"
                  component={LoginScreen}
                />
                <Stack.Screen
                  name="UserSignup"
                  component={UserSignupScreen}
                />
                <Stack.Screen
                  name="UserMainTabs"
                  component={UserMainTabs}
                />
                <Stack.Screen
                  name="AdminDashboard"
                  component={AdminDashboardScreen}
                />
                <Stack.Screen
                  name="ShopOwnerLogin"
                  component={ShopOwnerLoginScreen}
                />
                <Stack.Screen
                  name="ShopOwnerMainTabs"
                  component={ShopOwnerMainTabs}
                />
                <Stack.Screen
                  name="ServiceCategory"
                  component={ServiceCategoryScreen}
                />
                <Stack.Screen
                  name="SkylinePortfolio"
                  component={SkylinePortfolioScreen}
                />
                <Stack.Screen
                  name="SkylineServiceDetail"
                  component={SkylineServiceDetailScreen}
                />
                <Stack.Screen
                  name="SpokenHindiPortfolio"
                  component={SpokenHindiPortfolioScreen}
                />
                <Stack.Screen
                  name="WoodZonePortfolio"
                  component={WoodZonePortfolioScreen}
                />
                <Stack.Screen
                  name="GVBuildtechPortfolio"
                  component={GVBuildtechPortfolioScreen}
                />
                <Stack.Screen
                  name="Thiran360AIPortfolio"
                  component={Thiran360AIPortfolioScreen}
                />
                <Stack.Screen
                  name="SwarajTractorPortfolio"
                  component={SwarajTractorPortfolioScreen}
                />
                <Stack.Screen
                  name="SunPowerPortfolio"
                  component={SunPowerPortfolioScreen}
                />
                <Stack.Screen
                  name="ManojSteelsPortfolio"
                  component={ManojSteelsPortfolioScreen}
                />
                <Stack.Screen name="MejesticStudioPortfolio" component={MejesticStudioPortfolioScreen} />
                <Stack.Screen name="SakthiElectricalsPortfolio" component={SakthiElectricalsPortfolioScreen} />
                <Stack.Screen name="GanagatharaPortfolio" component={GanagatharaPortfolioScreen} />
                <Stack.Screen name="SriJeyamPortfolio" component={SriJeyamPortfolioScreen} />
                <Stack.Screen name="SriJeyamServiceDetail" component={SriJeyamServiceDetailScreen} />
                <Stack.Screen name="AbiramiPortfolio" component={AbiramiPortfolioScreen} />
                <Stack.Screen name="STGEsportsPortfolio" component={STGEsportsPortfolioScreen} />
                <Stack.Screen
                  name="TermsAndConditions"
                  component={TermsAndConditionsScreen}
                />
                <Stack.Screen
                  name="PrivacySecurity"
                  component={PrivacySecurityScreen}
                />
                <Stack.Screen
                  name="AboutApp"
                  component={AboutAppScreen}
                />
                <Stack.Screen
                  name="HelpSupport"
                  component={HelpSupportScreen}
                />
                <Stack.Screen
                  name="SwiggyMainTabs"
                  component={SwiggyMainTabs}
                />
                <Stack.Screen
                  name="SwiggyRestaurantDetail"
                  component={SwiggyRestaurantDetailScreen}
                />
                <Stack.Screen
                  name="SwiggyCart"
                  component={SwiggyCartScreen}
                />
                <Stack.Screen
                  name="SwiggyProfile"
                  component={SwiggyProfileScreen}
                />
                <Stack.Screen
                  name="DynamicExpertServices"
                  component={DynamicExpertServicesScreen}
                />
                <Stack.Screen
                  name="Bookings"
                  component={BookingsScreen}
                />
                <Stack.Screen 
                  name="DeliverymanNotifications" 
                  component={DeliverymanNotificationsScreen} 
                />
                <Stack.Screen 
                  name="ExpertMainTabs" 
                  component={ExpertMainTabs} 
                />
                <Stack.Screen 
                  name="ServiceCart" 
                  component={ServiceCartScreen} 
                />
                <Stack.Screen 
                  name="ExpertBills" 
                  component={ExpertBillsScreen} 
                />
                <Stack.Screen 
                  name="DeliverymanMainTabs" 
                  component={DeliverymanMainTabs} 
                />
              </Stack.Navigator>
            </NavigationContainer>
          </SafeAreaProvider>
        </CartProvider>
      </AlertProvider>
    </I18nextProvider>
  );
}

export default App;
