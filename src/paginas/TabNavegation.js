import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons"; // Para los íconos de la barra de navegación
import {HomeScreen} from "./HomeScreen.js";
import {AddScreen} from './AddScreen';
import {IncidenciasScreen} from './IncidenciasScreen';


export function TabNavegation() {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: "#282828" },
        tabBarActiveTintColor: "#ffffff",
        tabBarInactiveTintColor: "#aaa",
      }}
    >
      <Tab.Screen
        name="Publicaciones"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Add"
        component={AddScreen}  
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add" color={color} size={size} /> 
          ),
        }}
      />
      <Tab.Screen
        name="Incidencias"
        component={IncidenciasScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}