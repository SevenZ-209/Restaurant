import { View, Text } from "react-native";
import AuthStyle from "./AuthStyle";
import { Button } from "react-native-paper";
import { useContext } from "react";
import { MyUserContext } from "../../utils/MyContexts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const UserScreen = () => {
    const [user, dispatch] = useContext(MyUserContext);
    const nav = useNavigation();

    const logout = async () => {
        await AsyncStorage.removeItem("token");

        dispatch({
            "type": "logout"
        });

        nav.navigate('Login');
    }

    console.info(user);

    if (!user) {
        return (
            <View style={AuthStyle.padding}>
                <Text style={AuthStyle.title}>Not Logged In</Text>
                <Text style={{ textAlign: 'center', marginBottom: 20, fontSize: 16 }}>Please login to view your profile</Text>
                <Button mode="contained" onPress={() => nav.navigate('Login')} style={AuthStyle.button}>
                    Go to Login
                </Button>
            </View>
        );
    }

    return (
        <View style={AuthStyle.padding}>
            <Text style={AuthStyle.title}>Welcome {user.username}!</Text>

            <View style={{ marginVertical: 20, padding: 16, backgroundColor: '#F5F5F5', borderRadius: 8 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#1A1A1A' }}>
                    Email: <Text style={{ fontWeight: '400' }}>{user.email}</Text>
                </Text>
                <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#1A1A1A' }}>
                    Username: <Text style={{ fontWeight: '400' }}>{user.username}</Text>
                </Text>
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#1A1A1A' }}>
                    Role: <Text style={{ fontWeight: '400', color: '#FF6B35' }}>{user.role || 'customer'}</Text>
                </Text>
            </View>

            <Button 
                icon="logout" 
                mode="contained" 
                onPress={logout}
                style={AuthStyle.button}
            >
                Logout
            </Button>
        </View>
    );
}

export default UserScreen;
