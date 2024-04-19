import { deployments, ethers, getNamedAccounts, network } from "hardhat"
import { INITIAL_SUPPLY, developmentChains } from "../../helper-hardhat-config"
import { Signer } from "ethers"
import { Trade } from "../../typechain-types"
import { expect, assert } from "chai"

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Trade", () => {
          let trade: Trade, deployer: Signer, anotherOwner: Signer
          const price = ethers.utils.parseEther("0.05")

          beforeEach(async () => {
              const accounts = await ethers.getSigners()
              deployer = accounts[0]
              anotherOwner = accounts[1]
              await deployments.fixture(["all"])
              trade = await ethers.getContract("Trade", deployer)
          })

          describe("deposit", async () => {
              it("reverts if enough eth is not sent", async () => {
                  await expect(trade.deposit()).revertedWith("Trade_InsufficientAmount")
              })
          })
      })
