const express = require("express");
const bd = require("./dataBase");
const Ingrediente = require("./modelo/Ingredientes");
const cors = require("cors");

const app = express();


app.use(cors())
app.use(express.json());

const port = 5000;

bd.sync().then(() => {
    console.log("Banco de dados sincronizado.");
}).catch((error) => {
    console.error("Erro ao sincronizar o banco de dados:", error);
});



/**
 * POST  CRIA um novo ingrediente.
 */
app.post("/ingredientes", async (req, res) => {
    try {
        const {
            nome,
            quantidade,
            unidade_medida,
            fornecedor,
            ponto_pedido,
            preco_custo,
            localizacao
        } = req.body;



        // Ajuste para evitar erro com número zero (0)
        if (!nome || !quantidade || !unidade_medida || !fornecedor || !ponto_pedido || !preco_custo || !localizacao) {
            return res.status(400).json({
                erro: "Todos os campos obrigatórios devem ser preenchidos."
            });
        }


        const novoIngrediente = await Ingrediente.create({
            nome,
            quantidade,
            unidade_medida,
            fornecedor,
            ponto_pedido,
            preco_custo,
            localizacao
        });

        res.status(201).json({
            ingrediente: novoIngrediente,
            mensagem: "Ingrediente cadastrado com sucesso!"
        });
    } catch (error) {
        console.error("Erro ao cadastrar ingrediente:", error);
        res.status(500).json({
            erro: "Erro ao inserir o registro",
            detalhes: error.message
        });
    }
});

// -----------------------------------------------------------------------------------------------------------------------------------

/**
 * 📚 GET lê todos os ingredientes.
 */
app.get("/ingredientes", async (req, res) => {
    try {
        const ingredientes = await Ingrediente.findAll();

        if (ingredientes.length > 0) {
            res.status(200).json({ ingredientes });
            console.log("Ingredientes encontrados:", ingredientes);
        } else {
            // 204 No Content, indica sucesso, mas sem dados para retornar
            res.status(204).json({
                mensagem: "Não há ingredientes cadastrados."
            });
        }
    } catch (error) {
        console.error("Erro ao buscar ingredientes:", error);
        res.status(500).json({
            erro: "Erro interno do servidor ao buscar registros",
            detalhes: error.message
        });
    }
});

// -----------------------------------------------------------------------------------------------------------------------------------

/**
 * GET LÊ um único ingrediente pelo ID.
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
 * PUT atualiza um ingrediente existente pelo ID.
 * Espera um JSON no corpo da requisição com os dados a serem alterados.
 */
app.put("/ingredientes/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        if(isNaN(id) || id <= 0){
            console.error("ID não encontrado no banco de dados: " + id)
        }

        const [atualizados] = await Ingrediente.update(req.body, {
            where: { id_Ingrediente: id }, 
        });

        if (atualizados === 0) {
            return res
                .status(404)
                .json({ mensagem: "Ingrediente não encontrado para atualização." });
        }

        const ingredienteAtualizado = await Ingrediente.findOne({
            where: { id_Ingrediente: id },
        });

        res.status(200).json({
            mensagem: "Ingrediente atualizado com sucesso!",
            ingrediente: ingredienteAtualizado,
        });
    } catch (error) {
        console.error("Erro ao atualizar ingrediente:", error);
        res.status(500).json({
            erro: "Erro interno ao atualizar o ingrediente",
            detalhes: error.message,
        });
    }
});

// -----------------------------------------------------------------------------------------------------------------------------------

/**
 * DELETE  um ingrediente pelo ID.
 */
app.delete("/ingredientes/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id) || id <= 0) {
        return res.status(400).json({
            mensagem: "ID inválido."
        });
    }

    try {
        const ingrediente = await Ingrediente.findOne(
            { where: { id_Ingrediente: id } }
        )

        if (!ingrediente) {
            return res.status(404).json({
                mensagem: "Ingrediente não encontrado para exclusão."
            });
        }

        await ingrediente.destroy();

        res.status(200).json({
            mensagem: "Ingrediente excluído com sucesso!"
        });
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