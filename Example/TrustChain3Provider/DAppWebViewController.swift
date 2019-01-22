//
//  ViewController.swift
//  TrustChain3Provider
//
//  Created by hewigovens on 02/15/2018.
//  Copyright (c) 2018 hewigovens. All rights reserved.
//

import UIKit
import WebKit
import chain3swift
import BigInt

class DAppWebViewController: UIViewController {

    @IBOutlet weak var urlField: UITextField!

    var homepage: String {
        return "https://www.google.com"
    }

//    var infuraApiKey: String? {
//        return ProcessInfo.processInfo.environment["INFURA_API_KEY"]
//    }

    lazy var scriptConfig: WKUserScriptConfig = {
        return WKUserScriptConfig(
            address: "0xe278416fce82f2992ba7147f01d9400163738da4",
            chainId: 237,
            rpcUrl: "http://127.0.0.1:8545",
            privacyMode: false
        )
    }()

    lazy var webview: WKWebView = {
        let config = WKWebViewConfiguration()
        let controller = WKUserContentController()
        controller.addUserScript(scriptConfig.providerScript)
//        controller.addUserScript(scriptConfig.injectedScript)
        for name in DAppMethod.allCases {
            print("case name:")
            print(name)
            controller.add(self, name: name.rawValue)
        }
        config.userContentController = controller
        let webview = WKWebView(frame: .zero, configuration: config)
        webview.translatesAutoresizingMaskIntoConstraints = false
        return webview
    }()

    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
//        guard checkApiKey() else { return }

        setupSubviews()
        navigate(to: homepage)
    }

//    func checkApiKey() -> Bool {
//        guard infuraApiKey != nil else {
//            let alert = UIAlertController(title: "No infura api key found", message: "Please set INFURA_API_KEY", preferredStyle: .alert)
//            alert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
//            present(alert, animated: true, completion: nil)
//            return false
//        }
//        return true
//    }

    func setupSubviews() {
        urlField.keyboardType = .URL
        urlField.delegate = self

        view.addSubview(webview)
        NSLayoutConstraint.activate([
            webview.topAnchor.constraint(equalTo: urlField.bottomAnchor),
            webview.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            webview.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            webview.bottomAnchor.constraint(equalTo: view.bottomAnchor),
            webview.widthAnchor.constraint(equalTo: view.widthAnchor)
        ])
    }

    func navigate(to url: String) {
        guard let url = URL(string: url) else { return }
        webview.load(URLRequest(url: url))
    }
    
}

extension DAppWebViewController: UITextFieldDelegate {
    func textFieldShouldReturn(_ textField: UITextField) -> Bool {
        navigate(to: textField.text ?? "")
        
//        var providerJsBundleUrl: URL {
//            let bundlePath = Bundle.main.path(forResource: "TrustChain3Provider", ofType: "bundle")
//            let bundle = Bundle(path: bundlePath!)!
//            return bundle.url(forResource: "trust-min", withExtension: "js")!
//        }
//
//        var providerJsUrl: URL {
//            return Bundle.main.url(forResource: "trust-min", withExtension: "js", subdirectory: "dist")!
//        }
//        let source = try! String(contentsOf: providerJsUrl)
//        print("Trust min js:")
//        print(source)
//        webview.evaluateJavaScript(source, completionHandler: {(input: Any?, err: Error?) in
//            print("Trust min js evaluated")
//                guard let i = input else {
//                    guard let e = err else {
//                        print("neither input nor err is available")
//                        return
//                    }
//                    print("err:")
//                    print(e)
//                    return
//                }
//                print("input")
//                print(i)
//        })
//        webview.evaluateJavaScript("""
//            (function() {
//            var config = {
//            address: "0xe278416fce82f2992ba7147f01d9400163738da4".toLowerCase(),
//            chainId: 237,
//            rpcUrl: "http://217.0.0.1:8545"
//            };
//            const provider = new window.Trust(config);
//            window.moac = provider;
//            window.chain3 = new window.Chain3(provider);
//            window.chain3.mc.defaultAccount = config.address;
//
//            window.chrome = {webstore: {}};
//            })();
//            """, completionHandler: {(input: Any?, err: Error?) in
//                print("moac and chain3 evaluated")
//            guard let i = input else {
//                guard let e = err else {
//                    print("neither input nor err is available")
//                    return
//                }
//                print("err:")
//                print(e)
//                return
//            }
//            print("input")
//            print(i)
//        })
        
        webview.evaluateJavaScript("(function (){return window.devicePixelRatio;})()", completionHandler: {(input: Any?, err: Error?) in
            print("window evaluated")
            guard let i = input else {
                guard let e = err else {
                    print("neither input nor err is available")
                    return
                }
                print("err:")
                print(e)
                return
            }
            print("input:")
            print(i)
        })
        
//        var providerJsBundleUrl: URL {
//            let bundlePath = Bundle.main.path(forResource: "TrustChain3Provider", ofType: "bundle")
//            let bundle = Bundle(path: bundlePath!)!
//            return bundle.url(forResource: "trust-min", withExtension: "js")!
//        }
//
//        var providerJsUrl: URL {
//            return Bundle.main.url(forResource: "trust-min", withExtension: "js", subdirectory: "dist")!
//        }
//        guard let source = try? String(contentsOf: providerJsUrl) else {
//            print("Error: source can not be converted to String.")
//            return false
//        }
        
//        webview.evaluateJavaScript(source, completionHandler: {(input: Any?, err: Error?) in
//            print("source evaluated")
//            guard let i = input else {
//                guard let e = err else {
//                    print("neither input nor err is available")
//                    return
//                }
//                print("err:")
//                print(e)
//                return
//            }
//            print("input")
//            print(i)
//        })
        
//        let address = "0xe278416fce82f2992ba7147f01d9400163738da4"
//        let chainId = 237
//        let rpcUrl = "http://127.0.0.1:8545"
        
        let setup = """

        (function() {
        var config = {
        address: "0xe278416fce82f2992ba7147f01d9400163738da4".toLowerCase(),
        chainId: 237,
        rpcUrl: "http://127.0.0.1:8545"
        };
        const provider = new window.Trust(config);
        window.moac = provider;
        window.chain3 = new window.Chain3(provider);
        window.chain3.mc.defaultAccount = config.address;

        window.chrome = {webstore: {}};
        return window.moac;
        })();
        """
        
//        source.append(contentsOf: setup)
        
        webview.evaluateJavaScript(setup, completionHandler: {(input: Any?, err: Error?) in
            print("setup evaluated")
            guard let i = input else {
                guard let e = err else {
                    print("neither input nor err is available")
                    return
                }
                print("err:")
                print(e)
                return
            }
            print("input:")
            print(i)
        })
        
        
//        source.append(contentsOf: sendMC)
        
//        print(source)

        
        
        webview.evaluateJavaScript("(function(){return JSON.stringify(window.moac);})();", completionHandler: {(input: Any?, err: Error?) in
            print("window.moac evaluated")
            guard let i = input else {
                guard let e = err else {
                    print("neither input nor err is available")
                    return
                }
                print("err:")
                print(e)
                return
            }
            print("input:")
            print(i)
        })
        
//        webview.configuration.userContentController.addUserScript(WKUserScriptConfig(
//            address: "0xe278416fce82f2992ba7147f01d9400163738da4",
//            chainId: 237,
//            rpcUrl: "127.0.0.1:8545",
//            privacyMode: false
//            ).injectedScript)
        
        let webkitMessageHandlers = """
            (function(){return JSON.stringify(window.webkit.messageHandlers);}());
        """

        webview.evaluateJavaScript(webkitMessageHandlers, completionHandler: {(input: Any?, err: Error?) in
            print("webkitMessageHandlers evaluated")
            guard let i = input else {
                guard let e = err else {
                    print("neither input nor err is available")
                    return
                }
                print("err:")
                print(e)
                return
            }
            print("input:")
            print(i)
        })
        
        let sendMC = """
            window.moac.postMessage("sendTransaction",
                237,
                {
                    from: "0xe278416fce82f2992ba7147f01d9400163738da4",
                    to: "0x668969b62624f99d64c2c8ceddfdf6b7418519e0",
                    amount: 22
                }
            );
        """
        
        webview.evaluateJavaScript(sendMC, completionHandler: {(input: Any?, err: Error?) in
            print("sendMC evaluated")
            guard let i = input else {
                guard let e = err else {
                    print("neither input nor err is available")
                    return
                }
                print("err:")
                print(e)
                return
            }
            print("input:")
            print(i)
        })
        
        textField.resignFirstResponder()
        return true
    }
}

extension DAppWebViewController: WKScriptMessageHandler {
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        let json = message.json
        print(json)
        guard let name = json["name"] as? String,
            let method = DAppMethod(rawValue: name),
            let id = json["id"] as? Int64 else { return }
        switch method {
        case .requestAccounts:
            let alert = UIAlertController(
                title: webview.title,
                message: "\(webview.url?.host! ?? "Website") would like to connect your account",
                preferredStyle: .alert
            )
            let address = scriptConfig.address
            alert.addAction(UIAlertAction(title: "Cancel", style: .destructive, handler: { [weak webview] _ in
                webview?.evaluateJavaScript("window.ethereum.sendError(\(id), \"Canceled\")", completionHandler: nil)
            }))
            alert.addAction(UIAlertAction(title: "Connect", style: .default, handler: { [weak webview] _ in
                webview?.evaluateJavaScript("window.ethereum.setAddress(\"\(address)\");", completionHandler: nil)
                webview?.evaluateJavaScript("window.ethereum.sendResponse(\(id), [\"\(address)\"])", completionHandler: nil)
            }))
            present(alert, animated: true, completion: nil)
        case .sendTransaction:
            guard let inputMap = json["object"] as? [String : Any] else {
                print("ERROR: message.body not converted to dict")
                return
            }
            guard let sendingAddrString = inputMap["from"] as? String else {
                print("ERROR: 'from' not converted to String")
                return
            }
            guard let receivingAddrString = inputMap["to"] as? String else {
                print("ERROR: 'to' not converted to String")
                return
            }
//            guard let data = inputMap["data"] as? String else {
//                print("ERROR: 'data' not converted to String")
//            }
            guard let amount = inputMap["amount"] as? Int64 else {
                print("ERROR: 'amount' not converted to String")
                return
            }
            let url = URL(string: "http://127.0.0.1:8545")!  // private vnode rpc url to connect
            if let p = Chain3HttpProvider(url, network: NetworkId(rawValue: BigUInt(id)), keystoreManager: nil) {
                let chain3 = Chain3(provider: p)
                let fromAddr = Address(sendingAddrString)
                let passwordString = "1111"
                _ = try? chain3.personal.unlockAccount(account: fromAddr, password: passwordString)
                let gasPrice = try? chain3.mc.getGasPrice()
                let sendToAddress = Address(receivingAddrString)
                let intermediate = try? chain3.mc.sendMC(to: sendToAddress, amount: BigUInt(amount))
                var options = Chain3Options.default
                options.from = fromAddr
                options.gasPrice = gasPrice
                let result = try! intermediate?.sendPromise(options: options).wait()
                print("result:")
                print(result!)
            } else {
                // Handle error
            }
            
        default:
            break
        }
    }
}
