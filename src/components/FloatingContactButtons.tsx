import React, { useEffect, useRef } from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    Linking,
    View,
    Platform,
    Animated,
    Easing,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { checkSessionAndNavigate } from '../utils/auth';
import { triggerCall } from '../utils/callTracker';

interface FloatingContactButtonsProps {
    phoneNumber?: string;
    whatsappNumber?: string; // Optional separate WhatsApp number
    businessName?: string;
    onCall?: () => void;
    onWhatsapp?: () => void;
}

const FloatingContactButtons: React.FC<FloatingContactButtonsProps> = ({ phoneNumber, whatsappNumber, businessName, onCall, onWhatsapp }) => {
    const navigation = useNavigation<any>();

    // Animation Values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const floatAnim = useRef(new Animated.Value(0)).current;

    // Press scale values
    const scaleCall = useRef(new Animated.Value(1)).current;
    const scaleWhatsApp = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Entrance animation
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                delay: 200,
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                friction: 6,
                tension: 40,
                useNativeDriver: true,
            }),
        ]).start();

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

    const handlePressIn = (scaleVar: Animated.Value) => {
        Animated.spring(scaleVar, { toValue: 0.9, useNativeDriver: true }).start();
    };

    const handlePressOut = (scaleVar: Animated.Value) => {
        Animated.spring(scaleVar, { toValue: 1, friction: 3, tension: 40, useNativeDriver: true }).start();
    };

    const handleCall = () => {
        if (onCall) {
            onCall();
            return;
        }
        if (!phoneNumber || !businessName) return;
        checkSessionAndNavigate(navigation, () => {
            triggerCall(phoneNumber, businessName);
        });
    };

    const handleWhatsApp = () => {
        if (onWhatsapp) {
            onWhatsapp();
            return;
        }
        checkSessionAndNavigate(navigation, () => {
            const waNum = whatsappNumber || phoneNumber;
            if (!waNum) return;
            const msg = `Hi ${businessName || ''}, I am interested in your services.`;
            const url =
                Platform.OS === 'ios'
                    ? `whatsapp://send?phone=${waNum}&text=${encodeURIComponent(msg)}`
                    : `whatsapp://send?phone=91${waNum}&text=${encodeURIComponent(msg)}`;
            Linking.openURL(url).catch(() => {
                Linking.openURL(`https://wa.me/91${waNum}?text=${encodeURIComponent(msg)}`);
            });
        });
    };

    return (
        <View style={styles.wrapperContainer} pointerEvents="box-none">
            <Animated.View
                style={[
                    styles.container,
                    {
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }, { translateY: floatAnim }],
                    },
                ]}
            >
                <Animated.View style={{ transform: [{ scale: scaleCall }] }}>
                    <TouchableOpacity
                        style={[styles.button, styles.callButton]}
                        onPress={handleCall}
                        onPressIn={() => handlePressIn(scaleCall)}
                        onPressOut={() => handlePressOut(scaleCall)}
                        activeOpacity={0.8}
                    >
                        <Icon name="phone" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                </Animated.View>

                <Animated.View style={{ transform: [{ scale: scaleWhatsApp }] }}>
                    <TouchableOpacity
                        style={[styles.button, styles.whatsappButton]}
                        onPress={handleWhatsApp}
                        onPressIn={() => handlePressIn(scaleWhatsApp)}
                        onPressOut={() => handlePressOut(scaleWhatsApp)}
                        activeOpacity={0.8}
                    >
                        <Icon name="whatsapp" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                </Animated.View>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapperContainer: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 999,
    },
    container: {
        position: 'absolute',
        bottom: 30,
        right: 20,
        gap: 15,
        alignItems: 'center',
        zIndex: 1000,
    },
    button: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    callButton: {
        backgroundColor: '#3B82F6',
    },
    whatsappButton: {
        backgroundColor: '#25D366',
    },
});

export default FloatingContactButtons;
