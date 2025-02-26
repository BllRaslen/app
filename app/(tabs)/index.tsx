import React from 'react';
import { View, Text, StyleSheet, Pressable, useColorScheme } from 'react-native';
import { useLanguage } from '../../hooks/useLanguage';
import { ListTodo, KeyRound, ChartBar as BarChart3, Activity, Users, Calendar } from 'lucide-react-native';
import { Link } from 'expo-router';

export default function HomeScreen() {
  const { strings } = useLanguage();
  const colorScheme = useColorScheme();

  const stats = {
    tasks: {
      total: 24,
      completed: 18,
      pending: 6,
    },
    passwords: {
      total: 15,
      recent: 3,
    },
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome Back!</Text>
        <Text style={styles.dateText}>{new Date().toLocaleDateString()}</Text>
      </View>

      <View style={styles.overviewSection}>
        <View style={styles.overviewHeader}>
          <BarChart3 size={24} color="#6366F1" />
          <Text style={styles.overviewTitle}>Overview</Text>
        </View>
        
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: '#EEF2FF' }]}>
            <Activity size={24} color="#6366F1" />
            <Text style={styles.statValue}>{stats.tasks.total}</Text>
            <Text style={styles.statLabel}>Total Tasks</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: '#F0FDF4' }]}>
            <Users size={24} color="#22C55E" />
            <Text style={styles.statValue}>{stats.tasks.completed}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: '#FEF2F2' }]}>
            <Calendar size={24} color="#EF4444" />
            <Text style={styles.statValue}>{stats.tasks.pending}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </View>
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          <Link href="/(tabs)/todos" asChild>
            <Pressable style={styles.actionCard}>
              <View style={[styles.iconContainer, { backgroundColor: '#818CF8' }]}>
                <ListTodo size={24} color="#fff" />
              </View>
              <Text style={styles.actionTitle}>{strings.todos}</Text>
              <Text style={styles.actionSubtitle}>{stats.tasks.total} Tasks</Text>
            </Pressable>
          </Link>

          <Link href="/(tabs)/passwords" asChild>
            <Pressable style={styles.actionCard}>
              <View style={[styles.iconContainer, { backgroundColor: '#34D399' }]}>
                <KeyRound size={24} color="#fff" />
              </View>
              <Text style={styles.actionTitle}>{strings.passwords}</Text>
              <Text style={styles.actionSubtitle}>{stats.passwords.total} Passwords</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 16,
    color: '#6B7280',
  },
  overviewSection: {
    marginBottom: 24,
  },
  overviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  overviewTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  quickActions: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
});