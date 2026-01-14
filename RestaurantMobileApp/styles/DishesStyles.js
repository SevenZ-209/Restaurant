import { StyleSheet } from "react-native";

const DishesStyles = StyleSheet.create({
    card: { 
        margin: 10, 
        marginBottom: 5, 
        overflow: 'hidden', 
        backgroundColor: 'white' 
    },
    rowBetween: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
    },
    dishName: { 
        fontSize: 18, 
        fontWeight: 'bold' 
    },
    dishPrice: { 
        fontSize: 16, 
        fontWeight: 'bold', 
        color: 'red' 
    },
    prepBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(0,0,0,0.6)',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 15,
        paddingRight: 10
    },
    prepText: { 
        color: 'white', 
        fontSize: 12, 
        fontWeight: 'bold' 
    },
    tagContainer: { 
        flexDirection: 'row', 
        flexWrap: 'wrap', 
        marginTop: 10,
        paddingBottom: 5 
    },
    tag: { 
        marginRight: 6, 
        marginBottom: 6, 
        backgroundColor: '#e3f2fd', // Màu xanh nhạt cho tag
        borderRadius: 8
    },
    tagText: { 
        fontSize: 11, 
        color: '#1976d2', 
        fontWeight: 'bold',
        marginVertical: 2
    }
});

export default DishesStyles;