import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  Platform,
  Modal
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/contexts/ThemeContext';
import GlassCard from '@/components/ui/GlassCard';
import PrimaryButton from '@/components/ui/PrimaryButton';

interface ParsedMedication {
  name: string;
  dose: string;
  frequency: string;
  duration: string;
}

export default function CameraScannerScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [isScanning, setIsScanning] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [parsedMeds, setParsedMeds] = useState<ParsedMedication[]>([]);
  const cameraRef = useRef<CameraView>(null);

  const mockParsedResults: ParsedMedication[] = [
    {
      name: 'Amoxicillin',
      dose: '500mg',
      frequency: '3 times daily',
      duration: '7 days'
    },
    {
      name: 'Ibuprofen',
      dose: '200mg',
      frequency: 'As needed',
      duration: 'Up to 10 days'
    }
  ];

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.bg }]}>
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.back();
            }}
          >
            <MaterialCommunityIcons 
              name="arrow-left" 
              size={24} 
              color={theme.colors.textPrimary} 
            />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>
            Scan Prescription
          </Text>
        </View>

        <View style={styles.permissionContainer}>
          <GlassCard style={styles.permissionCard}>
            <MaterialCommunityIcons 
              name="camera-outline" 
              size={64} 
              color={theme.colors.primary} 
            />
            <Text style={[styles.permissionTitle, { color: theme.colors.textPrimary }]}>
              Camera Access Required
            </Text>
            <Text style={[styles.permissionMessage, { color: theme.colors.textSecondary }]}>
              We need camera access to scan your prescription and extract medication information.
            </Text>
            <PrimaryButton
              title="Grant Camera Access"
              onPress={requestPermission}
              style={styles.permissionButton}
            />
            <TouchableOpacity 
              style={styles.galleryFallback}
              onPress={handleGalleryPick}
            >
              <Text style={[styles.galleryText, { color: theme.colors.textSecondary }]}>
                Or choose from gallery
              </Text>
            </TouchableOpacity>
          </GlassCard>
        </View>
      </View>
    );
  }

  const handleTakePicture = async () => {
    if (!cameraRef.current) return;
    
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setIsScanning(true);
      
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
      });
      
      // Simulate OCR processing
      setTimeout(() => {
        setParsedMeds(mockParsedResults);
        setShowResults(true);
        setIsScanning(false);
      }, 2000);
      
    } catch (error) {
      console.error('Error taking picture:', error);
      setIsScanning(false);
      Alert.alert('Error', 'Failed to take picture. Please try again.');
    }
  };

  const handleGalleryPick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setIsScanning(true);
        
        // Simulate OCR processing
        setTimeout(() => {
          setParsedMeds(mockParsedResults);
          setShowResults(true);
          setIsScanning(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  const handleCreateReminders = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert(
      'Reminders Created!',
      `Created medication reminders for ${parsedMeds.length} medications.`,
      [
        {
          text: 'View Medications',
          onPress: () => {
            router.replace('/(tabs)/meds');
          }
        }
      ]
    );
  };

  const handleEditMedication = (index: number, field: keyof ParsedMedication, value: string) => {
    setParsedMeds(prev => prev.map((med, i) => 
      i === index ? { ...med, [field]: value } : med
    ));
  };

  if (showResults) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.bg }]}>
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setShowResults(false);
              setParsedMeds([]);
            }}
          >
            <MaterialCommunityIcons 
              name="arrow-left" 
              size={24} 
              color={theme.colors.textPrimary} 
            />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>
            Confirm Medications
          </Text>
        </View>

        <View style={[styles.content, { paddingBottom: insets.bottom + 100 }]}>
          <GlassCard style={styles.instructionCard}>
            <MaterialCommunityIcons 
              name="check-circle-outline" 
              size={24} 
              color={theme.colors.success} 
            />
            <Text style={[styles.instructionText, { color: theme.colors.textSecondary }]}>
              We found {parsedMeds.length} medications. Review and edit if needed.
            </Text>
          </GlassCard>

          {parsedMeds.map((med, index) => (
            <GlassCard key={index} style={styles.medCard}>
              <View style={styles.medHeader}>
                <MaterialCommunityIcons 
                  name="pill" 
                  size={24} 
                  color={theme.colors.primary} 
                />
                <Text style={[styles.medIndex, { color: theme.colors.textSecondary }]}>
                  Medication {index + 1}
                </Text>
              </View>
              
              <View style={styles.medFields}>
                <View style={styles.fieldRow}>
                  <Text style={[styles.fieldLabel, { color: theme.colors.textSecondary }]}>
                    Name
                  </Text>
                  <Text style={[styles.fieldValue, { color: theme.colors.textPrimary }]}>
                    {med.name}
                  </Text>
                </View>
                
                <View style={styles.fieldRow}>
                  <Text style={[styles.fieldLabel, { color: theme.colors.textSecondary }]}>
                    Dose
                  </Text>
                  <Text style={[styles.fieldValue, { color: theme.colors.textPrimary }]}>
                    {med.dose}
                  </Text>
                </View>
                
                <View style={styles.fieldRow}>
                  <Text style={[styles.fieldLabel, { color: theme.colors.textSecondary }]}>
                    Frequency
                  </Text>
                  <Text style={[styles.fieldValue, { color: theme.colors.textPrimary }]}>
                    {med.frequency}
                  </Text>
                </View>
                
                <View style={styles.fieldRow}>
                  <Text style={[styles.fieldLabel, { color: theme.colors.textSecondary }]}>
                    Duration
                  </Text>
                  <Text style={[styles.fieldValue, { color: theme.colors.textPrimary }]}>
                    {med.duration}
                  </Text>
                </View>
              </View>
            </GlassCard>
          ))}

          <PrimaryButton
            title="Create Medication Reminders"
            onPress={handleCreateReminders}
            style={styles.createButton}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.bg }]}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }}
        >
          <MaterialCommunityIcons 
            name="arrow-left" 
            size={24} 
            color={theme.colors.textPrimary} 
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>
          Scan Prescription
        </Text>
      </View>
      
      <View style={styles.cameraContainer}>
        <CameraView 
          ref={cameraRef}
          style={styles.camera} 
          facing={facing}
        >
          {/* Camera Overlay */}
          <View style={styles.overlay}>
            <View style={styles.frameContainer}>
              <View style={[styles.frame, { borderColor: theme.colors.primary }]}>
                <View style={[styles.corner, styles.topLeft, { borderColor: theme.colors.primary }]} />
                <View style={[styles.corner, styles.topRight, { borderColor: theme.colors.primary }]} />
                <View style={[styles.corner, styles.bottomLeft, { borderColor: theme.colors.primary }]} />
                <View style={[styles.corner, styles.bottomRight, { borderColor: theme.colors.primary }]} />
              </View>
              <Text style={[styles.frameHint, { color: theme.colors.textPrimary }]}>
                Align prescription inside the frame
              </Text>
            </View>
          </View>
        </CameraView>
      </View>

      {/* Controls */}
      <View style={[styles.controls, { paddingBottom: insets.bottom + 20 }]}>
        <TouchableOpacity
          style={[styles.controlButton, { backgroundColor: theme.colors.surface }]}
          onPress={handleGalleryPick}
        >
          <MaterialCommunityIcons 
            name="image-outline" 
            size={24} 
            color={theme.colors.textPrimary} 
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.captureButton,
            { 
              backgroundColor: theme.colors.primary,
              opacity: isScanning ? 0.6 : 1 
            }
          ]}
          onPress={handleTakePicture}
          disabled={isScanning}
        >
          {isScanning ? (
            <MaterialCommunityIcons 
              name="loading" 
              size={32} 
              color={theme.colors.bg} 
            />
          ) : (
            <MaterialCommunityIcons 
              name="camera" 
              size={32} 
              color={theme.colors.bg} 
            />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, { backgroundColor: theme.colors.surface }]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setFacing(current => (current === 'back' ? 'front' : 'back'));
          }}
        >
          <MaterialCommunityIcons 
            name="camera-flip-outline" 
            size={24} 
            color={theme.colors.textPrimary} 
          />
        </TouchableOpacity>
      </View>

      {/* Scanning Modal */}
      <Modal visible={isScanning} transparent animationType="fade">
        <View style={styles.scanningOverlay}>
          <GlassCard style={styles.scanningCard}>
            <MaterialCommunityIcons 
              name="loading" 
              size={48} 
              color={theme.colors.primary} 
            />
            <Text style={[styles.scanningTitle, { color: theme.colors.textPrimary }]}>
              Scanning Prescription
            </Text>
            <Text style={[styles.scanningText, { color: theme.colors.textSecondary }]}>
              Extracting medication information...
            </Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  permissionCard: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 12,
  },
  permissionMessage: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  permissionButton: {
    width: '100%',
    marginBottom: 16,
  },
  galleryFallback: {
    paddingVertical: 12,
  },
  galleryText: {
    fontSize: 14,
    textAlign: 'center',
  },
  cameraContainer: {
    flex: 1,
    margin: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  frameContainer: {
    alignItems: 'center',
  },
  frame: {
    width: 280,
    height: 200,
    borderWidth: 2,
    borderRadius: 12,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderWidth: 3,
  },
  topLeft: {
    top: -2,
    left: -2,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 12,
  },
  topRight: {
    top: -2,
    right: -2,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 12,
  },
  bottomLeft: {
    bottom: -2,
    left: -2,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 12,
  },
  bottomRight: {
    bottom: -2,
    right: -2,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 12,
  },
  frameHint: {
    fontSize: 14,
    marginTop: 20,
    textAlign: 'center',
    fontWeight: '500',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#60A5FA',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  instructionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 16,
  },
  instructionText: {
    fontSize: 14,
    marginLeft: 12,
    flex: 1,
  },
  medCard: {
    marginBottom: 16,
  },
  medHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  medIndex: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 12,
  },
  medFields: {
    gap: 12,
  },
  fieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  fieldValue: {
    fontSize: 14,
    fontWeight: '600',
    flex: 2,
    textAlign: 'right',
  },
  createButton: {
    marginTop: 20,
  },
  scanningOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  scanningCard: {
    alignItems: 'center',
    paddingVertical: 40,
    width: '100%',
    maxWidth: 300,
  },
  scanningTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 8,
  },
  scanningText: {
    fontSize: 14,
    textAlign: 'center',
  },
});