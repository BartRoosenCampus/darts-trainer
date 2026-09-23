"use strict";

import {Hattrick} from "./classes/Hattrick.js";

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('Service Worker registered!', reg))
            .catch(err => console.error('Service Worker registration failed:', err));
    });
}

const hattrick = new Hattrick();

// hattrick.hit(1);
// hattrick.hit(2);
// hattrick.hit(3);
// hattrick.hit(0);
// hattrick.hit(3);
// hattrick.hit(1);
// hattrick.hit(1);
// hattrick.hit(1);
// hattrick.hit(1);
// hattrick.hit(0);
// hattrick.hit(0);
// hattrick.hit(3);
// hattrick.hit(3);
// hattrick.hit(2);
// hattrick.hit(2);
console.log(hattrick);
