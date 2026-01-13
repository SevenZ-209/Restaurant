import React, { useContext, useEffect, useState } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity, Alert, StyleSheet, useWindowDimensions } from "react-native";
import { Button, Card, TextInput, Avatar, Divider, IconButton, ActivityIndicator } from "react-native-paper";
import RenderHTML from "react-native-render-html";
import moment from "moment";
import 'moment/locale/vi'; // Import tiếng Việt cho moment
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import MyStyles from "../../styles/MyStyles";
import Apis, { authApi, endpoints } from "../../utils/Apis";
import { MyUserContext } from "../../utils/MyContexts"; 

// Thiết lập ngôn ngữ tiếng Việt cho thời gian
moment.locale('vi');

const DishDetail = () => {
    const route = useRoute();
    const { dishId } = route.params;
    const { width } = useWindowDimensions();
    const navigation = useNavigation();

    // Lấy thông tin user từ Context
    const [user, ] = useContext(MyUserContext);

    const [dish, setDish] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [content, setContent] = useState("");
    const [rating, setRating] = useState(5); // Mặc định 5 sao (Number)
    const [loading, setLoading] = useState(false);

    // --- 1. Load chi tiết món ăn ---
    useEffect(() => {
        const loadDish = async () => {
            try {
                let res = await Apis.get(endpoints['dish-details'](dishId));
                setDish(res.data);
            } catch (ex) {
                console.error("Lỗi load món:", ex);
            }
        }
        loadDish();
    }, [dishId]);

    // --- 2. Load danh sách đánh giá ---
    const loadReviews = async () => {
        try {
            // Dùng endpoint 'dish-reviews' (GET /dishes/{id}/reviews/)
            let res = await Apis.get(endpoints['dish-reviews'](dishId));
            setReviews(res.data);
        } catch (ex) {
            console.error("Lỗi load review:", ex);
        }
    }

    useEffect(() => {
        loadReviews();
    }, [dishId]);

    // --- 3. Xử lý Thêm mới hoặc Cập nhật (PATCH/POST) ---
    const addReview = async () => {
        if (!content.trim()) {
            Alert.alert("Thông báo", "Vui lòng nhập nội dung đánh giá!");
            return;
        }

        setLoading(true);
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                Alert.alert("Lỗi", "Vui lòng đăng nhập để đánh giá!");
                return;
            }

            // Kiểm tra xem user hiện tại đã có đánh giá trong list chưa
            const myExistingReview = reviews.find(r => r.user.id === user.id);

            if (myExistingReview) {
                // --> CẬP NHẬT (PATCH)
                await authApi(token).patch(endpoints['dish-reviews'](dishId), {
                    content: content,
                    rating: parseInt(rating),
                });
                Alert.alert("Thành công", "Đánh giá đã được cập nhật!");
            } else {
                // --> THÊM MỚI (POST)
                await authApi(token).post(endpoints['dish-reviews'](dishId), {
                    content: content,
                    rating: parseInt(rating),
                });
                Alert.alert("Thành công", "Cảm ơn bạn đã đánh giá!");
            }

            // Load lại danh sách và reset form
            await loadReviews();
            setContent("");
            setRating(5);

        } catch (ex) {
            console.error(ex);
            Alert.alert("Lỗi", "Có lỗi xảy ra, vui lòng thử lại!");
        } finally {
            setLoading(false);
        }
    }

    // --- 4. Xử lý Xóa đánh giá ---
    const deleteReview = (reviewId) => {
        Alert.alert(
            "Xác nhận",
            "Bạn có chắc chắn muốn xóa đánh giá này?",
            [
                { text: "Hủy", style: "cancel" },
                {
                    text: "Xóa",
                    onPress: async () => {
                        try {
                            const token = await AsyncStorage.getItem("token");
                            await authApi(token).delete(endpoints['delete-review'](reviewId));
                            loadReviews(); // Load lại sau khi xóa
                            // Reset form nếu đang sửa cái bị xóa
                            setContent("");
                            setRating(5);
                        } catch (ex) {
                            console.error(ex);
                            Alert.alert("Lỗi", "Không thể xóa đánh giá này.");
                        }
                    }
                }
            ]
        );
    }

    // --- 5. Đổ dữ liệu lên form để sửa ---
    const startEdit = (review) => {
        setContent(review.content);
        setRating(review.rating);
        // Cuộn lên trên cùng (tuỳ chọn)
        Alert.alert("Chỉnh sửa", "Nội dung cũ đã được điền. Hãy thay đổi và bấm Gửi.");
    }

    // --- COMPONENT CON: Hàng Sao (Rating Bar) ---
    const RatingBar = ({ currentRating, onSelect, readOnly = false, size = 40 }) => {
        return (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                {!readOnly && <Text style={{ fontSize: 16, marginRight: 10 }}>Đánh giá:</Text>}
                {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity 
                        key={star} 
                        disabled={readOnly}
                        onPress={() => onSelect && onSelect(star)}
                    >
                        <Avatar.Icon
                            size={size}
                            icon="star"
                            style={{ backgroundColor: "transparent", margin: readOnly ? -2 : -5 }}
                            color={star <= currentRating ? "#FFD700" : "#DDDDDD"} // Vàng / Xám
                        />
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    if (!dish) return <View style={MyStyles.container}><ActivityIndicator size="large" color="orange" /></View>;

    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                {/* --- PHẦN 1: CHI TIẾT MÓN ĂN --- */}
                <Image source={{ uri: dish.image }} style={{ width: "100%", height: 250 }} />
                
                <View style={MyStyles.padding}>
                    <Text style={MyStyles.subject}>{dish.name}</Text>
                    <Text style={{ fontSize: 20, fontWeight: "bold", color: "red", marginVertical: 5 }}>
                        {dish.price.toLocaleString("vi-VN")} VNĐ
                    </Text>
                    
                    {dish.ingredients ? (
                        <>
                            <Text style={{ fontWeight: 'bold', marginTop: 5 }}>Nguyên liệu:</Text>
                            <Text style={{ marginBottom: 10, fontStyle: "italic" }}>{dish.ingredients}</Text>
                        </>
                    ) : null}

                    <Text style={{ fontWeight: 'bold' }}>Mô tả:</Text>
                    <RenderHTML contentWidth={width} source={{ html: dish.description }} />
                </View>

                <Divider style={{ marginVertical: 10, height: 6, backgroundColor: '#f0f0f0' }} />

                {/* --- PHẦN 2: KHU VỰC ĐÁNH GIÁ --- */}
                <View style={MyStyles.padding}>
                    <Text style={MyStyles.title}>Đánh giá & Nhận xét</Text>
                    
                    {/* FORM NHẬP (Chỉ hiện khi đã Login) */}
                    {user ? (
                        <View style={styles.inputContainer}>
                            {/* Chọn sao */}
                            <RatingBar currentRating={rating} onSelect={setRating} />
                            
                            {/* Ô nhập text */}
                            <TextInput 
                                mode="outlined" 
                                label="Chia sẻ cảm nhận của bạn..." 
                                value={content} 
                                onChangeText={setContent} 
                                multiline
                                numberOfLines={3}
                                style={{ marginTop: 10, backgroundColor: 'white' }}
                            />
                            
                            {/* Nút gửi */}
                            <Button 
                                mode="contained" 
                                onPress={addReview} 
                                loading={loading} 
                                icon="send"
                                style={{ marginTop: 10, alignSelf: "flex-end" }}
                            >
                                Gửi đánh giá
                            </Button>
                        </View>
                    ) : (
                        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                            <Text style={{ color: "blue", textAlign: "center", marginVertical: 15, padding: 10, backgroundColor: '#e3f2fd', borderRadius: 8 }}>
                                Bạn cần đăng nhập để viết đánh giá!
                            </Text>
                        </TouchableOpacity>
                    )}

                    {/* DANH SÁCH REVIEW */}
                    {reviews.map(r => (
                        <Card key={r.id} style={{ marginBottom: 15, backgroundColor: '#fafafa' }}>
                            <Card.Content>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View style={{ flexDirection: 'row', flex: 1 }}>
                                        <Avatar.Image size={40} source={{ uri: r.user.avatar || "https://via.placeholder.com/150" }} />
                                        <View style={{ marginLeft: 10 }}>
                                            <Text style={{ fontWeight: 'bold' }}>{r.user.username}</Text>
                                            <Text style={{ fontSize: 12, color: 'gray' }}>
                                                {moment(r.created_date).fromNow()}
                                            </Text>
                                            {/* Hiển thị sao nhỏ trong từng review */}
                                            <RatingBar currentRating={r.rating} readOnly={true} size={20} />
                                        </View>
                                    </View>

                                    {/* Nút Sửa/Xóa (Chỉ hiện nếu là bài của mình) */}
                                    {user && user.id === r.user.id && (
                                        <View style={{ flexDirection: 'row' }}>
                                            <IconButton icon="pencil" size={20} iconColor="blue" onPress={() => startEdit(r)} />
                                            <IconButton icon="delete" size={20} iconColor="red" onPress={() => deleteReview(r.id)} />
                                        </View>
                                    )}
                                </View>
                                <Text style={{ marginTop: 10, color: '#333' }}>{r.content}</Text>
                            </Card.Content>
                        </Card>
                    ))}

                    {reviews.length === 0 && (
                        <Text style={{ textAlign: 'center', color: 'gray', marginTop: 20 }}>
                            Chưa có đánh giá nào. Hãy là người đầu tiên!
                        </Text>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    inputContainer: {
        marginBottom: 20,
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        // Hiệu ứng bóng đổ nhẹ
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    }
});

export default DishDetail;