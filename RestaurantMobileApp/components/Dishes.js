import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card, IconButton, Chip } from 'react-native-paper'; 
import Apis, { endpoints } from '../utils/Apis';
import { MyUserContext, MyCartContext } from '../utils/MyContexts';
import DishesStyles from '../styles/DishesStyles';

const Dishes = ({ cateId, keyword, ordering, toggleCompare, compareItems = [] }) => {
    const [dishes, setDishes] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const [user] = useContext(MyUserContext);
    const [, dispatch] = useContext(MyCartContext);
    const navigation = useNavigation();

    useEffect(() => {
        const loadDishes = async () => {
            setLoading(true);
            try {
                let e = endpoints['dishes'];
                let queryParts = [];
                if (cateId) queryParts.push(`category_id=${cateId}`);
                if (keyword) queryParts.push(`q=${keyword}`);
                if (ordering) queryParts.push(`ordering=${ordering}`);
                
                if (queryParts.length > 0) e = `${e}?${queryParts.join("&")}`;

                let res = await Apis.get(e);
                setDishes(res.data.results);
            } catch (ex) {
                console.error(ex);
            } finally {
                setLoading(false);
            }
        }
        loadDishes();
    }, [cateId, keyword, ordering]);

    const quickAddToCart = (dish) => {
        if (!user) {
            Alert.alert("Thông báo", "Vui lòng đăng nhập để đặt món!");
            return;
        }
        dispatch({ type: "add", payload: dish });
        Alert.alert("Đã thêm", `Đã thêm ${dish.name} vào giỏ!`);
    }

    if (loading) return <ActivityIndicator size="large" color="orange" style={{marginTop: 20}} />;

    return (
        <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
            {dishes.length === 0 && <Text style={{textAlign: 'center', marginTop: 20}}>Không có món ăn nào.</Text>}
            
            {dishes.map(d => {
                const isComparing = compareItems.some(i => i.id === d.id);
                
                return (
                    <TouchableOpacity key={d.id} onPress={() => navigation.navigate("DishDetail", { dishId: d.id })}>
                        <Card style={DishesStyles.card}>
                            <Card.Cover source={{ uri: d.image }} />
                            
                            <View style={DishesStyles.prepBadge}>
                                <IconButton icon="clock-outline" size={16} iconColor="white" style={{margin:0}} />
                                <Text style={DishesStyles.prepText}>
                                    {d.preparation ? d.preparation : "15"} phút
                                </Text>
                            </View>

                            <Card.Content style={{paddingTop: 10}}>
                                <View style={DishesStyles.rowBetween}>
                                    <View style={{flex: 1}}>
                                        <Text style={DishesStyles.dishName}>{d.name}</Text>
                                        <Text style={DishesStyles.dishPrice}>{d.price.toLocaleString("vi-VN")} đ</Text>
                                    </View>
                                    <View style={{flexDirection: 'row'}}>
                                        <IconButton 
                                            icon={isComparing ? "checkbox-marked-circle" : "compare"} 
                                            mode="contained" 
                                            containerColor={isComparing ? "#2196F3" : "#e0e0e0"} 
                                            iconColor={isComparing ? "white" : "black"}
                                            onPress={() => toggleCompare(d)}
                                        />
                                        <IconButton icon="cart-plus" mode="contained" containerColor="#ff9800" iconColor="white" onPress={() => quickAddToCart(d)} />
                                    </View>
                                </View>

                                <View style={DishesStyles.tagContainer}>
                                    {d.tags && d.tags.map((tag, index) => (
                                        <Chip 
                                            key={index} 
                                            style={DishesStyles.tag} 
                                            textStyle={DishesStyles.tagText}
                                            icon="tag-outline"
                                            compact={true}
                                        >
                                            {tag.name}
                                        </Chip>
                                    ))}
                                </View>
                            </Card.Content>
                        </Card>
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );
};

export default Dishes;