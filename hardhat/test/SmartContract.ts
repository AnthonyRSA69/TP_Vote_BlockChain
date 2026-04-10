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
    describe("Gestion des votes", function () {
        it("L'admin peut ajouter des votes", async function () {
            await expect(vote.addVoter(votant1.address)).to.emit(vote, "VotantAjouter").withArgs(votant1.address);
            expect(await vote.isVotant(votant1.address)).to.be.true;
        });

        it("Qqn qui n'est pas l'admin ne peut pas ajouter de votant", async function () {
            await expect(vote.connect(votant1).addVoter(votant2.address)).to.be.revertedWith("Pas l'Owner");
        });

        it("On ne peut pas ajouter le meme votant 2 fois", async function () {
            await vote.addVoter(votant1.address);
            await expect(vote.addVoter(votant1.address)).to.be.revertedWith("Adresse est deja un votant");
        });
        
        it("On peut voter une fois que les votes sont ouverts", async function () {
            await vote.addVoter(votant1.address);
            await expect(vote.startVote()).to.emit(vote, "VoteCommencer");
            await vote.connect(votant1).vote(1);
            const [nom, nbVotes] = await vote.getCandidat(1);
            expect(nbVotes).to.equal(1n);
        });
    });
});