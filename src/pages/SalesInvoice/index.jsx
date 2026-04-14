import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Receipt, Search, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import DataTable from "./DataTable";

const SalesInvoice = () => {
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAdd = () => {
    navigate("/sales-invoice/add");
  };

  const handleEdit = (data) => {
    navigate(`/sales-invoice/edit/${data.id}`);
  };

  return (
    <div className="p-8 pt-10 bg-slate-50/50 min-h-screen">
      
      {/* 1. PAGE HEADER - Completely separate from the table */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Receipt className="w-5 h-5 text-indigo-600" />
            <h1 className="text-2xl font-bold tracking-tight text-slate-800">
              Sales Invoices
            </h1>
          </div>
          <p className="text-sm text-slate-500 font-medium">
            Manage your billing, track payments, and view invoice history.
          </p>
        </div>

        <Button
          onClick={handleAdd}
          className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 h-10 px-6"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Invoice
        </Button>
      </div>

      {/* 2. TABLE CONTAINER - Styled as a clean card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Table Toolbar (Optional but looks great) */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between gap-4 items-center">
            <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                    placeholder="Search invoices..." 
                    className="pl-9 bg-slate-50/50 border-slate-200 h-9 text-sm focus:bg-white"
                />
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-9 gap-2 text-slate-600 border-slate-200">
                    <Filter className="w-3.5 h-3.5" />
                    Filter
                </Button>
            </div>
        </div>

        {/* DATA TABLE */}
        <div className="overflow-x-auto">
          <DataTable onEdit={handleEdit} refreshKey={refreshKey} />
        </div>
      </div>

    </div>
  );
};

export default SalesInvoice;