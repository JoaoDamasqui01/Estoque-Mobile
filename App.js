// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, StyleSheet } from 'react-native';

// ...existing code...
import Home from './screens/Home'; // Certifique-se que o arquivo é 'Home.js'
// ...existing code...
import IngredienteForm from './screens/IngredienteForm';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Lista" 
        screenOptions={{
          headerStyle: { backgroundColor: '#c73131ff' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen 
          name="Lista" 
          component={Home} 
          options={{ title: 'Estoque de Ingredientes' }} 
        />
        <Stack.Screen 
          name="Formulario" 
          component={IngredienteForm} 
          options={({ route }) => ({ 
            // Define o título da tela com base se há um item para edição
            title: route.params?.item ? 'Editar Ingrediente' : 'Novo Ingrediente' 
          })} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Estilos básicos para o NavigationContainer, se necessário


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
