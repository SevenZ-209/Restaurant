import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Searchbar, Button, Menu, Divider, IconButton, Badge } from "react-native-paper";
import { MyCartContext } from '../../utils/MyContexts';
import Categories from "../../components/Categories"; 
import Dishes from "../../components/Dishes";       
import styles from './HomeStyles';

const Home = ({ navigation }) => {
    const [cateId, setCateId] = useState("");
    const [q, setQ] = useState(""); 

    const [orderBy, setOrderBy] = useState("id"); 
    const [visible, setVisible] = useState(false); 
    const [sortLabel, setSortLabel] = useState("Mặc định");

    const [cart] = useContext(MyCartContext);
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

    const [compareItems, setCompareItems] = useState([]); 

    const toggleCompare = (dish) => {
        if (compareItems.find(item => item.id === dish.id)) {
            setCompareItems(compareItems.filter(item => item.id !== dish.id));
        } else {
            if (compareItems.length < 3) {
                setCompareItems([...compareItems, dish]);
            } else {
                Alert.alert("Thông báo", "Bạn chỉ có thể so sánh tối đa 3 món cùng lúc.");
            }
        }
    };

    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    const handleSort = (value, label) => {
        closeMenu(); 
        setTimeout(() => {
            setOrderBy(value);
            setSortLabel(label);
        }, 100);
    };

    return (
        <View style={styles.container}>

            <View style={styles.searchContainer}>
                <Searchbar 
                    placeholder="Tìm món ăn..." 
                    onChangeText={setQ} 
                    value={q}
                    elevation={1}
                    style={styles.searchBar}
                />
            </View>

            <View style={styles.filterContainer}>
                <View style={styles.categoriesWrapper}>
                        <Categories setCateId={setCateId} />
                </View>

                <View>
                    <Menu
                        visible={visible}
                        onDismiss={closeMenu}
                        anchor={
                            <View collapsable={false}>
                                <Button 
                                    icon="sort" 
                                    mode="text" 
                                    onPress={openMenu} 
                                    labelStyle={styles.menuButtonLabel}
                                >
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

            <View style={styles.dishesContainer}>
                <Dishes 
                    cateId={cateId} 
                    keyword={q} 
                    ordering={orderBy} 
                    toggleCompare={toggleCompare} 
                    compareItems={compareItems} 
                />
            </View>

            {compareItems.length >= 2 && (
                <TouchableOpacity 
                    style={styles.floatingCompare} 
                    onPress={() => navigation.navigate('CompareDishes', { dishes: compareItems })}
                >
                    <IconButton icon="compare" iconColor="white" size={25} />
                    <Text style={styles.compareText}>So sánh ({compareItems.length})</Text>
                </TouchableOpacity>
            )}

            <TouchableOpacity 
                style={styles.floatingCart} 
                onPress={() => navigation.navigate('Cart')}
            >
                <IconButton icon="cart" iconColor="white" size={30} />
                {cartCount > 0 && (
                    <Badge style={styles.badge} size={22}>{cartCount}</Badge>
                )}
            </TouchableOpacity>

        </View>
    );
}

export default Home;