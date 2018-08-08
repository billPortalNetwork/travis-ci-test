// ==== registrarService ===
// ENS
import {
  getEntries as getENSEntries,
  startAuctionsAndBid as startENSAuctionsAndBid,
  unsealBid as unsealENSBid,
  finalizeAuction as finalizeENSAuction,
  getShaBid as getENSShaBid,
  getAllowedTime as getENSAllowedTime,
  newBid as newENSBid
} from "./ens/registrarService";
// ECNS
import {
  getEntries as getECNSEntries,
  startAuctionsAndBid as startECNSAuctionsAndBid,
  unsealBid as unsealECNSBid,
  finalizeAuction as finalizeECNSAuction,
  getShaBid as getECNSShaBid,
  getAllowedTime as getECNSAllowedTime,
  newBid as newECNSBid
} from "./ecns/registrarService";
// WANCHAIN
import {
  getEntries as getWANEntries,
  startAuctionsAndBid as startWANAuctionsAndBid,
  unsealBid as unsealWANBid,
  finalizeAuction as finalizeWANAuction,
  getShaBid as getWANShaBid,
  getAllowedTime as getWANAllowedTime,
  newBid as newWNSBid
} from "./wns/registrarService";

// === web3Service ===
// ENS
import {
  getProvider as getENSProvider,
  getEnsRegistrarAddress,
  getAddressByPrivateKey as getAddressByETHPrivateKey,
  sendRawTransaction as sendETHRawTransaction,
  getLatestBlockNumber as getETHLatestBlockNumber,
  getEnsRegistryAddress, 
  getEnsResolverAddress
} from "./ens/web3Service";
// ECNS
import {
  getProvider as getECNSProvider,
  getEcnsRegistrarAddress,
  getAddressByPrivateKey as getAddressByETCPrivateKey,
  sendRawTransaction as sendETCRawTransaction,
  getLatestBlockNumber as getETCLatestBlockNumber,
  getEcnsRegistryAddress,
  getEcnsResolverAddress
} from "./ecns/web3Service";
// WANCHAIN
import {
  getProvider as getWANProvider,
  getWnsRegistrarAddress,
  getAddressByPrivateKey as getAddressByWANPrivateKey,
  sendRawTransaction as sendWANRawTransaction,
  getLatestBlockNumber as getWANLatestBlockNumber,
  getWnsRegistryAddress,
  getWnsResolverAddress
} from "./wns/web3Service";

// === deedService ===
// ENS
import { getOwner as getENSOwner } from "./ens/deedService";
// ECNS
import { getOwner as getECNSOwner } from "./ecns/deedService";
// WANCHAIN
import { getOwner as getWANOwner } from "./wns/deedService";

// === registryService ===
// ENS
import { 
  setSubnodeOwner as setEnsSubnodeOwner,
  setResolver as setEnsResolver
} from "./ens/registryService";
// ECNS
import { 
  setSubnodeOwner as setEcnsSubnodeOwner,
  setResolver as setEcnsResolver
} from "./ecns/registryService";
// WANCHAIN
import {
  setSubnodeOwner as setWnsSubnodeOwner,
  setResolver as setWnsResolver
} from "./wns/registryService";

// === resolverService ===
// ENS
import { setAddress as setEnsAddress } from "./ens/resolverService";
// ECNS
import { setAddress as setEcnsAddress } from "./ecns/resolverService";
// WANCHAIN
import { setAddress as setWnsAddress } from "./wns/resolverService";

const Web3 = require("web3");
let web3 = new Web3();

const SECRET = "portalnetwork";
const NAMESERVICE = process.env.BLOCKCHAIN_NAME;

export const getEntries = name => {
  switch (NAMESERVICE) {
    case "eth":
      return getENSEntries(name);
    case "etc":
      return getECNSEntries(name);
    case "wan":
      return getWANEntries(name);
    default:
      break;
  }
};

export const getProvider = () => {
  switch (NAMESERVICE) {
    case "eth":
      return getENSProvider(process.env.BLOCKCHAIN_NETWORK);
    case "etc":
      return getECNSProvider(process.env.BLOCKCHAIN_NETWORK);
    case "wan":
      return getWANProvider(process.env.BLOCKCHAIN_NETWORK);
    default:
      break;
  }
};

export const getOwner = async deed => {
  switch (NAMESERVICE) {
    case "eth":
      return await getENSOwner(deed);
    case "etc":
      return await getECNSOwner(deed);
    case "wan":
      return await getWANOwner(deed);
    default:
      break;
  }
};

export const startAuctionsAndBid = async (domain, value) => {
  switch (NAMESERVICE) {
    case "eth":
      console.log(`Name: ${domain}, value: ${value}`)
      return await startENSAuctionsAndBid(
        domain,
        getAddressByPrivateKey(process.env.PRIVATE_KEY),
        web3.toWei(value, "ether"),
        SECRET
      );
    case "etc":
      return await startECNSAuctionsAndBid(
        domain,
        getAddressByPrivateKey(process.env.PRIVATE_KEY),
        web3.toWei(value, "ether"),
        SECRET
      );
    case "wan":
      return await startWANAuctionsAndBid(
        domain,
        getAddressByPrivateKey(process.env.PRIVATE_KEY),
        web3.toWei(value, "ether"),
        SECRET
      );
    default:
      break;
  }
};

