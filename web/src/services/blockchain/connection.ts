import { Connection, clusterApiUrl, Commitment } from '@solana/web3.js';
import { BlockchainError } from './types';

// Array of RPC endpoints for connection pooling
const RPC_ENDPOINTS = {
  devnet: [
    clusterApiUrl('devnet'),
    'https://api.devnet.solana.com',
    'https://devnet.genesysgo.net'
  ],
  testnet: [
    clusterApiUrl('testnet'),
    'https://api.testnet.solana.com'
  ],
  mainnet: [
    clusterApiUrl('mainnet-beta'),
    'https://api.mainnet-beta.solana.com',
    'https://solana-api.projectserum.com'
  ]
};

// Current network - can be changed based on environment
let currentNetwork: 'devnet' | 'testnet' | 'mainnet' = 'devnet';

// Connection pool
let connectionPool: Connection[] = [];
let currentConnectionIndex = 0;

/**
 * Initialize the connection pool for the specified network
 * @param network The Solana network to connect to
 * @param commitment Optional commitment level
 */
export const initConnectionPool = (
  network: 'devnet' | 'testnet' | 'mainnet' = 'devnet',
  commitment: Commitment = 'confirmed'
): void => {
  currentNetwork = network;
  connectionPool = RPC_ENDPOINTS[network].map(endpoint => new Connection(endpoint, { commitment }));
  currentConnectionIndex = 0;
  console.log(`Initialized connection pool for ${network} with ${connectionPool.length} endpoints`);
};

/**
 * Get a connection from the pool with round-robin selection
 * @returns A Solana connection
 */
export const getConnection = (): Connection => {
  // Initialize the pool if it's empty
  if (connectionPool.length === 0) {
    initConnectionPool(currentNetwork);
  }
  
  // Get the next connection in the pool
  const connection = connectionPool[currentConnectionIndex];
  
  // Update the index for the next call (round-robin)
  currentConnectionIndex = (currentConnectionIndex + 1) % connectionPool.length;
  
  return connection;
};

/**
 * Execute a function with retry logic
 * @param fn The function to execute
 * @param maxRetries Maximum number of retries
 * @param retryDelay Delay between retries in milliseconds
 * @returns The result of the function
 */
export const withRetry = async <T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  retryDelay = 500
): Promise<T> => {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      console.warn(`RPC request failed (attempt ${attempt + 1}/${maxRetries + 1}):`, error.message);
      
      // Don't wait on the last attempt
      if (attempt < maxRetries) {
        // Exponential backoff
        const delay = retryDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  // If we get here, all retries failed
  throw lastError || new Error('Operation failed after multiple retries');
};

/**
 * Handle blockchain errors with proper classification
 * @param error The error to handle
 * @returns A structured blockchain error
 */
export const handleBlockchainError = (error: any): BlockchainError => {
  // Default error structure
  const defaultError: BlockchainError = {
    code: 0,
    name: 'UnknownError',
    message: 'An unknown error occurred',
    isUserError: false
  };
  
  // Check if it's a program error with a code
  if (error.code && typeof error.code === 'number') {
    defaultError.code = error.code;
    defaultError.name = error.name || 'ProgramError';
    defaultError.message = error.message || 'A program error occurred';
    
    // Classify user errors vs system errors
    // User errors are typically those that can be fixed by the user
    // For example, insufficient funds, slippage exceeded, etc.
    const userErrorCodes = [6009, 6010, 6011, 6012, 6013, 6014, 6016, 6017, 6023];
    defaultError.isUserError = userErrorCodes.includes(error.code);
  } else if (error instanceof Error) {
    defaultError.name = error.name;
    defaultError.message = error.message;
    
    // Classify common user errors
    if (
      error.message.includes('insufficient') ||
      error.message.includes('not enough') ||
      error.message.includes('wallet not connected')
    ) {
      defaultError.isUserError = true;
    }
  }
  
  return defaultError;
};

// Initialize the connection pool
initConnectionPool();
