'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { WalletButton } from '@/components/solana/solana-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, CheckCircle2, Upload, Loader2, Image as ImageIcon } from 'lucide-react'
import { createToken, SocialCause } from '@/services/blockchain'
import { uploadToIPFS, uploadTokenMetadata } from '@/services/ipfs'

export default function CreateCoinPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [name, setName] = useState('')
  const [symbol, setSymbol] = useState('')
  const [description, setDescription] = useState('')
  const [cause, setCause] = useState<SocialCause>('Environmental')
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [mintAddress, setMintAddress] = useState<string | null>(null)
  
  // Image upload state
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [metadataUri, setMetadataUri] = useState<string | null>(null)
  
  // Mock wallet connection state for development
  const [walletConnected, setWalletConnected] = useState(false)

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
    
    setSelectedImage(file)
    
    // Create preview URL
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
    
    // Clear any previous errors
    setError(null)
  }
  
  // Upload image to IPFS
  const uploadImage = async (): Promise<string | null> => {
    if (!selectedImage) return null
    
    try {
      setIsUploading(true)
      setUploadProgress(10)
      
      // Upload image to IPFS
      const imageHash = await uploadToIPFS(selectedImage, `${name} Image`)
      setUploadProgress(50)
      
      // Create and upload metadata
      const metadata = {
        name,
        symbol,
        description,
        cause,
        image: `ipfs://${imageHash}`
      }
      
      const metadataUri = await uploadTokenMetadata(metadata)
      setUploadProgress(100)
      setMetadataUri(metadataUri)
      
      return metadataUri
    } catch (error: unknown) {
      console.error('Error uploading image:', error)
      throw error
    } finally {
      setIsUploading(false)
    }
  }
  
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
      
      // Upload image and metadata if an image is selected
      let tokenMetadataUri = null
      if (selectedImage) {
        tokenMetadataUri = await uploadImage()
      }
      
      // Create token with mock wallet data
      const mockPublicKey = { toString: () => '5FHwkrdxD5AKmY1sdDdxvKFcGy5uyy7Jh3RhHToJNYhV' }
      
      const mintAddress = await createToken(
        name,
        symbol,
        description,
        cause,
        tokenMetadataUri || "ipfs://placeholder",
        mockPublicKey as any
      );

      setMintAddress(mintAddress);
      
      setSuccess(`Token created successfully! Mint address: ${mintAddress}`)
      
      // Show success message in console
      console.log(`Token ${name} (${symbol}) created successfully!`)
      console.log(`Metadata URI: ${tokenMetadataUri || 'None'}`)
      
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

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }
  
  // Clear selected image
  const clearImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }
  
  return (
    <div className="container max-w-3xl py-10 mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Create a New Coin</h1>
      <p className="text-gray-600 mb-8 text-center">
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
            
            {isUploading && (
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1 flex items-center">
                  <Loader2 className="w-3 h-3 animate-spin mr-1" />
                  Uploading to IPFS: {uploadProgress}%
                </p>
              </div>
            )}
            
            {metadataUri && (
              <div className="mt-2 flex items-center text-green-600 text-xs">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Metadata uploaded to IPFS
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-8">
          <Button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md"
            disabled={isCreating || isUploading || !walletConnected}
          >
            {isCreating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Creating Token...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Create Token
              </>
            )}
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
