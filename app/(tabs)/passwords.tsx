import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLanguage } from '../../hooks/useLanguage';
import { Plus, Trash2, CreditCard as Edit, Check, X, Copy, Eye, EyeOff } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';

type Password = {
  id: string;
  title: string;
  email: string;
  password: string;
};

const PASSWORDS_KEY = '@passwords';

export default function PasswordScreen() {
  const { strings } = useLanguage();
  const [passwords, setPasswords] = useState<Password[]>([]);
  const [isAddingPassword, setIsAddingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState({
    title: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
  const [editingPassword, setEditingPassword] = useState<Password | null>(null);

  React.useEffect(() => {
    loadPasswords();
  }, []);

  const loadPasswords = async () => {
    try {
      const savedPasswords = await AsyncStorage.getItem(PASSWORDS_KEY);
      if (savedPasswords) {
        setPasswords(JSON.parse(savedPasswords));
      }
    } catch (error) {
      console.error('Error loading passwords:', error);
    }
  };

  const savePasswords = async (newPasswords: Password[]) => {
    try {
      await AsyncStorage.setItem(PASSWORDS_KEY, JSON.stringify(newPasswords));
    } catch (error) {
      console.error('Error saving passwords:', error);
    }
  };

  const addPassword = useCallback(() => {
    if (!newPassword.title.trim() || !newPassword.password.trim()) return;

    const newPasswordItem: Password = {
      id: Date.now().toString(),
      ...newPassword,
    };

    const updatedPasswords = [...passwords, newPasswordItem];
    setPasswords(updatedPasswords);
    savePasswords(updatedPasswords);
    setNewPassword({ title: '', email: '', password: '' });
    setIsAddingPassword(false);
  }, [newPassword, passwords]);

  const deletePassword = useCallback((id: string) => {
    const updatedPasswords = passwords.filter((password) => password.id !== id);
    setPasswords(updatedPasswords);
    savePasswords(updatedPasswords);
  }, [passwords]);

  const copyToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text);
  };

  const togglePasswordVisibility = (id: string) => {
    setShowPassword((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{strings.passwords}</Text>
        <Pressable
          style={styles.addButton}
          onPress={() => setIsAddingPassword(true)}>
          <Plus size={24} color="#fff" />
        </Pressable>
      </View>

      <ScrollView style={styles.passwordList}>
        {passwords.map((password) => (
          <View key={password.id} style={styles.passwordItem}>
            <View style={styles.passwordHeader}>
              <Text style={styles.passwordTitle}>{password.title}</Text>
              <View style={styles.passwordActions}>
                <Pressable
                  style={styles.actionButton}
                  onPress={() => setEditingPassword(password)}>
                  <Edit size={20} color="#2196F3" />
                </Pressable>
                <Pressable
                  style={styles.actionButton}
                  onPress={() => deletePassword(password.id)}>
                  <Trash2 size={20} color="#F44336" />
                </Pressable>
              </View>
            </View>

            <View style={styles.passwordDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{strings.copyEmail}</Text>
                <Pressable
                  style={styles.copyButton}
                  onPress={() => copyToClipboard(password.email)}>
                  <Copy size={20} color="#2196F3" />
                </Pressable>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{strings.copyPassword}</Text>
                <View style={styles.passwordActions}>
                  <Pressable
                    style={styles.actionButton}
                    onPress={() => togglePasswordVisibility(password.id)}>
                    {showPassword[password.id] ? (
                      <EyeOff size={20} color="#666" />
                    ) : (
                      <Eye size={20} color="#666" />
                    )}
                  </Pressable>
                  <Pressable
                    style={styles.copyButton}
                    onPress={() => copyToClipboard(password.password)}>
                    <Copy size={20} color="#2196F3" />
                  </Pressable>
                </View>
              </View>

              {showPassword[password.id] && (
                <Text style={styles.passwordText}>{password.password}</Text>
              )}
            </View>
          </View>
        ))}
      </ScrollView>

      <Modal visible={isAddingPassword} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{strings.addPassword}</Text>
            <TextInput
              style={styles.input}
              value={newPassword.title}
              onChangeText={(text) =>
                setNewPassword({ ...newPassword, title: text })
              }
              placeholder="Title"
              placeholderTextColor="#999"
            />
            <TextInput
              style={styles.input}
              value={newPassword.email}
              onChangeText={(text) =>
                setNewPassword({ ...newPassword, email: text })
              }
              placeholder="Email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              value={newPassword.password}
              onChangeText={(text) =>
                setNewPassword({ ...newPassword, password: text })
              }
              placeholder="Password"
              placeholderTextColor="#999"
              secureTextEntry
            />
            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsAddingPassword(false)}>
                <X size={24} color="#F44336" />
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.confirmButton]}
                onPress={addPassword}>
                <Check size={24} color="#4CAF50" />
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#2196F3',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  passwordList: {
    flex: 1,
  },
  passwordItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  passwordTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  passwordActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
  },
  passwordDetails: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 16,
    color: '#666',
  },
  copyButton: {
    padding: 8,
  },
  passwordText: {
    fontSize: 16,
    color: '#333',
    marginTop: 8,
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  modalButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: '#ffebee',
  },
  confirmButton: {
    backgroundColor: '#e8f5e9',
  },
});