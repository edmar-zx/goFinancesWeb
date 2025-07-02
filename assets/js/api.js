function getCurrentYearMonth() {
    const now = new Date();
    return {
        year: now.getFullYear(),
        month: now.getMonth() + 1 // Janeiro = 0
    };
}

function getTransactions() {
    const { year, month } = getCurrentYearMonth();

    fetch(`http://localhost:3000/api/v1/transactions?year=${year}&month=${month}`)
        .then(res => res.json())
        .then(data => {
            exibirTransacoes(data);
        })
        .catch(err => console.error('Erro ao buscar transações:', err.message));
}

function postTransactions(data) {
    fetch('http://localhost:3000/api/v1/transactions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error(err.error || 'Erro ao salvar transação');
                });
            }
            return response.json();
        })
        .then(result => {
            console.log('Transação salva com sucesso:', result);

        })
        .catch(error => {
            console.error('Erro ao salvar transação:', error.message);
        });
}

function getMonthlySummary() {
    const { year, month } = getCurrentYearMonth();

    fetch(`http://localhost:3000/api/v1/monthlySummary?year=${year}&month=${month}`)
        .then(T => T.json())
        .then(data => {
            exibirResumoMensal(data);
        })
        .catch(error => {
            console.error('Erro ao buscar resumo mensal:', error);
        });
}


