import {
  getProvider,
  getEcnsResolverAddress
} from './web3Service';
import Resolver from './resolver';
import {
  getContentHash
} from '../../helpers/ipfsHelper';
const abi = require('ethereumjs-abi');
const Web3 = require('web3');
const namehash = require('eth-ens-namehash');
let web3 = new Web3();
let resolver = null;

const setWeb3Provider = () => {
  web3.setProvider(new web3.providers.HttpProvider(getProvider(process.env.BLOCKCHAIN_NETWORK)));
  resolver = new Resolver(web3, getEcnsResolverAddress(process.env.BLOCKCHAIN_NETWORK));
}

/**
 * 
 * @param {*} name 
 * @param {*} content 
 */
export const setContent = async (name, content) => {
  try {
    // name 要用 namehash
    let byteData = "0x" +
      abi.methodID("setContent", ["bytes32", "bytes32"]).toString("hex") +
      abi.rawEncode(["bytes32", "bytes32"], [namehash.hash(name), getContentHash(content)]).toString("hex");
    return byteData;
  } catch (err) {
    console.log('setContent: ', name, content, err);
    return 'setContent error';
  }
}

/**
 * 
 * @param {*} name 
 */
export const getContent = async (name) => {
  try {
    setWeb3Provider();
    const content = await resolver.content(namehash.hash(name));
    return content;
  } catch (err) {
    console.log('getContent: ', name, err);
    return 'getContent not found';
  }
}

/**
 * 
 * @param {*} name 
 * @param {*} address 
 */
export const setAddress = async (name, address) => {
  try {
    // name 要用 namehash
    let byteData = "0x" +
      abi.methodID("setAddr", ["bytes32", "address"]).toString("hex") +
      abi.rawEncode(["bytes32", "address"], [namehash.hash(name), address]).toString("hex");
    return byteData;
  } catch (err) {
    console.log('setAddress: ', name, address, err);
    return 'setAddress error';
  }
}

/**
 * 
 * @param {*} name 
 */
export const getAddress = async (name) => {
  try {
    setWeb3Provider();
    const address = await resolver.addr(namehash.hash(name));
    return address;
  } catch (err) {
    console.log('getAddress: ', name, err);
    return 'getAddress not found';
  }
}

/**
 * 
 * @param {*} support 
 */
export const getSupportsInterface = async (support) => {
  try {
    setWeb3Provider();
    const content = await resolver.supportsInterface(support);
    return content;
  } catch (err) {
    console.log('getSupportsInterface: ', support, err);
    return 'getSupportsInterface not found';
  }
}
