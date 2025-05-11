import { 
  PublicKey, 
  Connection,
  ConfirmedSignatureInfo,
  ParsedTransactionWithMeta,
  ParsedInstruction
} from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';
import { getConnection, withRetry } from './connection';
import { PUMP_SCIENCE_PROGRAM_ID } from './program';
import { TokenTransaction } from './types';

/**
 * Convert lamports to SOL
 * @param lamports Amount in lamports
 * @returns Amount in SOL
 */
export const lamportsToSol = (lamports: number | BN): number => {
  const lamportsNumber = typeof lamports === 'number' ? lamports : lamports.toNumber();
  return lamportsNumber / 1_000_000_000; // 1 SOL = 10^9 lamports
};

/**
 * Convert SOL to lamports
 * @param sol Amount in SOL
 * @returns Amount in lamports
 */
export const solToLamports = (sol: number): BN => {
  return new BN(sol * 1_000_000_000); // 1 SOL = 10^9 lamports
};

/**
 * Format a public key for display
 * @param publicKey The public key to format
 * @param length The length of the formatted string
 * @returns The formatted public key
 */
export const formatPublicKey = (publicKey: PublicKey | string, length = 4): string => {
  const pubkeyStr = typeof publicKey === 'string' ? publicKey : publicKey.toString();
  return `${pubkeyStr.slice(0, length)}...${pubkeyStr.slice(-length)}`;
};

/**
 * Get the transaction history for a token
 * @param mintAddress The mint address of the token
 * @param limit The maximum number of transactions to return
 * @returns The transaction history
 */
export const getTokenTransactionHistory = async (
  mintAddress: string | PublicKey,
  limit = 10
): Promise<TokenTransaction[]> => {
  try {
    const connection = getConnection();
    const mint = typeof mintAddress === 'string' ? new PublicKey(mintAddress) : mintAddress;
    
    // Get signatures for transactions involving the program
    const signatures = await withRetry(() => 
      connection.getSignaturesForAddress(PUMP_SCIENCE_PROGRAM_ID, { limit })
    );
    
    // Filter signatures to only include those related to the mint
    const filteredSignatures = await filterSignaturesByMint(connection, signatures, mint);
    
    // Parse transactions
    const transactions = await Promise.all(
      filteredSignatures.map(async (sig) => {
        const txInfo = await withRetry(() => 
          connection.getParsedTransaction(sig.signature, { commitment: 'confirmed' })
        );
        
        return parseTransaction(txInfo, mint);
      })
    );
    
    // Filter out null transactions and sort by timestamp
    return transactions
      .filter((tx): tx is TokenTransaction => tx !== null)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  } catch (error) {
    console.error('Error getting token transaction history:', error);
    return [];
  }
};

/**
 * Filter signatures by mint address
 * @param connection The Solana connection
 * @param signatures The signatures to filter
 * @param mint The mint address to filter by
 * @returns The filtered signatures
 */
const filterSignaturesByMint = async (
  connection: Connection,
  signatures: ConfirmedSignatureInfo[],
  mint: PublicKey
): Promise<ConfirmedSignatureInfo[]> => {
  const mintString = mint.toString();
  
  // Get transaction details for each signature
  const transactions = await Promise.all(
    signatures.map(async (sig) => {
      try {
        const tx = await withRetry(() => 
          connection.getParsedTransaction(sig.signature, { commitment: 'confirmed' })
        );
        return { signature: sig, transaction: tx };
      } catch (error) {
        console.warn(`Error fetching transaction ${sig.signature}:`, error);
        return { signature: sig, transaction: null };
      }
    })
  );
  
  // Filter transactions that involve the mint
  return transactions
    .filter(({ transaction }) => {
      if (!transaction) return false;
      
      // Check if any instruction in the transaction involves the mint
      const txData = JSON.stringify(transaction);
      return txData.includes(mintString);
    })
    .map(({ signature }) => signature);
};

/**
 * Parse a transaction into a TokenTransaction
 * @param txInfo The transaction info
 * @param mint The mint address
 * @returns The parsed transaction
 */
const parseTransaction = (
  txInfo: ParsedTransactionWithMeta | null,
  mint: PublicKey
): TokenTransaction | null => {
  if (!txInfo || !txInfo.meta || txInfo.meta.err) {
    return null;
  }
  
  try {
    // Get the first instruction that involves the Pump Science program
    const programInstructions = txInfo.transaction.message.instructions.filter(
      (ix: any) => ix.programId.toString() === PUMP_SCIENCE_PROGRAM_ID.toString()
    );
    
    if (programInstructions.length === 0) {
      return null;
    }
    
    // Parse the instruction to determine the type and details
    const instruction = programInstructions[0] as ParsedInstruction;
    const programName = instruction.program;
    const instructionName = instruction.parsed?.type || 'unknown';
    
    // Determine transaction type
    let type: 'buy' | 'sell' | 'transfer' = 'transfer';
    if (instructionName.toLowerCase().includes('swap')) {
      // Check if it's a buy or sell based on the instruction data
      // This is a simplified check - in a real implementation, we would parse the actual instruction data
      type = instructionName.toLowerCase().includes('buy') ? 'buy' : 'sell';
    }
    
    // Get sender and receiver
    const sender = txInfo.transaction.message.accountKeys[0].pubkey.toString();
    const receiver = type === 'buy' ? sender : 'Pool'; // Simplified - in a real implementation, we would get the actual receiver
    
    // Get amount - this is a placeholder
    const amount = 0; // In a real implementation, we would parse the actual amount from the instruction data
    
    // Create the transaction object
    return {
      signature: txInfo.transaction.signatures[0],
      sender: formatPublicKey(sender),
      receiver: formatPublicKey(receiver),
      amount,
      timestamp: new Date(txInfo.blockTime ? txInfo.blockTime * 1000 : Date.now()),
      transactionLink: `https://explorer.solana.com/tx/${txInfo.transaction.signatures[0]}`,
      type
    };
  } catch (error) {
    console.error('Error parsing transaction:', error);
    return null;
  }
};

/**
 * Get the current SOL balance for a wallet
 * @param publicKey The wallet public key
 * @returns The SOL balance
 */
export const getSolBalance = async (
  publicKey: PublicKey | string
): Promise<number> => {
  try {
    const connection = getConnection();
    const pubkey = typeof publicKey === 'string' ? new PublicKey(publicKey) : publicKey;
    
    const balance = await withRetry(() => connection.getBalance(pubkey));
    return lamportsToSol(balance);
  } catch (error) {
    console.error('Error getting SOL balance:', error);
    return 0;
  }
};
