//use data from data.json to create 1000 individuals
var jsonfile = require("jsonfile");
var survivors = "data.json";
var newPopulation = "population.json";
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
        var heightPenalty = Math.random() * 5 + 1;
        var oneRowFilled = Math.random() * 21;
        var twoRowsFilled = Math.random() * 21 + 20;
        var threeRowsFilled = Math.random() * 21 + 40;
        var fourRowsFilled = Math.random() * 21 + 60;
        var consecutiveRow = Math.random() * 3 + 1;
        var blankPocket = Math.random() * 31;
        var borderPoints = Math.random() * 3 + 1;
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
    individual.prototype.inheritGenes = function (parent) {
        this.genes = {
            pointsGene: parent.genes.pointsGene,
            heightPenaltyGene: parent.genes.heightPenaltyGene,
            oneRowFilledGene: parent.genes.oneRowFilledGene,
            twoRowsFilledGene: parent.genes.twoRowsFilledGene,
            threeRowsFilledGene: parent.genes.threeRowsFilledGene,
            fourRowsFilledGene: parent.genes.fourRowsFilledGene,
            consecutiveRowGene: parent.genes.consecutiveRowGene,
            blankPocketGene: parent.genes.blankPocketGene,
            borderGene: parent.genes.borderGene
        };
    };
    return individual;
}());
if (process.argv[2] === "populate") {
    jsonfile.readFile(survivors, function (err, obj) {
        if (err) {
            console.log(err);
        }
        while (obj.population.length < 1000) {
            var numberOfSurvivors = obj.population.length;
            //generate random index based on number of survivors
            var orderedIndex = [];
            var randomIndex = [];
            for (var i = 0; i < numberOfSurvivors; i++) {
                orderedIndex.push(i);
            }
            while (orderedIndex.length > 0) {
                var randomNumber = Math.floor(Math.random() * orderedIndex.length);
                var randomNumberToAdd = orderedIndex.splice(randomNumber, 1)[0];
                randomIndex.push(randomNumberToAdd);
            }
            for (var i = 0; i < numberOfSurvivors - 1; i++) {
                var parent1 = obj.population[randomIndex[i]];
                var parent2 = obj.population[randomIndex[i + 1]];
                //choose which random genes to swap
                var child1 = new individual();
                child1.inheritGenes(parent1);
                var child2 = new individual();
                child2.inheritGenes(parent2);
                var randomGene = Math.floor(Math.random() * 7 + 1);
                var p1Gene = void 0;
                var p2Gene = void 0;
                switch (randomGene) {
                    case 1:
                        p1Gene = parent1.genes.heightPenaltyGene;
                        p2Gene = parent2.genes.heightPenaltyGene;
                        child1.genes.heightPenaltyGene = p2Gene;
                        child2.genes.heightPenaltyGene = p1Gene;
                        break;
                    case 2:
                        p1Gene = parent1.genes.oneRowFilledGene;
                        p2Gene = parent2.genes.oneRowFilledGene;
                        child1.genes.oneRowFilledGene = p2Gene;
                        child2.genes.oneRowFilledGene = p1Gene;
                        break;
                    case 3:
                        p1Gene = parent1.genes.twoRowsFilledGene;
                        p2Gene = parent2.genes.twoRowsFilledGene;
                        child1.genes.twoRowsFilledGene = p2Gene;
                        child2.genes.twoRowsFilledGene = p1Gene;
                        break;
                    case 4:
                        p1Gene = parent1.genes.threeRowsFilledGene;
                        p2Gene = parent2.genes.threeRowsFilledGene;
                        child1.genes.threeRowsFilledGene = p2Gene;
                        child2.genes.threeRowsFilledGene = p1Gene;
                        break;
                    case 5:
                        p1Gene = parent1.genes.fourRowsFilledGene;
                        p2Gene = parent2.genes.fourRowsFilledGene;
                        child1.genes.fourRowsFilledGene = p2Gene;
                        child2.genes.fourRowsFilledGene = p1Gene;
                        break;
                    case 6:
                        p1Gene = parent1.genes.consecutiveRowGene;
                        p2Gene = parent2.genes.consecutiveRowGene;
                        child1.genes.consecutiveRowGene = p2Gene;
                        child2.genes.consecutiveRowGene = p1Gene;
                        break;
                    case 7:
                        p1Gene = parent1.genes.blankPocketGene;
                        p2Gene = parent2.genes.blankPocketGene;
                        child1.genes.blankPocketGene = p2Gene;
                        child2.genes.blankPocketGene = p1Gene;
                        break;
                    case 8:
                        p1Gene = parent1.genes.borderGene;
                        p2Gene = parent2.genes.borderGene;
                        child1.genes.borderGene = p2Gene;
                        child2.genes.borderGene = p1Gene;
                        break;
                    default:
                        break;
                }
                obj.population.push(child1, child2);
            }
        }
        if (obj.population.length > 1000) {
            obj.population.length = 1000;
        }
        jsonfile.writeFile(newPopulation, obj, function (err) {
            console.log(err);
        });
    });
}
if (process.argv[2] === "count") {
    jsonfile.readFile(newPopulation, function (err, obj) {
        if (err) {
            console.log(err);
        }
        console.log(obj.population.length);
    });
}
