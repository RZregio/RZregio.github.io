import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, Platform, RefreshControl } from 'react-native';
import * as Print from 'expo-print';
import { appConfig } from './config';

export default function App() {
  const [printQueueList, setPrintQueueList] = useState([]);
  const [completedJobs, setCompletedJobs] = useState([]);
  const [isQueueLoading, setIsQueueLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('queue');

  const lastSeenIdRef = useRef(0);

  const fetchPrintQueue = async () => {
    try {
      const firebaseQueueEndpoint = `${appConfig.firebaseDatabaseUrl}/queue.json`;
      const response = await fetch(firebaseQueueEndpoint);
      const data = await response.json();

      if (data) {
        const parsedQueue = Object.keys(data).map(key => data[key]).filter(Boolean);

        const active = parsedQueue.filter(job => job.status !== 'Done').sort((a, b) => a.id - b.id);
        const completed = parsedQueue.filter(job => job.status === 'Done').sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        const currentMaxId = active.length > 0 ? Math.max(...active.map(job => job.id)) : 0;
        lastSeenIdRef.current = currentMaxId;

        setPrintQueueList(active);
        setCompletedJobs(completed);
      } else {
        setPrintQueueList([]);
        setCompletedJobs([]);
      }
    } catch (networkError) {
      console.error("Firebase fetch error:", networkError);
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
    if (!printJob.file_path) {
      Alert.alert("Error", "This file path is missing or invalid.");
      return;
    }

    try {
      const documentUri = `${appConfig.serverBaseUrl}/${printJob.file_path}`;

      if (Platform.OS === 'web') {
        // Force download/open behavior for web browser testing
        const link = document.createElement('a');
        link.href = documentUri;
        link.target = '_blank';
        link.download = printJob.file_path.split('/').pop();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        await Print.printAsync({ uri: documentUri });
      }

      const firebaseEndpoint = `${appConfig.firebaseDatabaseUrl}/queue/${printJob.id}/status.json`;
      await fetch(firebaseEndpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify('Printing in progress...'),
      });

    } catch (error) {
      console.error("Print Job Failed:", error);
      Alert.alert("Execution Error", "Failed to process document spooling.");
    }
  };

  const markAsDone = async (printJobId) => {
    try {
      const firebaseEndpoint = `${appConfig.firebaseDatabaseUrl}/queue/${printJobId}/status.json`;
      await fetch(firebaseEndpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify('Done'),
      });
      fetchPrintQueue();
    } catch (error) {
      console.error("Completion Failed:", error);
    }
  };

  const renderQueueCard = ({ item: printJob }) => {
    // Extract exact filename to display on the card
    const fullPath = printJob.file_path || "";
    const fileName = fullPath.split('/').pop();

    return (
      <View style={styles.cardContainer}>
        <Text style={{ fontSize: 12, color: '#00aeef', fontWeight: 'bold', marginBottom: 6 }}>
          {fileName}
        </Text>

        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.requesterName}>{printJob.requester_name}</Text>
            <Text style={styles.timestamp}>
              {new Date(printJob.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
          <Text style={styles.priceTag}>₱{printJob.cost || '0.00'}</Text>
        </View>

        <View style={styles.detailsRow}>
          <Text style={styles.detailLabel}>Pages to Print:</Text>
          <Text style={styles.highlightText}>{printJob.pages}</Text>
        </View>

        <View style={styles.badgeRow}>
          <View style={styles.badge}><Text style={styles.badgeText}> {printJob.paper_size || 'N/A'}</Text></View>
          <View style={styles.badge}><Text style={styles.badgeText}> {printJob.margins || 'Normal'}</Text></View>
          <View style={styles.badge}><Text style={styles.badgeText}> {printJob.color}</Text></View>
          <View style={styles.badge}><Text style={styles.badgeText}> x{printJob.copies}</Text></View>
        </View>

        {printJob.color === 'Mixed' && (
          <Text style={styles.mixedNotes}>Color Pages: {printJob.color_pages}</Text>
        )}

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>
          <TouchableOpacity style={[styles.printButtonSolid, { flex: 1, marginRight: 10, backgroundColor: '#00aeef' }]} onPress={() => processPrintJob(printJob)}>
            <Text style={styles.printButtonText}>Print</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.printButtonSolid, { flex: 1, backgroundColor: '#231f20' }]} onPress={() => markAsDone(printJob.id)}>
            <Text style={styles.printButtonText}>Complete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderAnalytics = () => {
    const totalRevenue = completedJobs.reduce((sum, job) => sum + parseFloat(job.cost || 0), 0);
    const totalOrders = completedJobs.length;
    const totalPagesPrinted = completedJobs.reduce((sum, job) => sum + ((parseInt(job.pages) || 0) * (parseInt(job.copies) || 1)), 0);

    return (
      <View style={{ flex: 1 }}>
        <View style={styles.statsGrid}>
          <View style={[styles.statBox, { backgroundColor: '#231f20' }]}>
            <Text style={styles.statLabelLight}>Total Revenue</Text>
            <Text style={styles.statValueLight}>₱{totalRevenue.toFixed(2)}</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: '#ffffff', borderLeftWidth: 4, borderLeftColor: '#ec008c' }]}>
            <Text style={styles.statLabel}>Total Orders</Text>
            <Text style={styles.statValue}>{totalOrders}</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: '#ffffff', borderLeftWidth: 4, borderLeftColor: '#ffde00' }]}>
            <Text style={styles.statLabel}>Pages Printed</Text>
            <Text style={styles.statValue}>{totalPagesPrinted}</Text>
          </View>
        </View>

        <Text style={styles.subHeader}>Recent Completed Orders</Text>
        <FlatList
          data={completedJobs.slice(0, 20)}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.historyRow}>
              <View>
                <Text style={styles.historyName}>{item.requester_name}</Text>
                <Text style={styles.historyDate}>{new Date(item.created_at).toLocaleDateString()}</Text>
              </View>
              <Text style={styles.historyPrice}>+₱{item.cost}</Text>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>No completed orders yet.</Text>}
        />
      </View>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.headerTitle}>{appConfig.shopName || "Admin Dashboard"}</Text>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'queue' && styles.activeTab]}
          onPress={() => setActiveTab('queue')}>
          <Text style={[styles.tabText, activeTab === 'queue' && styles.activeTabText]}>Live Queue</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'analytics' && styles.activeTab]}
          onPress={() => setActiveTab('analytics')}>
          <Text style={[styles.tabText, activeTab === 'analytics' && styles.activeTabText]}>Analytics</Text>
        </TouchableOpacity>
      </View>

      {isQueueLoading ? (
        <ActivityIndicator size="large" color="#00aeef" style={{ marginTop: 50 }} />
      ) : activeTab === 'queue' ? (
        <FlatList
          data={printQueueList}
          renderItem={renderQueueCard}
          keyExtractor={(printJob) => printJob.id.toString()}
          refreshControl={<RefreshControl refreshing={isQueueLoading} onRefresh={fetchPrintQueue} colors={['#00aeef']} />}
          ListEmptyComponent={<Text style={styles.emptyText}>No pending print jobs.</Text>}
        />
      ) : (
        renderAnalytics()
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#f4ece1', padding: 20, paddingTop: 60 },
  headerTitle: { fontSize: 28, fontWeight: '900', color: '#231f20', marginBottom: 15 },
  tabContainer: { flexDirection: 'row', backgroundColor: '#e9ecef', borderRadius: 10, padding: 4, marginBottom: 20 },
  tabButton: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  activeTab: { backgroundColor: '#ffffff', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  tabText: { fontSize: 16, fontWeight: '600', color: '#6c757d' },
  activeTabText: { color: '#231f20' },
  cardContainer: { backgroundColor: '#ffffff', padding: 18, marginBottom: 15, borderRadius: 10, borderLeftWidth: 5, borderLeftColor: '#00aeef', elevation: 4 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  requesterName: { fontSize: 19, fontWeight: 'bold', color: '#231f20' },
  timestamp: { fontSize: 12, color: '#888', marginTop: 2 },
  priceTag: { fontSize: 20, fontWeight: '900', color: '#198754' },
  detailsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  detailLabel: { fontSize: 16, color: '#495057', marginRight: 5, fontWeight: '600' },
  highlightText: { fontSize: 16, fontWeight: 'bold', color: '#ec008c' },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 },
  badge: { backgroundColor: '#f0f0f0', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6 },
  badgeText: { fontSize: 13, fontWeight: '600', color: '#495057' },
  mixedNotes: { fontSize: 14, fontStyle: 'italic', color: '#dc3545', marginBottom: 5, fontWeight: '600' },
  printButtonSolid: { padding: 14, borderRadius: 8, alignItems: 'center' },
  printButtonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold', letterSpacing: 0.5 },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#666', fontStyle: 'italic' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 20 },
  statBox: { width: '48%', padding: 15, borderRadius: 10, marginBottom: 15, elevation: 2 },
  statLabel: { fontSize: 14, color: '#6c757d', fontWeight: 'bold' },
  statValue: { fontSize: 24, fontWeight: '900', color: '#231f20', marginTop: 5 },
  statLabelLight: { fontSize: 14, color: '#adb5bd', fontWeight: 'bold' },
  statValueLight: { fontSize: 24, fontWeight: '900', color: '#ffffff', marginTop: 5 },
  subHeader: { fontSize: 18, fontWeight: 'bold', color: '#231f20', marginBottom: 10 },
  historyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 10 },
  historyName: { fontSize: 16, fontWeight: 'bold', color: '#231f20' },
  historyDate: { fontSize: 12, color: '#888', marginTop: 2 },
  historyPrice: { fontSize: 16, fontWeight: 'bold', color: '#198754' }
}); 