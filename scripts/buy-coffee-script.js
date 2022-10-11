// function returns the ethers Balance of a given address

const { ethers } = require("hardhat")

async function getBalance(address) {
    const balanceBigInt = await ethers.provider.getBalance(address)
    return ethers.utils.formatEther(balanceBigInt)
}

// Logs the Ether balances for a list of address
async function printBalance(addresses) {
    for (let i = 0; i < addresses.length; i++) {
        console.log(`Address ${addresses[i]} balance:`, await getBalance(addresses[i]))
    }
}
// log the memos stord on-chain from coffee purchases.

async function printMemos(memos) {
    for (const memo of memos) {
        const timestamp = memo.timestamp
        const tipper = memo.name
        const tipperAddress = memo.from
        const message = memo.message
        console.log(`At ${timestamp}, ${tipper}(${tipperAddress}) said: "${message}"`)
    }
}

async function main() {
    // get the example accounts w'll be workin with:
    const [owner, tipper, tipper2, tipper3] = await ethers.getSigners()

    // we get the contract and deploy
    const BuyMeACoffee = await ethers.getContractFactory("BuyMeACoffee")
    const buyMeACoffee = await BuyMeACoffee.deploy()

    // deploy the contract.
    await buyMeACoffee.deployed()
    console.log("BuyMeACoffee deployed to :", buyMeACoffee.address)

    // check balance before the Coffee purchase:
    const addresses = [owner.address, tipper.address, buyMeACoffee.address]
    console.log("==start===")
    await printBalance(addresses)

    // buy the owner a few coffees
    const tip = { value: ethers.utils.parseEther("1") }
    await buyMeACoffee.connect(tipper).buyCoffee("Herieth", "Youre the best!", tip)
    await buyMeACoffee.connect(tipper2).buyCoffee("Frank", "So amazing!", tip)
    await buyMeACoffee.connect(tipper3).buyCoffee("Rose", "The best teacher ever seen!", tip)

    // check balances after the coffee purchase
    console.log("===bought coffee==")
    await printBalance(addresses)
    // withdraw

    await buyMeACoffee.connect(owner).withdrawTips()
    // check balakcea ager withdrawal
    await printBalance(addresses)

    // check out the memos.
    console.log("===memos===")
    const memos = await buyMeACoffee.getMemos()
    printMemos(memos)
}
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
