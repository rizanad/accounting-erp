import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Users, Receipt, Plus, Clock, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from 'react-router-dom'

const StatCard = ({ title, value, icon: Icon, color }) => (
  <Card className="border-slate-100 shadow-sm bg-white">
    <CardContent className="p-5 flex items-center gap-4">
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{title}</p>
        <h3 className="text-xl font-black text-slate-800 tracking-tight">{value}</h3>
      </div>
    </CardContent>
  </Card>
)

const Dashboard = () => {
  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] p-6 space-y-6">
      {/* Header - Full Width Row */}
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Executive Dashboard</h1>
          <p className="text-sm text-slate-500 font-medium">Real-time accounting overview for Cashflow</p>
        </div>
        <Link to="/sales-invoice">
          <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 px-6 font-bold h-10 text-white">
            <Plus className="w-4 h-4 mr-2" /> Create Sales Invoice
          </Button>
        </Link>
      </div>

      {/* Stats Grid - Stretches to fill */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Revenue (MTD)" value="NPR 4,50,000" icon={TrendingUp} color="text-indigo-600 bg-indigo-50" />
        <StatCard title="Total Invoices" value="1,284" icon={Receipt} color="text-blue-600 bg-blue-50" />
        <StatCard title="New Customers" value="24" icon={Users} color="text-emerald-600 bg-emerald-50" />
        <StatCard title="Global Reach" value="7 Regions" icon={Globe} color="text-amber-600 bg-amber-50" />
      </div>

      {/* Main Content Area - Full Width Split */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2 border-slate-200 shadow-sm bg-white">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Recent Transactions</span>
            <Button variant="ghost" className="text-xs font-bold text-indigo-600 h-8">View Ledger</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase">
                  <th className="p-4">Customer</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Amount</th>
                  <th className="p-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-100">
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-bold text-slate-700">Sample Nepali Customer {i}</td>
                    <td className="p-4 text-slate-500 text-xs font-medium">Apr 06, 2026</td>
                    <td className="p-4 text-right font-black text-slate-800 italic">NPR 12,000.00</td>
                    <td className="p-4 text-center">
                       <span className="bg-emerald-50 text-emerald-600 text-[9px] px-2 py-1 rounded-full font-black uppercase">Cleared</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* System Logs / Quick Tips */}
        <div className="space-y-6">
          <Card className="border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Live Activity</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-indigo-500 mt-1.5 shadow-[0_0_8px_rgba(79,70,229,0.5)]" />
                  <div>
                    <p className="text-xs font-bold text-slate-700">Invoice #INV-99{i} generated</p>
                    <p className="text-[10px] text-slate-400 font-medium">3 mins ago by Admin</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          
          {/* <div className="bg-indigo-600 rounded-xl p-6 text-white shadow-xl shadow-indigo-100">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-indigo-200">System Health</p>
            <h2 className="text-xl font-bold mb-2 leading-tight">Server: Kathmandu-West</h2>
            <p className="text-xs text-indigo-100 leading-relaxed">No latency detected. Your accounting data is being synced in real-time.</p>
          </div> */}
        </div>
      </div>
    </div>
  )
}

export default Dashboard