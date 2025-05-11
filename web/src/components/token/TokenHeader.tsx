import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

interface TokenHeaderProps {
  name: string;
  symbol: string;
  mintAddress: string;
  cause: string;
}

/**
 * TokenHeader component displays the header section of the coin detail page
 * including token name, symbol, mint address, and social impact badge
 */
export const TokenHeader: React.FC<TokenHeaderProps> = ({
  name,
  symbol,
  mintAddress,
  cause,
}) => {
  // Truncate mint address for display
  const truncatedAddress = `${mintAddress.substring(0, 8)}...${mintAddress.substring(
    mintAddress.length - 8
  )}`;

  return (
    <div className="bg-gradient-to-r from-amber-100 to-green-100 dark:from-amber-900/60 dark:to-green-900/60 rounded-xl shadow-lg p-6 mb-8 border border-amber-200 dark:border-green-800">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              {name}
            </h1>
            <span className="ml-2 text-xl text-gray-500 dark:text-gray-400">
              ({symbol})
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Mint Address: <span className="font-mono">{truncatedAddress}</span>
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="px-4 py-2 text-sm font-medium rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 flex items-center">
              <svg 
                className="w-4 h-4 mr-1.5" 
                fill="currentColor" 
                viewBox="0 0 20 20" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  fillRule="evenodd" 
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                  clipRule="evenodd"
                />
              </svg>
              {cause}
            </span>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white dark:border-gray-800"></div>
          </div>
          
          <Link href={`https://dexscreener.com/solana/${mintAddress}`} target="_blank">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-gray-600 dark:text-gray-400 border-amber-300 dark:border-green-800 hover:bg-amber-50 dark:hover:bg-green-900/40 flex items-center gap-1"
            >
              DEX Screener
              <ExternalLink size={14} />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TokenHeader;
