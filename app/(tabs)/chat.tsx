import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import GlassCard from '@/components/ui/GlassCard';
import PrimaryButton from '@/components/ui/PrimaryButton';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

interface SymptomResult {
  disclaimer: string;
  urgency: 'low' | 'medium' | 'high';
  possibleCauses: string[];
  selfCareSteps: string[];
  whenToSeekHelp: string[];
}

export default function ChatScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your AI health buddy. I can help you understand your symptoms and provide guidance. What's been bothering you lately?",
      sender: 'assistant',
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<SymptomResult | null>(null);

  const suggestedChips = ['Headache', 'Stomach pain', 'Fever', 'Fatigue'];

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsAnalyzing(true);

    // Simulate AI analysis with realistic results
    setTimeout(() => {
      const mockResult: SymptomResult = {
        disclaimer: "This is not a medical diagnosis. Consult a healthcare professional for proper evaluation.",
        urgency: text.toLowerCase().includes('severe') ? 'high' : 
                text.toLowerCase().includes('pain') ? 'medium' : 'low',
        possibleCauses: [
          'Tension headache from stress or poor posture',
          'Dehydration or lack of sleep',
          'Eye strain from screen time'
        ],
        selfCareSteps: [
          'Rest in a quiet, dark room',
          'Apply a cold or warm compress',
          'Stay hydrated with water',
          'Take a break from screens'
        ],
        whenToSeekHelp: [
          'Severe or sudden onset headache',
          'Headache with fever or neck stiffness',
          'Changes in vision or speech',
          'Headache after head injury'
        ]
      };

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I've analyzed your symptoms. Here's what I found:",
        sender: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setResult(mockResult);
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleChipPress = (chip: string) => {
    handleSendMessage(chip);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'low': return theme.colors.success;
      case 'medium': return theme.colors.warning;
      case 'high': return theme.colors.danger;
      default: return theme.colors.muted;
    }
  };

  const getUrgencyLabel = (urgency: string) => {
    switch (urgency) {
      case 'low': return 'Low urgency';
      case 'medium': return 'Monitor closely';
      case 'high': return 'Seek care soon';
      default: return 'Assessment';
    }
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.colors.bg }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>
          AI Symptom Checker
        </Text>
        <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
          Get personalized health guidance
        </Text>
      </View>

      {/* Messages */}
      <ScrollView 
        style={styles.messagesContainer}
        contentContainerStyle={[
          styles.messagesContent,
          { paddingBottom: insets.bottom + 120 }
        ]}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        removeClippedSubviews={true}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageContainer,
              message.sender === 'user' ? styles.userMessage : styles.assistantMessage
            ]}
          >
            <View
              style={[
                styles.messageBubble,
                {
                  backgroundColor: message.sender === 'user' 
                    ? theme.colors.surfaceAlt 
                    : theme.colors.surface,
                  borderColor: message.sender === 'assistant' 
                    ? theme.colors.outline 
                    : 'transparent',
                },
                message.sender === 'assistant' && { borderWidth: 1 }
              ]}
            >
              <Text style={[styles.messageText, { color: theme.colors.textPrimary }]}>
                {message.text}
              </Text>
            </View>
          </View>
        ))}

        {/* Analysis Result */}
        {result && (
          <View style={styles.resultContainer}>
            <GlassCard glow variant={result.urgency === 'high' ? 'danger' : 'primary'}>
              {/* Urgency Banner */}
              <View style={[
                styles.urgencyBanner,
                { backgroundColor: getUrgencyColor(result.urgency) + '20' }
              ]}>
                <MaterialCommunityIcons 
                  name="information-outline" 
                  size={20} 
                  color={getUrgencyColor(result.urgency)} 
                />
                <Text style={[
                  styles.urgencyText,
                  { color: getUrgencyColor(result.urgency) }
                ]}>
                  {getUrgencyLabel(result.urgency)}
                </Text>
              </View>

              {/* Possible Causes */}
              <View style={styles.resultSection}>
                <Text style={[styles.resultTitle, { color: theme.colors.textPrimary }]}>
                  Possible Causes
                </Text>
                {result.possibleCauses.map((cause, index) => (
                  <Text key={index} style={[styles.resultItem, { color: theme.colors.textSecondary }]}>
                    • {cause}
                  </Text>
                ))}
              </View>

              {/* Self-Care Steps */}
              <View style={styles.resultSection}>
                <Text style={[styles.resultTitle, { color: theme.colors.textPrimary }]}>
                  Self-Care Now
                </Text>
                {result.selfCareSteps.map((step, index) => (
                  <Text key={index} style={[styles.resultItem, { color: theme.colors.textSecondary }]}>
                    ✓ {step}
                  </Text>
                ))}
              </View>

              {/* When to Seek Help */}
              <View style={styles.resultSection}>
                <Text style={[styles.resultTitle, { color: theme.colors.textPrimary }]}>
                  When to Seek Help
                </Text>
                {result.whenToSeekHelp.map((item, index) => (
                  <Text key={index} style={[styles.resultItem, { color: theme.colors.textSecondary }]}>
                    ⚠️ {item}
                  </Text>
                ))}
              </View>

              {/* Disclaimer */}
              <View style={[styles.disclaimer, { backgroundColor: theme.colors.outline + '40' }]}>
                <Text style={[styles.disclaimerText, { color: theme.colors.muted }]}>
                  {result.disclaimer}
                </Text>
              </View>
            </GlassCard>
          </View>
        )}

        {/* Loading */}
        {isAnalyzing && (
          <View style={styles.loadingContainer}>
            <View style={[styles.loadingBubble, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
                AI is analyzing your symptoms...
              </Text>
              <View style={styles.typingIndicator}>
                <View style={[styles.dot, { backgroundColor: theme.colors.primary }]} />
                <View style={[styles.dot, { backgroundColor: theme.colors.primary }]} />
                <View style={[styles.dot, { backgroundColor: theme.colors.primary }]} />
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Input Area */}
      <View style={[styles.inputContainer, { paddingBottom: insets.bottom + 16 }]}>
        {/* Suggested Chips */}
        {messages.length === 1 && (
          <ScrollView 
            horizontal 
            style={styles.chipsContainer}
            showsHorizontalScrollIndicator={false}
          >
            {suggestedChips.map((chip, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.chip, { backgroundColor: theme.colors.surfaceAlt }]}
                onPress={() => handleChipPress(chip)}
              >
                <Text style={[styles.chipText, { color: theme.colors.textSecondary }]}>
                  {chip}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Input Row */}
        <View style={styles.inputRow}>
          <View style={[
            styles.inputWrapper,
            { 
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.outline 
            }
          ]}>
            <TextInput
              style={[styles.textInput, { color: theme.colors.textPrimary }]}
              placeholder="Describe what you're feeling..."
              placeholderTextColor={theme.colors.muted}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[styles.sendButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => handleSendMessage(inputText)}
              disabled={!inputText.trim() || isAnalyzing}
            >
              <MaterialCommunityIcons 
                name="send" 
                size={20} 
                color={theme.colors.bg} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
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
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  messageContainer: {
    marginBottom: 16,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  assistantMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  resultContainer: {
    marginTop: 20,
  },
  urgencyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  urgencyText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  resultSection: {
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  resultItem: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  disclaimer: {
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  disclaimerText: {
    fontSize: 12,
    lineHeight: 16,
    fontStyle: 'italic',
  },
  loadingContainer: {
    alignItems: 'flex-start',
    marginTop: 16,
  },
  loadingBubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    maxWidth: '80%',
  },
  loadingText: {
    fontSize: 14,
    marginBottom: 8,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  chipsContainer: {
    marginBottom: 12,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 48,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    maxHeight: 100,
    marginRight: 8,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});