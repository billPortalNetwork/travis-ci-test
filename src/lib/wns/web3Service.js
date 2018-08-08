const Web3 = require('web3');
const wanUtil = require('wanchain-util');
var Tx = wanUtil.wanchainTx;
const Wallet = require('ethereumjs-wallet');
const BigNumberHelper = require('../../helpers/bigNumberHelper');


export const getProvider = (networkId = '1') => {
  switch (networkId) {
    case '1':
      return 'http://wanchain.portal.network';
    case '3':
      return 'http://wanchain-testnet.portal.network';
    default:
      return 'http://localhost:8042';
  }
}

export const getWnsRegistrarAddress = (networkId = '1') => {
  switch (networkId) {
    case '1':
      return '0x48859467c329854af6ecc363c8ddb393b911586b';
    case '3':
      return '0xeec6bc4d213bf5d7b247a578b9bf13d7443b5546';
    case '4':
      return '0x0';
    default:
      return '0x0';
  }
}

export const getWnsRegistryAddress = (networkId = '1') => {
  switch (networkId) {
    case '1':
      return '0xee8d418fd33e69782015ea4313dfd8eb7b1b91ce';
    case '3':
      return '0xe85cfdf43a0db4aa0ec054a57451af7c73d4625b';
    default:
      return '0x0';
  }
}

/*
  NOTICE: wanchain resolver compile in 0.4.11 solc version
 */
export const getWnsResolverAddress = (networkId = '1') => {
  switch (networkId) {
    case '1':
      return '0xd5bbfe34585bdb92107ad5808dd1a3df1d4d3014';
    case '3':
      return '0x3f5ad0ab415d451bcec48cfcbd61aee126687cd4';
    default:
      return '0x0'
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

export const getLatestBlockNumber = async () => {
  let web3 = new Web3();
  web3.setProvider(new web3.providers.HttpProvider(getProvider(process.env.BLOCKCHAIN_NETWORK)));
  const endBlockNumber = await web3.eth.getBlock('latest');
  return endBlockNumber.number;
}

export const getAccountBalance = async (address) => {
  try {
    let web3 = new Web3();
    web3.setProvider(new web3.providers.HttpProvider(getProvider(process.env.BLOCKCHAIN_NETWORK)));
    const balance = await web3.eth.getBalance(address);
    return balance;
  } catch (err) {
    return '0'
  }
}

export const sendRawTransaction = async (payload) => {
  let web3 = new Web3();
  web3.setProvider(new web3.providers.HttpProvider(getProvider(process.env.BLOCKCHAIN_NETWORK)));
  const {privateKey, from, to, value, data} = payload;

  const hexPivateKey = new Buffer(privateKey, 'hex');
	var bn = new web3.BigNumber(value);
	var hexValue = '0x' + bn.toString(16);
  
  const rawTx = {
    Txtype: '0x01',
    nonce: '0x' + web3.eth.getTransactionCount(from).toString(16),
    gasPrice: '0x'+(200000000000).toString(16),
    from: from,
    to: to, 
    value: hexValue,
    data: data
  };
  rawTx.gasLimit = web3.toHex(getEstimateGas(rawTx));
  const tx = new Tx(rawTx);
  tx.sign(hexPivateKey);

  const serializedTx = tx.serialize();
  let transactionHash = await web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'));
  return transactionHash;
};

export const getAccountBalanceAndTxs = async (myaccount, startBlockNumber, endBlockNumber) => {
  let web3 = new Web3();
  web3.setProvider(new web3.providers.HttpProvider(getProvider(process.env.BLOCKCHAIN_NETWORK)));
  if (endBlockNumber == null) {
    endBlockNumber = await getLatestBlockNumber();
  }
  if (startBlockNumber >= endBlockNumber) return;
  console.log("Searching for transactions to/from account \"" + myaccount + "\" within blocks "  + startBlockNumber + " and " + endBlockNumber);

  let inValue = 0;
  let inTxs = [];
  let outValue = 0;
  let outTxs = [];
  for (var i = startBlockNumber; i <= endBlockNumber; i++) {
    var block = await web3.eth.getBlock(i, true);
    if (block != null && block.transactions != null) {
      block.transactions.forEach( e => {
        //if (BigNumberHelper.toNumber(e.value) > 0) {
          if (myaccount == e.from) {
            outValue = BigNumberHelper.minus(outValue, e.value);
            outTxs.push({txhash: e.hash, from: e.from, to: e.to, value: e.value, block: i});
          } else if (myaccount == e.to) {
            inValue = BigNumberHelper.plus(inValue, e.value);
            inTxs.push({txhash: e.hash, from: e.from, to: e.to, value: e.value, block: i});
          }
        //}
      })
    }
  }
  return { inValue: inValue, outValue: outValue, inTxs: inTxs, outTxs: outTxs, latestBlock: endBlockNumber };
}
