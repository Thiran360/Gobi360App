import React from 'react';  
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { View, StyleSheet, Platform } from 'react-native';

// Import Screens
import ShopOwnerDashboardScreen from '../screens/ShopOwnerDashboardScreen';
import ShopOwnerPointsScreen from '../screens/ShopOwnerPointsScreen';
import ShopOwnerProfileScreen from '../screens/ShopOwnerProfileScreen';

const Tab = createBottomTabNavigator();

const ShopOwnerMainTabs = () => { 
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: true,
                tabBarActiveTintColor: '#0066FF', // Blue for Shop Owner
                tabBarInactiveTintColor: '#94A3B8',
                tabBarStyle: styles.tabBar,
                tabBarLabelStyle: styles.tabBarLabel,
                tabBarIcon: ({ focused, color }) => {
                    let iconName = '';

                    if (route.name === 'Orders') {
                        iconName = focused ? 'format-list-checks' : 'format-list-bulleted';
                    } else if (route.name === 'Points') {
                        iconName = focused ? 'star-circle' : 'star-circle-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'account-circle' : 'account-circle-outline';
                    }

                    return (
                        <View style={styles.iconContainer}>
                            <Icon name={iconName} size={26} color={color} />
                        </View>
                    );
                },
            })}
        >
            <Tab.Screen 
                name="Orders" 
                component={ShopOwnerDashboardScreen}
                options={{ tabBarLabel: 'Orders' }}
            />
            <Tab.Screen 
                name="Points" 
                component={ShopOwnerPointsScreen} 
                options={{ tabBarLabel: 'Add Points' }}
            />
            <Tab.Screen 
                name="Profile" 
                component={ShopOwnerProfileScreen} 
                options={{ tabBarLabel: 'Profile' }}
            />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    tabBar: {
        height: Platform.OS === 'ios' ? 90 : 70,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
        paddingTop: 8,
        paddingBottom: Platform.OS === 'ios' ? 32 : 12,
        elevation: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
    },
    tabBarLabel: {
        fontSize: 11,
        fontWeight: '700',
        marginTop: 2,
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ShopOwnerMainTabs;
