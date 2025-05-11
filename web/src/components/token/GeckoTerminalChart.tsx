import React from 'react';

interface GeckoTerminalChartProps {
  mintAddress: string;
  symbol: string;
  height?: string;
}

/**
 * GeckoTerminalChart component integrates with GeckoTerminal to display
 * price charts for Solana tokens
 */
const GeckoTerminalChart: React.FC<GeckoTerminalChartProps> = ({
  mintAddress,
  symbol,
  height = '400px'
}) => {
  // GeckoTerminal widget URL format for Solana tokens
  const geckoTerminalUrl = `https://www.geckoterminal.com/solana/pools/${mintAddress}/embed?theme=dark&info=true&swaps=true`;

  return (
    <div className="w-full rounded-xl overflow-hidden border border-amber-200 dark:border-green-800 bg-white dark:bg-gray-800">
      <div className="p-4 bg-amber-50 dark:bg-green-900/20 border-b border-amber-200 dark:border-green-800">
        <h3 className="font-medium text-gray-700 dark:text-gray-300">
          {symbol} Price Chart
        </h3>
      </div>
      <div style={{ height }}>
        <iframe
          src={geckoTerminalUrl}
          title={`${symbol} Price Chart`}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default GeckoTerminalChart;
