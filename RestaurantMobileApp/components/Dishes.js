import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import 'moment/locale/vi';
import Apis, { endpoints } from "../utils/Apis";
import MyStyles from "../styles/MyStyles";

const Dishes = ({ cateId, keyword }) => {
    const [dishes, setDishes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const navigation = useNavigation();

    useEffect(() => {
        setPage(1);
        setDishes([]);
    }, [cateId, keyword]);

    useEffect(() => {
        const loadDishes = async () => {
            if (page > 0) {
                setLoading(true);
                try {
                    let url = `${endpoints['dishes']}?page=${page}`;
                    
                    if (keyword) url += `&q=${keyword}`;
                    if (cateId) url += `&category_id=${cateId}`;

                    console.info("Dishes URL:", url);

                    let res = await Apis.get(url);

                    if (page === 1)
                        setDishes(res.data.results);
                    else
                        setDishes(current => [...current, ...res.data.results]);

                    if (res.data.next === null)
                        setPage(0);

                } catch (ex) {
                    if (ex.response && ex.response.status === 404) {
                        setPage(0); 
                    } else {
                        console.error(ex);
                    }
                } finally {
                    setLoading(false);
                }
            }
        }
        loadDishes();
    }, [cateId, keyword, page]);

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
        >
            <View style={{ paddingBottom: 20 }}>
                {dishes.length === 0 && !loading && (
                    <Text style={{ textAlign: 'center', marginTop: 20 }}>Không tìm thấy món ăn nào.</Text>
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