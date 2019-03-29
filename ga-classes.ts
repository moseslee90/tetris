class gene {
    geneName: string;
    geneVariable: number;

    constructor(geneName: string) {
        this.geneName = geneName;
    }
}

class individual {
    genes: gene[];

    constructor() {
        
    }
    randomGenes() {
        let pointsGene = 2000;
        let heightPenaltyGene = Math.floor(Math.random() * 31);
        let filledRowGene = Math.floor(Math.random() * 31);
        let consecutiveRowGene = Math.floor(Math.random() * 31);
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