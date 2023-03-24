const Tether = artifacts.require("Tether");
const RWD = artifacts.require("RWD");
const DecentralBank = artifacts.require("DecentralBank");

// https://www.udemy.com/course/complete-dapp-solidity-react-blockchain-development/learn/lecture/27756798#overview

// refacter code// https://www.udemy.com/course/complete-dapp-solidity-react-blockchain-development/learn/lecture/27756812#overview
require("chai")
  .use(require("chai-as-promised"))
  .should();

// above three is need to test

contract("DecentralBank", ([owner, customer]) => {
  // let tether, rwd, decentralBank;

  function tokens(number) {
    return web3.utils.toWei(number, "ether");
  }

  let tether, rwd, decentralBank;

  before(async () => {
    tether = await Tether.new();
    rwd = await RWD.new();
    decentralBank = await DecentralBank.new(rwd.address, tether.address);

    // Transfar all tokens to DecentralBank ()
    await rwd.transfer(decentralBank.address, await tokens("1000000")); //1000000000000000000000000

    await tether.transfer(customer, tokens("100"), { from: owner }); //not understand
  });

  describe("Mock Tether Deployment", async () => {
    it("matches name successully", async () => {
      const name = await tether.name();
      assert.equal(name, "Gibson Tether Token");
    });
  });

  describe("Reward Token", async () => {
    it("matches name successfully", async () => {
      // let reward = await RWD.new();
      const name = await rwd.name();
      assert.equal(name, "Reward Token");
    });
  });

  describe("Decentrak Bank Deployment", async () => {
    it("matches name successfully", async () => {
      // let reward = await RWD.new();
      const name = await decentralBank.name();
      assert.equal(name, "Decentral Bank");
    });

    it("contract has tokens", async () => {
      let balance = await rwd.balanceOf(decentralBank.address);
      assert.equal(balance, tokens("1000000"));
    });
    describe("Yield Farming", async () => {
      it("rewards tokens for staking", async () => {
        let result;

        // Check Investor Balance
        result = await tether.balanceOf(customer);
        assert.equal(
          result.toString(),
          tokens("100"),
          "customer mock wallet balance before staking"
        );

        // Check Staking For Customer of 100 tokens
        // https://www.udemy.com/course/complete-dapp-solidity-react-blockchain-development/learn/lecture/27756868#overview
        await tether.approve(decentralBank.address, tokens("100"), {
          from: customer,
        }); // Why we use approve & why we use {from: customer}. I couldn't understand
        await decentralBank.depositTokens(tokens("100"), { from: customer });

        // Check update Balance of Customer
        result = await tether.balanceOf(customer);
        assert.equal(
          result.toString(),
          tokens("0"),
          "customer mock wallet balance after staking 100 tokens"
        );

        // Check Updated Balance of Decentral Bank
        result = await tether.balanceOf(decentralBank.address);
        assert.equal(
          result.toString(),
          tokens("100"),
          "decentral bank mock wallet balance after staking from customer"
        );

        // Is Staking update
        result = await decentralBank.isStaking(customer);
        assert.equal(
          result.toString(),
          "true",
          "customer is staking status after staking"
        );

        // Issue Tokens
        await decentralBank.issueTokens({ from: owner });

        // Ensure Only The Owner Can Issue Tokens
        await decentralBank.issueTokens({ from: customer }).should.be.rejected;

        // Unstake Tokens
        await decentralBank.unstakeTokens({ from: customer });

        // Check unstaking Balances

        // Check update Balance of Customer
        result = await tether.balanceOf(customer);
        assert.equal(
          result.toString(),
          tokens("100"),
          "customer mock wallet balance after unstaking"
        );

        // Check Updated Balance of Decentral Bank
        result = await tether.balanceOf(decentralBank.address);
        assert.equal(
          result.toString(),
          tokens("0"),
          "decentral bank mock wallet balance after staking from customer"
        );

        // Is Staking Update
        result = await decentralBank.isStaking(customer);
        assert.equal(
          result.toString(),
          "false",
          "customer is no longer staking after unStaking"
        );
      });
    });
  });
});
