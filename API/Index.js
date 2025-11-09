const express = require("express");
const cors = require("cors");

const app = express();

const corsOptions = {

  origin: '*', 
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', 
  credentials: true, 
  optionsSuccessStatus: 204 
};

app.use(cors(corsOptions))
app.use(express.json());    

const port = 8080;

bd.sync().then(() =>{
    console.log("Banco de dados sincronizado.");

    app.listen(port, () => {
        console.log(`Servidor rodando em http://localhost:${port}`);
    });
}).catch((error) => {
    console.error("Erro ao sincronizar o banco de dados:", error);
});


/**
 * 🟢 POST /ingredientes
 * CRIA um novo ingrediente.
 */
app.post("/cadastro", async (req, res) => {
    try {
        const {nome, quantidade, unidade_medida,fornecedor,
            ponto_pedido, preco_custo, localizacao
        } = req.body;

        // Validação básica se os campos obrigatórios estão presentes
        if (!nome || !quantidade || !unidade_medida || !fornecedor || !ponto_pedido || !preco_custo || !localizacao) {
            return res.status(400).json({
                erro: "Todos os campos obrigatórios devem ser preenchidos."
            });
        }

        const novoIngrediente = await Ingrediente.create(req.body);

        res.status(201).json({
            ingrediente: novoIngrediente,
            mensagem: "Ingrediente cadastrado com sucesso!"});
    } catch (error) {
        console.error("Erro ao cadastrar ingrediente:", error);
        // O status 400 é comum para erros de validação/entrada de dados
        res.status(400).json({
            erro: "Erro ao inserir o registro",
            detalhes: error.message
        });
    }
});

// -----------------------------------------------------------------------------------------------------------------------------------

/**
 * 📚 GET /ingredientes
 * LÊ (Busca) todos os ingredientes.
 */
app.get("/ingredientes", async (req, res) => {
    try {
        const ingredientes = await Ingrediente.findAll();

        if (ingredientes.length > 0) {
            res.status(200).json(ingredientes);
        } else {
            // 204 No Content, indica sucesso, mas sem dados para retornar
            res.status(204).json({
                mensagem: "Não há ingredientes cadastrados."
            });
        }
    } catch (error) {
        console.error("Erro ao buscar ingredientes:", error);
        res.status(500).json({
            erro: "Erro interno do servidor ao buscar registros"
        });
    }
});

// -----------------------------------------------------------------------------------------------------------------------------------

/**
 * 🔎 GET /ingredientes/:id
 * LÊ (Busca) um único ingrediente pelo ID.
 */
app.get("/ingredientes/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id) || id <= 0) {
        return res.status(400).json({
            mensagem: "O ID deve ser um número positivo válido."
        });
    }

    try {
        const ingrediente = await Ingrediente.findByPk(id);

        if (ingrediente) {
            res.status(200).json(ingrediente);
        } else {
            res.status(404).json({ // 404 Not Found, o recurso não existe
                mensagem: "Ingrediente não encontrado."
            });
        }
    } catch (error) {
        console.error("Erro ao buscar ingrediente:", error);
        res.status(500).json({
            erro: "Erro interno do servidor ao buscar o registro"
        });
    }
});

// -----------------------------------------------------------------------------------------------------------------------------------

/**
 * ✏️ PUT /ingredientes/:id
 * ATUALIZA um ingrediente existente pelo ID.
 * Espera um JSON no corpo da requisição com os dados a serem alterados.
 */
app.put("/ingredientes/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id) || id <= 0) {
        return res.status(400).json({
            mensagem: "O ID deve ser um número positivo válido."
        });
    }

    try {
        // Atualiza o ingrediente com os dados do corpo (req.body)
        const [updated] = await Ingrediente.update(req.body, {
            where: {
                id: id
            }
        });

        if (updated) {
            // Busca e retorna o ingrediente atualizado
            const ingredienteAtualizado = await Ingrediente.findByPk(id);
            res.status(200).json({
                ingrediente: ingredienteAtualizado,
                mensagem: "Ingrediente atualizado com sucesso!"
            });
        } else {
            res.status(404).json({
                mensagem: "Ingrediente não encontrado para atualização."
            });
        }
    } catch (error) {
        console.error("Erro ao atualizar ingrediente:", error);
        res.status(400).json({
            erro: "Erro ao atualizar o registro",
            detalhes: error.message
        });
    }
});

// -----------------------------------------------------------------------------------------------------------------------------------

/**
 * 🗑️ DELETE /ingredientes/:id
 * DELETA um ingrediente pelo ID.
 */
app.delete("/ingredientes/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id) || id <= 0) {
        return res.status(400).json({
            mensagem: "O ID deve ser um número positivo válido."
        });
    }

    try {
        const deleted = await Ingrediente.destroy({
            where: {
                id: id
            }
        });

        if (deleted) {
            // 200 OK ou 204 No Content são aceitáveis para sucesso na exclusão
            res.status(200).json({
                mensagem: "Ingrediente excluído com sucesso."
            });
        } else {
            res.status(404).json({
                mensagem: "Ingrediente não encontrado para exclusão."
            });
        }
    } catch (error) {
        console.error("Erro ao deletar ingrediente:", error);
        res.status(500).json({
            erro: "Erro interno do servidor ao excluir o registro"
        });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});