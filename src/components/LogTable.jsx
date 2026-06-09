import { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { typeLabels } from '../data/labels';
import { LOGS_PER_PAGE } from '../data/constants';

const LogTable = ({ logs, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = LOGS_PER_PAGE;
  
  const totalPages = Math.ceil(logs.length / itemsPerPage);
  
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (totalPages === 0 && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [logs.length, totalPages, currentPage]);

  const paginatedLogs = logs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden flex flex-col">
      <div className="px-6 py-5 border-b border-slate-800 bg-slate-800/20 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-100">Log History</h2>
        <div className="text-sm text-slate-400">
          Total Entries: <span className="text-slate-200 font-medium">{logs.length}</span>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <caption className="sr-only">Full activity log history</caption>
          <thead className="bg-slate-800/50 text-xs uppercase font-medium text-slate-400">
            <tr>
              <th scope="col" className="px-6 py-4">Date</th>
              <th scope="col" className="px-6 py-4">Category</th>
              <th scope="col" className="px-6 py-4">Type</th>
              <th scope="col" className="px-6 py-4 text-right">Quantity</th>
              <th scope="col" className="px-6 py-4 text-right">CO₂ (kg)</th>
              <th scope="col" className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {paginatedLogs.map(log => (
              <tr key={log.id} className="hover:bg-slate-800/30 transition-colors group">
                <td className="px-6 py-4 whitespace-nowrap text-slate-400">{log.date}</td>
                <td className="px-6 py-4 whitespace-nowrap capitalize font-medium text-slate-200">{log.category}</td>
                <td className="px-6 py-4 whitespace-nowrap">{typeLabels[log.type] || log.type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-slate-300">{log.quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right font-mono font-medium text-emerald-400">
                  {log.kgCO2.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <button
                    onClick={() => onDelete(log.id)}
                    className="text-slate-500 hover:text-red-400 transition-all"
                    title="Delete log"
                    aria-label="Delete log"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between bg-slate-800/10 mt-auto">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-800 border border-slate-700 rounded-md hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <span className="text-sm text-slate-400">
            Page <span className="font-medium text-slate-200">{currentPage}</span> of <span className="font-medium text-slate-200">{totalPages}</span>
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-800 border border-slate-700 rounded-md hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default LogTable;
