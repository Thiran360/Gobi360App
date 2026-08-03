import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp } from '@react-navigation/native';

export const checkSessionAndNavigate = async (navigation: NavigationProp<any>, action: () => void) => {
    try {
        const userSession = await AsyncStorage.getItem('userSession');
        if (userSession) {
            action();
        } else {
            navigation.navigate('Login' as any);
        }
    } catch (error) {
        console.error('Error checking session:', error);
        navigation.navigate('Login' as any);
    }
};
