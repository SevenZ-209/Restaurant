import { StyleSheet } from 'react-native';

const UserProfileStyles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'white'
    },

    guestContainer: {
        justifyContent: 'center', 
        alignItems: 'center', 
        flex: 1, 
        backgroundColor: 'white'
    },
    guestAvatar: {
        backgroundColor: '#e0e0e0'
    },
    guestTitle: {
        fontSize: 24, 
        fontWeight: 'bold',
        marginVertical: 20, 
        color: '#333'
    },
    guestText: {
        marginBottom: 20, 
        color: 'gray', 
        textAlign: 'center', 
        paddingHorizontal: 20
    },
    guestButtonLogin: {
        width: "80%", 
        marginBottom: 15
    },
    guestButtonRegister: {
        width: "80%"
    },

    scrollContent: {
        flexGrow: 1, 
        alignItems: 'center', 
        paddingTop: 50, 
        backgroundColor: 'white'
    },
    avatar: {
        marginBottom: 15
    },
    avatarPlaceholder: {
        marginBottom: 15, 
        backgroundColor: "tomato"
    },
    nameText: {
        fontSize: 24, 
        fontWeight: 'bold', 
        color: '#333'
    },
    usernameText: {
        fontSize: 16, 
        color: "gray", 
        marginBottom: 20
    },
    
    roleContainer: {
        paddingHorizontal: 15, 
        paddingVertical: 5, 
        borderRadius: 20, 
        marginBottom: 30
    },
    roleText: {
        fontSize: 14, 
        fontWeight: "bold"
    },

    menuWrapper: {
        width: "90%"
    },
    menuSection: {
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#eee',
        overflow: 'hidden'
    },
    menuHeaderAdmin: {
        color: '#2e7d32', 
        fontWeight: 'bold'
    },
    menuItem: {
        paddingVertical: 10,
        backgroundColor: 'white'
    },

    chefButton: {
        marginBottom: 20, 
        backgroundColor: "#ff9800", 
        borderRadius: 8
    },
    chefButtonContent: {
        height: 50
    }
});

export default UserProfileStyles;