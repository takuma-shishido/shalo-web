import { useState, useEffect, useCallback } from 'react'
import { AccountData } from '@/types/account'
import { fetchAccountData } from '@/services/api'

export function useAccount() {
  const [account, setAccount] = useState<AccountData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(false)
  const [token, setToken] = useState('')

  const loadAccountData = useCallback(async () => {
    const token = localStorage.getItem('authToken')

    if (!token) {
      setIsAuthenticated(false)
      setAccount(null)
      setDataLoaded(true)
      return
    } else {
      setToken(token)
    }

    if (account) {
      setIsAuthenticated(true)
      setDataLoaded(true)
      return
    }

    try {
      const data = await fetchAccountData(token)
      if (data) {
        setAccount(data)
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
        setAccount(null)
      }
    } catch (error) {
      console.error('Error fetching account data:', error)
      setIsAuthenticated(false)
      setAccount(null)
    } finally {
      setDataLoaded(true)
    }
  }, [account])

  useEffect(() => {
    loadAccountData()
  }, [loadAccountData])

  const updateAccount = (newAccountData: AccountData, token: string) => {
    setAccount(newAccountData)
    setIsAuthenticated(true)
    setToken(token)

    localStorage.setItem('authToken', token)
  }

  const clearAccount = () => {
    setAccount(null)
    setIsAuthenticated(false)
    localStorage.removeItem('authToken')
  }

  return { account, loading: !dataLoaded, isAuthenticated, token, updateAccount, clearAccount }
}

