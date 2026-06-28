import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import * as Print from 'expo-print';
import { appConfig } from './config';

export default function App() {
  const [printQueueList, setPrintQueueList] = useState([]);
  const [isQueueLoading, setIsQueueLoading] = useState(true);

  const fetchPrintQueue = async () => {
    try {
      const apiEndpoint = `${appConfig.apiBaseUrl}/get_queue.php`;
      const response = await fetch(apiEndpoint);
      const jsonResponse = await response.json();

      if (jsonResponse.success) {
        setPrintQueueList(jsonResponse.data);
      } else {
        console.error("API Error:", jsonResponse.message);
      }
    } catch (networkError) {
      console.error("Network Error:", networkError);
    } finally {
      setIsQueueLoading(false);
    }
  };

  useEffect(() => {
    fetchPrintQueue();
    const pollingInterval = setInterval(fetchPrintQueue, 5000);
    return () => clearInterval(pollingInterval);
  }, []);

  const processPrintJob = async (printJob) => {
    if (!Print) {
      Alert.alert("Module Error", "Print module not loaded properly.");
      return;
    }

    try {
      const documentUri = `${appConfig.serverBaseUrl}/${printJob.file_path}`;

      /* -----
      Triggers the Android Print Spooler. 
      The admin will use the 'pages' info from the card to configure the physical print here.
      ----- */
      await Print.printAsync({
        uri: documentUri,
      });

      const firebaseEndpoint = `${appConfig.firebaseDatabaseUrl}/queue/${printJob.id}/status.json`;

      await fetch(firebaseEndpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify('Printing in progress...'),
      });

    } catch (printExecutionError) {
      console.error("Print Job Failed:", printExecutionError);
      Alert.alert("Execution Error", "Failed to process the document spooling.");
    }
  };

  const renderQueueCard = ({ item: printJob }) => (
    <View style={styles.cardContainer}>
      <View style={styles.cardHeader}>
        <Text style={styles.requesterName}>{printJob.requester_name}</Text>
        <Text style={styles.timestamp}>{new Date(printJob.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
      </View>

      <View style={styles.detailsRow}>
        <Text style={styles.detailLabel}>Pages:</Text>
        <Text style={styles.highlightText}>{printJob.pages}</Text>
      </View>

      <Text style={styles.jobDetails}>
        Copies: {printJob.copies}  |  Color: {printJob.color}
      </Text>

      <TouchableOpacity style={styles.printButtonSolid} onPress={() => processPrintJob(printJob)}>
        <Text style={styles.printButtonText}>Print Document</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.headerTitle}>{appConfig.shopName}</Text>

      {isQueueLoading ? (
        <ActivityIndicator size="large" color="#00aeef" />
      ) : (
        <FlatList
          data={printQueueList}
          renderItem={renderQueueCard}
          keyExtractor={(printJob) => printJob.id.toString()}
          ListEmptyComponent={<Text style={styles.emptyText}>No pending print jobs.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f4ece1', // Matches the new web SPA brown theme
    padding: 20,
    paddingTop: 60
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#231f20',
    marginBottom: 20
  },
  cardContainer: {
    backgroundColor: '#ffffff',
    padding: 18,
    marginBottom: 15,
    borderRadius: 10,
    borderLeftWidth: 5,
    borderLeftColor: '#00aeef', // Cyan accent to match branding
    elevation: 4
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  requesterName: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#231f20'
  },
  timestamp: {
    fontSize: 12,
    color: '#888'
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  detailLabel: {
    fontSize: 16,
    color: '#495057',
    marginRight: 5,
    fontWeight: '600'
  },
  highlightText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ec008c', // Magenta accent for critical page info
  },
  jobDetails: {
    fontSize: 16,
    color: '#495057',
    marginBottom: 15
  },
  printButtonSolid: {
    backgroundColor: '#231f20',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center'
  },
  printButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic'
  }
});