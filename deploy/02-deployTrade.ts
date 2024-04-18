import { DeployFunction } from "hardhat-deploy/dist/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import verify from "../utils/verify"
import { VERIFICATION_BLOCK_CONFIRMATIONS, developmentChains } from "../helper-hardhat-config"

const deployTrade: DeployFunction = async function ({
    deployments,
    getNamedAccounts,
    network,
    ethers,
}: HardhatRuntimeEnvironment) {
    const {deploy, log} = deployments
    const {deployer} = await getNamedAccounts()
    const waitBlockConfirmations = developmentChains.includes(network.name)
    ? 1
    : VERIFICATION_BLOCK_CONFIRMATIONS


    log("--------------------")
    log("deploying, pls wait...")
    

    const args: any[] = []
    const trade  = await deploy("Trade", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: waitBlockConfirmations
    })

    if(developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY){
        await verify(trade.address, args)
        log("verified")
    }

    log("done")
    log("--------------------")
}

export default deployTrade
deployTrade.tags = ["all", "trade"]
