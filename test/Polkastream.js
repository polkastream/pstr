const { expect } = require("chai");

async function advanceTimestampTo(timeStamp) {
	await ethers.provider.send("evm_increaseTime", [timeStamp])
	await ethers.provider.send("evm_mine", [])
}

async function mineABlock() {
	await ethers.provider.send("evm_mine", [])
}

async function getSignerOf(from) {
    await ethers.provider.send("hardhat_impersonateAccount", [from]);
    const impersonatedAccount = await ethers.provider.getSigner(from);
    return impersonatedAccount;
}

const duration = {
	seconds: function (val) {
		return new ethers.BigNumber.from(val)
	},
	minutes: function (val) {
		return new ethers.BigNumber.from(val).mul(this.seconds("60"))
	},
	hours: function (val) {
		return new ethers.BigNumber.from(val).mul(this.minutes("60"))
	},
	days: function (val) {
		return new ethers.BigNumber.from(val).mul(this.hours("24"))
	},
	weeks: function (val) {
		return new ethers.BigNumber.from(val).mul(this.days("7"))
	},
	years: function (val) {
		return new ethers.BigNumber.from(val).mul(this.days("365"))
	},
}

describe("Polkastream contract", function () {

	let PolkastreamFactory;
	let Polkastream;
	let owner;
	let addr1;
	let addr2;
	let addrs;

	let vesting_contract_wallet = "0x0beF5f7E292fB8523256415941D097Aa479C1BA7";
    let public_sale_wallet = "0x0F18A35beee3604bDAa28A45e299d166f037116A";
    let liquidity_pool_wallet = "0x5a5E2777dD1e3ae0c39521fEb49012cA3845D48F";
    let rewards_wallet = "0xEe9143f5Efc1bA0315aE0cADc148843e4D7920Ea";
    let ops_and_mktg_wallet = "0x37ECAaFBc289dA731B81c81A4454B108beD425a4";
    let community_wallet = "0xf353B8Bb584c75900090e7F5e4309706e79d5385";
    let charity_wallet = "0x8A4904c92eA3F6508f4b7bA26537BFe31B09A5ee";

	let actualTotalSupply = ethers.utils.parseEther("1000000000");

	beforeEach(async function () {
		[owner, addr1, addr2, ...addrs] = await ethers.getSigners();

		PolkastreamFactory = await ethers.getContractFactory("Polkastream");
		Polkastream = await PolkastreamFactory.deploy();

		await owner.sendTransaction({to: vesting_contract_wallet, value: ethers.utils.parseEther("1.0")});
		await owner.sendTransaction({to: public_sale_wallet, value: ethers.utils.parseEther("1.0")});
		await owner.sendTransaction({to: liquidity_pool_wallet, value: ethers.utils.parseEther("1.0")});
		await owner.sendTransaction({to: rewards_wallet, value: ethers.utils.parseEther("1.0")});
		await owner.sendTransaction({to: ops_and_mktg_wallet, value: ethers.utils.parseEther("1.0")});
		await owner.sendTransaction({to: community_wallet, value: ethers.utils.parseEther("1.0")});
		await owner.sendTransaction({to: charity_wallet, value: ethers.utils.parseEther("1.0")});
	});

	describe("Deployment", function () {
		it("Should set the right owner", async function () {
			expect(await Polkastream.owner()).to.equal(owner.address);
		});

		it("Should set the right name", async function () {

			const name = await Polkastream.name();
			expect("Polkastream").to.equal(name);
		});

		it("Should set the right symbol", async function () {

			const symbol = await Polkastream.symbol();
			expect("PSTR").to.equal(symbol);
		});

		it("Should mint the total supply", async function () {

			const totalSupply = await Polkastream.totalSupply();
			expect(actualTotalSupply).to.equal(totalSupply);
		});

		it("Should assign 0 tokens to the owner", async function () {

			const ownerBalance = await Polkastream.balanceOf(owner.address);
			expect(0).to.equal(ownerBalance);
		});

		it("Should correctly distribute the total supply among wallets", async function () {

			const vesting_contract_balance = await Polkastream.balanceOf(vesting_contract_wallet);
			const public_sale_balance = await Polkastream.balanceOf(public_sale_wallet);
			const liquidity_pool_balance = await Polkastream.balanceOf(liquidity_pool_wallet);
			const rewards_balance = await Polkastream.balanceOf(rewards_wallet);
			const ops_and_mktg_balance = await Polkastream.balanceOf(ops_and_mktg_wallet);
			const community_balance = await Polkastream.balanceOf(community_wallet);
			const charity_balance = await Polkastream.balanceOf(charity_wallet);

			expect(actualTotalSupply.mul(42).div(100)).to.equal(vesting_contract_balance);
			expect(actualTotalSupply.mul(4).div(100)).to.equal(public_sale_balance);
			expect(actualTotalSupply.mul(3).div(100)).to.equal(liquidity_pool_balance);
			expect(actualTotalSupply.mul(25).div(100)).to.equal(rewards_balance);
			expect(actualTotalSupply.mul(20).div(100)).to.equal(ops_and_mktg_balance);
			expect(actualTotalSupply.mul(4).div(100)).to.equal(community_balance);
			expect(actualTotalSupply.mul(2).div(100)).to.equal(charity_balance);
		});

		it("Should exclude reserved wallets from rewards", async function () {
			expect(true).to.equal(await Polkastream.isExcludedFromReward(vesting_contract_wallet));
			expect(true).to.equal(await Polkastream.isExcludedFromReward(public_sale_wallet));
			expect(true).to.equal(await Polkastream.isExcludedFromReward(liquidity_pool_wallet));
			expect(true).to.equal(await Polkastream.isExcludedFromReward(rewards_wallet));
			expect(true).to.equal(await Polkastream.isExcludedFromReward(ops_and_mktg_wallet));
			expect(true).to.equal(await Polkastream.isExcludedFromReward(community_wallet));
			expect(true).to.equal(await Polkastream.isExcludedFromReward(charity_wallet));
		});

		it("Should exclude reserved wallets from fees", async function () {
			expect(true).to.equal(await Polkastream.isExcludedFromFee(vesting_contract_wallet));
			expect(true).to.equal(await Polkastream.isExcludedFromFee(public_sale_wallet));
			expect(true).to.equal(await Polkastream.isExcludedFromFee(liquidity_pool_wallet));
			expect(true).to.equal(await Polkastream.isExcludedFromFee(rewards_wallet));
			expect(true).to.equal(await Polkastream.isExcludedFromFee(ops_and_mktg_wallet));
			expect(true).to.equal(await Polkastream.isExcludedFromFee(community_wallet));
			expect(true).to.equal(await Polkastream.isExcludedFromFee(charity_wallet));
		});
	});

	describe("Transactions", function () {

		it("Should prevent spend before going live", async function () {
			let operationSigner = await getSignerOf(ops_and_mktg_wallet);
			await Polkastream.connect(operationSigner).transfer(addr1.address, ethers.utils.parseEther("1000"))
			await expect(
				Polkastream.connect(addr1).transfer(addr2.address, ethers.utils.parseEther("1000"))
			).to.be.revertedWith("Polkastream: PSTR not live yet");
		});

		it("Should prevent spend greater than max tx limit", async function () {
			let operationSigner = await getSignerOf(ops_and_mktg_wallet);
			await Polkastream.connect(operationSigner).transfer(addr1.address, ethers.utils.parseEther("1000001"))

			const addr1Balance = await Polkastream.balanceOf(addr1.address);
			expect(addr1Balance).to.equal(ethers.utils.parseEther("1000001"));

			await Polkastream.goLive(owner.address, 2);

			await expect(
				Polkastream.connect(addr1).transfer(addr2.address, ethers.utils.parseEther("1000001"))
			).to.be.revertedWith("Polkastream: Transfer amount exceeds limit");
		});
	});

	describe("Blacklist", function () {
		it("Should prevent spends from Blacklisted wallets", async function () {
			let operationSigner = await getSignerOf(ops_and_mktg_wallet);
			await Polkastream.addInBlacklist(ops_and_mktg_wallet);
			await Polkastream.goLive(owner.address, 2);

			await expect(
				Polkastream.connect(operationSigner).transfer(addr2.address, ethers.utils.parseEther("1000"))
			).to.be.revertedWith("Polkastream: transfer from blacklisted address");
		});

		it("Should allow spends from Non-Blacklisted wallets", async function () {
			let operationSigner = await getSignerOf(ops_and_mktg_wallet);
			await Polkastream.addInBlacklist(ops_and_mktg_wallet);
			await Polkastream.goLive(owner.address, 2);

			await expect(
				Polkastream.connect(operationSigner).transfer(addr2.address, ethers.utils.parseEther("1000"))
			).to.be.revertedWith("Polkastream: transfer from blacklisted address");

			await Polkastream.removeFromBlacklist(ops_and_mktg_wallet);
			await Polkastream.connect(operationSigner).transfer(addr2.address, ethers.utils.parseEther("1000"));
		});

		it("Should blacklist buys close to going live", async function () {
			let operationSigner = await getSignerOf(ops_and_mktg_wallet);
			await Polkastream.goLive(ops_and_mktg_wallet, 2);

			await Polkastream.connect(operationSigner).transfer(addr2.address, ethers.utils.parseEther("1000"))

			await expect(
				Polkastream.connect(addr2).transfer(addr1.address, ethers.utils.parseEther("1000"))
			).to.be.revertedWith("Polkastream: transfer from blacklisted address");

			await Polkastream.removeFromBlacklist(addr2.address);
			await Polkastream.connect(addr2).transfer(addr1.address, ethers.utils.parseEther("1000"));
		});

		it("Should NOT blacklist buys NOT close to going live", async function () {
			let operationSigner = await getSignerOf(ops_and_mktg_wallet);
			await Polkastream.goLive(ops_and_mktg_wallet, 2);

			await mineABlock();
			await mineABlock();

			await Polkastream.connect(operationSigner).transfer(addr2.address, ethers.utils.parseEther("1000"))
			await Polkastream.connect(addr2).transfer(addr1.address, ethers.utils.parseEther("1000"));
		});
	});

});
