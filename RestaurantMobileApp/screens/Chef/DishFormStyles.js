import { StyleSheet } from 'react-native';

const DishFormStyles = StyleSheet.create({
    container: { 
        padding: 20, 
        backgroundColor: 'white', 
        flexGrow: 1 
    },
    headerTitle: { 
        fontSize: 24,
        fontWeight: 'bold', 
        color: '#1976d2',
        textAlign: 'center', 
        marginBottom: 20 
    },
    input: { 
        marginBottom: 15,
        backgroundColor: 'white'
    },
    row: { 
        flexDirection: 'row', 
        justifyContent: 'space-between' 
    },
    inputHalfLeft: { 
        flex: 1, 
        marginRight: 5,
        marginBottom: 15
    },
    inputHalfRight: { 
        flex: 1, 
        marginLeft: 5,
        marginBottom: 15
    },
    dropdownContainer: {
        marginBottom: 15
    },
    sectionTitle: { 
        fontWeight: "bold", 
        marginTop: 10, 
        marginBottom: 5,
        fontSize: 16
    },
    tagContainer: { 
        flexDirection: 'row', 
        flexWrap: 'wrap', 
        marginBottom: 15 
    },
    chip: { 
        margin: 4 
    },
    imagePicker: { 
        alignItems: 'center', 
        marginVertical: 15 
    },
    image: { 
        width: 200, 
        height: 150, 
        borderRadius: 10 
    },
    imagePlaceholder: { 
        width: 200, 
        height: 150, 
        backgroundColor: '#f0f0f0', 
        justifyContent: 'center', 
        alignItems: 'center', 
        borderRadius: 10, 
        borderStyle: 'dashed', 
        borderWidth: 1,
        borderColor: 'gray'
    },
    imageText: { 
        color: 'gray' 
    },
    btnSubmit: { 
        marginTop: 10 
    },
    btnCancel: { 
        marginTop: 10, 
        borderColor: 'red' 
    }
});

export default DishFormStyles;