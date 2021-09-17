// const {BN, ether, expectEvent, expectRevert} = require('@openzeppelin/test-helpers');

const { BN, ether, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const globalVar = require('../variable/global_variable.js')
const investmentContract = artifacts.require('Investment');
const mockV3Contract = artifacts.require('MockV3Aggregator');


contract('Investment Contract Testing', async ([alice, bob]) => {

   let investmentInstance;
   beforeEach(async () => {
      const chainlinkInstance = await mockV3Contract.new(globalVar.chainlink.ETHUSD.decimal, globalVar.chainlink.ETHUSD.price);
      investmentInstance = await investmentContract.new(chainlinkInstance.address, globalVar.minimum_investment_in_dollar.value);
   });

   it('fundMe function test not enough fund', async () => {
      //fund value 0.02 * 2000 = 40 dollar
      const ethWei = web3.utils.toWei('0.02', 'ether');
      await expectRevert(investmentInstance.fundMe({ from: alice, value: ethWei }), 'Funding number minimum amount is USD100');
   });

   it('getMinimumInvestmentInEth function test', async () => {
      const minimumInvestmentInEth = await investmentInstance.getMinimumInvestmentInEth();

      // ethPrice is 8 decimal(chainlink), 
      const precision = new BN(web3.utils.toWei('1', 'ether'));
      const minimumInvestmentInUsd = new BN(globalVar.minimum_investment_in_dollar.value);
      const ethPriceInUsd = new BN(BigInt(globalVar.chainlink.ETHUSD.price * Math.pow(10, 18 - globalVar.chainlink.ETHUSD.decimal)));
      const expectedMinimumInvestmentInEth = minimumInvestmentInUsd.mul(precision).div(ethPriceInUsd);

      assert.equal(minimumInvestmentInEth.toString(), expectedMinimumInvestmentInEth.toString())
   });


   it('fundMe function test enough fund', async () => {
      //fund value 1 * 2000 = 2000 dollar
      const ethWei = web3.utils.toWei('1', 'ether');
      const tranReceipt = await investmentInstance.fundMe({ from: alice, value: ethWei });
      expectEvent(tranReceipt, 'FundedEvent', { funder: alice, amount: ethWei, message: 'Amount Funded' })
   });

   it('getFundedAddressAmount function test', async () => {
      //fund value 1 * 2000 = 2000 dollar
      const ethWei = web3.utils.toWei('1', 'ether');
      await investmentInstance.fundMe({ from: alice, value: ethWei });
      const fundedAmount = await investmentInstance.getFundedAddressAmount(alice);
      assert.equal(fundedAmount, ethWei);
   });

   it('getChainLinkABIVersion function test', async () => {
      const version = await investmentInstance.getChainLinkABIVersion();
      assert.equal(version.toString(), '0');
   });

   it('getChainLinkUsdDecimal function test', async () => {
      const decimal = await investmentInstance.getChainLinkUsdDecimal();
      assert.equal(decimal.toString(), '8');
   });

   it('getEthPriceInUsd function test', async () => {
      const ethPriceInUsd = await investmentInstance.getEthPriceInUsd();
      assert.equal(ethPriceInUsd / Math.pow(10, 18), globalVar.chainlink.ETHUSD.price / Math.pow(10, 8));
   });

   it('converthETHToUSD function test', async () => {
      //1 ether equal 2000 dollar
      const ethInWei = web3.utils.toWei('1', 'ether');
      // const ethInUSDBigNumber = BigInt(2000 * Math.pow(10, 18));
      const ethInUSDBigNumber = web3.utils.toWei('2000', 'ether');

      const ethInUsdFromContract = await investmentInstance.converthETHToUSD(ethInWei);
      assert.equal(ethInUsdFromContract.toString(), ethInUSDBigNumber.toString());
   });

   it('withdraw function test', async () => {
      //fund value 1 * 2000 = 2000 dollar
      const ethWei = web3.utils.toWei('1', 'ether');
      await investmentInstance.fundMe({ from: alice, value: ethWei });
      const contractBalanceBefore = await investmentInstance.getContractBalance();
      assert.equal(contractBalanceBefore.toString(), ethWei);

      await investmentInstance.withdraw();
      const contractBalanceAfter = await investmentInstance.getContractBalance();
      assert.equal(contractBalanceAfter.toString(), '0');
   });


   it('withdraw function test only owner is allow to withdraw', async () => {
      expectRevert(investmentInstance.withdraw({ from: bob }), 'You are not the owner of the contract');
   });

   it('getContractBalance function test', async () => {
      const contractBalance = await investmentInstance.getContractBalance();
      assert.equal(contractBalance.toString(), '0');
   });

   it('getOwnerAddress function test', async () => {
      const ownerAddress = await investmentInstance.getOwnerAddress();
      assert.equal(ownerAddress, alice);
   });


});

