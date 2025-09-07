import { expect } from "chai";
import { ethers } from "hardhat";
import { Escrow } from "../typechain-types";

import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("Escrow", function () {
  let escrow: Escrow;
  let client: SignerWithAddress;
  let freelancer: SignerWithAddress;
  let other: SignerWithAddress;

  const milestoneAmounts = [ethers.parseEther("1"), ethers.parseEther("2")];
  const milestoneDescriptions = ["First milestone", "Second milestone"];
  const totalAmount = ethers.parseEther("3");

  beforeEach(async function () {
    [client, freelancer, other] = await ethers.getSigners();

    const EscrowFactory = await ethers.getContractFactory("Escrow");
    escrow = await EscrowFactory.deploy();
    await escrow.waitForDeployment();
  });

  describe("Contract Creation", function () {
    it("Should create a contract with correct parameters", async function () {
      const tx = await escrow.connect(client).createContract(
        freelancer.address,
        milestoneAmounts,
        milestoneDescriptions,
        { value: totalAmount }
      );

      await expect(tx)
        .to.emit(escrow, "ContractCreated")
        .withArgs(0, client.address, freelancer.address, totalAmount, 2);

      const contractDetails = await escrow.getContract(0);
      expect(contractDetails.client).to.equal(client.address);
      expect(contractDetails.freelancer).to.equal(freelancer.address);
      expect(contractDetails.totalAmount).to.equal(totalAmount);
      expect(contractDetails.isActive).to.be.true;
      expect(contractDetails.isCompleted).to.be.false;
    });

    it("Should fail if freelancer is zero address", async function () {
      await expect(
        escrow.connect(client).createContract(
          ethers.ZeroAddress,
          milestoneAmounts,
          milestoneDescriptions,
          { value: totalAmount }
        )
      ).to.be.revertedWith("Invalid freelancer address");
    });

    it("Should fail if client and freelancer are the same", async function () {
      await expect(
        escrow.connect(client).createContract(
          client.address,
          milestoneAmounts,
          milestoneDescriptions,
          { value: totalAmount }
        )
      ).to.be.revertedWith("Client and freelancer cannot be the same");
    });

    it("Should fail if sent value doesn't match total amount", async function () {
      await expect(
        escrow.connect(client).createContract(
          freelancer.address,
          milestoneAmounts,
          milestoneDescriptions,
          { value: ethers.parseEther("2") }
        )
      ).to.be.revertedWith("Sent value must equal total milestone amounts");
    });
  });

  describe("Milestone Release", function () {
    beforeEach(async function () {
      await escrow.connect(client).createContract(
        freelancer.address,
        milestoneAmounts,
        milestoneDescriptions,
        { value: totalAmount }
      );
    });

    it("Should release milestone to freelancer", async function () {
      const initialBalance = await ethers.provider.getBalance(freelancer.address);
      
      const tx = await escrow.connect(client).releaseMilestone(0, 0);
      
      await expect(tx)
        .to.emit(escrow, "MilestoneReleased")
        .withArgs(0, 0, milestoneAmounts[0], freelancer.address);

      const finalBalance = await ethers.provider.getBalance(freelancer.address);
      expect(finalBalance - initialBalance).to.equal(milestoneAmounts[0]);

      const milestone = await escrow.getMilestone(0, 0);
      expect(milestone.isReleased).to.be.true;
    });

    it("Should complete contract when all milestones are released", async function () {
      await escrow.connect(client).releaseMilestone(0, 0);
      await escrow.connect(client).releaseMilestone(0, 1);

      const contractDetails = await escrow.getContract(0);
      expect(contractDetails.isCompleted).to.be.true;
      expect(contractDetails.isActive).to.be.false;
      expect(contractDetails.releasedAmount).to.equal(totalAmount);
    });

    it("Should fail if not called by client", async function () {
      await expect(
        escrow.connect(freelancer).releaseMilestone(0, 0)
      ).to.be.revertedWith("Only client can call this function");
    });

    it("Should fail if milestone already released", async function () {
      await escrow.connect(client).releaseMilestone(0, 0);
      
      await expect(
        escrow.connect(client).releaseMilestone(0, 0)
      ).to.be.revertedWith("Milestone already released");
    });
  });

  describe("Refund", function () {
    beforeEach(async function () {
      await escrow.connect(client).createContract(
        freelancer.address,
        milestoneAmounts,
        milestoneDescriptions,
        { value: totalAmount }
      );
    });

    it("Should refund remaining funds to client", async function () {
      const initialBalance = await ethers.provider.getBalance(client.address);
      
      const tx = await escrow.connect(client).refund(0);
      const receipt = await tx.wait();
      const gasUsed = receipt!.gasUsed * receipt!.gasPrice;
      
      await expect(tx)
        .to.emit(escrow, "ContractRefunded")
        .withArgs(0, totalAmount, client.address);

      const finalBalance = await ethers.provider.getBalance(client.address);
      expect(finalBalance + gasUsed - initialBalance).to.equal(totalAmount);

      const contractDetails = await escrow.getContract(0);
      expect(contractDetails.isActive).to.be.false;
      expect(contractDetails.isCompleted).to.be.true;
    });

    it("Should refund partial amount after milestone release", async function () {
      await escrow.connect(client).releaseMilestone(0, 0);
      
      const initialBalance = await ethers.provider.getBalance(client.address);
      const tx = await escrow.connect(client).refund(0);
      const receipt = await tx.wait();
      const gasUsed = receipt!.gasUsed * receipt!.gasPrice;
      
      const expectedRefund = totalAmount - milestoneAmounts[0];
      await expect(tx)
        .to.emit(escrow, "ContractRefunded")
        .withArgs(0, expectedRefund, client.address);

      const finalBalance = await ethers.provider.getBalance(client.address);
      expect(finalBalance + gasUsed - initialBalance).to.equal(expectedRefund);
    });

    it("Should fail if not called by client", async function () {
      await expect(
        escrow.connect(freelancer).refund(0)
      ).to.be.revertedWith("Only client can call this function");
    });
  });

  describe("Disputes", function () {
    beforeEach(async function () {
      await escrow.connect(client).createContract(
        freelancer.address,
        milestoneAmounts,
        milestoneDescriptions,
        { value: totalAmount }
      );
    });

    it("Should allow client to raise dispute", async function () {
      const tx = await escrow.connect(client).raiseDispute(0, 0);
      
      await expect(tx)
        .to.emit(escrow, "DisputeRaised")
        .withArgs(0, 0, client.address);

      const milestone = await escrow.getMilestone(0, 0);
      expect(milestone.isDisputed).to.be.true;
    });

    it("Should allow freelancer to raise dispute", async function () {
      const tx = await escrow.connect(freelancer).raiseDispute(0, 0);
      
      await expect(tx)
        .to.emit(escrow, "DisputeRaised")
        .withArgs(0, 0, freelancer.address);

      const milestone = await escrow.getMilestone(0, 0);
      expect(milestone.isDisputed).to.be.true;
    });

    it("Should fail if not called by contract parties", async function () {
      await expect(
        escrow.connect(other).raiseDispute(0, 0)
      ).to.be.revertedWith("Only contract parties can call this function");
    });

    it("Should prevent milestone release if disputed", async function () {
      await escrow.connect(client).raiseDispute(0, 0);
      
      await expect(
        escrow.connect(client).releaseMilestone(0, 0)
      ).to.be.revertedWith("Milestone is disputed");
    });
  });
});