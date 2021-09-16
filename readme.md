

Steps

1. Create an `.env` file over project and include all the project variable.
2. Add project variables to the .env file
   - INFURA_PROJECT_ID
   - INFURA_PROJECT_SECRET 
   - MNEMONIC_PHRASE
   - ETHERSCAN_API_KEY 

3. For local ganache deploy
   Run `truffle deploy`

4. For Rinkeby deploy
   Run 'truffle deploy --network rinkeby'

5. Lastly is verify you etherscan code
   Run `truffle run Investment --network rinkeby

```
Pass - Verified: https://rinkeby.etherscan.io/address/0x2CEA970AE626C8114Ca12942e96c7c2E189C16b2#contracts
```

<img src="https://github.com/lawweiliang/investmentContract/blob/main/doc/verifyImage.png" width="500">
