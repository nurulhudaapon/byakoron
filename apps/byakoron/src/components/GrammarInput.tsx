import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { checkSpelling, tokenize } from '../utils/grammarUtils';

interface Props {
  onTextChange: (text: string) => void;
  onSpellingCheck: (issues: { word: string, index: number, suggestions: string[] }[]) => void;
}

const GrammarInput: React.FC<Props> = ({ onTextChange, onSpellingCheck }) => {
  const [text, setText] = useState('');
  const [spellingIssues, setSpellingIssues] = useState<{ word: string, index: number, suggestions: string[] }[]>([]);
  
  useEffect(() => {
    // Update parent component when text changes
    onTextChange(text);
    
    // Check spelling on each update
    if (text) {
      checkTextSpelling(text);
    } else {
      setSpellingIssues([]);
      onSpellingCheck([]);
    }
  }, [text]);
  
  const checkTextSpelling = (inputText: string) => {
    const tokens = tokenize(inputText);
    const issues: { word: string, index: number, suggestions: string[] }[] = [];
    
    // Check each token for spelling issues
    let lastIndex = 0;
    tokens.forEach(token => {
      if (token.match(/^\w+$/)) { // Only check words, not punctuation
        const { correct, suggestions } = checkSpelling(token);
        
        if (!correct) {
          // Find the actual index of this token in the text
          const index = inputText.indexOf(token, lastIndex);
          lastIndex = index + token.length;
          
          issues.push({
            word: token,
            index,
            suggestions
          });
        }
      }
    });
    
    setSpellingIssues(issues);
    onSpellingCheck(issues);
  };
  
  const replaceWord = (original: string, replacement: string) => {
    const newText = text.replace(original, replacement);
    setText(newText);
  };
  
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        multiline
        placeholder="Type your text here to check grammar and spelling..."
        value={text}
        spellCheck={false}
        autoCorrect={false}
        autoCapitalize="none"
        onChangeText={setText}
      />
      
      {spellingIssues.length > 0 && (
        <View style={styles.issuesContainer}>
          <Text style={styles.issuesTitle}>Spelling Issues:</Text>
          <ScrollView style={styles.issuesList}>
            {spellingIssues.map((issue, index) => (
              <View key={index} style={styles.issueItem}>
                <Text style={styles.issueText}>
                  <Text style={styles.issueWord}>{issue.word}</Text> might be misspelled
                </Text>
                <View style={styles.suggestionContainer}>
                  {issue.suggestions.map((suggestion, sIndex) => (
                    <TouchableOpacity 
                      key={sIndex}
                      style={styles.suggestionButton}
                      onPress={() => replaceWord(issue.word, suggestion)}
                    >
                      <Text style={styles.suggestionText}>{suggestion}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    minHeight: 150,
    textAlignVertical: 'top', // For Android
  },
  issuesContainer: {
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 5,
    padding: 10,
    maxHeight: 200,
  },
  issuesTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
    fontSize: 16,
  },
  issuesList: {
    maxHeight: 150,
  },
  issueItem: {
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  issueText: {
    fontSize: 14,
  },
  issueWord: {
    color: 'red',
    fontWeight: 'bold',
  },
  suggestionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  suggestionButton: {
    backgroundColor: '#e6f7ff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 5,
    marginBottom: 5,
  },
  suggestionText: {
    color: '#0077cc',
  },
});

export default GrammarInput; 