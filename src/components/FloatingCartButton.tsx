import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../context/CartContext';
import { checkSessionAndNavigate } from '../utils/auth';

interface FloatingCartButtonProps {
    expertId?: number;
    expertName?: string;
}

const FloatingCartButton = ({ expertId, expertName }: FloatingCartButtonProps = {}) => {
    const navigation = useNavigation<any>();
    const { getTotalItems } = useCart();
    const totalItems = getTotalItems();

    const floatAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Continuous floating animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(floatAnim, {
                    toValue: -8,
                    duration: 1500,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
                Animated.timing(floatAnim, {
                    toValue: 0,
                    duration: 1500,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const handlePress = () => {
        checkSessionAndNavigate(navigation, () => {
            navigation.navigate('ServiceCart', { expertId, expertName }); // Uses the new Service Cart screen
        });
    };

    // Always render the cart button, even if empty, so the user can navigate to it
    return (
        <View style={styles.container} pointerEvents="box-none">
            <Animated.View style={{ transform: [{ translateY: floatAnim }] }}>
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={handlePress}
                    activeOpacity={0.8}
                >
                    <Icon name="cart-outline" size={24} color="#FFFFFF" />
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 175, // Positioned directly above the Call and WhatsApp buttons
        right: 20,
        zIndex: 1000,
    },
    button: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#F97316',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    badge: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#EF4444',
        borderRadius: 12,
        minWidth: 22,
        height: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFFFFF',
        paddingHorizontal: 4,
    },
    badgeText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
});

export default FloatingCartButton;
