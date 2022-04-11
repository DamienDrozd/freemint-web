require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  path: {
    artifact : "/src/artifacts"
  },
  networks: {
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/5499c83d861743938e0c702e13636485",
      accounts:["0x25be04348fc60a1359ff3fd2be9c24e452ba0448c41eca628d3a341391dc7310"]
    }
  }
};
