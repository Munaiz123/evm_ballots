import { task, type HardhatUserConfig } from "hardhat/config";
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
import { toHex, hexToString, formatEther } from "viem";
import "@nomicfoundation/hardhat-toolbox-viem";
import * as dotenv from "dotenv";
dotenv.config();


const providerApiKey = process.env.ALCHEMY_API_KEY || "";
const deployerPrivateKey = process.env.PRIVATE_KEY || "";

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
    }
  },
};

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.viem.getWalletClients();

  for (const account of accounts) {
    console.log("account address -- ", account.account.address);
  }

});

task("hello100", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.viem.getWalletClients();

  for (let i = 1; i <= 100; i++) {
    console.log(`${i}. Hello!`);
  }
  
});

export default config;