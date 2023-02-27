# $PSTR Smart Contract Address
https://bscscan.com/address/0x3cdd71d99cb393928b74d549d4cb0a6ffe0a60a8

# Successful Security and Tokenomics Audit
[https://img.youtube.com/vi/<insert-youtube-video-id-here>/0.jpg](https://youtu.be/bEgEipxV24c)

# Tokenomics
PSTR is minted off Binance Smart Chain (BSC) with a maximum supply of one billion (1,000,000,000) tokens. 

For passive income, PSTR is built in with Automated Rewards Farming (ARF) to include:

- A 4% fee is automatically applied to all transactions. 3% of that fee is distributed to holders and the remaining 1%, up to 50% of the max supply, is permanently burned.
- After the 50% supply is burned, the fee reverts to 4% with all of it distributed to holders and 0% burned. 

As an added token security and stability feature, PSTR has a limit of one million (1,000,000) tokens per transaction. This anti-slippage transaction limit is updateable through Decentralized Autonomous Organization (DAO) proposals made by the Polkastream Community.


# Allocations
![PSTR Allocation Chart](https://user-images.githubusercontent.com/91648013/188272712-055fcd46-e1a7-4dd1-808f-948bcd198f76.png)


# Wallet Distributions
The smart contract deploys one billion PSTR tokens to the following wallets, which are excluded from paying fees, receiving dividends, and a per transaction limit.
- **42% Vesting Contract:** 0x0beF5f7E292fB8523256415941D097Aa479C1BA7
- **4% Public Sale**: 0x0F18A35beee3604bDAa28A45e299d166f037116A
- **3% Liquidity Pool:** 0x5a5E2777dD1e3ae0c39521fEb49012cA3845D48F
- **25% Rewards:** 0xEe9143f5Efc1bA0315aE0cADc148843e4D7920Ea
- **20% Operations and Marketing:** 0x37ECAaFBc289dA731B81c81A4454B108beD425a4  
- **4% Community:** 0xf353B8Bb584c75900090e7F5e4309706e79d5385
- **2% Charity:** 0x8A4904c92eA3F6508f4b7bA26537BFe31B09A5ee


# Vesting Contract Allocations and Terms
- **10% Seed:** x% of the total allocation is unlocked during the PSTR Token Generation Event (TGE) with a y-month cliff, followed by z months of external and linear (per block) unlock.
- **10% Private:** x% of the total allocation is unlocked during TGE with a y-month cliff, followed by z months of external and linear unlock.
- **22% Team and Advisors:** All of the tokens are locked for x days outright, followed by y% of the total allocation unlocking once every z days.  


## $ npx hardhat test

```
Polkastream contract
    Deployment
      √ Should set the right owner (49ms)
      √ Should set the right name
      √ Should set the right symbol
      √ Should mint the total supply
      √ Should assign 0 tokens to the owner
      √ Should correctly distribute the total supply among wallets (50ms)
      √ Should exclude reserved wallets from rewards (62ms)
      √ Should exclude reserved wallets from fees (67ms)
    Transactions
      √ Should prevent spend before going live (207ms)
      √ Should prevent spend greater than max tx limit (202ms)
    Blacklist
      √ Should prevent spends from Blacklisted wallets (84ms)
      √ Should allow spends from Non-Blacklisted wallets (144ms)
      √ Should blacklist buys close to going live (371ms)
      √ Should NOT blacklist buys NOT close to going live (259ms)

  14 passing (1m)
```
