var Promise = require('bluebird');

const resolverInterface = [
  {
    constant: true,
    inputs: [
      {
        name: 'interfaceID',
        type: 'bytes4'
      }
    ],
    name: 'supportsInterface',
    outputs: [
      {
        name: '',
        type: 'bool'
      }
    ],
    payable: false,
    type: 'function'
  }, {
    constant: true,
    inputs: [
      {
        name: 'node',
        type: 'bytes32'
      }, {
        name: 'contentTypes',
        type: 'uint256'
      }
    ],
    name: 'ABI',
    outputs: [
      {
        name: 'contentType',
        type: 'uint256'
      }, {
        name: 'data',
        type: 'bytes'
      }
    ],
    payable: false,
    type: 'function'
  }, {
    constant: false,
    inputs: [
      {
        name: 'node',
        type: 'bytes32'
      }, {
        name: 'x',
        type: 'bytes32'
      }, {
        name: 'y',
        type: 'bytes32'
      }
    ],
    name: 'setPubkey',
    outputs: [],
    payable: false,
    type: 'function'
  }, {
    constant: true,
    inputs: [
      {
        name: 'node',
        type: 'bytes32'
      }
    ],
    name: 'content',
    outputs: [
      {
        name: 'ret',
        type: 'bytes32'
      }
    ],
    payable: false,
    type: 'function'
  }, {
    constant: true,
    inputs: [
      {
        name: 'node',
        type: 'bytes32'
      }
    ],
    name: 'addr',
    outputs: [
      {
        name: 'ret',
        type: 'address'
      }
    ],
    payable: false,
    type: 'function'
  }, {
    constant: false,
    inputs: [
      {
        name: 'node',
        type: 'bytes32'
      }, {
        name: 'contentType',
        type: 'uint256'
      }, {
        name: 'data',
        type: 'bytes'
      }
    ],
    name: 'setABI',
    outputs: [],
    payable: false,
    type: 'function'
  }, {
    constant: true,
    inputs: [
      {
        name: 'node',
        type: 'bytes32'
      }
    ],
    name: 'name',
    outputs: [
      {
        name: 'ret',
        type: 'string'
      }
    ],
    payable: false,
    type: 'function'
  }, {
    constant: false,
    inputs: [
      {
        name: 'node',
        type: 'bytes32'
      }, {
        name: 'name',
        type: 'string'
      }
    ],
    name: 'setName',
    outputs: [],
    payable: false,
    type: 'function'
  }, {
    constant: false,
    inputs: [
      {
        name: 'node',
        type: 'bytes32'
      }, {
        name: 'hash',
        type: 'bytes32'
      }
    ],
    name: 'setContent',
    outputs: [],
    payable: false,
    type: 'function'
  }, {
    constant: true,
    inputs: [
      {
        name: 'node',
        type: 'bytes32'
      }
    ],
    name: 'pubkey',
    outputs: [
      {
        name: 'x',
        type: 'bytes32'
      }, {
        name: 'y',
        type: 'bytes32'
      }
    ],
    payable: false,
    type: 'function'
  }, {
    constant: false,
    inputs: [
      {
        name: 'node',
        type: 'bytes32'
      }, {
        name: 'addr',
        type: 'address'
      }
    ],
    name: 'setAddr',
    outputs: [],
    payable: false,
    type: 'function'
  }, {
    inputs: [
      {
        name: 'ensAddr',
        type: 'address'
      }
    ],
    payable: false,
    type: 'constructor'
  }, {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'node',
        type: 'bytes32'
      }, {
        indexed: false,
        name: 'a',
        type: 'address'
      }
    ],
    name: 'AddrChanged',
    type: 'event'
  }, {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'node',
        type: 'bytes32'
      }, {
        indexed: false,
        name: 'hash',
        type: 'bytes32'
      }
    ],
    name: 'ContentChanged',
    type: 'event'
  }, {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'node',
        type: 'bytes32'
      }, {
        indexed: false,
        name: 'name',
        type: 'string'
      }
    ],
    name: 'NameChanged',
    type: 'event'
  }, {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'node',
        type: 'bytes32'
      }, {
        indexed: true,
        name: 'contentType',
        type: 'uint256'
      }
    ],
    name: 'ABIChanged',
    type: 'event'
  }, {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'node',
        type: 'bytes32'
      }, {
        indexed: false,
        name: 'x',
        type: 'bytes32'
      }, {
        indexed: false,
        name: 'y',
        type: 'bytes32'
      }
    ],
    name: 'PubkeyChanged',
    type: 'event'
  }
];

/**
 * @class
 */
function Resolver(web3, address) {
  this.web3 = web3;
  const resolverContract = web3.eth.contract(resolverInterface);
  this.resolverPromise = Promise.resolve(Promise.promisifyAll(resolverContract.at(address)));
}

/**
 * 
 * @param {*} name 
 * @param {*} content 
 * @param {*} callback 
 */
Resolver.prototype.setContent = function(name, content, callback) {
  return this.resolverPromise.then(function(resolver) {
    return resolver.setContentAsync(name, content);
  });
}

/**
 * 
 * @param {*} name 
 * @param {*} callback 
 */
Resolver.prototype.content = function(name, callback) {
  return this.resolverPromise.then(function(resolver) {
    return resolver.contentAsync(name);
  })
}

/**
 * 
 * @param {*} name 
 * @param {*} address 
 * @param {*} callback 
 */
Resolver.prototype.setAddr = function(name, address, callback) {
  return this.resolverPromise.then(function(resolver) {
    return resolver.setAddrAsync(name, address);
  })
}

/**
 * 
 * @param {*} name 
 * @param {*} callback 
 */
Resolver.prototype.addr = function(name, callback) {
  return this.resolverPromise.then(function(resolver) {
    return resolver.addrAsync(name);
  })
}

module.exports = Resolver;
