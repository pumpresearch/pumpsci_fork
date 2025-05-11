import { PublicKey, Transaction, Connection, VersionedTransaction } from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';
import { Idl } from '@coral-xyz/anchor';

// Import the raw JSON IDL
import ACTUAL_IDL_JSON_CONTENT from '../../idls/pump_science.json';

// Cast the raw JSON import to Anchor's Idl type.
// This ensures that fields like instruction arguments' 'type' are inferred
// as specific string literals (e.g., "u64") rather than generic 'string',
// satisfying the IdlType constraint.
export const PUMP_SCIENCE_IDL_TYPED = ACTUAL_IDL_JSON_CONTENT as Idl;

// Define PumpScienceIDL as an alias to Anchor's Idl type.
// The Program constructor expects an IDL compatible with this type.
export type PumpScienceIDL = Idl;

// Social causes for tokens
export type SocialCause = 'Environmental' | 'Educational' | 'Healthcare' | 'Food Security' | 'Other';

// Token listing interface for UI
export interface TokenListing {
  id: string;
  name: string;
  symbol: string;
  description: string;
  cause: SocialCause;
  mintAddress: string;
  price: number;
  priceChange: number;
  volume: number;
  createdAt: Date;
}

// Transaction history interface for UI
export interface TokenTransaction {
  signature: string;
  sender: string;
  receiver: string;
  amount: number;
  timestamp: Date;
  transactionLink: string;
  type: 'buy' | 'sell' | 'transfer';
}

// Parameters for creating a bonding curve token
export interface CreateBondingCurveParams {
  name: string;
  symbol: string;
  uri: string;
  startSlot?: BN;
  publicKey: PublicKey;
  signTransaction?: (transaction: Transaction) => Promise<Transaction>;
  sendTransaction?: (transaction: Transaction, connection: Connection) => Promise<string>;
}

// Parameters for swapping tokens
export interface SwapParams {
  baseIn: boolean;
  exactInAmount: BN;
  minOutAmount: BN;
  maxSolInAmount?: BN;
  publicKey: PublicKey;
  mintAddress: string;
  signTransaction?: (transaction: Transaction) => Promise<Transaction>;
  sendTransaction?: (transaction: Transaction, connection: Connection) => Promise<string>;
}

// Global settings input parameters
export interface GlobalSettingsInput {
  initialVirtualTokenReserves: BN;
  initialVirtualSolReserves: BN;
  initialRealTokenReserves: BN;
  tokenTotalSupply: BN;
  mintDecimals: number;
  migrateFeeAmount: BN;
  migrationTokenAllocation: BN;
  feeReceiver: PublicKey;
  whitelistEnabled: boolean;
  meteoraConfig: PublicKey;
}

// Parameters for getting a swap quote
export interface SwapQuoteParams {
  baseIn: boolean;
  exactInAmount: BN;
  mintAddress: string;
}

// Error handling interface
export interface BlockchainError {
  code: number;
  name: string;
  message: string;
  isUserError: boolean;
}
