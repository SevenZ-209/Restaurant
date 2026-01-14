import { StyleSheet } from 'react-native';

const CompareDishesStyles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#fff' 
    },

    emptyContainer: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: 20 
    },
    emptyText: { 
        textAlign: 'center', 
        fontSize: 16, 
        color: '#666', 
        fontWeight: 'bold' 
    },
    btnBackHome: {
        marginTop: 20
    },

    headerBar: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingVertical: 5 
    },
    headerTitle: { 
        fontSize: 18, 
        fontWeight: 'bold', 
        color: '#333' 
    },

    tableWrapper: { 
        paddingHorizontal: 15, 
        paddingVertical: 10 
    },

    customHeaderRow: { 
        flexDirection: 'row', 
        paddingVertical: 15, 
        borderBottomWidth: 1, 
        borderColor: '#eee' 
    },

    labelCol: { 
        width: 100, 
        justifyContent: 'center' 
    },
    dataColFixed: { 
        width: 200,
        alignItems: 'center', 
        justifyContent: 'center' 
    }, 
    
    dishImg: { 
        width: 75, 
        height: 75, 
        borderRadius: 12 
    },
    nameWrapper: { 
        width: 180, 
        marginTop: 10 
    },
    dishNameFull: { 
        fontSize: 14, 
        fontWeight: 'bold', 
        textAlign: 'center', 
        color: '#1976d2', 
        lineHeight: 20 
    },

    row: { 
        height: 70, 
        borderBottomWidth: 0.5, 
        borderColor: '#eee' 
    },
    ingredientsRow: { 
        height: 180
    },

    boldLabel: { 
        fontWeight: 'bold', 
        fontSize: 16, 
        color: '#000' 
    },
    boldText: { 
        fontWeight: 'bold', 
        color: '#555', 
        fontSize: 14 
    },
    normalText: { 
        fontSize: 14, 
        color: '#333' 
    },
    priceValue: { 
        color: '#d32f2f', 
        fontWeight: 'bold', 
        fontSize: 15 
    },
    ratingText: { 
        color: '#fbc02d', 
        fontWeight: 'bold' 
    },
    ingContent: { 
        fontSize: 11, 
        color: '#666', 
        lineHeight: 18, 
        textAlign: 'center' 
    }
});

export default CompareDishesStyles;