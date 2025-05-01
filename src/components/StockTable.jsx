import React from 'react';

const StockTable = ({ stocks, onSelectStock, selectedStock }) => {
  if (!stocks || stocks.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-500 dark:text-slate-400">No stocks found. Try adjusting your search.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
        <thead className="bg-slate-50 dark:bg-slate-700">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
              Symbol
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
              Company
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
              Price
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
              Change
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
              % Change
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
          {stocks.map((stock) => (
            <tr 
              key={stock.symbol} 
              onClick={() => onSelectStock(stock)}
              className={`hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors ${
                selectedStock && selectedStock.symbol === stock.symbol
                  ? 'bg-slate-100 dark:bg-slate-700'
                  : ''
              }`}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {stock.logo && (
                    <img
                      src={stock.logo}
                      alt={`${stock.symbol} logo`}
                      className="w-6 h-6 mr-2 rounded-full"
                      onError={(e) => {e.target.style.display = 'none'}}
                    />
                  )}
                  <div className="text-sm font-medium text-slate-900 dark:text-white">{stock.symbol}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-slate-900 dark:text-slate-200">{stock.name || stock.symbol}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-slate-900 dark:text-slate-200">${stock.price?.toFixed(2)}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className={`text-sm ${stock.change >= 0 ? 'text-success-500' : 'text-danger-500'}`}>
                  {stock.change >= 0 ? '+' : ''}{stock.change?.toFixed(2)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className={`text-sm ${stock.percentChange >= 0 ? 'text-success-500' : 'text-danger-500'}`}>
                  {stock.percentChange >= 0 ? '+' : ''}{stock.percentChange?.toFixed(2)}%
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockTable;