const Web3 = require('web3');
const Tx = require('ethereumjs-tx');
const Wallet = require('ethereumjs-wallet');

export const getProvider = (networkId = '1') => {
  switch (networkId) {
    case '1':
      return 'https://mainnet.infura.io/mew';
      //return 'https://api.myetherapi.com/eth';
      //return 'https://api.etherscan.io/api';
    case '3':
      return 'https://ropsten.infura.io/NEefAs8cNxYfiJsYCQjc';
    case '4':
      return 'https://rinkeby.infura.io/';
    case '42':
      return 'https://kovan.infura.io/';
    default:
      return 'http://localhost:3000/';
  }
}

export const getEnsRegistrarAddress = (networkId = '1') => {
  switch (networkId) {
    case '1':
      return '0x6090A6e47849629b7245Dfa1Ca21D94cd15878Ef';
    case '3':
      return '0xc19fd9004b5c9789391679de6d766b981db94610';
    case '4':
      return '0x0';
    case '42':
      return '0x0';
    default:
      return '0x0';
  }
}

export const getEnsRegistryAddress = (networkId = '1') => {
  switch (networkId) {
    case '1':
      return '0x314159265dD8dbb310642f98f50C066173C1259b';
    case '3':
      return '0x112234455c3a32fd11230c42e7bccd4a84e02010';
    default:
      return '0x0';
  }
}

export const getEnsResolverAddress = (networkId = '1') => {
  switch (networkId) {
    case '1':
      return '0x5FfC014343cd971B7eb70732021E26C35B744cc4';
    case '3':
      return '0x4c641fb9bad9b60ef180c31f56051ce826d21a9a';
    default:
      return '0x0';
  }
}

export const getCurrentAddress = (web3) => {
  if (web3 === null) return;
  return web3.eth.accounts[0];
}

export const getCurrentNetwork = (web3) => {
  if (web3 === null) return;
  return web3.version.network;
}

export const getEstimateGas = (payload) => {
  let web3 = new Web3();
  web3.setProvider(new web3.providers.HttpProvider(getProvider(process.env.BLOCKCHAIN_NETWORK)));
  return web3.eth.estimateGas(payload);
};

export const getAddressByPrivateKey = (privateKey) => {
  let privateKeyBuffer = new Buffer(privateKey, 'hex');
  let wallet = Wallet.fromPrivateKey(privateKeyBuffer);
  return "0x" + wallet.getAddress().toString('hex');
}

export const getTransactionCount = (address) => {
  let web3 = new Web3();
  web3.setProvider(new web3.providers.HttpProvider(getProvider(process.env.BLOCKCHAIN_NETWORK)));
  return web3.eth.getTransactionCount(address);
}

export const getTransactionReceipt = (txHash) => {
  let web3 = new Web3();
  web3.setProvider(new web3.providers.HttpProvider(getProvider(process.env.BLOCKCHAIN_NETWORK)));
  return web3.eth.getTransactionReceipt(txHash);
}

export const getBlock = (number) => {
  let web3 = new Web3();
  web3.setProvider(new web3.providers.HttpProvider(getProvider(process.env.BLOCKCHAIN_NETWORK)));
  return web3.eth.getBlock(number);
}

export const getLatestBlockNumber = async () => {
  let web3 = new Web3();
  web3.setProvider(new web3.providers.HttpProvider(getProvider(process.env.BLOCKCHAIN_NETWORK)));
  const endBlockNumber = await web3.eth.getBlock('latest');
  return endBlockNumber.number;
}

export const sendRawTransaction = async (payload) => {
  let web3 = new Web3();
  web3.setProvider(new web3.providers.HttpProvider(getProvider(process.env.BLOCKCHAIN_NETWORK)));
  const {privateKey, from, to, value, data, gasPrice} = payload;

  const hexPivateKey = new Buffer(privateKey, 'hex');
  const customGasPrice = gasPrice || 21; 

  const rawTx = {
    nonce: '0x' + web3.eth.getTransactionCount(from).toString(16),
    gasPrice: web3.toHex(web3.toWei(customGasPrice, "shannon")), 
    from,
    to, 
    value, 
    data
  };
  console.log("rawTx", rawTx, web3.eth.getTransactionCount(from));
  rawTx.gasLimit = web3.toHex(getEstimateGas(rawTx));
  const tx = new Tx(rawTx);
  tx.sign(hexPivateKey);

  const serializedTx = tx.serialize();
  let transactionHash = await web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'));
  return transactionHash;
};
