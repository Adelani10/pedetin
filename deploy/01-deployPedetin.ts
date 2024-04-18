import { DeployFunction } from "hardhat-deploy/dist/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import verify from "../utils/verify"
import { VERIFICATION_BLOCK_CONFIRMATIONS, INITIAL_SUPPLY, developmentChains } from "../helper-hardhat-config"

const deployPedetin: DeployFunction = async function ({
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

    const args: any[] = [INITIAL_SUPPLY]
    const pedetin  = await deploy("Pedetin", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: waitBlockConfirmations
    })

    if(developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY){
        await verify(pedetin.address, args)
        log("verified")
    }

    log("--------------------")
}

export default deployPedetin
deployPedetin.tags = ["all", "pedetin"]
