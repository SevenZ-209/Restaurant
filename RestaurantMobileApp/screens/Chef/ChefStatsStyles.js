import { StyleSheet } from 'react-native';

const ChefStatsStyles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#f5f5f5' 
    },
    header: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: 'white', 
        paddingTop: 40, 
        paddingBottom: 10,
        paddingHorizontal: 10,
        elevation: 2
    },
    headerTitle: { 
        fontSize: 20, 
        fontWeight: 'bold', 
        color: '#2e7d32', 
        marginLeft: 5
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    scrollContent: { 
        padding: 16,
        paddingBottom: 40
    },
    
    filterContainer: {
        flexDirection: 'row', 
        alignItems: 'center', 
        marginBottom: 15,
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 8,
        elevation: 1
    },
    dateBanner: {
        backgroundColor: '#e8f5e9',
        paddingVertical: 8,
        marginBottom: 15,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#c8e6c9'
    },
    dateBannerText: {
        textAlign: 'center',
        color: '#2e7d32',
        fontWeight: 'bold',
        fontSize: 13
    },

    overviewCard: {
        backgroundColor: '#2e7d32',
        borderRadius: 12,
        marginBottom: 20,
        elevation: 4
    },
    overviewLabel: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        fontWeight: 'bold'
    },
    overviewValue: {
        color: 'white',
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 5
    },
    
    card: { 
        marginBottom: 20, 
        borderRadius: 12, 
        backgroundColor: 'white',
        elevation: 2,
        overflow: 'hidden'
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0'
    },
    cardTitle: { 
        fontSize: 16, 
        fontWeight: 'bold',
        marginLeft: 10,
        color: '#333'
    },
    
    tableHeader: {
        backgroundColor: '#fafafa',
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    tableHeadText: { 
        fontWeight: 'bold', 
        color: '#666',
        fontSize: 12
    },
    row: {
        borderBottomWidth: 0.5,
        borderBottomColor: '#f0f0f0'
    },
    cellText: { 
        fontSize: 13, 
        color: '#444' 
    },
    dateText: { 
        fontSize: 12, 
        color: '#666' 
    },
    revenueText: { 
        fontSize: 13, 
        fontWeight: 'bold', 
        color: '#2e7d32' 
    }
});

export default ChefStatsStyles;