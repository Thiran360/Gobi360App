import React from 'react';
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
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type RootStackParamList = {
    PrivacySecurity: undefined;
};

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'PrivacySecurity'>;
};

const { width } = Dimensions.get('window');

const PrivacySecurityScreen = ({ navigation }: Props) => {
    const { t } = useTranslation();

    const sections = [
        {
            title: "1. Introduction",
            text: "Welcome to our application. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our mobile application. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the application.",
            icon: 'text-box-outline'
        },
        {
            title: "2. Information Collection",
            text: "We may collect personal identification information from users in a variety of ways, including, but not limited to, when users visit our app, register on the app, fill out a form, and in connection with other activities, services, features or resources we make available. This includes your name, email address, phone number, and location data to provide relevant services.",
            icon: 'database-outline'
        },
        {
            title: "3. Use of Your Information",
            text: "Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the application to: \n• Create and manage your account.\n• Process your transactions and send related information.\n• Improve app performance and customer service.\n• Monitor and analyze usage and trends to improve your experience.",
            icon: 'chart-line'
        },
        {
            title: "4. Disclosure of Your Information",
            text: "We may share information we have collected about you in certain situations. Your information may be disclosed to third-party service providers that perform services for us or on our behalf, such as payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance. We do not sell your personal data to third parties.",
            icon: 'share-variant-outline'
        },
        {
            title: "5. Data Security",
            text: "We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.",
            icon: 'shield-check-outline'
        },
        {
            title: "6. Data Retention & Deletion",
            text: "We will only retain your personal information for as long as necessary for the purposes set out in this Privacy Policy. You have the right to request the deletion of your personal data at any time by contacting our support team or using the account deletion feature within the app settings.",
            icon: 'delete-outline'
        },
        {
            title: "7. Changes to This Policy",
            text: "We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.",
            icon: 'update'
        }
    ];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton} 
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="arrow-left" size={24} color="#0F172A" />
                </TouchableOpacity>
                <Text style={styles.title}>{t('privacy.title', 'Privacy Policy')}</Text>
            </View>

            <ScrollView 
                style={styles.scrollView} 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.policyHeader}>
                    <Icon name="shield-lock-outline" size={48} color="#3B82F6" />
                    <Text style={styles.policyTitle}>Privacy Policy</Text>
                    <Text style={styles.policyDate}>Last Updated: {new Date().toLocaleDateString()}</Text>
                </View>

                {sections.map((section, index) => (
                    <View key={index} style={styles.sectionCard}>
                        <View style={styles.sectionHeader}>
                            <View style={styles.iconContainer}>
                                <Icon name={section.icon} size={24} color="#3B82F6" />
                            </View>
                            <Text style={styles.sectionTitle}>{section.title}</Text>
                        </View>
                        <Text style={styles.sectionText}>{section.text}</Text>
                    </View>
                ))}
                
                <View style={styles.infoBox}>
                    <Icon name="information-outline" size={20} color="#64748B" />
                    <Text style={styles.infoBoxText}>
                        If you have any questions about this Privacy Policy, please contact us at support@serviceapp.com
                    </Text>
                </View>
                
                <View style={styles.footerSpace} />
            </ScrollView>
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
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 20,
        gap: 12,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    title: {
        fontSize: 24,
        fontWeight: '900',
        color: '#0F172A',
        letterSpacing: -0.5,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        gap: 16,
    },
    policyHeader: {
        alignItems: 'center',
        paddingVertical: 20,
        gap: 8,
    },
    policyTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#1E293B',
    },
    policyDate: {
        fontSize: 14,
        color: '#64748B',
        fontWeight: '500',
    },
    sectionCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#64748B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 12,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1E293B',
        flex: 1,
    },
    sectionText: {
        fontSize: 15,
        color: '#475569',
        lineHeight: 24,
    },
    infoBox: {
        flexDirection: 'row',
        backgroundColor: '#F1F5F9',
        borderRadius: 16,
        padding: 16,
        alignItems: 'flex-start',
        gap: 12,
        marginTop: 8,
    },
    infoBoxText: {
        flex: 1,
        fontSize: 14,
        color: '#475569',
        lineHeight: 22,
        fontWeight: '500',
    },
    footerSpace: {
        height: 40,
    }
});

export default PrivacySecurityScreen;
