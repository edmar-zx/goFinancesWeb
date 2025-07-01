const valorInput = document.getElementById("valorInput");
const limparBtn = document.getElementById("limparValor");
const categoriaInput = document.getElementById("categoria");
const listaCategorias = document.getElementById("lista-categorias");
const form = document.getElementById('form-transacao');
const tituloInput = document.getElementById('titulo');
let tipoSelecionado = null;

const categoriasDisponiveis = [
    'Supermercado', 'Energia', 'Água', 'Transporte', 'Aluguel', 'Internet', 'Telefone', 'Saúde',
    'Farmácia', 'Educação', 'Assinaturas', 'Lazer', 'Restaurante', 'Roupas', 'Manutenção',
    'Impostos', 'Doações', 'Pet', 'Viagem', 'Cursos', 'Compras Online', 'Serviços Domésticos',
    'Cuidados Pessoais', 'Emergências', 'Reserva de Emergência', 'Poupança', 'Cartão de Crédito',
    'Salário', 'Freelance', 'Rendimentos', 'Investimentos', 'Presentes', 'Reembolsos', 'Outros'
];

const categoriasNormalizadas = categoriasDisponiveis.map(cat => {
    const normalizada = removerAcentos(cat.toLowerCase());
    return { original: cat, normalizada };
});

function removerAcentos(texto) {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function ehCategoriaValida(categoriaDigitada) {
    const categoriaNormalizada = removerAcentos(categoriaDigitada.toLowerCase());
    return categoriasNormalizadas.some(cat => cat.normalizada === categoriaNormalizada);
}

function filtrarCategorias(filtroDigitado) {
    const filtroNormalizado = removerAcentos(filtroDigitado.toLowerCase());
    return categoriasNormalizadas
        .filter(cat => cat.normalizada.includes(filtroNormalizado))
        .map(cat => cat.original);
}

function formatarParaMoeda(valor) {
    const numeros = valor.replace(/\D/g, "");
    if (!numeros) return "";

    let floatValue = parseFloat(numeros) / 100;
    if (floatValue > 99999999.99) {
        alert("Valor máximo permitido: R$ 99.999.999,99");
        return "";
    }

    return floatValue.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
}

// Atualiza o campo e move o cursor para o final
valorInput.addEventListener("input", e => {
  const input = e.target;
  input.value = formatarParaMoeda(input.value);
  limparBtn.style.display = input.value ? "block" : "none";

  // Mantém o cursor no final
  input.selectionStart = input.selectionEnd = input.value.length;
});

// Botão "x" para limpar
limparBtn.addEventListener("click", () => {
    valorInput.value = "";
    limparBtn.style.display = "none";
    valorInput.focus();
});


function atualizarLista(filtro) {
    const filtradas = filtrarCategorias(filtro);

    listaCategorias.innerHTML = filtradas.length
        ? filtradas.map(cat => `<li>${cat}</li>`).join("")
        : `<li style="color: #999; pointer-events: none;">Nenhuma categoria encontrada</li>`;

    listaCategorias.classList.remove("hidden");
}

// Atualiza enquanto digita
categoriaInput.addEventListener("input", e => {
    const valor = e.target.value.trim();
    atualizarLista(valor); // sempre atualiza, mesmo se estiver vazio
});



categoriaInput.addEventListener("focus", () => {
    atualizarLista(categoriaInput.value);
});


// Clica para escolher
listaCategorias.addEventListener("click", (e) => {
    if (e.target.tagName === "LI" && e.target.textContent !== "Nenhuma categoria encontrada") {
        categoriaInput.value = e.target.textContent;
        listaCategorias.classList.add("hidden");
    }
});

// Fecha lista se clicar fora
document.addEventListener("click", (e) => {
    if (!e.target.closest(".categoria-wrapper")) {
        listaCategorias.classList.add("hidden");
    }
});


// Captura o tipo da transação ao clicar nos botões
document.querySelectorAll('.tipo-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        tipoSelecionado = btn.getAttribute('data-modal-tipo');

        // Remove classes anteriores
        document.querySelectorAll('.tipo-btn').forEach(b => {
            b.classList.remove('active-entrada', 'active-saida');
        });

        // Adiciona a classe certa dependendo do tipo
        if (tipoSelecionado === 'entrada') {
            btn.classList.add('active-entrada');
        } else if (tipoSelecionado === 'saida') {
            btn.classList.add('active-saida');
        }
    });
});

// Captura o envio do formulário
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const titulo = tituloInput.value.trim();
    const valorFormatado = valorInput.value.trim();
    const categoria = categoriaInput.value.trim();

    if (!titulo || !valorFormatado || !tipoSelecionado || !categoria) {
        alert('Preenchaaa todos os campos.');
        return;
    }

    // Converte valor para número (ex: "R$ 1.234,56" → 1234.56)
    const valorNumerico = parseFloat(
        valorFormatado.replace(/\s|R\$|\./g, '').replace(',', '.')
    );

    if (isNaN(valorNumerico) || valorNumerico <= 0) {
        alert('Digite um valor válido maior que zero.');
        return;
    }

    // Verifica se a categoria é válida (sem acento e com comparação em lowercase)
    if (!ehCategoriaValida(categoria)) {
        alert('Categoria inválida. Selecione uma das opções sugeridas.');
        return;
    }

    // Data atual em UTC-3 (Brasília)
    const dataBrasilia = new Date();
    dataBrasilia.setHours(dataBrasilia.getHours() - 3);

    const transacao = {
        titulo,
        valor: valorNumerico,
        tipo: tipoSelecionado,
        categoria,
        data: dataBrasilia.toISOString()
    };

    postTransactions(transacao);

    // Limpar campos após salvar
    tituloInput.value = '';
    valorInput.value = '';
    categoriaInput.value = '';
    tipoSelecionado = null;
    document.querySelectorAll('.tipo-btn').forEach(b => b.classList.remove('active-entrada', 'active-saida'));
    limparBtn.style.display = "none";

    alert('Transação salva com sucesso!');

    // Fecha o modal após cadastrar
    const modal = document.getElementById("modal");
    modal.classList.add("hidden");

    // Atualiza a tela
    atualizarDados();
});




