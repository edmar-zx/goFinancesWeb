# GoFinances Web

Aplicação web para controle financeiro pessoal, desenvolvida com **HTML, CSS e JavaScript**. Nela, é possível visualizar um resumo mensal com entradas, saídas e total, além de listar todas as transações realizadas no mês atual.

---

## Funcionalidades

### Dashboard (Tela principal)

- **Cards de Resumo**:
  - Entradas do mês
  - Saídas do mês
  - Total (Entradas - Saídas)

- **Tabela de Transações**:
  - Título
  - Valor (formatado em `BRL`)
  - Categoria
  - Data da transação

> Obs: os dados apresentados referem-se sempre ao **mês atual**.

---

## Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript (ES6+)
- API REST com Node.js + Express
- Banco de dados PostgreSQL

---

## 📥 Clonando o Repositório

Para começar, clone o projeto para sua máquina local com o seguinte comando:

```bash
git clone https://github.com/edmar-zx/goFinancesWeb.git
```

## Como Executar

### 1. Backend (API)

Crie o banco de dados com a tabela abaixo:

```sql
CREATE TABLE transacoes (
	id SERIAL PRIMARY KEY,
	titulo VARCHAR(30) NOT NULL,
	valor NUMERIC(10,2) NOT NULL,
	tipo VARCHAR(10) NOT NULL CHECK(tipo in ('entrada', 'saida')),
	categoria VARCHAR(25) NOT NULL,
	data TIMESTAMP(0) NOT NULL DEFAULT now()
);
```

### 2. Servidor Web

### Opção Recomendada: **Go Live (VS Code)**

O **Go Live** é uma extensão do Visual Studio Code que permite rodar um servidor web local rapidamente, facilitando o desenvolvimento e visualização de projetos web em tempo real.

#### Como usar o Go Live:

1. **Instale a extensão Go Live**:
   - Abra o VS Code.
   - Vá em **Extensões** (ícone de quadrado no menu lateral ou `Ctrl+Shift+X`).
   - Busque por **Live Server** (nome oficial da extensão).
   - Clique em **Instalar**.

2. **Abra seu projeto** no VS Code.

3. **Inicie o servidor**:
   - Clique com o botão direito no arquivo `index.html` (ou no arquivo principal da sua aplicação).
   - Selecione **Open with Live Server**.
   - Ou clique no botão **Go Live** que aparece no canto inferior direito da janela do VS Code.

4. **Visualize sua aplicação**:
   - Seu navegador abrirá automaticamente com a URL do servidor local (ex: `http://127.0.0.1:5500`).
   - Qualquer alteração no código será atualizada automaticamente no navegador.
