import { 
  PublicKey, 
  Transaction, 
  SystemProgram,
  SYSVAR_CLOCK_PUBKEY
} from '@solana/web3.js';
import { AnchorProvider, BN, Wallet, web3 } from '@coral-xyz/anchor';
import { 
  TOKEN_PROGRAM_ID, 
  ASSOCIATED_TOKEN_PROGRAM_ID, 
  getAssociatedTokenAddress 
} from '@solana/spl-token';
import { getConnection, withRetry, handleBlockchainError } from './connection';
import { 
  createProvider, 
  getPumpScienceProgram, 
  getBondingCurveAddress,
  getBondingCurveSolEscrowAddress,
  getGlobalStateAddress
} from './program';
import { SwapParams, SwapQuoteParams } from './types';
import { safeSignTransaction, safeSendTransaction, safeConnection } from './compatibility';

/**
 * Swap SOL for tokens or tokens for SOL
 * @param params Parameters for the swap
 * @returns The transaction signature
 */
// @ts-ignore - Ignoring TypeScript errors due to web3.js version conflicts
export const swap = async (
  params: SwapParams
): Promise<string> => {
  try {
    const { 
      baseIn, 
      exactInAmount, 
      minOutAmount, 
      maxSolInAmount, 
      publicKey, 
      mintAddress, 
      signTransaction, 
      sendTransaction 
    } = params;

    // Create a wallet adapter for the provider
    const wallet: Wallet = {
      publicKey,
      signTransaction: signTransaction || (() => Promise.reject(new Error('Sign transaction not implemented'))),
      signAllTransactions: () => Promise.reject(new Error('Sign all transactions not implemented')),
    };

    // Get connection and create provider
    const connection = getConnection();
    const provider = createProvider(wallet, connection);
    const program = getPumpScienceProgram(provider);

    // Convert mintAddress to PublicKey
    const mint = new PublicKey(mintAddress);

    // Derive necessary addresses
    const [globalState] = await getGlobalStateAddress();
    const [bondingCurve] = await getBondingCurveAddress(mint);
    const [bondingCurveSolEscrow] = await getBondingCurveSolEscrowAddress(mint);

    // Get the global state account to find the fee receiver
    const globalStateAccount = await program.account.global.fetch(globalState);
    const feeReceiver = globalStateAccount.feeReceiver;

    // Get associated token accounts
    const bondingCurveTokenAccount = await getAssociatedTokenAddress(
      mint,
      bondingCurve,
      true // allowOwnerOffCurve
    );

    const userTokenAccount = await getAssociatedTokenAddress(
      mint,
      publicKey
    );

    // Build the swap parameters
    const swapParams = {
      baseIn,
      exactInAmount,
      minOutAmount,
      maxSolInAmount: maxSolInAmount || null
    };

    // Create the transaction
    const transaction = await program.methods
      .swap(swapParams)
      .accounts({
        user: publicKey,
        global: globalState,
        feeReceiver,
        mint,
        bondingCurve,
        bondingCurveTokenAccount,
        bondingCurveSolEscrow,
        userTokenAccount,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        clock: SYSVAR_CLOCK_PUBKEY,
        eventAuthority: program.programId,
        program: program.programId
      })
      .transaction();

    // Sign and send the transaction
    let txid: string;
    if (sendTransaction) {
      txid = await safeSendTransaction(sendTransaction, transaction, connection);
    } else if (signTransaction) {
      const signedTx = await safeSignTransaction(signTransaction, transaction);
      txid = await withRetry(() => connection.sendRawTransaction(signedTx.serialize()));
    } else {
      throw new Error('No transaction signing method provided');
    }

    console.log(`Swap executed for token ${mintAddress}, txid: ${txid}`);
    return txid;
  } catch (error) {
    console.error('Error executing swap:', error);
    const blockchainError = handleBlockchainError(error);
    throw new Error(`Failed to execute swap: ${blockchainError.message}`);
  }
};

/**
 * Calculate the expected output amount for a swap
 * @param mintAddress The mint address of the token
 * @param inputAmount The input amount
 * @param isBuy Whether the swap is a buy (SOL to token) or sell (token to SOL)
 * @returns The expected output amount
 */
