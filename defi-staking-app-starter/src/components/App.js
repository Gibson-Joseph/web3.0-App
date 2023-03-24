import React, { Component } from "react";
import Navbar from "./Navbar";
import "./App.css";
import Web3 from "web3";
import Tether from "../truffle_abis/Tether.json";
import RWD from "../truffle_abis/RWD.json";
import DecentralBank from "../truffle_abis/DecentralBank.json";
import Main from "./Main";
import ParticleSettings from "./ParticleSettings";
// https://www.udemy.com/course/complete-dapp-solidity-react-blockchain-development/learn/lecture/27757006#overview
class App extends Component {
  async UNSAFE_componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  // this function connect to the blockchain
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert("No ethereum browser detected! You can check out MetaMask!");
    }
  }

  async tetherFun() {
    const web3 = window.web3;
    //Get eth Account
    const account = await web3.eth.getAccounts();
    this.setState({ accounts: account[0] });
    const networkId = await web3.eth.net.getId();

    // Load Tether contract
    const tetherData = Tether.networks[networkId];
    if (tetherData) {
      const tether = new web3.eth.Contract(Tether.abi, tetherData.address);
      this.setState({ tether: tether });
      let tetherBalance = await tether.methods
        .balanceOf(this.state.accounts)
        .call();
      this.setState({ tetherBalance: tetherBalance.toString() });
    } else {
      window.alert("Error! Tether contract not deployed - no detect network");
    }
  }

  async rwdFun() {
    const web3 = window.web3;
    //Get eth Account
    const account = await web3.eth.getAccounts();
    this.setState({ accounts: account[0] });
    const networkId = await web3.eth.net.getId();

    // Load RWD contract
    const rwdData = RWD.networks[networkId];
    if (rwdData) {
      const rwd = new web3.eth.Contract(Tether.abi, rwdData.address);
      this.setState({ rwd: rwd });
      let rwdBalance = await rwd.methods.balanceOf(this.state.accounts).call();
      this.setState({ rwdBalance: rwdBalance.toString() });
    } else {
      window.alert("Error! RWD contract not deployed - no detect network");
    }
  }

  async decentralBankFun() {
    const web3 = window.web3;
    //Get eth Account
    const account = await web3.eth.getAccounts();
    this.setState({ accounts: account[0] });
    const networkId = await web3.eth.net.getId();

    // Load decentralBank contract
    const decentralBankData = DecentralBank.networks[networkId];
    if (this.state.tether) {
      const decentralBank = new web3.eth.Contract(
        DecentralBank.abi,
        decentralBankData.address,
      );
      this.setState({ decentralBank: decentralBank });
      let stakingBalance = await decentralBank.methods
        .stakingBalance(this.state.accounts)
        .call();
      this.setState({ stakingBalance: stakingBalance.toString() });
    } else {
      window.alert(
        "Error! DecentralBank contract not deployed - no detect network",
      );
    }
  }

  async loadBlockchainData() {
    // Load Tether contract
    this.tetherFun();
    // Load RWD contract
    this.rwdFun();
    // Load decentralBank contract
    this.decentralBankFun();
    this.setState({ loading: false });
  }

  // Staking Function
  // https://www.udemy.com/course/complete-dapp-solidity-react-blockchain-development/learn/lecture/27757124#overview
  stakeTokens = async (amounts) => {
    this.setState({ loading: true });
    await this.state.tether.methods
      .approve(this.state.decentralBank._address, amounts)
      .send({ from: this.state.accounts })
      .on("transactionHash", (hash) => {
        this.state.decentralBank.methods
          .depositTokens(amounts)
          .send({ from: this.state.accounts })
          .on("transactionHash", (hash) => {
            this.setState({ loading: false });
            this.decentralBankFun();
            this.tetherFun();
          });
      })
      // .on("confirmation", (confirmationNum, receipt) => {
      // })
      .on("error", (error, recepit) => {
        if (error.code === 4001) {
          console.log("User denied transaction");
        }
      });
  };

  // unStaking Function
  // https://www.udemy.com/course/complete-dapp-solidity-react-blockchain-development/learn/lecture/27757130#overview
  unstakeTokens = async () => {
    this.setState({ loading: true });
    await this.state.decentralBank.methods
      .unstakeTokens()
      .send({ from: this.state.accounts })
      .on("transactionHash", (hash) => {
        this.setState({ loading: false });
        this.decentralBankFun();
        this.tetherFun();
      })
      .on("error", (error, recepit) => {
        if (error.code === 4001) {
          console.log("User denied transaction");
        }
      }); // not understand the on function
  };

  constructor(props) {
    super(props);
    // https://www.udemy.com/course/complete-dapp-solidity-react-blockchain-development/learn/lecture/27757012#overview
    this.state = {
      accounts: "0x0",
      tether: {},
      rwd: {},
      decentralBank: {},
      tetherBalance: "0",
      rwdBalance: "0",
      stakingBalance: "0",
      loading: true,
    };
  }
  render() {
    let content;
    {
      this.state.loading
        ? (content = (
            <p
              id="loader"
              className="text-center"
              style={{ margin: "30px", color: "white" }}
            >
              LOADING PLEASE...
            </p>
          ))
        : (content = (
            <Main
              tetherBalance={this.state.tetherBalance}
              rwdBalance={this.state.rwdBalance}
              stakingBalance={this.state.stakingBalance}
              stakeTokens={this.stakeTokens}
              unstakeTokens={this.unstakeTokens}
            />
          ));
    }
    return (
      <div className="App" style={{ position: "relative" }}>
        <div style={{ position: "absolute" }}>
          <ParticleSettings />
        </div>
        <Navbar account={this.state.accounts} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main
              role="main"
              className="col-lg-12 ml-auto mr-auto"
              style={{ maxWidth: "90%", minHeight: "100vm" }}
            >
              <div>
                {/* <Main /> */}
                {content}
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
