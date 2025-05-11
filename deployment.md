# Pre-deployment

## Authority Configuration
1. Change `CREATION_AUTHORITY_PUBKEY` in `programs/pump-science/src/constants.rs` to match your wallet's public key.
   - This is **critical** as only this wallet will be authorized to initialize the program.
   - You can find your wallet's public key using `solana address` or `solana config get keypair`.
   - Example: `pub const CREATION_AUTHORITY_PUBKEY: &str = "YOUR_WALLET_PUBLIC_KEY";`

# Update

## Rebuild (preserves program ID)
- Make your code changes
- Build the program while preserving the program ID
`pnpm programs:rebuild`
- The `programs:rebuild` script automatically copies the files to the target directory. If you need to do it manually, make sure you're in the project root directory:
```bash
# Create the target directory if it doesn't exist
mkdir -p ./programs/pump-science/target/deploy/

# Copy the .so file and keypair.json (make sure you're in the project root directory)
cp ./.programsBin/pump_science.so ./programs/pump-science/target/deploy/
cp ./.programsBin/pump_science-keypair.json ./programs/pump-science/target/deploy/
```
- Deploy the updated program
`anchor deploy`

# Deploy to Devnet
To deploy to devnet specifically, use:
```bash
anchor deploy --provider.cluster devnet
```

You can also specify a custom RPC endpoint if needed:
```bash
anchor deploy --provider.cluster devnet --provider.url https://api.devnet.solana.com
```

# Initialize

## Program Initialization
1. Navigate to the `cli` directory:
   ```bash
   cd cli
   ```

2. Run the global initialization command:
   ```bash
   npx ts-node command.ts global -e devnet -k /path/to/your/keypair.json
   ```
   - Replace `/path/to/your/keypair.json` with the path to your keypair file (e.g., `/home/user/.config/solana/id.json`).
   - This keypair **must** match the `CREATION_AUTHORITY_PUBKEY` you set in the constants file.
   - The command will create and initialize the global state account for your program.

3. Verify successful initialization by checking the transaction logs for `Program G9sh8zEyXBzXRhRUj5nwbjQPNaeu1uPE7g5UBRNSs17Y success`.

## Post-Initialization Steps

1. Create a bonding curve (optional):
   ```bash
   npx ts-node command.ts createCurve -e devnet -k /path/to/your/keypair.json
   ```

2. Add whitelist (optional):
   ```bash
   npx ts-node command.ts addWl -e devnet -k /path/to/your/keypair.json
   ```

3. Migrate a token (requires existing token mint):
   ```bash
   npx ts-node command.ts migrate -e devnet -k /path/to/your/keypair.json -m YOUR_TOKEN_MINT_ADDRESS
   ```

4. Test swapping (requires existing token mint):
   ```bash
   npx ts-node command.ts swap -e devnet -k /path/to/your/keypair.json -m YOUR_TOKEN_MINT_ADDRESS
   ```

## Configuration Settings
1. Change the fee_receiver in the appropriate configuration.
2. Set desired meteora_config as needed for your deployment.

## Troubleshooting
- **IDL Loading Issues**: If you encounter errors related to missing IDL files, ensure you've run `anchor build` in the project root directory before running CLI commands.
- **Authority Errors**: If you get `InvalidAuthority` errors, verify that the keypair you're using matches the `CREATION_AUTHORITY_PUBKEY` in the constants file.
- **RPC Connection Errors**: For RPC-related errors, try specifying an explicit RPC URL with the `-r` flag, e.g., `-r https://api.devnet.solana.com`.
