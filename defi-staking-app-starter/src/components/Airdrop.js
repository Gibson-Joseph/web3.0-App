import React, { Component } from "react";
//https://www.udemy.com/course/complete-dapp-solidity-react-blockchain-development/learn/lecture/27757250#overview
export default class Airdrop extends Component {
  // Airdrop to have a timer that counts down
  // Initialize the couontown after our customer have staked a certain amount
  // Timer functionaly, countown, startTimer, state for time to work.
  constructor() {
    super(); // sub class
    this.state = {
      time: {},
      seconds: 20,
    };
    this.timer = 0;
    this.startTimer = this.startTimer.bind(this); // not understand
    this.countDown = this.countDown.bind(this);
  }

  countDown() {
    let seconds = this.state.seconds - 1;
    this.setState({
      time: this.secondsToTime(seconds),
      seconds: seconds,
    });
    if (seconds == 0) {
      clearInterval(this.timer);
    }
  }

  startTimer() {
    if (this.timer == 0 && this.state.seconds > 0) {
      this.timer = setInterval(this.countDown, 1000);
    }
  }

  secondsToTime(secs) {
    // not understand the calculations
    let hours, minutes, seconds;
    hours = Math.floor(secs / (60 * 60));

    let devisor_for_minutes = secs % (60 * 60);
    minutes = Math.floor(devisor_for_minutes / 60);

    let devisor_for_seconds = devisor_for_minutes % 60;
    seconds = Math.ceil(devisor_for_seconds);

    let obj = {
      h: hours,
      m: minutes,
      s: seconds,
    };
    return obj;
  }

  componentDidMount() {
    let timeLeftVar = this.secondsToTime(this.state.seconds);
    this.setState({ time: timeLeftVar });
  }

  airdropReleaseTokens() {
    let stakingB = this.props.stakingBalance;
    if (stakingB >= "5000000000000000000") {
      this.startTimer();
    }
  }

  render() {
    this.airdropReleaseTokens()
    return (
      <div style={{ color: "black" }}>
        {this.state.time.m} : {this.state.time.s}
      </div>
    );
  }
}
