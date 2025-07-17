'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { WalletButton } from '@/components/solana/solana-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, Image as ImageIcon } from 'lucide-react'
import { SocialCause } from '@/services/blockchain'
import { 
  UiWalletAccount,
  useWalletUi, 
} from '@wallet-ui/react'

function CreateCoinForm({ account }: { account: UiWalletAccount }) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [name, setName] = useState('')
  const [symbol, setSymbol] = useState('')
  const [description, setDescription] = useState('')
  const [cause, setCause] = useState<SocialCause>('Environmental')
  const [error, setError] = useState<string | null>(null)
  
  // Image upload state
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB')
      return
    }
    
    // Create preview URL
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
    
    // Clear any previous errors
    setError(null)
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !symbol || !description || !cause) {
      setError('Please fill in all required fields');
      return;
    }

    const symbolRegex = /^[A-Z]{3,5}$/;
    if (!symbolRegex.test(symbol)) {
      setError('Symbol must be 3-5 capital letters');
      return;
    }

    if (!imagePreview) {
      setError('Please select an image for the token');
      return;
    }

    // Placeholder for submission logic
    console.log('Form submitted:', { name, symbol, description, cause, imagePreview });
    // In a real scenario, you would proceed with on-chain creation here.
  };


  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }
  
  // Clear selected image
  const clearImage = () => {
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }
  
  return (
    <>
      {error && (
        <Alert variant="destructive" className="mb-6 bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            Create Token
          </h2>
          <p className="text-gray-500 text-sm">
            Enter the basic information about your token and upload its image.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
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
            <Label htmlFor="image">Token Image</Label>
            <input
              ref={fileInputRef}
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            
            <div className="border border-gray-300 rounded-md p-4 flex flex-col items-center justify-center">
              {imagePreview ? (
                <div className="relative w-full">
                  <div className="relative w-32 h-32 mx-auto mb-2 rounded-full overflow-hidden border-2 border-blue-500">
                    <Image 
                      src={imagePreview} 
                      alt="Token preview" 
                      fill 
                      style={{ objectFit: 'cover' }} 
                    />
                  </div>
                  <div className="flex justify-center gap-2 mt-2">
                    <Button 
                      type="button" 
                      onClick={triggerFileInput}
                      className="bg-blue-500 hover:bg-blue-600 text-white text-sm py-1 px-3"
                    >
                      Change
                    </Button>
                    <Button 
                      type="button" 
                      onClick={clearImage}
                      className="bg-red-500 hover:bg-red-600 text-white text-sm py-1 px-3"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <div 
                  onClick={triggerFileInput}
                  className="w-full h-32 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 rounded-md"
                >
                  <ImageIcon className="w-12 h-12 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Click to upload token image</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG or GIF (max 5MB)</p>
                </div>
              )}
            </div>
            
          </div>
        
        <div className="mt-8">
            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md"
            >
              Create Token
            </Button>
          
            <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Connected as: {account.address.toString().slice(0, 8)}...{account.address.toString().slice(-4)}
            </p>
            </div>
        </div>
      </form>
      </div>
    </>
  )
}

export default function CreateCoinPage() {
  const { account } = useWalletUi()

  return (
    <div className="container max-w-3xl py-10 mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Create a New Coin</h1>
      <p className="text-gray-600 mb-8 text-center">
        Launch your own memecoin with a purpose. A portion of all trading fees will go towards your selected social cause.
      </p>
      
      {account ? (
        <CreateCoinForm account={account} />
      ) : (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Wallet not connected</AlertTitle>
          <AlertDescription>
            Please connect your wallet to create a new coin.
            <div className="mt-4">
              <WalletButton />
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
