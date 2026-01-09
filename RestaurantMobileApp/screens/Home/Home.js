import React, { useState } from "react";
import { View } from "react-native";
import { Searchbar } from "react-native-paper";
import Categories from "../../components/Categories"; // Nhớ sửa đường dẫn import
import Dishes from "../../components/Dishes";       // Nhớ sửa đường dẫn import
import MyStyles from "../../styles/MyStyles";

const Home = () => {
    const [cateId, setCateId] = useState("");
    const [q, setQ] = useState(""); // Từ khóa tìm kiếm

    return (
        <View style={[MyStyles.container, { backgroundColor: 'white', flex: 1 }]}>
            {/* Thanh Tìm kiếm nằm ở Home để truyền xuống Dishes */}
            <View style={{ padding: 10 }}>
                <Searchbar 
                    placeholder="Tìm món ăn..." 
                    onChangeText={setQ} 
                    value={q}
                    elevation={1}
                />
            </View>

            {/* Component Danh mục: Khi chọn danh mục -> cập nhật cateId cho Home */}
            <View>
                <Categories setCateId={setCateId} />
            </View>

            {/* Component Món ăn: Nhận cateId và q từ Home để tự load dữ liệu */}
            <View style={{ flex: 1 }}>
                <Dishes cateId={cateId} keyword={q} />
            </View>
        </View>
    );
}

export default Home;