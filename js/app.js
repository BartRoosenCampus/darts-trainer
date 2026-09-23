"use strict";
import {Product} from "./classes/Product.js";
import {Storage} from "./classes/Storage.js";

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('Service Worker registered!', reg))
            .catch(err => console.error('Service Worker registration failed:', err));
    });
}

const keyboard = document.getElementById("keyboard");
const overview = document.getElementById("overview");
const btnShowOverview = document.getElementById("show-overview");
const btnShowMenu = document.getElementById("show-menu");
const btnReset = document.getElementById("reset");

const storage = new Storage();
btnShowOverview.addEventListener("click", () => {
    toggleView("overview");
});
btnShowMenu.addEventListener("click", () => {
    toggleView("keyboard");
});

btnReset.addEventListener("click", () => {
    storage.reset();
});



let products = storage.get();

if (null === products) {
    products = [
        new Product("Coca Cola", 2.00),
        new Product("Cola zero", 2.00),        
        new Product("Ice Tea", 2.00),
        new Product("Ice Tea zero", 2.00),
        new Product("Ice Tea green", 2.00),
        new Product("Ice Tea peach", 2.00),
        new Product("Water plat", 2.00),
        new Product("Water bruis", 2.00),
        new Product("Chocomelk", 2.00),
        new Product("Gini", 2.00),
        new Product("Fanta", 2.00),
        new Product("Schweppes tonic", 2.00),
        new Product("Schweppes agrum", 2.00),
        new Product("Stella (vat)", 2.50),
        new Product("Hoegaarden (vat)", 2.50),
        new Product("Jupiler (fles)", 2.50),
        new Product("Grisette (glutenvrij)", 2.50),
        new Product("Jupiler 0,0", 2.50),
        new Product("Kriek Lindemans", 2.50),
        new Product("Aquarius geel", 2.50),
        new Product("Aquarius rood", 2.50),
        new Product("Tönissteiner", 2.50),
        new Product("Duvel", 4.00),
        new Product("Cornet", 4.00),
        new Product("Omer", 4.00),
        new Product("Orval", 4.00),
        new Product("Alpaïde blond cuvée", 4.00),
        new Product("Witte martini", 4.00),
        new Product("Kasteel rouge 0,0", 4.00),
        new Product("Sportzot", 4.00),
        new Product("Rosé wijn", 4.00),
        new Product("Cava", 4.00),
        new Product("Witte wijn", 4.00),
        new Product("Bellini", 4.00),
        new Product("Aperol Spritz", 5.00),
        new Product("Warme chocomelk", 2.00),
        new Product("Koffie", 2.00),
        new Product("Koffie deca", 2.00),
        new Product("Koffie latte", 2.00),
        new Product("Thee (zie assortiment)", 2.00),
        new Product("Croque met saus", 2.50),
        new Product("Chips", 2.00),
        new Product("Boulet", 2.50),
        new Product("Cervela", 2.50),
        new Product("Portie koud gemengd", 4.00)
    ];
}

drawTable(products);
createOverview();
toggleView("keyboard")

function drawTable(products) {
    keyboard.innerHTML = ``;

    for (const product of products) {
        const row = document.createElement("div");
        row.classList.add("product");
        const name = document.createElement("div");
        const price = document.createElement("div");
        const amount = document.createElement("div");
        amount.classList.add("text-center");

        name.innerText = product.getName();
        name.addEventListener("click", () => {
            product.add();
            drawTable(products);
            createOverview();
        });

        amount.addEventListener("click", () => {
            product.subtract();
            drawTable(products);
            createOverview();
        });

        price.innerText = `€ ${product.getPrice()}`;
        amount.innerText = product.getAmount();
        row.appendChild(name);
        row.appendChild(price);
        row.appendChild(amount);
        keyboard.append(row);
    }
    storage.set(products);
}

function createOverview() {
    overview.innerHTML = ``;
    let grandTotal = 0.00;
    for (const product of products) {
        if (0 !== product.getAmount()) {
            grandTotal += parseFloat(product.getTotal());
            const row = document.createElement("div");
            const left = document.createElement("div");
            const right = document.createElement("div");
            row.classList.add("overviewRow");
            left.innerText = `${product.getAmount()} x ${product.getName()}`;
            right.innerText = `= ${product.getTotal()}€`;
            row.append(left);
            row.append(right);
            overview.append(row);
        }
    }
    const row = document.createElement("div");
    const left = document.createElement("div");
    const right = document.createElement("div");
    row.classList.add("totalRow");
    row.classList.add("overviewRow");
    left.innerText = `Totaal:`;
    right.innerText = `= ${grandTotal.toFixed(2)}€`;
    row.append(left);
    row.append(right);
    overview.append(row);
}

function toggleView(id) {
    const views = document.getElementsByClassName("views");

    for (const view of views) {
        view.style.display = "none";
    }

    if (id === "overview") {
        overview.style.display = "block";
    }

    if (id === "keyboard") {
        keyboard.style.display = "block";
    }
}


