
const globalVar = require('../variable/global_variable.js')
const investment = artifacts.require('Investment');
const mockV3Aggregator = artifacts.require('MockV3Aggregator');

module.exports = async (deployer, network) => {

  let chainlinkContractAddress;
  if (network != "development") {
    chainlinkContractAddress = globalVar.networks[network].chainlink_price_feed_ETH_USD_address;
  } else {
    await deployer.deploy(mockV3Aggregator, globalVar.chainlink.ETHUSD.decimal, globalVar.chainlink.ETHUSD.price);
    const mockV3Contract = await mockV3Aggregator.deployed();
    chainlinkContractAddress = mockV3Contract.address;
    console.log('Development mockv3 address', chainlinkContractAddress);
  }

  await deployer.deploy(investment, chainlinkContractAddress, globalVar.minimum_investment_in_dollar.value);

}
