import React from 'react';  
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { View, StyleSheet, Platform } from 'react-native';

// Import Screens
import SwiggyHomeScreen from '../screens/swiggy/SwiggyHomeScreen';
import SwiggyCartScreen from '../screens/swiggy/SwiggyCartScreen';

const Tab = createBottomTabNavigator();

// Mock component for unused tabs
const MockScreen = () => <View style={{ flex: 1, backgroundColor: '#fff' }} />;

const SwiggyMainTabs = ({ route }: any) => { 
    const params = route?.params || {};
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: true,
                tabBarActiveTintColor: '#3B82F6', // Blue
                tabBarInactiveTintColor: '#94A3B8',
                tabBarStyle: styles.tabBar,
                tabBarLabelStyle: styles.tabBarLabel,
                tabBarIcon: ({ focused, color }) => {
                    let iconName = '';

                    if (route.name === 'Swiggy') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Cart') {
                        iconName = focused ? 'cart' : 'cart-outline';
                    }

                    return (
                        <View style={styles.iconContainer}>
                            <Icon name={iconName} size={22} color={color} />
                        </View>
                    );
                },
            })}
        >
            <Tab.Screen 
                name="Swiggy" 
                component={SwiggyHomeScreen}
                initialParams={params}
                options={{ tabBarLabel: params.categoryName ? params.categoryName : 'Swiggy' }}
            />
            <Tab.Screen 
                name="Cart" 
                component={SwiggyCartScreen} 
                options={{ tabBarLabel: 'Cart' }}
            />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    tabBar: {
        height: Platform.OS === 'ios' ? 75 : 56,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
        paddingTop: 6,
        paddingBottom: Platform.OS === 'ios' ? 24 : 8,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },
    tabBarLabel: {
        fontSize: 10,
        fontWeight: '600',
        marginTop: 2,
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default SwiggyMainTabs;
