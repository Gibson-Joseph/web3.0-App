// https://www.google.com/search?q=what+is+artifacts.require&oq=what+is+artifacts.require+&aqs=chrome..69i57j0i390l4.9110j0j7&sourceid=chrome&ie=UTF-8
const Migrations = artifacts.require("Migrations");
// https://trufflesuite.github.io/artifact-updates/background.html#what-are-artifacts

module.exports = function(deployer) {
  deployer.deploy(Migrations);
};
