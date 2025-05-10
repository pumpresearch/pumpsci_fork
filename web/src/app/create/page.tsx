'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { WalletButton } from '@/components/solana/solana-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { createToken, SocialCause } from '@/services/blockchain'

export default function CreateCoinPage() {
  const router = useRouter()
  
  const [name, setName] = useState('')
  const [symbol, setSymbol] = useState('')
  const [description, setDescription] = useState('')
  const [cause, setCause] = useState<SocialCause>('Environmental')
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  // Mock wallet connection state for development
  const [walletConnected, setWalletConnected] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!walletConnected) {
      setError('Please connect your wallet first')
      return
    }
    
    if (!name || !symbol || !description || !cause) {
      setError('Please fill in all required fields')
      return
    }
    
    // Validate symbol (3-5 capital letters)
    const symbolRegex = /^[A-Z]{3,5}$/
    if (!symbolRegex.test(symbol)) {
      setError('Symbol must be 3-5 capital letters')
      return
    }
    
    try {
      setIsCreating(true)
      setError(null)
      setSuccess(null)
      
      // Create token with mock wallet data
      const mockPublicKey = { toString: () => '5FHwkrdxD5AKmY1sdDdxvKFcGy5uyy7Jh3RhHToJNYhV' }
      
      const mintAddress = await createToken({
        name,
        symbol,
        description,
        cause,
        publicKey: mockPublicKey as any
      })
      
      setSuccess(`Token created successfully! Mint address: ${mintAddress}`)
      
      // Show success message in console
      console.log(`Token ${name} (${symbol}) created successfully!`)
      
      // Redirect to token page after a short delay
      setTimeout(() => {
        router.push(`/token/${mintAddress}`)
      }, 3000)
    } catch (err: unknown) {
      console.error('Error creating token:', err)
      setError(`Failed to create token: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setIsCreating(false)
    }
  }
  
  // Mock wallet connection for development
  const toggleWalletConnection = () => {
    setWalletConnected(!walletConnected)
  }

  return (
    <div className="container max-w-3xl py-10">
      <h1 className="text-3xl font-bold mb-6">Create a New Coin</h1>
      <p className="text-gray-600 mb-8">
        Launch your own memecoin with a purpose. A portion of all trading fees will go towards your selected social cause.
      </p>
      
      {!walletConnected && (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Wallet not connected</AlertTitle>
          <AlertDescription>
            Please connect your wallet to create a new coin.
            <div className="mt-4">
              {/* Mock wallet connection button for development */}
              <Button onClick={toggleWalletConnection} className="bg-blue-500 hover:bg-blue-600 text-white">
                Connect Wallet
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      {error && (
        <Alert variant="destructive" className="mb-6 bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-600">Success</AlertTitle>
          <AlertDescription className="text-green-600">{success}</AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Token Details</h2>
          <p className="text-gray-500 text-sm">
            Enter the basic information about your token.
          </p>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Token Name</Label>
            <Input
              id="name"
              placeholder="e.g. EcoToken"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="symbol">Token Symbol (3-5 capital letters)</Label>
            <Input
              id="symbol"
              placeholder="e.g. ECO"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              maxLength={5}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe your token and its purpose..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cause">Social Impact Cause</Label>
            <select
              id="cause"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={cause}
              onChange={(e) => setCause(e.target.value as SocialCause)}
              required
            >
              <option value="Environmental">Environmental</option>
              <option value="Educational">Educational</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Food Security">Food Security</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="image">Token Image (Coming Soon)</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              disabled
            />
            <p className="text-xs text-gray-500 mt-1">
              Token image upload will be available in a future update.
            </p>
          </div>
        </div>
        
        <div className="mt-8">
          <Button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md"
            disabled={isCreating || !walletConnected}
          >
            {isCreating ? 'Creating Token...' : 'Create Token'}
          </Button>
          
          {walletConnected && (
            <div className="mt-4 text-center">
              <button 
                type="button" 
                onClick={toggleWalletConnection}
                className="text-sm text-blue-500 hover:text-blue-700"
              >
                Disconnect Wallet
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  )
}
