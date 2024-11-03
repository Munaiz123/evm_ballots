import {publicClient} from "./index";

import { abi as ballotABI} from "../artifacts/contracts/Ballot.sol/Ballot.json";
import {Address, hexToString} from "viem"

/* In this file:
 - Pulls in Argments from command line (npx ts-node --files ./scripts/ReadBallotContract.ts 0x...) 
    --> first arg needs to be contract address
 - Pulls in ABI and Byte code from compiled Ballot.sol so we can interact with deployed contract
 - Logs out the 'Proposal[] public proposals' array (new function added to get length)
 - Logs out the names of the proposals one by one
*/

async function main() {
    const args = process.argv.slice(2);
    console.log("ARGS === ", args)

    let deployedContractAddress = args[0]; // first argument should be the deployed contract address

    console.log('Fetching length of array...')

    const proposalsLength = await publicClient.readContract({
        address: deployedContractAddress as Address,
        abi: ballotABI,
        functionName: "getProposalsLength",
        args: []
    }) as bigint;

    for (let index = 0; index < proposalsLength; index++) {
        const candidates = (await publicClient.readContract({
          address: deployedContractAddress as Address,
          abi:ballotABI,
          functionName: "proposals",
          args: [BigInt(index)],
        })) as any[];

        const name = hexToString(candidates[0], { size: 32 });
        console.log({ index, name, candidates });
    }

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });