import React, { useState, useEffect } from "react";
import { View, Text, Alert, Image, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { TextInput, Button, Menu, Chip, HelperText } from "react-native-paper"; 
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import MyStyles from "../../styles/MyStyles";
import Apis, { authApi, endpoints } from "../../utils/Apis";

const DishForm = () => {
    // --- State cơ bản ---
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    
    // --- State mới thêm ---
    const [ingredients, setIngredients] = useState(""); // Nguyên liệu
    const [preTime, setPreTime] = useState("");         // Thời gian chuẩn bị
    
    // --- State cho Danh mục & Tags ---
    const [categories, setCategories] = useState([]);
    const [cateId, setCateId] = useState(""); 
    const [cateName, setCateName] = useState("");
    const [showMenu, setShowMenu] = useState(false);

    const [tags, setTags] = useState([]);               // Danh sách tất cả Tag từ Server
    const [selectedTags, setSelectedTags] = useState([]); // Danh sách ID các Tag đã chọn

    const route = useRoute();
    const navigation = useNavigation();
    const dishId = route.params?.dishId;

    // 1. Load dữ liệu ban đầu (Categories & Tags)
    useEffect(() => {
        const loadCommonData = async () => {
            try {
                let [resCate, resTags] = await Promise.all([
                    Apis.get(endpoints['categories']),
                    Apis.get(endpoints['tags'])
                ]);
                
                setCategories(resCate.data);
                setTags(resTags.data);
            } catch (ex) {
                console.error("Lỗi tải dữ liệu chung:", ex);
            }
        };
        loadCommonData();
    }, []);

    // 2. Load thông tin chi tiết món (Nếu là sửa)
    useEffect(() => {
        const loadDish = async () => {
            if (dishId) {
                try {
                    let res = await Apis.get(endpoints['dish-detail'](dishId));
                    let d = res.data;
                    
                    setName(d.name);
                    setPrice(d.price.toString());
                    setDescription(d.description);
                    setImage({ uri: d.image });
                    
                    if (d.image) {
                        setImage({ uri: d.image });
                    }
                    // Set dữ liệu mới thêm
                    setIngredients(d.ingredients || "");
                    setPreTime(d.preparation_time ? d.preparation_time.toString() : "");

                    // Xử lý Category
                    if (d.category) {
                        let cId = d.category.id ? d.category.id : d.category;
                        setCateId(cId.toString());
                        if (d.category.name) setCateName(d.category.name);
                    }

                    // Xử lý Tags (Backend trả về list object tags -> chuyển thành list ID)
                    if (d.tags && Array.isArray(d.tags)) {
                        setSelectedTags(d.tags.map(t => t.id));
                    }
                } catch (ex) {
                    console.error(ex);
                }
            }
        }
        loadDish();
    }, [dishId]);

    // Cập nhật tên danh mục khi list category load xong
    useEffect(() => {
        if (cateId && categories.length > 0) {
            const found = categories.find(c => c.id.toString() === cateId.toString());
            if (found) setCateName(found.name);
        }
    }, [categories, cateId]);

    // --- Hàm xử lý chọn Tag (Toggle) ---
    const toggleTag = (tagId) => {
        if (selectedTags.includes(tagId)) {
            // Nếu đã chọn -> Bỏ chọn
            setSelectedTags(selectedTags.filter(id => id !== tagId));
        } else {
            // Nếu chưa chọn -> Thêm vào
            setSelectedTags([...selectedTags, tagId]);
        }
    };

    // --- Hàm chọn ảnh ---
    const pickImage = async () => {
        const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!granted) {
            Alert.alert("Lỗi", "Cần cấp quyền thư viện ảnh!");
            return;
        }
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images, 
                quality: 1,
            });
            if (!result.canceled) setImage(result.assets[0]);
        } catch (err) { }
    };

    const submit = async () => {
        // Validation: Kiểm tra các trường quan trọng
        if (!name || !price || !cateId || !ingredients || !preTime) {
            Alert.alert("Thiếu thông tin", "Vui lòng nhập đủ: Tên, Giá, Danh mục, Nguyên liệu và Thời gian!");
            return;
        }

        setLoading(true);
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                Alert.alert("Lỗi", "Vui lòng đăng nhập lại.");
                return;
            }

            let formData = new FormData();
            formData.append('name', name);
            formData.append('price', price);
            formData.append('description', description);
            formData.append('category', cateId);
            
            // --- Gửi dữ liệu mới ---
            formData.append('ingredients', ingredients);
            formData.append('preparation_time', preTime);

            // Gửi Tags (Vòng lặp để append từng tag ID)
            selectedTags.forEach(id => {
                formData.append('tags', id); 
            });

            // Logic Active
            if (!dishId) formData.append('active', 'false'); // Mới -> Chờ duyệt

            // Xử lý ảnh
            if (image && image.uri && !image.uri.startsWith("http")) { 
                let filename = image.uri.split('/').pop();
                let match = /\.(\w+)$/.exec(filename);
                let type = match ? `image/${match[1]}` : `image`;
                formData.append('image', { uri: image.uri, name: filename, type: type });
            } 

            if (dishId) {
                await authApi(token).patch(endpoints['dish-detail'](dishId), formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                Alert.alert("Thành công", "Đã cập nhật món ăn!");
            } else {
                await authApi(token).post(endpoints['dishes'], formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                Alert.alert("Thành công", "Món mới đang chờ Admin duyệt.");
            }
            navigation.goBack();

        } catch (ex) {
            console.error(ex);
            Alert.alert("Lỗi", "Có lỗi xảy ra khi lưu!");
        } finally {
            setLoading(false);
        }
    }

    return (
        <ScrollView contentContainerStyle={{ padding: 20, backgroundColor: 'white', flexGrow: 1 }}>
            <Text style={[MyStyles.subject, { textAlign: 'center', marginBottom: 20 }]}>
                {dishId ? "CẬP NHẬT MÓN ĂN" : "THÊM MÓN MỚI"}
            </Text>

            <TextInput label="Tên món *" value={name} onChangeText={setName} style={MyStyles.margin} mode="outlined" />
            
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TextInput 
                    label="Giá (VNĐ) *" 
                    value={price} 
                    onChangeText={setPrice} 
                    keyboardType="numeric" 
                    style={[MyStyles.margin, { flex: 1, marginRight: 5 }]} 
                    mode="outlined" 
                />
                <TextInput 
                    label="Thời gian (phút) *" 
                    value={preTime} 
                    onChangeText={setPreTime} 
                    keyboardType="numeric" 
                    style={[MyStyles.margin, { flex: 1, marginLeft: 5 }]} 
                    mode="outlined" 
                />
            </View>

            {/* Dropdown chọn danh mục */}
            <View style={MyStyles.margin}>
                <Menu
                    visible={showMenu}
                    onDismiss={() => setShowMenu(false)}
                    anchor={
                        <TouchableOpacity onPress={() => setShowMenu(true)}>
                            <TextInput
                                label="Danh mục *"
                                value={cateName}
                                mode="outlined"
                                editable={false}
                                right={<TextInput.Icon icon="chevron-down" onPress={() => setShowMenu(true)} />}
                            />
                        </TouchableOpacity>
                    }
                >
                    {categories.map(c => (
                        <Menu.Item key={c.id} onPress={() => { setCateId(c.id); setCateName(c.name); setShowMenu(false); }} title={c.name} />
                    ))}
                </Menu>
            </View>

            <TextInput label="Nguyên liệu *" value={ingredients} onChangeText={setIngredients} multiline numberOfLines={2} style={MyStyles.margin} mode="outlined" />
            
            <TextInput label="Mô tả" value={description} onChangeText={setDescription} multiline numberOfLines={3} style={MyStyles.margin} mode="outlined" />

            {/* --- KHU VỰC CHỌN TAGS --- */}
            <Text style={{ fontWeight: "bold", marginTop: 10, marginBottom: 5 }}>Tags (Nhãn):</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 15 }}>
                {tags.map(t => (
                    <Chip 
                        key={t.id} 
                        mode="outlined" 
                        selected={selectedTags.includes(t.id)} 
                        showSelectedCheck={true}
                        style={{ margin: 4, backgroundColor: selectedTags.includes(t.id) ? '#e3f2fd' : 'white' }}
                        onPress={() => toggleTag(t.id)}
                    >
                        {t.name}
                    </Chip>
                ))}
            </View>

            {/* Khu vực chọn ảnh */}
            <TouchableOpacity onPress={pickImage} style={{ alignItems: 'center', marginVertical: 15 }}>
                {image ? (
                    <Image source={{ uri: image.uri }} style={{ width: 200, height: 150, borderRadius: 10 }} />
                ) : (
                    <View style={{ width: 200, height: 150, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center', borderRadius: 10, borderStyle: 'dashed', borderWidth: 1 }}>
                        <Text style={{ color: 'gray' }}>Chạm để chọn ảnh</Text>
                    </View>
                )}
            </TouchableOpacity>

            <Button mode="contained" onPress={submit} loading={loading} disabled={loading} style={{ marginTop: 10 }}>
                {dishId ? "Cập nhật" : "Đăng món"}
            </Button>

            <Button mode="outlined" onPress={() => navigation.goBack()} style={{ marginTop: 10, borderColor: 'red' }} textColor="red">Hủy bỏ</Button>
        </ScrollView>
    );
};

export default DishForm;