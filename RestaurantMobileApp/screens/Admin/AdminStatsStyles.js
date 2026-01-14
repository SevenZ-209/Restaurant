import { StyleSheet } from 'react-native';

const AdminStatsStyles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: 'white', 
        paddingTop: 40, 
        paddingBottom: 10, 
        paddingHorizontal: 10,
        elevation: 2
    },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#2e7d32', marginLeft: 5 },
    scrollContent: { padding: 16 },
    sectionTitle: { 
        fontSize: 14, 
        fontWeight: 'bold', 
        color: '#444', 
        marginBottom: 12, 
        marginTop: 15,
        textTransform: 'uppercase'
    },
    summaryCard: { marginBottom: 15, borderRadius: 12, elevation: 3 },
    summaryLabel: { fontSize: 13, color: '#555', fontWeight: '600' },
    summaryValue: { fontSize: 22, fontWeight: 'bold', marginTop: 4 },
    chartCard: { backgroundColor: 'white', borderRadius: 12, elevation: 3, paddingVertical: 10 },
    statRow: { marginBottom: 15 },
    progressBarBg: { height: 12, backgroundColor: '#eceff1', borderRadius: 6, overflow: 'hidden' },
    progressBarFill: { height: '100%', borderRadius: 6 }
});

export default AdminStatsStyles;