class genes {
  pointsGene: number;
  heightPenaltyGene: number;
  oneRowFilledGene: number;
  twoRowsFilledGene: number;
  threeRowsFilledGene: number;
  fourRowsFilledGene: number;
  consecutiveRowGene: number;
  blankPocketGene: number;
  borderGene: number;

  constructor() {}
}

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
    let heightPenalty: number = (Math.random() * 5) + 1;

    let oneRowFilled: number = (Math.random() * 21);
    let twoRowsFilled: number = (Math.random() * 21) + 20;
    let threeRowsFilled: number = (Math.random() * 21) + 40;
    let fourRowsFilled: number = (Math.random() * 21) + 60;

    let consecutiveRow: number = (Math.random() * 3) + 1;

    let blankPocket: number = (Math.random() * 31);

    let borderPoints: number = (Math.random() * 3) + 1;

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
}

class population {
  individuals: individual[];

  constructor() {
    for (let i = 0; i < 100; i++) {
      const newIndividual = new individual();
      newIndividual.randomGenes();
      this.individuals.push(newIndividual);
    }
  }
}
