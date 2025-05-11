import React from 'react';

interface BondingCurveVisualizationProps {
  completionPercentage: number;
  tokenSymbol: string;
}

/**
 * BondingCurveVisualization component displays a visual representation of the token's
 * bonding curve and its current position
 */
const BondingCurveVisualization: React.FC<BondingCurveVisualizationProps> = ({
  completionPercentage,
  tokenSymbol
}) => {
  // Ensure percentage is between 0 and 100
  const safePercentage = Math.min(Math.max(completionPercentage, 0), 100);
  
  // Calculate color stops for the gradient based on completion percentage
  const gradientStops = [
    { color: 'from-green-500', position: 0 },
    { color: 'via-amber-400', position: 50 },
    { color: 'to-amber-500', position: 100 }
  ];

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-gray-700 dark:text-gray-300">
          Bonding Curve
        </h3>
        <span className="text-sm font-medium px-2 py-1 bg-amber-100 dark:bg-green-900/40 text-amber-800 dark:text-green-300 rounded-full">
          {safePercentage.toFixed(1)}% Complete
        </span>
      </div>
      
      {/* Curve visualization */}
      <div className="relative">
        {/* Background curve line */}
        <svg 
          className="w-full h-16" 
          viewBox="0 0 400 100" 
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="curveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>
          
          {/* Bonding curve path */}
          <path 
            d="M0,100 Q100,100 200,50 T400,0" 
            fill="none" 
            stroke="url(#curveGradient)" 
            strokeWidth="3"
            strokeDasharray="5,5"
            opacity="0.5"
          />
          
          {/* Filled path up to current position */}
          <path 
            d={`M0,100 Q100,100 ${safePercentage * 4},${100 - safePercentage / 2}`} 
            fill="none" 
            stroke="url(#curveGradient)" 
            strokeWidth="3"
          />
          
          {/* Current position marker */}
          <circle 
            cx={safePercentage * 4} 
            cy={100 - safePercentage / 2} 
            r="6" 
            fill="#f59e0b" 
            stroke="#ffffff" 
            strokeWidth="2"
            className="animate-pulse"
          />
        </svg>
        
        {/* Price indicators */}
        <div className="flex justify-between mt-1">
          <div className="text-center">
            <div className="w-1 h-1 bg-green-500 rounded-full mx-auto mb-1"></div>
            <span className="text-xs text-gray-500 dark:text-gray-400">Min Price</span>
          </div>
          
          <div className="text-center">
            <div className="w-1 h-1 bg-amber-400 rounded-full mx-auto mb-1"></div>
            <span className="text-xs text-gray-500 dark:text-gray-400">Current</span>
          </div>
          
          <div className="text-center">
            <div className="w-1 h-1 bg-amber-500 rounded-full mx-auto mb-1"></div>
            <span className="text-xs text-gray-500 dark:text-gray-400">Max Price</span>
          </div>
        </div>
      </div>
      
      {/* Info text */}
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        {tokenSymbol} uses an automated bonding curve to determine price. As more tokens are purchased, 
        the price increases following this curve.
      </p>
    </div>
  );
};

export default BondingCurveVisualization;
