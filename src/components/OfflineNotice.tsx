import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Dimensions,
    Platform,
    StatusBar,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

const OfflineNotice = () => {
    const { t } = useTranslation();
    const [isConnected, setIsConnected] = useState<boolean | null>(true);
    const animation = React.useRef(new Animated.Value(-100)).current;

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!isConnected) {
            Animated.timing(animation, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(animation, {
                toValue: -100,
                duration: 500,
                useNativeDriver: true,
            }).start();
        }
    }, [isConnected]);

    if (isConnected === null || isConnected) return null;

    return (
        <Animated.View 
            style={[
                styles.offlineContainer, 
                { transform: [{ translateY: animation }] }
            ]}
        >
            <StatusBar backgroundColor="#EF4444" barStyle="light-content" />
            <View style={styles.content}>
                <Icon name="wifi-off" size={20} color="#FFFFFF" />
                <Text style={styles.offlineText}>{t('common.no_internet')}</Text>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    offlineContainer: {
        backgroundColor: '#EF4444',
        height: Platform.OS === 'ios' ? 90 : 60,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        width: width,
        position: 'absolute',
        top: 0,
        zIndex: 1000,
        paddingTop: Platform.OS === 'ios' ? 40 : 0,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    offlineText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
    },
});

export default OfflineNotice;
