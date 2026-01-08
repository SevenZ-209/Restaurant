import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import AuthStyle from "./AuthStyle";
import { TextInput, ActivityIndicator } from "react-native-paper";
import { useContext, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MyUserContext } from "../../utils/MyContexts";

const SignUp = () => {
    const [user, setUser] = useState({});
    const [errMsg, setErrMsg] = useState();
    const [loading, setLoading] = useState(false);
    const [focusedField, setFocusedField] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [hoveredButton, setHoveredButton] = useState(null);
    const nav = useNavigation();
    const [, dispatch] = useContext(MyUserContext);

    const API_BASE_URL = 'http://127.0.0.1:8000/api';

    const validate = () => {
        if (!user.email) {
            setErrMsg("Please enter email!");
            return false;
        }
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
        if (user.password !== user.confirmPassword) {
            setErrMsg("Passwords do not match!");
            return false;
        }
        if (!user.firstName) {
            setErrMsg("Please enter full name!");
            return false;
        }

        setErrMsg(null);
        return true;
    }

    const signup = async () => {
        if (validate()) {
            try {
                setLoading(true);
                
                let res = await axios.post(`${API_BASE_URL}/auth/register/`, {
                    email: user.email,
                    username: user.username,
                    password: user.password,
                    first_name: user.firstName,
                    phone: user.phone || ''
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
                        setErrMsg("Account created but failed to fetch user info!");
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
                    <Text style={AuthStyle.title}>Create an account</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 24 }}>
                        <Text style={AuthStyle.subtitle}>Already have on account? </Text>
                        <TouchableOpacity 
                            onPress={() => nav.navigate('Login')}
                            onMouseEnter={() => setHoveredButton('login')}
                            onMouseLeave={() => setHoveredButton(null)}
                        >
                            <Text style={{ 
                                fontSize: 13, 
                                color: '#0066CC', 
                                fontWeight: '600',
                                opacity: hoveredButton === 'login' ? 0.7 : 1
                            }}>Log in</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Error Message */}
                    {errMsg && (
                        <Text style={AuthStyle.errorText}>{errMsg}</Text>
                    )}

                    {/* Full Name Field */}
                    <View style={AuthStyle.formGroup}>
                        <Text style={AuthStyle.inputLabel}>What should we call you?</Text>
                        <TextInput
                            style={[
                                AuthStyle.input,
                                focusedField === 'firstName' && AuthStyle.inputFocused
                            ]}
                            placeholder="Enter your profile name"
                            placeholderTextColor="#AAAAAA"
                            value={user.firstName || ''}
                            onChangeText={(text) => setUser({...user, firstName: text})}
                            onFocus={() => setFocusedField('firstName')}
                            onBlur={() => setFocusedField(null)}
                        />
                    </View>

                    {/* Email Field */}
                    <View style={AuthStyle.formGroup}>
                        <Text style={AuthStyle.inputLabel}>What's your email?</Text>
                        <TextInput
                            style={[
                                AuthStyle.input,
                                focusedField === 'email' && AuthStyle.inputFocused
                            ]}
                            placeholder="Enter your email address"
                            placeholderTextColor="#AAAAAA"
                            value={user.email || ''}
                            onChangeText={(text) => setUser({...user, email: text})}
                            onFocus={() => setFocusedField('email')}
                            onBlur={() => setFocusedField(null)}
                            keyboardType="email-address"
                        />
                    </View>

                    {/* Username Field */}
                    <View style={AuthStyle.formGroup}>
                        <Text style={AuthStyle.inputLabel}>Username</Text>
                        <TextInput
                            style={[
                                AuthStyle.input,
                                focusedField === 'username' && AuthStyle.inputFocused
                            ]}
                            placeholder="Choose a username"
                            placeholderTextColor="#AAAAAA"
                            value={user.username || ''}
                            onChangeText={(text) => setUser({...user, username: text})}
                            onFocus={() => setFocusedField('username')}
                            onBlur={() => setFocusedField(null)}
                        />
                    </View>

                    {/* Password Field */}
                    <View style={AuthStyle.formGroup}>
                        <Text style={AuthStyle.inputLabel}>Create a password</Text>
                        <TextInput
                            style={[
                                AuthStyle.input,
                                focusedField === 'password' && AuthStyle.inputFocused
                            ]}
                            placeholder="Create a password"
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
                        <Text style={AuthStyle.helpText}>Use 8 or more characters with a mix of letters, numbers & symbols</Text>
                    </View>

                    {/* Confirm Password Field */}
                    <View style={AuthStyle.formGroup}>
                        <Text style={AuthStyle.inputLabel}>Confirm password</Text>
                        <TextInput
                            style={[
                                AuthStyle.input,
                                focusedField === 'confirmPassword' && AuthStyle.inputFocused
                            ]}
                            placeholder="Confirm your password"
                            placeholderTextColor="#AAAAAA"
                            secureTextEntry={!showConfirmPassword}
                            value={user.confirmPassword || ''}
                            onChangeText={(text) => setUser({...user, confirmPassword: text})}
                            onFocus={() => setFocusedField('confirmPassword')}
                            onBlur={() => setFocusedField(null)}
                            right={
                                <TextInput.Icon 
                                    icon={showConfirmPassword ? "eye" : "eye-off"} 
                                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                />
                            }
                        />
                    </View>

                    {/* Phone Field (Optional) */}
                    <View style={AuthStyle.formGroup}>
                        <Text style={AuthStyle.inputLabel}>Phone (Optional)</Text>
                        <TextInput
                            style={[
                                AuthStyle.input,
                                focusedField === 'phone' && AuthStyle.inputFocused
                            ]}
                            placeholder="Your phone number"
                            placeholderTextColor="#AAAAAA"
                            value={user.phone || ''}
                            onChangeText={(text) => setUser({...user, phone: text})}
                            onFocus={() => setFocusedField('phone')}
                            onBlur={() => setFocusedField(null)}
                            keyboardType="phone-pad"
                        />
                    </View>

                    {/* Sign Up Button */}
                    <TouchableOpacity
                        style={[
                            AuthStyle.button,
                            !loading && AuthStyle.buttonActive,
                            loading && AuthStyle.buttonDisabled,
                            hoveredButton === 'signup' && { opacity: 0.85 }
                        ]}
                        onPress={signup}
                        disabled={loading}
                        onMouseEnter={() => setHoveredButton('signup')}
                        onMouseLeave={() => setHoveredButton(null)}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text style={AuthStyle.buttonText}>Create an account</Text>
                        )}
                    </TouchableOpacity>

                    {/* Terms */}
                    <Text style={{ fontSize: 12, color: '#666666', marginTop: 16, textAlign: 'center' }}>
                        WELCOME
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}

export default SignUp;
