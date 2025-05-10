import React from 'react';
import { fetchTokenByMint, fetchTokenTransactions } from '@/services/blockchain';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// Define the props for the page component
interface TokenDetailPageProps {
  params: {
    mintAddress: string;
  };
}

export default async function TokenDetailPage({ params }: TokenDetailPageProps) {
  const { mintAddress } = params;
  
  // Fetch token data and transactions
  const token = await fetchTokenByMint(mintAddress);
  const transactions = await fetchTokenTransactions(mintAddress);
  
  // If token not found, show error
  if (!token) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-6 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Token Not Found</h2>
          <p className="mb-6">The token with mint address {mintAddress} could not be found.</p>
          <Link href="/">
            <Button variant="outline" className="text-red-600 border-red-600">
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-green-50 dark:from-amber-950 dark:to-green-950 py-16">
      <div className="container mx-auto px-4">
        {/* Token Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                {token.name} <span className="text-xl text-gray-500 dark:text-gray-400">({token.symbol})</span>
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Mint Address: <span className="font-mono">{token.mintAddress.substring(0, 8)}...{token.mintAddress.substring(token.mintAddress.length - 8)}</span>
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="px-4 py-2 text-sm font-medium rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                {token.cause}
              </span>
              <Link href={`https://dexscreener.com/solana/${token.mintAddress}`} target="_blank">
                <Button variant="outline" size="sm" className="text-gray-600 dark:text-gray-400">
                  DEX Screener
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Token Info & Social Impact */}
          <div className="lg:col-span-1 space-y-8">
            {/* Token Description */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">About {token.name}</h2>
              <p className="text-gray-600 dark:text-gray-400">
                {token.description}
              </p>
            </div>
            
            {/* Social Impact Details */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Social Impact</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-700 dark:text-gray-300">Initiative</h3>
                  <p className="text-gray-600 dark:text-gray-400">{token.cause}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-700 dark:text-gray-300">Impact Metrics</h3>
                  <div className="mt-2 p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Total Fees Collected</span>
                      <span className="font-medium text-gray-800 dark:text-gray-200">${(token.volume * 0.01).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Fees to Social Causes</span>
                      <span className="font-medium text-gray-800 dark:text-gray-200">${(token.volume * 0.005).toFixed(2)}</span>
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
                    Funds from this token have been allocated to support various {token.cause.toLowerCase()} initiatives, including community projects and sustainable development programs.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column: Trading Interface & Transactions */}
          <div className="lg:col-span-2 space-y-8">
            {/* Trading Interface */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Trading Interface</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Current Price</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    ${token.price.toFixed(6)}
                    <span className={`text-sm ml-2 ${token.priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {token.priceChange >= 0 ? '+' : ''}{token.priceChange}%
                    </span>
                  </p>
                </div>
                
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">24h Volume</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    ${token.volume.toLocaleString()}
                  </p>
                </div>
              </div>
              
              {/* Bonding Curve Visualization */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Bonding Curve</h3>
                <div className="h-12 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-amber-500" 
                    style={{ width: '65%' }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">0%</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">65% Complete</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">100%</span>
                </div>
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
            
            {/* Transaction History */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Recent Transactions</h2>
              
              {transactions.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">No transactions found for this token.</p>
              ) : (
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
                      {transactions.map((tx) => (
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
                              {tx.amount.toLocaleString()} {token.symbol}
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
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
