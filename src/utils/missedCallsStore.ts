import AsyncStorage from '@react-native-async-storage/async-storage';
import { ENDPOINTS } from './apiConfig';

const MISSED_CALLS_KEY = 'missed_calls_log';

export interface MissedCallRecord {
    id: string;
    userName: string;
    userPhone: string;
    portfolioName: string;
    phoneDialled: string;
    timestamp: string; // ISO string
}

/** Save a new missed call record */
export const saveMissedCall = async (record: Omit<MissedCallRecord, 'id' | 'timestamp'>) => {
    try {
        // 1. Save Locally
        const existing = await getMissedCalls();
        const newRecord: MissedCallRecord = {
            ...record,
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
        };
        const updated = [newRecord, ...existing];
        await AsyncStorage.setItem(MISSED_CALLS_KEY, JSON.stringify(updated));

        // 2. We no longer push to the old userDetails API as the backend moved to call-request.

    } catch (e) {
        console.error('missedCallsStore: save error', e);
    }
};

/** Get all missed call records (newest first) */
export const getMissedCalls = async (): Promise<MissedCallRecord[]> => {
    try {
        const raw = await AsyncStorage.getItem(MISSED_CALLS_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        console.error('missedCallsStore: read error', e);
        return [];
    }
};

/** Delete a single missed call record by id */
export const deleteMissedCall = async (id: string) => {
    try {
        const existing = await getMissedCalls();
        const filtered = existing.filter(r => r.id !== id);
        await AsyncStorage.setItem(MISSED_CALLS_KEY, JSON.stringify(filtered));
    } catch (e) {
        console.error('missedCallsStore: delete error', e);
    }
};

/** Clear all missed call records */
export const clearMissedCalls = async () => {
    await AsyncStorage.removeItem(MISSED_CALLS_KEY);
};
