import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, ActivityIndicator } from 'react-native';
import { Card, Chip, Divider, List, IconButton, Avatar } from 'react-native-paper';
import moment from "moment";
import 'moment/locale/vi';
import { authApi, endpoints } from '../../utils/Apis';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './AdminOrderListStyles';

const AdminOrderList = ({ route, navigation }) => {
    const { status, period, date } = route.params;
    
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadOrders = async () => {
            try {
                const token = await AsyncStorage.getItem("token");
                let url = `${endpoints['orders']}?status=${status}`;

                if (period) url += `&period=${period}`;
                if (period === 'date' && date) url += `&date=${date}`;

                console.log("Admin đang tải danh sách từ URL:", url);

                let res = await authApi(token).get(url);
                setOrders(res.data.results || res.data);
            } catch (ex) {
                console.error("Lỗi tải danh sách đơn:", ex);
            } finally {
                setLoading(false);
            }
        }
        loadOrders();
    }, [status, period, date]);

    const getStatusColor = (s) => {
        switch(s) {
            case 'COMPLETED': return '#4caf50';
            case 'PENDING': return '#ff9800';
            case 'CANCELLED': return '#f44336';
            case 'READY': return '#2196f3'; 
            case 'COOKING': return '#9c27b0';
            default: return 'gray';
        }
    };

    const getDateLabel = () => {
        if (period === 'date' && date) return `Ngày ${moment(date).format('DD/MM/YYYY')}`;
        if (period === 'day') return 'Hôm nay';
        if (period === 'month') return 'Tháng này';
        if (period === 'year') return 'Năm nay';
        return 'Toàn thời gian';
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />
                <View>
                    <Text style={styles.headerTitle}>Danh sách: {status}</Text>
                    <Text style={styles.headerSubtitle}>{getDateLabel()}</Text>
                </View>
            </View>

            {loading ? <ActivityIndicator size="large" color="green" style={styles.loading} /> : (
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {orders.length === 0 && (
                        <View style={styles.emptyContainer}>
                            <Avatar.Icon size={50} icon="file-search-outline" style={styles.emptyIcon} color="gray"/>
                            <Text style={styles.emptyText}>
                                Không có đơn hàng '{status}' nào trong {getDateLabel().toLowerCase()}.
                            </Text>
                        </View>
                    )}
                    
                    {orders.map(o => (
                        <Card key={o.id} style={styles.card}>
                            <Card.Title 
                                title={`Bàn số: ${o.table?.name || o.table || "Mang về"}`}
                                subtitle={moment(o.created_date).format("HH:mm - DD/MM/YYYY")}
                                left={props => (
                                    <Avatar.Icon 
                                        {...props} 
                                        icon="table-furniture" 
                                        style={{ backgroundColor: getStatusColor(status) }} 
                                        color="white" 
                                    />
                                )}
                                right={props => <Chip style={styles.chip}>{o.total_amount?.toLocaleString()}đ</Chip>}
                            />
                            <Divider />
                            <Card.Content>
                                <List.Accordion title="Chi tiết món ăn">
                                    {o.details?.map(d => (
                                        <List.Item 
                                            key={d.id}
                                            title={`${d.dish_name} (x${d.quantity})`}
                                            description={`${parseFloat(d.unit_price).toLocaleString()}đ`}
                                        />
                                    ))}
                                </List.Accordion>
                            </Card.Content>
                        </Card>
                    ))}
                </ScrollView>
            )}
        </View>
    );
};

export default AdminOrderList;