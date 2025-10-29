import React, { useState } from 'react';
import Filtro from './Componentes/Filtro/Filtro';
import Header from './Componentes/Header/Header';
import { View } from 'react-native-web';


export default function App() {

  return (
    <View style={estilo.container}>
    
      <View style={estilo.barraPesquisa}>
          
          {/* Envolve o ícone em um TouchableOpacity para o clique */}
          <TouchableOpacity onPress={PressIcon}> 
            <Entypo 
              name="magnifying-glass" 
              style={estilo.iconBuscar} 
              size={24} 
              color="black" // Ícone branco para contraste
            /> 	
          </TouchableOpacity>
          
          {/* TextInput com a referência */}
          <TextInput 
            ref={textInputRef} // 4. Anexa a referência
            style={estilo.pesquisa} 
            placeholder='Buscar por um Ingrediente'
            placeholderTextColor="#000000ff" // Placeholder branco
          />
        </View>
        
        {/* Botão Adicionar */}
        <TouchableOpacity style={estilo.botaoAdicionar}>
          <Text style={estilo.textoBotao}>Adicionar novo Ingrediente</Text>
        </TouchableOpacity>
      

        
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
  },
  topico: {
    width: '100%',
    marginBottom: 20,
  },
  topico2: { 
     flexDirection: 'row',
     width: '100%',
     gap:10,
    alignItems: 'center',
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  
  // Estilos dos Rádio Botões
  opcoesContainer: { 
    flexDirection: 'row',
  },
  opcaoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  radioText: {
    fontSize: 16,
    marginLeft: -5, 
  },
  
  // Estilos do Picker (ajustei a largura para 100% para não ser esmagado)
  picker: {
    height: 50,
    width: '50%', 
    borderColor: '#f4a020', // A borda não é visível no Picker nativo, mas mantive a cor
    borderWidth: 1, 
    borderRadius: 5,
    backgroundColor: '#f4a020', // Cor de fundo suave para o Picker
  },
  PickerItens:{
    fontWeight: 'bold',
    fontSize:18,
  }
});