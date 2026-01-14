import React, { useState, useEffect } from "react";
import { View, Text, Alert, Image, ScrollView, TouchableOpacity } from "react-native";
import { TextInput, Button, Menu, Chip } from "react-native-paper"; 
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Apis, { authApi, endpoints } from "../../utils/Apis";

import styles from './DishFormStyles';

const DishForm = () => {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    
    const [ingredients, setIngredients] = useState(""); 
    const [preTime, setPreTime] = useState("");         
    
    const [categories, setCategories] = useState([]);
    const [cateId, setCateId] = useState(""); 
    const [cateName, setCateName] = useState("");
    const [showMenu, setShowMenu] = useState(false);

    const [tags, setTags] = useState([]);               
    const [selectedTags, setSelectedTags] = useState([]); 

    const route = useRoute();
    const navigation = useNavigation();
    const dishId = route.params?.dishId;

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

    useEffect(() => {
        const loadDish = async () => {
            if (dishId) {
                try {
                    let res = await Apis.get(endpoints['dish-detail'](dishId));
                    let d = res.data;
                    
                    setName(d.name);
                    setPrice(d.price.toString());
                    setDescription(d.description);
                    
                    if (d.image) {
                        setImage({ uri: d.image });
                    }
                    setIngredients(d.ingredients || "");
                    setPreTime(d.preparation_time ? d.preparation_time.toString() : "");

                    if (d.category) {
                        let cId = d.category.id ? d.category.id : d.category;
                        setCateId(cId.toString());
                        if (d.category.name) setCateName(d.category.name);
                    }

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

    useEffect(() => {
        if (cateId && categories.length > 0) {
            const found = categories.find(c => c.id.toString() === cateId.toString());
            if (found) setCateName(found.name);
        }
    }, [categories, cateId]);

    const toggleTag = (tagId) => {
        if (selectedTags.includes(tagId)) {
            setSelectedTags(selectedTags.filter(id => id !== tagId));
        } else {
            setSelectedTags([...selectedTags, tagId]);
        }
    };

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
            formData.append('ingredients', ingredients);
            formData.append('preparation_time', preTime);

            selectedTags.forEach(id => {
                formData.append('tags', id); 
            });

            if (!dishId) formData.append('active', 'false');

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
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.headerTitle}>
                {dishId ? "CẬP NHẬT MÓN ĂN" : "THÊM MÓN MỚI"}
            </Text>

            <TextInput label="Tên món *" value={name} onChangeText={setName} style={styles.input} mode="outlined" />
            
            <View style={styles.row}>
                <TextInput 
                    label="Giá (VNĐ) *" 
                    value={price} 
                    onChangeText={setPrice} 
                    keyboardType="numeric" 
                    style={styles.inputHalfLeft} 
                    mode="outlined" 
                />
                <TextInput 
                    label="Thời gian (phút) *" 
                    value={preTime} 
                    onChangeText={setPreTime} 
                    keyboardType="numeric" 
                    style={styles.inputHalfRight} 
                    mode="outlined" 
                />
            </View>

            <View style={styles.dropdownContainer}>
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

            <TextInput label="Nguyên liệu *" value={ingredients} onChangeText={setIngredients} multiline numberOfLines={2} style={styles.input} mode="outlined" />
            
            <TextInput label="Mô tả" value={description} onChangeText={setDescription} multiline numberOfLines={3} style={styles.input} mode="outlined" />

            <Text style={styles.sectionTitle}>Tags (Nhãn):</Text>
            <View style={styles.tagContainer}>
                {tags.map(t => (
                    <Chip 
                        key={t.id} 
                        mode="outlined" 
                        selected={selectedTags.includes(t.id)} 
                        showSelectedCheck={true}
                        style={[styles.chip, { backgroundColor: selectedTags.includes(t.id) ? '#e3f2fd' : 'white' }]}
                        onPress={() => toggleTag(t.id)}
                    >
                        {t.name}
                    </Chip>
                ))}
            </View>

            <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
                {image ? (
                    <Image source={{ uri: image.uri }} style={styles.image} />
                ) : (
                    <View style={styles.imagePlaceholder}>
                        <Text style={styles.imageText}>Chạm để chọn ảnh</Text>
                    </View>
                )}
            </TouchableOpacity>

            <Button mode="contained" onPress={submit} loading={loading} disabled={loading} style={styles.btnSubmit}>
                {dishId ? "Cập nhật" : "Đăng món"}
            </Button>

            <Button mode="outlined" onPress={() => navigation.goBack()} style={styles.btnCancel} textColor="red">Hủy bỏ</Button>
        </ScrollView>
    );
};

export default DishForm;