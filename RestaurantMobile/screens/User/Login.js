import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import AuthStyle from "./AuthStyle";
import { TextInput, ActivityIndicator } from "react-native-paper";
import { useContext, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MyUserContext } from "../../utils/MyContexts";

const Login = ({ route }) => {
    const [user, setUser] = useState({});
    const [errMsg, setErrMsg] = useState();
    const [loading, setLoading] = useState(false);
    const [focusedField, setFocusedField] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [hoveredButton, setHoveredButton] = useState(null);
    const nav = useNavigation();
    const [, dispatch] = useContext(MyUserContext);

    const API_BASE_URL = 'http://127.0.0.1:8000/api';

    const validate = () => {
        if (!user.username) {
            setErrMsg("Please enter username!");
            return false;
        }
        if (!user.password) {
            setErrMsg("Please enter password!");
            return false;
        }
        if (user.password.length < 4) {
            setErrMsg("Password must be at least 4 characters!");
            return false;
        }

        setErrMsg(null);
        return true;
    }

    const login = async () => {
        if (validate()) {
            try {
                setLoading(true);
                
                let res = await axios.post(`${API_BASE_URL}/auth/login/`, {
                    username: user.username,
                    password: user.password
                });
                
                console.info(res.data);
                await AsyncStorage.setItem("token", res.data.access_token || res.data.token);

                setTimeout(async () => {
                    try {
                        let userRes = await axios.get(`${API_BASE_URL}/auth/me/`, {
                            headers: {
                                'Authorization': `Bearer ${res.data.access_token || res.data.token}`
                            }
                        });
                        
                        console.info(userRes.data);

                        dispatch({
                            "type": "login",
                            "payload": userRes.data
                        });

                        nav.navigate('HomeTab');
                    } catch (ex) {
                        setErrMsg("Login successful but failed to fetch user info!");
                        console.info(ex);
                    }
                }, 500);
                
            } catch (ex) {
                setErrMsg(ex.response?.data?.detail || "An error occurred. Please try again!");
                console.info(ex);
            } finally {
                setLoading(false);
            }
        }
    }

    return (
        <View style={AuthStyle.container}>
            <ScrollView 
                contentContainerStyle={AuthStyle.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={AuthStyle.wrapper}>
                    {/* Back Button */}
                    <TouchableOpacity 
                        style={{ 
                            marginBottom: 24,
                            opacity: hoveredButton === 'back' ? 0.6 : 1
                        }}
                        onPress={() => nav.goBack()}
                        onMouseEnter={() => setHoveredButton('back')}
                        onMouseLeave={() => setHoveredButton(null)}
                    >
                        <Text style={{ fontSize: 24 }}>←</Text>
                    </TouchableOpacity>

                    {/* Title */}
                    <Text style={AuthStyle.title}>Sign in</Text>
                    <Text style={AuthStyle.subtitle}>Enter your credentials to access your account</Text>

                    {errMsg && (
                        <Text style={AuthStyle.errorText}>{errMsg}</Text>
                    )}

                    <View style={AuthStyle.formGroup}>
                        <Text style={AuthStyle.inputLabel}>Username or Email</Text>
                        <TextInput
                            style={[
                                AuthStyle.input,
                                focusedField === 'username' && AuthStyle.inputFocused
                            ]}
                            placeholder="Enter your username"
                            placeholderTextColor="#AAAAAA"
                            value={user.username || ''}
                            onChangeText={(text) => setUser({...user, username: text})}
                            onFocus={() => setFocusedField('username')}
                            onBlur={() => setFocusedField(null)}
                        />
                    </View>

                    <View style={AuthStyle.formGroup}>
                        <Text style={AuthStyle.inputLabel}>Your password</Text>
                        <TextInput
                            style={[
                                AuthStyle.input,
                                focusedField === 'password' && AuthStyle.inputFocused
                            ]}
                            placeholder="Enter your password"
                            placeholderTextColor="#AAAAAA"
                            secureTextEntry={!showPassword}
                            value={user.password || ''}
                            onChangeText={(text) => setUser({...user, password: text})}
                            onFocus={() => setFocusedField('password')}
                            onBlur={() => setFocusedField(null)}
                            right={
                                <TextInput.Icon 
                                    icon={showPassword ? "eye" : "eye-off"} 
                                    onPress={() => setShowPassword(!showPassword)}
                                />
                            }
                        />
                    </View>
                    <TouchableOpacity
                        style={[
                            AuthStyle.button,
                            !loading && AuthStyle.buttonActive,
                            loading && AuthStyle.buttonDisabled,
                            hoveredButton === 'login' && { opacity: 0.85 }
                        ]}
                        onPress={login}
                        disabled={loading}
                        onMouseEnter={() => setHoveredButton('login')}
                        onMouseLeave={() => setHoveredButton(null)}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text style={AuthStyle.buttonText}>Log in</Text>
                        )}
                    </TouchableOpacity>     
                    <View style={AuthStyle.newUserSection}>
                        <Text style={AuthStyle.newUserText}>New to our community</Text>
                        <TouchableOpacity 
                            style={[
                                AuthStyle.createAccountButton,
                                hoveredButton === 'signup' && { opacity: 0.8 }
                            ]}
                            onPress={() => nav.navigate('SignUp')}
                            onMouseEnter={() => setHoveredButton('signup')}
                            onMouseLeave={() => setHoveredButton(null)}
                        >
                            <Text style={AuthStyle.createAccountButtonText}>Create an account</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

export default Login;
