import { expect } from "chai";
import { toHex, hexToString } from "viem";
import { viem } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

const CANDIDATES = ["Trump", "Harris", "Stein"];

async function deployContract() {
  const publicClient = await viem.getPublicClient();
  const [deployer, otherAccount] = await viem.getWalletClients();
  
  const ballotContract = await viem.deployContract("Ballot", [
    CANDIDATES.map((prop) => toHex(prop, { size: 32 })),
  ]);
  return { publicClient, deployer, otherAccount, ballotContract };
}

describe("Ballot", async () => {
  describe("when the contract is deployed", async () => {

    it("has the provided proposals", async () => {

      const { ballotContract } = await loadFixture(deployContract);
      
      for (let index = 0; index < CANDIDATES.length; index++) {
        const proposal = await ballotContract.read.proposals([BigInt(index)]);
        expect(hexToString(proposal[0], { size: 32 })).to.eq(CANDIDATES[index]);
      }

    });

    it("has zero votes for all proposals", async () => {
      const { ballotContract } = await loadFixture(deployContract);
      
      for (let index = 0; index < CANDIDATES.length; index++) {
        const proposal = await ballotContract.read.proposals([BigInt(index)]);
        expect(proposal[1]).to.eq(0n);// numbers coming from smart contracts need to be BigInt - i think because solidity doesn't have decimal places
      }

    });

    it("sets the deployer address as chairperson", async () => {
      let { ballotContract, deployer } = await loadFixture(deployContract);
      let chairperson = await ballotContract.read.chairperson();
      expect(chairperson.toLowerCase()).to.equal(deployer.account.address)

    });

    it("sets the voting weight for the chairperson as 1", async () => {
      let { ballotContract, deployer, otherAccount } = await loadFixture(deployContract);

      // let chairperson = await ballotContract.read.chairperson();
      let chairpersonVoter = await ballotContract.read.voters([deployer.account.address])
      let voter2 = await ballotContract.read.voters([otherAccount.account.address])

      expect(chairpersonVoter[0]).to.eq(1n)
      expect(voter2[0]).to.eq(0n)

    });
  });

  describe("when the chairperson interacts with the giveRightToVote function in the contract", async () => {
    
    it("gives right to vote for another address", async () => {
      
      let {ballotContract, otherAccount} = await loadFixture(deployContract);

      await ballotContract.write.giveRightToVote([otherAccount.account.address]);

      let newVoter = await ballotContract.read.voters([otherAccount.account.address])
      // let chairperson = await ballotContract.read.voters([deployer.account.address])

      expect(newVoter[0]).to.eq(1n)

    });

    it("can not give right to vote for someone that has voted", async () => {
      // TODO
      throw Error("Not implemented");
    });

    it("can not give right to vote for someone that has already voting rights", async () => {
      // TODO
      throw Error("Not implemented");
    });

  });

  describe("when the voter interacts with the vote function in the contract", async () => {
    // TODO
    it("should register the vote", async () => {
      throw Error("Not implemented");
    });
  });

  describe("when the voter interacts with the delegate function in the contract", async () => {
    // TODO
    it("should transfer voting power", async () => {
      throw Error("Not implemented");
    });
  });

  describe("when an account other than the chairperson interacts with the giveRightToVote function in the contract", async () => {
    // TODO
    it("should revert", async () => {
      throw Error("Not implemented");
    });
  });

  describe("when an account without right to vote interacts with the vote function in the contract", async () => {
    // TODO
    it("should revert", async () => {
      throw Error("Not implemented");
    });
  });

  describe("when an account without right to vote interacts with the delegate function in the contract", async () => {
    // TODO
    it("should revert", async () => {
      throw Error("Not implemented");
    });
  });

  describe("when someone interacts with the winningProposal function before any votes are cast", async () => {
    // TODO
    it("should return 0", async () => {
      throw Error("Not implemented");
    });
  });

  describe("when someone interacts with the winningProposal function after one vote is cast for the first proposal", async () => {
    // TODO
    it("should return 0", async () => {
      throw Error("Not implemented");
    });
  });

  describe("when someone interacts with the winnerName function before any votes are cast", async () => {
    // TODO
    it("should return name of proposal 0", async () => {
      throw Error("Not implemented");
    });
  });

  describe("when someone interacts with the winnerName function after one vote is cast for the first proposal", async () => {
    // TODO
    it("should return name of proposal 0", async () => {
      throw Error("Not implemented");
    });
  });

  describe("when someone interacts with the winningProposal function and winnerName after 5 random votes are cast for the proposals", async () => {
    // TODO
    it("should return the name of the winner proposal", async () => {
      throw Error("Not implemented");
    });
  });
});


// HOMEWORK -- Read through Ballot smart contract 
//          -- Finish test scripts for Ballot smart contract