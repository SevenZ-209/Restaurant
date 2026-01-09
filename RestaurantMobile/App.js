import React, { useReducer, useState, useContext } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Provider } from 'react-redux';
import store from './store/store';
import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Import screens
import Home from './screens/Home/Home';
import About from './screens/About/About';
import User from './screens/User/User';
import Login from './screens/User/auth/Login';
import SignUp from './screens/User/auth/SignUp';

// Import context
import { MyUserContext, myUserReducer } from './utils/MyContexts';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Custom Header Component
const TopBar = ({ navigation }) => {
  const [hoveredButton, setHoveredButton] = useState(null);
  const [user] = useContext(MyUserContext);

  return (
    <View style={{
      backgroundColor: '#FFFFFF',
      paddingHorizontal: 20,
      paddingVertical: 12,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: '#E0E0E0',
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
    }}>
      <Text style={{
        fontSize: 24,
        fontWeight: '900',
        color: '#FF6B35',
        letterSpacing: -0.5,
      }}>
        Restaurant
      </Text>
      
      <View style={{ flexDirection: 'row', gap: 12 }}>
        {user ? (
          <Text style={{
            color: '#333333',
            fontSize: 14,
            fontWeight: '700',
            letterSpacing: 0.5,
          }}>
            Hello, {user.username}
          </Text>
        ) : (
          <>
            <TouchableOpacity 
              style={{
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 4,
                borderWidth: 2,
                borderColor: '#FF6B35',
                backgroundColor: '#FFFFFF',
                opacity: hoveredButton === 'login' ? 0.7 : 1
              }}
              onPress={() => navigation.navigate('Login')}
              onMouseEnter={() => setHoveredButton('login')}
              onMouseLeave={() => setHoveredButton(null)}
            >
              <Text style={{
                color: '#FF6B35',
                fontSize: 14,
                fontWeight: '700',
                letterSpacing: 0.5,
              }}>
                Login
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={{
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 4,
                backgroundColor: '#FF6B35',
                opacity: hoveredButton === 'signup' ? 0.85 : 1
              }}
              onPress={() => navigation.navigate('SignUp')}
              onMouseEnter={() => setHoveredButton('signup')}
              onMouseLeave={() => setHoveredButton(null)}
            >
              <Text style={{
                color: '#FFFFFF',
                fontSize: 14,
                fontWeight: '700',
                letterSpacing: 0.5,
              }}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

function HomeTabs({ navigation }) {
  return (
    <>
      <TopBar navigation={navigation} />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#FF6B35',
          tabBarInactiveTintColor: '#888888',
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopColor: '#E0E0E0',
            borderTopWidth: 1,
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            marginTop: 4,
            fontWeight: '500',
          },
        }}
      >
      <Tab.Screen
        name="HomeTab"
        component={Home}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="AboutTab"
        component={About}
        options={{
          tabBarLabel: 'About',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="information" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="UserTab"
        component={User}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
    </>
  );
}

function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Root" component={HomeTabs} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="SignUp" component={SignUp} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [user, dispatch] = useReducer(myUserReducer, null);

  return (
    <MyUserContext.Provider value={[user, dispatch]}>
      <Provider store={store}>
        <PaperProvider>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              {/* Home page is always shown first */}
              <Stack.Screen name="Root" component={HomeTabs} />
              
              {/* Login and SignUp screens are modal overlays */}
              <Stack.Group screenOptions={{ presentation: 'modal' }}>
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="SignUp" component={SignUp} />
              </Stack.Group>
            </Stack.Navigator>
          </NavigationContainer>
        </PaperProvider>
      </Provider>
    </MyUserContext.Provider>
  );
}
