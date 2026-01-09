import React, { useContext, useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, Image, TouchableOpacity, Alert } from "react-native";
import { Button, Card, List, TextInput, Avatar, Divider } from "react-native-paper";
import RenderHTML from "react-native-render-html";
import moment from "moment";
import 'moment/locale/vi'; // Format ngày giờ tiếng Việt
import { useNavigation, useRoute } from "@react-navigation/native";
import { useWindowDimensions } from "react-native";

import MyStyles from "../../styles/MyStyles"; // Nhớ sửa đường dẫn import cho đúng
import Apis, { authApi, endpoints } from "../../utils/Apis";
import { MyUserContext } from "../../utils/MyContexts"; 

const DishDetail = () => {
    const route = useRoute();
    const { dishId } = route.params; // Lấy ID món ăn từ Home truyền sang
    const { width } = useWindowDimensions();
    const navigation = useNavigation();

    const [dish, setDish] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [content, setContent] = useState("");
    const [rating, setRating] = useState("5"); // Mặc định 5 sao
    const [loading, setLoading] = useState(false);
    
    const [user, ] = useContext(MyUserContext);

    // Load chi tiết món ăn
    useEffect(() => {
        const loadDish = async () => {
            try {
                let res = await Apis.get(endpoints['dish-details'](dishId));
                setDish(res.data);
            } catch (ex) {
                console.error(ex);
            }
        }
        loadDish();
    }, [dishId]);

    // Load đánh giá (Reviews)
    useEffect(() => {
        const loadReviews = async () => {
            try {
                let res = await Apis.get(endpoints['dish-reviews'](dishId));
                setReviews(res.data);
            } catch (ex) {
                console.error(ex);
            }
        }
        loadReviews();
    }, [dishId]);

    // Gửi đánh giá
    const addReview = async () => {
        if (!content) return;

        try {
            setLoading(true);
            // Gọi API post review (cần Token)
            // Lưu ý: authApi cần truyền accessToken, ở đây giả sử Context lưu đủ user info
            // Nếu context chỉ lưu info, bạn cần lưu cả token lúc login. 
            // Tạm thời giả định bạn đã xử lý token ở Login.
            
            // Nếu chưa lưu token vào context, bạn có thể lấy từ AsyncStorage như file mẫu cũ:
            // let token = await AsyncStorage.getItem("token");
            
            // Ở đây tôi dùng authApi (bạn cần đảm bảo login lưu token nhé)
            // let res = await authApi(token).post(...)
            
            // DEMO: Giả sử user đã login và bạn có token
            let res = await Apis.post(endpoints['dish-reviews'](dishId), {
                content: content,
                rating: parseInt(rating),
            }, {
                headers: { "Authorization": `Bearer ${user.access_token}` } // Cần token thật
            });

            setReviews([res.data, ...reviews]);
            setContent("");
        } catch (ex) {
            console.error(ex);
            Alert.alert("Lỗi", "Bạn cần đăng nhập để đánh giá!");
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
            <ScrollView>
                {dish && (
                    <>
                        <Image source={{ uri: dish.image }} style={{ width: "100%", height: 250 }} />
                        <View style={MyStyles.padding}>
                            <Text style={MyStyles.subject}>{dish.name}</Text>
                            <Text style={{ fontSize: 18, fontWeight: "bold", color: "red", marginVertical: 5 }}>
                                {dish.price.toLocaleString("vi-VN")} VNĐ
                            </Text>
                            
                            <Text style={{ fontWeight: 'bold' }}>Nguyên liệu:</Text>
                            <Text style={{ marginBottom: 10 }}>{dish.ingredients}</Text>

                            <Text style={{ fontWeight: 'bold' }}>Mô tả:</Text>
                            <RenderHTML contentWidth={width} source={{ html: dish.description }} />
                        </View>
                    </>
                )}

                <Divider style={{ marginVertical: 10 }} />

                <View style={MyStyles.padding}>
                    <Text style={MyStyles.title}>Đánh giá & Nhận xét</Text>
                    
                    {user ? (
                        <View style={{ marginBottom: 20 }}>
                            <TextInput 
                                mode="outlined" 
                                label="Viết đánh giá của bạn..." 
                                value={content} 
                                onChangeText={setContent} 
                                multiline
                            />
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                                <Text>Điểm (1-5): </Text>
                                <TextInput 
                                    style={{ width: 50, height: 40, marginLeft: 10, backgroundColor: 'white' }} 
                                    keyboardType="numeric" 
                                    value={rating} 
                                    onChangeText={setRating} 
                                />
                                <Button mode="contained" onPress={addReview} loading={loading} style={{ marginLeft: "auto" }}>
                                    Gửi
                                </Button>
                            </View>
                        </View>
                    ) : (
                        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                            <Text style={{ color: "blue", textAlign: "center", marginVertical: 10 }}>
                                Vui lòng đăng nhập để đánh giá!
                            </Text>
                        </TouchableOpacity>
                    )}

                    {reviews.map(r => (
                        <List.Item
                            key={r.id}
                            title={r.user.username}
                            description={`${r.content}\n${moment(r.created_date).fromNow()} - ${r.rating} sao`}
                            descriptionNumberOfLines={3}
                            left={() => <Avatar.Image size={40} source={{ uri: r.user.avatar }} />}
                        />
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

export default DishDetail;