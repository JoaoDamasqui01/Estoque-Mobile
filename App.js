import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Alert,
    Modal,
    Platform
} from 'react-native';
// Importações necessárias
import { RadioButton } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { Entypo, MaterialIcons } from '@expo/vector-icons';

const api = "http://localhost:5000/ingredientes";

// --- CONFIGURAÇÕES GLOBAIS ---
/*const DADOS_INICIAIS = [
    { id: 1, nome: "Farinha de trigo", qtdAtual: 15.000, unidade: "KG", pontoDePedido: 10, localizacao: "Armário" },
    { id: 2, nome: "Açúcar Refinado", qtdAtual: 5.500, unidade: "KG", pontoDePedido: 8, localizacao: "Armário" },
    { id: 3, nome: "Fermento Biológico", qtdAtual: 0.500, unidade: "PACOTE", pontoDePedido: 1, localizacao: "Geladeira" },
    { id: 4, nome: "Chocolate em pó", qtdAtual: 0.900, unidade: "KG", pontoDePedido: 2, localizacao: "Armário" },
    { id: 5, nome: "Creme de Leite", qtdAtual: 1.500, unidade: "UNIDADE", pontoDePedido: 3, localizacao: "Geladeira" },
    { id: 6, nome: "Carne Moída", qtdAtual: 2.000, unidade: "KG", pontoDePedido: 5, localizacao: "Freezer" },
];*/

const UNIDADES_OPCOES = ['KG', 'LITROS', 'UNIDADE', 'PACOTE'];

const LOCALIZACOES_OPCOES = ['Armário', 'Geladeira', 'Freezer'];

