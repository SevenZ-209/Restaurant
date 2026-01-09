import React, { useContext, useState } from "react";
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, Keyboard } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// --- KIỂM TRA ĐƯỜNG DẪN IMPORT ---
// Nếu file này nằm ở screens/User/Login.js thì phải lùi ra 2 cấp (../../)
import MyStyles from "../../styles/MyStyles";
import Apis, { endpoints, authApi } from "../../utils/Apis";
import { MyUserContext } from "../../utils/MyContexts"; 

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    
    const [, dispatch] = useContext(MyUserContext);
    const navigation = useNavigation();

    const login = async () => {
        // 1. Validate dữ liệu
        if (!username || !password) {
            Alert.alert("Thông báo", "Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!");
            return;
        }

        setLoading(true);
        Keyboard.dismiss(); // Ẩn bàn phím khi bấm đăng nhập

        try {
            // 2. CHUẨN BỊ DỮ LIỆU GỬI ĐI (Cực kỳ quan trọng)
            // Django OAuth bắt buộc định dạng form-urlencoded.
            // Ta ghép chuỗi thủ công để đảm bảo không bị lỗi trên Android/iOS.
            
            const CLIENT_ID = "WBWk96q2vsUQKVAmrdy6KTXYCSGRtiI5e3o703zm"; 
            const CLIENT_SECRET = "Fa4zuHyhOMwZEqUZUeaHCU16EG9w7f0kdCCzaxdWDCy26vyNJ58dC6aqLmSG25VpKNEolD8gu6mmQanpmGQ5l9Z3HUvSgfxtU791dbk3F8BVUhciQoDtS6gaIFzvO4jm";

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

            // 3. GỌI API LOGIN
            let res = await Apis.post(endpoints['login'], formBody, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                }
            });

            console.info("Login thành công! Token:", res.data.access_token);

            // 4. LƯU TOKEN
            await AsyncStorage.setItem("token", res.data.access_token);

            // 5. LẤY THÔNG TIN USER
            let userRes = await authApi(res.data.access_token).get(endpoints['current-user']);
            console.info("User Info:", userRes.data);

            // 6. CẬP NHẬT CONTEXT & CHUYỂN TRANG
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
        <View style={[MyStyles.container, { padding: 20, justifyContent: 'center', backgroundColor: 'white' }]}>
            <Text style={[MyStyles.subject, {textAlign: 'center', marginBottom: 40, fontSize: 30, color: "blue"}]}>
                ĐĂNG NHẬP
            </Text>

            <TextInput 
                value={username} 
                onChangeText={t => setUsername(t)} 
                style={[MyStyles.margin, { backgroundColor: 'white' }]}
                label="Tên đăng nhập" 
                mode="outlined"
                autoCapitalize="none" // Không tự viết hoa ký tự đầu
                left={<TextInput.Icon icon="account" />}
            />
            
            <TextInput 
                value={password} 
                onChangeText={t => setPassword(t)} 
                style={[MyStyles.margin, { backgroundColor: 'white' }]}
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
                <ActivityIndicator size="large" color="blue" style={{ marginTop: 20 }} />
            ) : (
                <>
                    <Button 
                        mode="contained" 
                        onPress={login} 
                        style={[MyStyles.margin, { marginTop: 20, paddingVertical: 5 }]}
                        labelStyle={{ fontSize: 16 }}
                    >
                        Đăng nhập
                    </Button>
                    
                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
                        <Text style={{ fontSize: 15 }}>Chưa có tài khoản? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                            <Text style={{ color: 'blue', fontWeight: 'bold', fontSize: 15 }}>
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