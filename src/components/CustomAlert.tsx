import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Animated, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAlert } from '../context/AlertContext';

const { width } = Dimensions.get('window');

const CustomAlert = () => {
  const { alertState, hideAlert } = useAlert();
  const { visible, title, message, buttons } = alertState;

  const [fadeAnim] = React.useState(new Animated.Value(0));
  const [scaleAnim] = React.useState(new Animated.Value(0.95));
  const [translateYAnim] = React.useState(new Animated.Value(15));

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 65,
          useNativeDriver: true,
        }),
        Animated.spring(translateYAnim, {
          toValue: 0,
          friction: 8,
          tension: 65,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 15,
          duration: 200,
          useNativeDriver: true,
        })
      ]).start();
    }
  }, [visible]);

  if (!visible && fadeAnim.interpolate({inputRange: [0, 1], outputRange: [0, 1]}) as any === 0) return null;

  const handleButtonPress = (onPress?: () => void) => {
    hideAlert();
    if (onPress) {
      setTimeout(() => {
        onPress();
      }, 250);
    }
  };

  const getIcon = () => {
    const t = title.toLowerCase();
    if (t.includes('success')) return (
      <View style={[styles.iconBg, { backgroundColor: '#D1FAE5' }]}>
        <Icon name="check-circle" size={44} color="#10B981" />
      </View>
    );
    if (t.includes('error') || t.includes('fail') || t.includes('invalid') || t.includes('mismatch')) return (
      <View style={[styles.iconBg, { backgroundColor: '#FEE2E2' }]}>
        <Icon name="alert-circle" size={44} color="#EF4444" />
      </View>
    );
    if (t.includes('confirm') || t.includes('clear')) return (
      <View style={[styles.iconBg, { backgroundColor: '#DBEAFE' }]}>
        <Icon name="help-circle" size={44} color="#3B82F6" />
      </View>
    );
    return (
      <View style={[styles.iconBg, { backgroundColor: '#E0E7FF' }]}>
        <Icon name="information-variant" size={44} color="#6366F1" />
      </View>
    );
  };

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={hideAlert}>
      <View style={styles.overlay}>
        <Animated.View style={[
            styles.alertContainer, 
            { 
              opacity: fadeAnim, 
              transform: [{ scale: scaleAnim }, { translateY: translateYAnim }] 
            }
          ]}
        >
          <View style={styles.iconContainer}>
            {getIcon()}
          </View>
          
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          
          <View style={styles.buttonContainer}>
            {buttons && buttons.length > 0 ? (
              buttons.map((btn, index) => {
                const isDestructive = btn.style === 'destructive';
                const isCancel = btn.style === 'cancel';
                
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.button,
                      isDestructive ? styles.buttonDestructive : (isCancel ? styles.buttonCancel : styles.buttonDefault),
                      { flex: 1, marginLeft: index > 0 ? 12 : 0 }
                    ]}
                    activeOpacity={0.8}
                    onPress={() => handleButtonPress(btn.onPress)}
                  >
                    <Text style={[
                      styles.buttonText,
                      isDestructive ? styles.buttonTextDestructive : (isCancel ? styles.buttonTextCancel : styles.buttonTextDefault)
                    ]}>
                      {btn.text}
                    </Text>
                  </TouchableOpacity>
                );
              })
            ) : (
              <TouchableOpacity
                style={[styles.button, styles.buttonDefault, { flex: 1 }]}
                activeOpacity={0.8}
                onPress={() => handleButtonPress()}
              >
                <Text style={[styles.buttonText, styles.buttonTextDefault]}>Continue</Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  alertContainer: {
    width: width * 0.88,
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: 28,
    paddingTop: 36,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.2,
    shadowRadius: 36,
    elevation: 24,
  },
  iconContainer: {
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  message: {
    fontSize: 15,
    fontWeight: '500',
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
    paddingHorizontal: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDefault: {
    backgroundColor: '#0F172A',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonCancel: {
    backgroundColor: '#F1F5F9',
  },
  buttonDestructive: {
    backgroundColor: '#EF4444',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  buttonTextDefault: {
    color: '#FFFFFF',
  },
  buttonTextCancel: {
    color: '#475569',
  },
  buttonTextDestructive: {
    color: '#FFFFFF',
  },
});

export default CustomAlert;
