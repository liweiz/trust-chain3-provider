#
# Be sure to run `pod lib lint TrustChain3Provider.podspec' to ensure this is a
# valid spec before submitting.
#
# Any lines starting with a # are optional, but their use is encouraged
# To learn more about a Podspec see http://guides.cocoapods.org/syntax/podspec.html
#
# Modifications copyright © 2019 Liwei Zhang. All rights reserved.
#

Pod::Spec.new do |s|
  s.name             = 'TrustChain3Provider'
  s.version          = '0.1.0'
  s.summary          = 'Chain3 javascript wrapper provider for iOS and Android platforms.'

  s.description      = <<-DESC
  Chain3 javascript wrapper provider for iOS and Android platforms.
  The magic behind the dApps browsers
                       DESC

  s.homepage         = 'https://github.com/liweiz/trust-chain3-provider'
  s.license          = { :type => 'MIT', :file => 'LICENSE' }
  s.author           = { 'Liwei Zhang' => 'liweiz' }
  s.source           = { :git => 'https://github.com/liweiz/trust-chain3-provider.git' }

  s.ios.deployment_target = '8.0'

  s.resource_bundles = {
    'TrustChain3Provider' => ['dist/trust-min.js']
  }
end
