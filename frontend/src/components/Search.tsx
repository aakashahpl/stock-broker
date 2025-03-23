import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { IoSearchSharp } from "react-icons/io5";

interface StockData {
  [ticker: string]: string;
}

const Search: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [stockData, setStockData] = useState<StockData>({});
  const [filteredStocks, setFilteredStocks] = useState<[string, string][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchResultsRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch stock data from API
  useEffect(() => {
    const fetchStockData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3001/stock/all');
        
        if (!response.ok) {
          throw new Error('Failed to fetch stock data');
        }
        
        const data = await response.json();
        setStockData(data);
        setError(null);
      } catch (err) {
        setError('Error fetching stock data. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, []);

  // Debounced search function
  const debouncedSearch = useCallback(
    (query: string) => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      if (query.trim() === "") {
        setFilteredStocks([]);
        return;
      }

      searchTimeoutRef.current = setTimeout(() => {
        const lowerQuery = query.toLowerCase();
        
        // Limit to first 100 matches for performance
        const results = Object.entries(stockData)
          .filter(([ticker, name]) => 
            ticker.toLowerCase().includes(lowerQuery) || 
            name.toLowerCase().includes(lowerQuery)
          )
          .slice(0, 100);
        
        setFilteredStocks(results);
      }, 300);
    },
    [stockData]
  );

  // Update search when query changes
  useEffect(() => {
    debouncedSearch(searchQuery);
    
    // Cleanup timeout on unmount
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, debouncedSearch]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchResultsRef.current && !searchResultsRef.current.contains(event.target as Node)) {
        setFilteredStocks([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="rounded-lg">
      <div className="relative">
        <div className="flex flex-row justify-center items-center gap-2 border-[1px] border-myBorder px-4 py-1 rounded-lg">
          <IoSearchSharp size={20} />
          <input
            type="text"
            placeholder="Search for a stock..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-white bg-transparent border-myBorder focus:border-transparent outline-none w-full"
          />
        </div>

        {/* Error message */}
        {error && <div className="text-red-500 mt-2">{error}</div>}
        
        {/* Loading indicator */}
        {loading && <div className="text-gray-500 mt-2">Loading stock data...</div>}

        {/* Dropdown results with absolute positioning */}
        {filteredStocks.length > 0 && (
          <div 
            ref={searchResultsRef}
            className="absolute left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-gray-800 rounded-md shadow-lg border border-myBorder z-10"
          >
            {filteredStocks.map(([ticker, name]) => (
              <Link 
                key={ticker} 
                href={`/stock/${ticker}`}
                className="block p-3 hover:bg-gray-700 cursor-pointer border-b border-myBorder text-white"
                onClick={() => {
                  setSearchQuery(ticker);
                  setFilteredStocks([]);
                }}
              >
                <strong className="text-blue-400">{ticker}</strong>: {name}
              </Link>
            ))}
            {filteredStocks.length === 100 && (
              <div className="p-2 text-center text-gray-400 text-sm">
                Showing top 100 results. Refine your search for more specific matches.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;