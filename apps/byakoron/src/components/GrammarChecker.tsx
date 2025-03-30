import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { checkGrammar } from '../utils/grammarUtils';

interface Props {
  text: string;
}

const GrammarChecker: React.FC<Props> = ({ text }) => {
  const [grammarIssues, setGrammarIssues] = useState<{ index: number, message: string }[]>([]);
  
  useEffect(() => {
    if (text) {
      const { issues } = checkGrammar(text);
      setGrammarIssues(issues);
    } else {
      setGrammarIssues([]);
    }
  }, [text]);
  
  // Get context around the grammar issue for display
  const getIssueContext = (index: number): string => {
    const start = Math.max(0, index - 15);
    const end = Math.min(text.length, index + 15);
    let context = text.substring(start, end);
    
    if (start > 0) {
      context = '...' + context;
    }
    
    if (end < text.length) {
      context = context + '...';
    }
    
    return context;
  };
  
  // Highlight the issue part in the context
  const highlightIssue = (context: string, index: number): React.ReactNode => {
    // Calculate relative position in the context string
    const relativeIndex = index < 15 ? index : 15;
    const beforeIssue = context.substring(0, relativeIndex);
    const issueChar = context.charAt(relativeIndex);
    const afterIssue = context.substring(relativeIndex + 1);
    
    return (
      <Text>
        {beforeIssue}
        <Text style={styles.highlightedText}>{issueChar}</Text>
        {afterIssue}
      </Text>
    );
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Grammar Analysis</Text>
      
      {grammarIssues.length === 0 ? (
        <Text style={styles.noIssuesText}>
          {text ? 'No grammar issues detected.' : 'Enter text to check grammar.'}
        </Text>
      ) : (
        <ScrollView style={styles.issuesList}>
          {grammarIssues.map((issue, index) => (
            <View key={index} style={styles.issueItem}>
              <Text style={styles.issueMessage}>{issue.message}</Text>
              <View style={styles.contextContainer}>
                <Text style={styles.contextLabel}>Context:</Text>
                {highlightIssue(getIssueContext(issue.index), issue.index)}
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  noIssuesText: {
    fontStyle: 'italic',
    color: '#888',
    textAlign: 'center',
    marginVertical: 20,
  },
  issuesList: {
    maxHeight: 200,
  },
  issueItem: {
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  issueMessage: {
    fontWeight: 'bold',
    color: '#d32f2f',
    marginBottom: 5,
  },
  contextContainer: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
  },
  contextLabel: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  highlightedText: {
    backgroundColor: '#ffcdd2',
    fontWeight: 'bold',
    padding: 2,
  },
});

export default GrammarChecker; 