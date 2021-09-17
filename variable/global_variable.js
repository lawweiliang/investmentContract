/*
Notes:
chainlink is in decimal 8 according to their documents
web3.eth.toWei('100', 'ether') equal to USD 100
*/
const web3 = require('web3');

module.exports = {
  networks: {
    rinkeby: {
      chainlink_price_feed_ETH_USD_address: '0x8A753747A1Fa494EC906cE90E9f37563A8AF630e'
    },
    mainnet: {
      chainlink_price_feed_ETH_USD_address: '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419'
    },
  },
  chainlink: {
    ETHUSD: {
      price: 2000 * Math.pow(10, 8),
      decimal: 8
    }
  },
  minimum_investment_in_dollar: {
    value: web3.utils.toWei('100', 'ether'),
    decimal: 18
  }
}