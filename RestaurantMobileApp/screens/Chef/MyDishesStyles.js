import { StyleSheet } from 'react-native';

const MyDishesStyles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#f5f5f5' 
    },
    header: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        padding: 10, 
        backgroundColor: 'white', 
        elevation: 2 
    },
    headerTitle: { 
        fontSize: 18, 
        fontWeight: 'bold', 
        marginLeft: 10 
    },
    loading: { 
        marginTop: 20 
    },
    listContent: { 
        paddingBottom: 80 
    },
    emptyText: { 
        textAlign: 'center', 
        marginTop: 20 
    },
    card: { 
        flexDirection: 'row', 
        backgroundColor: '#fff', 
        marginHorizontal: 10, 
        marginTop: 10, 
        padding: 10, 
        borderRadius: 8, 
        elevation: 2 
    },
    image: { 
        width: 80, 
        height: 80, 
        borderRadius: 8 
    },
    info: { 
        flex: 1, 
        marginLeft: 10, 
        justifyContent: 'center' 
    },
    name: { 
        fontSize: 16, 
        fontWeight: 'bold' 
    },
    price: { 
        color: '#d32f2f', 
        fontWeight: 'bold' 
    },
    status: { 
        fontSize: 12, 
        fontStyle: 'italic', 
        marginTop: 4 
    },
    statusActive: { 
        color: 'green' 
    },
    statusInactive: { 
        color: 'red' 
    },
    actions: { 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    fab: { 
        position: 'absolute', 
        margin: 16, 
        right: 0, 
        bottom: 0, 
        backgroundColor: 'orange' 
    }
});

export default MyDishesStyles;