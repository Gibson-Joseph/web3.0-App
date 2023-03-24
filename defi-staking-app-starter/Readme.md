
# Install ganache

https://www.udemy.com/course/complete-dapp-solidity-react-blockchain-development/learn/lecture/27756602#overview

https://trufflesuite.com/ganache/

```
$ chmod a+x ganache-2.5.4-linux-x86_64.AppImage
$ ./ganache-2.5.4-linux-x86_64.AppImage --appimage-extract
```

https://dapp-world.com/blogs/01/how-to-connect-ganache-with-metamask-and-deploy-smart-contracts-on-remix-without-1619847868947#:~:text=then%20Chain%20ID%20for%20ganache,currency%20symbol%20as%20%22ETH%22.

# 1_initial_migration.js

In Root foilder create migrations folder that contain this js file

```javascript
const Migrations = artifacts.require("Migrations");

module.exports = function (deployer) {
  deployer.deploy(Migrations);
};
```

# 2_deploy_contracts.js

In Root foilder create migrations folder that contain this js file

```javascript
const Tether = artifacts.require("Tether");
const RWD = artifacts.require("RWD");
const DecentralBank = artifacts.require("DecentralBank");

module.exports = async function (deployer) {
  // Deploy Gibson Tether Contract
  await deployer.deploy(Tether);

  // Deploy RWD Contract
  await deployer.deploy(RWD);

  // Deploy DecentralBank Contract
  await deployer.deploy(DecentralBank);
};
```

# truffle-config.js

this file in our root folder

```javascript
require("babel-register");
require("babel-polyfill");

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: "7545",
      network_id: "*", // match to any network
    },
  },
  contracts_directory: "./src/contracts/",
  contracts_build_directory: "./src/truffle_abis",
  compilers: {
    solc: {
      version: "^0.5.0",
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
```
# truffle_abis (folder)

In Root foilder create truffle_abis folder. This folder in src folder

# requirment
node version 10

