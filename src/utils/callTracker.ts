import { Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ACTIVE_CALL_KEY = 'active_call_info';

export interface CallInfo {
    phoneNumber: string;
    businessName: string;
    timestamp: number;
    expertId?: number | string;
    serviceId?: number;
}

/**
 * Triggers a call and saves metadata to track it when the user returns.
 */
export const triggerCall = async (phoneNumber: string, businessName: string, expertId?: number | string, serviceId?: number) => {
    try {
        const callInfo: CallInfo = {
            phoneNumber,
            businessName,
            timestamp: Date.now(),
            expertId,
            serviceId,
        };
        await AsyncStorage.setItem(ACTIVE_CALL_KEY, JSON.stringify(callInfo));
        Linking.openURL(`tel:${phoneNumber}`);
    } catch (e) {
        console.error('callTracker: triggerCall error', e);
        Linking.openURL(`tel:${phoneNumber}`);
    }
};

/**
 * Retrieves the pending call info if it exists.
 */
export const getPendingCallInfo = async (): Promise<CallInfo | null> => {
    try {
        const raw = await AsyncStorage.getItem(ACTIVE_CALL_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch (e) {
        return null;
    }
};

/**
 * Clears the pending call info.
 */
export const clearPendingCallInfo = async () => {
    await AsyncStorage.removeItem(ACTIVE_CALL_KEY);
};
