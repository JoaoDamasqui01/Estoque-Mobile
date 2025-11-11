// screens/IngredienteForm.js
import React, { useState, useMemo, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Alert,
    Platform
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation, useRoute } from '@react-navigation/native'; // Importações para navegação

const api = "http://localhost:5000/ingredientes";

// --- CONFIGURAÇÕES GLOBAIS ---
const UNIDADES_OPCOES = ['KG', 'LITROS', 'UNIDADE', 'PACOTE'];
const LOCALIZACOES_OPCOES = ['ARMÁRIO', 'GELADEIRA', 'FRIZZER'];

// --- COMPONENTE PRINCIPAL: IngredienteForm ---
export default function IngredienteForm() {
    const navigation = useNavigation();
    const route = useRoute();

    // Obtém o item (se existir) dos parâmetros de navegação (para Edição)
    const itemSendoEditado = route.params?.item || null;
    const isEditing = !!itemSendoEditado;

    // Estado inicial do Formulário (depende de itemSendoEditado)
    const initialFormState = useMemo(() => ({
        nome: itemSendoEditado?.nome || '',
        qtdAtual: (itemSendoEditado?.qtdAtual || 0).toFixed(3).toString(),
        unidade: itemSendoEditado?.unidade || UNIDADES_OPCOES[0] || 'KG',
        pontoDePedido: (itemSendoEditado?.pontoDePedido || 0).toString(),
        localizacao: itemSendoEditado?.localizacao || LOCALIZACOES_OPCOES[0] || 'Armário',
        fornecedor: itemSendoEditado?.fornecedor || '',
        precoCusto: itemSendoEditado?.preco_custo?.toString() || ''
    }), [itemSendoEditado]);

    const [formData, setFormData] = useState(initialFormState);

    // Efeito para resetar o formulário se o item de edição mudar (útil se o componente for reutilizado)
    useEffect(() => {
        setFormData(initialFormState);
    }, [initialFormState]);


    // --- 1. FUNÇÕES CRUD: CRIAÇÃO E EDIÇÃO ---

    const CRIARIngrediente = async (dadosFinais) => {
        try {
            const response = await fetch(api, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosFinais),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Erro do servidor:", errorData);
                console.log(response.data);
                throw new Error('Erro ao criar novo ingrediente');
            }
            console.log(response.data)

            const dadosResposta = await response.json(); // Se a API retornar o item criado
            console.log("Sucesso", `${dadosFinais.nome} adicionado com sucesso!`);
            console.log("Sucessoadicionado com sucesso!");
            navigation.goBack(); // Volta para a lista
        } catch (error) {
            console.error("Erro ao criar:", error);
            console.log("Erro", "Falha ao adicionar o ingrediente.");
        }
    };

    const EDICAOIngrediente = async (idParaEditar, dadosParaAtualizar) => {
        try {
            const response = await fetch(`${api}/${idParaEditar}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosParaAtualizar),
            });

            if (!response.ok) {
                throw new Error('Erro ao editar ingrediente: ' + response.statusText);
            }

            // const dadosResposta = await response.json(); // Se a API retornar o item editado
            Alert.alert("Sucesso", `${dadosParaAtualizar.nome} editado com sucesso!`);
            navigation.goBack(); // Volta para a lista
        } catch (error) {
            console.error("Erro ao editar:", error);
            Alert.alert("Erro", "Falha ao editar o ingrediente.");
        }
    };

    // --- 2. LÓGICA DO FORMULÁRIO ---

    const handleChangeForm = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Lógica do botão Salvar/Adicionar
    const handleSaveIngrediente = () => {
        if (
            !formData.nome.trim() ||
            !formData.qtdAtual.trim() ||
            !formData.pontoDePedido.trim() ||
            !formData.fornecedor.trim() ||
            !formData.precoCusto.trim()
        ) {
            Alert.alert("Erro", "Todos os campos devem ser preenchidos.");
            return;
        }

        const qtdAtualNum = parseFloat(formData.qtdAtual.replace(',', '.'));
        const pontoDePedidoNum = parseInt(formData.pontoDePedido, 10);
        const precoCustoNum = parseFloat(formData.precoCusto.replace(',', '.'));

        if (
            isNaN(qtdAtualNum) ||
            isNaN(pontoDePedidoNum) ||
            isNaN(precoCustoNum) ||
            qtdAtualNum < 0 ||
            pontoDePedidoNum < 0 ||
            precoCustoNum < 0
        ) {
            Alert.alert("Erro", "Valores numéricos inválidos.");
            return;
        }

        const dadosFinais = {
            nome: formData.nome.trim(),
            quantidade: qtdAtualNum,
            unidade_medida: formData.unidade,
            ponto_pedido: pontoDePedidoNum,
            localizacao: formData.localizacao,
            fornecedor: formData.fornecedor.trim(),
            preco_custo: precoCustoNum
        }

        console.log("Enviando para API:", dadosFinais);

        if (isEditing) {
            EDICAOIngrediente(itemSendoEditado.id_Ingrediente, dadosFinais);
        } else {
            CRIARIngrediente(dadosFinais);
        }
    };


    // --- 3. RENDERIZAÇÃO DA TELA ---
    return (
        <ScrollView style={estilo.scrollContainer}>
            <View style={estilo.formContainer}>

                {/* O título da tela é definido pelo Stack Navigator (App.js) */}

                <ScrollView style={estilo.formScrollView}>
                    {/* Campo Nome */}
                    <Text style={estilo.formLabel}>Nome:</Text>
                    <TextInput
                        style={estilo.formInput}
                        value={formData.nome}
                        onChangeText={(text) => handleChangeForm('nome', text)}
                        placeholder="Ex: Farinha de Trigo"
                    />

                    {/* Campo Quantidade Atual */}
                    <Text style={estilo.formLabel}>Qtde Atual (inteiro):</Text>
                    <TextInput
                        style={estilo.formInput}
                        value={formData.qtdAtual}
                        onChangeText={(text) => {
                            const somenteInteiro = text.replace(/[^0-9]/g, '');
                            handleChangeForm('qtdAtual', somenteInteiro);
                        }}
                        keyboardType="numeric"
                    />

                    <Text style={estilo.formLabel}>Forncedor</Text>
                    <TextInput
                        style={estilo.formInput}
                        value={formData.fornecedor || ''}
                        onChangeText={(text) => handleChangeForm('fornecedor', text)}
                        placeholder="Ex: Fornecedor XYZ"
                    />

                    <Text style={estilo.formLabel}>Preço de Custo</Text>
                    <TextInput
                        style={estilo.formInput}
                        value={formData.precoCusto || ''}
                        onChangeText={(text) => handleChangeForm('precoCusto', text)}
                        placeholder="Ex: 25.50"
                        keyboardType="numeric"
                    />

                    {/* Campo Unidade */}
                    <Text style={estilo.formLabel}>Unidade:</Text>
                    <View style={estilo.pickerFormContainer}>
                        <Picker
                            selectedValue={formData.unidade}
                            style={estilo.pickerForm}
                            onValueChange={(itemValue) => handleChangeForm('unidade', itemValue)}
                        >
                            {UNIDADES_OPCOES.map(un => (
                                <Picker.Item key={un} label={un} value={un} />
                            ))}
                        </Picker>
                    </View>

                    {/* Campo Ponto de Pedido */}
                    <Text style={estilo.formLabel}>Ponto de Pedido (inteiro):</Text>
                    <TextInput
                        style={estilo.formInput}
                        value={formData.pontoDePedido}
                        onChangeText={(text) => handleChangeForm('pontoDePedido', text.replace(/[^0-9]/g, ''))}
                        keyboardType="numeric"
                    />

                    {/* Campo Localização (Picker) */}
                    <Text style={estilo.formLabel}>Localização:</Text>
                    <View style={estilo.pickerFormContainer}>
                        <Picker
                            selectedValue={formData.localizacao}
                            style={estilo.pickerForm}
                            onValueChange={(itemValue) => handleChangeForm('localizacao', itemValue)}
                        >
                            {LOCALIZACOES_OPCOES.map(loc => (
                                <Picker.Item key={loc} label={loc} value={loc} />
                            ))}
                        </Picker>
                    </View>

                </ScrollView>

                {/* Botões do Formulário */}
                <View style={estilo.formActions}>
                    <TouchableOpacity
                        style={[estilo.formButton, estilo.formButtonCancel]}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={estilo.formButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[estilo.formButton, estilo.formButtonSave]}
                        onPress={handleSaveIngrediente}
                    >
                        <Text style={estilo.formButtonText}>{isEditing ? 'Salvar Edição' : 'Adicionar'}</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </ScrollView>
    );
}

// --- ESTILOS (Apenas os estilos do Modal/Formulário são necessários aqui) ---
const estilo = StyleSheet.create({
    scrollContainer: { flex: 1, backgroundColor: '#f5f5f5' },
    formContainer: { flex: 1, padding: 20, backgroundColor: 'white' },
    formScrollView: { width: '100%' },
    formLabel: { fontSize: 16, fontWeight: 'bold', marginTop: 10, marginBottom: 5, color: '#333' },
    formInput: { width: '100%', height: 40, borderColor: '#ccc', borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, marginBottom: 10, backgroundColor: '#f9f9f9' },
    pickerFormContainer: { borderColor: '#ccc', borderWidth: 1, borderRadius: 8, marginBottom: 10, backgroundColor: '#f9f9f9', overflow: 'hidden' },
    pickerForm: { width: '100%', height: 40 },
    formActions: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 20, marginBottom: 20 },
    formButton: { flex: 1, padding: 12, borderRadius: 10, alignItems: 'center', marginHorizontal: 5 },
    formButtonCancel: { backgroundColor: '#6c757d' },
    formButtonSave: { backgroundColor: '#4CAF50' },
    formButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});