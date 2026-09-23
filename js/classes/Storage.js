"use strict";

import {Product} from "./Product.js";

export class Storage {
    set(products) {
        localStorage.setItem("klup-products", JSON.stringify(products));
    }

    get(){
        let products = localStorage.getItem('klup-products');

        if(null === products) return products;

        products = JSON.parse(products);

        const list = [];
        for (const p of products) {
            list.push(new Product(p.name, p.price, p.amount, p.total));
        }

        return list;
    }

    reset() {
        localStorage.removeItem("klup-products");
        location.reload();
    }
}