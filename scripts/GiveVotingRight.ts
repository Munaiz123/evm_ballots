
import {publicClient, deployer} from "./index";
import { abi as ballotABI} from "../artifacts/contracts/Ballot.sol/Ballot.json";
import {Address, hexToString} from "viem"

/* In this file:
 - 
 - Pulls in Argments from command line (npx ts-node --files ./scripts/GiveVotingRight.ts) 
    --> first arg needs to be deployed contract address
    --> second arg needs to be wallet address that is getting voting rights

 - Returns the new voter's information - Weight, voted, delegate, vote
*/

async function main() {
    console.log(ballotABI.find(item => item.name === "voters"));
    // return

    const parameters = process.argv.slice(2);
    if (!parameters || parameters.length < 1) throw new Error("Parameters not provided");
    
    const contractAddress = parameters[0] as `0x${string}`;
    if (!contractAddress) throw new Error("Contract address not provided");
    if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress)) throw new Error("Invalid contract address");
    
    const newVoterAddress = parameters[1] as `0x${string}`;
    if (!newVoterAddress) throw new Error("Wallet address not provided");
    if (!/^0x[a-fA-F0-9]{40}$/.test(newVoterAddress)) throw new Error("Invalid contract address");


    let hash = await deployer.writeContract({
        address:contractAddress,
        abi: ballotABI,
        functionName:"giveRightToVote",
        args:[newVoterAddress as Address]
    })

    let receipt = await publicClient.waitForTransactionReceipt({ hash });
    console.log("Transaction confirmed --- ", receipt);

    console.log("Fetching new voter info... ");
    const voter = await publicClient.readContract({
        address: contractAddress,
        abi: ballotABI,
        functionName: "voters",
        args: [newVoterAddress], // the address you want to query
    }) as [bigint, boolean, string, bigint]; // type annotation for the return tuple
    
    const [weight, voted, delegate, vote] = voter;
    let newVoterObj = {weight, voted, delegate, vote}

    console.log("NEW VOTER = ", newVoterObj);

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });