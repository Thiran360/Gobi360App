import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { BASE_URL } from '../utils/apiConfig';
import { useLocationFetcher } from '../hooks/useLocationFetcher';

interface AddressModalProps {
    visible: boolean;
    onClose: () => void;
    onSuccess: () => void;
    userId: number | null;
    initialData?: any;
}

const AddressModal: React.FC<AddressModalProps> = ({ visible, onClose, onSuccess, userId, initialData }) => {
    const { fetchExactLocation, isFetchingLocation } = useLocationFetcher();
    
    const [addressType, setAddressType] = useState('home');
    const [fullName, setFullName] = useState('');
    const [mobile, setMobile] = useState('');
    const [addressLine, setAddressLine] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('Tamil Nadu');
    const [pincode, setPincode] = useState('');
    const [landmark, setLandmark] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    React.useEffect(() => {
        if (visible && initialData) {
            setAddressType(initialData.address_type || 'home');
            setFullName(initialData.full_name || '');
            setMobile(initialData.mobile || '');
            setAddressLine(initialData.address_line || '');
            setCity(initialData.city || '');
            setState(initialData.state || 'Tamil Nadu');
            setPincode(initialData.pincode || '');
            setLandmark(initialData.landmark || '');
        } else if (visible) {
            setAddressType('home');
            setFullName('');
            setMobile('');
            setAddressLine('');
            setCity('');
            setState('Tamil Nadu');
            setPincode('');
            setLandmark('');
        }
    }, [visible, initialData]);

    const handleSave = async () => {
        if (!fullName || !mobile || !addressLine || !city || !pincode) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }
        if (!userId) {
            Alert.alert('Error', 'You must be logged in to save an address. Please log in and try again.');
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                user: userId,
                address_type: addressType,
                full_name: fullName,
                mobile,
                address_line: addressLine,
                city,
                state,
                pincode,
                landmark,
                is_default: true
            };

            const isEdit = !!(initialData?.address_id || initialData?.id);
            const actualId = initialData?.address_id || initialData?.id;
            const url = isEdit ? `${BASE_URL}/gobi360/address/${actualId}/` : `${BASE_URL}/gobi360/address/`;
            const response = await fetch(url, {
                method: isEdit ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                onSuccess();
                onClose();
            } else {
                const errText = await response.text();
                console.error(`Address POST Error: ${response.status}`, errText);
                
                try {
                    const errJson = JSON.parse(errText);
                    if (errJson?.errors?.user?.[0]?.includes('Invalid pk')) {
                        Alert.alert(
                            'Session Expired', 
                            'Your user session is no longer valid (user not found). Please log out and log in again.'
                        );
                        setIsSubmitting(false);
                        return;
                    }
                } catch (e) {
                    // ignore json parse errors
                }

                Alert.alert('Error', `Failed to save address: ${errText}`);
            }
        } catch (error) {
            console.error('Save address error:', error);
            Alert.alert('Error', 'Something went wrong');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.overlay}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.sheet}>
                    <View style={styles.header}>
                        <Text style={styles.title}>{initialData ? 'Edit Address' : 'Add Delivery Address'}</Text>
                        <TouchableOpacity onPress={onClose}><Icon name="close" size={24} color="#0F172A" /></TouchableOpacity>
                    </View>
                    
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.typeRow}>
                            <TouchableOpacity style={[styles.typeBtn, addressType === 'home' && styles.typeActive]} onPress={() => setAddressType('home')}>
                                <Icon name="home" size={20} color={addressType === 'home' ? '#FFF' : '#64748B'} />
                                <Text style={[styles.typeText, addressType === 'home' && { color: '#FFF' }]}>Home</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.typeBtn, addressType === 'work' && styles.typeActive]} onPress={() => setAddressType('work')}>
                                <Icon name="briefcase" size={20} color={addressType === 'work' ? '#FFF' : '#64748B'} />
                                <Text style={[styles.typeText, addressType === 'work' && { color: '#FFF' }]}>Work</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.label}>Full Name *</Text>
                        <TextInput style={styles.input} value={fullName} onChangeText={setFullName} placeholder="e.g. John Doe" />

                        <Text style={styles.label}>Mobile Number *</Text>
                        <TextInput style={styles.input} value={mobile} onChangeText={setMobile} keyboardType="phone-pad" maxLength={10} placeholder="10-digit number" />

                        <View style={styles.row}>
                            <Text style={styles.label}>Address Line *</Text>
                            <TouchableOpacity onPress={async () => {
                                const loc = await fetchExactLocation(true);
                                if (loc && loc !== 'GPS signal lost') setAddressLine(loc);
                            }}>
                                <Text style={{ color: '#3B82F6', fontSize: 12, fontWeight: 'bold' }}>{isFetchingLocation ? 'Locating...' : 'Locate Me'}</Text>
                            </TouchableOpacity>
                        </View>
                        <TextInput style={styles.input} value={addressLine} onChangeText={setAddressLine} placeholder="House No, Building, Street" />

                        <View style={{ flexDirection: 'row', gap: 12 }}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.label}>City *</Text>
                                <TextInput style={styles.input} value={city} onChangeText={setCity} placeholder="e.g. Chennai" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.label}>Pincode *</Text>
                                <TextInput style={styles.input} value={pincode} onChangeText={setPincode} keyboardType="numeric" maxLength={6} placeholder="600001" />
                            </View>
                        </View>

                        <Text style={styles.label}>Landmark (Optional)</Text>
                        <TextInput style={styles.input} value={landmark} onChangeText={setLandmark} placeholder="Near hospital, park, etc." />

                        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={isSubmitting}>
                            {isSubmitting ? <ActivityIndicator color="#FFF" /> : <Text style={styles.saveBtnTxt}>Save Address</Text>}
                        </TouchableOpacity>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    sheet: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '90%' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    title: { fontSize: 18, fontWeight: 'bold', color: '#0F172A' },
    typeRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
    typeBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', gap: 8 },
    typeActive: { backgroundColor: '#3B82F6', borderColor: '#3B82F6' },
    typeText: { fontSize: 15, fontWeight: 'bold', color: '#64748B' },
    label: { fontSize: 13, fontWeight: 'bold', color: '#475569', marginBottom: 6, marginTop: 12 },
    input: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, padding: 12, fontSize: 15, color: '#0F172A' },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
    saveBtn: { backgroundColor: '#3B82F6', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 32, marginBottom: 20 },
    saveBtnTxt: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});

export default AddressModal;
