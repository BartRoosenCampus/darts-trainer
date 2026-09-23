"use strict";

export class Hattrick {
    hattrick = true;
    toThrow = 20;
    darts = 0;
    turn = 0;
    throws = [];
    type = ["Mis", "Single", "Double", "Triple"];
    continue = true;
    view = {
        to_throw: document.getElementById("to_throw"),
        buttons_area: document.getElementById("buttons_area"),
        darts_thrown: document.getElementById("darts_thrown"),
        to_beat: document.getElementById("to_beat"),
        history: document.getElementById("history"),
        resetBtn: document.getElementById("resetBtn"),
        completeReset: document.getElementById("completeReset"),
    };

    constructor() {
        this.drawView();
        this.view.resetBtn.addEventListener("click", () => {
            this.reset();
        });

        this.view.completeReset.addEventListener("click", () => {
            if (confirm('Ben je zeker dat het alles wil resetten?')) {
                this.reset(true);
            }
        });
    }

    hit(x) {
        if (this.continue) {
            this.darts++;
            this.turn++;
            if (0 === x) this.hattrick = false;
            this.throws.push((0 === x) ? this.type[x] : `${this.type[x]} ${this.toThrow}`);
            this.deduct(x);

            if (3 === this.turn) {
                if (this.hattrick) {
                    this.deduct(1);
                    this.throws.push("Hattrick")
                }
                this.nextTurn();
            }
        }

        if (!this.continue) {

        }

        this.drawView();
    }

    drawView() {
        this.view.to_throw.innerText = `${this.toThrow}`;

        this.view.buttons_area.innerHTML = "";
        if (this.continue) {
            for (const type of this.type) {
                const newBtn = document.createElement("button");
                newBtn.addEventListener("click", () => {
                    this.hit(this.type.indexOf(type));
                });
                newBtn.innerText = type;
                if (this.toThrow === 0) {
                    if (this.type.indexOf(type) < 3) this.view.buttons_area.appendChild(newBtn);
                } else {
                    this.view.buttons_area.appendChild(newBtn);
                }
            }
            const newBtn = document.createElement("button");
        }

        this.view.darts_thrown.innerText = `${this.darts}`;
        this.view.to_beat.innerText = `${localStorage.getItem("hattrick") ?? 0}`;

        this.view.history.innerHTML = "";
        for (const worp of this.throws) {
            const line = document.createElement("div");
            line.innerText = worp;
            this.view.history.prepend(line);
        }
    }

    deduct(x) {
        if (this.continue) {
            if (0 !== this.toThrow) {
                if (this.toThrow - x === -1) {
                    this.toThrow = 0;
                    this.endGame();
                }
                if (this.toThrow - x === -2) this.toThrow = 0;
                if (this.toThrow - x >= 0) this.toThrow -= x;
            } else if (0 === this.toThrow) {
                if (this.toThrow - x < 0) this.endGame();
            }
        }
    }

    endGame() {
        this.continue = false;
        const oldRecord = parseInt(localStorage.getItem("hattrick") ?? 0);

        const result = this.darts - oldRecord;

        if(0 === result) this.throws.push("Evenaring van het record");
        else if(0 === oldRecord || 0 > result) {
            this.throws.push("Nieuw record !!!");
            localStorage.setItem('hattrick', this.darts.toString());
        }
        else if(0 < result) this.throws.push("Geen nieuw record");
    }

    nextTurn() {
        this.hattrick = true;
        this.turn = 0;
    }

    reset(completeReset = false) {
        this.hattrick = true;
        this.toThrow = 20;
        this.darts = 0;
        this.turn = 0;
        this.throws = [];
        this.continue = true;
        if (completeReset) localStorage.clear();
        this.drawView();
    }
}