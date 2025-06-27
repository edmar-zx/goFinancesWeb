


function getTransactions() {

    fetch('http://localhost:3000/api/v1/transactions')
        .then(T => T.json())
        .then(data => {
            exibirTransacoes(data)
        })
        .catch(err => console.log(err.message))
}

function postTransactions() {

}




function exibirTransacoes(lista) {

    const tbody = document.getElementById('table-body');
    if (!tbody) return;

    tbody.innerHTML = '';
    console.log(tbody)



    lista.forEach(transacao => {
        const tr = document.createElement('tr');
        tr.classList.add('table-row');

        const tdTitulo = document.createElement('td');
        tdTitulo.textContent = transacao.titulo;

        const tdPreco = document.createElement('td');
        tdPreco.textContent = transacao.valor;

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


//exibirTransacoes();
getTransactions();