import { deployments, ethers, getNamedAccounts, network } from "hardhat"
import { INITIAL_SUPPLY, developmentChains } from "../../helper-hardhat-config"
import { Signer } from "ethers"
import { Pedetin, Trade } from "../../typechain-types"
import { expect, assert } from "chai"

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Trade", () => {
          let trade: Trade, pedetin: Pedetin, deployer: Signer, anotherOwner: Signer
          const price = ethers.utils.parseEther("0.05")

          beforeEach(async () => {
              const accounts = await ethers.getSigners()
              deployer = accounts[0]
              anotherOwner = accounts[1]
              await deployments.fixture(["all"])
              trade = await ethers.getContract("Trade", deployer)
              pedetin = await ethers.getContract("Pedetin", deployer)
          })

          describe("deposit", () => {
              it("reverts if enough eth is not sent", async () => {
                  await expect(trade.deposit()).revertedWith("Trade_InsufficientAmount")
              })

              it("deposits eth and mints token for holder", async () => {
                  // await trade.deposit({value: price})
                  trade.connect(anotherOwner).deposit({ value: price })
                  await expect((await pedetin.balanceOf(anotherOwner.getAddress())).toString(), "1")
                  await expect(trade.connect(anotherOwner).deposit({ value: price })).to.emit(
                      trade,
                      "deposited"
                  )
              })

              it("sends eth to contract once  holder deposits", async () => {
                  const startingHolderBalance = await ethers.provider.getBalance(
                      anotherOwner.getAddress()
                  )

                  const res = await trade.connect(anotherOwner).deposit({ value: price })
                  const txReceipt = await res.wait(1)

                  const { gasUsed, effectiveGasPrice } = txReceipt
                  const gasCost = gasUsed.mul(effectiveGasPrice)

                  const endingHolderBalance = await ethers.provider.getBalance(
                      anotherOwner.getAddress()
                  )

                  assert.equal(
                      startingHolderBalance.toString(),
                      endingHolderBalance.add(gasCost.add(price)).toString()
                  )
              })
          })

          describe("swap", () => {
              it("reverts if the swapper has no available balance", async () => {
                  await expect(trade.connect(anotherOwner).swap()).to.be.revertedWith(
                      "Trade_InsufficientTokenBalance"
                  )
              })

              it("burns available balance and refunds eth after the swap has been completed", async () => {
                  const startingHolderBalance = await ethers.provider.getBalance(
                      deployer.getAddress()
                  )

                  console.log((await pedetin.balanceOf(deployer.getAddress())).toString())

                  const res = await trade.swap()
                  const txReceipt = await res.wait(1)

                  const { gasUsed, effectiveGasPrice } = txReceipt
                  const gasCost = gasUsed.mul(effectiveGasPrice)

                  const endingHolderBalance = await ethers.provider.getBalance(
                      deployer.getAddress()
                  )

                  console.log((await pedetin.balanceOf(deployer.getAddress())).toString())

                  assert.equal(
                      startingHolderBalance.add(gasCost.add(price)).toString(),
                      endingHolderBalance.toString()
                  )
                  assert.equal((await pedetin.balanceOf(deployer.getAddress())).toString(), "0")
              })
          })
      })
