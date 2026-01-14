import { StyleSheet } from 'react-native';

const OrderHistoryStyles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: '#f5f5f5'
    },
    header: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: 'white', 
        paddingVertical: 5, 
        elevation: 2 
    },
    headerTitle: { 
        fontSize: 18, 
        fontWeight: 'bold', 
        marginLeft: 5 
    },
    scrollContent: {
        paddingBottom: 20
    },
    card: {
        margin: 10, 
        backgroundColor: 'white', 
        elevation: 2
    },
    statusChip: {
        marginRight: 10
    },
    statusChipText: {
        color: 'white', 
        fontSize: 10, 
        fontWeight: 'bold'
    },
    cardContent: {
        marginTop: 10
    },
    accordionTitle: {
        fontSize: 14
    },
    totalRow: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        marginTop: 15, 
        alignItems: 'center'
    },
    totalLabel: {
        fontWeight: 'bold', 
        color: '#555'
    },
    totalValue: {
        fontWeight: 'bold', 
        color: '#d32f2f', 
        fontSize: 16
    },
    cancelButton: {
        marginTop: 15, 
        borderColor: '#f44336'
    }
});

export default OrderHistoryStyles;