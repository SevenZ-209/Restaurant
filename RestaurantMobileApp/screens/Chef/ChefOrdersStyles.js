import { StyleSheet } from 'react-native';

const ChefOrdersStyles = StyleSheet.create({
    container: { 
        flex: 1, 
        padding: 10, 
        backgroundColor: '#f0f2f5' 
    },
    card: { 
        marginBottom: 15, 
        elevation: 4,
        backgroundColor: 'white'
    },
    badge: { 
        backgroundColor: 'orange', 
        marginRight: 10,
        color: 'white',
        fontWeight: 'bold'
    },
    actionButton: {
        marginHorizontal: 5
    }
});

export default ChefOrdersStyles;