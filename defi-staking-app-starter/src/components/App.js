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
      console.log("call if");
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      console.log("window.web3", window.web3);
      console.log("call else if");
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      console.log("call else");
      window.alert("No ethereum browser detected! You can check out MetaMask!");
    }
  }

  async tetherFun() {
    const web3 = window.web3;
    //Get eth Account
    const account = await web3.eth.getAccounts();
    console.log("account", account);
    this.setState({ accounts: account[0] });
    const networkId = await web3.eth.net.getId();

    // Load Tether contract
    const tetherData = Tether.networks[networkId];
    console.log("tetherData", tetherData);
    if (tetherData) {
      console.log("tetherData", tetherData);
      const tether = new web3.eth.Contract(Tether.abi, tetherData.address);
      console.log("tether", tether);
      this.setState({ tether: tether });
      console.log("this.state.accounts", this.state.accounts);
      let tetherBalance = await tether.methods
        .balanceOf(this.state.accounts)
        .call();
      this.setState({ tetherBalance: tetherBalance.toString() });
      console.log({ balance: tetherBalance });
    } else {
      window.alert("Error! Tether contract not deployed - no detect network");
    }
  }

  async rwdFun() {
    const web3 = window.web3;
    //Get eth Account
    const account = await web3.eth.getAccounts();
    console.log("account", account);
    this.setState({ accounts: account[0] });
    const networkId = await web3.eth.net.getId();

    // Load RWD contract
    const rwdData = RWD.networks[networkId];
    console.log("rwdData", rwdData);
    if (rwdData) {
      const rwd = new web3.eth.Contract(Tether.abi, rwdData.address);
      console.log("rwd", rwd);
      this.setState({ rwd: rwd });
      console.log("this.state.accounts", this.state.accounts);
      let rwdBalance = await rwd.methods.balanceOf(this.state.accounts).call();
      this.setState({ rwdBalance: rwdBalance.toString() });
      console.log({ rwdBalance: rwdBalance });
    } else {
      window.alert("Error! RWD contract not deployed - no detect network");
    }
  }

  async decentralBankFun() {
    const web3 = window.web3;
    //Get eth Account
    const account = await web3.eth.getAccounts();
    console.log("account", account);
    this.setState({ accounts: account[0] });
    const networkId = await web3.eth.net.getId();

    // Load decentralBank contract
    const decentralBankData = DecentralBank.networks[networkId];
    console.log("decentralBankData", decentralBankData);
    if (this.state.tether) {
      const decentralBank = new web3.eth.Contract(
        DecentralBank.abi,
        decentralBankData.address,
      );
      console.log("decentralBank", decentralBank);
      this.setState({ decentralBank: decentralBank });
      console.log("this.state.accounts", this.state.accounts);
      let stakingBalance = await decentralBank.methods
        .stakingBalance(this.state.accounts)
        .call();
      this.setState({ stakingBalance: stakingBalance.toString() });
      console.log({ balance: stakingBalance });
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
          }); // not understand the on function
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
        console.log("-------------------------------");
        this.setState({ loading: false });
        this.decentralBankFun();
        this.tetherFun();
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

// import React, { Component, useEffect, useState } from "react";
// import Navbar from "./Navbar";
// import "./App.css";
// import Web3 from "web3";
// import Tether from "../truffle_abis/Tether.json";
// import RWD from "../truffle_abis/RWD.json";
// import DecentralBank from "../truffle_abis/DecentralBank.json";
// import Main from "./Main";
// import ParticleSettings from "./ParticleSettings";

// const App = () => {
//   const [state, setState] = useState({
//     accounts: "0x0",
//     tether: {},
//     rwd: {},
//     decentralBank: {},
//     tetherBalance: "0",
//     rwdBalance: "0",
//     stakingBalance: "0",
//     loading: true,
//   });

//   const [tether, setTether] = useState();
//   const [rwd, setRwd] = useState();
//   const [decentralBank, setDecentralBank] = useState();
//   const [loading, setLoading] = useState(true);

//   const [account, setAccount] = useState();
//   const [tetherBalance, setTetherBalance] = useState();
//   const [rwdBalance, setRwdBalance] = useState();
//   const [stakingBalance, setStakingBalance] = useState();

//   const loadWeb3 = async () => {
//     if (window.ethereum) {
//       // console.log("call if");
//       window.web3 = new Web3(window.ethereum);
//       await window.ethereum.enable();
//     } else if (window.web3) {
//       // console.log("window.web3", window.web3);
//       // console.log("call else if");
//       window.web3 = new Web3(window.web3.currentProvider);
//     } else {
//       // console.log("call else");
//       window.alert("No ethereum browser detected! You can check out MetaMask!");
//     }
//   };

//   const loadBlockchainData = async () => {
//     const web3 = window.web3;
//     //Get eth Account
//     const accounts = await web3.eth.getAccounts();
//     const firstAccount = accounts[0];
//     console.log("accounts,accounts", firstAccount);
//     setAccount(firstAccount);
//     console.log("account", account);
//     // setState({ ...state, accounts: account[0] });
//     console.log("state----------", state);
//     const networkId = await web3.eth.net.getId(); // Get netWorkId
//     // const networkId = "5777";

