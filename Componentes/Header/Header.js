import React, { useRef } from 'react'; // 1. Importa useRef
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
// Nota: Em um projeto puro React Native, você importaria TextInput e TouchableOpacity
// diretamente de 'react-native', não de 'react-native-web'.
// Para fins de demonstração, usei a importação simplificada abaixo:
// import { TextInput, TouchableOpacity } from 'react-native'; 
import Entypo from '@expo/vector-icons/Entypo';

export default function Header() {
  // 2. Cria a referência para o TextInput
  const textInputRef = useRef(null);

  // 3. Função para focar o TextInput
  const PressIcon = () => {
    // textInputRef.current é o componente TextInput
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  };

  return (
    <View style={estilo.container}>
      
      
      git 
      
    </View>
  );
}

const estilo = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch', 
    justifyContent: 'start',
    padding: 20,
  },
  
  // Novo Container que será a barra vermelha
  barraPesquisa: { 
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#c73131ff', 
    borderRadius: 5,
    paddingHorizontal: 15, 
    height: 50,
    
  },

  iconBuscar: {
    marginRight: 10, // Espaço entre o ícone e o texto
    paddingVertical: 10, // Ajuda a aumentar a área de clique, se necessário
  },
  
  pesquisa: {
    flex: 1, 
    padding: 0, 
    width: '100%', // Ocupa a largura total do container
    height: '100%', // Ocupa a altura total do container
    backgroundColor: 'transparent', // Fundo transparente para ver a cor do container
    fontWeight:'bold',
    fontSize:16,
    // Estilos do seu texto
    
    color: '#000000ff',

  },
  
  botaoAdicionar: {
    backgroundColor: '#f4a020',
    padding: 15,
    alignItems: 'center',
    marginTop: 10, 
    borderRadius: 5,
    marginBottom: 20,
  },
  textoBotao: {
    color: '#ffffff',
    fontWeight: 'bold', 	
    fontSize: 16,
  }
});