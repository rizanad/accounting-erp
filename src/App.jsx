import { Routes, Route } from "react-router-dom"
import Sidebar from "./pages/Sidebar"
import SalesInvoice from "./pages/SalesInvoice"
import Dashboard from "./pages/Dashboard"
import Customers from "./pages/Customers"
import Inventory from "./pages/Inventory"



function App() {
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />

      <main className="flex-1 bg-slate-50/50">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/sales-invoice" element={<SalesInvoice />} />
          <Route path="/customers" element={<Customers/>} />
          <Route path="/inventory" element={<Inventory/>} />
          
          <Route path="*" element={<div>Page Not Found</div>} />
        </Routes>
      </main>
    </div>
  )
}

export default App