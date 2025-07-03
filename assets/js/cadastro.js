let tipoSelecionado = null;
let timeoutNotificacao = null;

const DOM = {
    valorInput: document.getElementById("valorInput"),
    limparBtn: document.getElementById("limparValor"),
    categoriaInput: document.getElementById("categoria"),
    listaCategorias: document.getElementById("lista-categorias"),
    form: document.getElementById("form-transacao"),
    tituloInput: document.getElementById("titulo"),
    notificacao: document.getElementById("notificacao"),
    modal: document.getElementById("modal"),
};

const categoriasDisponiveis = [
    "Água", "Aluguel", "Alimentação", "Assinaturas", "Cartão de Crédito",
    "Compras Online", "Cuidados Pessoais", "Cursos", "Doações", "Educação",
    "Emergências", "Energia", "Farmácia", "Freelance", "Impostos",
    "Investimentos", "Internet", "Lazer", "Manutenção", "Pet",
    "Presentes", "Poupança", "Reserva de Emergência", "Reembolsos", "Rendimentos",
    "Restaurante", "Roupas", "Salário", "Saúde", "Serviços Domésticos",
    "Supermercado", "Telefone", "Transporte", "Viagem", "Outros"
];

const categoriasNormalizadas = categoriasDisponiveis.map(c => ({
    original: c,
    normalizada: removerAcentos(c.toLowerCase())
}));

// --- Utilitários ---
function removerAcentos(texto) {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function mostrarNotificacao(mensagem, tipo = "error", duracao = 8000) {
    clearTimeout(timeoutNotificacao);
    DOM.notificacao.textContent = mensagem;
    DOM.notificacao.className = `notificacao show ${tipo}`;
    DOM.notificacao.classList.remove("hidden");

    timeoutNotificacao = setTimeout(() => {
        DOM.notificacao.classList.remove("show");
        setTimeout(() => DOM.notificacao.classList.add("hidden"), 300);
    }, duracao);
}

function ehCategoriaValida(categoria) {
    const normalizada = removerAcentos(categoria.toLowerCase());
    return categoriasNormalizadas.some(c => c.normalizada === normalizada);
}

function formatarParaMoeda(valor) {
    const numeros = valor.replace(/\D/g, "");
    if (!numeros) return "";

    const floatValue = parseFloat(numeros) / 100;
    if (floatValue > 99999999.99) {
        mostrarNotificacao("Valor máximo permitido: R$ 99.999.999,99");
        return "";
    }

    return floatValue.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function atualizarListaCategorias(filtro) {
    const normalizado = removerAcentos(filtro.toLowerCase());
    const resultados = categoriasNormalizadas
        .filter(c => c.normalizada.includes(normalizado))
        .map(c => c.original);

    DOM.listaCategorias.innerHTML = resultados.length
        ? resultados.map(c => `<li>${c}</li>`).join("")
        : `<li style="color: #999; pointer-events: none;">Nenhuma categoria encontrada</li>`;

    DOM.listaCategorias.classList.remove("hidden");
}

function resetFormulario() {
    DOM.tituloInput.value = "";
    DOM.valorInput.value = "";
    DOM.categoriaInput.value = "";
    tipoSelecionado = null;
    DOM.limparBtn.style.display = "none";
    document.querySelectorAll(".tipo-btn").forEach(b =>
        b.classList.remove("active-entrada", "active-saida")
    );
}

// --- Manipuladores de eventos ---

function handleValorInput(e) {
    const input = e.target;
    input.value = formatarParaMoeda(input.value);
    DOM.limparBtn.style.display = input.value ? "block" : "none";
    input.selectionStart = input.selectionEnd = input.value.length;
}

function limparValor() {
    DOM.valorInput.value = "";
    DOM.limparBtn.style.display = "none";
    DOM.valorInput.focus();
}

function handleCategoriaInput(e) {
    atualizarListaCategorias(e.target.value.trim());
}

function handleCategoriaClick(e) {
    if (e.target.tagName === "LI" && !e.target.textContent.includes("Nenhuma")) {
        DOM.categoriaInput.value = e.target.textContent;
        DOM.listaCategorias.classList.add("hidden");
    }
}

function handleTipoClick(e) {
    tipoSelecionado = e.target.getAttribute("data-modal-tipo");
    document.querySelectorAll(".tipo-btn").forEach(b =>
        b.classList.remove("active-entrada", "active-saida")
    );

    e.target.classList.add(tipoSelecionado === "entrada" ? "active-entrada" : "active-saida");
}

async function handleFormSubmit(e) {
    e.preventDefault();

    const titulo = DOM.tituloInput.value.trim();
    const valorStr = DOM.valorInput.value.trim();
    const categoria = DOM.categoriaInput.value.trim();

    if (!titulo || !valorStr || !tipoSelecionado || !categoria) {
        mostrarNotificacao("Preencha todos os campos!");
        return;
    }

    const valor = parseFloat(valorStr.replace(/\s|R\$|\./g, "").replace(",", "."));
    if (isNaN(valor) || valor <= 0) {
        mostrarNotificacao("Digite um valor válido maior que zero!");
        return;
    }

    if (!ehCategoriaValida(categoria)) {
        mostrarNotificacao("Categoria inválida! Selecione uma das opções sugeridas.");
        return;
    }

    const transacao = {
        titulo,
        valor,
        tipo: tipoSelecionado,
        categoria
    };

    try {
        await postTransactions(transacao); 

        resetFormulario();
        mostrarNotificacao("Transação salva com sucesso!", "success");
        DOM.modal.classList.add("hidden");
        await atualizarDados(); 
    } catch (erro) {
        console.error("Erro ao salvar transação:", erro);
        mostrarNotificacao("Erro ao salvar transação. Tente novamente.");
    }
}

// --- Inicialização ---
function init() {
    DOM.valorInput.addEventListener("input", handleValorInput);
    DOM.limparBtn.addEventListener("click", limparValor);
    DOM.categoriaInput.addEventListener("input", handleCategoriaInput);
    DOM.categoriaInput.addEventListener("focus", () =>
        atualizarListaCategorias(DOM.categoriaInput.value)
    );
    DOM.listaCategorias.addEventListener("click", handleCategoriaClick);

    document.querySelectorAll(".tipo-btn").forEach(btn =>
        btn.addEventListener("click", handleTipoClick)
    );

    DOM.form.addEventListener("submit", handleFormSubmit);

    document.addEventListener("click", (e) => {
        if (!e.target.closest(".categoria-wrapper")) {
            DOM.listaCategorias.classList.add("hidden");
        }
    });
}

document.addEventListener("DOMContentLoaded", init);
