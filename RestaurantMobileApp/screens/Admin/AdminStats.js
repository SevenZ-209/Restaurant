import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Text, Card, IconButton, Divider, ActivityIndicator, Avatar, SegmentedButtons } from 'react-native-paper';
import { authApi, endpoints } from '../../utils/Apis';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from './AdminStatsStyles'; 

const AdminStats = ({ navigation }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('day'); 
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);

    useEffect(() => {
        const loadAdminStats = async () => {
            if (data) setLoading(true);

            try {
                const token = await AsyncStorage.getItem("token");
                let url = `${endpoints['admin-stats']}?period=${period}`;
                
                if (period === 'date') {
                    const offset = date.getTimezoneOffset();
                    const localDate = new Date(date.getTime() - (offset*60*1000));
                    const formattedDate = localDate.toISOString().split('T')[0];
                    url = `${endpoints['admin-stats']}?period=date&date=${formattedDate}`;
                }

                let res = await authApi(token).get(url);
                setData(res.data);
            } catch (ex) {
                console.error("Lỗi tải thống kê Admin:", ex);
            } finally {
                setLoading(false);
            }
        };
        loadAdminStats();
    }, [period, date]); 

    const onChangeDate = (event, selectedDate) => {
        setShowPicker(false);
        if (selectedDate) {
            setDate(selectedDate);
            setPeriod('date'); 
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'COMPLETED': return '#4caf50';
            case 'PENDING': return '#ff9800';
            case 'CANCELLED': return '#f44336';
            case 'READY': return '#2196f3';
            case 'COOKING': return '#9c27b0';
            default: return 'gray';
        }
    };

    const getPeriodLabel = () => {
        switch(period) {
            case 'day': return 'Hôm nay';
            case 'month': return 'Tháng này';
            case 'year': return 'Năm nay';
            case 'all': return 'Toàn thời gian';
            case 'date': return `Ngày ${date.toLocaleDateString('vi-VN')}`;
            default: return '';
        }
    };
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <IconButton icon="arrow-left" size={24} onPress={() => navigation.goBack()} />
                <Text style={styles.headerTitle}>Báo cáo hệ thống</Text>
            </View>
            <Divider />

            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: 'white' }}>
                <View style={{ flex: 1 }}>
                    <SegmentedButtons
                        value={period === 'date' ? null : period}
                        onValueChange={setPeriod}
                        buttons={[
                            { value: 'day', label: 'Hôm nay' },
                            { value: 'month', label: 'Tháng' },
                            { value: 'year', label: 'Năm' },
                            { value: 'all', label: 'Tất cả' },
                        ]}
                        density="small"
                    />
                </View>
                
                <IconButton 
                    icon="calendar" 
                    mode={period === 'date' ? 'contained' : 'outlined'} 
                    iconColor={period === 'date' ? 'white' : '#2e7d32'}
                    containerColor={period === 'date' ? '#2e7d32' : 'white'}
                    size={22}
                    onPress={() => setShowPicker(true)}
                    style={{ marginLeft: 8 }}
                />
            </View>

            {period === 'date' && (
                <View style={{ backgroundColor: '#e8f5e9', paddingVertical: 5 }}>
                    <Text style={{ textAlign: 'center', color: '#2e7d32', fontWeight: 'bold', fontSize: 12 }}>
                        Đang xem dữ liệu ngày: {date.toLocaleDateString('vi-VN')}
                    </Text>
                </View>
            )}

            {showPicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={onChangeDate}
                />
            )}

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#2e7d32" />
                    <Text style={{ marginTop: 10, color: '#2e7d32' }}>Đang tính toán dữ liệu...</Text>
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    
                    <Text style={styles.sectionTitle}>
                        Chỉ số quan trọng ({getPeriodLabel()})
                    </Text>
                    
                    <Card style={[styles.summaryCard, { backgroundColor: '#e8f5e9', borderLeftWidth: 5, borderLeftColor: '#2e7d32' }]}>
                        <Card.Content style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <View>
                                <Text style={styles.summaryLabel}>Tổng doanh thu</Text>
                                <Text style={[styles.summaryValue, { color: '#2e7d32', fontSize: 24 }]}>
                                    {data?.summary?.overall_revenue?.toLocaleString()} đ
                                </Text>
                            </View>
                            <Avatar.Icon size={48} icon="cash-multiple" style={{ backgroundColor: '#a5d6a7' }} color="#1b5e20" />
                        </Card.Content>
                    </Card>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Card style={[styles.summaryCard, { width: '48%', backgroundColor: '#e3f2fd', borderLeftWidth: 5, borderLeftColor: '#1976d2' }]}>
                            <Card.Content style={{ alignItems: 'center' }}>
                                <Avatar.Icon size={40} icon="food" style={{ backgroundColor: '#bbdefb', marginBottom: 5 }} color="#0d47a1" />
                                <Text style={styles.summaryLabel}>Món ăn</Text>
                                <Text style={[styles.summaryValue, { color: '#0d47a1' }]}>
                                    {data?.summary?.total_dishes || 0}
                                </Text>
                            </Card.Content>
                        </Card>

                        <Card style={[styles.summaryCard, { width: '48%', backgroundColor: '#fff3e0', borderLeftWidth: 5, borderLeftColor: '#ef6c00' }]}>
                            <Card.Content style={{ alignItems: 'center' }}>
                                <Avatar.Icon size={40} icon="receipt" style={{ backgroundColor: '#ffe0b2', marginBottom: 5 }} color="#e65100" />
                                <Text style={styles.summaryLabel}>Đơn hàng</Text>
                                <Text style={[styles.summaryValue, { color: '#e65100' }]}>
                                    {data?.summary?.total_orders || 0}
                                </Text>
                            </Card.Content>
                        </Card>
                    </View>

                    <Text style={styles.sectionTitle}>Tỷ lệ trạng thái đơn</Text>
                    <Card style={styles.chartCard}>
                        <Card.Content>
                            {(!data?.order_status_stats || data?.order_status_stats.length === 0) ? (
                                <Text style={{ textAlign: 'center', color: 'gray', padding: 20 }}>Không có dữ liệu trong giai đoạn này.</Text>
                            ) : (
                                data.order_status_stats.map((item, index) => {
                                    const total = data?.summary?.total_orders || 1;
                                    const percent = (item.count / total) * 100;
                                    
                                    return (
                                        <TouchableOpacity 
                                            key={index} 
                                            onPress={() => navigation.navigate("AdminOrderList", { status: item.status, period: period, date: date.toISOString().split('T')[0] })}
                                        >
                                            <View style={styles.statRow}>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                                                    <Text style={{ fontWeight: 'bold', color: '#444' }}>{item.status}</Text>
                                                    <View style={{flexDirection:'row', alignItems:'center'}}>
                                                        <Text style={{ fontWeight: 'bold', color: getStatusColor(item.status), marginRight: 5 }}>
                                                            {item.count} đơn
                                                        </Text>
                                                        <IconButton icon="chevron-right" size={16} style={{margin:0}} />
                                                    </View>
                                                </View>
                                                
                                                <View style={styles.progressBarBg}>
                                                    <View 
                                                        style={[
                                                            styles.progressBarFill, 
                                                            { 
                                                                width: `${percent}%`, 
                                                                backgroundColor: getStatusColor(item.status) 
                                                            }
                                                        ]} 
                                                    />
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })
                            )}
                        </Card.Content>
                    </Card>

                    <View style={{ height: 30 }} /> 
                </ScrollView>
            )}
        </View>
    );
};

export default AdminStats;