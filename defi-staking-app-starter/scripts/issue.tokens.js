const DecentralBank = artifacts.require("DecentralBank");

// https://www.udemy.com/course/complete-dapp-solidity-react-blockchain-development/learn/lecture/27756910#overview

module.exports = async function issueRewards(callback) {
  let decentralBank = await DecentralBank.deployed();
  await decentralBank.issueTokens();
  console.log("Tokens have been issued successfully");
  callback(); // not understand
};
