import { useState, useCallback } from 'react'

export function useVoting() {
  const [userAddress, setUserAddress] = useState<string | null>(null)

  // Connecter MetaMask
  const connectWallet = useCallback(async () => {
    try {
      // Demander l'acces au wallet
      const accounts = await window.ethereum?.request({
        method: 'eth_requestAccounts',
      })

      if (accounts && accounts.length > 0) {
        setUserAddress(accounts[0])
        return true
      }
    } catch (err) {
      console.error('Erreur connexion:', err)
      return false
    }
  }, [])

  // Déconnecter
  const disconnectWallet = useCallback(() => {
    setUserAddress(null)
  }, [])

  return {
    userAddress,
    connectWallet,
    disconnectWallet,
  }
}
