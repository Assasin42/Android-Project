import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { changeAppLanguage } from '../i18n/i18nConfig';

// Settings ekranından çağrılacak fonksiyon
export const openLanguageSheet = () => {
  SheetManager.show('language-sheet');
};

export default function LanguageSheet() {
  const { t, i18n } = useTranslation();

  const languages = [
    { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
  ];

  const handleSelect = async (code) => {
    await changeAppLanguage(code);
    SheetManager.hide('language-sheet');
  };

  return (
    <ActionSheet id="language-sheet" gestureEnabled useNativeDriver={false}>
      <View style={styles.container}>
        <Text style={styles.title}>{t('settings.selectLanguage')}</Text>

        {languages.map((lang) => {
          const isSelected = i18n.language === lang.code;
          return (
            <TouchableOpacity
              key={lang.code}
              style={[styles.item, isSelected && styles.itemSelected]}
              onPress={() => handleSelect(lang.code)}
              activeOpacity={0.7}
            >
              <Text style={styles.flag}>{lang.flag}</Text>
              <Text style={[styles.label, isSelected && styles.labelSelected]}>
                {lang.label}
              </Text>
              {isSelected && (
                <Ionicons name="checkmark-circle" size={22} color="#34C759" style={styles.check} />
              )}
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => SheetManager.hide('language-sheet')}
        >
          <Text style={styles.closeText}>{t('common.close')}</Text>
        </TouchableOpacity>
      </View>
    </ActionSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    marginBottom: 10,
    backgroundColor: '#F9F9FB',
  },
  itemSelected: {
    backgroundColor: '#E8F9EE',
    borderWidth: 1.5,
    borderColor: '#34C759',
  },
  flag: {
    fontSize: 24,
    marginRight: 14,
  },
  label: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    flex: 1,
  },
  labelSelected: {
    color: '#1a1a1a',
    fontWeight: '700',
  },
  check: {
    marginLeft: 8,
  },
  closeButton: {
    marginTop: 10,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 15,
    color: '#666',
    fontWeight: '600',
  },
});