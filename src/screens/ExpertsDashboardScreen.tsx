import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, Alert, TextInput, ScrollView, ActivityIndicator, Modal, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ENDPOINTS } from '../utils/apiConfig';

const ExpertsDashboardScreen = ({ navigation }: any) => {
    const [expertName, setExpertName] = useState('Expert');
    const [expertId, setExpertId] = useState<number | null>(null);

    // Form State
    const [customerName, setCustomerName] = useState('');
    const [userMobile, setUserMobile] = useState('');
    const [billAmount, setBillAmount] = useState('');
    const [description, setDescription] = useState('');
    const [services, setServices] = useState<any[]>([]);
    const [selectedService, setSelectedService] = useState<any>(null);
    const [showServiceModal, setShowServiceModal] = useState(false);
    const [successData, setSuccessData] = useState<any>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [userId, setUserId] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFetchingName, setIsFetchingName] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            const sessionData = await AsyncStorage.getItem('userSession');
            if (sessionData) {
                const user = JSON.parse(sessionData);
                if (user.first_name || user.name) {
                    setExpertName(user.first_name || user.name);
                }
                if (user.user?.id || user.id) {
                    const uId = user.user?.id || user.id;
                    setUserId(uId);
                }
                const eId = user.user?.expert_id || user.expert_id || user.user?.id || user.id;
                setExpertId(eId);
                fetchServices(eId);
            }
        };
        fetchUserData();
    }, []);

    // Auto-fetch customer name when mobile reaches 10 digits
    useEffect(() => {
        if (userMobile.length === 10) {
            fetchCustomerName(userMobile);
        }
    }, [userMobile]);

    const fetchCustomerName = async (mobile: string) => {
        setIsFetchingName(true);
        try {
            // Try fetching from userDetails endpoint with GET
            const response = await fetch(`${ENDPOINTS.userDetails}?mobile=${mobile.trim()}`, {
                method: 'GET',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Accept': 'application/json',
                    'User-Agent': 'CustomApp/1.0',
                    'ngrok-skip-browser-warning': 'true' 
                }
            });
            const data = await response.json();
            
            let fetchedName = data.user?.first_name || data.user?.name || data.name || data.first_name || data.customer_name;
            
            if (fetchedName) {
                setCustomerName(fetchedName);
            } else {
                // If GET didn't work or didn't return a name, try POST
                const postResponse = await fetch(ENDPOINTS.userDetails, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json', 
                        'Accept': 'application/json',
                        'User-Agent': 'CustomApp/1.0',
                        'ngrok-skip-browser-warning': 'true' 
                    },
                    body: JSON.stringify({ mobile: mobile.trim() })
                });
                const postData = await postResponse.json();
                fetchedName = postData.user?.first_name || postData.user?.name || postData.name || postData.first_name || postData.customer_name;
                if (fetchedName) setCustomerName(fetchedName);
            }
        } catch (error) {
            console.log("Auto-fetch customer name failed:", error);
        } finally {
            setIsFetchingName(false);
        }
    };

    const fetchServices = async (id: number) => {
        try {
            const response = await fetch(ENDPOINTS.expertServices(id), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'User-Agent': 'CustomApp/1.0',
                    'ngrok-skip-browser-warning': 'true'
                }
            });
            const responseText = await response.text();
            
            let data;
            try {
                data = JSON.parse(responseText);
            } catch (e) {
                console.error("fetchServices received non-JSON (HTML):", responseText.substring(0, 100));
                return;
            }

            if (response.ok && data.status !== false) {
                // Determine array path based on backend response shape
                const servicesArray = Array.isArray(data) ? data : (data.value || data.data || data.services || data.results || []);
                setServices(servicesArray);
            }
        } catch (error) {
            console.error("Fetch Services Error:", error);
        }
    };

    const handleLogout = () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Logout", 
                    style: "destructive",
                    onPress: async () => {
                        await AsyncStorage.removeItem('userSession');
                        navigation.replace('Login');
                    }
                }
            ]
        );
    };

    const handlePostBill = async () => {
        if (!customerName.trim() || !userMobile.trim() || !billAmount.trim() || !selectedService) {
            Alert.alert("Missing Fields", "Please select a service and enter the customer's name, mobile, and bill amount.");
            return;
        }

        setIsSubmitting(true);
        try {
            // Exact payload structure required by backend
            const payload = {
                customer_mobile: userMobile.trim(),
                service_id: selectedService.id || selectedService.service_id,
                quotation_amount: parseFloat(billAmount),
                quotation_description: description.trim(),
            };

            const url = ENDPOINTS.expertServiceRequest(userId as number);
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'User-Agent': 'CustomApp/1.0',
                    'ngrok-skip-browser-warning': 'true',
                },
                body: JSON.stringify(payload),
            });

            const responseText = await response.text();
            let data;
            try {
                data = JSON.parse(responseText);
            } catch (e) {
                // If it's HTML (like a 404 page), JSON.parse will fail
                Alert.alert("Server Error", `URL: ${url}\nStatus: ${response.status}\nResponse was not JSON. Is the URL exactly correct?`);
                setIsSubmitting(false);
                return;
            }

            if (response.ok && data.status) {
                setSuccessData(data.service_request || data);
                setShowSuccessModal(true);
                // Clear form
                setCustomerName('');
                setUserMobile('');
                setBillAmount('');
                setDescription('');
                setSelectedService(null);
            } else {
                Alert.alert("Error", data.message || data.error || "Failed to post service bill.");
            }
        } catch (error) {
            console.error("Post Bill Error:", error);
            Alert.alert("Network Error", "Could not connect to the server.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#F4F5F7" />
            <View style={styles.header}>
                <View style={styles.headerTitleWrap}>
                    <Icon name="briefcase-check" size={28} color="#3B82F6" />
                    <Text style={styles.headerTitle}>Experts Console</Text>
                </View>
                <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
                    <Icon name="logout" size={20} color="#EF4444" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
                <View style={styles.welcomeCard}>
                    <Text style={styles.welcomeTitle}>Welcome back, {expertName}!</Text>
                    <Text style={styles.welcomeDesc}>Use this dashboard to post service bills and award reward points to your customers.</Text>
                </View>

                <Text style={styles.sectionTitle}>Post New Service Bill</Text>
                
                <View style={styles.formCard}>
                    <Text style={styles.inputLabel}>Customer Mobile Number <Text style={styles.required}>*</Text></Text>
                    <View style={styles.inputContainer}>
                        <Icon name="phone" size={20} color="#64748B" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. 9876543210"
                            placeholderTextColor="#94A3B8"
                            keyboardType="phone-pad"
                            maxLength={10}
                            value={userMobile}
                            onChangeText={setUserMobile}
                        />
                    </View>

                    <Text style={styles.inputLabel}>Customer Name <Text style={styles.required}>*</Text></Text>
                    <View style={styles.inputContainer}>
                        <Icon name="account-outline" size={20} color="#64748B" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. John Doe"
                            placeholderTextColor="#94A3B8"
                            value={customerName}
                            onChangeText={setCustomerName}
                        />
                        {isFetchingName && <ActivityIndicator size="small" color="#3B82F6" />}
                    </View>

                    <Text style={styles.inputLabel}>Bill Amount (₹) <Text style={styles.required}>*</Text></Text>
                    <View style={styles.inputContainer}>
                        <Icon name="currency-inr" size={20} color="#64748B" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="0.00"
                            placeholderTextColor="#94A3B8"
                            keyboardType="decimal-pad"
                            value={billAmount}
                            onChangeText={setBillAmount}
                        />
                    </View>

                    <Text style={styles.inputLabel}>Service Type <Text style={styles.required}>*</Text></Text>
                    <TouchableOpacity 
                        style={styles.inputContainer} 
                        onPress={() => {
                            setShowServiceModal(true);
                        }}
                        activeOpacity={0.8}
                    >
                        <Icon name="tools" size={20} color="#64748B" style={styles.inputIcon} />
                        <Text style={[styles.input, { color: selectedService ? '#0F172A' : '#94A3B8' }]}>
                            {selectedService ? (selectedService.name || selectedService.service_name || 'Selected Service') : 'Select a Service'}
                        </Text>
                        <Icon name="chevron-down" size={20} color="#94A3B8" />
                    </TouchableOpacity>

                    <Text style={styles.inputLabel}>Service Notes (Optional)</Text>
                    <View style={styles.inputContainer}>
                        <Icon name="card-text-outline" size={20} color="#64748B" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. Additional details"
                            placeholderTextColor="#94A3B8"
                            value={description}
                            onChangeText={setDescription}
                        />
                    </View>

                    <TouchableOpacity 
                        style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
                        onPress={handlePostBill}
                        disabled={isSubmitting}
                        activeOpacity={0.8}
                    >
                        {isSubmitting ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <>
                                <Icon name="file-document-edit" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                                <Text style={styles.submitBtnText}>Post Service Bill</Text>
                            </>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.viewBillsBtn}
                        onPress={() => navigation.navigate('ExpertBills')}
                        activeOpacity={0.8}
                    >
                        <Icon name="receipt" size={20} color="#1E293B" style={{ marginRight: 8 }} />
                        <Text style={styles.viewBillsBtnText}>View My Posted Bills</Text>
                    </TouchableOpacity>
                </View>
                
                <View style={{ height: 40 }} />
            </ScrollView>

            {/* Service Selection Modal */}
            <Modal visible={showServiceModal} animationType="slide" transparent={true} onRequestClose={() => setShowServiceModal(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Service</Text>
                            <TouchableOpacity onPress={() => setShowServiceModal(false)}>
                                <Icon name="close" size={24} color="#64748B" />
                            </TouchableOpacity>
                        </View>
                        {services.length === 0 ? (
                            <Text style={styles.noServicesText}>No services found for this expert.</Text>
                        ) : (
                            <FlatList 
                                data={services}
                                keyExtractor={(item, index) => item.id?.toString() || index.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity 
                                        style={styles.serviceItem}
                                        onPress={() => {
                                            setSelectedService(item);
                                            setShowServiceModal(false);
                                        }}
                                    >
                                        <Text style={styles.serviceItemText}>{item.name || item.service_name || 'Service'}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                        )}
                    </View>
                </View>
                </Modal>

                {/* Beautiful Success Modal */}
                <Modal visible={showSuccessModal} animationType="fade" transparent={true} onRequestClose={() => setShowSuccessModal(false)}>
                    <View style={styles.modalOverlay}>
                        <View style={[styles.modalContent, styles.successModalContent]}>
                            <View style={styles.successIconContainer}>
                                <Icon name="check-circle" size={60} color="#10B981" />
                            </View>
                            <Text style={styles.successTitle}>Bill Posted Successfully!</Text>
                            
                            {successData && (
                                <View style={styles.successDetailsContainer}>
                                    <View style={styles.successDetailRow}>
                                        <Text style={styles.successDetailLabel}>Customer:</Text>
                                        <Text style={styles.successDetailValue}>{successData.customer?.full_name || 'N/A'}</Text>
                                    </View>
                                    <View style={styles.successDetailRow}>
                                        <Text style={styles.successDetailLabel}>Service:</Text>
                                        <Text style={styles.successDetailValue}>{successData.service?.service_name || 'N/A'}</Text>
                                    </View>
                                    <View style={styles.successDetailRow}>
                                        <Text style={styles.successDetailLabel}>Final Amount:</Text>
                                        <Text style={styles.successDetailValue}>₹{successData.final_amount || '0.00'}</Text>
                                    </View>
                                    <View style={styles.successDetailRow}>
                                        <Text style={styles.successDetailLabel}>Earned Points:</Text>
                                        <Text style={[styles.successDetailValue, {color: '#10B981', fontWeight: 'bold'}]}>+{successData.earned_points || 0}</Text>
                                    </View>
                                    <View style={styles.successDetailRow}>
                                        <Text style={styles.successDetailLabel}>Status:</Text>
                                        <Text style={[styles.successDetailValue, {textTransform: 'capitalize', color: '#F59E0B'}]}>{successData.status || 'Pending'}</Text>
                                    </View>
                                </View>
                            )}

                            <TouchableOpacity 
                                style={styles.successDoneButton}
                                onPress={() => setShowSuccessModal(false)}
                            >
                                <Text style={styles.successDoneButtonText}>Done</Text>
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    headerTitleWrap: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#0F172A',
        marginLeft: 10,
    },
    logoutBtn: {
        padding: 8,
        backgroundColor: '#FEE2E2',
        borderRadius: 12,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    welcomeCard: {
        backgroundColor: '#EFF6FF',
        padding: 20,
        borderRadius: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#DBEAFE',
    },
    welcomeTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#1E3A8A',
        marginBottom: 6,
    },
    welcomeDesc: {
        fontSize: 14,
        color: '#3B82F6',
        lineHeight: 20,
        fontWeight: '600',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#0F172A',
        marginBottom: 12,
        marginLeft: 4,
    },
    formCard: {
        backgroundColor: '#FFFFFF',
        padding: 24,
        borderRadius: 20,
        shadowColor: '#1E293B',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.04,
        shadowRadius: 16,
        elevation: 3,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: '#475569',
        marginBottom: 8,
    },
    required: {
        color: '#EF4444',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        marginBottom: 20,
        paddingHorizontal: 16,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        paddingVertical: 14,
        fontSize: 15,
        color: '#0F172A',
        fontWeight: '600',
    },
    submitBtn: {
        backgroundColor: '#3B82F6',
        borderRadius: 14,
        paddingVertical: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
    },
    submitBtnDisabled: {
        backgroundColor: '#94A3B8',
        shadowOpacity: 0,
        elevation: 0,
    },
    submitBtnText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '900',
    },
    viewBillsBtn: {
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        paddingVertical: 16,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
    },
    viewBillsBtnText: {
        color: '#1E293B',
        fontSize: 16,
        fontWeight: '600',
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
        maxHeight: '70%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#0F172A',
    },
    serviceItem: {
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    serviceItemText: {
        fontSize: 16,
        color: '#334155',
        fontWeight: '600',
    },
    noServicesText: {
        textAlign: 'center',
        color: '#94A3B8',
        paddingVertical: 32,
    },
    successModalContent: {
        alignItems: 'center',
        paddingTop: 30,
        paddingBottom: 30,
    },
    successIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#D1FAE5',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    successTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#0F172A',
        marginBottom: 20,
    },
    successDetailsContainer: {
        width: '100%',
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
    },
    successDetailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    successDetailLabel: {
        fontSize: 15,
        color: '#64748B',
        flex: 1,
    },
    successDetailValue: {
        fontSize: 15,
        fontWeight: '600',
        color: '#0F172A',
        flex: 1,
        textAlign: 'right',
    },
    successDoneButton: {
        backgroundColor: '#1E293B',
        width: '100%',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    successDoneButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ExpertsDashboardScreen;
