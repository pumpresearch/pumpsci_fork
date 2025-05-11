# Pre-deployment

Change CREATION_AUTHORITY_PUBKEY in programs/pump-science/src/constants.rs

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

# Initialize
1. Change the fee_receiver.
2. Set desired meteora_config
