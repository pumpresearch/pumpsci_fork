#!/bin/bash

SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)
OUTPUT="./.programsBin"
# saves external programs binaries to the output directory
source ${SCRIPT_DIR}/dump.sh ${OUTPUT}
# go to parent folder
cd $(dirname $(dirname $(dirname ${SCRIPT_DIR})))

if [ -z ${PROGRAMS+x} ]; then
    PROGRAMS="$(cat .github/.env | grep "PROGRAMS" | cut -d '=' -f 2)"
fi

# default to input from the command-line
ARGS=$*

# command-line arguments override env variable
if [ ! -z "$ARGS" ]; then
    PROGRAMS="[\"${1}\"]"
    shift
    ARGS=$*
fi

PROGRAMS=$(echo ${PROGRAMS} | jq -c '.[]' | sed 's/"//g')

# creates the output directory if it doesn't exist
if [ ! -d ${OUTPUT} ]; then
    mkdir ${OUTPUT}
fi

WORKING_DIR=$(pwd)
export SBF_OUT_DIR="${WORKING_DIR}/${OUTPUT}"

# First, ensure we have the target directory
mkdir -p ./programs/pump-science/target/deploy/

# Backup the existing keypair if it exists
if [ -f "./programs/pump-science/target/deploy/pump_science-keypair.json" ]; then
    cp ./programs/pump-science/target/deploy/pump_science-keypair.json ${OUTPUT}/pump_science-keypair.json.bak
fi

# Build the program
for p in ${PROGRAMS[@]}; do
    cd ${WORKING_DIR}/programs/${p}
    echo ${ARGS}
    cargo build-sbf --sbf-out-dir ${WORKING_DIR}/${OUTPUT} $ARGS
done

# cd back to the project root before copying
cd ${WORKING_DIR}

# Restore the original keypair
if [ -f "${OUTPUT}/pump_science-keypair.json.bak" ]; then
    mv ${OUTPUT}/pump_science-keypair.json.bak ${OUTPUT}/pump_science-keypair.json
    echo "Preserved original program ID"
else
    echo "No existing keypair found, using newly generated one"
fi

# Copy the built files to the target directory
cp ${OUTPUT}/pump_science.so ./programs/pump-science/target/deploy/
cp ${OUTPUT}/pump_science-keypair.json ./programs/pump-science/target/deploy/

echo "Build complete. Program files copied to target directory."
echo "You may now run 'anchor deploy' to deploy the program."
