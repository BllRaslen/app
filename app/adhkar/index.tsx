import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLanguage } from '../../hooks/useLanguage';

export default function AdhkarScreen() {
  const { strings } = useLanguage();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{strings.adhkar}</Text>
      <ScrollView style={styles.content}>
        <Text>Adhkar content will be implemented here</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  content: {
    flex: 1,
  },
});