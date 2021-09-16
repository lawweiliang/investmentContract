
module.exports = {
  networks: {
    rinkeby: {
      chainlink_price_feed_ETH_USD_address: '0x8A753747A1Fa494EC906cE90E9f37563A8AF630e'    
    }, 
    mainnet: {
      chainlink_price_feed_ETH_USD_address: '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419'    
    },      
  },
  chainlink:{
    ETHUSD:{
      price: 200000000000,
      decimal: 8
    }
  }
}