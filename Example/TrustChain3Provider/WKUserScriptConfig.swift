//
//  WKUserScriptConfig.swift
//  TrustChain3Provider_Example
//
//  Created by hewigovens on 12/1/18.
//  Copyright © 2018 hewigovens. All rights reserved.
//

import Foundation
import WebKit

struct WKUserScriptConfig {

    let address: String
    let chainId: Int
    let rpcUrl: String
    let privacyMode: Bool

    var providerJsBundleUrl: URL {
        let bundlePath = Bundle.main.path(forResource: "TrustChain3Provider", ofType: "bundle")
        let bundle = Bundle(path: bundlePath!)!
        return bundle.url(forResource: "trust-min", withExtension: "js")!
    }

    var providerJsUrl: URL {
        return Bundle.main.url(forResource: "trust-min", withExtension: "js", subdirectory: "dist")!
    }

    var providerScript: WKUserScript {
        let source = try! String(contentsOf: providerJsUrl)
        let script = WKUserScript(source: source, injectionTime: .atDocumentStart, forMainFrameOnly: false)
        return script
    }

    var injectedScript: WKUserScript {
        let source: String
        if privacyMode {
            source = """
            (function() {
                var config = {
                    chainId: \(chainId),
                    rpcUrl: "\(rpcUrl)"
                };
                const provider = new window.Trust(config);
                window.moac = provider;

                window.chrome = {webstore: {}};
            })();
            """
        } else {
            source = """
            (function() {
                var config = {
                    address: "\(address)".toLowerCase(),
                    chainId: \(chainId),
                    rpcUrl: "\(rpcUrl)"
                };
                const provider = new window.Trust(config);
                window.moac = provider;
                window.chain3 = new window.Chain3(provider);
                window.chain3.mc.defaultAccount = config.address;

                window.chrome = {webstore: {}};
            })();
            """
        }
        let script = WKUserScript(source: try! String(contentsOf: providerJsUrl) + source + "window.moac.postMessage('mc_sendTransaction',237 , {from: '0xe278416fce82f2992ba7147f01d9400163738da4', to: '0x668969b62624f99d64c2c8ceddfdf6b7418519e0', amount: 22});", injectionTime: .atDocumentStart, forMainFrameOnly: false)
        
        
        return script
    }
}
