import React, { useContext, useState } from "react";
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, Keyboard } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Apis, { endpoints, authApi } from "../../utils/Apis";
import { MyUserContext } from "../../utils/MyContexts"; 
import styles from './LoginStyles';

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    
    const [, dispatch] = useContext(MyUserContext);
    const navigation = useNavigation();

    const login = async () => {
        if (!username || !password) {
            Alert.alert("Thông báo", "Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!");
            return;
        }

        setLoading(true);
        Keyboard.dismiss(); 

        try {
            const CLIENT_ID = "fiv9KML4DDALzE24uLSRgE7wkWKxGH7ebOLYfVVz"; 
            const CLIENT_SECRET = "pbkdf2_sha256$1200000$UwCsVTQccGURCq3QEp5ql0$FwkN29FBHeQoQHhtdTLQyNv1TTdJWWqt9jcDLcMHuj4=";

            const details = {
                'grant_type': 'password',
                'client_id': CLIENT_ID,
                'client_secret': CLIENT_SECRET,
                'username': username,
                'password': password
            };

            const formBody = Object.keys(details).map(key => 
                encodeURIComponent(key) + '=' + encodeURIComponent(details[key])
            ).join('&');

            console.info("Đang gửi yêu cầu đăng nhập...");

            let res = await Apis.post(endpoints['login'], formBody, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                }
            });

            console.info("Login thành công! Token:", res.data.access_token);

            await AsyncStorage.setItem("token", res.data.access_token);

            let userRes = await authApi(res.data.access_token).get(endpoints['current-user']);
            console.info("User Info:", userRes.data);

            dispatch({
                "type": "login",
                "payload": userRes.data
            });
            
            navigation.navigate("Main"); 

        } catch (ex) {
            console.error("Lỗi đăng nhập:", ex);
            
            if (ex.response) {
                console.error("Server phản hồi lỗi:", ex.response.data);
                
                if (ex.response.status === 400) {
                     Alert.alert("Đăng nhập thất bại", "Sai tên đăng nhập hoặc mật khẩu (hoặc sai Client ID).");
                } else if (ex.response.status === 401) {
                     Alert.alert("Đăng nhập thất bại", "Tài khoản chưa được kích hoạt hoặc sai mật khẩu.");
                } else {
                     Alert.alert("Lỗi Server", "Có lỗi xảy ra từ phía máy chủ.");
                }
            } else {
                 Alert.alert("Lỗi mạng", "Không thể kết nối đến Server. Vui lòng kiểm tra Internet.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                ĐĂNG NHẬP
            </Text>

            <TextInput 
                value={username} 
                onChangeText={t => setUsername(t)} 
                style={styles.input}
                label="Tên đăng nhập" 
                mode="outlined"
                autoCapitalize="none"
                left={<TextInput.Icon icon="account" />}
            />
            
            <TextInput 
                value={password} 
                onChangeText={t => setPassword(t)} 
                style={styles.input}
                label="Mật khẩu" 
                secureTextEntry={!showPassword} 
                mode="outlined"
                autoCapitalize="none"
                left={<TextInput.Icon icon="lock" />}
                right={
                    <TextInput.Icon 
                        icon={showPassword ? "eye-off" : "eye"} 
                        onPress={() => setShowPassword(!showPassword)} 
                    />
                }
            />

            {loading ? (
                <ActivityIndicator size="large" color="blue" style={styles.loading} />
            ) : (
                <>
                    <Button 
                        mode="contained" 
                        onPress={login} 
                        style={styles.button}
                        labelStyle={{ fontSize: 16 }}
                    >
                        Đăng nhập
                    </Button>
                    
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Chưa có tài khoản? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                            <Text style={styles.registerText}>
                                Đăng ký ngay
                            </Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </View>
    );
}

export default Login;