import React, { useContext, useEffect, useState } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity, Alert, useWindowDimensions } from "react-native";
import { Button, Card, TextInput, Avatar, Divider, IconButton, ActivityIndicator } from "react-native-paper";
import RenderHTML from "react-native-render-html";
import moment from "moment";
import 'moment/locale/vi'; 
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Apis, { authApi, endpoints } from "../../utils/Apis";
import { MyUserContext, MyCartContext } from "../../utils/MyContexts"; 

import styles from './DishDetailStyles';

moment.locale('vi');

const DishDetail = () => {
    const route = useRoute();
    const { dishId } = route.params;
    const { width } = useWindowDimensions();
    const navigation = useNavigation();
    
    const [user, ] = useContext(MyUserContext);
    const [, cartDispatch] = useContext(MyCartContext);

    const [dish, setDish] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [content, setContent] = useState("");
    const [rating, setRating] = useState(5); 
    const [loading, setLoading] = useState(false);

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

    const loadReviews = async () => {
        try {
            let res = await Apis.get(endpoints['dish-reviews'](dishId));
            setReviews(res.data);
        } catch (ex) {
            console.error("Lỗi load review:", ex);
        }
    }

    useEffect(() => {
        loadReviews();
    }, [dishId]);

    const addToCart = () => {
        if (!user) {
            Alert.alert(
                "Yêu cầu đăng nhập", 
                "Vui lòng đăng nhập để thêm món vào giỏ hàng!",
                [
                    { text: "Hủy", style: "cancel" },
                    { text: "Đăng nhập", onPress: () => navigation.navigate("Login") }
                ]
            );
            return;
        }

        cartDispatch({
            type: "add",
            payload: dish 
        });
        Alert.alert("Thành công", "Đã thêm món vào giỏ hàng!");
    }

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

            const myExistingReview = reviews.find(r => r.user.id === user.id);

            if (myExistingReview) {
                await authApi(token).patch(endpoints['dish-reviews'](dishId), {
                    content: content,
                    rating: parseInt(rating),
                });
                Alert.alert("Thành công", "Đánh giá đã được cập nhật!");
            } else {
                await authApi(token).post(endpoints['dish-reviews'](dishId), {
                    content: content,
                    rating: parseInt(rating),
                });
                Alert.alert("Thành công", "Cảm ơn bạn đã đánh giá!");
            }

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
                            loadReviews();
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

    const startEdit = (review) => {
        setContent(review.content);
        setRating(review.rating);
        Alert.alert("Chỉnh sửa", "Nội dung cũ đã được điền. Hãy thay đổi và bấm Gửi.");
    }

    const RatingBar = ({ currentRating, onSelect, readOnly = false, size = 40 }) => {
        return (
            <View style={styles.ratingBar}>
                {!readOnly && <Text style={styles.ratingLabel}>Đánh giá:</Text>}
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
                            color={star <= currentRating ? "#FFD700" : "#DDDDDD"} 
                        />
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    if (!dish) return <View style={styles.loadingContainer}><ActivityIndicator size="large" color="orange" /></View>;

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Image source={{ uri: dish.image }} style={styles.dishImage} />
                
                <View style={styles.infoContainer}>
                    <Text style={styles.dishName}>{dish.name}</Text>
                    <Text style={styles.price}>
                        {dish.price.toLocaleString("vi-VN")} VNĐ
                    </Text>
                    
                    {dish.ingredients ? (
                        <>
                            <Text style={styles.boldLabel}>Nguyên liệu:</Text>
                            <Text style={styles.italicText}>{dish.ingredients}</Text>
                        </>
                    ) : null}

                    <Text style={styles.boldLabel}>Mô tả:</Text>
                    <RenderHTML contentWidth={width} source={{ html: dish.description }} />
                </View>

                <Divider style={styles.divider} />

                <View style={styles.infoContainer}>
                    <Text style={styles.sectionTitle}>Đánh giá & Nhận xét</Text>

                    {user ? (
                        <View style={styles.inputContainer}>
                            <RatingBar currentRating={rating} onSelect={setRating} />
                            
                            <TextInput 
                                mode="outlined" 
                                label="Chia sẻ cảm nhận của bạn..." 
                                value={content} 
                                onChangeText={setContent} 
                                multiline
                                numberOfLines={3}
                                style={styles.textInput}
                            />
                            
                            <Button 
                                mode="contained" 
                                onPress={addReview} 
                                loading={loading} 
                                icon="send"
                                style={styles.sendButton}
                            >
                                Gửi đánh giá
                            </Button>
                        </View>
                    ) : (
                        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                            <Text style={styles.loginPrompt}>
                                Bạn cần đăng nhập để viết đánh giá!
                            </Text>
                        </TouchableOpacity>
                    )}

                    {reviews.map(r => (
                        <Card key={r.id} style={styles.reviewCard}>
                            <Card.Content>
                                <View style={styles.reviewHeader}>
                                    <View style={styles.userInfo}>
                                        <Avatar.Image size={40} source={{ uri: r.user.avatar || "https://via.placeholder.com/150" }} />
                                        <View style={styles.userDetails}>
                                            <Text style={styles.userName}>{r.user.username}</Text>
                                            <Text style={styles.reviewDate}>
                                                {moment(r.created_date).fromNow()}
                                            </Text>
                                            <RatingBar currentRating={r.rating} readOnly={true} size={20} />
                                        </View>
                                    </View>

                                    {user && user.id === r.user.id && (
                                        <View style={styles.actionButtons}>
                                            <IconButton icon="pencil" size={20} iconColor="blue" onPress={() => startEdit(r)} />
                                            <IconButton icon="delete" size={20} iconColor="red" onPress={() => deleteReview(r.id)} />
                                        </View>
                                    )}
                                </View>
                                <Text style={styles.reviewContent}>{r.content}</Text>
                            </Card.Content>
                        </Card>
                    ))}

                    {reviews.length === 0 && (
                        <Text style={styles.emptyText}>
                            Chưa có đánh giá nào. Hãy là người đầu tiên!
                        </Text>
                    )}
                </View>
            </ScrollView>

            <View style={styles.bottomBar}>
                <Button 
                    mode="contained" 
                    icon="cart-plus" 
                    onPress={addToCart}
                    style={styles.addToCartBtn}
                    labelStyle={styles.addToCartLabel}
                >
                    Thêm vào giỏ hàng
                </Button>
            </View>
        </View>
    );
}

export default DishDetail;