export const newBid = async (domain, value) => {
  switch (NAMESERVICE) {
    case "eth":
      return await newENSBid(
        domain,
        getAddressByPrivateKey(process.env.PRIVATE_KEY),
        web3.toWei(value, "ether"),
        SECRET
      );
    case "etc":
      return await newECNSBid(
        domain,
        getAddressByPrivateKey(process.env.PRIVATE_KEY),
        web3.toWei(value, "ether"),
        SECRET
      );
    case "wan":
      return await newWNSBid(
        domain,
        getAddressByPrivateKey(process.env.PRIVATE_KEY),
        web3.toWei(value, "ether"),
        SECRET
      );
    default:
      break;
  }
}

export const unsealBid = async (domain, value) => {
  switch (NAMESERVICE) {
    case "eth":
      return await unsealENSBid(domain, web3.toWei(value, "ether"), SECRET);
    case "etc":
      return await unsealECNSBid(domain, web3.toWei(value, "ether"), SECRET);
    case "wan":
      return await unsealWANBid(domain, web3.toWei(value, "ether"), SECRET);
    default:
      break;
  }
};

export const finalizeAuction = async domain => {
  switch (NAMESERVICE) {
    case "eth":
      return await finalizeENSAuction(domain);
    case "etc":
      return await finalizeECNSAuction(domain);
    case "wan":
      return await finalizeWANAuction(domain);
    default:
      break;
  }
};

export const getRegistrarAddress = () => {
  switch (NAMESERVICE) {
    case "eth":
      return getEnsRegistrarAddress(process.env.BLOCKCHAIN_NETWORK);
    case "etc":
      return getEcnsRegistrarAddress(process.env.BLOCKCHAIN_NETWORK);
    case "wan":
      return getWnsRegistrarAddress(process.env.BLOCKCHAIN_NETWORK);
    default:
      break;
  }
};

export const getAddressByPrivateKey = (PRIVATE_KEY) => {
  switch (NAMESERVICE) {
    case "eth":
      return getAddressByETHPrivateKey(PRIVATE_KEY);
    case "etc":
      return getAddressByETCPrivateKey(PRIVATE_KEY);
    case "wan":
      return getAddressByWANPrivateKey(PRIVATE_KEY);
    default:
      break;
  }
};

export const sendRawTransaction = async payload => {
  switch (NAMESERVICE) {
    case "eth":
      return await sendETHRawTransaction(payload);
    case "etc":
      return await sendETCRawTransaction(payload);
    case "wan":
      return await sendWANRawTransaction(payload);
    default:
      break;
  }
};

export const getShaBid = async (name, address, ether, secret) => {
  switch (NAMESERVICE) {
    case "eth":
      return await getENSShaBid(name, address, ether, secret);
    case "etc":
      return await getECNSShaBid(name, address, ether, secret);
    case "wan":
      return await getWANShaBid(name, address, ether, secret);
    default:
      break;
  }
};

export const getAllowedTime = async name => {
  switch (NAMESERVICE) {
    case "eth":
      return await getENSAllowedTime(name);
    case "etc":
      return await getECNSAllowedTime(name);
    case "wan":
      return await getWANAllowedTime(name);
    default:
      break;
  }
};

export const getLatestBlockNumber = async () => {
  switch (NAMESERVICE) {
    case "eth":
      return await getETHLatestBlockNumber();
    case "etc":
      return await getETCLatestBlockNumber();
    case "wan":
      return await getWANLatestBlockNumber();
    default:
      break;
  }
};

export const setSubNodeOwner = async (name, label, owner) => {
  switch (NAMESERVICE) {
    case "eth":
      return await setEnsSubnodeOwner(name, label, owner);
    case "etc":
      return await setEcnsSubnodeOwner(name, label, owner);
    case "wan":
      return await setWnsSubnodeOwner(name, label, owner);
    default:
      break;
  }
};

export const setResolver = async (name, resolver) => {
  switch (NAMESERVICE) {
    case "eth":
      return await setEnsResolver(name, resolver);
    case "etc":
      return await setEcnsResolver(name, resolver);
    case "wan":
      return await setWnsResolver(name, resolver);
    default:
      break;
  }
};

export const setAddress = async (name, address) => {
  switch (NAMESERVICE) {
    case "eth":
      return await setEnsAddress(name, address);
    case "etc":
      return await setEcnsAddress(name, address);
    case "wan":
      return await setWnsAddress(name, address);
    default:
      break;
  }
};

export const getRegistryAddress = async () => {
  switch (NAMESERVICE) {
    case "eth":
      return await getEnsRegistryAddress(process.env.BLOCKCHAIN_NETWORK);
    case "etc":
      return await getEcnsRegistryAddress(process.env.BLOCKCHAIN_NETWORK);
    case "wan":
      return await getWnsRegistryAddress(process.env.BLOCKCHAIN_NETWORK);
    default:
      break;
  }
};

export const getPublicResolver = async () => {
  switch (NAMESERVICE) {
    case "eth":
      return await getEnsResolverAddress(process.env.BLOCKCHAIN_NETWORK);
    case "etc":
      return await getEcnsResolverAddress(process.env.BLOCKCHAIN_NETWORK);
    case "wan":
      return await getWnsResolverAddress(process.env.BLOCKCHAIN_NETWORK);
    default:
      break;
  }
};

export const getSha3 = async (name) => {
  return web3.sha3(name);
} 

