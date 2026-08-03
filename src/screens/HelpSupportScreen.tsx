import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    StatusBar,
    Dimensions,
    ScrollView,
    Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { triggerCall } from '../utils/callTracker';

type RootStackParamList = {
    HelpSupport: undefined;
};

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'HelpSupport'>;
};

const HelpSupportScreen = ({ navigation }: Props) => {
    const { t } = useTranslation();

    const faqs = [
        { q: t('help.q1'), a: t('help.a1') },
        { q: t('help.q2'), a: t('help.a2') },
        { q: t('help.q3'), a: t('help.a3') },
    ];

    const contactMethods = [
        {
            title: t('help.call'),
            icon: 'phone-outline',
            color: '#3B82F6',
            action: () => triggerCall('+919876543210', 'App Support')
        },
        {
            title: t('help.email'),
            icon: 'email-outline',
            color: '#F43F5E',
            action: () => Linking.openURL('mailto:support@serviceapp.com')
        },
        {
            title: t('help.whatsapp'),
            icon: 'whatsapp',
            color: '#22C55E',
            action: () => Linking.openURL('whatsapp://send?phone=+919876543210')
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
                <Text style={styles.title}>{t('help.title')}</Text>
            </View>

            <ScrollView 
                style={styles.scrollView} 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <Text style={styles.sectionTitle}>{t('help.faq_title')}</Text>
                
                {faqs.map((faq, index) => (
                    <View key={index} style={styles.faqCard}>
                        <Text style={styles.question}>{faq.q}</Text>
                        <Text style={styles.answer}>{faq.a}</Text>
                    </View>
                ))}

                <Text style={[styles.sectionTitle, { marginTop: 24 }]}>{t('help.contact_title')}</Text>
                
                <View style={styles.contactContainer}>
                    {contactMethods.map((method, index) => (
                        <TouchableOpacity 
                            key={index} 
                            style={styles.contactItem}
                            onPress={method.action}
                        >
                            <View style={[styles.iconCircle, { backgroundColor: method.color + '10' }]}>
                                <Icon name={method.icon} size={24} color={method.color} />
                            </View>
                            <Text style={styles.contactLabel}>{method.title}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.footerInfo}>
                    <Icon name="clock-outline" size={16} color="#94A3B8" />
                    <Text style={styles.footerText}>{t('help.support_24_7')}</Text>
                </View>
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
        paddingBottom: 40,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1E293B',
        marginBottom: 16,
        marginLeft: 4,
    },
    faqCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        marginBottom: 12,
        shadowColor: '#64748B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    question: {
        fontSize: 16,
        fontWeight: '700',
        color: '#334155',
        marginBottom: 8,
    },
    answer: {
        fontSize: 14,
        color: '#64748B',
        lineHeight: 22,
    },
    contactContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    contactItem: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 16,
        alignItems: 'center',
        shadowColor: '#64748B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    contactLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: '#475569',
    },
    footerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 32,
        gap: 6,
    },
    footerText: {
        fontSize: 12,
        color: '#94A3B8',
        fontWeight: '600',
    },
});

export default HelpSupportScreen;
