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