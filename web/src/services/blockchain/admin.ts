import { 
  PublicKey, 
  Transaction, 
  Connection,
  SystemProgram
} from '@solana/web3.js';
import { AnchorProvider, BN, Wallet } from '@coral-xyz/anchor';
import { getConnection, withRetry, handleBlockchainError } from './connection';
import { 
  createProvider, 
  getPumpScienceProgram, 
  getGlobalStateAddress,
  getWhitelistAddress
} from './program';
import { GlobalSettingsInput } from './types';

/**
 * Initialize the Pump Science program
 * @param wallet The wallet to use for the transaction
 * @param params The global settings parameters
 * @returns The transaction signature
 */
// @ts-ignore - Ignoring TypeScript errors due to web3.js version conflicts
export const initialize = async (
  wallet: Wallet,
  params: GlobalSettingsInput
): Promise<string> => {
  try {
    // Get connection and create provider
    const connection = getConnection();
    const provider = createProvider(wallet, connection);
    const program = getPumpScienceProgram(provider);

    // Derive the global state address
    const [globalState] = await getGlobalStateAddress();

    // Create the transaction
    const transaction = await program.methods
      .initialize(params)
      .accounts({
        authority: wallet.publicKey,
        global: globalState,
        systemProgram: SystemProgram.programId,
        eventAuthority: program.programId,
        program: program.programId
      })
      .transaction();

    // Sign and send the transaction
    const signedTx = await wallet.signTransaction(transaction);
    const txid = await withRetry(() => 
      connection.sendRawTransaction(signedTx.serialize())
    );

    console.log(`Initialized Pump Science program, txid: ${txid}`);
    return txid;
  } catch (error) {
    console.error('Error initializing Pump Science program:', error);
    const blockchainError = handleBlockchainError(error);
    throw new Error(`Failed to initialize Pump Science program: ${blockchainError.message}`);
  }
};

/**
 * Update the global settings of the Pump Science program
 * @param wallet The wallet to use for the transaction
 * @param params The global settings parameters
 * @param newAuthority Optional new authority
 * @param newMigrationAuthority Optional new migration authority
 * @returns The transaction signature
 */
// @ts-ignore - Ignoring TypeScript errors due to web3.js version conflicts
export const setParams = async (
  wallet: Wallet,
  params: GlobalSettingsInput,
  newAuthority?: PublicKey,
  newMigrationAuthority?: PublicKey
): Promise<string> => {
  try {
    // Get connection and create provider
    const connection = getConnection();
    const provider = createProvider(wallet, connection);
    const program = getPumpScienceProgram(provider);

    // Derive the global state address
    const [globalState] = await getGlobalStateAddress();

    // Create the transaction
    const transaction = await program.methods
      .setParams(params)
      .accounts({
        authority: wallet.publicKey,
        global: globalState,
        newAuthority: newAuthority || null,
        newMigrationAuthority: newMigrationAuthority || null,
        systemProgram: SystemProgram.programId,
        eventAuthority: program.programId,
        program: program.programId
      })
      .transaction();

    // Sign and send the transaction
    const signedTx = await wallet.signTransaction(transaction);
    const txid = await withRetry(() => 
      connection.sendRawTransaction(signedTx.serialize())
    );

    console.log(`Updated Pump Science program parameters, txid: ${txid}`);
    return txid;
  } catch (error) {
    console.error('Error updating Pump Science program parameters:', error);
    const blockchainError = handleBlockchainError(error);
    throw new Error(`Failed to update Pump Science program parameters: ${blockchainError.message}`);
  }
};

/**
 * Add a creator to the whitelist
 * @param wallet The admin wallet
 * @param creatorPublicKey The public key of the creator to add
 * @returns The transaction signature
 */
