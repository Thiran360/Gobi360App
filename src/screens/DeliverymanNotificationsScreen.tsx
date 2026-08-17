import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../utils/apiConfig';
import { useNavigation } from '@react-navigation/native';

const DeliverymanNotificationsScreen = () => {
    const navigation = useNavigation();
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        try {
            const session = await AsyncStorage.getItem('userSession');
            if (session) {
                const parsed = JSON.parse(session);
                const userObj = parsed.user || {};
                const dId = userObj.id || parsed.id || null;
                
                if (dId) {
                    const res = await fetch(`${BASE_URL}/gobi360/deliveryman/notifications/${dId}/`);
                    if (res.ok) {
                        const data = await res.json();
                        if (data && data.notifications) {
                            setNotifications(data.notifications);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Fetch notifications error:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = () => {
        fetchNotifications(true);
    };

    const renderNotification = ({ item }: { item: any }) => (
        <View style={[styles.notificationCard, !item.is_read && styles.unreadCard]}>
            <View style={styles.iconContainer}>
                <Icon name="bell-ring" size={24} color="#3B82F6" />
            </View>
            <View style={styles.content}>
                <Text style={styles.title}>{item.title || 'New Notification'}</Text>
                <Text style={styles.message}>{item.message}</Text>
                <Text style={styles.time}>{item.created_at ? new Date(item.created_at).toLocaleString() : 'Just now'}</Text>
            </View>
            {!item.is_read && <View style={styles.unreadDot} />}
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" size={24} color="#1E293B" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notifications</Text>
            </View>
            
            {loading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#3B82F6" />
                </View>
            ) : (
                <FlatList
                    data={notifications}
                    keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
                    renderItem={renderNotification}
                    contentContainerStyle={styles.listContainer}
                    onRefresh={handleRefresh}
                    refreshing={refreshing}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Icon name="bell-sleep" size={64} color="#CBD5E1" style={{ marginBottom: 16 }} />
                            <Text style={styles.emptyTitle}>No Notifications Yet</Text>
                            <Text style={styles.emptySub}>When you get alerts about orders, they'll appear here.</Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    backButton: {
        padding: 4,
        marginRight: 12,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1E293B',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContainer: {
        padding: 16,
        paddingBottom: 40,
    },
    notificationCard: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#64748B',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    unreadCard: {
        backgroundColor: '#F0F9FF',
        borderWidth: 1,
        borderColor: '#BAE6FD',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: 4,
    },
    message: {
        fontSize: 14,
        color: '#64748B',
        lineHeight: 20,
        marginBottom: 6,
    },
    time: {
        fontSize: 12,
        color: '#94A3B8',
        fontWeight: '500',
    },
    unreadDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#3B82F6',
        marginTop: 4,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 60,
        padding: 20,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#475569',
        marginBottom: 8,
    },
    emptySub: {
        fontSize: 14,
        color: '#94A3B8',
        textAlign: 'center',
    }
});

export default DeliverymanNotificationsScreen;
