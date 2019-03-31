//use data from data.json to create 1000 individuals
const jsonfile = require("jsonfile");
const survivors = "data.json";
const newPopulation = "population.json";

interface genes {
  pointsGene: number;
  heightPenaltyGene: number;
  oneRowFilledGene: number;
  twoRowsFilledGene: number;
  threeRowsFilledGene: number;
  fourRowsFilledGene: number;
  consecutiveRowGene: number;
  blankPocketGene: number;
  borderGene: number;
}

class individual {
  genes: genes;
  fitness: number;
  constructor() {
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
  randomGenes() {
    let points = 2000;
    let heightPenalty: number = Math.random() * 5 + 1;

    let oneRowFilled: number = Math.random() * 21;
    let twoRowsFilled: number = Math.random() * 21 + 20;
    let threeRowsFilled: number = Math.random() * 21 + 40;
    let fourRowsFilled: number = Math.random() * 21 + 60;

    let consecutiveRow: number = Math.random() * 3 + 1;

    let blankPocket: number = Math.random() * 31;

    let borderPoints: number = Math.random() * 3 + 1;

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
  }
  inheritGenes(parent: individual) {
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
  }
}
if (process.argv[2] === "populate") {
  jsonfile.readFile(survivors, (err, obj) => {
    if (err) {
      console.log(err);
    }
    while (obj.population.length < 1000) {
      const numberOfSurvivors = obj.population.length;
      //generate random index based on number of survivors
      let orderedIndex: number[] = [];
      let randomIndex: number[] = [];
      for (let i = 0; i < numberOfSurvivors; i++) {
        orderedIndex.push(i);
      }
      while (orderedIndex.length > 0) {
        let randomNumber: number = Math.floor(
          Math.random() * orderedIndex.length
        );
        let randomNumberToAdd: number = orderedIndex.splice(randomNumber, 1)[0];
        randomIndex.push(randomNumberToAdd);
      }
      for (let i = 0; i < numberOfSurvivors - 1; i++) {
        const parent1: individual = obj.population[randomIndex[i]];
        const parent2: individual = obj.population[randomIndex[i + 1]];
        //choose which random genes to swap
        let child1: individual = new individual();
        child1.inheritGenes(parent1);
        let child2: individual = new individual();
        child2.inheritGenes(parent2);
        const randomGene: number = Math.floor(Math.random() * 7 + 1);
        let p1Gene: number;
        let p2Gene: number;
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

    jsonfile.writeFile(newPopulation, obj, err => {
      console.log(err);
    });
  });
}
if (process.argv[2] === "count") {
  jsonfile.readFile(newPopulation, (err, obj) => {
    if (err) {
      console.log(err);
    }
    console.log(obj.population.length);
  });
}
