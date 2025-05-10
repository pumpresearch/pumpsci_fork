"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { fetchTokenListings, TokenListing, SocialCause } from '@/services/blockchain';
import Link from 'next/link';

// Filter options
const causeFilters = ['All', 'Environmental', 'Educational', 'Healthcare', 'Food Security'];
const sortOptions = ['Newest', 'Highest Volume', 'Price: High to Low', 'Price: Low to High'];

export function TokenListings() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeSort, setActiveSort] = useState('Newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [tokens, setTokens] = useState<TokenListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTokens = async () => {
      try {
        setLoading(true);
        const tokenData = await fetchTokenListings();
        setTokens(tokenData);
        setError(null);
      } catch (err) {
        console.error('Error loading tokens:', err);
        setError('Failed to load token listings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadTokens();
  }, []);

  // Filter tokens based on selected filter and search query
  const filteredTokens = tokens.filter((token) => {
    const matchesFilter = activeFilter === 'All' || token.cause === activeFilter;
    const matchesSearch = 
      token.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  // Sort tokens based on selected sort option
  const sortedTokens = [...filteredTokens].sort((a, b) => {
    switch (activeSort) {
      case 'Highest Volume':
        return b.volume - a.volume;
      case 'Price: High to Low':
        return b.price - a.price;
      case 'Price: Low to High':
        return a.price - b.price;
      case 'Newest':
      default:
        // Assuming the mock data is already sorted by newest
        return 0;
    }
  });

  return (
    <div className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 dark:text-gray-100">
            Trending Memecoins with Purpose
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover tokens that are making a positive impact while offering trading opportunities.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="w-full md:w-1/3">
            <Input
              type="text"
              placeholder="Search tokens..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="flex flex-wrap gap-2 justify-center">
            {causeFilters.map((filter) => (
              <Button
                key={filter}
                variant={activeFilter === filter ? "default" : "outline"}
                onClick={() => setActiveFilter(filter)}
                className={`${
                  activeFilter === filter
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-green-900'
                }`}
                size="sm"
              >
                {filter}
              </Button>
            ))}
          </div>
          
          <div className="w-full md:w-auto">
            <select
              value={activeSort}
              onChange={(e) => setActiveSort(e.target.value)}
              className="w-full md:w-auto px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {sortOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-lg text-center my-6">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredTokens.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 mb-4">No tokens found matching your criteria.</p>
            <Button 
              variant="outline" 
              onClick={() => {
                setActiveFilter('All');
                setSearchQuery('');
              }}
              className="text-green-600 border-green-600 hover:bg-green-50 dark:text-green-400 dark:border-green-400 dark:hover:bg-green-900/30"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Token List */}
        {!loading && !error && filteredTokens.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedTokens.map((token) => (
              <div
                key={token.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">{token.name}</h3>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{token.symbol}</span>
                    </div>
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                      {token.cause}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {token.description}
                  </p>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Price</p>
                      <p className="text-lg font-bold text-gray-800 dark:text-gray-100">
                        ${token.price.toFixed(6)}
                        <span className={`text-xs ml-1 ${token.priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {token.priceChange >= 0 ? '+' : ''}{token.priceChange}%
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Volume (24h)</p>
                      <p className="text-lg font-bold text-gray-800 dark:text-gray-100">${token.volume.toLocaleString()}</p>
                    </div>
                    <Link href={`/token/${token.mintAddress}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-green-600 border-green-600 hover:bg-green-50 dark:text-green-400 dark:border-green-400 dark:hover:bg-green-900/30"
                      >
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* View More Button */}
        {!loading && !error && filteredTokens.length > 0 && (
          <div className="mt-10 text-center">
            <Link href="/explore">
              <Button
                variant="outline"
                className="border-green-500 text-green-600 hover:bg-green-50 dark:border-green-400 dark:text-green-400 dark:hover:bg-green-900/30"
              >
                View All Tokens
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