//     // Load Tether contract
//     const tetherData = Tether.networks[networkId];
//     if (tetherData) {
//       console.log("tetherData", tetherData);
//       const tether = new web3.eth.Contract(Tether.abi, tetherData.address);
//       // console.log("tether", tether);
//       // setState((prev) => ({ ...prev, tether: tether }));
//       setTether(tether);
//       // console.log("tetherState", tether);
//       // console.log("gibson", state.tether);
//       // console.log("state.accounts", state.accounts);
//       let tetherBalance = await tether.methods.balanceOf(account).call();
//       // setState({ ...state, tetherBalance: tetherBalance.toString() });
//       setTetherBalance(tetherBalance.toString());
//       // console.log({ balance: tetherBalance });
//     } else {
//       window.alert("Error! Tether contract not deployed - no detect network");
//     }

//     // Load RWD contract
//     const rwdData = RWD.networks[networkId];
//     console.log("rwdData", rwdData);
//     if (rwdData) {
//       const rwd = new web3.eth.Contract(Tether.abi, rwdData.address);
//       console.log("rwd", rwd);
//       // setState({ ...state, rwd: rwd });
//       setRwd(rwd);
//       // console.log("state.accounts", state.accounts);
//       let rwdBalance = await rwd.methods.balanceOf(account).call();
//       setRwdBalance(rwdBalance.toString());
//       // setState({ ...state, rwdBalance: rwdBalance.toString() });
//       // console.log({ rwdBalance: rwdBalance });
//     } else {
//       window.alert("Error! RWD contract not deployed - no detect network");
//     }

//     // Load decentralBank contract
//     const decentralBankData = DecentralBank.networks[networkId];
//     // console.log("decentralBankData", decentralBankData);
//     if (tetherData) {
//       const decentralBank = new web3.eth.Contract(
//         DecentralBank.abi,
//         decentralBankData.address,
//       );
//       console.log("decentralBank", decentralBank);
//       // setState({ ...state, decentralBank: decentralBank });
//       setDecentralBank(decentralBank);
//       console.log("state.accounts", accounts);
//       let stakingBalance = await decentralBank.methods
//         .stakingBalance(account)
//         .call();
//       // setState({ ...state, stakingBalance: stakingBalance.toString() });
//       setStakingBalance(stakingBalance.toString());
//       console.log({ balance: stakingBalance });
//     } else {
//       window.alert(
//         "Error! DecentralBank contract not deployed - no detect network",
//       );
//     }
//     // setState({ ...state, loading: false });
//     setLoading(false);
//   };

//   // Staking Function
//   // https://www.udemy.com/course/complete-dapp-solidity-react-blockchain-development/learn/lecture/27757124#overview
//   const stakeTokens = async (amounts) => {
//     console.log("statestatestatestate", state);
//     // setState({ ...state, loading: true });
//     setLoading(true);
//     await tether.methods
//       .approve(decentralBank._address, amounts)
//       .send({ from: account })
//       .on("transactionHash", (hash) => {
//         decentralBank.methods
//           .depositTokens(amounts)
//           .send({ from: account })
//           .on("transactionHash", (hash) => {
//             // setState({ ...state, loading: false });
//             setLoading(false);
//             // window.location.reload();
//           }); // not understand the on function
//       });
//   };

//   // unStaking Function
//   // https://www.udemy.com/course/complete-dapp-solidity-react-blockchain-development/learn/lecture/27757130#overview
//   const unstakeTokens = async () => {
//     // setState({ ...state, loading: true });
//     setLoading(true);
//     await decentralBank.methods
//       .unstakeTokens()
//       .send({ from: account })
//       .on("transactionHash", (hash) => {
//         console.log("-------------------------------");
//         // setState({ ...state, loading: false });
//         setLoading(false);
//         // window.location.reload();
//       }); // not understand the on function
//   };

//   const loadBlockchain = async () => {
//     await loadWeb3();
//     await loadBlockchainData();
//   };

//   useEffect(() => {
//     loadBlockchain();
//   }, []);
//   console.log("tether", tether);
//   console.log("rwd", rwd);
//   console.log("decentralBank", decentralBank);
//   return (
//     <div className="App" style={{ position: "relative" }}>
//       <div style={{ position: "absolute" }}>
//         <ParticleSettings />
//       </div>
//       <Navbar account={account} />
//       <div className="container-fluid mt-5">
//         <div className="row">
//           <main
//             role="main"
//             className="col-lg-12 ml-auto mr-auto"
//             style={{ maxWidth: "90%", minHeight: "100vm" }}
//           >
//             <div>
//               {loading ? (
//                 <p
//                   id="loader"
//                   className="text-center"
//                   style={{ margin: "30px", color: "white" }}
//                 >
//                   LOADING PLEASE...
//                 </p>
//               ) : (
//                 <Main
//                   tetherBalance={tetherBalance}
//                   rwdBalance={rwdBalance}
//                   stakingBalance={stakingBalance}
//                   stakeTokens={stakeTokens}
//                   unstakeTokens={unstakeTokens}
//                 />
//               )}
//             </div>
//           </main>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default App;
