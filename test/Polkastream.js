const { expect } = require("chai");

async function advanceTimestampTo(timeStamp) {
	await ethers.provider.send("evm_increaseTime", [timeStamp])
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

	let privatesale_wallet = "0x0F18A35beee3604bDAa28A45e299d166f037116A";
	let publicsale_wallet = "0x5a5E2777dD1e3ae0c39521fEb49012cA3845D48F";
	let communitygrants_wallet = "0xf353B8Bb584c75900090e7F5e4309706e79d5385";
	let rewards_wallet = "0xEe9143f5Efc1bA0315aE0cADc148843e4D7920Ea";
	let operations_wallet = "0x37ECAaFBc289dA731B81c81A4454B108beD425a4";
	let teamandadvisors_wallet = "0x0beF5f7E292fB8523256415941D097Aa479C1BA7";
	let charity_wallet = "0x8A4904c92eA3F6508f4b7bA26537BFe31B09A5ee";

	let actualTotalSupply = ethers.utils.parseEther("1000000000");

	beforeEach(async function () {
		[owner, addr1, addr2, ...addrs] = await ethers.getSigners();

		PolkastreamFactory = await ethers.getContractFactory("Polkastream");
		Polkastream = await PolkastreamFactory.deploy();

		await owner.sendTransaction({to: privatesale_wallet, value: ethers.utils.parseEther("1.0")});
		await owner.sendTransaction({to: publicsale_wallet, value: ethers.utils.parseEther("1.0")});
		await owner.sendTransaction({to: communitygrants_wallet, value: ethers.utils.parseEther("1.0")});
		await owner.sendTransaction({to: rewards_wallet, value: ethers.utils.parseEther("1.0")});
		await owner.sendTransaction({to: operations_wallet, value: ethers.utils.parseEther("1.0")});
		await owner.sendTransaction({to: teamandadvisors_wallet, value: ethers.utils.parseEther("1.0")});
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

			const privatesale_balance = await Polkastream.balanceOf(privatesale_wallet);
			const publicsale_balance = await Polkastream.balanceOf(publicsale_wallet);
			const communitygrants_balance = await Polkastream.balanceOf(communitygrants_wallet);
			const rewards_balance = await Polkastream.balanceOf(rewards_wallet);
			const operations_balance = await Polkastream.balanceOf(operations_wallet);
			const teamandadvisors_balance = await Polkastream.balanceOf(teamandadvisors_wallet);
			const charity_balance = await Polkastream.balanceOf(charity_wallet);

			expect(actualTotalSupply.mul(5).div(100)).to.equal(privatesale_balance);
			expect(actualTotalSupply.mul(30).div(100)).to.equal(publicsale_balance);
			expect(actualTotalSupply.mul(6).div(100)).to.equal(communitygrants_balance);
			expect(actualTotalSupply.mul(25).div(100)).to.equal(rewards_balance);
			expect(actualTotalSupply.mul(12).div(100)).to.equal(operations_balance);
			expect(actualTotalSupply.mul(20).div(100)).to.equal(teamandadvisors_balance);
			expect(actualTotalSupply.mul(2).div(100)).to.equal(charity_balance);
		});

		it("Should exclude reserved wallets from rewards", async function () {
			expect(true).to.equal(await Polkastream.isExcludedFromReward(privatesale_wallet));
			expect(true).to.equal(await Polkastream.isExcludedFromReward(publicsale_wallet));
			expect(true).to.equal(await Polkastream.isExcludedFromReward(communitygrants_wallet));
			expect(true).to.equal(await Polkastream.isExcludedFromReward(rewards_wallet));
			expect(true).to.equal(await Polkastream.isExcludedFromReward(operations_wallet));
			expect(true).to.equal(await Polkastream.isExcludedFromReward(teamandadvisors_wallet));
			expect(true).to.equal(await Polkastream.isExcludedFromReward(charity_wallet));
		});

		it("Should exclude reserved wallets from fees", async function () {
			expect(true).to.equal(await Polkastream.isExcludedFromFee(privatesale_wallet));
			expect(true).to.equal(await Polkastream.isExcludedFromFee(publicsale_wallet));
			expect(true).to.equal(await Polkastream.isExcludedFromFee(communitygrants_wallet));
			expect(true).to.equal(await Polkastream.isExcludedFromFee(rewards_wallet));
			expect(true).to.equal(await Polkastream.isExcludedFromFee(operations_wallet));
			expect(true).to.equal(await Polkastream.isExcludedFromFee(teamandadvisors_wallet));
			expect(true).to.equal(await Polkastream.isExcludedFromFee(charity_wallet));
		});
	});

	describe("Transactions", function () {

		it("Should prevent spend greater than max tx limit", async function () {
			let operationSigner = await getSignerOf(operations_wallet);
			await Polkastream.connect(operationSigner).transfer(addr1.address, ethers.utils.parseEther("50000001"))

			const addr1Balance = await Polkastream.balanceOf(addr1.address);
			expect(addr1Balance).to.equal(ethers.utils.parseEther("50000001"));

			await expect(
				Polkastream.connect(addr1).transfer(addr2.address, ethers.utils.parseEther("50000001"))
			).to.be.revertedWith("Polkastream: Transfer amount exceeds limit");
		});

		it("Should prevent spend from team wallet", async function () {
			let teamSigner = await getSignerOf(teamandadvisors_wallet);
			await expect(
				Polkastream.connect(teamSigner).transfer(addr1.address, 50)
			).to.be.revertedWith("Polkastream: Team tokens are locked");
		});

		it("Should prevent spend from rewards wallet", async function () {
			let teamSigner = await getSignerOf(rewards_wallet);
			await expect(
				Polkastream.connect(teamSigner).transfer(addr1.address, 50)
			).to.be.revertedWith("Polkastream: Reward tokens are locked");
		});

		it("Should prevent spend from team wallet after unlock, before vest", async function () {
			await advanceTimestampTo(duration.days(181).toNumber());
			let teamSigner = await getSignerOf(teamandadvisors_wallet);
			await expect(
				Polkastream.connect(teamSigner).transfer(addr1.address, 50)
			).to.be.revertedWith("Polkastream: Transfers exceeds amount vested");
		});

		it("Should allow spend from team wallet after vest", async function () {
			// 1st vest amount: 10000000
			await advanceTimestampTo(duration.days(211).toNumber());
			let teamSigner = await getSignerOf(teamandadvisors_wallet);
			await Polkastream.connect(teamSigner).transfer(addr1.address, ethers.utils.parseEther("10000000"));

			const addr1Balance = await Polkastream.balanceOf(addr1.address);
			expect(addr1Balance).to.equal(ethers.utils.parseEther("10000000"));
		});

		it("Should prevent spend of unvested tokens from team wallet after vest", async function () {
			// 1st vest amount: 10000000
			await advanceTimestampTo(duration.days(211).toNumber());
			let teamSigner = await getSignerOf(teamandadvisors_wallet);
			await expect(
				Polkastream.connect(teamSigner).transfer(addr1.address, ethers.utils.parseEther("10000001"))
			).to.be.revertedWith("Polkastream: Transfers exceeds amount vested");
		});
	});
});
