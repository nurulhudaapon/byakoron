import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { tokenize } from '../utils/grammarUtils';

interface Props {
  text: string;
}

interface StylesType {
  container: ViewStyle;
  title: TextStyle;
  placeholderText: TextStyle;
  tokenList: ViewStyle;
  tokenContainer: ViewStyle;
  tokenItem: ViewStyle;
  tokenText: TextStyle;
  wordToken: ViewStyle;
  properToken: ViewStyle;
  numberToken: ViewStyle;
  punctuationToken: ViewStyle;
  otherToken: ViewStyle;
  legendContainer: ViewStyle;
  legendTitle: TextStyle;
  legendItems: ViewStyle;
  legendItem: ViewStyle;
  legendSample: ViewStyle;
  legendText: TextStyle;
}

const Tokenizer: React.FC<Props> = ({ text }) => {
  const [tokens, setTokens] = useState<string[]>([]);
  
  useEffect(() => {
    if (text) {
      const result = tokenize(text);
      setTokens(result);
    } else {
      setTokens([]);
    }
  }, [text]);
  
  const getTokenType = (token: string): string => {
    if (token.match(/^\d+$/)) return 'number';
    if (token.match(/^[A-Z][a-z]*$/)) return 'proper';
    if (token.match(/^[a-z]+$/i)) return 'word';
    if (token.match(/^[.,!?;:]+$/)) return 'punctuation';
    return 'other';
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tokenization</Text>
      
      {tokens.length === 0 ? (
        <Text style={styles.placeholderText}>
          Enter text to see tokens
        </Text>
      ) : (
        <ScrollView style={styles.tokenList}>
          <View style={styles.tokenContainer}>
            {tokens.map((token, index) => {
              const tokenType = getTokenType(token);
              const tokenStyleKey = `${tokenType}Token` as keyof StylesType;
              return (
                <View 
                  key={index} 
                  style={[
                    styles.tokenItem, 
                    styles[tokenStyleKey]
                  ]}
                >
                  <Text style={styles.tokenText}>{token}</Text>
                </View>
              );
            })}
          </View>
        </ScrollView>
      )}
      
      <View style={styles.legendContainer}>
        <Text style={styles.legendTitle}>Legend:</Text>
        <View style={styles.legendItems}>
          <View style={styles.legendItem}>
            <View style={[styles.tokenItem, styles.wordToken, styles.legendSample]} />
            <Text style={styles.legendText}>Word</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.tokenItem, styles.properToken, styles.legendSample]} />
            <Text style={styles.legendText}>Proper</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.tokenItem, styles.numberToken, styles.legendSample]} />
            <Text style={styles.legendText}>Number</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.tokenItem, styles.punctuationToken, styles.legendSample]} />
            <Text style={styles.legendText}>Punctuation</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create<StylesType>({
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
  placeholderText: {
    color: '#888',
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 20,
  },
  tokenList: {
    maxHeight: 150,
    marginBottom: 10,
  },
  tokenContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tokenItem: {
    marginRight: 5,
    marginBottom: 5,
    padding: 5,
    borderRadius: 5,
    minWidth: 30,
    alignItems: 'center',
  },
  tokenText: {
    fontSize: 14,
  },
  wordToken: {
    backgroundColor: '#e3f2fd',
    borderWidth: 1,
    borderColor: '#bbdefb',
  },
  properToken: {
    backgroundColor: '#e8f5e9',
    borderWidth: 1,
    borderColor: '#c8e6c9',
  },
  numberToken: {
    backgroundColor: '#fff3e0',
    borderWidth: 1,
    borderColor: '#ffe0b2',
  },
  punctuationToken: {
    backgroundColor: '#f3e5f5',
    borderWidth: 1,
    borderColor: '#e1bee7',
  },
  otherToken: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  legendContainer: {
    marginTop: 5,
    paddingTop: 5,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  legendItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 5,
  },
  legendSample: {
    width: 15,
    height: 15,
    marginRight: 5,
  },
  legendText: {
    fontSize: 12,
  },
});

export default Tokenizer; 