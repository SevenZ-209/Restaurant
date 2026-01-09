import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Chip } from "react-native-paper";
import Apis, { endpoints } from "../utils/Apis"; 

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
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingHorizontal: 10 }}>
            <Chip 
                mode={!selectedId ? "outlined" : "flat"} 
                onPress={() => handleSelect("")} 
                style={styles.chip}
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
                    style={styles.chip}
                    selected={c.id === selectedId}
                >
                    {c.name}
                </Chip>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    chip: { marginRight: 5, marginBottom: 10 }
});

export default Categories;