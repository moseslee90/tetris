var genes = /** @class */ (function () {
    function genes() {
    }
    return genes;
}());
var individual = /** @class */ (function () {
    function individual() {
        this.genes = {
            pointsGene: 0,
            heightPenaltyGene: 0,
            oneRowFilledGene: 0,
            twoRowsFilledGene: 0,
            threeRowsFilledGene: 0,
            fourRowsFilledGene: 0,
            consecutiveRowGene: 0,
            blankPocketGene: 0,
            borderGene: 0
        };
    }
    individual.prototype.randomGenes = function () {
        var points = 2000;
        var heightPenalty = Math.floor(Math.random() * 5) + 1;
        var oneRowFilled = Math.floor(Math.random() * 21);
        var twoRowsFilled = Math.floor(Math.random() * 21) + 20;
        var threeRowsFilled = Math.floor(Math.random() * 21) + 40;
        var fourRowsFilled = Math.floor(Math.random() * 21) + 60;
        var consecutiveRow = Math.floor(Math.random() * 3) + 1;
        var blankPocket = Math.floor(Math.random() * 31);
        var borderPoints = Math.floor(Math.random() * 3) + 1;
        this.genes = {
            pointsGene: points,
            heightPenaltyGene: heightPenalty,
            oneRowFilledGene: oneRowFilled,
            twoRowsFilledGene: twoRowsFilled,
            threeRowsFilledGene: threeRowsFilled,
            fourRowsFilledGene: fourRowsFilled,
            consecutiveRowGene: consecutiveRow,
            blankPocketGene: blankPocket,
            borderGene: borderPoints
        };
    };
    return individual;
}());
var population = /** @class */ (function () {
    function population() {
        for (var i = 0; i < 100; i++) {
            var newIndividual = new individual();
            newIndividual.randomGenes();
            this.individuals.push(newIndividual);
        }
    }
    return population;
}());
