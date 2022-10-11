const { run, ethers, network } = require("hardhat")

module.exports = async ({ getNamedAccounts, deployments }) => {
    console.log("deploying the contract")
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    const depol = await deploy("BuyMeACoffee", {
        from: deployer,
        log: true,
        args: [],
        waitConfirmations: 5,
    })
    if (!network.name.includes("hardhat" || "localhost")) {
        await verify(depol.address, [])
    }
    console.log("contranct deployed ---------------")
}
const verify = async (contractAddress, args) => {
    console.log("Verifying contract...")
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Already verified!")
        } else {
            console.log(e)
        }
    }
}

module.exports.tags = ["all", "BuyMe"]
