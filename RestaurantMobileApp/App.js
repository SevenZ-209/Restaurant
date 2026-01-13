import React, { useReducer } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon, Provider as PaperProvider } from "react-native-paper"; // Import PaperProvider

// --- Import Context & Reducer ---
import MyUserReducer from "././reducers/MyUserReducer";
import { MyUserContext } from "././utils/MyContexts";

// --- 2. Import Các Màn Hình ---
// Đảm bảo đường dẫn import đúng với cấu trúc thư mục thực tế của bạn
import Home from "./screens/Home/Home";
import Login from "././screens/User/Login";
import Register from "././screens/User/Register";
import UserProfile from "././screens/User/UserProfile";
import DishDetail from "././screens/Home/DishDetail";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// --- Cấu hình Tab Bar ---
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

// --- App Chính ---
const App = () => {
  const [user, dispatch] = useReducer(MyUserReducer, null);

  return (
    <MyUserContext.Provider value={[user, dispatch]}>
      {/* QUAN TRỌNG: Bọc PaperProvider ở ngoài cùng để Menu/Modal hoạt động */}
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            
            <Stack.Screen name="Main" component={MyTabNavigator} />
            <Stack.Screen name="DishDetail" component={DishDetail} options={{ title: "Chi tiết món ăn", headerShown: true }} />
            <Stack.Screen name="Login" component={Login} options={{ title: "Đăng nhập", headerShown: true }} />
            <Stack.Screen name="Register" component={Register} options={{ title: "Đăng ký", headerShown: true }} />

          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </MyUserContext.Provider>
  );
};

export default App;