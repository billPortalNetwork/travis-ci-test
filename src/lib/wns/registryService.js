import { 
  getProvider,
  getWnsRegistryAddress
} from './web3Service';
import Registry from './registry';
const abi = require('ethereumjs-abi');
const Web3 = require('web3');
const namehash = require('eth-ens-namehash');
let web3 = new Web3();
let registry = null;

const setWeb3Provider = () => {
  web3.setProvider(new web3.providers.HttpProvider(getProvider(process.env.BLOCKCHAIN_NETWORK)));
  registry = new Registry(web3, getWnsRegistryAddress(process.env.BLOCKCHAIN_NETWORK));
}

/**
 * @description 
 * 
 * Example Usage: 
 *   entries("foobar");  // 只需搜尋需要註冊的名稱
 * 
 * @param {*} name 
 * @param {*} label
 * @param {*} owner
 */
export const setSubnodeOwner = async (name, label, owner) => {
  try {
    // name 要用 namehash
    let byteData = "0x" + 		
                abi.methodID("setSubnodeOwner", [ "bytes32", "bytes32", "address" ]).toString("hex") + 		
                abi.rawEncode([ "bytes32", "bytes32", "address" ], [ namehash.hash(name), web3.sha3(label), owner ]).toString("hex");
    return byteData;
  } catch (err) {
    console.log('setSubnodeOwner: ', name, label, owner, err);
    return 'setSubnodeOwner error';
  }
}

/**
 * 
 * @param {*} name 
 * @param {*} resolver 
 */
export const setResolver = async (name, resolver) => {
  try {
    // name 要用 namehash
    let byteData = "0x" + 		
                abi.methodID("setResolver", [ "bytes32", "address" ]).toString("hex") + 		
                abi.rawEncode([ "bytes32", "address" ], [ namehash.hash(name), resolver ]).toString("hex");
    return byteData;
  } catch (err) {
    console.log('setResolver: ', name, resolver, err);
    return 'startAuctionsAndBid error';
  }
}

/**
 * 
 * @param {*} name 
 */
export const getResolver = async (name) => {
  try {
    setWeb3Provider();
    return await registry.resolver(namehash.hash(name));
  } catch (err) {
    console.log('getResolver: ', name, err);
    return 'getResolver error';
  }
}
