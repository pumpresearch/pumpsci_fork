import { Connection, Transaction, VersionedTransaction, PublicKey } from '@solana/web3.js';

/**
 * Type definition for a wallet adapter's signTransaction function
 * This is a more flexible type that works with different versions of @solana/web3.js
 */
export type SignTransactionFunction = 
  | ((transaction: Transaction) => Promise<Transaction>)
  | ((transaction: any) => Promise<any>)
  | undefined;

/**
 * Type definition for a wallet adapter's sendTransaction function
 * This is a more flexible type that works with different versions of @solana/web3.js
 */
export type SendTransactionFunction = 
  | ((transaction: Transaction, connection: Connection) => Promise<string>)
  | ((transaction: any, connection: any) => Promise<string>)
  | undefined;

/**
 * Type-safe wrapper for transaction signing
 * This helps resolve compatibility issues between different versions of @solana/web3.js
 */
export const safeSignTransaction = async <T extends Transaction | VersionedTransaction>(
  signTransaction: SignTransactionFunction,
  transaction: T
): Promise<T> => {
  if (!signTransaction) {
    throw new Error('Wallet does not support transaction signing');
  }
  
  try {
    // Cast the transaction and result to handle type compatibility issues
    return await signTransaction(transaction as any) as T;
  } catch (error) {
    console.error('Error in safeSignTransaction:', error);
    throw error;
  }
};

/**
 * Type-safe wrapper for transaction sending
 * This helps resolve compatibility issues between different versions of @solana/web3.js
 */
export const safeSendTransaction = async <T extends Transaction | VersionedTransaction>(
  sendTransaction: SendTransactionFunction,
  transaction: T,
  connection: Connection
): Promise<string> => {
  if (!sendTransaction) {
    throw new Error('Wallet does not support transaction sending');
  }
  
  try {
    // Cast the transaction and connection to handle type compatibility issues
    return await sendTransaction(
      transaction as any, 
      connection as any
    );
  } catch (error) {
    console.error('Error in safeSendTransaction:', error);
    throw error;
  }
};

/**
 * Type-safe connection wrapper
 * This helps resolve compatibility issues between different versions of @solana/web3.js
 */
export const safeConnection = (connection: Connection): any => {
  // Cast the connection to handle type compatibility issues
  return connection as any;
};

/**
 * Type-safe transaction wrapper
 * This helps resolve compatibility issues between different versions of @solana/web3.js
 */
export const safeTransaction = <T extends Transaction | VersionedTransaction>(transaction: T): any => {
  // Cast the transaction to handle type compatibility issues
  return transaction as any;
};

/**
 * Helper to safely cast any object to any type
 * This is used to work around type compatibility issues
 */
export const safeCast = <T>(value: any): T => {
  return value as T;
};
