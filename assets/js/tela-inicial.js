const UI = {
    modal: document.getElementById("modal"),
    btnTransacao: document.querySelector(".btn-transacao"),
    closeModal: document.querySelector(".close"),
    tipoBotoes: document.querySelectorAll("[data-modal-tipo]"),
    cardsResumo: {
        entrada: document.querySelector('[data-tipo="entrada"]'),
        saida: document.querySelector('[data-tipo="saida"]'),
        total: document.querySelector('[data-tipo="total"]')
    },
    tabela: document.getElementById("table-body")
};

// --- Funções Utilitárias ---
function getMonthName(date) {
    return date.toLocaleString("pt-BR", { month: "long" }).replace(/^./, c => c.toUpperCase());
}

function formatCustomDate(dateString) {
    const date = new Date(dateString);
    return `${date.getDate()} de ${getMonthName(date)}`;
}

function getCurrentMonthInterval() {
    const now = new Date();
    const month = getMonthName(now);
    const year = now.getFullYear();
    const lastDay = new Date(year, now.getMonth() + 1, 0).getDate();
    return `De 1 a ${lastDay} de ${month}`;
}

// --- Atualizações ---
function atualizarDados() {
    getTransactions();
    getMonthlySummary();
}

function exibirTransacoes(lista) {
    if (!UI.tabela) return;

    UI.tabela.innerHTML = "";

    const rootStyles = getComputedStyle(document.documentElement);

    lista.forEach(({ titulo, valor, tipo, categoria, data }) => {
        const tr = document.createElement("tr");
        tr.classList.add("table-row");
        tr.dataset.tipo = tipo;

        const tdTitulo = criarTd(titulo);
        const tdPreco = criarTd(formatarValorMonetario(valor), tipo === "saida"
            ? rootStyles.getPropertyValue("--colorError").trim()
            : tipo === "entrada"
                ? rootStyles.getPropertyValue("--colorSuccess").trim()
                : "");

        const tdCategoria = criarTd(categoria);
        const tdData = criarTd(new Date(data).toLocaleDateString("pt-BR"));

        [tdTitulo, tdPreco, tdCategoria, tdData].forEach(td => tr.appendChild(td));
        UI.tabela.appendChild(tr);
    });
}

function exibirResumoMensal({ entrada, saida, total, ultima_entrada_data, ultima_saida_data }) {
    UI.cardsResumo.entrada.querySelector(".valor-card").textContent = formatarValorMonetario(entrada);
    UI.cardsResumo.entrada.querySelector(".ultima-transacao").textContent =
        ultima_entrada_data ? `Última entrada dia ${formatCustomDate(ultima_entrada_data)}` : "Nenhuma entrada";

    UI.cardsResumo.saida.querySelector(".valor-card").textContent = `- ${formatarValorMonetario(saida)}`;
    UI.cardsResumo.saida.querySelector(".ultima-transacao").textContent =
        ultima_saida_data ? `Última saída dia ${formatCustomDate(ultima_saida_data)}` : "Nenhuma saída";

    UI.cardsResumo.total.querySelector(".valor-card").textContent = formatarValorMonetario(total);
    UI.cardsResumo.total.querySelector(".ultima-transacao").textContent = getCurrentMonthInterval();
}

function formatarValorMonetario(valor) {
    return Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function criarTd(texto, cor = "") {
    const td = document.createElement("td");
    td.textContent = texto;
    if (cor) td.style.color = cor;
    return td;
}

// --- Eventos ---
function initEventos() {
    UI.btnTransacao?.addEventListener("click", e => {
        e.preventDefault();
        UI.modal.classList.remove("hidden");
    });

    UI.closeModal?.addEventListener("click", () => {
        UI.modal.classList.add("hidden");
    });

    UI.tipoBotoes.forEach(btn => {
        btn.addEventListener("click", () => {
            UI.tipoBotoes.forEach(b => b.classList.remove("active-entrada", "active-saida"));
            const tipo = btn.dataset.modalTipo;
            btn.classList.add(`active-${tipo}`);
        });
    });
}

// --- Inicialização ---
document.addEventListener("DOMContentLoaded", () => {
    atualizarDados();
    setInterval(atualizarDados, 10000);
    initEventos();
});
