"use client";

import React from 'react';
import { HeroSection } from './hero-section';
import { TokenListings } from './token-listings';
import { FooterSection } from './footer-section';

export function HomeFeature() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-green-50 dark:from-amber-950 dark:to-green-950">
      <HeroSection />
      <TokenListings />
      
      {/* Social Impact Section */}
      <div className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800 dark:text-gray-100">
            How We Make a Difference
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-12">
            At Pump Charity, we redirect a significant portion of trading fees to social causes, 
            creating a positive impact with every transaction.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-green-50 dark:bg-green-900/30 p-6 rounded-xl">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100">Create</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Launch your memecoin with a purpose by selecting a social cause that matters to you.
              </p>
            </div>
            
            <div className="bg-amber-50 dark:bg-amber-900/30 p-6 rounded-xl">
              <div className="w-16 h-16 bg-amber-100 dark:bg-amber-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-600 dark:text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100">Trade</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Buy and sell tokens on our platform with the knowledge that fees support meaningful initiatives.
              </p>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-xl">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100">Impact</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Track the real-world impact of your trading activity through transparent reporting.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <FooterSection />
    </div>
  );
}
