document.addEventListener("DOMContentLoaded", function () {
    const rows = document.querySelectorAll("#table tbody tr");
    const root = getComputedStyle(document.documentElement);

    rows.forEach(row => {
        const categoria = row.cells[2].textContent.trim().toLowerCase();
        const precoCell = row.cells[1];

        if (categoria === "compras") {
            precoCell.style.color = root.getPropertyValue('--colorError').trim();
        } else if (categoria === "vendas") {
            precoCell.style.color = root.getPropertyValue('--colorSuccess').trim();
        }
    });
});


/* document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("modal");
    const openBtn = document.querySelector(".btn-transacao");
    const closeBtn = document.querySelector(".close-button");

    // Impede o link de redirecionar
    openBtn.addEventListener("click", function (e) {
        e.preventDefault();
        modal.style.display = "flex";
    });

    closeBtn.addEventListener("click", function () {
        modal.style.display = "none";
    });

    // Fechar ao clicar fora do conteúdo do modal
    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
}); */