/**
 * IPFS service for uploading files to Pinata
 */

/**
 * Interface for Pinata API response
 */
export interface PinataResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
  isDuplicate?: boolean;
}

/**
 * Upload a file to IPFS via Pinata
 * @param file The file to upload
 * @param name Optional name for the file
 * @returns The IPFS CID (hash) of the uploaded file
 */
export const uploadToIPFS = async (file: File, name?: string): Promise<string> => {
  try {
    // Create form data for the file upload
    const formData = new FormData();
    formData.append('file', file);
    
    // Add metadata if a name is provided
    if (name) {
      const metadata = JSON.stringify({
        name,
      });
      formData.append('pinataMetadata', metadata);
    }
    
    // Add options for Pinata
    const options = JSON.stringify({
      cidVersion: 1,
    });
    formData.append('pinataOptions', options);
    
    // Get API key and secret from environment variables
    const pinataApiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY;
    const pinataApiSecret = process.env.NEXT_PUBLIC_PINATA_API_SECRET;
    
    if (!pinataApiKey || !pinataApiSecret) {
      // For development, return a mock IPFS hash
      console.log('Pinata API keys not found, returning mock IPFS hash');
      return `ipfs-mock-${Date.now()}`;
    }
    
    // Make the API request to Pinata
    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'pinata_api_key': pinataApiKey,
        'pinata_secret_api_key': pinataApiSecret,
      },
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`Failed to upload to Pinata: ${response.statusText}`);
    }
    
    const data: PinataResponse = await response.json();
    return data.IpfsHash;
  } catch (error: unknown) {
    console.error('Error uploading to IPFS:', error);
    throw new Error(`Failed to upload to IPFS: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Create token metadata JSON and upload to IPFS
 * @param metadata The token metadata
 * @returns The IPFS URI of the uploaded metadata
 */
export const uploadTokenMetadata = async (metadata: {
  name: string;
  symbol: string;
  description: string;
  cause: string;
  image?: string;
}): Promise<string> => {
  try {
    // Create a JSON blob from the metadata
    const metadataBlob = new Blob([JSON.stringify(metadata, null, 2)], { type: 'application/json' });
    
    // Convert blob to file
    const metadataFile = new File([metadataBlob], `${metadata.symbol.toLowerCase()}_metadata.json`, { type: 'application/json' });
    
    // Upload the metadata file to IPFS
    const ipfsHash = await uploadToIPFS(metadataFile, `${metadata.name} Metadata`);
    
    // Return the IPFS URI
    return `ipfs://${ipfsHash}`;
  } catch (error: unknown) {
    console.error('Error uploading token metadata to IPFS:', error);
    throw new Error(`Failed to upload token metadata: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Get the HTTP gateway URL for an IPFS URI
 * @param ipfsUri The IPFS URI (ipfs://...)
 * @returns The HTTP gateway URL
 */
export const getIPFSGatewayUrl = (ipfsUri: string): string => {
  if (!ipfsUri) return '';
  
  // Remove ipfs:// prefix if present
  const cid = ipfsUri.replace('ipfs://', '');
  
  // Use Pinata gateway
  return `https://gateway.pinata.cloud/ipfs/${cid}`;
};
