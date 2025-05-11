import { AnchorProvider, Program, setProvider } from '@coral-xyz/anchor';
import { Connection, PublicKey } from '@solana/web3.js';
import { getConnection } from './connection';
import { PUMP_SCIENCE_IDL_TYPED, PumpScienceIDL } from './types';

// Program ID for the Pump Science program
// Note: This should be updated with the actual deployed program ID
export const PUMP_SCIENCE_PROGRAM_ID = new PublicKey(
  'PumpScienceProgramID111111111111111111111111'
);

/**
 * Create an Anchor provider with the given wallet
 * @param wallet The wallet to use for the provider
 * @param connection Optional connection to use (defaults to connection pool)
 * @returns An Anchor provider
 */
export const createProvider = (
  wallet: any,
  connection: Connection = getConnection()
): AnchorProvider => {
  return new AnchorProvider(
    connection,
    wallet,
    { commitment: connection.commitment || 'confirmed' }
  );
};

/**
 * Returns an instance of the Pump Science program.
 * @param provider The AnchorProvider to use for the program.
 * @returns The Pump Science program instance.
 */
export const getPumpScienceProgram = (provider: AnchorProvider): Program<PumpScienceIDL> => {
  return new Program<PumpScienceIDL>(PUMP_SCIENCE_IDL_TYPED, PUMP_SCIENCE_PROGRAM_ID, provider);
};

/**
 * Helper function to get the program with a default provider.
 * Useful for read-only operations or when a wallet provider isn't explicitly available.
 */
export const getPumpScienceProgramWithDefaultProvider = (): Program<PumpScienceIDL> => {
  const connection = getConnection();
  // Create a dummy wallet structure for AnchorProvider if no real wallet is needed for read-only ops
  const dummyWallet = {
    publicKey: PublicKey.default, // Or any placeholder PublicKey
    signTransaction: async (tx: any) => tx,
    signAllTransactions: async (txs: any[]) => txs,
  };
  const defaultProvider = new AnchorProvider(
    connection,
    dummyWallet, 
    AnchorProvider.defaultOptions()
  );
  setProvider(defaultProvider); // Set the default provider for the workspace (optional, depends on usage)
  return getPumpScienceProgram(defaultProvider);
};

/**
 * Derive the global state account address
 * @returns The global state account address
 */
export const getGlobalStateAddress = async (): Promise<[PublicKey, number]> => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('global')],
    PUMP_SCIENCE_PROGRAM_ID
  );
};

/**
 * Derive the bonding curve account address for a given mint
 * @param mint The mint address
 * @returns The bonding curve account address
 */
export const getBondingCurveAddress = async (mint: PublicKey): Promise<[PublicKey, number]> => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('bonding_curve'), mint.toBuffer()],
    PUMP_SCIENCE_PROGRAM_ID
  );
};

/**
 * Derive the bonding curve SOL escrow address for a given mint
 * @param mint The mint address
 * @returns The bonding curve SOL escrow address
 */
export const getBondingCurveSolEscrowAddress = async (mint: PublicKey): Promise<[PublicKey, number]> => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('sol_escrow'), mint.toBuffer()],
    PUMP_SCIENCE_PROGRAM_ID
  );
};

/**
 * Derive the whitelist account address for a creator
 * @param creator The creator's public key
 * @returns The whitelist account address
 */
export const getWhitelistAddress = async (creator: PublicKey): Promise<[PublicKey, number]> => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('whitelist'), creator.toBuffer()],
    PUMP_SCIENCE_PROGRAM_ID
  );
};

/**
 * Derive the pool account address for a bonding curve
 * @param bondingCurve The bonding curve address
 * @returns The pool account address
 */
export const getPoolAddress = async (bondingCurve: PublicKey): Promise<[PublicKey, number]> => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('pool'), bondingCurve.toBuffer()],
    PUMP_SCIENCE_PROGRAM_ID
  );
};
