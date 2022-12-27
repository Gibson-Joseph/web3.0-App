const { default: Web3 } = require("web3");

const Tether = artifacts.require("Tether");
const RWD = artifacts.require("RWD");
const DecentralBank = artifacts.require("DecentralBank");

// https://www.udemy.com/course/complete-dapp-solidity-react-blockchain-development/learn/lecture/27756798#overview

// refacter code// https://www.udemy.com/course/complete-dapp-solidity-react-blockchain-development/learn/lecture/27756812#overview
require("chai")
  .use(require("chai-as-promised"))
  .should();

// above three is need to test

contract("DecentralBank", (accounts) => {
  let tether, rwd, decentralBank;

  function tokens(number){
    return Web3.utils.toWei(number)
  }

  before(async () => {
    // Load contracts
    tether = await Tether.new();
    rwd = await RWD.new();
    decentralBank = await DecentralBank.new(rwd.address, tether.address);

    // Transfar all tokens to DecentralBank ()
    await rwd.transfer(decentralBank.address, tokens(1000000)); //1000000000000000000000000

    // Transfet 100 mock
    await tether.transfer()
  });

  // All code goes here for testing
  describe("Mock Tether Deployment", async () => {
    it("matches name successfully", async () => {
      // let tether = await Tether.new();
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
});
