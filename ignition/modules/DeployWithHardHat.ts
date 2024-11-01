import { viem } from "hardhat";
import { toHex, hexToString, formatEther } from "viem";
import { privateKeyToAccount } from 'viem/accounts'

const PROPOSALS = ["Trump", "Harris", "Stein"];

async function main() {

  const publicClient = await viem.getPublicClient();
  const blockNumber = await publicClient.getBlockNumber();

  console.log("Last block number: ", blockNumber);

  const [deployer] = await viem.getWalletClients();
  console.log("Deployer address: ", deployer.account.address);
  
  const balance = await publicClient.getBalance({
    address: deployer.account.address,
  });
  
  console.log( "Deployer balance: ", formatEther(balance), deployer.chain.nativeCurrency.symbol);
  
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});