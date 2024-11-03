import { createPublicClient, http, createWalletClient, formatEther, toHex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import {baseSepolia} from "viem/chains";

import * as dotenv from "dotenv";
dotenv.config();

/**
 * This file does a few things on the Sepolia Base (Ethereum L2) blockchain :
 * 
 *  1. Pulls in alchemy API key & wallet private key from .env file
 *  2. Creates wallet client that will sign txns & deploy smart contracts
 *  3. Creates public client to interact with deployed contracts
 */

const providerApiKey = process.env.ALCHEMY_API_KEY || "";
const deployerPrivateKey = process.env.PRIVATE_KEY || "";

const accountAddress = privateKeyToAccount(`0x${deployerPrivateKey}`); 
const publicClient = createPublicClient({ chain: baseSepolia, transport: http(`https://base-sepolia.g.alchemy.com/v2/${providerApiKey}`)});
const deployer = createWalletClient({ account:accountAddress, chain: baseSepolia, transport: http(`https://base-sepolia.g.alchemy.com/v2/${providerApiKey}`)});


export {
    publicClient,
    deployer
}
