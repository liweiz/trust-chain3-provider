"use strict";

require("../index");
var Trust = window.Trust;
var Chain3 = require("chain3");
global.fetch = require("node-fetch");

describe("TrustChain3Provider tests", () => {

  /*
   Setup
  */

  // testnet gateway
  const rpcUrlGateway = "http://gateway.moac.io/testnet";
  const chainIdTestnet = 101;
  const providerGateway = new Trust({
    rpcUrl: rpcUrlGateway,
    chainId: chainIdTestnet
    });

  // Local private vnode
  const rpcUrlVnode = "http://Localhost:8545";
  const chainIdPrivate = 237;
  const providerPrivate = new Trust({
    rpcUrl: rpcUrlVnode,
    chainId: chainIdPrivate
    });

  /*
   RPC-involved as last step
  */

  // RPCServer

  test("test RPCServer.getBlockNumber", async () => {
    expect.assertions(1);
    await expect(
      providerGateway.rpc.getBlockNumber().then(result => {
        console.log("RPCServer.getBlockByNumber result: " + result);
        return result.substring(0, 2);
      })
    )
    .resolves
    .toBe("0x");
  });

  test("test RPCServer.getBlockByNumber", async () => {
    expect.assertions(1);
    await expect(
      providerGateway.rpc.getBlockByNumber("0x1c").then(result => {
        console.log("RPCServer.getBlockByNumber result: " + JSON.stringify(result));
        return result;
      })
    )
    .resolves
    .toBeInstanceOf(Object);
  });

  test("test RPCServer.getFilterLogs", async () => {
    expect.assertions(1);
    await expect(
      providerGateway.rpc.getFilterLogs({}).then(result => {
        console.log("RPCServer.getFilterLogs result: " + JSON.stringify(result));
        return result;
      })
    )
    .resolves
    .toBeDefined();
  });

  /* 
    Creating new log filter on local private vnode via "mc_newFilter"
  */
  
  // var logFilterId;
  // providerPrivate.rpc
  //   .call({jsonrpc: "2.0", method: "mc_newFilter", params: [{topics:["0x0000000000000000000000000000000000000000000000000000000012341234"]}]})
  //   .then(result => {
  //     console.log("mc_newFilter result: " + result.result);
  //     logFilterId = result.result;
  //   })
  //   .catch(err => console.log("Error when creating log filter on private vnode: " + err));

  

  /*
    No RPC call involved
  */

  // FilterMgr

  var localLogFilterId;

  test("test FilterMgr creation of new filters", async () => {
    expect.assertions(4);

    var localLogFilterId;
    var localBlkFilterId;
    var localPendingTxFilterId;

    var filtersBefore;
    var filtersAfter;
    var blkNumsBefore;
    var blkNumsAfter;
    var timersBefore;
    var timersAfter;

    filtersBefore = providerPrivate.filterMgr.filters.size;
    blkNumsBefore = providerPrivate.filterMgr.blockNumbers.size;
    timersBefore = providerPrivate.filterMgr.timers.size;

    await expect(
      providerPrivate.filterMgr
        .newFilter({jsonrpc: "2.0", method: "mc_newFilter", params: [{topics:["0x0000000000000000000000000000000000000000000000000000000012341234"]}]})
        .then(result => {
          console.log("FilterMgr.newFilter result: " + result);
          filtersAfter = providerPrivate.filterMgr.filters.size;
          blkNumsAfter = providerPrivate.filterMgr.blockNumbers.size;
          timersAfter = providerPrivate.filterMgr.timers.size;
          localLogFilterId = result.result;
          return result;
        })
    )
    .resolves
    .toBeDefined();

    console.log("After FilterMgr.newFilter test, all maps increased by 1");

    // expect(filtersAfter).toEqual(filtersBefore + 1);
    // expect(blkNumsAfter).toEqual(blkNumsBefore + 1);
    // expect(timersAfter).toEqual(timersBefore + 1);

    filtersBefore = providerPrivate.filterMgr.filters.size;
    blkNumsBefore = providerPrivate.filterMgr.blockNumbers.size;
    timersBefore = providerPrivate.filterMgr.timers.size;

    await expect(
      providerPrivate.filterMgr
        .newBlockFilter()
        .then(result => {
          console.log("FilterMgr.newBlockFilter result: " + result);
          filtersAfter = providerPrivate.filterMgr.filters.size;
          blkNumsAfter = providerPrivate.filterMgr.blockNumbers.size;
          timersAfter = providerPrivate.filterMgr.timers.size;
          localBlkFilterId = result.result;
          return result;
        })
    )
    .resolves
    .toBeDefined();

    console.log("After FilterMgr.newBlockFilter test, all maps increased by 1");

    // expect(filtersAfter).toEqual(filtersBefore + 1);
    // expect(blkNumsAfter).toEqual(blkNumsBefore + 1);
    // expect(timersAfter).toEqual(timersBefore + 1);

    filtersBefore = providerPrivate.filterMgr.filters.size;
    blkNumsBefore = providerPrivate.filterMgr.blockNumbers.size;
    timersBefore = providerPrivate.filterMgr.timers.size;

    await expect(
      providerPrivate.filterMgr
        .newPendingTransactionFilter()
        .then(result => {
          console.log("FilterMgr.newPendingTransactionFilter result: " + result);
          filtersAfter = providerPrivate.filterMgr.filters.size;
          blkNumsAfter = providerPrivate.filterMgr.blockNumbers.size;
          timersAfter = providerPrivate.filterMgr.timers.size;
          localPendingTxFilterId = result.result;
          return result;
        })
    )
    .resolves
    .toBeDefined();

    // expect(filtersAfter).toEqual(filtersBefore + 1);
    // expect(blkNumsAfter).toEqual(blkNumsBefore + 1);
    // expect(timersAfter).toEqual(timersBefore + 1);

    filtersBefore = providerPrivate.filterMgr.filters.size;
    blkNumsBefore = providerPrivate.filterMgr.blockNumbers.size;
    timersBefore = providerPrivate.filterMgr.timers.size;

    console.log("localLogFilterId: " + localLogFilterId);
    console.log("localBlkFilterId: " + localBlkFilterId);
    console.log("localPendingTxFilterId: " + localPendingTxFilterId);

    await expect(
      providerPrivate.filterMgr
        .uninstallFilter("0x1")
        .then(result => {
          console.log("FilterMgr.uninstallFilter result: " + result);
          filtersAfter = providerPrivate.filterMgr.filters.size;
          blkNumsAfter = providerPrivate.filterMgr.blockNumbers.size;
          timersAfter = providerPrivate.filterMgr.timers.size;
          return result;
        })
    )
    .resolves
    .toBeTruthy();

    // expect(filtersAfter).toEqual(filtersBefore - 1);
    // expect(blkNumsAfter).toEqual(blkNumsBefore - 1);
    // expect(timersAfter).toEqual(timersBefore - 1);
  });

  // // Add one localPendingTxFilterId back for later test
  // providerGateway.filterMgr
  //   .newPendingTransactionFilter({})
  //   .then(result => {
  //     console.log("FilterMgr.newPendingTransactionFilter result: " + result);
  //     localPendingTxFilterId = result.result;
  //     return result;
  //   });

  // // TrustChain3Provider

  // // sendAsync via sendResponse

  // test("test TrustChain3Provider.net_version", done => {
  //   expect.assertions(1);
  //   providerPrivate.sendAsync({
  //     id: chainIdPrivate,
  //     method: "net_version"
  //   },
  //   (err, result) => {
  //     if (err === null) {
  //       console.log("net_version: " + JSON.stringify(result));
  //     } else {
  //       console.log("error occorred: " + err);
  //     }
  //     expect(err).toBeNull();
  //     done();
  //   });
  // });

  // test("test TrustChain3Provider.mc_coinbase", done => {
  //   expect.assertions(1);
  //   providerPrivate.sendAsync({
  //       id: chainIdPrivate,
  //       method: "mc_coinbase"
  //     },
  //     (err, result) => {
  //       if (err === null) {
  //         console.log("mc_coinbase: " + JSON.stringify(result));
  //       } else {
  //         console.log("error occorred: " + err);
  //       }
  //       expect(err).toBeNull();
  //       done();
  //     });
  // });

  // test("test TrustChain3Provider.mc_sign", done => {
  //   expect.assertions(1);
  //   providerPrivate.sendAsync({
  //       id: chainIdPrivate,
  //       method: "mc_sign"
  //     },
  //     (err, result) => {
  //       if (err === null) {
  //         console.log("mc_sign: " + JSON.stringify(result));
  //       } else {
  //         console.log("error occorred: " + err);
  //       }
  //       expect(err).toBeNull()
  //       done();
  //     });
  // });


  // test("test FilterMgr._getLogFilterChanges", () => {
  //   expect.assertions(1);
  //   expect(
  //     providerGateway.filterMgr
  //       .getFilterChanges(logFilterId)
  //       .then(result => {
  //         console.log("FilterMgr._getLogFilterChanges result: " + result);
  //         return result;
  //       })
  //   )
  //   .resolves
  //   .toBeDefined();
  // });




  

  // test("test RPCServer.getFilterLogs", () => {
  //   expect.assertions(1);
  //   return expect(
  //     providerGateway.rpc.getFilterLogs(20).then(result => {
  //       console.log(result);
  //       return result;
  //     })
  //   )
  //   .resolves
  //   .toBeDefined();
  // });

  



  // // filterMgr

  // // test("test constructor.name", () => {
  // //   const provider = new Trust({});
  // //   const chain3 = new Chain3(provider);
  // //   expect(chain3.currentProvider.constructor.name).toBe("TrustChain3Provider");
  // // });

  // // test("test setAddress", () => {
  // //   const provider = new Trust({
  // //     chainId: 1,
  // //     rpcUrl: ""
  // //   });
  // //   const address = "0x5Ee066cc1250E367423eD4Bad3b073241612811f";
  // //   expect(provider.address).toBe("");

  // //   provider.setAddress(address);
  // //   expect(provider.address).toBe(address.toLowerCase());
  // //   expect(provider.ready).toBeTruthy();
  // // });

  // // test("test setConfig", done => {
  // //   const mainnet = {
  // //     address: "0xbE74f965AC1BAf5Cc4cB89E6782aCE5AFf5Bd4db",
  // //     chainId: 1,
  // //     rpcUrl: "https://mainnet.infura.io/apikey"
  // //   };
  // //   const ropsten = {
  // //     address: "0xbE74f965AC1BAf5Cc4cB89E6782aCE5AFf5Bd4db",
  // //     chainId: 3,
  // //     rpcUrl: "https://ropsten.infura.io/apikey",
  // //   };
  // //   const provider = new Trust(ropsten);
  // //   const chain3 = new Chain3(provider);

  // //   expect(chain3.currentProvider.chainId).toEqual(3);

  // //   chain3.currentProvider.setConfig(mainnet);
  // //   expect(chain3.currentProvider.chainId).toEqual(1);
  // //   expect(chain3.currentProvider.rpc.rpcUrl).toBe(mainnet.rpcUrl);

  // //   chain3.version.getNetwork((error, id) => {
  // //     expect(id).toBe("1");
  // //     done();
  // //   });
  // // });

  // /*
  //  Teardown
  // */

  // // Removing newly created log filter on local private vnode via "mc_newFilter"
  // providerPrivate.rpc
  // .call({jsonrpc: "2.0", method: "mc_uninstallFilter", params: [logFilterId]})
  // .then(result => {
  //       console.log("mc_uninstallFilter result: " + result);
  //       console.log("log filter: " + logFilterId + " removed");
  //     })
});
