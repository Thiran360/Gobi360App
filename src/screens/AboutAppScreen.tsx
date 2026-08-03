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
    AboutApp: undefined;
};

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'AboutApp'>;
};

const { width, height } = Dimensions.get('window');

const AboutAppScreen = ({ navigation }: Props) => {
    const { t } = useTranslation();

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
                <Text style={styles.title}>{t('about.title')}</Text>
            </View>

            <ScrollView 
                style={styles.scrollView} 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.logoCard}>
                    <View style={styles.logoCircle}>
                        <Icon name="shield-star" size={60} color="#FFFFFF" />
                    </View>
                    <Text style={styles.appName}>Gobi 360</Text>
                    <Text style={styles.version}>{t('about.version')}</Text>
                </View>

                <View style={styles.contentSection}>
                    <Text style={styles.description}>{t('about.description')}</Text>
                </View>

                <View style={styles.infoList}>
                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>{t('about.developer_title')}</Text>
                        <Text style={styles.infoValue}>{t('about.developer_name')}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>{t('about.website_label')}</Text>
                        <Text style={styles.infoValue}>{t('about.website')}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>{t('about.contact_label')}</Text>
                        <Text style={styles.infoValue}>{t('about.contact_email')}</Text>
                    </View>
                </View>

                <Text style={styles.copyright}>{t('about.copyright')}</Text>
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
        padding: 24,
        alignItems: 'center',
    },
    logoCard: {
        alignItems: 'center',
        marginBottom: 32,
    },
    logoCircle: {
        width: 120,
        height: 120,
        borderRadius: 40,
        backgroundColor: '#3B82F6',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 8,
        marginBottom: 20,
    },
    appName: {
        fontSize: 28,
        fontWeight: '900',
        color: '#0F172A',
        letterSpacing: -1,
    },
    version: {
        fontSize: 14,
        color: '#64748B',
        fontWeight: '600',
        marginTop: 4,
    },
    contentSection: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 24,
        marginBottom: 24,
        shadowColor: '#64748B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    description: {
        fontSize: 15,
        color: '#475569',
        lineHeight: 24,
        textAlign: 'center',
    },
    infoList: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 8,
        shadowColor: '#64748B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    infoItem: {
        padding: 16,
    },
    infoLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: '#94A3B8',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1E293B',
    },
    divider: {
        height: 1,
        backgroundColor: '#F1F5F9',
        marginHorizontal: 16,
    },
    copyright: {
        marginTop: 32,
        fontSize: 12,
        color: '#94A3B8',
        fontWeight: '500',
    },
});

export default AboutAppScreen;
