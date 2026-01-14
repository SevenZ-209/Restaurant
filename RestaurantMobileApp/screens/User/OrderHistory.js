import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, Alert, StyleSheet } from 'react-native'; // Thêm Alert
import { Card, Chip, Divider, List, IconButton, Button } from 'react-native-paper'; // Thêm Button
import { useNavigation } from '@react-navigation/native';
import moment from "moment";
import 'moment/locale/vi';
import { authApi, endpoints } from '../../utils/Apis';
import AsyncStorage from "@react-native-async-storage/async-storage";

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

    // 1. Load danh sách đơn hàng
    const loadOrders = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem("token");
            let res = await authApi(token).get(endpoints['order-history']);
            setOrders(Array.isArray(res.data) ? res.data : res.data.results || []);
        } catch (ex) {
            console.error(ex);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { loadOrders(); }, []);

    // 2. HÀM HỦY ĐƠN HÀNG
    const cancelOrder = async (orderId) => {
        Alert.alert(
            "Xác nhận hủy",
            "Bạn có chắc chắn muốn hủy đơn hàng này không?",
            [
                { text: "Không", style: "cancel" },
                {
                    text: "Đồng ý",
                    onPress: async () => {
                        try {
                            const token = await AsyncStorage.getItem("token");
                            // Gọi endpoint cancel-order đã khai báo ở bước 1
                            await authApi(token).post(endpoints['cancel-order'](orderId));
                            
                            Alert.alert("Thành công", "Đã hủy đơn hàng!");
                            loadOrders(); // Tải lại danh sách để cập nhật trạng thái
                        } catch (ex) {
                            Alert.alert("Lỗi", "Không thể hủy đơn hàng này (có thể bếp đang nấu).");
                        }
                    }
                }
            ]
        );
    }

    const getStatusColor = (status) => {
        switch(status) {
            case 'PENDING': return '#ff9800'; 
            case 'CONFIRMED': return '#2196f3'; 
            case 'COOKING': return '#9c27b0'; 
            case 'COMPLETED': return '#4caf50'; 
            case 'CANCELLED': return '#f44336';
            default: return 'gray';
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
            <View style={styles.header}>
                <IconButton icon="arrow-left" size={24} onPress={() => navigation.goBack()} />
                <Text style={styles.headerTitle}>Lịch sử đơn hàng</Text>
            </View>
            <Divider />

            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                {orders.map(o => (
                    <Card key={o.id} style={{ margin: 10, backgroundColor: 'white', elevation: 2 }}>
                        <Card.Title 
                            title={`Đơn hàng #${o.id}`} 
                            subtitle={moment(o.created_date).format("LLL")}
                            right={(props) => (
                                <Chip 
                                    style={{ backgroundColor: getStatusColor(o.status), marginRight: 10 }} 
                                    textStyle={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}
                                >
                                    {o.status}
                                </Chip>
                            )}
                        />
                        <Divider />
                        <Card.Content style={{ marginTop: 10 }}>
                            <List.Accordion title="Chi tiết món ăn" titleStyle={{fontSize: 14}}>
                                {o.details && o.details.map(d => (
                                    <List.Item 
                                        key={d.id}
                                        title={`${d.dish_name} (x${d.quantity})`}
                                        description={`${parseFloat(d.unit_price).toLocaleString("vi-VN")} đ`} 
                                    />
                                ))}
                            </List.Accordion>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15, alignItems: 'center' }}>
                                <Text style={{ fontWeight: 'bold', color: '#555' }}>Tổng tiền:</Text>
                                <Text style={{ fontWeight: 'bold', color: '#d32f2f', fontSize: 16 }}>
                                    {o.total_amount ? o.total_amount.toLocaleString("vi-VN") : 0} đ
                                </Text>
                            </View>

                            {/* 👇 3. NÚT HỦY ĐƠN (Chỉ hiện khi trạng thái là PENDING) */}
                            {o.status === 'PENDING' && (
                                <Button 
                                    mode="outlined" 
                                    textColor="#f44336" 
                                    style={{ marginTop: 15, borderColor: '#f44336' }}
                                    icon="close-circle-outline"
                                    onPress={() => cancelOrder(o.id)}
                                >
                                    Hủy đơn hàng
                                </Button>
                            )}
                        </Card.Content>
                    </Card>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    header: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', paddingVertical: 5, elevation: 2 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 5 }
});

export default OrderHistory;