// @ts-ignore - Ignoring TypeScript errors due to web3.js version conflicts
export const calculateSwapOutput = async (
  mintAddress: string | PublicKey,
  inputAmount: BN | number,
  isBuy: boolean
): Promise<BN> => {
  try {
    const connection = getConnection();
    const mint = typeof mintAddress === 'string' ? new PublicKey(mintAddress) : mintAddress;
    const inputAmountBN = typeof inputAmount === 'number' ? new BN(inputAmount) : inputAmount;
    
    // Create a default provider (no wallet needed for reading)
    const provider = new AnchorProvider(
      connection,
      { publicKey: PublicKey.default } as any,
      { commitment: 'confirmed' }
    );
    
    const program = getPumpScienceProgram(provider);
    
    // Derive the bonding curve address
    const [bondingCurveAddress] = await getBondingCurveAddress(mint);
    
    // Fetch the bonding curve account data
    const bondingCurveData = await withRetry(() => 
      program.account.bondingCurve.fetch(bondingCurveAddress)
    );
    
    // Calculate the output amount based on the bonding curve formula
    // This is a simplified calculation and should be replaced with the actual formula from the program
    if (isBuy) {
      // SOL to token (buy)
      // Formula: (inputAmount * virtualTokenReserves) / (virtualSolReserves + inputAmount)
      const numerator = inputAmountBN.mul(bondingCurveData.virtualTokenReserves);
      const denominator = bondingCurveData.virtualSolReserves.add(inputAmountBN);
      return numerator.div(denominator);
    } else {
      // Token to SOL (sell)
      // Formula: (inputAmount * virtualSolReserves) / (virtualTokenReserves + inputAmount)
      const numerator = inputAmountBN.mul(bondingCurveData.virtualSolReserves);
      const denominator = bondingCurveData.virtualTokenReserves.add(inputAmountBN);
      return numerator.div(denominator);
    }
  } catch (error) {
    console.error('Error calculating swap output:', error);
    const blockchainError = handleBlockchainError(error);
    throw new Error(`Failed to calculate swap output: ${blockchainError.message}`);
  }
};

/**
 * Get the current price of a token in SOL
 * @param mintAddress The mint address of the token
 * @returns The current price in SOL
 */
// @ts-ignore - Ignoring TypeScript errors due to web3.js version conflicts
export const getTokenPrice = async (
  mintAddress: string | PublicKey
): Promise<number> => {
  try {
    const connection = getConnection();
    const mint = typeof mintAddress === 'string' ? new PublicKey(mintAddress) : mintAddress;
    
    // Create a default provider (no wallet needed for reading)
    const provider = new AnchorProvider(
      connection,
      { publicKey: PublicKey.default } as any,
      { commitment: 'confirmed' }
    );
    
    const program = getPumpScienceProgram(provider);
    
    // Derive the bonding curve address
    const [bondingCurveAddress] = await getBondingCurveAddress(mint);
    
    // Fetch the bonding curve account data
    const bondingCurveData = await withRetry(() => 
      program.account.bondingCurve.fetch(bondingCurveAddress)
    );
    
    // Calculate the current price based on the bonding curve formula
    // Price = virtualSolReserves / virtualTokenReserves
    const price = bondingCurveData.virtualSolReserves.toNumber() / 
                  bondingCurveData.virtualTokenReserves.toNumber();
    
    return price;
  } catch (error) {
    console.error('Error getting token price:', error);
    const blockchainError = handleBlockchainError(error);
    throw new Error(`Failed to get token price: ${blockchainError.message}`);
  }
};

/**
 * Get the swap history for a wallet
 * @param walletAddress The wallet address to get swap history for
 * @returns Array of swap events
 */
// @ts-ignore - Ignoring TypeScript errors due to web3.js version conflicts
export const getSwapHistory = async (walletAddress: PublicKey): Promise<any[]> => {
  try {
    const connection = getConnection();
    
    // Create a default provider (no wallet needed for reading)
    const provider = new AnchorProvider(
      connection,
      { publicKey: PublicKey.default } as any,
      { commitment: 'confirmed' }
    );
    
    const program = getPumpScienceProgram(provider);
    
    // Get program events filtered by the user's public key
    // This is a simplified implementation and should be replaced with actual event fetching
    const eventSignature = 'SwapEvent';
    const events = await withRetry(() => 
      connection.getParsedProgramAccounts(program.programId, {
        filters: [
          {
            memcmp: {
              offset: 8, // Skip the account discriminator
              bytes: walletAddress.toBase58()
            }
          }
        ]
      })
    );
    
    // Parse the events
    const swapEvents = events.map(event => {
      // This is a placeholder for actual event parsing
      // In a real implementation, you would decode the account data based on the program's event structure
      return {
        signature: event.pubkey.toString(),
        blockTime: 0, // Would be fetched from transaction info
        data: {}
      };
    });
    
    return swapEvents;
  } catch (error) {
    console.error('Error getting swap history:', error);
    const blockchainError = handleBlockchainError(error);
    throw new Error(`Failed to get swap history: ${blockchainError.message}`);
  }
};
