import { StyleSheet } from 'react-native';

const LoginStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24, 
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    title: {
        textAlign: 'center',
        marginBottom: 40,
        fontSize: 30,
        fontWeight: "bold",
        color: "#1976d2",
        textTransform: 'uppercase'
    },
    input: {
        marginBottom: 20,
        backgroundColor: 'white'
    },
    loading: {
        marginTop: 20
    },
    button: {
        marginTop: 30,
        paddingVertical: 8,
        borderRadius: 8
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 40 
    },
    footerText: {
        fontSize: 15,
        color: '#555'
    },
    registerText: {
        color: '#1976d2',
        fontWeight: 'bold',
        fontSize: 15,
        marginLeft: 5
    }
});

export default LoginStyles;