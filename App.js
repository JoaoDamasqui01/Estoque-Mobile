// screens/Home.js
import React, { useState, useMemo, useRef } from 'react';
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
import { RadioButton } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { Entypo, MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const api = "http://192.168.56.1:5000/ingredientes";

// --- CONFIGURAÇÕES GLOBAIS ---
const LOCALIZACOES_OPCOES = ['Armário', 'Geladeira', 'Freezer'];

// --- COMPONENTE PRINCIPAL: Home ---
export default function Home() {
    const navigation = useNavigation();

    // --- 1. ESTADOS DA APLICAÇÃO ---
    const [ingredientes, setIngredientes] = useState([]);
    const [filtroEstoque, setFiltroEstoque] = useState('todos');
    const [localizacaoSelecionada, setLocalizacaoSelecionada] = useState('todos');
    const [termoBusca, setTermoBusca] = useState('');
    const textInputRef = useRef(null);

    // --- 2. FUNÇÕES CRUD E API ---

    // CRUD: Leitura (Fetch)
    const fetchIngredientes = async () => {
        try {
            const response = await fetch(api);

            if (response.status === 204) {
                setIngredientes([]);
                return;
            }

            if (!response.ok) {
                console.log('Falha ao buscar ingredientes: ' + response.status);
            }

            const dados = await response.json();

            if (dados && dados.ingredientes && Array.isArray(dados.ingredientes)) {

                const dadosMapeados = dados.map(item => ({
                    id: item.id,
                    nome: item.nome,
                    quantidade: item.quantidade,
                    unidade_medida: item.unidade_medida,
                    ponto_pedido: item.ponto_pedido,
                    localizacao: item.localizacao
                }));

                setIngredientes(dadosMapeados);
        
            } else { 
                console.warn("Resposta da API em formato inesperado:", dados);
                setIngredientes([]);
                
            }

            setIngredientes(dadosMapeados);
        } catch (error) {
            console.log("Erro na busca inicial:", error);
            // Em caso de erro na conexão, tente carregar dados mockados ou deixar vazio
            setIngredientes([]);
           
        }
    };

    // Efeito para recarregar a lista sempre que a tela Home estiver em foco
    useFocusEffect(
        React.useCallback(() => {
            fetchIngredientes();
        }, [])
    );

    // CRUD: Excluir
    const EXCLUIRIngrediente = async (idParaExcluir, nome) => {
        console.log(
            "Confirmação",
            `Tem certeza que deseja excluir o ingrediente: ${nome}?`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Excluir",
                    onPress: async () => {
                        try {
                            const response = await fetch(`${api}/${idParaExcluir}`, {
                                method: 'DELETE',
                            });

                            if (!response.ok) {
                                throw new Error('Erro ao deletar ingrediente: ' + response.statusText);
                            }
                            setIngredientes(prev => prev.filter(ingrediente => ingrediente.id !== idParaExcluir));
                            console.log("Sucesso", "Ingrediente removido com sucesso.");
                        } catch (error) {
                            console.error("Erro ao deletar:", error);
                            console.log("Erro", "Falha ao deletar o ingrediente.");
                        }
                    },
                    style: "destructive"
                }
            ]
        );
    };

    // --- 3. LÓGICA DE FILTRAGEM ---
    const listaFiltrada = useMemo(() => {
        return ingredientes.filter(ingrediente => {
            const nomeIngredienteLower = ingrediente.nome.toLowerCase();
            const termoBuscaLower = termoBusca.toLowerCase();

            const passaNoFiltroBusca = nomeIngredienteLower.includes(termoBuscaLower);
            const isLowStock = ingrediente.qtdAtual <= ingrediente.pontoDePedido;
            const passaNoFiltroEstoque = filtroEstoque === 'todos' || (filtroEstoque === 'baixoEstoque' && isLowStock);
            const passaNoFiltroLocalizacao = localizacaoSelecionada === 'todos' || ingrediente.localizacao === localizacaoSelecionada;

            return passaNoFiltroBusca && passaNoFiltroEstoque && passaNoFiltroLocalizacao;
        });
    }, [ingredientes, termoBusca, filtroEstoque, localizacaoSelecionada]);

    // --- 4. RENDERIZAÇÃO PRINCIPAL ---
    return (
        <ScrollView style={estilo.scrollContainer}>
            <View style={estilo.container}>

                {/* --- SEÇÃO 1: FILTROS E BUSCA --- */}
                <View>
                    <View style={estilo.barraPesquisa}>
                        <TouchableOpacity onPress={() => textInputRef.current?.focus()}>
                            <Entypo name="magnifying-glass" style={estilo.iconBuscar} size={24} color="white" />
                        </TouchableOpacity>
                        <TextInput
                            ref={textInputRef}
                            style={estilo.pesquisa}
                            placeholder='Buscar por um Ingrediente'
                            placeholderTextColor="#ffffff99"
                            value={termoBusca}
                            onChangeText={setTermoBusca}
                        />
                    </View>

                    {/* BOTÃO ADICIONAR (Navega para a tela IngredienteForm) */}
                    <TouchableOpacity
                        style={estilo.botaoAdicionar}
                        // item: null indica criação de novo item
                        onPress={() => navigation.navigate('Formulario', { item: null })}
                    >
                        <Text style={estilo.textoBotao}>Adicionar novo Ingrediente</Text>
                    </TouchableOpacity>

                    {/* Filtros de Estoque (RadioButton) */}
                    <View style={estilo.topico}>
                        <View style={estilo.tituloRow}>
                            <Text style={estilo.tituloFiltro}>Filtros:</Text>
                            <RadioButton.Group onValueChange={setFiltroEstoque} value={filtroEstoque}>
                                <View style={estilo.opcoesContainer}>
                                    <View style={estilo.opcaoItem}>
                                        <RadioButton value="todos" color="#f4a020" />
                                        <Text style={estilo.radioText}>Todos</Text>
                                    </View>
                                    <View style={estilo.opcaoItem}>
                                        <RadioButton value="baixoEstoque" color="#f4a020" />
                                        <Text style={estilo.radioText}>Baixo Estoque</Text>
                                    </View>
                                </View>
                            </RadioButton.Group>
                        </View>
                    </View>

                    {/* Filtro de Localização (Picker) */}
                    <View style={estilo.topico}>
                        <View style={estilo.tituloRowLocalizacao}>
                            <Text style={estilo.titulo}>Localização:</Text>
                            <View style={estilo.pickerContainer}>
                                <Picker
                                    selectedValue={localizacaoSelecionada}
                                    style={estilo.picker}
                                    onValueChange={(itemValue) => setLocalizacaoSelecionada(itemValue)}
                                >
                                    <Picker.Item label="Todos" value="todos" />
                                    {LOCALIZACOES_OPCOES.map(localizacao => (
                                        <Picker.Item key={localizacao} label={localizacao} value={localizacao} />
                                    ))}
                                </Picker>
                            </View>
                        </View>
                    </View>
                </View>

                {/* --- SEÇÃO 2: LISTA DE INGREDIENTES --- */}
                <Text style={estilo.tituloLista}>Itens no Estoque ({listaFiltrada.length} encontrado(s)):</Text>
                <View style={estilo.listaContainer}>
                    {listaFiltrada.map((ingredientes) => {
                        const isLowStock = ingredientes.qtdAtual <= ingredientes.pontoDePedido;
                        return (
                            <View
                                key={ingredientes.id_Ingrediente}
                                style={[estilo.itemContainer, isLowStock ? estilo.itemContainerLowStock : {}]}
                            >
                                <View style={estilo.detailsGrid}>
                                    {/* Detalhes do Ingredientes */}
                                    <View style={estilo.itemColumn}>
                                        <View style={estilo.detailBlock}>
                                            <Text style={estilo.itemLabelBlock}>Ingredientes:</Text>
                                            <Text style={[estilo.itemValueBlock, estilo.itemNome]}>{ingredientes.nome}</Text>
                                            {isLowStock && <MaterialIcons name="warning" size={16} color="#f4a020" style={estilo.warningIconBlock} />}
                                        </View>
                                        <View style={estilo.detailBlock}>
                                            <Text style={estilo.itemLabelBlock}>Qtde atual:</Text>
                                            <Text style={[estilo.itemValueBlock, estilo.qtdAtualValue]}>{ingredientes.quantidade.toFixed(3)} {ingredientes.unidade}</Text>
                                        </View>
                                    </View>

                                    {/* Detalhes de Localização e Ponto de Pedido */}
                                    <View style={estilo.itemColumn}>
                                        <View style={estilo.detailBlock}>
                                            <Text style={estilo.itemLabelBlock}>Localização:</Text>
                                            <Text style={estilo.itemValueBlock}>{ingredientes.localizacao}</Text>
                                        </View>
                                        <View style={estilo.detailBlock}>
                                            <Text style={estilo.itemLabelBlock}>Ponto de pedido:</Text>
                                            <Text style={estilo.itemValueBlock}>{ingredientes.pontoDePedido}</Text>
                                        </View>
                                    </View>
                                </View>

                                {/* Linha de Ações (Botões) */}
                                <View style={estilo.itemActionsContainerBlock}>
                                    <TouchableOpacity
                                        style={estilo.editButtonBlock}
                                        // Navega para a tela de Formulário passando o item para edição
                                        onPress={() => navigation.navigate('Formulario', { item: ingredientes })}
                                    >
                                        <Text style={estilo.buttonText}>Editar</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={estilo.deleteButtonBlock}
                                        onPress={() => EXCLUIRIngrediente(ingredientes.id, ingredientes.nome)}
                                    >
                                        <Text style={estilo.buttonText}>Excluir</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        );
                    })}
                    {listaFiltrada.length === 0 && (
                        <Text style={estilo.semResultados}>Nenhum ingrediente encontrado com os filtros aplicados.</Text>
                    )}
                </View>
            </View>
        </ScrollView>
    );
}

