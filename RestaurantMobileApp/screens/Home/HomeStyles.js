import { StyleSheet } from 'react-native';

const HomeStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    searchContainer: {
        padding: 25,
        marginBottom: 5,
    },
    searchBar: {
        backgroundColor: '#f0f0f0'
    },
    filterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10
    },
    categoriesWrapper: {
        flex: 1
    },
    menuButtonLabel: {
        fontSize: 12
    },
    dishesContainer: {
        flex: 1
    },

    floatingCart: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#ff9800',
        borderRadius: 30,
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        zIndex: 100
    },
    floatingCompare: {
        position: 'absolute',
        bottom: 90,
        right: 20,
        backgroundColor: '#2196F3',
        borderRadius: 25,
        paddingHorizontal: 15,
        height: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        zIndex: 100
    },
    compareText: {
        color: 'white',
        fontWeight: 'bold',
        marginLeft: -5
    },
    badge: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: 'red',
        fontWeight: 'bold',
        color: 'white',
        borderWidth: 1,
        borderColor: 'white'
    }
});

export default HomeStyles;