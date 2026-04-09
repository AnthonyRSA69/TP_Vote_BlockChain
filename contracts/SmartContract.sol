pragma solidity ^0.8.28;

contract Vote {
// ==================PARTIE JETON=================================
    //==============Initialisation des variables==========================
    
    string public name   = "JetonVote"; // Nom du jetoh comem sur openzeppelin
    string public symbol = "VOTE"; // Symbole du jeton

    mapping(uint256 => address) private _owners;  // TokenId pour que ce soit unique (nft)
    mapping(address => uint256) private _balances; // relier l'adresse au nombre de jeton

    uint256 private idToken; //id de jeton en cours (compteur)
    uint256 private nb_token; //nbre de jeton (compteur)

    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);


    //========================================Lecture Jeton==================================

    function totalToken() external view returns (uint256) {     // Retourne le nombre total de jeton 
        return nb_token;
    }

    function balanceOf(address _owner) external view returns (uint256) { // Retourne le nombre de jeton possédant le propriétaire de l'adresse comme dans le tp ERC20
        require(_owner != address(0), "Aucunde adresse");
        return _balances[_owner];
    }

    function ownerOf(uint256 tokenId) external view returns (address) { // Retourne le owner du jeton via l'id du jeton
        address owner = _owners[tokenId];
        require(owner != address(0), "Le Token n'existe pas");
        return owner;
    }

    //=======================MINT=============================

    function _mint(address to, uint256 tokenId) internal {
        require(to != address(0), "Aucune adresse"); // on verifie que l'adresse exitse bien

        _owners[tokenId]= to;   // on affecte le jeon en coursa la personne votante (via l'adresse)
        _balances[to]+= 1;      // on ajoute le nombre de jeton a la personne qqui a vote 
        nb_token+= 1;

        emit Transfer(address(0), to, tokenId);
    }
//==================FIN PARTIE JETON====================================

//==================PARTIE VOTE====================================

    //================Initialisation des variables====================

    struct Candidate {string  name; uint256 nb_vote;} // on creer une liste candidat dans lequel on va prendre un nom et un nb de vote

    address public owner;
    bool public voteOuvert;

    Candidate[] public candidates; // on creer une liste candidat

    mapping(address => bool) public isVotant;           // on regarde si l'adresse est un votant ou non
    mapping(address => bool) public aVoter;             // on regarde si l'adresse à deja voter ou non
    mapping(address => uint256) public voterToken;      // adresse lier au tokenId recu au vote (si =0 alors pas voté)
    mapping(uint256 => uint256) public voterCandidat;   // lie le jeton token au candidat

    //==================Lecture des candidats===============
    function getNbCandidat() external view returns (uint256) {
        return candidates.length;
    }

    function getCandidat(uint256 idCandidat) external view returns (string candidateName, uint256 nb_vote)
    {
        require(idCandidat < candidates.length, "Candidat inexistant dans les candidats participant");
        Candidate c = candidates[idCandidat];
        return (c.name, c.nb_vote);
    }

    //===========Gestion du process de vote=================

    event VotantAjouter(address indexed voter); // Evenement pour dire qu'on a ajouter un votant
    event VoteCommencer();                      // Evenement pour dire que les votes ont commencé

    modifier onlyOwner() {  // permet de rajouter une condirion a une fonctionpour que suel l'admin puisse y acceder
        require(msg.sender == owner, "Pas l'Owner");
        _;
    }

    modifier onlyVoter() {  // pareil pour les votants
        require(isVotant[msg.sender], "Ne peut pas voter");
        _;
    }

    modifier votingIsOpen() {   // pareil quand les votes sont ouverts
        require(voteOuvert, "Les votes ne sont pas ouvert");
        _;
    }

    constructor(string[] candidateNames) {  // on prend une liste de candidat en parametre qui seront ceux pour qui on peut voter
        require(candidateNames.length >= 2, "Need at least 2 candidates");

        owner = msg.sender;
        idToken = 1; // les token_Id commencent à 1

        for (uint256 i = 0; i < candidateNames.length; i++) {
            candidates.push(Candidate({ name: candidateNames[i], nb_vote: 0 })); // on les mets dans la liste des candidat avec le nb de vote recu
        }
    }

    function addVoter(address votant) external onlyOwner { // on permet a l'admin uniquement d'ajouter des votant
        require(votant != address(0), "Aucune adresse renseignée");
        require(!isVotant[votant], "Adresse est déjà un votant");
        isVotant[votant] = true;
        emit VotantAjouter(votant);
    }

    function startVote() external onlyOwner { // Permet d'ouvrir les vote
        require(!voteOuvert, "Les votes sont déjà ouvert");
        voteOuvert = true;
        emit VoteCommencer();
    }

    function vote(uint256 candidateId) external onlyVoter votingIsOpen { // permet au votant de voter
        require(!aVoter[msg.sender], "A deja vote");
        require(candidateId < candidates.length, "Candidat inexistant");
        aVoter[msg.sender]= true;               // il a voter
        candidates[candidateId].nb_vote += 1;  // +1 vote pour celui qui vote
        uint256 tokenId = idToken;
        idToken += 1;                           // Jeton +1
        voterToken[msg.sender]= tokenId;  
        voterCandidat[tokenId]= candidateId;    // on inscris qui a vote avec ce token

        _mint(msg.sender, tokenId);
    }
}