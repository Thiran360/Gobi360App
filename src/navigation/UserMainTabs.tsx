import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { View, StyleSheet, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';

// Import Screens
import UserDashboardScreen from '../screens/UserDashboardScreen';
import ExpertsScreen from '../screens/ExpertsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const UserMainTabs = () => {
    const { t } = useTranslation();
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: true,
                tabBarActiveTintColor: '#3B82F6',
                tabBarInactiveTintColor: '#94A3B8',
                tabBarStyle: styles.tabBar,
                tabBarLabelStyle: styles.tabBarLabel,
                tabBarIcon: ({ focused, color }) => {
                    let iconName = '';

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Experts') {
                        iconName = focused ? 'briefcase-variant' : 'briefcase-variant-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'account' : 'account-outline';
                    }

                    return (
                        <View style={[
                            styles.iconContainer,
                            focused && styles.activeIconContainer
                        ]}>
                            <Icon name={iconName} size={24} color={color} />
                        </View>
                    );
                },
            })}
        >
            <Tab.Screen 
                name="Home" 
                component={UserDashboardScreen} 
                options={{ tabBarLabel: t('nav.home') }}
            />
            <Tab.Screen 
                name="Experts" 
                component={ExpertsScreen} 
                options={{ tabBarLabel: t('nav.experts') }}
            />
            <Tab.Screen 
                name="Profile" 
                component={ProfileScreen} 
                options={{ tabBarLabel: t('nav.profile') }}
            />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    tabBar: {
        height: Platform.OS === 'ios' ? 90 : 72,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
        paddingTop: 8,
        paddingBottom: Platform.OS === 'ios' ? 32 : 12,
        elevation: 15,
        shadowColor: '#64748B',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
    },
    tabBarLabel: {
        fontSize: 12,
        fontWeight: '700',
        marginTop: 4,
    },
    iconContainer: {
        width: 54,
        height: 34,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
    },
    activeIconContainer: {
        backgroundColor: '#EFF6FF',
    },
});

export default UserMainTabs;
