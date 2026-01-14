import { StyleSheet } from 'react-native';

const RegisterStyles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: "white"
    },
    content: {
        padding: 24,
    },
    title: {
        textAlign: "center", 
        marginTop: 30,
        fontSize: 26,
        fontWeight: "bold",
        color: "#1976d2", 
        marginBottom: 30,
        textTransform: 'uppercase'
    },
    input: {
        marginBottom: 16,
        backgroundColor: 'white'
    },

    roleContainer: {
        marginTop: 10,
        marginBottom: 20, 
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 8,
        padding: 15 
    },
    roleLabel: {
        fontWeight: "bold", 
        marginBottom: 10,
        fontSize: 16
    },
    radioGroup: {
        flexDirection: "row", 
        justifyContent: "flex-start", 
        gap: 20 
    },
    radioItem: {
        flexDirection: "row", 
        alignItems: "center",
        marginRight: 20 
    },
    helperText: {
        color: '#ff9800',
        marginTop: 5
    },

    avatarPicker: {
        flexDirection: "row", 
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 20,
        padding: 10,
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8
    },
    avatarContainer: {
        alignItems: "center",
        marginBottom: 20
    },
    avatarImage: {
        width: 120, 
        height: 120, 
        borderRadius: 60, 
        borderWidth: 3,
        borderColor: '#eee'
    },

    btnRegister: {
        marginTop: 10, 
        paddingVertical: 8,
        borderRadius: 8
    },
    loginLink: {
        textAlign: "center", 
        marginTop: 30,
        color: "#1976d2",
        fontWeight: "bold",
        marginBottom: 40 
    }
});

export default RegisterStyles;