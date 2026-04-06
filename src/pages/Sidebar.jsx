import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from "@/components/ui/button" 
import { LayoutDashboard, Receipt, Settings, Users, Package, Circle } from "lucide-react"

const Sidebar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { to: "/", icon: LayoutDashboard, label: "Dashboard", color: "text-blue-500" },
    { to: "/sales-invoice", icon: Receipt, label: "Sales Invoice", color: "text-indigo-500" },
    { to: "/inventory", icon: Package, label: "Inventory", color: "text-emerald-500" },
    { to: "/customers", icon: Users, label: "Customers", color: "text-amber-500" },
  ];

  return (
    <div className="w-64 h-screen bg-white border-r border-slate-200 flex flex-col">
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <Circle className="text-white fill-white w-3 h-3" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-800">Cash<span className="text-indigo-600">FLOW</span></span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => (
          <Link key={item.to} to={item.to}>
            <Button 
              variant="ghost" 
              className={`w-full justify-start gap-3 h-11 rounded-lg transition-all ${
                isActive(item.to) 
                ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100' 
                : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <item.icon className={`w-4 h-4 ${isActive(item.to) ? 'text-indigo-600' : 'text-slate-400'}`} />
              <span className="text-sm font-semibold">{item.label}</span>
            </Button>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <Button variant="ghost" className="w-full justify-start gap-3 text-slate-500 h-11">
          <Settings className="w-4 h-4" />
          <span className="text-sm font-semibold">Settings</span>
        </Button>
      </div>
    </div>
  )
}

export default Sidebar