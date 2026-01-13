import React, { useState, useContext, useCallback } from "react";
import { View, Text, Image, FlatList, Alert, RefreshControl, StyleSheet } from "react-native";
import { FAB, ActivityIndicator, IconButton } from "react-native-paper";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import MyStyles from "../../styles/MyStyles";
import Apis, { authApi, endpoints } from "../../utils/Apis";
import { MyUserContext } from "../../utils/MyContexts"; 

const MyDishes = () => {
    const [dishes, setDishes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [user] = useContext(MyUserContext);
    const navigation = useNavigation();

    const loadMyDishes = async () => {
        if (!user || !user.id) return;
        setLoading(true);
        try {
            let res = await Apis.get(`${endpoints['dishes']}?chef_id=${user.id}`);
            setDishes(res.data.results);
        } catch (ex) {
            console.error(ex);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadMyDishes();
        }, [])
    );

    const deleteDish = async (dishId) => {
        try {
            const token = await AsyncStorage.getItem("token"); // Lấy token thật
            await authApi(token).delete(`${endpoints['dishes']}${dishId}/`);
            Alert.alert("Thành công", "Đã xóa món ăn!");
            loadMyDishes(); 
        } catch (ex) {
            console.error(ex);
            Alert.alert("Lỗi", "Không thể xóa món ăn này.");
        }
    }

    const confirmDelete = (dishId) => {
        Alert.alert(
            "Xác nhận xóa",
            "Bạn có chắc chắn muốn xóa món này không?",
            [
                { text: "Hủy", style: "cancel" },
                { text: "Xóa", onPress: () => deleteDish(dishId), style: "destructive" }
            ]
        );
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.price}>{item.price.toLocaleString("vi-VN")} VNĐ</Text>
                <Text style={[styles.status, { color: item.active ? 'green' : 'red' }]}>
                    {item.active ? "Đang bán" : "Đã ẩn"}
                </Text>
            </View>
            <View style={styles.actions}>
                <IconButton 
                    icon="pencil" 
                    iconColor="blue" 
                    size={20} 
                    onPress={() => navigation.navigate("DishForm", { dishId: item.id })} 
                />
                <IconButton 
                    icon="delete" 
                    iconColor="red" 
                    size={20} 
                    onPress={() => confirmDelete(item.id)} 
                />
            </View>
        </View>
    );

    return (
        <View style={[MyStyles.container, { backgroundColor: '#f5f5f5' }]}>
            
            {/* --- THANH HEADER TÙY CHỈNH --- */}
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: 'white', elevation: 2 }}>
                <IconButton icon="arrow-left" onPress={() => navigation.goBack()} size={24} />
                <Text style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 10 }}>QUẢN LÝ THỰC ĐƠN</Text>
            </View>
            {/* ----------------------------- */}

            {loading && <ActivityIndicator size="large" color="orange" style={{marginTop: 20}} />}

            <FlatList 
                data={dishes}
                keyExtractor={item => item.id.toString()}
                renderItem={renderItem}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={loadMyDishes} />}
                ListEmptyComponent={!loading && <Text style={{textAlign: 'center', marginTop: 20}}>Bạn chưa đăng món ăn nào.</Text>}
                contentContainerStyle={{ paddingBottom: 80 }}
            />

            <FAB
                icon="plus"
                style={styles.fab}
                onPress={() => navigation.navigate("DishForm")}
                label="Thêm món"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    card: { flexDirection: 'row', backgroundColor: '#fff', marginHorizontal: 10, marginTop: 10, padding: 10, borderRadius: 8, elevation: 2 },
    image: { width: 80, height: 80, borderRadius: 8 },
    info: { flex: 1, marginLeft: 10, justifyContent: 'center' },
    name: { fontSize: 16, fontWeight: 'bold' },
    price: { color: '#d32f2f', fontWeight: 'bold' },
    status: { fontSize: 12, fontStyle: 'italic', marginTop: 4 },
    actions: { justifyContent: 'center', alignItems: 'center' },
    fab: { position: 'absolute', margin: 16, right: 0, bottom: 0, backgroundColor: 'orange' },
});

export default MyDishes;