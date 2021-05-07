const WBNB = artifacts.require("WBNB");
const USDT = artifacts.require("USDT");

const MdexRouter = artifacts.require("MdexRouter");
const MdexERC20 = artifacts.require("MdexERC20");
const MdexPair = artifacts.require("MdexPair");
const MdexFactory = artifacts.require("MdexFactory");
const SwapMining = artifacts.require("SwapMining");
const MdexOracleLibrary = artifacts.require("MdexOracleLibrary");
const Oracle = artifacts.require("Oracle");
const BSCPool = artifacts.require("BSCPool");

module.exports = function (deployer, accounts) {

    deployer.deploy(MdexERC20)      // Mdex Token
    .then(function() {
        return deployer.deploy(
            MdexFactory,            // Factory, @todo neet to create MdexPair
            accounts[0]
        );
    })
    .then(function() {
        return deployer.deploy(
            WBNB                    // WBNB
        );
    })
    .then(function() {
        return deployer.deploy(
            MdexRouter,             // MdexRouter, @todo need to setSwapMining
            MdexFactory.address,
            WBNB.address
        );
    })
    .then(function() {
        return deployer.deploy(
            Oracle,                 // Oracle
            MdexFactory.address
        );
    })
    .then(function() {
        return deployer.deploy(
            USDT,                   // USDT
        );
    })
    .then(function() {
        return deployer.deploy(
            SwapMining,             // SwapMining
            MdexERC20.address,
            Oracle.address,
            MdexRouter.address,
            USDT.address,
            1e19,   //_mdxPerBlock,
            0       // startBlock
        );
    })
    .then(function() {
        return deployer.deploy(
            BSCPool,                // BSCPool
            1e19,                   //_mdxPerBlock,
            0                       // startBlock
        );
    });

};