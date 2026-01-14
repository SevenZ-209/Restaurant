import React, { useState, useEffect } from 'react';
import { View, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Text, DataTable, SegmentedButtons, Card, IconButton, Divider, Avatar } from 'react-native-paper';
import { authApi, endpoints } from '../../utils/Apis';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

// 👇 Import file Style
import styles from './ChefStatsStyles';

const ChefStats = ({ navigation }) => {
    // Thêm các state cho ngày tháng
    const [period, setPeriod] = useState('day'); 
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadStats = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem("token");
            
            // Logic URL giống Admin
            let url = `${endpoints['chef-stats']}?period=${period}`;
            
            if (period === 'date') {
                const offset = date.getTimezoneOffset();
                const localDate = new Date(date.getTime() - (offset*60*1000));
                const formattedDate = localDate.toISOString().split('T')[0];
                url = `${endpoints['chef-stats']}?period=date&date=${formattedDate}`;
            }

            let res = await authApi(token).get(url);
            setData(res.data);
        } catch (ex) {
            console.error(ex);
            Alert.alert("Lỗi", "Không thể tải dữ liệu thống kê.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadStats(); }, [period, date]);

    const onChangeDate = (event, selectedDate) => {
        setShowPicker(false);
        if (selectedDate) {
            setDate(selectedDate);
            setPeriod('date'); 
        }
    };

    // Tính tổng doanh thu trong khoảng thời gian đang xem để hiển thị nổi bật
    const totalRevenue = data?.time_stats?.reduce((sum, item) => sum + (item.revenue || 0), 0) || 0;
    const totalOrders = data?.time_stats?.reduce((sum, item) => sum + (item.order_count || 0), 0) || 0;

    const getPeriodLabel = () => {
        switch(period) {
            case 'day': return 'Hôm nay';
            case 'week': return 'Tuần này';
            case 'month': return 'Tháng này';
            case 'date': return `Ngày ${date.toLocaleDateString('vi-VN')}`;
            default: return '';
        }
    };

    if (loading && !data) return <ActivityIndicator style={styles.loading} size="large" color="#2e7d32" />;

    return (
        <View style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
                <IconButton icon="arrow-left" size={24} onPress={() => navigation.goBack()} />
                <Text style={styles.headerTitle}>Thống kê Bếp</Text>
            </View>
            <Divider />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                
                {/* 1. BỘ LỌC + CHỌN NGÀY */}
                <View style={styles.filterContainer}>
                    <View style={{ flex: 1 }}>
                        <SegmentedButtons
                            value={period === 'date' ? null : period}
                            onValueChange={setPeriod}
                            buttons={[
                                { value: 'day', label: 'Hôm nay' },
                                { value: 'week', label: 'Tuần' },
                                { value: 'month', label: 'Tháng' },
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
                    <View style={styles.dateBanner}>
                        <Text style={styles.dateBannerText}>
                            Đang xem dữ liệu: {date.toLocaleDateString('vi-VN')}
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

                {/* 2. CARD TỔNG QUAN (MỚI) */}
                <Card style={styles.overviewCard}>
                    <Card.Content>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View>
                                <Text style={styles.overviewLabel}>DOANH THU ({getPeriodLabel()})</Text>
                                <Text style={styles.overviewValue}>
                                    {totalRevenue.toLocaleString()} đ
                                </Text>
                                <Text style={{ color: 'rgba(255,255,255,0.8)', marginTop: 5 }}>
                                    Tổng đơn: {totalOrders}
                                </Text>
                            </View>
                            <Avatar.Icon size={56} icon="finance" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} color="white" />
                        </View>
                    </Card.Content>
                </Card>

                {/* 3. BẢNG CHI TIẾT DOANH THU */}
                <Card style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Avatar.Icon size={32} icon="clock-time-eight-outline" style={{ backgroundColor: '#e3f2fd' }} color="#1976d2" />
                        <Text style={styles.cardTitle}>Chi tiết theo thời gian</Text>
                    </View>
                    <DataTable>
                        <DataTable.Header style={styles.tableHeader}>
                            <DataTable.Title><Text style={styles.tableHeadText}>Thời gian</Text></DataTable.Title>
                            <DataTable.Title numeric><Text style={styles.tableHeadText}>Đơn</Text></DataTable.Title>
                            <DataTable.Title numeric><Text style={styles.tableHeadText}>Tiền</Text></DataTable.Title>
                        </DataTable.Header>

                        {data?.time_stats?.map((s, i) => (
                            <DataTable.Row key={i} style={styles.row}>
                                <DataTable.Cell>
                                    <Text style={styles.dateText}>{new Date(s.time).toLocaleDateString('vi-VN')}</Text>
                                </DataTable.Cell>
                                <DataTable.Cell numeric>
                                    <Text style={styles.cellText}>{s.order_count}</Text>
                                </DataTable.Cell>
                                <DataTable.Cell numeric>
                                    <Text style={styles.revenueText}>{s.revenue?.toLocaleString()}đ</Text>
                                </DataTable.Cell>
                            </DataTable.Row>
                        ))}
                        {(!data?.time_stats || data.time_stats.length === 0) && (
                            <Text style={{ textAlign: 'center', padding: 20, color: 'gray' }}>Không có dữ liệu</Text>
                        )}
                    </DataTable>
                </Card>

                {/* 4. BẢNG MÓN BÁN CHẠY */}
                <Card style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Avatar.Icon size={32} icon="fire" style={{ backgroundColor: '#fff3e0' }} color="#ff9800" />
                        <Text style={styles.cardTitle}>Top món bán chạy</Text>
                    </View>
                    <DataTable>
                        <DataTable.Header style={styles.tableHeader}>
                            <DataTable.Title style={{flex: 2}}><Text style={styles.tableHeadText}>Tên món</Text></DataTable.Title>
                            <DataTable.Title numeric><Text style={styles.tableHeadText}>SL</Text></DataTable.Title>
                            <DataTable.Title numeric><Text style={styles.tableHeadText}>Doanh thu</Text></DataTable.Title>
                        </DataTable.Header>

                        {data?.dish_stats?.map((d, i) => (
                            <DataTable.Row key={i} style={styles.row}>
                                <DataTable.Cell style={{flex: 2}}>
                                    <Text numberOfLines={1} style={styles.cellText}>{d.dish__name}</Text>
                                </DataTable.Cell>
                                <DataTable.Cell numeric>
                                    <Text style={styles.cellText}>{d.total_qty}</Text>
                                </DataTable.Cell>
                                <DataTable.Cell numeric>
                                    <Text style={styles.revenueText}>{d.total_revenue?.toLocaleString()}đ</Text>
                                </DataTable.Cell>
                            </DataTable.Row>
                        ))}
                        {(!data?.dish_stats || data.dish_stats.length === 0) && (
                            <Text style={{ textAlign: 'center', padding: 20, color: 'gray' }}>Không có dữ liệu</Text>
                        )}
                    </DataTable>
                </Card>
            </ScrollView>
        </View>
    );
};

export default ChefStats;