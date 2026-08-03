import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    StatusBar,
    Dimensions,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { useAlert } from '../context/AlertContext';

type RootStackParamList = {
    TermsAndConditions: undefined;
    UserMainTabs: undefined;
    Login: undefined;
};

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'TermsAndConditions'>;
};

const { width, height } = Dimensions.get('window');

const TermsAndConditionsScreen = ({ navigation }: Props) => {
    const { t } = useTranslation();
    const { showAlert } = useAlert();

    const handleAccept = async () => {
        try {
            await AsyncStorage.setItem('termsAccepted', 'true');
            navigation.replace('UserMainTabs');
        } catch (error) {
            showAlert(t('auth_alerts.error'), t('auth_alerts.save_error'));
        }
    };

    const handleDecline = () => {
        showAlert(
            t('terms.declined_title'),
            t('terms.declined_msg'),
            [
                { text: t('terms.cancel'), style: "cancel" },
                { text: t('terms.logout'), onPress: () => navigation.replace('Login'), style: "destructive" }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            
            <View style={styles.header}>
                <Text style={styles.title}>{t('terms.title')}</Text>
                <Text style={styles.subtitle}>{t('terms.subtitle')}</Text>
            </View>

            <View style={styles.contentCard}>
                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={true}>
                    <Text style={styles.sectionTitle}>{t('terms.section1_title')}</Text>
                    <Text style={styles.text}>
                        {t('terms.section1_text')}
                    </Text>

                    <Text style={styles.sectionTitle}>{t('terms.section2_title')}</Text>
                    <Text style={styles.text}>
                        {t('terms.section2_text')}
                    </Text>

                    <Text style={styles.sectionTitle}>{t('terms.section3_title')}</Text>
                    <Text style={styles.text}>
                        {t('terms.section3_text')}
                    </Text>

                    <Text style={styles.sectionTitle}>{t('terms.section4_title')}</Text>
                    <Text style={styles.text}>
                        {t('terms.section4_text')}
                    </Text>

                    <Text style={styles.sectionTitle}>{t('terms.section5_title')}</Text>
                    <Text style={styles.text}>
                        {t('terms.section5_text')}
                    </Text>
                    
                    <View style={{ height: 20 }} />
                </ScrollView>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity 
                    style={styles.declineButton} 
                    onPress={handleDecline}
                >
                    <Text style={styles.declineButtonText}>{t('terms.decline')}</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.acceptButton} 
                    onPress={handleAccept}
                >
                    <Text style={styles.acceptButtonText}>{t('terms.accept')}</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    header: {
        paddingHorizontal: 24,
        paddingTop: 40,
        paddingBottom: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: '#0F172A',
        letterSpacing: -1,
    },
    subtitle: {
        fontSize: 16,
        color: '#64748B',
        marginTop: 4,
    },
    contentCard: {
        flex: 1,
        marginHorizontal: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    scrollView: {
        flex: 1,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1E293B',
        marginTop: 20,
        marginBottom: 8,
    },
    text: {
        fontSize: 15,
        color: '#475569',
        lineHeight: 24,
    },
    footer: {
        padding: 24,
        flexDirection: 'row',
        gap: 12,
    },
    declineButton: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    declineButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#64748B',
    },
    acceptButton: {
        flex: 2,
        paddingVertical: 16,
        borderRadius: 16,
        backgroundColor: '#3B82F6',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    acceptButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },
});

export default TermsAndConditionsScreen;
