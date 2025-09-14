import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Modal
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/contexts/ThemeContext';
import GlassCard from '@/components/ui/GlassCard';
import PrimaryButton from '@/components/ui/PrimaryButton';

interface Medication {
  id: string;
  name: string;
  dose: string;
  time: string;
  taken: boolean;
  frequency: string;
}

export default function MedsScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [showAddModal, setShowAddModal] = useState(false);
  
  const [medications, setMedications] = useState<Medication[]>([
    {
      id: '1',
      name: 'Vitamin D3',
      dose: '1000 IU',
      time: '8:00 AM',
      taken: true,
      frequency: 'Daily'
    },
    {
      id: '2',
      name: 'Omega-3',
      dose: '1 capsule',
      time: '12:00 PM',
      taken: false,
      frequency: 'Daily'
    },
    {
      id: '3',
      name: 'Magnesium',
      dose: '200mg',
      time: '9:00 PM',
      taken: false,
      frequency: 'Daily'
    }
  ]);

  const handleToggleTaken = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setMedications(prev => 
      prev.map(med => 
        med.id === id ? { ...med, taken: !med.taken } : med
      )
    );
  };

  const handleSnooze = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    console.log(`Snoozing medication ${id} for 10 minutes`);
  };

  const handleScanPrescription = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowAddModal(false);
    router.push('/camera-scanner');
  };

  const handleManualEntry = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowAddModal(false);
    
    const newMed: Medication = {
      id: Date.now().toString(),
      name: 'Ibuprofen',
      dose: '200mg',
      time: '2:00 PM',
      taken: false,
      frequency: 'As needed'
    };
    setMedications(prev => [...prev, newMed]);
  };

  const adherencePercentage = Math.round(
    (medications.filter(med => med.taken).length / medications.length) * 100
  );

  const todaySchedule = medications.sort((a, b) => {
    const timeA = new Date(`2024-01-01 ${a.time}`).getTime();
    const timeB = new Date(`2024-01-01 ${b.time}`).getTime();
    return timeA - timeB;
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.bg }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>
          My Medications
        </Text>
        <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
          Stay on track with your health routine
        </Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 120 }
        ]}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        removeClippedSubviews={true}
      >
        {/* Adherence Card */}
        <GlassCard style={styles.adherenceCard} glow variant="primary">
          <View style={styles.adherenceHeader}>
            <MaterialCommunityIcons 
              name="chart-donut" 
              size={24} 
              color={theme.colors.primary} 
            />
            <Text style={[styles.adherenceTitle, { color: theme.colors.textPrimary }]}>
              Today's Adherence
            </Text>
          </View>
          <View style={styles.adherenceContent}>
            <Text style={[styles.adherencePercentage, { color: theme.colors.primary }]}>
              {adherencePercentage}%
            </Text>
            <Text style={[styles.adherenceSubtext, { color: theme.colors.textSecondary }]}>
              {medications.filter(med => med.taken).length} of {medications.length} medications taken
            </Text>
          </View>
        </GlassCard>

        {/* Today's Timeline */}
        <GlassCard style={styles.timelineCard}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Today's Schedule
          </Text>
          
          <View style={styles.timeline}>
            {todaySchedule.map((med, index) => (
              <View key={med.id} style={styles.timelineItem}>
                {/* Time Badge */}
                <View style={[
                  styles.timeBadge,
                  { 
                    backgroundColor: med.taken 
                      ? theme.colors.success + '20' 
                      : theme.colors.outline + '40' 
                  }
                ]}>
                  <Text style={[
                    styles.timeText,
                    { 
                      color: med.taken 
                        ? theme.colors.success 
                        : theme.colors.textSecondary 
                    }
                  ]}>
                    {med.time}
                  </Text>
                </View>

                {/* Timeline Line */}
                {index < todaySchedule.length - 1 && (
                  <View style={[
                    styles.timelineLine,
                    { backgroundColor: theme.colors.outline }
                  ]} />
                )}

                {/* Medication Info */}
                <View style={styles.medInfo}>
                  <View style={styles.medHeader}>
                    <View style={styles.medDetails}>
                      <Text style={[styles.medName, { color: theme.colors.textPrimary }]}>
                        {med.name}
                      </Text>
                      <Text style={[styles.medDose, { color: theme.colors.textSecondary }]}>
                        {med.dose} • {med.frequency}
                      </Text>
                    </View>
                    
                    <View style={styles.medActions}>
                      <TouchableOpacity
                        style={[
                          styles.takenButton,
                          { 
                            backgroundColor: med.taken 
                              ? theme.colors.success 
                              : theme.colors.outline + '40' 
                          }
                        ]}
                        onPress={() => handleToggleTaken(med.id)}
                        activeOpacity={0.8}
                      >
                        <MaterialCommunityIcons 
                          name={med.taken ? "check" : "plus"} 
                          size={16} 
                          color={med.taken ? theme.colors.bg : theme.colors.textSecondary} 
                        />
                      </TouchableOpacity>
                      
                      {!med.taken && (
                        <TouchableOpacity 
                          style={[styles.snoozeButton, { backgroundColor: theme.colors.warning + '20' }]}
                          onPress={() => handleSnooze(med.id)}
                          activeOpacity={0.8}
                        >
                          <MaterialCommunityIcons 
                            name="clock-outline" 
                            size={16} 
                            color={theme.colors.warning} 
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </GlassCard>

        {/* Quick Actions */}
        <GlassCard style={styles.actionsCard}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Quick Actions
          </Text>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: theme.colors.surfaceAlt }]}
              onPress={handleScanPrescription}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons 
                name="camera-outline" 
                size={24} 
                color={theme.colors.primary} 
              />
              <Text style={[styles.actionButtonText, { color: theme.colors.textPrimary }]}>
                Scan Prescription
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: theme.colors.surfaceAlt }]}
              onPress={() => setShowAddModal(true)}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons 
                name="plus" 
                size={24} 
                color={theme.colors.secondary} 
              />
              <Text style={[styles.actionButtonText, { color: theme.colors.textPrimary }]}>
                Add Manually
              </Text>
            </TouchableOpacity>
          </View>
        </GlassCard>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={[
          styles.fab,
          { 
            backgroundColor: theme.colors.primary,
            bottom: insets.bottom + 100,
            shadowColor: theme.colors.primary,
          }
        ]}
        onPress={() => setShowAddModal(true)}
        activeOpacity={0.9}
      >
        <MaterialCommunityIcons name="plus" size={24} color={theme.colors.bg} />
      </TouchableOpacity>

      {/* Add Medication Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <GlassCard style={styles.modalContent}>
            <Text style={[styles.modalTitle, { color: theme.colors.textPrimary }]}>
              Add New Medication
            </Text>
            <Text style={[styles.modalSubtitle, { color: theme.colors.textSecondary }]}>
              Choose how you'd like to add your medication
            </Text>
            
            <View style={styles.modalActions}>
              <PrimaryButton
                title="Scan Prescription"
                onPress={handleScanPrescription}
                style={styles.modalButton}
              />
              
              <TouchableOpacity 
                style={[styles.secondaryButton, { borderColor: theme.colors.outline }]}
                onPress={handleManualEntry}
                activeOpacity={0.8}
              >
                <Text style={[styles.secondaryButtonText, { color: theme.colors.textPrimary }]}>
                  Enter Manually
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowAddModal(false)}
                activeOpacity={0.8}
              >
                <Text style={[styles.cancelButtonText, { color: theme.colors.muted }]}>
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
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
  },
  adherenceCard: {
    marginBottom: 20,
  },
  adherenceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  adherenceTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  adherenceContent: {
    alignItems: 'center',
  },
  adherencePercentage: {
    fontSize: 36,
    fontWeight: '700',
    marginBottom: 4,
  },
  adherenceSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  timelineCard: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  timeline: {
    position: 'relative',
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 20,
    position: 'relative',
  },
  timeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 16,
    minWidth: 80,
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  timelineLine: {
    position: 'absolute',
    left: 40,
    top: 32,
    width: 2,
    height: 36,
  },
  medInfo: {
    flex: 1,
  },
  medHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  medDetails: {
    flex: 1,
  },
  medName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  medDose: {
    fontSize: 14,
  },
  medActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  takenButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  snoozeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionsCard: {
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderRadius: 16,
    minHeight: 100,
    justifyContent: 'center',
    gap: 12,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  fab: {
    position: 'absolute',
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 320,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  modalActions: {
    gap: 16,
  },
  modalButton: {
    marginBottom: 4,
  },
  secondaryButton: {
    borderWidth: 1,
    borderRadius: 26,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  cancelButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
});