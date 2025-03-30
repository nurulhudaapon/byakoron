import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { transliterate } from '../utils/grammarUtils';

interface Props {
  text: string;
}

const Transliterator: React.FC<Props> = ({ text }) => {
  const [transliteratedText, setTransliteratedText] = useState<string>('');
  
  useEffect(() => {
    if (text) {
      const result = transliterate(text);
      setTransliteratedText(result);
    } else {
      setTransliteratedText('');
    }
  }, [text]);
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transliteration (English to Bangla)</Text>
      
      <View style={styles.resultContainer}>
        {transliteratedText ? (
          <Text style={styles.transliteratedText}>
            {transliteratedText}
          </Text>
        ) : (
          <Text style={styles.placeholderText}>
            Enter text to see transliteration
          </Text>
        )}
      </View>

      <Text style={styles.note}>
        Note: This is a simple transliteration with limited vocabulary
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f0f7ff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#d0e1f9',
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#0047ab',
  },
  resultContainer: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#e1e1e1',
    borderRadius: 5,
    backgroundColor: '#fff',
    minHeight: 60,
    justifyContent: 'center',
  },
  transliteratedText: {
    fontSize: 16,
    lineHeight: 24,
  },
  placeholderText: {
    color: '#888',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  note: {
    marginTop: 10,
    fontSize: 12,
    fontStyle: 'italic',
    color: '#666',
  },
});

export default Transliterator; 