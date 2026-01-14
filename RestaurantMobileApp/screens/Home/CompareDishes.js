import React from 'react';
import { View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { DataTable, Text, IconButton, Divider, Button } from 'react-native-paper';

import styles from './CompareDishesStyles';

const CompareDishes = ({ route, navigation }) => {
    const dishes = route.params?.dishes || []; 

    if (dishes.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <IconButton icon="alert-circle-outline" size={80} iconColor="#ccc" />
                <Text style={styles.emptyText}>Dữ liệu bị xóa sau khi restart. Vui lòng quay lại chọn món!</Text>
                <Button 
                    mode="contained" 
                    onPress={() => navigation.navigate("Home")} 
                    style={styles.btnBackHome}
                >
                    QUAY LẠI TRANG CHỦ
                </Button>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerBar}>
                <IconButton icon="arrow-left" size={24} onPress={() => navigation.goBack()} />
                <Text style={styles.headerTitle}>So sánh chi tiết</Text>
            </View>
            <Divider />

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.tableWrapper}>
                    <View style={{ width: dishes.length * 200 + 120 }}>
                        
                        <View style={styles.customHeaderRow}>
                            <View style={styles.labelCol}>
                                <Text style={styles.boldLabel}>Món ăn</Text>
                            </View>
                            {dishes.map(d => (
                                <View key={d.id} style={styles.dataColFixed}>
                                    <Image source={{ uri: d.image }} style={styles.dishImg} />
                                    <View style={styles.nameWrapper}>
                                        <Text style={styles.dishNameFull}>
                                            {d.name}
                                        </Text>
                                    </View>
                                </View>
                            ))}
                        </View>

                        <DataTable>
                            <DataTable.Row style={styles.row}>
                                <DataTable.Cell style={styles.labelCol}>
                                    <Text style={styles.boldText}>Giá</Text>
                                </DataTable.Cell>
                                {dishes.map(d => (
                                    <DataTable.Cell key={d.id} style={styles.dataColFixed}>
                                        <Text style={styles.priceValue}>{d.price?.toLocaleString()}đ</Text>
                                    </DataTable.Cell>
                                ))}
                            </DataTable.Row>

                            <DataTable.Row style={styles.row}>
                                <DataTable.Cell style={styles.labelCol}>
                                    <Text style={styles.boldText}>Phục vụ</Text>
                                </DataTable.Cell>
                                {dishes.map(d => (
                                    <DataTable.Cell key={d.id} style={styles.dataColFixed}>
                                        <Text style={styles.normalText}>{d.preparation || "15"} phút</Text>
                                    </DataTable.Cell>
                                ))}
                            </DataTable.Row>

                            <DataTable.Row style={styles.row}>
                                <DataTable.Cell style={styles.labelCol}>
                                    <Text style={styles.boldText}>Đánh giá</Text>
                                </DataTable.Cell>
                                {dishes.map(d => (
                                    <DataTable.Cell key={d.id} style={styles.dataColFixed}>
                                        <Text style={styles.ratingText}>⭐ {d.rating || "5.0"}</Text>
                                    </DataTable.Cell>
                                ))}
                            </DataTable.Row>

                            <DataTable.Row style={styles.ingredientsRow}>
                                <DataTable.Cell style={styles.labelCol}>
                                    <Text style={styles.boldText}>Nguyên liệu</Text>
                                </DataTable.Cell>
                                {dishes.map(d => (
                                    <DataTable.Cell key={d.id} style={styles.dataColFixed}>
                                        <Text style={styles.ingContent}>
                                            {d.ingredients || "Nhiều thành phần"}
                                        </Text>
                                    </DataTable.Cell>
                                ))}
                            </DataTable.Row>
                        </DataTable>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default CompareDishes;