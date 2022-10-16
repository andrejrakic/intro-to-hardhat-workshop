import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect, assert } from "chai";
import { ethers } from "hardhat";
import { SimpleStorage } from "../typechain-types";

describe("Simple Storage Unit Tests", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deploySimpleStorageFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, alice] = await ethers.getSigners();

    const simpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
    const simpleStorage: SimpleStorage = await simpleStorageFactory.deploy();

    return { simpleStorage, owner, alice };
  }

  describe("Deployment", async function () {
    it("should set message to Chainlink Workshop", async function () {
      const { simpleStorage } = await loadFixture(deploySimpleStorageFixture);

      const expectedMessage = "Chainlink Workshop";
      const actualMessage = await simpleStorage.getMessage();

      assert(actualMessage === expectedMessage, "Message not set to a proper value");
    });
  });

  describe("#setMessage", async function () {
    describe("failure", async function () {
      it("should revert if caller is not an owner", async function () {
        const { simpleStorage, alice } = await loadFixture(deploySimpleStorageFixture);

        const newMessage = "Hardhat Workshop";

        await expect(simpleStorage.connect(alice).setMessage(newMessage)).to.be.revertedWith("Caller is not an owner");
      });

      it("should revert if empty string is provided", async function () {
        const { simpleStorage, owner } = await loadFixture(deploySimpleStorageFixture);

        const newMessage = "";

        await expect(simpleStorage.connect(owner).setMessage(newMessage)).to.be.revertedWith("Empty strings not allowed");
      });
    });

    describe("success", async function () {
      it("should update the message variable", async function () {
        const { simpleStorage, owner } = await loadFixture(deploySimpleStorageFixture);

        const newMessage = "Hardhat Workshop";

        await simpleStorage.connect(owner).setMessage(newMessage);

        const actualMessage = await simpleStorage.getMessage();

        assert(actualMessage === newMessage, "Message not set");
      });

      it("should emit MessageChanged event", async function () {
        const { simpleStorage, owner } = await loadFixture(deploySimpleStorageFixture);

        const newMessage = "Hardhat Workshop";

        await expect(
          simpleStorage
            .connect(owner)
            .setMessage(newMessage)
        )
          .to.emit(
            simpleStorage, "MessageChanged"
          ).withArgs(newMessage);
      });
    });
  });
});
