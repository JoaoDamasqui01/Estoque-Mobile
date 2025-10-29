import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native'; 
import { RadioButton } from 'react-native-paper'; 
import { Picker } from '@react-native-picker/picker';

export default function Filtro() {
  // Estado para controlar a seleção dos Rádio Botões
  const [filtroEstoque, setFiltroEstoque] = useState('todos');
  // Estado para simular a seleção do dropdown
  const [localizacaoSelecionada, setLocalizacaoSelecionada] = useState('todos');

  return (
    <View style={estilo.container}>

      {/* 1. FILTROS (Rádio Botões) */}
      <View style={estilo.topico}>
        <Text style={estilo.titulo}>Filtros:</Text>
        
        {/* OBRIGATÓRIO: Envolver os RadioButtons em RadioButton.Group */}
        <RadioButton.Group 
            onValueChange={newValue => setFiltroEstoque(newValue)} 
            value={filtroEstoque}
        >
            <View style={estilo.opcoesContainer}>
                
                {/* Opção Todos */}
                <View style={estilo.opcaoItem}>
                    <RadioButton value="todos" color="#e7ba3cff" />
                    <Text style={estilo.radioText}>Todos</Text>
                </View>
                
                {/* Opção Baixo Estoque */}
                <View style={estilo.opcaoItem}>
                    <RadioButton value="baixoEstoque" color="#e7ba3cff" />
                    <Text style={estilo.radioText}>Baixa Estoque</Text>
                </View>
            </View>
        </RadioButton.Group>
      </View>

      <View style={estilo.topico2}> 
        <Text style={estilo.titulo}>Localização:</Text>
        
        <Picker
          selectedValue={localizacaoSelecionada}
          style={estilo.picker} 
          onValueChange={(itemValue) => setLocalizacaoSelecionada(itemValue)}
        >
          <Picker.Item label="Todos" value="todos" style={estilo.PickerItens} />
          <Picker.Item label="Geladeira" value="geladeira" style={estilo.PickerItens}/>
          <Picker.Item label="Despensa" value="despensa" style={estilo.PickerItens}/>
          <Picker.Item label="Freezer" value="freezer" style={estilo.PickerItens}/>
        </Picker>
      </View>
    </View>
  );
}

const estilo = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch', // Permite que 'topico' use 100% da largura
    justifyContent: 'center',
    padding: 20, 
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
