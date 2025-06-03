
  const { expect } = require("chai");
  const { ethers } = require("hardhat");

  describe("Crowdfund", function () {
    let Crowdfund, contract, owner, user1, user2;
    const goal = ethers.parseEther("5"); // 5 ETH

    beforeEach(async () => {
      [owner, user1, user2] = await ethers.getSigners();
      const CrowdfundFactory = await ethers.getContractFactory("Crowdfund");

      const blockNum = await ethers.provider.getBlockNumber();
      const block = await ethers.provider.getBlock(blockNum);
      const now = block.timestamp;
      const deadline = now + 86400; // 1 day from current block time

      contract = await CrowdfundFactory.deploy(deadline, goal);
      await contract.waitForDeployment();
    });

    it("should accept contributions", async () => {
      await contract.connect(user1).contribute({ value: ethers.parseEther("1") });
      const contribution = await contract.contributions(user1.address);
      expect(contribution).to.equal(ethers.parseEther("1"));
    });

    it("should reject zero contributions", async () => {
      await expect(
        contract.connect(user1).contribute({ value: 0 })
      ).to.be.revertedWith("Must send ETH");
    });

    it("should not allow contributions after deadline", async () => {
      await ethers.provider.send("evm_increaseTime", [86400 + 1]);
      await ethers.provider.send("evm_mine", []);
      await expect(
        contract.connect(user1).contribute({ value: ethers.parseEther("1") })
      ).to.be.revertedWith("Campaign has ended");
    });

    it("should allow owner to withdraw after reaching goal", async () => {
      await contract.connect(user1).contribute({ value: ethers.parseEther("3") });
      await contract.connect(user2).contribute({ value: ethers.parseEther("2") });

      await ethers.provider.send("evm_increaseTime", [86400 + 1]);
      await ethers.provider.send("evm_mine", []);

      const before = await ethers.provider.getBalance(owner.address);
      const tx = await contract.connect(owner).withdraw();
      await tx.wait();

      const after = await ethers.provider.getBalance(owner.address);
      expect(after).to.be.gt(before);
    });

    it("should allow refunds if goal not met", async () => {
      await contract.connect(user1).contribute({ value: ethers.parseEther("2") });
      await ethers.provider.send("evm_increaseTime", [86400 + 1]);
      await ethers.provider.send("evm_mine", []);
      const tx = await contract.connect(user1).getRefund();
      await tx.wait();
      expect(await contract.contributions(user1.address)).to.equal(0);
    });
  });
