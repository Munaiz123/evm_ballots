import { task, type HardhatUserConfig } from "hardhat/config";

import "@nomicfoundation/hardhat-toolbox-viem";

const config: HardhatUserConfig = {
  solidity: "0.8.27",
};

export default config;

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.viem.getWalletClients();

  for (const account of accounts) {
    console.log(account.account.address);
  }
  
});