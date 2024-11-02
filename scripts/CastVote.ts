import {hexToString } from "viem";
import {publicClient, deployer as voter} from "./index";
import { abi as ballotABI} from "../artifacts/contracts/Ballot.sol/Ballot.json";

/* In this file:
 - Pulls in Argments from command line (npx ts-node --files ./scripts/CastVote.ts 0x...) 
    --> first arg needs to be contract address
    --> second arg needs to be index of the proposal you're voting for
 - Pulls in ABI and Byte code from compiled Ballot.sol so we can interact with deployed contract
 - Confirms with voter the candidate.
 - Updates the contract state with voter count, 
*/

async function main() {
    const parameters = process.argv.slice(2);

    if (!parameters || parameters.length < 2) throw new Error("Parameters not provided");
    
    const contractAddress = parameters[0] as `0x${string}`;
    if (!contractAddress) throw new Error("Contract address not provided");
    if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress)) throw new Error("Invalid contract address");
    
    const proposalIndex = parameters[1];
    if (isNaN(Number(proposalIndex))) throw new Error("Invalid proposal index");


    const proposal = (await publicClient.readContract({ 
        address: contractAddress,
        abi: ballotABI, // pulling in abi to read contract
        functionName: "proposals",
        args: [BigInt(proposalIndex)],
    })) as any[];

    const name = hexToString(proposal[0], { size: 32 });
    console.log(`Are you sure you want to vote for ${name}?`);
    console.log("Confirm? (Y/n)");

    const stdin = process.stdin;

    stdin.addListener("data", async d => {
        let input = d.toString().trim().toLowerCase();

        if (input == "y") { // after confirmin in the command line, then you're writing to the blockchain

            let hash = await voter.writeContract({  // voter here is the walletClient you've created to interact/sign txns on the blockchain
                address: contractAddress,
                abi: ballotABI, // pullin in abi to write / change the state of the contract
                functionName: "vote", 
                args: [BigInt(proposalIndex)],
            });

            let receipt = await publicClient.waitForTransactionReceipt({ hash });
            console.log("Transaction confirmed --- ", receipt);
        }
    })
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });