import { StyleSheet } from 'react-native';

const AdminOrderListStyles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#f5f5f5' 
    },
    header: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: 'white', 
        paddingVertical: 10, 
        elevation: 2, 
        paddingTop: 40 
    },
    headerTitle: { 
        fontSize: 18, 
        fontWeight: 'bold' 
    },
    headerSubtitle: { 
        fontSize: 13, 
        color: '#2e7d32', 
        fontWeight: '500' 
    },
    loading: { 
        marginTop: 20 
    },
    scrollContent: { 
        padding: 10 
    },
    emptyContainer: { 
        alignItems: 'center', 
        marginTop: 50 
    },
    emptyIcon: { 
        backgroundColor: '#eee' 
    },
    emptyText: { 
        marginTop: 10, 
        color: 'gray' 
    },
    card: { 
        marginBottom: 15, 
        backgroundColor: 'white' 
    },
    chip: { 
        marginRight: 10 
    }
});

export default AdminOrderListStyles;