// @ts-ignore - Ignoring TypeScript errors due to web3.js version conflicts
export const addToWhitelist = async (
  wallet: Wallet,
  creatorPublicKey: PublicKey
): Promise<string> => {
  try {
    // Get connection and create provider
    const connection = getConnection();
    const provider = createProvider(wallet, connection);
    const program = getPumpScienceProgram(provider);

    // Derive the global state and whitelist addresses
    const [globalState] = await getGlobalStateAddress();
    const [whitelist] = await getWhitelistAddress(creatorPublicKey);

    // Create the transaction
    const transaction = await program.methods
      .addWl(creatorPublicKey)
      .accounts({
        global: globalState,
        whitelist,
        admin: wallet.publicKey,
        systemProgram: SystemProgram.programId
      })
      .transaction();

    // Sign and send the transaction
    const signedTx = await wallet.signTransaction(transaction);
    const txid = await withRetry(() => 
      connection.sendRawTransaction(signedTx.serialize())
    );

    console.log(`Added ${creatorPublicKey.toString()} to whitelist, txid: ${txid}`);
    return txid;
  } catch (error) {
    console.error('Error adding to whitelist:', error);
    const blockchainError = handleBlockchainError(error);
    throw new Error(`Failed to add to whitelist: ${blockchainError.message}`);
  }
};

/**
 * Remove a creator from the whitelist
 * @param wallet The admin wallet
 * @param creatorPublicKey The public key of the creator to remove
 * @returns The transaction signature
 */
// @ts-ignore - Ignoring TypeScript errors due to web3.js version conflicts
export const removeFromWhitelist = async (
  wallet: Wallet,
  creatorPublicKey: PublicKey
): Promise<string> => {
  try {
    // Get connection and create provider
    const connection = getConnection();
    const provider = createProvider(wallet, connection);
    const program = getPumpScienceProgram(provider);

    // Derive the global state and whitelist addresses
    const [globalState] = await getGlobalStateAddress();
    const [whitelist] = await getWhitelistAddress(creatorPublicKey);

    // Create the transaction
    const transaction = await program.methods
      .removeWl()
      .accounts({
        global: globalState,
        whitelist,
        admin: wallet.publicKey,
        systemProgram: SystemProgram.programId
      })
      .transaction();

    // Sign and send the transaction
    const signedTx = await wallet.signTransaction(transaction);
    const txid = await withRetry(() => 
      connection.sendRawTransaction(signedTx.serialize())
    );

    console.log(`Removed ${creatorPublicKey.toString()} from whitelist, txid: ${txid}`);
    return txid;
  } catch (error) {
    console.error('Error removing from whitelist:', error);
    const blockchainError = handleBlockchainError(error);
    throw new Error(`Failed to remove from whitelist: ${blockchainError.message}`);
  }
};

/**
 * Check if a creator is whitelisted
 * @param creatorPublicKey The public key of the creator to check
 * @returns Whether the creator is whitelisted
 */
// @ts-ignore - Ignoring TypeScript errors due to web3.js version conflicts
export const isWhitelisted = async (
  creatorPublicKey: PublicKey
): Promise<boolean> => {
  try {
    // Get connection and create a default provider
    const connection = getConnection();
    const provider = new AnchorProvider(
      connection,
      { publicKey: PublicKey.default } as any,
      { commitment: 'confirmed' }
    );
    const program = getPumpScienceProgram(provider);

    // Derive the whitelist address
    const [whitelist] = await getWhitelistAddress(creatorPublicKey);

    // Try to fetch the whitelist account
    await program.account.whitelist.fetch(whitelist);
    return true;
  } catch (error) {
    // If the account doesn't exist, the creator is not whitelisted
    return false;
  }
};

/**
 * Get the global state of the Pump Science program
 * @returns The global state
 */
// @ts-ignore - Ignoring TypeScript errors due to web3.js version conflicts
export const getGlobalState = async (): Promise<any> => {
  try {
    // Get connection and create a default provider
    const connection = getConnection();
    const provider = new AnchorProvider(
      connection,
      { publicKey: PublicKey.default } as any,
      { commitment: 'confirmed' }
    );
    const program = getPumpScienceProgram(provider);

    // Derive the global state address
    const [globalState] = await getGlobalStateAddress();

    // Fetch the global state account
    return await withRetry(() => program.account.global.fetch(globalState));
  } catch (error) {
    console.error('Error fetching global state:', error);
    const blockchainError = handleBlockchainError(error);
    throw new Error(`Failed to fetch global state: ${blockchainError.message}`);
  }
};
