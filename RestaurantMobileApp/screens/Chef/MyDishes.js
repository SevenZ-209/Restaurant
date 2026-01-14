import React, { useState, useContext, useCallback } from "react";
import { View, Text, Image, FlatList, Alert, RefreshControl } from "react-native";
import { FAB, ActivityIndicator, IconButton } from "react-native-paper";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Apis, { authApi, endpoints } from "../../utils/Apis";
import { MyUserContext } from "../../utils/MyContexts"; 
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from './MyDishesStyles';

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
            const token = await AsyncStorage.getItem("token");
            console.log("Delete URL:", endpoints['dish-detail'](dishId));
            await authApi(token).delete(endpoints['dish-detail'](dishId));
            
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
                <Text style={[styles.status, item.active ? styles.statusActive : styles.statusInactive]}>
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
        <View style={styles.container}>

            <View style={styles.header}>
                <IconButton icon="arrow-left" onPress={() => navigation.goBack()} size={24} />
                <Text style={styles.headerTitle}>QUẢN LÝ THỰC ĐƠN</Text>
            </View>

            {loading && <ActivityIndicator size="large" color="orange" style={styles.loading} />}

            <FlatList 
                data={dishes}
                keyExtractor={item => item.id.toString()}
                renderItem={renderItem}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={loadMyDishes} />}
                ListEmptyComponent={!loading && <Text style={styles.emptyText}>Bạn chưa đăng món ăn nào.</Text>}
                contentContainerStyle={styles.listContent}
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

export default MyDishes;