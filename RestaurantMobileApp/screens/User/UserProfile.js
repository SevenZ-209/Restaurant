import React, { useContext } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import { Button, Avatar, List, Divider } from "react-native-paper"; 
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { MyUserContext } from "../../utils/MyContexts"; 

import styles from './UserProfileStyles';

const UserProfile = () => {
    const [user, dispatch] = useContext(MyUserContext);
    const navigation = useNavigation();

    const logout = async () => {
        try {
            await AsyncStorage.removeItem("token");
            dispatch({ "type": "logout" });
            navigation.navigate("Login"); 
        } catch (error) {
            console.error("Lỗi đăng xuất:", error);
        }
    }

    if (user === null) {
        return (
            <View style={styles.guestContainer}>
                <Avatar.Icon size={80} icon="account-circle-outline" style={styles.guestAvatar} />
                <Text style={styles.guestTitle}>Chào Khách!</Text>
                <Text style={styles.guestText}>
                    Vui lòng đăng nhập để quản lý tài khoản và xem lịch sử đơn hàng.
                </Text>
                <Button mode="contained" onPress={() => navigation.navigate("Login")} style={styles.guestButtonLogin}>
                    Đăng nhập
                </Button>
                <Button mode="outlined" onPress={() => navigation.navigate("Register")} style={styles.guestButtonRegister}>
                    Đăng ký tài khoản
                </Button>
            </View>
        );
    }

    const roleLabel = user.role === 'ADMIN' ? "Quản trị viên" : (user.role === 'CHEF' ? "Đầu bếp (Chef)" : "Khách hàng");
    const roleColor = user.role === 'ADMIN' ? "#2e7d32" : (user.role === 'CHEF' ? "#1976d2" : "#555");
    const roleBg = user.role === 'ADMIN' ? "#e8f5e9" : (user.role === 'CHEF' ? "#e3f2fd" : "#f5f5f5");

    return (
        <ScrollView contentContainerStyle={styles.scrollContent}>

            {user.avatar ? (
                <Avatar.Image size={100} source={{ uri: user.avatar }} style={styles.avatar} />
            ) : (
                <Avatar.Text size={100} label={user.first_name ? user.first_name[0].toUpperCase() : "U"} style={styles.avatarPlaceholder} />
            )}
            
            <Text style={styles.nameText}>{user.first_name} {user.last_name}</Text>
            <Text style={styles.usernameText}>@{user.username}</Text>

            <View style={[styles.roleContainer, { backgroundColor: roleBg }]}>
                <Text style={[styles.roleText, { color: roleColor }]}>
                    {roleLabel}
                </Text>
            </View>
            
            <View style={styles.menuWrapper}>

                {user.role === 'ADMIN' && (
                    <List.Section style={styles.menuSection}>
                        <List.Subheader style={styles.menuHeaderAdmin}>Bảng điều khiển Admin</List.Subheader>
                        
                        <List.Item
                            title="Báo cáo hệ thống"
                            description="Doanh thu tổng, tần suất đặt bàn"
                            left={p => <List.Icon {...p} icon="view-dashboard" color="#2e7d32" />}
                            onPress={() => navigation.navigate("AdminStats")}
                            style={styles.menuItem}
                        />
                        <Divider />
                        
                    </List.Section>
                )}

                {user.role === 'CHEF' && (
                    <>
                        <Button 
                            mode="contained" icon="silverware-fork-knife" 
                            style={styles.chefButton}
                            contentStyle={styles.chefButtonContent}
                            onPress={() => navigation.navigate("MyDishes")}
                        >
                            Quản lý thực đơn
                        </Button>

                        <List.Section style={styles.menuSection}>
                            <List.Subheader>Quản lý</List.Subheader>
                            
                            <List.Item
                                title="Khu vực Nhà bếp"
                                description="Đơn hàng đang chờ chế biến"
                                left={p => <List.Icon {...p} icon="chef-hat" color="#555" />}
                                onPress={() => navigation.navigate("ChefOrders")}
                                style={styles.menuItem}
                            />
                            <Divider />

                            <List.Item
                                title="Thống kê doanh thu"
                                description="Báo cáo hiệu quả kinh doanh"
                                left={p => <List.Icon {...p} icon="chart-bar" color="#1976d2" />}
                                onPress={() => navigation.navigate("ChefStats")}
                                style={styles.menuItem}
                            />
                        </List.Section>
                    </>
                )}

                <List.Section style={styles.menuSection}>
                    <List.Subheader>Cá nhân</List.Subheader>
                    
                    <List.Item
                        title="Lịch sử đơn hàng"
                        description="Xem lại các món đã đặt"
                        left={props => <List.Icon {...props} icon="history" color="#4caf50" />}
                        onPress={() => navigation.navigate("OrderHistory")}
                        style={styles.menuItem}
                    />
                    <Divider />
                    
                    <List.Item
                        title="Đăng xuất"
                        left={props => <List.Icon {...props} icon="logout" color="red" />}
                        onPress={logout}
                        titleStyle={{ color: 'red' }}
                        style={styles.menuItem}
                    />
                </List.Section>

            </View>
        </ScrollView>
    );
}

export default UserProfile;