import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { Chip } from "react-native-paper";
import Apis, { endpoints } from "../utils/Apis"; 
import CategoriesStyles from "../styles/CategoriesStyles";

const Categories = ({ setCateId }) => {
    const [categories, setCategories] = useState([]);
    const [selectedId, setSelectedId] = useState(""); 

    useEffect(() => {
        const loadCates = async () => {
            try {
                let res = await Apis.get(endpoints['categories']);
                setCategories(res.data);
            } catch (ex) {
                console.error("Lỗi danh mục:", ex);
            }
        }
        loadCates();
    }, []);

    const handleSelect = (id) => {
        setSelectedId(id); 
        setCateId(id); 
    }

    return (
        <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={CategoriesStyles.container}
        >
            <Chip 
                mode={!selectedId ? "outlined" : "flat"} 
                onPress={() => handleSelect("")} 
                style={CategoriesStyles.chip}
                icon="shape-outline"
                selected={!selectedId}
            >
                Tất cả
            </Chip>
            
            {categories.map(c => (
                <Chip 
                    key={c.id} 
                    mode={c.id === selectedId ? "outlined" : "flat"} 
                    onPress={() => handleSelect(c.id)}
                    style={CategoriesStyles.chip}
                    selected={c.id === selectedId}
                >
                    {c.name}
                </Chip>
            ))}
        </ScrollView>
    );
};

export default Categories;