import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { StockTable, StockChart, SearchBar, ErrorMessage, LoadingSpinner } from './components';

function App() {
  const [stocks, setStocks] = useState([]);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStock, setSelectedStock] = useState(null);

  // Default stocks to display
  const stockSymbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'TSLA', 'NVDA', 'NFLX'];

  useEffect(() => {
    const fetchStockData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Using Finnhub API with key from environment variables
        const API_KEY = import.meta.env.VITE_FINNHUB_API_KEY;
        
        // Fetch data for each stock symbol
        const stockPromises = stockSymbols.map(async (symbol) => {
          const quoteResponse = await axios.get(
            `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`
          );
          
          const profileResponse = await axios.get(
            `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${API_KEY}`
          );
          
          const quoteData = quoteResponse.data;
          const profileData = profileResponse.data;
          
          return {
            symbol,
            name: profileData.name || symbol,
            price: quoteData.c,
            previousClose: quoteData.pc,
            change: quoteData.c - quoteData.pc,
            percentChange: ((quoteData.c - quoteData.pc) / quoteData.pc) * 100,
            high: quoteData.h,
            low: quoteData.l,
            logo: profileData.logo || null,
          };
        });
        
        const stocksData = await Promise.all(stockPromises);
        setStocks(stocksData);
        setFilteredStocks(stocksData);
        
        // Set initial selected stock
        if (stocksData.length > 0) {
          setSelectedStock(stocksData[0]);
        }
      } catch (err) {
        console.error('Error fetching stock data:', err);
        setError('Failed to fetch stock data. Please check your API key or try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, []);

  // Handle search functionality
  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      setFilteredStocks(stocks);
      return;
    }
    
    const filtered = stocks.filter(stock => 
      stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (stock.name && stock.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    setFilteredStocks(filtered);
  };

  // Handle stock selection for chart display
  const handleSelectStock = (stock) => {
    setSelectedStock(stock);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Stock Dashboard</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Real-time stock price monitoring
          </p>
        </header>
        
        {error ? (
          <ErrorMessage message={error} />
        ) : loading ? (
          <LoadingSpinner />
        ) : (
          <div className="space-y-8">
            <SearchBar onSearch={handleSearch} />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
                <StockTable 
                  stocks={filteredStocks} 
                  onSelectStock={handleSelectStock}
                  selectedStock={selectedStock}
                />
              </div>
              
              {selectedStock && (
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                  <StockChart stock={selectedStock} />
                </div>
              )}
            </div>
          </div>
        )}
        
        <footer className="mt-16 text-center text-sm text-slate-500 dark:text-slate-400">
          <p>Created with React, Vite, and Tailwind CSS</p>
          <p className="mt-1">Data provided by Finnhub API</p>
        </footer>
      </div>
    </div>
  );
}

export default App;