const transacoes = [
    { categoria: "Alimentação", valor: 150 },
    { categoria: "Transporte", valor: 50 },
    { categoria: "Alimentação", valor: 100 },
    { categoria: "Lazer", valor: 200 },
    { categoria: "Transporte", valor: 70 },
    { categoria: "Cavalo", valor: 70 },
    { categoria: "Bode", valor: 70 },
    { categoria: "Lula", valor: 70 },
    { categoria: "Lula", valor: 70 },
];

// Cores para as categorias (vai repetir se mais categorias que cores)
const cores = [
    "#4caf50",
    "#2196f3",
    "#ff9800",
    "#e91e63",
    "#9c27b0",
    "#00bcd4",
    "#f44336",
];

// 1. Dados fictícios:
// labels
const meses = [
    "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
    "Jul", "Ago", "Set", "Out", "Nov", "Dez"
];
// valores (você estenderá esse array quando trouxer da API)
const entradasPorMes = [1200, 1500, 1300, 1600, 1400, 1700, 1800, 1900, 1750, 1650, 1550, 1450];
const saidasPorMes = [800, 900, 750, 1100, 950, 1200, 1000, 1150, 980, 1020, 890, 960];

// 2. Cores para as barras
const corEntrada = "#4e4cafff";
const corSaida = "#f89500ff";

function desenharGraficoMeses() {
    const canvas = document.getElementById("graficoMeses");
    const ctx = canvas.getContext("2d");

    // 1) parâmetros de layout
    const padding = 40;       // espaço ao redor do gráfico
    const numMeses = meses.length;
    const larguraBarra = 30;       // cada barra tem 20px de largura
    const gapIntraGrupo = 10;        // 8px entre entrada e saída do mesmo mês
    const espacamento = 60;       // 40px entre cada par de meses

    // 2) calcular largura total e definir tamanho do canvas
    const totalWidth = padding * 2
        + numMeses * (larguraBarra      // barra de entrada
            + gapIntraGrupo     // gap dentro do par
            + larguraBarra      // barra de saída
            + espacamento);     // gap entre pares
    canvas.width = totalWidth;
    canvas.height = 300;              // altura fixa

    // 3) escalas
    const alturaArea = canvas.height - padding * 2;
    const maxValor = Math.max(...entradasPorMes, ...saidasPorMes);
    const escalaY = alturaArea / maxValor;

    // 4) desenhar barras por mês
    meses.forEach((mes, i) => {
        // posição X do início do par de barras
        const xBase = padding
            + i * (larguraBarra + gapIntraGrupo + larguraBarra + espacamento);

        // --- barra de Entrada ---
        const hEnt = entradasPorMes[i] * escalaY;
        ctx.fillStyle = corEntrada;
        ctx.fillRect(
            xBase,
            canvas.height - padding - hEnt,
            larguraBarra,
            hEnt
        );

        // --- barra de Saída ---
        const hSai = saidasPorMes[i] * escalaY;
        ctx.fillStyle = corSaida;
        ctx.fillRect(
            xBase + larguraBarra + gapIntraGrupo,
            canvas.height - padding - hSai,
            larguraBarra,
            hSai
        );

        // --- rótulo do mês, centralizado no par ---
        ctx.fillStyle = "#333";
        ctx.font = "14px Arial";
        ctx.textAlign = "center";
        const xRotulo = xBase + larguraBarra + gapIntraGrupo / 2;
        ctx.fillText(
            mes,
            xRotulo,
            canvas.height - padding + 16
        );
    });

    // 5) eixos (opcional)
    ctx.strokeStyle = "#ccc";
    ctx.beginPath();
    // eixo X
    ctx.moveTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    // eixo Y
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.stroke();
}


function calcularResumo(transacoes) {
    const resumo = {};
    transacoes.forEach(({ categoria, valor }) => {
        if (!resumo[categoria]) resumo[categoria] = 0;
        resumo[categoria] += valor;
    });
    return resumo;
}

function desenharGraficoPizza(resumo) {
    const canvas = document.getElementById("graficoPizza");
    const ctx = canvas.getContext("2d");
    const total = Object.values(resumo).reduce((a, b) => a + b, 0);

    let anguloInicial = -0.5 * Math.PI;
    let indexCor = 0;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const legendaDiv = document.getElementById("legenda");
    legendaDiv.innerHTML = "";

    for (const categoria in resumo) {
        const valor = resumo[categoria];
        const fatiaAngulo = (valor / total) * 2 * Math.PI;
        const cor = cores[indexCor % cores.length];

        // Desenha a fatia
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, canvas.height / 2);
        ctx.arc(
            canvas.width / 2,
            canvas.height / 2,
            200,
            anguloInicial,
            anguloInicial + fatiaAngulo
        );
        ctx.closePath();
        ctx.fillStyle = cor;
        ctx.fill();

        // 🎁 Adiciona a porcentagem no centro da fatia
        const anguloMeio = anguloInicial + fatiaAngulo / 2;
        const raioTexto = 100; // distância do centro para o texto
        const xTexto = canvas.width / 2 + raioTexto * Math.cos(anguloMeio);
        const yTexto = canvas.height / 2 + raioTexto * Math.sin(anguloMeio);

        const porcentagem = ((valor / total) * 100).toFixed(1) + "%";

        ctx.fillStyle = "#fff"; // Cor do texto
        ctx.font = "16px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(porcentagem, xTexto, yTexto);

        const itemLegenda = document.createElement("div");
        itemLegenda.className = "item-legenda";

        const boxCor = document.createElement("div");
        boxCor.className = "cor-box";
        boxCor.style.backgroundColor = cor;

        const textoCategoria = document.createElement("span");
        textoCategoria.textContent = categoria;

        const valorSpan = document.createElement("span");
        valorSpan.className = "valor-legenda";
        valorSpan.textContent = `R$ ${valor.toFixed(2)}`;

        itemLegenda.appendChild(boxCor);
        itemLegenda.appendChild(textoCategoria);
        itemLegenda.appendChild(valorSpan);
        legendaDiv.appendChild(itemLegenda);

        anguloInicial += fatiaAngulo;
        indexCor++;
    }
}

const resumo = calcularResumo(transacoes);
desenharGraficoPizza(resumo);
desenharGraficoMeses();