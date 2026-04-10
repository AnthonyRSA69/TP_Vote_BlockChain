import { expect } from "chai";
import { ethers } from "hardhat";

describe("Vote", function () {

    let vote: any;
    let owner: any;
    let votant1: any;
    let votant2: any;
    let nonVotant: any;

    beforeEach(async function () {
        [owner, votant1, votant2, nonVotant] = await ethers.getSigners();
        const contrat = await ethers.getContractFactory("Vote");
        vote = await contrat.deploy(["Anthony", "Esteban", "X"]);
        await vote.waitForDeployment();
    });

    describe("Deploiement du contrat", function () {

        it("le owner est bien l'adresse qui a déployé", async function () {
            const owner_contrat = await vote.owner();
            expect(owner_contrat).to.equal(owner.address);
        });

        it("le vote n'est pas ouvert au deploiemet", async function () {
            const VoteOuvert = await vote.voteOuvert();
            expect(VoteOuvert).to.be.false; // le boolean renvoyer doit etre egale a faux
        });

        it("les candidats ont bien 0 vote au départ", async function () {
            const nombre = await vote.getNbCandidat();
            for (let i = 0; i < nombre; i++) {
                const [nom, nbVotes] = await vote.getCandidat(i);
                expect(nbVotes).to.equal(0n);
            }
        });
    });
});