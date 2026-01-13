import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, Image, ScrollView, ActivityIndicator } from "react-native";
import { Button, HelperText, TextInput } from "react-native-paper";
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from "@react-navigation/native";

// --- Import đúng đường dẫn ---
import MyStyles from "../../styles/MyStyles";
import Apis, { endpoints } from "../../utils/Apis";

const Register = () => {
    const [user, setUser] = useState({});
    const [errMsg, setErrMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const nav = useNavigation();

    // Cấu hình các trường nhập liệu
    const info = [
        { label: "Tên", field: "first_name", icon: "text" },
        { label: "Họ và tên lót", field: "last_name", icon: "text" },
        { label: "Tên đăng nhập", field: "username", icon: "account" },
        { label: "Mật khẩu", field: "password", icon: "eye", secureTextEntry: true },
        { label: "Xác nhận mật khẩu", field: "confirm", icon: "eye", secureTextEntry: true }
    ];

    // Hàm chọn ảnh đại diện từ thư viện
    const picker = async () => {
        const {granted} = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (granted) {
            const res = await ImagePicker.launchImageLibraryAsync();
            if (!res.canceled)
                setUser({...user, "avatar": res.assets[0]});
        } else
            Alert.alert("Permission denied!");
    }

    // Kiểm tra dữ liệu nhập vào
    const validate = () => {
        if (!user.username || !user.password) {
             setErrMsg("Vui lòng nhập đầy đủ thông tin!");
             return false;
        }
        if (user.password !== user.confirm) {
            setErrMsg("Mật khẩu xác nhận KHÔNG khớp!");
            return false;
        }
        setErrMsg("");
        return true;
    }

    // Xử lý đăng ký
    const register = async () => {
        if (validate()) {
            setLoading(true);
            try {
                let form = new FormData();

                // Duyệt qua object user để append vào FormData
                for (let key in user) {
                    if (key !== 'confirm') {
                        if (key === 'avatar') {
                            form.append(key, {
                                uri: user.avatar.uri,
                                name: user.avatar.fileName || "avatar.jpg",
                                type: user.avatar.type || "image/jpeg"
                            });
                        } else {
                            form.append(key, user[key]);
                        }
                    }
                }

                console.info("Registering with:", user);

                // Gọi API
                let res = await Apis.post(endpoints['register'], form, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                if (res.status === 201) {
                    Alert.alert("Thành công", "Đăng ký tài khoản thành công! Vui lòng đăng nhập.");
                    nav.navigate('Login');
                } else {
                    setErrMsg("Đăng ký thất bại. Vui lòng kiểm tra lại!");
                }
            } catch (ex) {
                console.error(ex);
                setErrMsg("Đã có lỗi xảy ra hoặc tên đăng nhập đã tồn tại!");
            } finally {
                setLoading(false);
            }
        }
    }

    return (
        <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
            <View style={MyStyles.padding}>
                <Text style={[MyStyles.subject, { textAlign: "center", marginTop: 20 }]}>ĐĂNG KÝ TÀI KHOẢN</Text>

                {errMsg !== "" && (
                    <HelperText type="error" visible={true}>
                        {errMsg}
                    </HelperText>
                )}

                {info.map(i => (
                    <TextInput 
                        key={i.field} 
                        style={MyStyles.margin}
                        label={i.label}
                        secureTextEntry={i.secureTextEntry}
                        mode="outlined"
                        right={<TextInput.Icon icon={i.icon} />}
                        value={user[i.field]}
                        onChangeText={t => setUser({ ...user, [i.field]: t })} 
                    />
                ))}

                <TouchableOpacity style={[MyStyles.margin, { flexDirection: "row", alignItems: "center" }]} onPress={picker}>
                    <Button icon="camera" mode="text">Chọn ảnh đại diện</Button>
                </TouchableOpacity>    

                {user.avatar && (
                    <View style={{ alignItems: "center" }}>
                        <Image source={{ uri: user.avatar.uri }} style={{ width: 100, height: 100, borderRadius: 50, marginBottom: 10 }} />
                    </View>
                )}

                {loading ? (
                    <ActivityIndicator size="large" color="blue" />
                ) : (
                    <Button mode="contained" onPress={register} style={{ marginTop: 10, padding: 5 }}>
                        Đăng ký
                    </Button>
                )}
                
                <TouchableOpacity onPress={() => nav.navigate("Login")}>
                    <Text style={{ textAlign: "center", marginTop: 20, color: "blue" }}>Đã có tài khoản? Đăng nhập</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

export default Register;