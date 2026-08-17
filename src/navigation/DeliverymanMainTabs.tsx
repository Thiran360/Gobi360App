import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { View, StyleSheet, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';

// Import Screens
import DeliverymanOrdersScreen from '../screens/DeliverymanOrdersScreen';
import DeliverymanTotalOrdersScreen from '../screens/DeliverymanTotalOrdersScreen';
import DeliverymanProfileScreen from '../screens/DeliverymanProfileScreen';

const Tab = createBottomTabNavigator();

const DeliverymanMainTabs = () => {
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

                    if (route.name === 'DeliveryOrders') {
                        iconName = focused ? 'clipboard-text' : 'clipboard-text-outline';
                    } else if (route.name === 'DeliveryTotalOrders') {
                        iconName = focused ? 'format-list-checks' : 'format-list-checkbox';
                    } else if (route.name === 'DeliveryProfile') {
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
                name="DeliveryOrders" 
                component={DeliverymanOrdersScreen} 
                options={{ tabBarLabel: 'Orders' }}
            />
            <Tab.Screen 
                name="DeliveryTotalOrders" 
                component={DeliverymanTotalOrdersScreen} 
                options={{ tabBarLabel: 'Total Orders' }}
            />
            <Tab.Screen 
                name="DeliveryProfile" 
                component={DeliverymanProfileScreen} 
                options={{ tabBarLabel: 'Profile' }}
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
        fontWeight: '600',
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
    }
});

export default DeliverymanMainTabs;
