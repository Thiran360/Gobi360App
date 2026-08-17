import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const DeliverymanDashboardScreen = () => {
    const navigation = useNavigation<any>();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Delivery Dashboard</Text>
            </View>
            <View style={styles.content}>
                <Icon name="bike" size={64} color="#3B82F6" style={{ marginBottom: 16 }} />
                <Text style={styles.welcomeText}>Welcome, Delivery Partner!</Text>
                <Text style={styles.subText}>Your delivery tasks will appear here.</Text>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0'
    },
    headerTitle: { fontSize: 20, fontWeight: '800', color: '#0F172A' },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    welcomeText: { fontSize: 24, fontWeight: '800', color: '#1E293B', marginBottom: 8 },
    subText: { fontSize: 16, color: '#64748B', textAlign: 'center' }
});

export default DeliverymanDashboardScreen;
