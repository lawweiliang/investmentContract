// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract Investment {
    AggregatorV3Interface pricefeed;

    mapping(address => uint256) addressAmountFunded;
    address[] fundedAddress;

    address owner;

    event FundedEvent(address funder, uint256 amount, string message);

    constructor(address _chainLinkContractAddress) {
        owner = msg.sender;
        pricefeed = AggregatorV3Interface(_chainLinkContractAddress);
    }

    function fundMe() public payable {
        //Funding minimum of 100 dollors
        uint256 minimumUSD = 100 * 10**18;

        require(
            converthETHToUSD(msg.value) >= minimumUSD,
            "Funding number minimum amount is USD100"
        );

        addressAmountFunded[msg.sender] += msg.value;
        fundedAddress.push(msg.sender);

        emit FundedEvent(msg.sender, msg.value, "Amount Funded");
    }

    function getFundedAddressAmount(address _fundAddress)
        public
        view
        returns (uint256)
    {
        return addressAmountFunded[_fundAddress];
    }

    function getChainLinkABIVersion() public view returns (uint256) {
        return pricefeed.version();
    }

    function getChainLinkUsdDecimal() public view returns (uint256) {
        return pricefeed.decimals();
    }

    function getEthPriceInUsd() public view returns (uint256) {
        (, int256 answer, , , ) = pricefeed.latestRoundData();
        return (uint256(answer) * (10**(18 - getChainLinkUsdDecimal())));
    }

    function converthETHToUSD(uint256 _amountOfEthInWei)
        public
        view
        returns (uint256)
    {
        uint256 ethInUsd = ((getEthPriceInUsd() * _amountOfEthInWei) /
            (10**18));
        return ethInUsd;
    }

    modifier onlyOwner() {
        require(owner == msg.sender, "You are not the owner of the contract");
        _;
    }

    function withdraw() public onlyOwner {
        payable(msg.sender).transfer(address(this).balance);

        //update the addressAmountFunded
        for (uint256 i = 0; i < fundedAddress.length; i++) {
            addressAmountFunded[fundedAddress[i]] = 0;
        }

        fundedAddress = new address[](0);
    }

    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getOwnerAddress() public view returns (address) {
        return owner;
    }
}
