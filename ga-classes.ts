class gene {
  geneName: string;
  geneVariable: number;

  constructor(geneName: string, geneVariable: number) {
    this.geneName = geneName;
    this.geneVariable = geneVariable;
  }
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
  constructor() {}
  randomGenes() {
    let points = 2000;
    let heightPenalty: number = Math.floor(Math.random() * 31);

    let oneRowFilled: number = Math.floor(Math.random() * 31);
    let twoRowsFilled: number = Math.floor(Math.random() * 31);
    let threeRowsFilled: number = Math.floor(Math.random() * 31);
    let fourRowsFilled: number = Math.floor(Math.random() * 31);

    let consecutiveRow: number = Math.floor(Math.random() * 31);

    let blankPocket: number = Math.floor(Math.random() * 31);
    
    let borderPoints: number = Math.floor(Math.random() * 31);

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
