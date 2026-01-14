import { StyleSheet } from 'react-native';

const CartStyles = StyleSheet.create({
    statusCard: {
        marginTop: 10,
        marginHorizontal: 8,
        borderLeftWidth: 5,
        elevation: 3
    },
    container: { 
        flex: 1, 
        backgroundColor: '#f5f5f5' 
    },
    scrollContent: {
        paddingBottom: 120 
    },
    
    card: { 
        margin: 8, 
        elevation: 2,
        backgroundColor: 'white' 
    },
    activeTableCard: { 
        backgroundColor: '#e3f2fd', 
        borderWidth: 1, 
        borderColor: '#2196f3' 
    },
    
    statusContainer: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        paddingHorizontal: 20, 
        marginTop: 10, 
        alignItems: 'center'
    },
    statusLabel: {
        fontWeight: 'bold', 
        fontSize: 16
    },
    badge: {
        color: 'white',
        paddingHorizontal: 10
    },

    orderedCard: { 
        backgroundColor: '#f1f8e9' 
    },
    orderedHeader: { 
        color: '#2e7d32', 
        fontWeight: 'bold' 
    },
    itemTotal: { 
        alignSelf: 'center', 
        fontWeight: 'bold' 
    },

    itemCard: { 
        marginHorizontal: 8, 
        marginBottom: 6, 
        padding: 8,
        backgroundColor: 'white'
    },
    row: { 
        flexDirection: 'row', 
        alignItems: 'center' 
    },
    img: { 
        width: 50, 
        height: 50, 
        borderRadius: 6 
    },
    itemDetails: {
        flex: 1, 
        marginLeft: 10
    },
    bold: { 
        fontWeight: 'bold' 
    },
    price: { 
        color: '#d32f2f' 
    },
    qtyBox: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginRight: 5 
    },
    qtyText: { 
        fontWeight: 'bold', 
        fontSize: 16 
    },

    footer: { 
        position: 'absolute', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        padding: 15, 
        backgroundColor: 'white', 
        borderTopWidth: 1, 
        borderColor: '#eee' 
    },
    summaryRow: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        marginBottom: 10 
    },
    totalLabel: { 
        fontSize: 16 
    },
    totalValue: { 
        fontSize: 22, 
        fontWeight: 'bold', 
        color: '#d32f2f' 
    },
    btnRow: { 
        flexDirection: 'row', 
        gap: 8 
    },
    btnOrder: {
        flex: 2
    },
    btnPay: {
        flex: 1
    },

    emptyText: { 
        textAlign: 'center', 
        color: 'gray', 
        marginTop: 10 
    }
});

export default CartStyles;