import React, { useState, useEffect } from 'react';
import { View, FlatList, Alert } from 'react-native';
import { Card, Button, Badge, List } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi, endpoints } from '../../utils/Apis';

import styles from './ChefOrdersStyles';

const ChefOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadOrders = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem("token");
            let res = await authApi(token).get(endpoints['orders']);
            setOrders(res.data.results || res.data);
        } catch (ex) {
            console.error(ex);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadOrders(); }, []);

    const updateStatus = async (orderId, actionPath) => {
        try {
            const token = await AsyncStorage.getItem("token");
            await authApi(token).post(`${endpoints['orders']}${orderId}/${actionPath}/`);
            loadOrders();
        } catch (ex) {
            Alert.alert("Lỗi", "Không thể cập nhật trạng thái.");
        }
    };

    const renderOrderItem = ({ item }) => (
        <Card style={styles.card}>
            <Card.Title 
                title={`Đơn hàng #${item.id} - Bàn ${item.table_name || item.table}`}
                subtitle={`Lúc: ${new Date(item.created_date).toLocaleTimeString()}`}
                right={() => <Badge style={styles.badge}>{item.status}</Badge>}
            />
            <Card.Content>
                {item.details.map((d, index) => (
                    <List.Item key={index} title={`${d.dish_name} x${d.quantity}`} />
                ))}
            </Card.Content>
            <Card.Actions>
                {item.status !== 'COOKING' && item.status !== 'READY' && (
                    <Button mode="contained" onPress={() => updateStatus(item.id, 'take-order')}>
                        TIẾP NHẬN
                    </Button>
                )}
                {item.status === 'COOKING' && (
                    <Button mode="contained" buttonColor="green" onPress={() => updateStatus(item.id, 'ready-order')}>
                        HOÀN THÀNH
                    </Button>
                )}
            </Card.Actions>
        </Card>
    );

    return (
        <View style={styles.container}>
            <FlatList 
                data={orders} 
                renderItem={renderOrderItem} 
                keyExtractor={item => item.id.toString()}
                onRefresh={loadOrders} 
                refreshing={loading} 
            />
        </View>
    );
};

export default ChefOrders;