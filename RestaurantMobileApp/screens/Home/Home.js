import React, { useState } from "react";
import { View } from "react-native";
import { Searchbar, Button, Menu, Divider } from "react-native-paper";
import Categories from "../../components/Categories"; 
import Dishes from "../../components/Dishes";       
import MyStyles from "../../styles/MyStyles";

const Home = () => {
    const [cateId, setCateId] = useState("");
    const [q, setQ] = useState(""); 
    
    // --- STATE CHO SẮP XẾP ---
    const [orderBy, setOrderBy] = useState("id"); 
    const [visible, setVisible] = useState(false); 
    const [sortLabel, setSortLabel] = useState("Mặc định");

    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    // --- FIX LỖI ĐƠ MENU ---
    const handleSort = (value, label) => {
        closeMenu(); // 1. Đóng menu trước
        
        // 2. Đợi 100ms cho menu đóng hẳn rồi mới set State để load lại trang
        // Điều này giúp tránh xung đột UI khiến nút bị đơ
        setTimeout(() => {
            setOrderBy(value);
            setSortLabel(label);
        }, 100);
    };

    return (
        <View style={[MyStyles.container, { backgroundColor: 'white', flex: 1 }]}>
            
            {/* 1. Thanh tìm kiếm */}
            <View style={{ padding: 10 }}>
                <Searchbar 
                    placeholder="Tìm món ăn..." 
                    onChangeText={setQ} 
                    value={q}
                    elevation={1}
                />
            </View>

            {/* 2. Thanh công cụ: Danh mục & Sắp xếp */}
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }}>
                <View style={{ flex: 1 }}>
                        <Categories setCateId={setCateId} />
                </View>

                <View>
                    <Menu
                        visible={visible}
                        onDismiss={closeMenu}
                        anchor={
                            // --- FIX LỖI ANDROID: Thêm collapsable={false} ---
                            <View collapsable={false}>
                                <Button icon="sort" mode="text" onPress={openMenu}>
                                    {sortLabel}
                                </Button>
                            </View>
                        }>
                        <Menu.Item onPress={() => handleSort("id", "Mặc định")} title="Mặc định" />
                        <Divider />
                        <Menu.Item onPress={() => handleSort("price", "Giá tăng dần")} title="Giá: Thấp -> Cao" />
                        <Menu.Item onPress={() => handleSort("-price", "Giá giảm dần")} title="Giá: Cao -> Thấp" />
                        <Divider />
                        <Menu.Item onPress={() => handleSort("name", "Tên A-Z")} title="Tên: A -> Z" />
                    </Menu>
                </View>
            </View>

            {/* 3. Danh sách món ăn */}
            <View style={{ flex: 1 }}>
                <Dishes cateId={cateId} keyword={q} ordering={orderBy} />
            </View>
        </View>
    );
}

export default Home;