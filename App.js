import React from 'react';
import { SafeAreaView} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {LoginScreen, RegisterScreen, PublicacionScreen} from './src/paginas/index';
import {TabNavegation} from './src/paginas/TabNavegation';
import {IncidenciasScreen} from './src/paginas/IncidenciasScreen';
import {CrearIncidenciaScreen} from './src/paginas/CrearIncidenciaScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <SafeAreaView style={{ flex: 1 }}>
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="TabNavegation" component={TabNavegation} />
          <Stack.Screen name="PublicacionScreen" component={PublicacionScreen} />
          <Stack.Screen name="IncidenciasScreen" component={IncidenciasScreen} />         
          <Stack.Screen name="CrearIncidenciaScreen" component={CrearIncidenciaScreen} />
        </Stack.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
}