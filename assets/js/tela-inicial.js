function atualizarDados() {
    getTransactions();
    getMonthlySummary();
}

document.addEventListener("DOMContentLoaded", function () {

    atualizarDados(); // busca inicial

    // Atualiza a cada 10 segundos (10000 ms)
    setInterval(() => {
        atualizarDados();
    }, 10000);

    const btnTransacao = document.querySelector(".btn-transacao");
    const modal = document.getElementById("modal");
    const closeModal = document.querySelector(".close");

    btnTransacao.addEventListener("click", function (e) {
        e.preventDefault();
        modal.classList.remove("hidden");
    });

    closeModal.addEventListener("click", function () {
        modal.classList.add("hidden");
    });

    // fecha o modal se clicar fora
    /* window.addEventListener("click", function (e) {
        if (e.target === modal) {
            modal.classList.add("hidden");
        }
    }); */

    // destaque do botão selecionado (entrada ou saída)
    const tipoBotoes = document.querySelectorAll("[data-modal-tipo]");
    tipoBotoes.forEach(btn => {
        btn.addEventListener("click", () => {
            tipoBotoes.forEach(b => {
                b.classList.remove("active-entrada", "active-saida");
            });

            const tipo = btn.getAttribute("data-modal-tipo");
            btn.classList.add(`active-${tipo}`);
        });
    });
});

function exibirTransacoes(lista) {
    const tbody = document.getElementById('table-body');
    if (!tbody) return;

    tbody.innerHTML = '';

    const root = getComputedStyle(document.documentElement);

    lista.forEach(transacao => {
        const tr = document.createElement('tr');
        tr.classList.add('table-row');
        tr.setAttribute('data-tipo', transacao.tipo);  // adiciona tipo no tr

        const tdTitulo = document.createElement('td');
        tdTitulo.textContent = transacao.titulo;

        const tdPreco = document.createElement('td');
        tdPreco.textContent = Number(transacao.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        // Aplica cor baseado no tipo
        if (transacao.tipo === 'saida') {
            tdPreco.style.color = root.getPropertyValue('--colorError').trim();
        } else if (transacao.tipo === 'entrada') {
            tdPreco.style.color = root.getPropertyValue('--colorSuccess').trim();
        }

        const tdCategoria = document.createElement('td');
        tdCategoria.textContent = transacao.categoria;

        const tdData = document.createElement('td');
        const dataFormatada = new Date(transacao.data).toLocaleDateString('pt-BR');
        tdData.textContent = dataFormatada;

        tr.appendChild(tdTitulo);
        tr.appendChild(tdPreco);
        tr.appendChild(tdCategoria);
        tr.appendChild(tdData);

        tbody.appendChild(tr);
    });
}


function exibirResumoMensal(data) {
    const entradaCard = document.querySelector('[data-tipo="entrada"]');
    const saidaCard = document.querySelector('[data-tipo="saida"]');
    const totalCard = document.querySelector('[data-tipo="total"]');

    entradaCard.querySelector('.valor-card').textContent = data.entrada.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    entradaCard.querySelector('.ultima-transacao').textContent = data.ultima_entrada_data
        ? `Última entrada dia ${formatCustomDate(data.ultima_entrada_data)}`
        : 'Nenhuma entrada';

    saidaCard.querySelector('.valor-card').textContent = `- ${data.saida.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
    saidaCard.querySelector('.ultima-transacao').textContent = data.ultima_saida_data
        ? `Última saída dia ${formatCustomDate(data.ultima_saida_data)}`
        : 'Nenhuma saída';

    totalCard.querySelector('.valor-card').textContent = data.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    totalCard.querySelector('.ultima-transacao').textContent = getCurrentMonthInterval();
}

function getMonthName(date) {
    return date.toLocaleString('pt-BR', { month: 'long' }).replace(/^./, c => c.toUpperCase());
}

function formatCustomDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = getMonthName(date);

    return `${day} de ${month}`;
}

function getCurrentMonthInterval() {
    const now = new Date();
    const month = getMonthName(now);
    const year = now.getFullYear();
    const lastDay = new Date(year, now.getMonth() + 1, 0).getDate();

    return `De 1 a ${lastDay} de ${month}`;
}


