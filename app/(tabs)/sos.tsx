import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Modal,
  Alert,
  Platform,
  Linking
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat,
  withTiming,
  useAnimatedGestureHandler,
  withSpring
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { useTheme } from '@/contexts/ThemeContext';
import GlassCard from '@/components/ui/GlassCard';
import PrimaryButton from '@/components/ui/PrimaryButton';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function SOSScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState<'ambulance' | 'hospital' | 'poison' | null>(null);

  // Optimized animation values for smoother performance
  const pulseScale = useSharedValue(1);
  const glowOpacity = useSharedValue(1);
  const sosButtonScale = useSharedValue(1);
  const buttonY = useSharedValue(0);

  React.useEffect(() => {
    // Smoother pulsing animation
    pulseScale.value = withRepeat(
      withTiming(1.03, { duration: 1500 }),
      -1,
      true
    );
    
    // Gentler glowing animation  
    glowOpacity.value = withRepeat(
      withTiming(0.7, { duration: 2000 }),
      -1,
      true
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    shadowOpacity: glowOpacity.value * 0.6,
  }));

  const sosButtonStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: sosButtonScale.value },
      { translateY: buttonY.value }
    ],
  }));

  // Optimized gesture handler with reduced sensitivity
  const gestureHandler = useAnimatedGestureHandler({
    onStart: () => {
      sosButtonScale.value = withSpring(0.97, { 
        damping: 15,
        stiffness: 150
      });
    },
    onActive: (event) => {
      buttonY.value = event.translationY * 0.05; // Reduced sensitivity
    },
    onEnd: () => {
      sosButtonScale.value = withSpring(1, {
        damping: 15,
        stiffness: 150
      });
      buttonY.value = withSpring(0, {
        damping: 15,
        stiffness: 150
      });
    },
  });

  const handleSOSPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setSelectedAction('ambulance');
    setShowConfirmModal(true);
  };

  const handleEmergencyAction = (action: 'ambulance' | 'hospital' | 'poison') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedAction(action);
    setShowConfirmModal(true);
  };

  const confirmEmergencyCall = async () => {
    setShowConfirmModal(false);
    
    try {
      let phoneNumber = '';
      let actionName = '';
      
      switch (selectedAction) {
        case 'ambulance':
          phoneNumber = '911';
          actionName = 'Emergency Services';
          break;
        case 'poison':
          phoneNumber = '18002221222';
          actionName = 'Poison Control';
          break;
        case 'hospital':
          actionName = 'Hospital Finder';
          break;
      }

      if (Platform.OS === 'web') {
        Alert.alert(
          'Emergency Action',
          selectedAction === 'hospital'
            ? 'This would show nearby hospitals and contact options on a real device.'
            : `This would call ${actionName} (${phoneNumber}) on a real device.`,
          [{ text: 'OK' }]
        );
      } else {
        if (selectedAction === 'hospital') {
          // In a real app, this would integrate with maps to show hospitals
          Alert.alert('Hospital Finder', 'Finding nearest hospitals...', [{ text: 'OK' }]);
        } else {
          const url = `tel:${phoneNumber}`;
          const canOpen = await Linking.canOpenURL(url);
          if (canOpen) {
            await Linking.openURL(url);
          } else {
            Alert.alert('Error', 'Unable to make phone call on this device.', [{ text: 'OK' }]);
          }
        }
      }
    } catch (error) {
      console.error('Error making emergency call:', error);
      Alert.alert('Error', 'Failed to initiate emergency action. Please try again.', [{ text: 'OK' }]);
    }
    
    setTimeout(() => {
      setSelectedAction(null);
    }, 500);
  };

  const emergencyContacts = [
    {
      id: 'ambulance',
      title: 'Emergency Services',
      subtitle: 'Call 911 immediately',
      icon: 'ambulance',
      color: theme.colors.danger,
      action: () => handleEmergencyAction('ambulance')
    },
    {
      id: 'hospital',
      title: 'Nearest Hospital',
      subtitle: 'Find closest emergency room',
      icon: 'hospital-box-outline',
      color: theme.colors.primary,
      action: () => handleEmergencyAction('hospital')
    },
    {
      id: 'poison',
      title: 'Poison Control',
      subtitle: '1-800-222-1222',
      icon: 'bottle-tonic-outline',
      color: theme.colors.warning,
      action: () => handleEmergencyAction('poison')
    }
  ];

  const getActionTitle = () => {
    switch (selectedAction) {
      case 'ambulance': return 'Call 911';
      case 'hospital': return 'Find Hospital';
      case 'poison': return 'Call Poison Control';
      default: return 'Confirm';
    }
  };

  const getConfirmMessage = () => {
    switch (selectedAction) {
      case 'ambulance': return 'This will call emergency services (911). Only use for real emergencies.';
      case 'hospital': return 'This will help you find the nearest hospital and emergency contacts.';
      case 'poison': return 'This will call Poison Control hotline for immediate assistance.';
      default: return 'Are you sure you want to proceed?';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.bg }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>
          Emergency SOS
        </Text>
        <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
          Get help when you need it most
        </Text>
      </View>

      <View style={[styles.content, { paddingBottom: insets.bottom + 120 }]}>
        {/* Main SOS Button */}
        <View style={styles.sosSection}>
          <PanGestureHandler onGestureEvent={gestureHandler}>
            <AnimatedTouchableOpacity
              style={[
                styles.sosButtonContainer,
                pulseStyle,
                glowStyle,
                sosButtonStyle,
                {
                  shadowColor: theme.colors.danger,
                }
              ]}
              onPress={handleSOSPress}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={[theme.colors.danger, '#DC2626']}
                style={styles.sosButton}
              >
                <MaterialCommunityIcons 
                  name="alarm-light" 
                  size={48} 
                  color="white" 
                />
                <Text style={styles.sosButtonText}>SOS</Text>
              </LinearGradient>
            </AnimatedTouchableOpacity>
          </PanGestureHandler>
          
          <Text style={[styles.sosInstructions, { color: theme.colors.textSecondary }]}>
            Tap for immediate emergency assistance
          </Text>
        </View>

        {/* Emergency Contacts */}
        <View style={styles.contactsSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Emergency Contacts
          </Text>
          
          <View style={styles.contactsList}>
            {emergencyContacts.map((contact) => (
              <GlassCard key={contact.id} style={styles.contactCard}>
                <TouchableOpacity
                  style={styles.contactButton}
                  onPress={contact.action}
                  activeOpacity={0.8}
                >
                  <View style={[styles.contactIcon, { backgroundColor: contact.color + '20' }]}>
                    <MaterialCommunityIcons 
                      name={contact.icon as any} 
                      size={24} 
                      color={contact.color} 
                    />
                  </View>
                  
                  <View style={styles.contactInfo}>
                    <Text style={[styles.contactTitle, { color: theme.colors.textPrimary }]}>
                      {contact.title}
                    </Text>
                    <Text style={[styles.contactSubtitle, { color: theme.colors.textSecondary }]}>
                      {contact.subtitle}
                    </Text>
                  </View>
                  
                  <MaterialCommunityIcons 
                    name="chevron-right" 
                    size={20} 
                    color={theme.colors.muted} 
                  />
                </TouchableOpacity>
              </GlassCard>
            ))}
          </View>
        </View>

        {/* Safety Tips */}
        <GlassCard style={styles.tipsCard}>
          <View style={styles.tipsHeader}>
            <MaterialCommunityIcons 
              name="shield-check-outline" 
              size={24} 
              color={theme.colors.secondary} 
            />
            <Text style={[styles.tipsTitle, { color: theme.colors.textPrimary }]}>
              Safety Tips
            </Text>
          </View>
          
          <View style={styles.tipsList}>
            <Text style={[styles.tipItem, { color: theme.colors.textSecondary }]}>
              • Stay calm and speak clearly when calling for help
            </Text>
            <Text style={[styles.tipItem, { color: theme.colors.textSecondary }]}>
              • Provide your exact location if possible
            </Text>
            <Text style={[styles.tipItem, { color: theme.colors.textSecondary }]}>
              • Don't hang up until instructed by the operator
            </Text>
            <Text style={[styles.tipItem, { color: theme.colors.textSecondary }]}>
              • Keep your phone charged and accessible
            </Text>
          </View>
        </GlassCard>
      </View>

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View style={styles.modalOverlay}>
          <GlassCard style={styles.modalContent} glow variant="danger">
            <MaterialCommunityIcons 
              name="alert-circle-outline" 
              size={48} 
              color={theme.colors.danger} 
            />
            
            <Text style={[styles.modalTitle, { color: theme.colors.textPrimary }]}>
              Confirm Emergency Call
            </Text>
            
            <Text style={[styles.modalMessage, { color: theme.colors.textSecondary }]}>
              {getConfirmMessage()}
            </Text>
            
            <View style={styles.modalActions}>
              <PrimaryButton
                title={getActionTitle()}
                onPress={confirmEmergencyCall}
                variant="danger"
                style={styles.confirmButton}
              />
              
              <TouchableOpacity 
                style={[styles.cancelButton, { borderColor: theme.colors.outline }]}
                onPress={() => {
                  setShowConfirmModal(false);
                  setSelectedAction(null);
                }}
                activeOpacity={0.8}
              >
                <Text style={[styles.cancelButtonText, { color: theme.colors.textPrimary }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </GlassCard>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 15,
    fontWeight: '400',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sosSection: {
    alignItems: 'center',
    marginVertical: 40,
  },
  sosButtonContainer: {
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
    elevation: 12,
  },
  sosButton: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sosButtonText: {
    fontSize: 24,
    fontWeight: '900',
    color: 'white',
    marginTop: 8,
    letterSpacing: 2,
  },
  sosInstructions: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
    fontWeight: '500',
  },
  contactsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  contactsList: {
    gap: 16,
  },
  contactCard: {
    padding: 0,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  contactSubtitle: {
    fontSize: 14,
  },
  tipsCard: {
    marginBottom: 20,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  tipsList: {
    gap: 8,
  },
  tipItem: {
    fontSize: 14,
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  modalActions: {
    width: '100%',
    gap: 16,
  },
  confirmButton: {
    width: '100%',
  },
  cancelButton: {
    borderWidth: 1,
    borderRadius: 26,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});