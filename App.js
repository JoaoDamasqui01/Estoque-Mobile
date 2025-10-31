import React, { useState, useRef, useMemo } from 'react';
import { 
    StyleSheet, 
    View, 
    Text, 
    TouchableOpacity, 
    TextInput,
    Platform,
    ScrollView, 
    Alert,
    Modal 
} from 'react-native';
// Componentes externos
import { RadioButton } from 'react-native-paper'; 
import { Picker } from '@react-native-picker/picker'; 
import { Entypo, MaterialIcons } from '@expo/vector-icons'; 

// --- COMPONENTE: IngredienteFormModal (Criação e Edição) ---
const IngredienteFormModal = ({ 
    isVisible, 
    onClose, 
    onSave, 
    itemInicial, 
    unidadesOpcoes,
    localizacoesUnicas
}) => {
    
    // 1. ESTADO LOCAL DO FORMULÁRIO
    const initialFormState = {
        nome: itemInicial?.nome || '',
        qtdAtual: itemInicial?.qtdAtual.toFixed(3).toString() || '0.000', 
        unidade: itemInicial?.unidade || unidadesOpcoes[0] || 'KG',
        pontoDePedido: itemInicial?.pontoDePedido.toString() || '0',
        localizacao: itemInicial?.localizacao || localizacoesUnicas[0] || 'Armário',
    };

    const [formData, setFormData] = useState(initialFormState);

    // Efeito para resetar/atualizar o estado do formulário quando o itemInicial ou a visibilidade muda
    React.useEffect(() => {
        setFormData(initialFormState);
    }, [itemInicial, isVisible]);


    const handleChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        // Validação básica (garante que os campos não estão vazios)
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
            ...formData,
            qtdAtual: qtdAtualNum,
            pontoDePedido: pontoDePedidoNum,
            id: itemInicial ? itemInicial.id : null, // Inclui o ID se for Edição
        };

        onSave(dadosFinais);
        onClose(); 
    };

    // Gera opções de localização dinamicamente
    const localizacaoOptions = useMemo(() => {
        const currentLocalizacoes = [...localizacoesUnicas];
        if (!currentLocalizacoes.includes(formData.localizacao) && formData.localizacao.trim()) {
            currentLocalizacoes.push(formData.localizacao);
        }
        return currentLocalizacoes.sort();
    }, [localizacoesUnicas, formData.localizacao]);


    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={estilo.modalContainer}>
                <View style={estilo.modalView}>
                    <Text style={estilo.modalTitle}>{itemInicial ? 'Editar Ingrediente' : 'Novo Ingrediente'}</Text>

                    <ScrollView style={estilo.formScrollView}>
                        
                        {/* Campo Nome */}
                        <Text style={estilo.formLabel}>Nome:</Text>
                        <TextInput
                            style={estilo.formInput}
                            value={formData.nome}
                            onChangeText={(text) => handleChange('nome', text)}
                            placeholder="Ex: Farinha de Trigo"
                        />

                        {/* Campo Quantidade Atual */}
                        <Text style={estilo.formLabel}>Qtde Atual (ex: 10.500):</Text>
                        <TextInput
                            style={estilo.formInput}
                            value={formData.qtdAtual}
                            onChangeText={(text) => handleChange('qtdAtual', text.replace(/[^0-9.]/g, ''))}
                            keyboardType="numeric"
                        />

                        {/* Campo Unidade */}
                        <Text style={estilo.formLabel}>Unidade:</Text>
                        <View style={estilo.pickerFormContainer}>
                            <Picker
                                selectedValue={formData.unidade}
                                style={estilo.pickerForm}
                                onValueChange={(itemValue) => handleChange('unidade', itemValue)}
                            >
                                {unidadesOpcoes.map(un => (
                                    <Picker.Item key={un} label={un} value={un} />
                                ))}
                            </Picker>
                        </View>
                        
                        {/* Campo Ponto de Pedido */}
                        <Text style={estilo.formLabel}>Ponto de Pedido (inteiro):</Text>
                        <TextInput
                            style={estilo.formInput}
                            value={formData.pontoDePedido}
                            onChangeText={(text) => handleChange('pontoDePedido', text.replace(/[^0-9]/g, ''))}
                            keyboardType="numeric"
                        />

                        {/* Campo Localização (Picker) */}
                        <Text style={estilo.formLabel}>Localização:</Text>
                        <View style={estilo.pickerFormContainer}>
                            <Picker
                                selectedValue={formData.localizacao}
                                style={estilo.pickerForm}
                                onValueChange={(itemValue) => handleChange('localizacao', itemValue)}
                            >
                                {localizacaoOptions.map(loc => (
                                    <Picker.Item key={loc} label={loc} value={loc} />
                                ))}
                            </Picker>
                        </View>
                        
                        {/* Se a localização atual não for uma das existentes, permite digitar */}
                        {!localizacoesUnicas.includes(formData.localizacao) && (
                            <TextInput
                                style={estilo.formInput}
                                value={formData.localizacao}
                                onChangeText={(text) => handleChange('localizacao', text)}
                                placeholder="Digite a nova localização"
                            />
                        )}
                        

                    </ScrollView>

                    <View style={estilo.modalActions}>
                        <TouchableOpacity style={[estilo.modalButton, estilo.modalButtonCancel]} onPress={onClose}>
                            <Text style={estilo.modalButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[estilo.modalButton, estilo.modalButtonSave]} onPress={handleSave}>
                            <Text style={estilo.modalButtonText}>{itemInicial ? 'Salvar Edição' : 'Adicionar'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};
// --- FIM DO IngredienteFormModal ---


// --- COMPONENTE: ItemIngrediente (Com ações de Excluir e Editar) ---
const ItemIngrediente = ({ ingrediente, onEdit, onDelete }) => {
    const isLowStock = ingrediente.qtdAtual <= ingrediente.pontoDePedido;

    // Lógica de Confirmação para Excluir (Ajuste para garantir a chamada)
    const handleDelete = () => {
        Alert.alert(
            "Confirmar Exclusão",
            `Tem certeza que deseja remover ${ingrediente.nome} do estoque?`,
            [
                { text: "Cancelar", style: "cancel" },
                // Ação de exclusão garantida na callback
                { text: "Excluir", onPress: () => onDelete(ingrediente.id) } 
            ]
        );
    };

    return (
        <View style={[estilo.itemContainer, isLowStock ? estilo.itemContainerLowStock : {}]}>
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
                {/* Botão de EDITAR */}
                <TouchableOpacity 
                    style={estilo.editButtonBlock}
                    onPress={() => onEdit(ingrediente)} 
                >
                    <Text style={estilo.buttonText}>Editar</Text>
                </TouchableOpacity>
                {/* Botão de EXCLUIR */}
                <TouchableOpacity 
                    style={estilo.deleteButtonBlock}
                    onPress={handleDelete}
                >
                    <Text style={estilo.buttonText}>Excluir</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};


// --- COMPONENTE: InventoryFilters (Botão de Criação) ---
const InventoryFilters = ({
    // ... (props de filtros)
    termoBusca, setTermoBusca,
    textInputRef,
    localizacoesUnicas,
    filtroEstoque, setFiltroEstoque,
    localizacaoSelecionada, setLocalizacaoSelecionada,
    onAdd // Função para abrir o modal de Criação
}) => {
    const PressIcon = () => {
        if (textInputRef.current) {
            textInputRef.current.focus();
        }
    };

    return (
        <View>
            {/* Barra de Pesquisa */}
            <View style={estilo.barraPesquisa}>
                <TouchableOpacity onPress={PressIcon}>
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
            <TouchableOpacity style={estilo.botaoAdicionar} onPress={onAdd}>
                <Text style={estilo.textoBotao}>Adicionar novo Ingrediente</Text>
            </TouchableOpacity>

            {/* Filtros de Estoque e Localização... */}
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

            <View style={estilo.topico}>
                <View style={estilo.tituloRowLocalizacao}> 
                    <Text style={estilo.titulo}>Localização:</Text>
                    <Picker
                        selectedValue={localizacaoSelecionada}
                        style={estilo.picker}
                        onValueChange={(itemValue) => setLocalizacaoSelecionada(itemValue)}
                    >
                        <Picker.Item label="Todos" value="todos" />
                        {localizacoesUnicas.map(localizacao => (
                            <Picker.Item key={localizacao} label={localizacao} value={localizacao} />
                        ))}
                    </Picker>
                </View>
            </View>
        </View>
    );
};


// --- COMPONENTE PRINCIPAL (InventoryManager) ---
export default function InventoryManager() {
    const dadosIniciais = [
        { id: 1, nome: "Farinha de trigo", qtdAtual: 15.000, unidade: "KG", pontoDePedido: 10, localizacao: "Armário" },
        { id: 2, nome: "Açúcar Refinado", qtdAtual: 5.500, unidade: "KG", pontoDePedido: 8, localizacao: "Armário" },
        { id: 3, nome: "Fermento Biológico", qtdAtual: 0.500, unidade: "PACOTE", pontoDePedido: 1, localizacao: "Geladeira" },
        { id: 4, nome: "Chocolate em pó", qtdAtual: 0.900, unidade: "KG", pontoDePedido: 2, localizacao: "Armário" },
        { id: 5, nome: "Creme de Leite", qtdAtual: 1.500, unidade: "UNIDADE", pontoDePedido: 3, localizacao: "Geladeira" },
        { id: 6, nome: "Carne Moída", qtdAtual: 2.000, unidade: "KG", pontoDePedido: 5, localizacao: "Freezer" },
    ];
    
    // ESTADOS
    const [ingredientes, setIngredientes] = useState(dadosIniciais);
    const [filtroEstoque, setFiltroEstoque] = useState('todos');
    const [localizacaoSelecionada, setLocalizacaoSelecionada] = useState('todos');
    const [termoBusca, setTermoBusca] = useState('');
    const textInputRef = useRef(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [itemSendoEditado, setItemSendoEditado] = useState(null); 

    // Opções de Localização e Unidade
    const localizacoesUnicas = useMemo(() => {
        return Array.from(new Set(ingredientes.map(i => i.localizacao))).sort();
    }, [ingredientes]);
    const unidadesOpcoes = ['KG', 'L', 'UNIDADE', 'PACOTE', 'GR']; 
    
    // --- FUNÇÕES CRUD ---

    // 1. Ação de SALVAR (Criação ou Edição)
    const handleSaveIngrediente = (dadosForm) => {
        const { id, ...novosDados } = dadosForm;

        if (id) {
            // EDIÇÃO (Update)
            setIngredientes(prev => prev.map(i => 
                i.id === id ? { ...i, ...novosDados } : i
            ));
            Alert.alert("Sucesso", `${novosDados.nome} atualizado!`);
        } else {
            // CRIAÇÃO (Create)
            // Gera o novo ID (o maior ID + 1)
            const novoId = ingredientes.length > 0 ? Math.max(...ingredientes.map(i => i.id)) + 1 : 1;
            const novoIngrediente = { id: novoId, ...novosDados };
            setIngredientes(prev => [...prev, novoIngrediente]);
            Alert.alert("Sucesso", `${novosDados.nome} adicionado!`);
        }
    };

    // 2. Ação de EXCLUIR (Delete) - INTEGRADA
    const excluirIngrediente = (idParaExcluir) => {
        // Filtra o array, removendo o ingrediente com o ID
        setIngredientes(prev => prev.filter(ingrediente => ingrediente.id !== idParaExcluir));
        Alert.alert("Sucesso", "Ingrediente removido.");
    };

    // 3. Ação de Abrir Modal para CRIAÇÃO
    const handleAbrirCriacao = () => {
        setItemSendoEditado(null); 
        setModalVisible(true);
    };

    // 4. Ação de Abrir Modal para EDIÇÃO
    const handleAbrirEdicao = (ingrediente) => {
        setItemSendoEditado(ingrediente); 
        setModalVisible(true);
    };

    // Ação: FECHA MODAL
    const handleFecharModal = () => {
        setModalVisible(false);
        setItemSendoEditado(null); 
    };

    // --- FILTRAGEM ---
    const listaFiltrada = useMemo(() => {
        // ... (Lógica de Filtragem)
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


    return (
        <ScrollView style={estilo.scrollContainer}> 
            <View style={estilo.container}> 
                
                <InventoryFilters
                    filtroEstoque={filtroEstoque}
                    setFiltroEstoque={setFiltroEstoque}
                    localizacaoSelecionada={localizacaoSelecionada}
                    setLocalizacaoSelecionada={setLocalizacaoSelecionada}
                    termoBusca={termoBusca}
                    setTermoBusca={setTermoBusca}
                    textInputRef={textInputRef}
                    localizacoesUnicas={localizacoesUnicas}
                    onAdd={handleAbrirCriacao} 
                />

                {/* LISTA DE INGREDIENTES */}
                <Text style={estilo.tituloLista}>Itens no Estoque ({listaFiltrada.length} encontrado(s)):</Text>
                <View style={estilo.listaContainer}>
                    {listaFiltrada.map((item) => (
                        <ItemIngrediente 
                            key={item.id} 
                            ingrediente={item} 
                            onEdit={handleAbrirEdicao}   
                            onDelete={excluirIngrediente} // Função de exclusão que está funcionando
                        />
                    ))}
                    {listaFiltrada.length === 0 && (
                        <Text style={estilo.semResultados}>Nenhum ingrediente encontrado com os filtros aplicados.</Text>
                    )}
                </View>

            </View>
            
            {/* COMPONENTE MODAL DE FORMULÁRIO (Criação/Edição) */}
            <IngredienteFormModal
                isVisible={modalVisible}
                onClose={handleFecharModal}
                onSave={handleSaveIngrediente} 
                itemInicial={itemSendoEditado} 
                unidadesOpcoes={unidadesOpcoes}
                localizacoesUnicas={localizacoesUnicas} 
            />
        </ScrollView>
    );
}

// --- ESTILOS ---
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
    picker: { height: 50, flex: 1, borderWidth: 1, borderRadius: 10, backgroundColor: '#f0f0f0' },
    tituloLista: { fontSize: 20, fontWeight: 'bold', marginTop: 10, marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#ccc', paddingBottom: 5 },
    listaContainer: { gap: 12 },
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
    semResultados: { textAlign: 'center', marginTop: 20, fontSize: 16, color: '#666' },

    // ESTILOS DO MODAL
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