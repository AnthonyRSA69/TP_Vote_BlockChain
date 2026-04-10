import { useState } from 'react'
import './App.css'
import { useVoting } from './hooks/useVoting'

function App() {
  // Hook MetaMask
  const { userAddress, connectWallet, disconnectWallet } = useVoting()
  
  // État de l'app
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [isAdmin] = useState(true)
  const [isVoter] = useState(true)
  const [votingOpen, setVotingOpen] = useState(true)
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null)
  const [userHasVoted] = useState(false)
  
  // Vérifier si connecté
  const isConnected = userAddress !== null
  const userName = userAddress ? `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}` : 'Connecter'
  
  // Fonctions de connexion/déconnexion
  const handleConnect = async () => {
    await connectWallet()
  }

  const handleDisconnect = () => {
    disconnectWallet()
    setShowUserMenu(false)
  }

  const handleCloseVoting = () => {
    setVotingOpen(false)
  }

  const handleOpenVoting = () => {
    setVotingOpen(true)
  }
  
  // Données fictives corrigées - cohérentes
  const candidates = [
    { id: 0, name: 'Alice Martin', votes: 2, description: 'Expérience en gestion' },
    { id: 1, name: 'Bob Chen', votes: 1, description: 'Spécialiste en finance' },
    { id: 2, name: 'Charlie Dupont', votes: 1, description: 'Coordinateur général' },
  ]

  const voters = [
    { address: '0x1234...5678', name: 'Alice', canVote: false, hasVoted: true },
    { address: '0x2345...6789', name: 'Bob', canVote: true, hasVoted: false },
    { address: '0x3456...7890', name: 'Charlie', canVote: true, hasVoted: false },
    { address: '0x4567...8901', name: 'David', canVote: true, hasVoted: false },
  ]

  const maxVotes = Math.max(...candidates.map(c => c.votes), 1)
  const totalVotes = candidates.reduce((sum, c) => sum + c.votes, 0)

  return (
    <div className="app-container">
      {/* HEADER */}
      <header className="header">
        <div className="header-left">
          <h1 className="title">DApp</h1>
        </div>
        <div className="header-center">
          <div className="vote-status-badge">
            {votingOpen ? (
              <span className="status-open">Scrutin ouvert</span>
            ) : (
              <span className="status-closed">Scrutin fermé</span>
            )}
          </div>
        </div>
        <div className="header-right">
          {isConnected && userAddress ? (
            <div className="user-menu-container">
              <button 
                className="user-button"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="user-avatar">{userName[0]}</div>
                <div className="user-details">
                  <p className="user-name">{userName}</p>
                  <p className="user-address">{userAddress}</p>
                </div>
              </button>
              
              {showUserMenu && (
                <div className="user-dropdown">
                  <button 
                    className="dropdown-item disconnect"
                    onClick={handleDisconnect}
                  >
                    Déconnecter
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="btn btn-primary" onClick={handleConnect}>
              Connecter MetaMask
            </button>
          )}
        </div>
      </header>

      {/* LAYOUT PRINCIPAL */}
      <div className="main-layout">
        {/* SIDEBAR ADMIN */}
        {isAdmin && (
          <aside className="sidebar">
            <div className="sidebar-section">
              <h3>Administration</h3>
              <input 
                type="text" 
                placeholder="Adresse électeur" 
                className="input-field"
              />
              <button className="btn btn-secondary">Ajouter électeur</button>
              {votingOpen ? (
                <button 
                  className="btn btn-danger"
                  onClick={handleCloseVoting}
                >
                  Fermer le scrutin
                </button>
              ) : (
                <button 
                  className="btn btn-success"
                  onClick={handleOpenVoting}
                >
                  Ouvrir le scrutin
                </button>
              )}
            </div>
          </aside>
        )}

        {/* CONTENU PRINCIPAL */}
        <main className="main-content">
          <div className="content-grid">
            {/* COLONNE 1: RÉSULTATS */}
            <div className="column">
              <section className="card">
                <h2>Résultats des votes</h2>
                <div className="stats-overview">
                  <div className="stat-item">
                    <span className="stat-label">Total votes</span>
                    <span className="stat-value">{totalVotes}/{voters.length}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Participation</span>
                    <span className="stat-value">{Math.round((totalVotes/voters.length)*100)}%</span>
                  </div>
                </div>

                <div className="results-list">
                  {candidates.map(candidate => {
                    const percentage = (candidate.votes / maxVotes) * 100
                    const isWinner = candidate.votes === Math.max(...candidates.map(c => c.votes))
                    return (
                      <div key={candidate.id} className={`result-item ${isWinner ? 'winner' : ''}`}>
                        <div className="result-header">
                          <span className="result-name">{candidate.name}</span>
                          <span className="result-votes">{candidate.votes} votes</span>
                        </div>
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <p className="result-description">{candidate.description}</p>
                      </div>
                    )
                  })}
                </div>
              </section>

              {/* SECTION ÉLECTEURS */}
              <section className="card">
                <h2>Électeurs inscrits</h2>
                <div className="voters-list">
                  {voters.map((voter, index) => (
                    <div key={index} className="voter-item">
                      <div className="voter-avatar">{voter.name[0]}</div>
                      <div className="voter-info">
                        <p className="voter-name">{voter.name}</p>
                        <p className="voter-address">{voter.address}</p>
                      </div>
                      <div className="voter-status">
                        {voter.hasVoted ? (
                          <span className="badge badge-voted">A voté</span>
                        ) : voter.canVote ? (
                          <span className="badge badge-can-vote">Peut voter</span>
                        ) : (
                          <span className="badge badge-cannot-vote">Pas d'accès</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* COLONNE 2: PANEL DE VOTE */}
            <div className="column">
              {isConnected && isVoter && votingOpen && !userHasVoted && (
                <section className="card voting-panel">
                  <h2>Votre vote</h2>
                  <p className="voting-instruction">Sélectionnez un candidat</p>
                  
                  <div className="candidates-choice">
                    {candidates.map(candidate => (
                      <div 
                        key={candidate.id}
                        className={`candidate-choice ${selectedCandidate === candidate.id ? 'selected' : ''}`}
                        onClick={() => setSelectedCandidate(candidate.id)}
                      >
                        <div className="choice-header">
                          <h4>{candidate.name}</h4>
                          <span className="choice-radio">
                            {selectedCandidate === candidate.id && '●'}
                          </span>
                        </div>
                        <p className="choice-desc">{candidate.description}</p>
                      </div>
                    ))}
                  </div>

                  <button 
                    className="btn btn-primary btn-large"
                    disabled={selectedCandidate === null}
                  >
                    Confirmer mon vote
                  </button>
                </section>
              )}

              {isConnected && userHasVoted && (
                <section className="card message-panel">
                  <h3>Vote enregistré</h3>
                  <p>Votre vote a été confirmé sur la blockchain</p>
                </section>
              )}

              {isConnected && !isVoter && (
                <section className="card message-panel">
                  <h3>Accès limité</h3>
                  <p>Vous n'êtes pas inscrit comme électeur</p>
                </section>
              )}

              {isConnected && !votingOpen && (
                <section className="card message-panel">
                  <h3>Scrutin fermé</h3>
                  <p>La période de vote est terminée</p>
                </section>
              )}

              {!isConnected && (
                <section className="card message-panel">
                  <h3>Non connecté</h3>
                  <p>Connectez votre portefeuille pour voter</p>
                </section>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
