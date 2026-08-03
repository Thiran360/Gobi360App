import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CHATS_DATA = [
    {
        id: '1',
        name: 'Rahul Sharma',
        role: 'Master Plumber',
        lastMessage: 'I am on my way to your location.',
        time: '10:42 AM',
        unread: 2,
        online: true,
        avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?q=80&w=150&auto=format&fit=crop',
    },
    {
        id: '2',
        name: 'Service Support',
        role: 'Customer Care',
        lastMessage: 'Your refund has been initiated successfully.',
        time: 'Yesterday',
        unread: 0,
        online: false,
        avatar: 'https://images.unsplash.com/photo-1629424707663-d15dc01cd4d5?q=80&w=150&auto=format&fit=crop',
    },
];

const ChatScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Inbox</Text>
                <TouchableOpacity style={styles.searchButton}>
                    <Icon name="magnify" size={24} color="#1E293B" />
                </TouchableOpacity>
            </View>

            <FlatList
                contentContainerStyle={styles.listContainer}
                data={CHATS_DATA}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.chatCard}>
                        <View style={styles.avatarContainer}>
                            <Image source={{ uri: item.avatar }} style={styles.avatar} />
                            {item.online && <View style={styles.onlineDot} />}
                        </View>

                        <View style={styles.chatContent}>
                            <View style={styles.chatHeader}>
                                <Text style={styles.name}>{item.name}</Text>
                                <Text style={styles.time}>{item.time}</Text>
                            </View>

                            <Text style={styles.role}>{item.role}</Text>

                            <View style={styles.messageFooter}>
                                <Text numberOfLines={1} style={[styles.message, item.unread > 0 && styles.messageUnread]}>
                                    {item.lastMessage}
                                </Text>
                                {item.unread > 0 && (
                                    <View style={styles.unreadBadge}>
                                        <Text style={styles.unreadText}>{item.unread}</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 24,
        paddingTop: 40,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '900',
        color: '#1E293B',
        lineHeight: 41,
        includeFontPadding: false,
    },
    searchButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F8FAFC',
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContainer: {
        paddingVertical: 12,
    },
    chatCard: {
        flexDirection: 'row',
        padding: 16,
        paddingHorizontal: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#F8FAFC',
    },
    avatarContainer: {
        position: 'relative',
        marginRight: 16,
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#F1F5F9',
    },
    onlineDot: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#10B981',
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    chatContent: {
        flex: 1,
        justifyContent: 'center',
    },
    chatHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 2,
    },
    name: {
        fontSize: 16,
        fontWeight: '800',
        color: '#1E293B',
        lineHeight: 27,
        includeFontPadding: false,
    },
    time: {
        fontSize: 11,
        color: '#94A3B8',
        fontWeight: '500',
        lineHeight: 18,
        includeFontPadding: false,
    },
    role: {
        fontSize: 11,
        color: '#3B82F6',
        fontWeight: '600',
        marginBottom: 6,
        lineHeight: 18,
        includeFontPadding: false,
    },
    messageFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    message: {
        flex: 1,
        fontSize: 13,
        color: '#64748B',
        marginRight: 16,
        lineHeight: 21,
        includeFontPadding: false,
    },
    messageUnread: {
        color: '#1E293B',
        fontWeight: '600',
    },
    unreadBadge: {
        backgroundColor: '#EF4444',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 10,
        minWidth: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    unreadText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '800',
        lineHeight: 17,
        includeFontPadding: false,
    },
});

export default ChatScreen;
