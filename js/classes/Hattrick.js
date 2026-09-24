"use strict";

export class Hattrick {
    hattrick = true;
    toThrow = 20;
    darts = 0;
    turn = 0;
    throws = [];
    type = ["mis", "single", "double", "triple"];
    continue = true;
    view = {
        to_throw: document.getElementById("to_throw"),
        buttons_area: document.getElementById("buttons_area"),
        darts_thrown: document.getElementById("darts_thrown"),
        to_beat: document.getElementById("to_beat"),
        history: document.getElementById("history"),
        resetBtn: document.getElementById("resetBtn"),
        completeReset: document.getElementById("completeReset"),
        stepBackBtn: document.getElementById("stepBackBtn"),
    };
    chart = null;

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

        this.view.stepBackBtn.addEventListener("click", () => {
            this.takeAStepBack();
        });
    }

    takeAStepBack() {
        const lastThrow = this.throws.pop();

        if ("hattrick" === lastThrow) {
            this.manipulateStats("hattrick", true);
            this.toThrow++;
            this.takeAStepBack();
            return;
        }
        if ("mis" === lastThrow) {
            this.manipulateStats("mis", true);
        }

        if ("mis" !== lastThrow && "hattrick" !== lastThrow) {
            const array = lastThrow.split(" ");
            this.toThrow += this.type.indexOf(array[0]);
            this.manipulateStats(array[0], true);
        }

        this.darts -= 1;

        if (0 === this.turn) this.turn = 2;
        else this.turn -= 1;

        this.drawView();
    }

    hit(x) {
        if (this.continue) {
            this.darts++;
            this.turn++;
            console.log(this.turn);
            if (0 === x) this.hattrick = false;
            this.throws.push((0 === x) ? this.type[x] : `${this.type[x]} ${this.toThrow}`);
            this.deduct(x);
            this.manipulateStats(this.type[x]);

            if (this.throws.length >= 3) {
                const last3Items = this.throws.slice(-3);

                if (this.turn === 3) {
                    if (!last3Items.includes("hattrick") && !last3Items.includes("mis")) {
                        this.deduct(1);
                        this.throws.push("hattrick")
                        this.manipulateStats("hattrick");
                    }

                    this.nextTurn();
                }
            }
        }

        this.drawView();
    }

    drawView() {
        this.view.to_throw.innerText = (0 === this.toThrow) ? "B" : this.toThrow;

        this.view.buttons_area.innerHTML = "";
        if (this.continue) {
            for (const type of this.type) {
                const newBtn = document.createElement("button");
                newBtn.addEventListener("click", () => {
                    this.hit(this.type.indexOf(type));
                });
                newBtn.innerText = type;
                newBtn.classList.add(`btn_${type}`);
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

        this.drawPieChart();
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

        if (0 === result) this.throws.push("Evenaring van het record");
        else if (0 === oldRecord || 0 > result) {
            this.throws.push("Nieuw record !!!");
            localStorage.setItem('hattrick', this.darts.toString());
        } else if (0 < result) this.throws.push("Geen nieuw record");

        this.view.stepBackBtn.disabled = true;
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

    getStats() {
        if (null === localStorage.getItem("hattrickStats")) {
            const stats = {
                mis: 0,
                single: 0,
                double: 0,
                triple: 0,
                hattrick: 0,
            };

            localStorage.setItem("hattrickStats", JSON.stringify(stats));
        }

        return JSON.parse(localStorage.getItem("hattrickStats"));
    }

    manipulateStats(type, remove = false) {
        const stats = this.getStats();
        const types = ["single", "double", "triple", "mis", "hattrick"];

        if (!types.includes(type)) {
            console.log("Hell yeah, this does not exist");
            return false;
        }

        if (remove) stats[type]--;
        else stats[type]++;

        localStorage.setItem("hattrickStats", JSON.stringify(stats));
    }

    drawPieChart() {
        const piePieces = this.calculatePieChartData();

        if (this.chart) {
            this.chart.data.datasets[0].data = piePieces;
            this.chart.update();
            return;
        }

        const data = {
            datasets: [{
                data: piePieces,
                backgroundColor: [
                    '#ef4444', '#eab308', '#f97316', '#39ff14'
                ],
                borderWidth: 0
            }]
        };

        const config = {
            type: 'pie',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        };

        this.chart = new Chart(document.getElementById('myPieChart'), config);
    }

    calculatePieChartData() {
        const stats = this.getStats();
        const total = Object.values(stats).reduce((sum, count) => sum + count, 0);
        const data = [];

        data.push(this.calculatePercentage(parseFloat(total), parseFloat(stats.mis)));
        data.push(this.calculatePercentage(parseFloat(total), parseFloat(stats.single)));
        data.push(this.calculatePercentage(parseFloat(total), parseFloat(stats.double)));
        data.push(this.calculatePercentage(parseFloat(total), parseFloat(stats.triple)));

        return data;
    }

    calculatePercentage(total, amount) {
        if (0 === total || 0 === amount) return 0;

        return parseFloat(amount) / (parseFloat(total) / 100);
    }
}
