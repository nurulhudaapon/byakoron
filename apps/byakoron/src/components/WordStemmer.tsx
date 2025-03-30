import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { stem, tokenize } from '../utils/grammarUtils';

interface Props {
  text: string;
}

const WordStemmer: React.FC<Props> = ({ text }) => {
  const [wordStems, setWordStems] = useState<{ original: string, stemmed: string }[]>([]);
  
  useEffect(() => {
    if (text) {
      processText(text);
    } else {
      setWordStems([]);
    }
  }, [text]);
  
  const processText = (inputText: string) => {
    const tokens = tokenize(inputText);
    const uniqueWords = new Set<string>();
    const results: { original: string, stemmed: string }[] = [];
    
    tokens.forEach(token => {
      // Only process words, not punctuation, and only process each unique word once
      if (token.match(/^\w+$/) && !uniqueWords.has(token.toLowerCase())) {
        uniqueWords.add(token.toLowerCase());
        const stemmed = stem(token);
        
        // Only show words where stemming actually changed something
        if (stemmed.toLowerCase() !== token.toLowerCase()) {
          results.push({
            original: token,
            stemmed,
          });
        }
      }
    });
    
    setWordStems(results);
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Word Stemming</Text>
      
      {wordStems.length === 0 ? (
        <Text style={styles.placeholderText}>
          {text ? 'No stemmable words found' : 'Enter text to see word stems'}
        </Text>
      ) : (
        <ScrollView style={styles.resultsList}>
          {wordStems.map((item, index) => (
            <View key={index} style={styles.stemItem}>
              <Text style={styles.originalWord}>{item.original}</Text>
              <Text style={styles.arrow}>→</Text>
              <Text style={styles.stemmedWord}>{item.stemmed}</Text>
            </View>
          ))}
        </ScrollView>
      )}
      
      <Text style={styles.note}>
        Stemming reduces words to their root form
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f0fa',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#e0d6eb',
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#5e3f8a',
  },
  placeholderText: {
    color: '#888',
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 20,
  },
  resultsList: {
    maxHeight: 150,
  },
  stemItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  originalWord: {
    flex: 2,
    fontSize: 16,
    fontWeight: '500',
  },
  arrow: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    color: '#888',
  },
  stemmedWord: {
    flex: 2,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5e3f8a',
  },
  note: {
    marginTop: 10,
    fontSize: 12,
    fontStyle: 'italic',
    color: '#666',
  },
});

export default WordStemmer; 