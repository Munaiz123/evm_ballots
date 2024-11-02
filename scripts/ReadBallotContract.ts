import {publicClient, deployer} from "./index";
import { abi as ballotABI} from "../artifacts/contracts/Ballot.sol/Ballot.json";
import {Address, hexToString} from "viem"

async function main() {
    const args = process.argv.slice(2);
    console.log("ARGS === ", args)

    let deployedContractAddress = args[0];

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