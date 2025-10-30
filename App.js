import React, { useState, useRef } from 'react';
import { 
    StyleSheet, 
    View, 
    Text, 
    TouchableOpacity, 
    TextInput,
    Platform,
    ScrollView 
} from 'react-native';
// Componentes externos: certifique-se de que essas bibliotecas estão instaladas
import { RadioButton } from 'react-native-paper'; 
import { Picker } from '@react-native-picker/picker'; 
// Importamos FontAwesome para o ícone de caneta (Editar)
import { Entypo, MaterialIcons, Ionicons, FontAwesome } from '@expo/vector-icons'; 

// --- NOVO COMPONENTE: ItemIngrediente ---
const ItemIngrediente = ({ ingrediente }) => {
    // Verifica se a quantidade atual está abaixo do ponto de pedido (alerta de baixo estoque)
    const isLowStock = ingrediente.qtdAtual <= ingrediente.pontoDePedido;

    return (
        <View style={[estilo.itemContainer, isLowStock ? estilo.itemContainerLowStock : {}]}>
            
            {/* Linhas de Detalhes: Transformadas para exibição vertical (Título acima do Valor) */}
            <View style={estilo.detailsGrid}>

                {/* Coluna 1: Ingrediente e Quantidade Atual */}
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

                {/* Coluna 2: Localização e Ponto de Pedido */}
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
                <TouchableOpacity style={estilo.editButtonBlock}>
                    <Text style={estilo.buttonText}>Editar</Text>
                </TouchableOpacity>
                {/* Ícone X (Excluir) */}
                <TouchableOpacity style={estilo.deleteButtonBlock}>
                    <Text style={estilo.buttonText}>X</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};
// --- FIM DO COMPONENTE ItemIngrediente ---


export default function App() {
    // 1. ESTADOS E REFS NECESSÁRIOS
    const [filtroEstoque, setFiltroEstoque] = useState('todos');
    const [localizacaoSelecionada, setLocalizacaoSelecionada] = useState('todos');
    const [termoBusca, setTermoBusca] = useState(''); // Estado para o termo de pesquisa
    const textInputRef = useRef(null);

    // DADOS DE EXEMPLO (Simulando o recebimento via API ou banco de dados)
    const dadosIngredientes = [
        { id: 1, nome: "Farinha de trigo", qtdAtual: 15.000, unidade: "KG", pontoDePedido: 10, localizacao: "Armário" },
        { id: 2, nome: "Açúcar Refinado", qtdAtual: 5.500, unidade: "KG", pontoDePedido: 8, localizacao: "Armário" },
        { id: 3, nome: "Fermento Biológico", qtdAtual: 0.500, unidade: "PACOTE", pontoDePedido: 1, localizacao: "Geladeira" },
        { id: 4, nome: "Chocolate em pó", qtdAtual: 0.900, unidade: "KG", pontoDePedido: 2, localizacao: "Armário" },
        { id: 5, nome: "Creme de Leite", qtdAtual: 1.500, unidade: "UNIDADE", pontoDePedido: 3, localizacao: "Geladeira" },
        { id: 6, nome: "Carne Moída", qtdAtual: 2.000, unidade: "KG", pontoDePedido: 5, localizacao: "Freezer" },
    ];


    // 2. Lógica de Filtragem Combinada
    const listaFiltrada = dadosIngredientes.filter(ingrediente => {
        const nomeIngredienteLower = ingrediente.nome.toLowerCase();
        const termoBuscaLower = termoBusca.toLowerCase();

        // 1. Filtro de Busca (Search Bar)
        // Verifica se o nome do ingrediente contém o termo de busca
        const passaNoFiltroBusca = nomeIngredienteLower.includes(termoBuscaLower);

        // 2. Filtro de Estoque (Radio Buttons)
        const isLowStock = ingrediente.qtdAtual <= ingrediente.pontoDePedido;
        // Se 'todos' estiver selecionado, passa. Se for 'baixoEstoque', só passa se isLowStock for true.
        const passaNoFiltroEstoque = 
            filtroEstoque === 'todos' ||
            (filtroEstoque === 'baixoEstoque' && isLowStock);

        // 3. Filtro de Localização (Picker)
        // Se 'todos' estiver selecionado, passa. Senão, verifica se a localização é igual.
        const passaNoFiltroLocalizacao = 
            localizacaoSelecionada === 'todos' ||
            ingrediente.localizacao === localizacaoSelecionada;

        // O ingrediente passa se passar em TODOS os filtros
        return passaNoFiltroBusca && passaNoFiltroEstoque && passaNoFiltroLocalizacao;
    });

    // 4. FUNÇÃO DE AÇÃO
    const PressIcon = () => {
        if (textInputRef.current) {
            textInputRef.current.focus();
        }
    };

    return (
        <ScrollView style={estilo.scrollContainer}> 
            <View style={estilo.container}> 

                {/* ----------------- BARRA DE PESQUISA ----------------- */}
                <View style={estilo.barraPesquisa}>
                    
                    <TouchableOpacity onPress={PressIcon}>
                        <Entypo
                            name="magnifying-glass"
                            style={estilo.iconBuscar}
                            size={24}
                            color="white" 
                        />
                    </TouchableOpacity>

                    <TextInput
                        ref={textInputRef} 
                        style={estilo.pesquisa}
                        placeholder='Buscar por um Ingrediente'
                        placeholderTextColor="#ffffff99" 
                        value={termoBusca} // Liga o valor ao estado
                        onChangeText={setTermoBusca} // Atualiza o estado ao digitar
                    />
                </View>

                {/* ----------------- BOTÃO ADICIONAR ----------------- */}
                <TouchableOpacity style={estilo.botaoAdicionar}>
                    <Text style={estilo.textoBotao}>Adicionar novo Ingrediente</Text>
                </TouchableOpacity>

                {/* ----------------- FILTROS DE ESTOQUE ----------------- */}
                <View style={estilo.topico}>
                    <View style={estilo.tituloRow}>
                        <Text style={estilo.tituloFiltro}>Filtros:</Text>

                        <RadioButton.Group
                            onValueChange={newValue => setFiltroEstoque(newValue)}
                            value={filtroEstoque}
                        >
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

                {/* ----------------- FILTRO DE LOCALIZAÇÃO (PICKER) ----------------- */}
                <View style={estilo.topico}>
                    <View style={estilo.tituloRowLocalizacao}> 
                        <Text style={estilo.titulo}>Localização:</Text>

                        <Picker
                            selectedValue={localizacaoSelecionada}
                            style={estilo.picker}
                            onValueChange={(itemValue) => setLocalizacaoSelecionada(itemValue)}
                        >
                            <Picker.Item label="Todos" value="todos" />
                            {/* Opções ajustadas para coincidir com os dados de exemplo */}
                            <Picker.Item label="Armário" value="Armário" /> 
                            <Picker.Item label="Geladeira" value="Geladeira" />
                            <Picker.Item label="Freezer" value="Freezer" />
                        </Picker>
                    </View>
                </View>
                
                {/* ----------------- LISTA DE INGREDIENTES (USANDO MAP) ----------------- */}
                <Text style={estilo.tituloLista}>Itens no Estoque ({listaFiltrada.length} encontrado(s)):</Text>
                <View style={estilo.listaContainer}>
                    {listaFiltrada.map((item) => (
                        <ItemIngrediente key={item.id} ingrediente={item} />
                    ))}
                    {listaFiltrada.length === 0 && (
                        <Text style={estilo.semResultados}>Nenhum ingrediente encontrado com os filtros aplicados.</Text>
                    )}
                </View>

            </View>
        </ScrollView>
    );
}

const estilo = StyleSheet.create({
    scrollContainer: {
        flex: 1,
        backgroundColor: '#f5f5f5', 
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'stretch', 
        justifyContent: 'flex-start',
        padding: 20,
    },

    barraPesquisa: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#c73131ff',
        borderRadius: 10, 
        paddingHorizontal: 15,
        height: 50,
        marginBottom: 5, 
    },

    iconBuscar: {
        marginRight: 10, 
    },

    pesquisa: {
        flex: 1,
        padding: 0,
        height: '100%', 
        backgroundColor: 'transparent', 
        fontWeight: 'bold',
        fontSize: 16,
        color: '#ffffff', 
    },

    botaoAdicionar: {
        backgroundColor: '#f4a020',
        padding: 15,
        alignItems: 'center',
        marginTop: 10,
        borderRadius: 10, 
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
    
    tituloRow: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center', 
        marginBottom: 5, 
    },

    tituloRowLocalizacao: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5, 
        gap: 10,
    },

    tituloFiltro: {
        fontSize: 20,
        fontWeight: 'bold',
        marginRight: 15, 
    },
    
    titulo: { 
        fontSize: 20,
        fontWeight: 'bold',
    },

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

    picker: {
        height: 50,
        flex: 1, 
        borderWidth: 1,
        borderRadius: 10, 
        backgroundColor: '#f0f0f0', 
    },
    
    // --- ESTILOS DO NOVO COMPONENTE (ItemIngrediente) ---
    tituloLista: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingBottom: 5,
    },
    listaContainer: {
        gap: 12, 
    },
    itemContainer: {
        backgroundColor: '#e0e0e0', 
        padding: 15,
        borderRadius: 15, 
        borderWidth: 1,
        borderColor: '#ccc',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    itemContainerLowStock: {
        borderColor: '#f4a020', 
        borderWidth: 3, 
    },
    
    // --- ESTILOS PARA O LAYOUT VERTICAL ---
    detailsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15, 
    },
    itemColumn: {
        flex: 1,
        alignItems: 'center', 
        paddingHorizontal: 5,
    },
    detailBlock: {
        marginBottom: 10,
        alignItems: 'center', 
        width: '100%',
    },
    itemLabelBlock: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#333',
        marginBottom: 2,
    },
    itemValueBlock: {
        fontSize: 16, 
        color: '#555',
        fontWeight: '600',
        textAlign: 'center',
        paddingHorizontal: 5,
    },
    itemNome: { 
        fontSize: 18, 
        fontWeight: 'bold',
        color: '#222',
    },
    qtdAtualValue: {
        fontSize: 18, 
        fontWeight: 'bold',
        color: '#000',
    },
    warningIconBlock: {
        position: 'absolute', 
        right: 0,
        top: 0,
    },
    
    itemActionsContainerBlock: {
        flexDirection: 'row',
        justifyContent: 'space-between', 
        marginTop: 10,
        paddingHorizontal: 5,
    },
    editButtonBlock: {
        backgroundColor: '#4CAF50', 
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10, 
        flex: 1,
        marginRight: 10,
        alignItems: 'center',
    },
    deleteButtonBlock: {
        backgroundColor: '#F44336', 
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10, 
        flex: 1,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
    semResultados: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#666',
    }
});
