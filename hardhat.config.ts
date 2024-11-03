import { task, type HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";

import * as dotenv from "dotenv";
dotenv.config();


const providerApiKey = process.env.ALCHEMY_API_KEY || "";
// const providerApiKey = process.env.INFURA_API_KEY || "";
const deployerPrivateKey = process.env.PRIVATE_KEY || "";



const config: HardhatUserConfig = {
  solidity: "0.8.27",
  networks: {
    sepolia: {
      // url: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
      url:`https://base-sepolia.g.alchemy.com/v2/${providerApiKey}`,
      // url: `https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`,
      // url: "https://ethereum-sepolia-rpc.publicnode.com",
      accounts: [deployerPrivateKey]
    }
  },
};

export default config;

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.viem.getWalletClients();

  for (const account of accounts) {
    console.log(account.account.address);
  }
  
});