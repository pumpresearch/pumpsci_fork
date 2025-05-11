import React from 'react';
import TokenHeader from '@/components/token/TokenHeader';
import GeckoTerminalChart from '@/components/token/GeckoTerminalChart';
import BondingCurveVisualization from '@/components/token/BondingCurveVisualization';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ArtTokenTestPage() {
  // ART token data
  // Mint address: 56dS3NpxdCD5f8Nn8zzUFsZRLvhTe9wxNxucUpedrugt
  const artToken = {
    name: "Art Protocol",
    symbol: "ART",
    mintAddress: "56dS3NpxdCD5f8Nn8zzUFsZRLvhTe9wxNxucUpedrug",
    cause: "Creative Economy",
    description: "Art Protocol is a Solana-based token that supports artists and creators in the digital economy. It aims to provide sustainable funding for creative projects and initiatives.",
    price: 0.0245,
    priceChange: 3.2,
    volume: 125000,
    transactions: [
      {
        signature: "5xUvDFxvSZkABQxYEdDVNhpB7sQQGkUPNM5tz3n4aNmDLXQwmwLcVmxmKKRfLmDKcULYy6vkBdYxmSEFV9d9i5Th",
        amount: 1000,
        timestamp: new Date().getTime() - 3600000,
        transactionLink: "https://explorer.solana.com/tx/5xUvDFxvSZkABQxYEdDVNhpB7sQQGkUPNM5tz3n4aNmDLXQwmwLcVmxmKKRfLmDKcULYy6vkBdYxmSEFV9d9i5Th"
      },
      {
        signature: "4xGHj7VrDWZQbs9qqXbDqfLmVGWDBwmPiRukQBnAhXYA6ZYDxBnvQJnNrxKzuPfHYtpuKjKJ4JYKmA",
        amount: 500,
        timestamp: new Date().getTime() - 7200000,
        transactionLink: "https://explorer.solana.com/tx/4xGHj7VrDWZQbs9qqXbDqfLmVGWDBwmPiRukQBnAhXYA6ZYDxBnvQJnNrxKzuPfHYtpuKjKJ4JYKmA"
      }
    ]
  };

  // Bonding curve completion percentage (mock data for ART token)
  const bondingCurvePercentage = 78;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-green-50 dark:from-amber-950 dark:to-green-950 py-16">
      <div className="container mx-auto px-4">
        {/* Token Header */}
        <TokenHeader
          name={artToken.name}
          symbol={artToken.symbol}
          mintAddress={artToken.mintAddress}
          cause={artToken.cause}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Token Info & Social Impact */}
          <div className="lg:col-span-1 space-y-8">
            {/* Token Description */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-amber-200 dark:border-green-800">
              <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">About {artToken.name}</h2>
              <p className="text-gray-600 dark:text-gray-400">
                {artToken.description}
              </p>
            </div>
            
            {/* Social Impact Details */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-amber-200 dark:border-green-800">
              <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Social Impact</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-700 dark:text-gray-300">Initiative</h3>
                  <p className="text-gray-600 dark:text-gray-400">{artToken.cause}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-700 dark:text-gray-300">Impact Metrics</h3>
                  <div className="mt-2 p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Total Fees Collected</span>
                      <span className="font-medium text-gray-800 dark:text-gray-200">${(artToken.volume * 0.01).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Fees to Creative Causes</span>
                      <span className="font-medium text-gray-800 dark:text-gray-200">${(artToken.volume * 0.005).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Impact Percentage</span>
                      <span className="font-medium text-gray-800 dark:text-gray-200">50%</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-700 dark:text-gray-300">Recent Updates</h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Funds from this token have been allocated to support various creative economy initiatives, including digital art projects, creator grants, and sustainable funding models for artists.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column: Trading Interface & Transactions */}
          <div className="lg:col-span-2 space-y-8">
            {/* Price Chart with GeckoTerminal Integration - Using real ART token address */}
            <GeckoTerminalChart 
              mintAddress={artToken.mintAddress}
              symbol={artToken.symbol}
              height="400px"
            />
            
            {/* Trading Interface */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-amber-200 dark:border-green-800">
              <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Trade {artToken.symbol}</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-amber-50 dark:bg-green-900/20 rounded-lg border border-amber-200 dark:border-green-800">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Current Price</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    ${artToken.price.toFixed(4)}
                    <span className={`text-sm ml-2 ${artToken.priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {artToken.priceChange >= 0 ? '+' : ''}{artToken.priceChange}%
                    </span>
                  </p>
                </div>
                
                <div className="p-4 bg-amber-50 dark:bg-green-900/20 rounded-lg border border-amber-200 dark:border-green-800">
                  <p className="text-sm text-gray-500 dark:text-gray-400">24h Volume</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    ${artToken.volume.toLocaleString()}
                  </p>
                </div>
              </div>
              
              {/* Enhanced Bonding Curve Visualization */}
              <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg border border-amber-200 dark:border-green-800">
                <BondingCurveVisualization 
                  completionPercentage={bondingCurvePercentage} 
                  tokenSymbol={artToken.symbol}
                />
              </div>
              
              {/* Buy/Sell Interface */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Amount to Buy
                  </label>
                  <div className="flex">
                    <input 
                      type="number" 
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="0.00"
                    />
                    <Button className="rounded-l-none bg-green-500 hover:bg-green-600">
                      Buy
                    </Button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Amount to Sell
                  </label>
                  <div className="flex">
                    <input 
                      type="number" 
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="0.00"
                    />
                    <Button className="rounded-l-none bg-red-500 hover:bg-red-600">
                      Sell
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* External Links */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-amber-200 dark:border-green-800">
              <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">External Resources</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link 
                  href={`https://dexscreener.com/solana/${artToken.mintAddress}`} 
                  target="_blank"
                  className="flex items-center justify-between p-4 bg-amber-50 dark:bg-green-900/20 rounded-lg border border-amber-200 dark:border-green-800 hover:bg-amber-100 dark:hover:bg-green-900/40 transition-colors"
                >
                  <span className="font-medium text-gray-700 dark:text-gray-300">DEX Screener</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </Link>
                
                <Link 
                  href={`https://explorer.solana.com/address/${artToken.mintAddress}`} 
                  target="_blank"
                  className="flex items-center justify-between p-4 bg-amber-50 dark:bg-green-900/20 rounded-lg border border-amber-200 dark:border-green-800 hover:bg-amber-100 dark:hover:bg-green-900/40 transition-colors"
                >
                  <span className="font-medium text-gray-700 dark:text-gray-300">Solana Explorer</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </Link>
              </div>
            </div>
            
            {/* Transaction History */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-amber-200 dark:border-green-800">
              <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Recent Transactions</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Transaction</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {artToken.transactions.map((tx) => (
                      <tr key={tx.signature} className="border-b border-gray-200 dark:border-gray-700">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <a 
                            href={tx.transactionLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            {tx.signature.substring(0, 8)}...{tx.signature.substring(tx.signature.length - 8)}
                          </a>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="font-medium text-gray-800 dark:text-gray-200">
                            {tx.amount.toLocaleString()} {artToken.symbol}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-gray-500 dark:text-gray-400">
                          {new Date(tx.timestamp).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
