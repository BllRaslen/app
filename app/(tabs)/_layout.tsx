import { Tabs } from 'expo-router';
import { Book, SquareCheck as CheckSquare, Lock, Settings } from 'lucide-react-native';
import { useColorScheme } from 'react-native';
import { useLanguage } from '../../hooks/useLanguage';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { strings } = useLanguage();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colorScheme === 'dark' ? '#fff' : '#000',
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? '#000' : '#fff',
        },
        headerStyle: {
          backgroundColor: colorScheme === 'dark' ? '#000' : '#fff',
        },
        headerTintColor: colorScheme === 'dark' ? '#fff' : '#000',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: strings.adhkar,
          tabBarIcon: ({ color, size }) => <Book size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="todos"
        options={{
          title: strings.todos,
          tabBarIcon: ({ color, size }) => <CheckSquare size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="passwords"
        options={{
          title: strings.passwords,
          tabBarIcon: ({ color, size }) => <Lock size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: strings.settings,
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}