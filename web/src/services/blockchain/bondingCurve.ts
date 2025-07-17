import { 
  PublicKey, 
  Transaction, 
  TransactionInstruction,
  Connection,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  VersionedTransaction,
  Keypair
} from '@solana/web3.js';
import { AnchorProvider, BN, Program, Wallet, web3 } from '@coral-xyz/anchor';
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
  getGlobalStateAddress,
  getWhitelistAddress
} from './program';
import { CreateBondingCurveParams, BlockchainError, PumpScienceIDL } from './types';
import { safeSignTransaction, safeSendTransaction, safeConnection } from './compatibility';

/**
 * Create a bonding curve token
 * @param params Parameters for creating a bonding curve
 * @returns The mint address of the newly created token
 */
// @ts-ignore - Ignoring TypeScript errors due to web3.js version conflicts
export const createBondingCurve = async (
  params: CreateBondingCurveParams
): Promise<{ instruction: TransactionInstruction; mintKeypair: Keypair; mint: string }> => {
  try {
    const { 
      name, 
      symbol, 
      uri, 
      startSlot, 
      publicKey, 
      signTransaction, 
      sendTransaction 
    } = params;

    // Create a wallet adapter for the provider
    const wallet = {
      publicKey,
      signTransaction: signTransaction 
        ? <T extends Transaction | VersionedTransaction>(tx: T): Promise<T> => {
            return signTransaction(tx as Transaction) as Promise<T>;
          }
        : <T extends Transaction | VersionedTransaction>(tx: T): Promise<T> => {
            return Promise.reject(new Error('Sign transaction not implemented'));
          },
      signAllTransactions: () => Promise.reject(new Error('Sign all transactions not implemented')),
    } as any; // Use any to bypass strict typing for wallet adapter

    // Get connection and create provider
    const connection = getConnection();
    const provider = createProvider(wallet, connection);
    const program = getPumpScienceProgram(provider);

    // Create a keypair for the mint
    const mintKeypair = web3.Keypair.generate();
    const mint = mintKeypair.publicKey;

    // Derive necessary addresses
    const [globalState] = await getGlobalStateAddress();
    const [bondingCurve] = await getBondingCurveAddress(mint);
    const [bondingCurveSolEscrow] = await getBondingCurveSolEscrowAddress(mint);

    // Get associated token account for the bonding curve
    const bondingCurveTokenAccount = await getAssociatedTokenAddress(
      mint,
      bondingCurve,
      true // allowOwnerOffCurve
    );

    // Get metadata account
    const METADATA_PROGRAM_ID = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');
    const [metadata] = PublicKey.findProgramAddressSync(
      [Buffer.from('metadata'), METADATA_PROGRAM_ID.toBuffer(), mint.toBuffer()],
      METADATA_PROGRAM_ID
    );

    // Check if whitelist is enabled
    const globalStateAccount = await program.account.global.fetch(globalState);
    
    // Prepare whitelist account if needed
    let whitelist: PublicKey | null = null;
    if (globalStateAccount.whitelistEnabled) {
      const [whitelistAddress] = await getWhitelistAddress(publicKey);
      try {
        // Check if whitelist exists
        await program.account.whitelist.fetch(whitelistAddress);
        whitelist = whitelistAddress;
        console.log('User is whitelisted, whitelist account:', whitelistAddress.toString());
      } catch (error) {
        console.error('Whitelist is enabled but user is not whitelisted:', publicKey.toString());
        throw new Error('Whitelist is enabled but you are not whitelisted. Please contact the administrator to be added to the whitelist.');
      }
    }

    // Build the transaction
    const createBondingCurveParams = {
      name,
      symbol,
      uri,
      startSlot: startSlot || null
    };

    // Create the accounts object with proper typing
    const accounts = {
        mint,
        creator: publicKey,
        bondingCurve,
        bondingCurveTokenAccount,
        bondingCurveSolEscrow,
        global: globalState,
      whitelist: whitelist || getPumpScienceProgram(provider).programId, // Pass programId if no whitelist
        metadata,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        tokenMetadataProgram: METADATA_PROGRAM_ID,
        rent: SYSVAR_RENT_PUBKEY,
        eventAuthority: program.programId,
      program: program.programId,
    };

    // Create the transaction
    const transaction = await program.methods
      .createBondingCurve(createBondingCurveParams)
      .accounts(accounts)
      .signers([mintKeypair])
      .instruction(); // Get instruction instead of full transaction

    // Return the transaction instruction and mint keypair for frontend to handle
    return {
      instruction: transaction,
      mintKeypair,
      mint: mint.toString()
    };
  } catch (error) {
    console.error('Error creating bonding curve:', error);
    const blockchainError = handleBlockchainError(error);
    throw new Error(`Failed to create bonding curve: ${blockchainError.message}`);
  }
};

/**
 * Fetch bonding curve data for a token
 * @param mint The mint address
 * @returns The bonding curve data
 */
// @ts-ignore - Ignoring TypeScript errors due to web3.js version conflicts
export const fetchBondingCurveData = async (
  mint: PublicKey | string
): Promise<any> => {
  try {
    const connection = getConnection();
    const mintPubkey = typeof mint === 'string' ? new PublicKey(mint) : mint;
    
    // Create a default provider (no wallet needed for reading)
    const provider = new AnchorProvider(
      connection,
      { publicKey: PublicKey.default } as any,
      { commitment: 'confirmed' }
    );
    
    const program = getPumpScienceProgram(provider);
    
    // Derive the bonding curve address
    const [bondingCurveAddress] = await getBondingCurveAddress(mintPubkey);
    
    // Fetch the bonding curve account data
    return await withRetry(() => program.account.bondingCurve.fetch(bondingCurveAddress));
  } catch (error) {
    console.error('Error fetching bonding curve data:', error);
    const blockchainError = handleBlockchainError(error);
    throw new Error(`Failed to fetch bonding curve data: ${blockchainError.message}`);
  }
};

/**
 * Check if a token is a bonding curve token
 * @param mint The mint address
 * @returns Whether the token is a bonding curve token
 */
// @ts-ignore - Ignoring TypeScript errors due to web3.js version conflicts
export const isBondingCurveToken = async (
  mint: PublicKey | string
): Promise<boolean> => {
  try {
    await fetchBondingCurveData(mint);
    return true;
  } catch (error) {
    return false;
  }
};
