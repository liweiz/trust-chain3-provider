// Modifications copyright © 2019 Liwei Zhang. All rights reserved.

"use strict";

import Chain3 from "chain3";
import FilterMgr from "./filter";
import RPCServer from "./rpc";
import Utils from "./utils";
import IdMapping from "./id_mapping";

class TrustChain3Provider {
  constructor(config) {
    this.setConfig(config);

    this.idMapping = new IdMapping();

    this.callbacks = new Map;
    this.isTrust = true;
  }

  isConnected() {
    return true;
  }

  setAddress(address) {
    this.address = (address || "").toLowerCase();
    this.ready = !!address;
  }

  setConfig(config) {
    this.setAddress(config.address);

    this.chainId = config.chainId;
    this.rpc = new RPCServer(config.rpcUrl);
    this.filterMgr = new FilterMgr(this.rpc);
  }

  enable() {
    // this may be undefined somehow
    var that = this || window.ethereum;
    return that._sendAsync({
      method: "eth_requestAccounts",
      params: []
    })
    .then(result => {
      return result.result;
    });
  }

  send(payload) {
    let response = {
      jsonrpc: "2.0",
      id: payload.id
    };
    switch(payload.method) {
      case "mc_accounts":
        response.result = this.mc_accounts();
        break;
      case "mc_coinbase":
        response.result = this.mc_coinbase();
        break;
      case "net_version":
        response.result = this.net_version();
        break;
      case "mc_uninstallFilter":
        this.sendAsync(payload, (error) => {
          if (error) {
            console.log(`<== uninstallFilter ${error}`);
          }
        });
        response.result = true;
        break;
      default:
        throw new Error(`Trust does not support calling ${payload.method} synchronously without a callback. Please provide a callback parameter to call ${payload.method} asynchronously.`);
    }
    return response;
  }

  sendAsync(payload, callback) {
    if (Array.isArray(payload)) {
      Promise.all(payload.map(this._sendAsync.bind(this)))
      .then(data => callback(null, data))
      .catch(error => callback(error, null));
    } else {
      this._sendAsync(payload)
      .then(data => callback(null, data))
      .catch(error => callback(error, null));
    }
  }

  _sendAsync(payload) {
    this.idMapping.tryIntifyId(payload);
    return new Promise((resolve, reject) => {
      if (!payload.id) {
        payload.id = Utils.genId();
      }
      this.callbacks.set(payload.id, (error, data) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      });

      switch(payload.method) {
        case "mc_accounts":
          return this.sendResponse(payload.id, this.mc_accounts());
        case "mc_coinbase":
          return this.sendResponse(payload.id, this.mc_coinbase());
        case "net_version":
          return this.sendResponse(payload.id, this.net_version());
        case "mc_sign":
          return this.mc_sign(payload);
        case "personal_sign":
          return this.personal_sign(payload);
        case "personal_ecRecover":
          return this.personal_ecRecover(payload);
        case "eth_signTypedData":
        case "eth_signTypedData_v3":
          return this.eth_signTypedData(payload);
        case "mc_sendTransaction":
          return this.mc_sendTransaction(payload);
        case "eth_requestAccounts":
          return this.eth_requestAccounts(payload);
        case "mc_newFilter":
          return this.mc_newFilter(payload);
        case "mc_newBlockFilter":
          return this.mc_newBlockFilter(payload);
        case "mc_newPendingTransactionFilter":
          return this.mc_newPendingTransactionFilter(payload);
        case "mc_uninstallFilter":
          return this.mc_uninstallFilter(payload);
        case "mc_getFilterChanges":
          return this.mc_getFilterChanges(payload);
        case "mc_getFilterLogs":
          return this.mc_getFilterLogs(payload);
        default:
          this.callbacks.delete(payload.id);
          return this.rpc.call(payload).then(resolve).catch(reject);
      }
    });
  }

  mc_accounts() {
    return this.address ? [this.address] : [];
  }

  mc_coinbase() {
    return this.address;
  }

  net_version() {
    return this.chainId.toString(10) || null;
  }

  mc_sign(payload) {
    this.postMessage("signMessage", payload.id, {data: payload.params[1]});
  }

  personal_sign(payload) {
    this.postMessage("signPersonalMessage", payload.id, {data: payload.params[0]});
  }

  personal_ecRecover(payload) {
    this.postMessage("ecRecover", payload.id, {signature: payload.params[1], message: payload.params[0]});
  }

  eth_signTypedData(payload) {
    this.postMessage("signTypedMessage", payload.id, {data: payload.params[1]});
  }

  // Please reference github.com/TrustWallet/trust-web3-provider/issues/56 @ commit: 702ac4367691b2f4ad2e9b98fe2eef7da17356c9
  // Original was "signTransaction" and it is not a typo
  // Keep "sendTransaction" here to avoid unnecessary misunderstanding
  // Will use other function for "signTransaction" when needed
  eth_sendTransaction(payload) {
    this.postMessage("sendTransaction", payload.id, payload.params[0]);
  }

  eth_requestAccounts(payload) {
    this.postMessage("requestAccounts", payload.id, {});
  }

  mc_newFilter(payload) {
    this.filterMgr.newFilter(payload)
    .then(filterId => this.sendResponse(payload.id, filterId))
    .catch(error => this.sendError(payload.id, error));
  }

  mc_newBlockFilter(payload) {
    this.filterMgr.newBlockFilter()
    .then(filterId => this.sendResponse(payload.id, filterId))
    .catch(error => this.sendError(payload.id, error));
  }

  mc_newPendingTransactionFilter(payload) {
    this.filterMgr.newPendingTransactionFilter()
    .then(filterId => this.sendResponse(payload.id, filterId))
    .catch(error => this.sendError(payload.id, error));
  }

  mc_uninstallFilter(payload) {
    this.filterMgr.uninstallFilter(payload.params[0])
    .then(filterId => this.sendResponse(payload.id, filterId))
    .catch(error => this.sendError(payload.id, error));
  }

  mc_getFilterChanges(payload) {
    this.filterMgr.getFilterChanges(payload.params[0])
    .then(data => this.sendResponse(payload.id, data))
    .catch(error => this.sendError(payload.id, error));
  }

  mc_getFilterLogs(payload) {
    this.filterMgr.getFilterLogs(payload.params[0])
    .then(data => this.sendResponse(payload.id, data))
    .catch(error => this.sendError(payload.id, error));
  }

  postMessage(handler, id, data) {
    if (this.ready || handler === "requestAccounts") {
      window.webkit.messageHandlers[handler].postMessage({
        "name": handler,
        "object": data,
        "id": id
      });
    } else {
      // don't forget to verify in the app
      this.sendError(id, new Error("provider is not ready"));
    }
  }

  sendResponse(id, result) {
    let originId = this.idMapping.tryPopId(id) || id;
    let callback = this.callbacks.get(id);
    let data = {jsonrpc: "2.0", id: originId};
    if (typeof result === "object" && result.jsonrpc && result.result) {
      data.result = result.result;
    } else {
      data.result = result;
    }
    if (callback) {
      callback(null, data);
      this.callbacks.delete(id);
    }
  }

  sendError(id, error) {
    console.log(`<== ${id} sendError ${error}`, id, error);
    let callback = this.callbacks.get(id);
    if (callback) {
      callback(error instanceof Error ? error : new Error(error), null);
      this.callbacks.delete(id);
    }
  }
}

window.Trust = TrustChain3Provider;
window.Chain3 = Chain3;
