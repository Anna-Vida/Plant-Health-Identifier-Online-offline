import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Screen } from '@/components/layout/Screen';
import { sendChatMessage, type ChatMessage } from '@/lib/chatbot';

type ChatItem = ChatMessage & { id: string; createdAt: number };

function formatTime(timestamp: number) {
  try {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return 'Now';
  }
}

function cleanAssistantText(text: string) {
  return text.replace(/\*/g, '');
}

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const [messages, setMessages] = useState<ChatItem[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: 'Hi! Ask me about crop health, pests, irrigation, or field routines.',
      createdAt: Date.now(),
    },
  ]);
  const [draft, setDraft] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSend(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isSending) {
      return;
    }

    setDraft('');
    setError(null);
    Keyboard.dismiss();

    const userMessage: ChatItem = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmed,
      createdAt: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsSending(true);

    try {
      const replyText = await sendChatMessage([
        ...messages.map(({ role, text: messageText }) => ({ role, text: messageText })),
        { role: 'user', text: trimmed },
      ]);

      const assistantMessage: ChatItem = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        text: replyText,
        createdAt: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to reach AgriChat right now.');
    } finally {
      setIsSending(false);
    }
  }

  return (
    <Screen contentStyle={styles.screenContent}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={headerHeight}
        style={styles.screenBody}>
        <View style={styles.threadWrap}>
          <ScrollView
            contentContainerStyle={styles.thread}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
            {messages.map((message) => {
              return (
                <View
                  key={message.id}
                  style={[
                    styles.messageRow,
                    message.role === 'user' ? styles.messageRowRight : styles.messageRowLeft,
                  ]}>
                  {message.role === 'assistant' ? (
                    <View style={styles.avatar}>
                      <Ionicons name="leaf" size={14} color="#214730" />
                    </View>
                  ) : null}
                  <View
                    style={[
                      styles.messageColumn,
                      message.role === 'user'
                        ? styles.messageColumnRight
                        : styles.messageColumnLeft,
                    ]}>
                    <View
                      style={[
                        styles.bubble,
                        message.role === 'user' ? styles.userBubble : styles.assistantBubble,
                      ]}>
                      <Text
                        style={[
                          styles.bubbleText,
                          message.role === 'user' ? styles.userText : styles.assistantText,
                        ]}>
                        {message.role === 'assistant' ? cleanAssistantText(message.text) : message.text}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.timeText,
                        message.role === 'user' ? styles.timeTextRight : styles.timeTextLeft,
                      ]}>
                      {formatTime(message.createdAt)}
                    </Text>
                  </View>
                  {message.role === 'user' ? (
                    <View style={styles.avatarUser}>
                      <Ionicons name="person" size={14} color="#FFFFFF" />
                    </View>
                  ) : null}
                </View>
              );
            })}
            {isSending ? (
              <View style={[styles.messageRow, styles.messageRowLeft]}>
                <View style={styles.avatar}>
                  <Ionicons name="leaf" size={14} color="#214730" />
                </View>
                <View style={[styles.messageColumn, styles.messageColumnLeft]}>
                  <View style={[styles.bubble, styles.assistantBubble, styles.loadingBubble]}>
                    <ActivityIndicator size="small" color="#2A4634" />
                    <Text style={[styles.bubbleText, styles.assistantText]}>Thinking...</Text>
                  </View>
                </View>
              </View>
            ) : null}
          </ScrollView>
        </View>

        {error ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorTitle}>Message failed</Text>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={[styles.inputBar, { paddingBottom: Math.max(insets.bottom, 10) }]}>
          <Pressable style={styles.inputIcon}>
            <Ionicons name="mic" size={16} color="#6C7A6F" />
          </Pressable>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Type to start chatting..."
            placeholderTextColor="#879384"
            style={styles.input}
          />
          <Pressable
            onPress={() => handleSend(draft)}
            disabled={!draft.trim() || isSending}
            style={({ pressed }) => [
              styles.sendButton,
              pressed && styles.sendPressed,
              (!draft.trim() || isSending) && styles.sendDisabled,
            ]}>
            <Ionicons name="paper-plane" size={16} color="#FFFFFF" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screenContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 14,
    gap: 12,
    flex: 1,
  },
  screenBody: {
    flex: 1,
  },
  threadWrap: {
    backgroundColor: 'transparent',
    paddingVertical: 6,
    flex: 1,
  },
  thread: {
    gap: 12,
    paddingBottom: 8,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  messageRowLeft: {
    justifyContent: 'flex-start',
  },
  messageRowRight: {
    justifyContent: 'flex-end',
  },
  avatar: {
    width: 26,
    height: 26,
    borderRadius: 9,
    backgroundColor: '#F7F0E0',
    borderWidth: 1,
    borderColor: '#E6DDCF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarUser: {
    width: 26,
    height: 26,
    borderRadius: 9,
    backgroundColor: '#4B6255',
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageColumn: {
    gap: 6,
    maxWidth: '78%',
  },
  messageColumnLeft: {
    alignItems: 'flex-start',
  },
  messageColumnRight: {
    alignItems: 'flex-end',
  },
  bubble: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  loadingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  assistantBubble: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E3DBC9',
    borderTopLeftRadius: 6,
  },
  userBubble: {
    backgroundColor: '#4B6255',
    borderWidth: 1,
    borderColor: '#4B6255',
    borderTopRightRadius: 6,
  },
  bubbleText: {
    fontSize: 13,
    lineHeight: 20,
  },
  assistantText: {
    color: '#2A4634',
  },
  userText: {
    color: '#F8F3E7',
  },
  timeText: {
    fontSize: 10,
    color: '#8B948B',
  },
  timeTextLeft: {
    alignSelf: 'flex-start',
    marginLeft: 2,
  },
  timeTextRight: {
    alignSelf: 'flex-end',
    marginRight: 2,
  },
  errorCard: {
    marginTop: 12,
    backgroundColor: '#F4D6CF',
    borderRadius: 14,
    padding: 12,
    gap: 4,
  },
  errorTitle: {
    color: '#7A2317',
    fontSize: 13,
    fontWeight: '800',
  },
  errorText: {
    color: '#7A2317',
    fontSize: 12,
    lineHeight: 18,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: 18,
    backgroundColor: '#F5F1E9',
    borderWidth: 1,
    borderColor: '#E5DED2',
  },
  inputIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E3DBC9',
  },
  input: {
    flex: 1,
    minHeight: 40,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E1D7C6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    color: '#223626',
    fontSize: 13,
    lineHeight: 18,
    textAlignVertical: 'top',
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#214730',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendPressed: {
    opacity: 0.85,
  },
  sendDisabled: {
    opacity: 0.5,
  },
});
