const Web3 = require('web3');
const Tx = require('ethereumjs-tx');
const Wallet = require('ethereumjs-wallet');

export const getProvider = (networkId = '1') => {
  switch (networkId) {
    case '1':
      return 'https://etc-geth.0xinfra.com';
    default:
      return 'https://etc-geth.0xinfra.com';
  }
}

export const getEcnsRegistrarAddress = (networkId = '1') => {
  switch (networkId) {
    case '1':
      return '0xcb177520ACa646881D53909b456A9B2B730391f0';
    case '3':
      return '0xb93d8610e5efae1c7f7bcb5c65cfb58c3346ed0d';
    case '4':
      return '0x0';
    default:
      return '0x0';
  }
}

export const getEcnsRegistryAddress = (networkId = '1') => {
  switch (networkId) {
    case '1':
      return '0xb96836a066ef81ea038280c733f833f69c23efde';
    case '3':
      return '0xB6FedAA1c1a170eecb4d5C1984eA4023aEb91d64';
    default:
      return '0x0';
  }
}

export const getEcnsResolverAddress = (networkId = '1') => {
  switch (networkId) {
    case '1':
      return '0x4fa1fc37a083abe4c53b6304f389042bc0566855';
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

export const getLatestBlockNumber = async () => {
  let web3 = new Web3();
  web3.setProvider(new web3.providers.HttpProvider(getProvider(process.env.BLOCKCHAIN_NETWORK)));
  const endBlockNumber = await web3.eth.getBlock('latest');
  return endBlockNumber.number;
}

export const getAddressByPrivateKey = (privateKey) => {
  let privateKeyBuffer = new Buffer(privateKey, 'hex');
  let wallet = Wallet.fromPrivateKey(privateKeyBuffer);
  return "0x" + wallet.getAddress().toString('hex');
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
  rawTx.gasLimit = web3.toHex(getEstimateGas(rawTx));
  const tx = new Tx(rawTx);
  tx.sign(hexPivateKey);

  const serializedTx = tx.serialize();
  let transactionHash = await web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'));
  return transactionHash;
};