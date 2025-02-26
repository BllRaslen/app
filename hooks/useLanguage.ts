import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language, StringKey, strings } from '../constants/strings';

const LANGUAGE_KEY = '@language';

export function useLanguage() {
  const [language, setLanguage] = useState<Language>('ar');

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = useCallback(async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
      if (savedLanguage) {
        setLanguage(savedLanguage as Language);
      }
    } catch (error) {
      console.error('Error loading language:', error);
    }
  }, []);

  const changeLanguage = useCallback(async (newLanguage: Language) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_KEY, newLanguage);
      setLanguage(newLanguage);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  }, []);

  return {
    language,
    changeLanguage,
    strings: strings[language],
    getString: (key: StringKey) => strings[language][key],
  };
}