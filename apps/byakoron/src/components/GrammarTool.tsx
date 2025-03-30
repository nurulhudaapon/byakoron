import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import GrammarInput from './GrammarInput';
import GrammarChecker from './GrammarChecker';
import Transliterator from './Transliterator';
import WordStemmer from './WordStemmer';
import Tokenizer from './Tokenizer';

type GrammarFeature = 'grammar' | 'transliteration' | 'stemming' | 'tokenization';

const GrammarTool: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [spellingIssues, setSpellingIssues] = useState<{ word: string, index: number, suggestions: string[] }[]>([]);
  const [activeFeature, setActiveFeature] = useState<GrammarFeature>('grammar');
  
  const handleTextChange = (newText: string) => {
    setText(newText);
  };
  
  const handleSpellingIssues = (issues: { word: string, index: number, suggestions: string[] }[]) => {
    setSpellingIssues(issues);
  };
  
  const renderFeatureContent = () => {
    switch (activeFeature) {
      case 'grammar':
        return <GrammarChecker text={text} />;
      case 'transliteration':
        return <Transliterator text={text} />;
      case 'stemming':
        return <WordStemmer text={text} />;
      case 'tokenization':
        return <Tokenizer text={text} />;
      default:
        return null;
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Grammar Correction Tool</Text>
      
      <GrammarInput 
        onTextChange={handleTextChange}
        onSpellingCheck={handleSpellingIssues}
      />
      
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[styles.tab, activeFeature === 'grammar' && styles.activeTab]}
            onPress={() => setActiveFeature('grammar')}
          >
            <Text style={[styles.tabText, activeFeature === 'grammar' && styles.activeTabText]}>
              Grammar Check
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeFeature === 'transliteration' && styles.activeTab]}
            onPress={() => setActiveFeature('transliteration')}
          >
            <Text style={[styles.tabText, activeFeature === 'transliteration' && styles.activeTabText]}>
              Transliteration
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeFeature === 'stemming' && styles.activeTab]}
            onPress={() => setActiveFeature('stemming')}
          >
            <Text style={[styles.tabText, activeFeature === 'stemming' && styles.activeTabText]}>
              Word Stemming
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeFeature === 'tokenization' && styles.activeTab]}
            onPress={() => setActiveFeature('tokenization')}
          >
            <Text style={[styles.tabText, activeFeature === 'tokenization' && styles.activeTabText]}>
              Tokenization
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      
      <View style={styles.featureContainer}>
        {renderFeatureContent()}
      </View>
      
      <Text style={styles.footer}>
        All processing is done on-device without third-party modules
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  tabsContainer: {
    marginVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 5,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  activeTab: {
    backgroundColor: '#007bff',
  },
  tabText: {
    fontSize: 14,
    color: '#333',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  featureContainer: {
    flex: 1,
  },
  footer: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
  },
});

export default GrammarTool; 