import { viem } from "hardhat";
import { toHex, hexToString, formatEther, size } from "viem";
import { privateKeyToAccount } from 'viem/accounts'

const PROPOSALS = ["Trump", "Harris", "Stein"];

const args = process.argv;

/** command to run with arguments ⬇️ */
// npx ts-node --files ./scripts/DeployWithViem.ts "arg1" "arg2" "arg3"

// viem interacts with the blockchain via - PublicClient, WalletClient, TestClient


async function main() {
  console.log('ARGS :: ', args)
  // return

  /** The following 2 lines of code runs without having a wallet.
   * You can READ from the blockchain without "signing" a txn
   */

  let publicClient = await viem.getPublicClient()
  let lastBlock = await publicClient.getBlockNumber()
  console.log("Last block number:", lastBlock);

  const [deployer] = await viem.getWalletClients();
  console.log("Deployer Address -- ",deployer.account.address)
  let balance = await publicClient.getBalance({address:deployer.account.address})
  console.log("Deployer balance == ",formatEther(balance))

  // deploying contract + confirming contract deployment
  let ballotContract = await viem.deployContract("Ballot",[PROPOSALS.map(candidate => toHex(candidate, {size:32}))])
  console.log("Ballot contract deployed @ ", ballotContract.address)

  balance = await publicClient.getBalance({address:deployer.account.address})
  console.log("Deployer balance after deploying contract == ",formatEther(balance))
  
  console.log("These are the candidate: ")
  for(let i = 0; i < PROPOSALS.length; i++){

    let candidateArray = await ballotContract.read.proposals([BigInt(i)])
    let name = hexToString(candidateArray[0], {size:32})
    console.log(`${i+1}. Name: ${name} `)

  }

}

main()
.catch((error) => {
  console.error(error);
  process.exitCode = 1;
});



// const publicClient = await viem.getPublicClient();
// const blockNumber = await publicClient.getBlockNumber();

// console.log("Last block number: ", blockNumber);

// const [deployer] = await viem.getWalletClients();
// console.log("Deployer address: ", deployer.account.address);

// const balance = await publicClient.getBalance({
//   address: deployer.account.address,
// });

// console.log( "Deployer balance: ", formatEther(balance), deployer.chain.nativeCurrency.symbol);