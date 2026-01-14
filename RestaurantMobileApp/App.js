import React, { useReducer } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon, Provider as PaperProvider } from "react-native-paper";

import MyCartReducer from "./reducers/MyCartReducer";
import MyUserReducer from "./reducers/MyUserReducer";
import { MyUserContext, MyCartContext } from "./utils/MyContexts";
import OrderHistory from "./screens/User/OrderHistory";

import Home from "./screens/Home/Home";
import Login from "./screens/User/Login";
import Register from "./screens/User/Register";
import UserProfile from "./screens/User/UserProfile";
import DishDetail from "./screens/Home/DishDetail";
import MyDishes from "./screens/Chef/MyDishes";
import DishForm from "./screens/Chef/DishForm";
import ChefOrders from "./screens/Chef/ChefOrders";
import CompareDishes from "./screens/Home/CompareDishes";
import Cart from "./screens/Cart/Cart"; 
import ChefStats from "./screens/Chef/ChefStats";
import AdminStats from "./screens/Admin/AdminStats";
import AdminOrderList from "./screens/Admin/AdminOrderList";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MyTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName = 'circle';
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Profile') iconName = 'account';
          
          return <Icon source={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={Home} options={{ title: "Trang chủ" }} />
      <Tab.Screen name="Profile" component={UserProfile} options={{ title: "Tài khoản" }} />
    </Tab.Navigator>
  );
};

const App = () => {
  const [user, dispatch] = useReducer(MyUserReducer, null);

  const [cart, cartDispatch] = useReducer(MyCartReducer, []);

  return (
    <MyUserContext.Provider value={[user, dispatch]}>
      <MyCartContext.Provider value={[cart, cartDispatch]}>
        
        <PaperProvider>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              
              <Stack.Screen name="Main" component={MyTabNavigator} />
              <Stack.Screen name="DishDetail" component={DishDetail} options={{ title: "Chi tiết món ăn", headerShown: true }} />
              <Stack.Screen name="Login" component={Login} options={{ title: "Đăng nhập", headerShown: true }} />
              <Stack.Screen name="Register" component={Register} options={{ title: "Đăng ký", headerShown: true }} />
              <Stack.Screen name="MyDishes" component={MyDishes} options={{ title: "Quản lý thực đơn" }} />
              <Stack.Screen name="DishForm" component={DishForm} options={{ title: "Nhập thông tin món" }} />
              <Stack.Screen name="Cart" component={Cart} options={{ title: "Giỏ hàng", headerShown: true }} />
              <Stack.Screen name="OrderHistory" component={OrderHistory} options={{ title: "Lịch sử đơn hàng" }} />
              <Stack.Screen name="ChefOrders" component={ChefOrders} options={{ title: "Đơn hàng nhà bếp", headerShown: true }} />
              <Stack.Screen name="CompareDishes" component={CompareDishes} options={{ title: 'So sánh món ăn' }} />
              <Stack.Screen name="ChefStats" component={ChefStats} options={{ title: 'Thống kê doanh thu' }} />
              <Stack.Screen name="AdminStats" component={AdminStats} options={{ headerShown: false }} />
              <Stack.Screen name="AdminOrderList" component={AdminOrderList} options={{ headerShown: false }} />
            </Stack.Navigator>
          </NavigationContainer>
        </PaperProvider>

      </MyCartContext.Provider>
    </MyUserContext.Provider>
  );
};

export default App;