// --- ESTILOS (Mantidos e consolidados) ---
const estilo = StyleSheet.create({
    scrollContainer: { flex: 1, backgroundColor: '#f5f5f5' },
    container: { flex: 1, backgroundColor: '#fff', alignItems: 'stretch', justifyContent: 'flex-start', padding: 20 },
    barraPesquisa: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#c73131ff', borderRadius: 10, paddingHorizontal: 15, height: 50, marginBottom: 5 },
    iconBuscar: { marginRight: 10 },
    pesquisa: { flex: 1, padding: 0, height: '100%', backgroundColor: 'transparent', fontWeight: 'bold', fontSize: 16, color: '#ffffff' },
    botaoAdicionar: { backgroundColor: '#f4a020', padding: 15, alignItems: 'center', marginTop: 10, borderRadius: 10, marginBottom: 20 },
    textoBotao: { color: '#ffffff', fontWeight: 'bold', fontSize: 16 },
    topico: { width: '100%', marginBottom: 20 },
    tituloRow: { width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 5 },
    tituloRowLocalizacao: { width: '100%', flexDirection: 'row', alignItems: 'center', marginBottom: 5, gap: 10 },
    tituloFiltro: { fontSize: 20, fontWeight: 'bold', marginRight: 15 },
    titulo: { fontSize: 20, fontWeight: 'bold' },
    opcoesContainer: { flexDirection: 'row' },
    opcaoItem: { flexDirection: 'row', alignItems: 'center', marginRight: 20 },
    radioText: { fontSize: 16, marginLeft: -5 },
    pickerContainer: { flex: 1, borderWidth: 1, borderRadius: 10, backgroundColor: '#f0f0f0', overflow: 'hidden', height: 40 },
    picker: { height: 40, width: '100%' },
    tituloLista: { fontSize: 20, fontWeight: 'bold', marginTop: 10, marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#ccc', paddingBottom: 5 },
    listaContainer: { gap: 12 },
    semResultados: { textAlign: 'center', marginTop: 20, fontSize: 16, color: '#666' },

    // Estilos do ItemIngrediente (para a lista)
    itemContainer: { backgroundColor: '#e0e0e0', padding: 15, borderRadius: 15, borderWidth: 1, borderColor: '#ccc', ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3 }, android: { elevation: 3 } }) },
    itemContainerLowStock: { borderColor: '#f4a020', borderWidth: 3 },
    detailsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
    itemColumn: { flex: 1, alignItems: 'center', paddingHorizontal: 5 },
    detailBlock: { marginBottom: 10, alignItems: 'center', width: '100%' },
    itemLabelBlock: { fontWeight: 'bold', fontSize: 16, color: '#333', marginBottom: 2 },
    itemValueBlock: { fontSize: 16, color: '#555', fontWeight: '600', textAlign: 'center', paddingHorizontal: 5 },
    itemNome: { fontSize: 18, fontWeight: 'bold', color: '#222' },
    qtdAtualValue: { fontSize: 18, fontWeight: 'bold', color: '#000' },
    warningIconBlock: { position: 'absolute', right: 0, top: 0 },
    itemActionsContainerBlock: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, paddingHorizontal: 5 },
    editButtonBlock: { backgroundColor: '#4CAF50', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 10, flex: 1, marginRight: 10, alignItems: 'center' },
    deleteButtonBlock: { backgroundColor: '#F44336', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 10, flex: 1, alignItems: 'center' },
    buttonText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
});