// --- COMPONENTE PRINCIPAL: InventoryManager (Tudo consolidado aqui) ---
export default function InventoryManager() {
    // --- 1. ESTADOS DA APLICAÇÃO ---
    const [ingredientes, setIngredientes] = useState([]);
    const [filtroEstoque, setFiltroEstoque] = useState('todos');
    const [localizacaoSelecionada, setLocalizacaoSelecionada] = useState('todos');
    const [termoBusca, setTermoBusca] = useState('');
    const textInputRef = useRef(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [itemSendoEditado, setItemSendoEditado] = useState(null); // Null para criação, Objeto para edição



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


    // --- 4. FUNÇÕES CRUD E MODAL ---


    // CRUD: Excluir
    const EXCLUIRIngrediente = async (idParaExcluir) => {
        try {
            const response = await fetch(`${api}/${idParaExcluir}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Erro ao deletar ingrediente: ' + response.statusText);
            }
            setIngredientes(prev => prev.filter(ingrediente => ingrediente.id !== idParaExcluir));
            console.log("Sucesso ", { idParaExcluir }, " Ingrediente removido.");
        } catch (error) {
            console.error("Erro ao deletar:", error);
            console.log("Erro", "Falha ao deletar o ingrediente.");
        }
    };


    // Modal: Ações
    const handleFecharModal = () => {
        setModalVisible(false);
        setItemSendoEditado(null);
    };


    //CRUD: Criar 
    const CRIARIngrediente = async (dadosFinais) => {
        try {
            const response = await fetch(api, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosFinais),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error('Erro ao criar novo ingrediente');
            }

            const dadosResposta = await response.json();
            const novoingredienteAPI = dadosResposta.ingrediente;
            setIngredientes(prev => [...prev, novoingredienteAPI]);

            console.log("Sucesso ", "novo ingrediente criado.");
        } catch (error) {
            console.error("Erro ao criar:", error);
        }

    };

    //CRUD: Editar
    const EDICAOIngrediente = async (idParaEditar) => {
        try {
            const reposte = await fetch(`${api}/${idParaEditar}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nomeIngrediente }),
            });

            if (!reposte.ok) {
                throw new Error('Erro ao editar ingrediente' + reposte.statusText);
            }

            const dadosResposta = await reposte.json();
            const ingredienteEditado = dadosResposta.ingrediente;

            setIngredientes()(prev => prev.map(ingrediente =>
                ingrediente.id === idParaEditar ? ingredienteEditado : ingrediente
            ));
            console.log("Sucesso ", { idParaEditar }, " ingrediente editado.");

        } catch (error) {
            console.error("Erro ao editar:", error);
            console.log("Erro", "Falha ao editar o ingrediente.");
        }


    };

    // --- 5. LÓGICA DO FORMULÁRIO (PARA O MODAL) ---

    // Estado inicial do Formulário (depende de itemSendoEditado)
    const initialFormState = useMemo(() => ({
        nome: itemSendoEditado?.nome || '',
        qtdAtual: (itemSendoEditado?.qtdAtual || 0).toFixed(3).toString(),
        unidade: itemSendoEditado?.unidade || UNIDADES_OPCOES[0] || 'KG',
        pontoDePedido: (itemSendoEditado?.pontoDePedido || 0).toString(),
        localizacao: itemSendoEditado?.localizacao || LOCALIZACOES_OPCOES[0] || 'Armário',
    }), [itemSendoEditado, LOCALIZACOES_OPCOES]);

    const [formData, setFormData] = useState(initialFormState);

    const fetchIngredientes = async () => {
        try {
            const response = await fetch(api);

            if (response.status === 204) {
                setIngredientes([]); // Vazio (No Content)
                return;
            }

            if (!response.ok) {
                throw new Error('Falha ao buscar ingredientes: ' + response.status);
            }

            const dados = await response.json();
            setIngredientes(dados); // Recebe o array da API
        } catch (error) {
            console.error("Erro na busca inicial:", error);
            Alert.alert("Erro de API", "Não foi possível carregar os ingredientes.");
            setIngredientes([]); // Garante que ingredientes é um array mesmo em caso de falha
        }
    };

    // Efeito para resetar/atualizar o estado do formulário quando o item de edição muda
    useEffect(() => {
        fetchIngredientes();
    }, []);


    const handleChangeForm = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Lógica do botão Salvar/Adicionar
    const handleSaveIngrediente = () => {
        // Validação básica
        if (!formData.nome.trim() || !formData.qtdAtual.trim() || !formData.pontoDePedido.trim()) {
            Alert.alert("Erro", "Todos os campos de texto devem ser preenchidos.");
            return;
        }

        // Validação numérica e conversão
        const qtdAtualNum = parseFloat(formData.qtdAtual.replace(',', '.'));
        const pontoDePedidoNum = parseInt(formData.pontoDePedido, 10);

        if (isNaN(qtdAtualNum) || isNaN(pontoDePedidoNum) || qtdAtualNum < 0 || pontoDePedidoNum < 0) {
            Alert.alert("Erro", "Quantidade e Ponto de Pedido devem ser números positivos válidos.");
            return;
        }

        // Formata os dados para o formato final
        const dadosFinais = {
            nome: formData.nome.trim(),
            // CHAVES DO MODELO (BACKEND)
            quantidade: qtdAtualNum,
            unidade_medida: formData.unidade, // CORRIGIDO
            ponto_pedido: pontoDePedidoNum, // CORRIGIDO

            // Outros campos obrigatórios:
            localizacao: formData.localizacao,
            fornecedor: 'N/A',
            preco_custo: 0.00
        };
        if (itemSendoEditado) {
            // EDIÇÃO (Update)
            EDICAOIngrediente(itemSendoEditado.id, dadosFinais);
            console.log("Sucesso", `${dadosFinais.nome} editado!`);
        } else {
            // CRIAÇÃO (Create)
            CRIARIngrediente(dadosFinais);
            console.log("Sucesso", `${dadosFinais.nome} adicionado!`);
        }

        handleFecharModal();
    };


    // --- 6. RENDERIZAÇÃO PRINCIPAL ---
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

                    {/* BOTÃO ADICIONAR */}
                    <TouchableOpacity style={estilo.botaoAdicionar} onPress={() => { setItemSendoEditado(null); setModalVisible(true); }}>
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
                                        <Text style={estilo.radioText}>Baixa Estoque</Text>
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

                {/* --- SEÇÃO 2: LISTA DE INGREDIENTES (ItemIngrediente embutido) --- */}
                <Text style={estilo.tituloLista}>Itens no Estoque ({listaFiltrada.length} encontrado(s)):</Text>
                <View style={estilo.listaContainer}>
                    {listaFiltrada.map((ingrediente) => {
                        const isLowStock = ingrediente.qtdAtual <= ingrediente.pontoDePedido;
                        return (
                            <View
                                key={ingrediente.id}
                                // Estilos do IngredienteItem
                                style={[estilo.itemContainer, isLowStock ? estilo.itemContainerLowStock : {}]}
                            >
                                <View style={estilo.detailsGrid}>
                                    {/* Detalhes do Ingrediente */}
                                    <View style={estilo.itemColumn}>
                                        <View style={estilo.detailBlock}>
                                            <Text style={estilo.itemLabelBlock}>Ingrediente:</Text>
                                            <Text style={[estilo.itemValueBlock, estilo.itemNome]}>{ingrediente.nome}</Text>
                                            {isLowStock && <MaterialIcons name="warning" size={16} color="#f4a020" style={estilo.warningIconBlock} />}
                                        </View>
                                        <View style={estilo.detailBlock}>
                                            <Text style={estilo.itemLabelBlock}>Qtde atual:</Text>
                                            <Text style={[estilo.itemValueBlock, estilo.qtdAtualValue]}>{ingrediente.qtdAtual.toFixed(3)} {ingrediente.unidade}</Text>
                                        </View>
                                    </View>

                                    {/* Detalhes de Localização e Ponto de Pedido */}
                                    <View style={estilo.itemColumn}>
                                        <View style={estilo.detailBlock}>
                                            <Text style={estilo.itemLabelBlock}>Localização:</Text>
                                            <Text style={estilo.itemValueBlock}>{ingrediente.localizacao}</Text>
                                        </View>
                                        <View style={estilo.detailBlock}>
                                            <Text style={estilo.itemLabelBlock}>Ponto de pedido:</Text>
                                            <Text style={estilo.itemValueBlock}>{ingrediente.pontoDePedido}</Text>
                                        </View>
                                    </View>
                                </View>

                                {/* Linha de Ações (Botões) */}
                                <View style={estilo.itemActionsContainerBlock}>
                                    <TouchableOpacity
                                        style={estilo.editButtonBlock}
                                        onPress={() => { setItemSendoEditado(ingrediente); setModalVisible(true); }}
                                    >
                                        <Text style={estilo.buttonText}>Editar</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={estilo.deleteButtonBlock}
                                        onPress={() => EXCLUIRIngrediente(ingrediente.id, ingrediente.nome)}
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

            {/* --- SEÇÃO 3: MODAL DE FORMULÁRIO (IngredienteFormModal embutido) --- */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={handleFecharModal}
            >
                <View style={estilo.modalContainer}>
                    <View style={estilo.modalView}>
                        <Text style={estilo.modalTitle}>{itemSendoEditado ? 'Editar Ingrediente' : 'Novo Ingrediente'}</Text>

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
                            <Text style={estilo.formLabel}>Qtde Atual (ex: 10.500):</Text>
                            <TextInput
                                style={estilo.formInput}
                                value={formData.qtdAtual}
                                onChangeText={(text) => handleChangeForm('qtdAtual', text.replace(/[^0-9.]/g, ''))}
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

                        {/* Botões do Modal */}
                        <View style={estilo.modalActions}>
                            <TouchableOpacity style={[estilo.modalButton, estilo.modalButtonCancel]} onPress={handleFecharModal}>
                                <Text style={estilo.modalButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[estilo.modalButton, estilo.modalButtonSave]} onPress={handleSaveIngrediente}>
                                <Text style={estilo.modalButtonText}>{itemSendoEditado ? 'Salvar Edição' : 'Adicionar'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>


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

    // Estilos do Modal (para o formulário)
    modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
    modalView: { width: '90%', maxHeight: '80%', backgroundColor: 'white', borderRadius: 20, padding: 25, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 },
    modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, color: '#c73131' },
    formScrollView: { width: '100%' },
    formLabel: { fontSize: 16, fontWeight: 'bold', marginTop: 10, marginBottom: 5, color: '#333' },
    formInput: { width: '100%', height: 40, borderColor: '#ccc', borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, marginBottom: 10, backgroundColor: '#f9f9f9' },
    pickerFormContainer: { borderColor: '#ccc', borderWidth: 1, borderRadius: 8, marginBottom: 10, backgroundColor: '#f9f9f9', overflow: 'hidden' },
    pickerForm: { width: '100%', height: 40 },
    modalActions: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 20 },
    modalButton: { flex: 1, padding: 12, borderRadius: 10, alignItems: 'center', marginHorizontal: 5 },
    modalButtonCancel: { backgroundColor: '#6c757d' },
    modalButtonSave: { backgroundColor: '#4CAF50' },
    modalButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});
