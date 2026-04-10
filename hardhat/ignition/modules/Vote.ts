import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const VoteModule = buildModule("VoteModule", (m) => {   // On fait la même fonction que dans le cours en rajoutant la liste des candidats pour le constructeur
  const candidats = m.getParameter("candidats", ["Anthony", "Esteban", "X"]);
  const vote = m.contract("Vote", [candidats]);
  return { vote };
});

export default VoteModule;

