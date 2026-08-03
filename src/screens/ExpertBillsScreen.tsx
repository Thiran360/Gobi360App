import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, FlatList, ActivityIndicator, Alert, Modal, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ENDPOINTS } from '../utils/apiConfig';

const ExpertBillsScreen = ({ navigation }: any) => {
    const [recentBills, setRecentBills] = useState<any[]>([]);
    const [isFetchingBills, setIsFetchingBills] = useState(true);
    const [userId, setUserId] = useState<number | null>(null);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editingBill, setEditingBill] = useState<any>(null);
    const [editAmount, setEditAmount] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        const fetchUserDataAndBills = async () => {
            const sessionData = await AsyncStorage.getItem('userSession');
            if (sessionData) {
                const user = JSON.parse(sessionData);
                const uId = user.user?.id || user.id;
                if (uId) {
                    setUserId(uId);
                    fetchBills(uId);
                } else {
                    setIsFetchingBills(false);
                }
            } else {
                setIsFetchingBills(false);
            }
        };
        fetchUserDataAndBills();
    }, []);

    const fetchBills = async (id: number) => {
        try {
            const response = await fetch(ENDPOINTS.expertServiceRequest(id), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'User-Agent': 'CustomApp/1.0',
                    'ngrok-skip-browser-warning': 'true'
                }
            });
            const data = await response.json();
            if (response.ok && data.status && data.service_requests) {
                setRecentBills(data.service_requests);
            }
        } catch (error) {
            console.error("Fetch Bills Error:", error);
        } finally {
            setIsFetchingBills(false);
        }
    };

    const handleMarkAsPaid = async (bill: any) => {
        try {
            const payload = {
                user_id: userId || bill.customer?.id || 5,
                status: 'completed'
            };

            const response = await fetch(ENDPOINTS.expertServiceRequestUpdate(bill.id), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'User-Agent': 'CustomApp/1.0',
                    'ngrok-skip-browser-warning': 'true'
                },
                body: JSON.stringify(payload)
            });
            const data = await response.json();
            if (response.ok && data.status !== false) {
                setRecentBills(prev => prev.map(b => b.id === bill.id ? { ...b, status: 'completed', payment_status: 'paid' } : b));
                Alert.alert("Success", "Bill marked as paid successfully.");
            } else {
                Alert.alert("Error", data.message || "Failed to mark as paid.");
            }
        } catch (error) {
            console.error("Mark as Paid Error:", error);
            Alert.alert("Error", "Could not connect to the server.");
        }
    };

    const openEditModal = (bill: any) => {
        setEditingBill(bill);
        setEditAmount(bill.final_amount?.toString() || bill.quotation_amount?.toString() || '');
        setEditDescription(bill.service?.short_description || bill.quotation_description || '');
        setEditModalVisible(true);
    };

    const handleUpdateBill = async () => {
        if (!editingBill || !userId) return;
        setIsUpdating(true);
        try {
            const payload = {
                user_id: userId || editingBill.customer?.id || 5,
                service_id: editingBill.service?.id || 0,
                quotation_amount: parseFloat(editAmount || '0'),
                quotation_description: editDescription || 'Service Bill',
                status: editingBill.status || 'pending',
                payment_status: editingBill.payment_status || 'pending',
                use_points: false,
                redeem_points: 0,
                redeem_discount: 0
            };

            const response = await fetch(ENDPOINTS.expertServiceRequestUpdate(editingBill.id), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'User-Agent': 'CustomApp/1.0',
                    'ngrok-skip-browser-warning': 'true'
                },
                body: JSON.stringify(payload)
            });
            const data = await response.json();
            if (response.ok && data.status !== false) {
                setRecentBills(prev => prev.map(b => b.id === editingBill.id ? { ...b, final_amount: editAmount, quotation_description: editDescription, service: { ...b.service, short_description: editDescription } } : b));
                setEditModalVisible(false);
                Alert.alert("Success", "Bill updated successfully.");
            } else {
                Alert.alert("Error", data.message || "Failed to update bill.");
            }
        } catch (error) {
            console.error("Update Bill Error:", error);
            Alert.alert("Error", "Could not connect to the server.");
        } finally {
            setIsUpdating(false);
        }
    };

    const renderBill = ({ item }: { item: any }) => {
        const isCompleted = item.status === 'completed' || item.payment_status === 'paid';
        return (
            <View style={styles.billCard}>
                <View style={styles.billHeader}>
                    <Text style={styles.billCustomer}>{item.customer?.full_name || 'Customer'}</Text>
                    <Text style={[styles.billStatus, { color: isCompleted ? '#10B981' : '#F59E0B' }]}>
                        {isCompleted ? 'Paid and Completed' : (item.status || 'Pending')}
                    </Text>
                </View>
                <Text style={styles.billService}>{item.service?.service_name || 'Service'}</Text>
                <View style={styles.billFooter}>
                    <Text style={styles.billDate}>
                        {item.created_at ? new Date(item.created_at).toLocaleDateString() : ''}
                    </Text>
                    <Text style={styles.billAmount}>₹{item.final_amount || '0.00'}</Text>
                </View>
                <View style={styles.actionButtonsContainer}>
                    {!isCompleted && (
                        <>
                            <TouchableOpacity 
                                style={[styles.actionBtn, styles.editBtn]} 
                                onPress={() => openEditModal(item)}
                            >
                                <Icon name="pencil" size={16} color="#FFFFFF" style={{ marginRight: 4 }} />
                                <Text style={styles.actionBtnText}>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.actionBtn, styles.paidBtn]} 
                                onPress={() => handleMarkAsPaid(item)}
                            >
                                <Icon name="check-circle" size={16} color="#FFFFFF" style={{ marginRight: 4 }} />
                                <Text style={styles.actionBtnText}>Paid</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#F4F5F7" />
            
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Icon name="arrow-left" size={24} color="#0F172A" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Posted Bills</Text>
                <View style={{ width: 24 }} />
            </View>

            {isFetchingBills ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#3B82F6" />
                </View>
            ) : recentBills.length === 0 ? (
                <View style={styles.centerContainer}>
                    <Icon name="receipt" size={64} color="#CBD5E1" />
                    <Text style={styles.noBillsText}>No bills posted yet.</Text>
                </View>
            ) : (
                <FlatList
                    data={recentBills}
                    keyExtractor={(item, index) => item.id?.toString() || index.toString()}
                    renderItem={renderBill}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                />
            )}

            {/* Edit Modal */}
            <Modal visible={editModalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Update Bill</Text>
                            <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                                <Icon name="close" size={24} color="#64748B" />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.label}>Bill Amount (₹)</Text>
                        <TextInput
                            style={styles.input}
                            value={editAmount}
                            onChangeText={setEditAmount}
                            keyboardType="numeric"
                            placeholder="Enter amount"
                        />

                        <Text style={styles.label}>Description</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={editDescription}
                            onChangeText={setEditDescription}
                            multiline
                            numberOfLines={3}
                            placeholder="Enter description"
                        />

                        <TouchableOpacity 
                            style={styles.saveBtn} 
                            onPress={handleUpdateBill}
                            disabled={isUpdating}
                        >
                            {isUpdating ? <ActivityIndicator color="#FFF" /> : <Text style={styles.saveBtnText}>Update Bill</Text>}
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F4F5F7' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
        elevation: 2,
    },
    backBtn: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0F172A',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    listContainer: {
        padding: 16,
    },
    noBillsText: {
        fontSize: 16,
        color: '#94A3B8',
        marginTop: 16,
    },
    billCard: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        elevation: 1,
    },
    billHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    billCustomer: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0F172A',
    },
    billStatus: {
        fontSize: 14,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    billService: {
        fontSize: 14,
        color: '#64748B',
        marginBottom: 12,
    },
    billFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
        paddingTop: 12,
    },
    billDate: {
        fontSize: 13,
        color: '#94A3B8',
    },
    billAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0F172A',
    },
    actionButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
        gap: 8,
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
    },
    paidBtn: {
        backgroundColor: '#10B981',
    },
    editBtn: {
        backgroundColor: '#3B82F6',
    },
    actionBtnText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingBottom: 40,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0F172A',
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#475569',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: '#0F172A',
        marginBottom: 16,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    saveBtn: {
        backgroundColor: '#2563EB',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginTop: 8,
    },
    saveBtnText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ExpertBillsScreen;
