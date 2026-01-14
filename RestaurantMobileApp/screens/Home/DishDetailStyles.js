import { StyleSheet } from 'react-native';

const DishDetailStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    scrollContent: {
        paddingBottom: 20
    },
    dishImage: {
        width: "100%",
        height: 250
    },
    infoContainer: {
        padding: 20
    },
    dishName: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#1976d2",
        marginBottom: 5
    },
    price: {
        fontSize: 20,
        fontWeight: "bold",
        color: "red",
        marginVertical: 5
    },
    boldLabel: {
        fontWeight: 'bold',
        marginTop: 5
    },
    italicText: {
        marginBottom: 10,
        fontStyle: "italic",
        color: '#555'
    },
    divider: {
        marginVertical: 10,
        height: 6,
        backgroundColor: '#f0f0f0'
    },

    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333'
    },
    inputContainer: {
        marginBottom: 20,
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    ratingBar: {
        flexDirection: "row",
        alignItems: "center"
    },
    ratingLabel: {
        fontSize: 16,
        marginRight: 10
    },
    textInput: {
        marginTop: 10,
        backgroundColor: 'white'
    },
    sendButton: {
        marginTop: 10,
        alignSelf: "flex-end"
    },
    loginPrompt: {
        color: "blue",
        textAlign: "center",
        marginVertical: 15,
        padding: 10,
        backgroundColor: '#e3f2fd',
        borderRadius: 8
    },

    reviewCard: {
        marginBottom: 15,
        backgroundColor: '#fafafa'
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    userInfo: {
        flexDirection: 'row',
        flex: 1
    },
    userDetails: {
        marginLeft: 10
    },
    userName: {
        fontWeight: 'bold'
    },
    reviewDate: {
        fontSize: 12,
        color: 'gray'
    },
    actionButtons: {
        flexDirection: 'row'
    },
    reviewContent: {
        marginTop: 10,
        color: '#333'
    },
    emptyText: {
        textAlign: 'center',
        color: 'gray',
        marginTop: 20
    },
    bottomBar: {
        padding: 15,
        borderTopWidth: 1,
        borderColor: '#ddd',
        backgroundColor: 'white'
    },
    addToCartBtn: {
        backgroundColor: "#ff9800",
        paddingVertical: 5
    },
    addToCartLabel: {
        fontSize: 18
    }
});

export default DishDetailStyles;