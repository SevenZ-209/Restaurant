import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import 'moment/locale/vi';
import Apis, { endpoints } from "../utils/Apis";
import MyStyles from "../styles/MyStyles";

const Dishes = ({ cateId, keyword, ordering }) => {
    const [dishes, setDishes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const navigation = useNavigation();

    // --- EFFECT 1: RESET DỮ LIỆU ---
    // Chỉ chạy khi thay đổi bộ lọc (Danh mục, Tìm kiếm, Sắp xếp).
    // KHÔNG ĐƯỢC để 'page' vào đây, nếu không sẽ bị loop hoặc không load được trang 2.
    useEffect(() => {
        setPage(1);
        setDishes([]); 
    }, [cateId, keyword, ordering]);

    // --- EFFECT 2: TẢI DỮ LIỆU ---
    // Chạy khi 'page' thay đổi HOẶC các bộ lọc thay đổi.
    useEffect(() => {
        const loadDishes = async () => {
            if (page > 0) {
                setLoading(true);
                try {
                    // 1. Tạo URL
                    let url = `${endpoints['dishes']}?page=${page}`;
                    
                    if (keyword) url += `&q=${keyword}`;
                    if (cateId) url += `&category_id=${cateId}`;
                    // QUAN TRỌNG: Phải cộng tham số ordering vào đây
                    if (ordering) url += `&ordering=${ordering}`;

                    console.info("Fetching URL:", url);

                    // 2. Gọi API
                    let res = await Apis.get(url);

                    // 3. Cập nhật State
                    if (page === 1) {
                        setDishes(res.data.results);
                    } else {
                        setDishes(current => [...current, ...res.data.results]);
                    }

                    // Nếu hết trang thì setPage(0) để ngừng loadMore
                    if (res.data.next === null) setPage(0);

                } catch (ex) {
                    // Xử lý lỗi 404 khi hết trang
                    if (ex.response && ex.response.status === 404) {
                        setPage(0);
                    } else {
                        console.error("Lỗi tải món:", ex);
                    }
                } finally {
                    setLoading(false);
                }
            }
        }
        loadDishes();
    }, [cateId, keyword, ordering, page]); // <--- Phải có đủ 4 biến này trong dependency

    const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        return layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
    };

    const loadMore = ({ nativeEvent }) => {
        if (!loading && page > 0 && isCloseToBottom(nativeEvent)) {
            setPage(page + 1);
        }
    };

    return (
        <ScrollView 
            onScroll={loadMore}
            scrollEventThrottle={16}
            refreshControl={
                <RefreshControl refreshing={loading && page === 1} onRefresh={() => setPage(1)} />
            }
            contentContainerStyle={{ flexGrow: 1 }}
        >
            <View style={{ paddingBottom: 20 }}>
                {dishes.length === 0 && !loading && (
                    <Text style={{ textAlign: 'center', marginTop: 20, fontSize: 16 }}>Không tìm thấy món ăn nào.</Text>
                )}

                {dishes.map(d => (
                    <TouchableOpacity key={d.id} onPress={() => navigation.navigate("DishDetail", { dishId: d.id })}>
                        <View style={styles.dishContainer}>
                            {d.image && (
                                <Image source={{ uri: d.image }} style={styles.dishImage} />
                            )}
                            <View style={styles.dishInfo}>
                                <Text style={MyStyles.subject} numberOfLines={2}>{d.name}</Text>
                                <Text style={styles.dateText}>
                                    {moment(d.created_date).fromNow()}
                                </Text>
                                <Text style={styles.priceText}>
                                    {d.price.toLocaleString("vi-VN")} VNĐ
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
            
            {loading && page > 1 && <ActivityIndicator size="large" color="blue" style={{ margin: 20 }} />}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    dishContainer: { flexDirection: 'row', padding: 10, marginHorizontal: 10, marginBottom: 10, backgroundColor: '#fff', borderRadius: 8, elevation: 2 },
    dishImage: { width: 100, height: 100, borderRadius: 8 },
    dishInfo: { marginLeft: 10, flex: 1, justifyContent: 'space-between' },
    dateText: { fontSize: 12, color: "gray", fontStyle: "italic" },
    priceText: { fontWeight: "bold", color: "#d32f2f", fontSize: 16, marginTop: 5 }
});

export default Dishes;