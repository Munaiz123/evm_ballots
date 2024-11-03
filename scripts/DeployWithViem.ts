import {formatEther, toHex } from "viem";
import {publicClient, deployer} from "./index";
import { abi as ballotABI, bytecode as ballotBytecode } from "../artifacts/contracts/Ballot.sol/Ballot.json";


/* In this file:
 - Pulls in ABI and Byte code from compiled Ballot.sol ('npx hardhat compile')
 - Pulls in Argments from command line (npx ts-node --files ./scripts/DeployWithViem.ts arg1 arg2 arg3)
 - Ballot.sol is deployed on Base Sepolia test net
 - Logs out the contract address
*/

async function main() {
  console.log(process.argv)
  const proposals = process.argv.slice(2);
  console.log("ARGS === ",proposals)
  
  if (!proposals || proposals.length < 1) throw new Error("Proposals not provided");


  const balance = await publicClient.getBalance({ address: deployer.account.address });
  console.log("Deployer balance: ", formatEther(balance), deployer.chain.nativeCurrency.symbol);

  // delploying contract
  const ballotContractTxnHash = await deployer.deployContract({
    abi: ballotABI,
    bytecode: ballotBytecode as `0x${string}`,
    args: [proposals.map((prop) => toHex(prop, { size: 32 }))],
  });

  //waiting
  console.log("Transaction hash -> ", ballotContractTxnHash);
  console.log("Waiting for confirmations...");

  //confirming contract deployment
  const ballotContract = await publicClient.waitForTransactionReceipt({ hash:ballotContractTxnHash });
  console.log("Ballot contract deployed to:", ballotContract.contractAddress);
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});