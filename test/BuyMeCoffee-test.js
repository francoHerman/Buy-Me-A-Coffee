const { assert, expect } = require("chai")
const { ethers } = require("hardhat")

describe("BuyMeACoffee", async () => {
    let contract, buyMeContract, deployer
    let entranceFee = await ethers.utils.parseEther("1")
    beforeEach(async () => {
        const [c0, c1, c2, c3, c4] = await ethers.getSigners()
        deployer = c0.address
        const BuyMeCoffee = await ethers.getContractFactory("BuyMeACoffee")
        buyMeContract = await BuyMeCoffee.deploy()
        await buyMeContract.deployed()
        contract = await buyMeContract.connect(c1)
    })

    describe("constructor", () => {
        it("set the owner of the contract correct", async () => {
            let addres = await contract.getOwner()
            assert.equal(addres.toString(), deployer)
        })
    })
    describe("the BuyMeCoffee function", () => {
        it("reverts when you dont pay enough", async () => {
            await expect(contract.buyCoffee("franco", "herman")).to.be.revertedWith(
                "YOU_MUST_SEND_SOME_EHT"
            )
        })
        it("it update the memos correctly", async () => {
            await contract.buyCoffee("name", "thanks bro", { value: entranceFee })
            const array = await contract.getMemos()
            const length = array.length
            assert.equal(length, 1)
        })
        it("emit an event when its updated", async () => {
            await expect(contract.buyCoffee("name", "thanks bro", { value: entranceFee })).to.emit(
                contract,
                "NewMemo"
            )
        })
    })
    describe("withdraw function", () => {
        it("expect to revert if you're not the owner of the contract", async () => {
            await expect(contract.withdrawTips()).to.be.revertedWith("YOU_ARE_NOT_THE_OWNER")
        })
        it("withdraw the money from the contract successfulll", async () => {
            const [c0, c1, c2, c3, c4] = await ethers.getSigners()
            const currentAddress = await ethers.provider.getBalance(c0.address)
            await buyMeContract
                .connect(c1)
                .buyCoffee("herman", "The best person", { value: entranceFee })
            await buyMeContract
                .connect(c2)
                .buyCoffee("franco", "you can become brilliant", { value: entranceFee })
            await buyMeContract.connect(c3).buyCoffee("Herieth", "my love", { value: entranceFee })
            await buyMeContract.connect(c0).withdrawTips()
            const afterWitdraw = await ethers.provider.getBalance(c0.address)
            const formatedFirstBalance = await ethers.utils.formatEther(currentAddress)
            const beforeBalance = formatedFirstBalance + 3
            const afterBalance = await ethers.utils.formatEther(afterWitdraw)
            assert.equal(afterBalance, afterBalance)
        })
    })
})
