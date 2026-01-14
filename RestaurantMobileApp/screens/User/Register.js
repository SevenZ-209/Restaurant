import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, Image, ScrollView, ActivityIndicator } from "react-native";
import { Button, HelperText, TextInput, RadioButton } from "react-native-paper";
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from "@react-navigation/native";

import Apis, { endpoints } from "../../utils/Apis";

import styles from './RegisterStyles';

const Register = () => {
    const [user, setUser] = useState({ role: 'CUSTOMER' });
    const [errMsg, setErrMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const nav = useNavigation();

    const info = [
        { label: "Tên", field: "first_name", icon: "text" },
        { label: "Họ và tên lót", field: "last_name", icon: "text" },
        { label: "Tên đăng nhập", field: "username", icon: "account" },
        { label: "Mật khẩu", field: "password", icon: "eye", secureTextEntry: true },
        { label: "Xác nhận mật khẩu", field: "confirm", icon: "eye", secureTextEntry: true }
    ];

    const picker = async () => {
        const {granted} = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (granted) {
            const res = await ImagePicker.launchImageLibraryAsync();
            if (!res.canceled)
                setUser({...user, "avatar": res.assets[0]});
        } else
            Alert.alert("Cần cấp quyền truy cập ảnh!");
    }

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

    const register = async () => {
        if (validate()) {
            setLoading(true);
            try {
                let form = new FormData();

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

                let res = await Apis.post(endpoints['register'], form, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                if (res.status === 201) {
                    if (user.role === 'CHEF') {
                        Alert.alert("Đăng ký thành công", "Tài khoản ĐẦU BẾP của bạn đang chờ Admin phê duyệt. Vui lòng quay lại sau!");
                    } else {
                        Alert.alert("Thành công", "Đăng ký thành công! Vui lòng đăng nhập.");
                    }
                    nav.navigate('Login');
                } else {
                    setErrMsg("Đăng ký thất bại. Vui lòng thử lại!");
                }
            } catch (ex) {
                console.error(ex);
                setErrMsg("Lỗi hệ thống hoặc tên đăng nhập đã tồn tại!");
            } finally {
                setLoading(false);
            }
        }
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>ĐĂNG KÝ TÀI KHOẢN</Text>

                {errMsg !== "" && (
                    <HelperText type="error" visible={true}>{errMsg}</HelperText>
                )}

                {info.map(i => (
                    <TextInput 
                        key={i.field} 
                        style={styles.input}
                        label={i.label}
                        secureTextEntry={i.secureTextEntry}
                        mode="outlined"
                        right={<TextInput.Icon icon={i.icon} />}
                        value={user[i.field]}
                        onChangeText={t => setUser({ ...user, [i.field]: t })} 
                    />
                ))}

                <View style={styles.roleContainer}>
                    <Text style={styles.roleLabel}>Bạn đăng ký với vai trò:</Text>
                    <RadioButton.Group onValueChange={value => setUser({ ...user, role: value })} value={user.role}>
                        <View style={styles.radioGroup}>
                            <View style={styles.radioItem}>
                                <RadioButton value="CUSTOMER" color="#2196f3" />
                                <Text>Khách hàng</Text>
                            </View>
                            <View style={styles.radioItem}>
                                <RadioButton value="CHEF" color="#ff9800" />
                                <Text>Đầu bếp</Text>
                            </View>
                        </View>
                    </RadioButton.Group>
                    {user.role === 'CHEF' && (
                        <HelperText type="info" visible={true} style={styles.helperText}>
                            * Tài khoản Đầu bếp cần Admin duyệt mới có thể đăng nhập.
                        </HelperText>
                    )}
                </View>

                <TouchableOpacity style={styles.avatarPicker} onPress={picker}>
                    <Button icon="camera" mode="text">Chọn ảnh đại diện</Button>
                </TouchableOpacity>    

                {user.avatar && (
                    <View style={styles.avatarContainer}>
                        <Image source={{ uri: user.avatar.uri }} style={styles.avatarImage} />
                    </View>
                )}

                {loading ? (
                    <ActivityIndicator size="large" color="blue" />
                ) : (
                    <Button mode="contained" onPress={register} style={styles.btnRegister}>
                        Đăng ký
                    </Button>
                )}
                
                <TouchableOpacity onPress={() => nav.navigate("Login")}>
                    <Text style={styles.loginLink}>Đã có tài khoản? Đăng nhập</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

export default Register;