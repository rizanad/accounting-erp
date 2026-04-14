import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil } from "lucide-react";

const DataTable = ({ onEdit, refreshKey }) => {
  const [invoices, setInvoices] = useState([]);

  // Reload data whenever the component mounts or the refreshKey changes
  useEffect(() => {
    loadInvoices();
  }, [refreshKey]);

  const loadInvoices = () => {
    const data = JSON.parse(localStorage.getItem("salesInvoices")) || [];
    // Sorting by date (newest first) makes the table more usable
    const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date));
    setInvoices(sortedData);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      const updated = invoices.filter((inv) => inv.id !== id);
      localStorage.setItem("salesInvoices", JSON.stringify(updated));
      setInvoices(updated);
    }
  };

  return (
    <div className="bg-white overflow-hidden">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-100 border-b border-slate-300 text-slate-700 uppercase text-[11px] font-bold">
          <tr>
            <th className="p-3 text-center w-12">SN</th>
            <th className="p-3">Date</th>
            <th className="p-3">Invoice ID</th>
            <th className="p-3">Items</th>
            <th className="p-3 text-right">Basic Amount</th>
            <th className="p-3 text-right">Total Amount</th>
            <th className="p-3 text-center">Action</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-200">
          {invoices.map((inv, index) => (
            <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
              <td className="p-3 text-center font-medium text-slate-500">{index + 1}</td>
              <td className="p-3 whitespace-nowrap">
                {new Date(inv.date).toLocaleDateString(undefined, {
                   year: 'numeric',
                   month: 'short',
                   day: 'numeric'
                })}
              </td>
              <td className="p-3 font-mono text-xs text-blue-600">
                #{inv.id.toString().slice(-6)} {/* Displaying last 6 digits of ID */}
              </td>
              <td className="p-3">
                <span className="bg-slate-100 px-2 py-1 rounded text-[10px] font-bold">
                  {inv.items?.length || 0} ITEMS
                </span>
              </td>
              <td className="p-3 text-right tabular-nums">
                {Number(inv.totalBasic || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </td>
              <td className="p-3 text-right font-bold text-slate-900 tabular-nums">
                {Number(inv.finalTotal || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </td>
              <td className="p-3 flex gap-2 justify-center">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  onClick={() => onEdit(inv)} // This triggers the navigate to /edit/:id
                >
                  <Pencil className="w-4 h-4" />
                </Button>

                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={() => handleDelete(inv.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </td>
            </tr>
          ))}

          {invoices.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center py-20 text-slate-400 italic">
                No invoices found in local storage.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;