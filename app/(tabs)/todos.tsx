import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLanguage } from '../../hooks/useLanguage';
import { Plus, Trash2, CreditCard as Edit, Check, X, Tag, Circle, CircleCheck as CheckCircle, Palette } from 'lucide-react-native';

type Category = {
  id: string;
  name: string;
  icon: string;
  color: string;
};

type Todo = {
  id: string;
  text: string;
  description: string;
  completed: boolean;
  categoryId: string;
};

const TODOS_KEY = '@todos';
const CATEGORIES_KEY = '@categories';

const COLORS = [
  '#818CF8', // Indigo
  '#34D399', // Emerald
  '#F472B6', // Pink
  '#FBBF24', // Amber
  '#60A5FA', // Blue
  '#A78BFA', // Purple
];

export default function TodoScreen() {
  const { strings } = useLanguage();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newTodo, setNewTodo] = useState({ text: '', description: '' });
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({ 
    name: '', 
    color: COLORS[0] 
  });
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [isAddingTodo, setIsAddingTodo] = useState(false);

  React.useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [todosData, categoriesData] = await Promise.all([
        AsyncStorage.getItem(TODOS_KEY),
        AsyncStorage.getItem(CATEGORIES_KEY),
      ]);

      if (todosData) setTodos(JSON.parse(todosData));
      if (categoriesData) setCategories(JSON.parse(categoriesData));
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const saveData = async (newTodos: Todo[], newCategories: Category[]) => {
    try {
      await Promise.all([
        AsyncStorage.setItem(TODOS_KEY, JSON.stringify(newTodos)),
        AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(newCategories)),
      ]);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const addTodo = useCallback(() => {
    if (!newTodo.text.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }
    if (!selectedCategory) {
      Alert.alert('Error', 'Please select a category');
      return;
    }

    const newTodoItem: Todo = {
      id: Date.now().toString(),
      text: newTodo.text.trim(),
      description: newTodo.description.trim(),
      completed: false,
      categoryId: selectedCategory,
    };

    const updatedTodos = [...todos, newTodoItem];
    setTodos(updatedTodos);
    saveData(updatedTodos, categories);
    setNewTodo({ text: '', description: '' });
    setIsAddingTodo(false);
  }, [newTodo, selectedCategory, todos, categories]);

  const addCategory = useCallback(() => {
    if (!newCategory.name.trim()) {
      Alert.alert('Error', 'Please enter a category name');
      return;
    }

    const newCategoryItem: Category = {
      id: Date.now().toString(),
      name: newCategory.name.trim(),
      icon: 'tag',
      color: selectedColor,
    };

    const updatedCategories = [...categories, newCategoryItem];
    setCategories(updatedCategories);
    saveData(todos, updatedCategories);
    setNewCategory({ name: '', color: COLORS[0] });
    setSelectedColor(COLORS[0]);
    setIsAddingCategory(false);
    setSelectedCategory(newCategoryItem.id);
  }, [newCategory, selectedColor, categories, todos]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{strings.todos}</Text>
        <View style={styles.headerActions}>
          <Pressable
            style={[styles.actionButton, { marginRight: 8 }]}
            onPress={() => setIsAddingTodo(true)}>
            <Plus size={24} color="#fff" />
          </Pressable>
          <Pressable
            style={styles.actionButton}
            onPress={() => setIsAddingCategory(true)}>
            <Tag size={24} color="#fff" />
          </Pressable>
        </View>
      </View>

      <ScrollView horizontal style={styles.categoriesContainer}>
        {categories.map((category) => (
          <Pressable
            key={category.id}
            style={[
              styles.categoryChip,
              selectedCategory === category.id && styles.selectedCategory,
              { borderColor: category.color },
            ]}
            onPress={() => setSelectedCategory(category.id)}>
            <Tag size={16} color={category.color} />
            <Text style={[styles.categoryText, { color: category.color }]}>
              {category.name}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView style={styles.todoList}>
        {todos
          .filter((todo) => !selectedCategory || todo.categoryId === selectedCategory)
          .map((todo) => {
            const category = categories.find(c => c.id === todo.categoryId);
            return (
              <View
                key={todo.id}
                style={[
                  styles.todoItem,
                  todo.completed && styles.completedTodo,
                  { borderLeftColor: category?.color || '#818CF8' },
                ]}>
                <Pressable
                  style={styles.todoCheckbox}
                  onPress={() => {
                    const updatedTodos = todos.map((t) =>
                      t.id === todo.id ? { ...t, completed: !t.completed } : t
                    );
                    setTodos(updatedTodos);
                    saveData(updatedTodos, categories);
                  }}>
                  {todo.completed ? (
                    <CheckCircle size={24} color="#22C55E" />
                  ) : (
                    <Circle size={24} color="#6B7280" />
                  )}
                </Pressable>
                <View style={styles.todoContent}>
                  <Text
                    style={[
                      styles.todoText,
                      todo.completed && styles.completedText,
                    ]}>
                    {todo.text}
                  </Text>
                  {todo.description ? (
                    <Text
                      style={[
                        styles.todoDescription,
                        todo.completed && styles.completedText,
                      ]}>
                      {todo.description}
                    </Text>
                  ) : null}
                </View>
                <Pressable
                  style={styles.deleteButton}
                  onPress={() => {
                    const updatedTodos = todos.filter((t) => t.id !== todo.id);
                    setTodos(updatedTodos);
                    saveData(updatedTodos, categories);
                  }}>
                  <Trash2 size={20} color="#EF4444" />
                </Pressable>
              </View>
            );
          })}
      </ScrollView>

      {/* Add Category Modal */}
      <Modal visible={isAddingCategory} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{strings.addCategory}</Text>
            <TextInput
              style={styles.input}
              value={newCategory.name}
              onChangeText={(text) =>
                setNewCategory({ ...newCategory, name: text })
              }
              placeholder="Category name"
              placeholderTextColor="#9CA3AF"
            />
            <View style={styles.colorPicker}>
              <Text style={styles.colorPickerTitle}>Select Color</Text>
              <View style={styles.colorGrid}>
                {COLORS.map((color) => (
                  <Pressable
                    key={color}
                    style={[
                      styles.colorOption,
                      { backgroundColor: color },
                      selectedColor === color && styles.selectedColor,
                    ]}
                    onPress={() => setSelectedColor(color)}
                  />
                ))}
              </View>
            </View>
            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setIsAddingCategory(false);
                  setNewCategory({ name: '', color: COLORS[0] });
                  setSelectedColor(COLORS[0]);
                }}>
                <X size={24} color="#EF4444" />
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.confirmButton]}
                onPress={addCategory}>
                <Check size={24} color="#22C55E" />
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Todo Modal */}
      <Modal visible={isAddingTodo} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{strings.addTodo}</Text>
            <TextInput
              style={styles.input}
              value={newTodo.text}
              onChangeText={(text) => setNewTodo({ ...newTodo, text })}
              placeholder="Task title"
              placeholderTextColor="#9CA3AF"
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              value={newTodo.description}
              onChangeText={(text) => setNewTodo({ ...newTodo, description: text })}
              placeholder="Task description (optional)"
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setIsAddingTodo(false);
                  setNewTodo({ text: '', description: '' });
                }}>
                <X size={24} color="#EF4444" />
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.confirmButton]}
                onPress={addTodo}>
                <Check size={24} color="#22C55E" />
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
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerActions: {
    flexDirection: 'row',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  actionButton: {
    backgroundColor: '#818CF8',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoriesContainer: {
    padding: 20,
    paddingTop: 0,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 2,
  },
  selectedCategory: {
    backgroundColor: '#F3F4F6',
  },
  categoryText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  todoList: {
    flex: 1,
    padding: 20,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  todoCheckbox: {
    marginRight: 12,
  },
  todoContent: {
    flex: 1,
  },
  todoText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  todoDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  completedTodo: {
    backgroundColor: '#F9FAFB',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  deleteButton: {
    padding: 8,
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
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 12,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  colorPicker: {
    marginBottom: 16,
  },
  colorPickerTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 8,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  colorOption: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  selectedColor: {
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
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
    backgroundColor: '#FEE2E2',
  },
  confirmButton: {
    backgroundColor: '#D1FAE5',
  },
});