import { Routes, Route } from "react-router-dom"

import Sidebar from "./pages/Sidebar"

import Dashboard from "./pages/Dashboard"

import Customers from "./pages/Customers"

import Inventory from "./pages/Inventory"

import AddSalesInvoice from "./pages/SalesInvoice/AddSalesInvoice"

import SalesInvoice from "./pages/SalesInvoice"
import { Toaster } from "sonner"

function App() {
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <main className="flex-1 bg-slate-50/50">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/sales-invoice" element={<SalesInvoice />} />
          {/* Add these two for Sales Invoices */}
          <Route path="/sales-invoice/add" element={<AddSalesInvoice />} />
  <Route path="/sales-invoice/edit/:id" element={<AddSalesInvoice />} />
          
          <Route path="/customers" element={<Customers/>} />
          <Route path="/inventory" element={<Inventory/>} />
          <Route path="*" element={<div>Page Not Found</div>} />
        </Routes>
      </main>
        <Toaster position="top-right" richColors closeButton />
    </div>
  )
}

export default App