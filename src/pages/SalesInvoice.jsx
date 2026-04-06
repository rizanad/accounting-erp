import React, { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Trash2, Plus, Save, Printer, FileText, Calculator, Tag } from "lucide-react"

const SalesInvoice = () => {
  // --- STATE ---
  const [items, setItems] = useState([
    { id: 1, item: '', altQty: 0, altUnit: 0, qty: 0, unit: 0, price: 0, discountPercent: 0, basicAmt: 0, itemTerm: 0, netAmt: 0 }
  ])
  const [voucherTerms, setVoucherTerms] = useState([])
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false)
  
  // Price Modal State
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false)
  const [activeRowId, setActiveRowId] = useState(null)
  const [tempPriceData, setTempPriceData] = useState({ price: 0, discountPercent: 0 })

  const TERM_OPTIONS = [
    
      { label: 'VAT 13%', type: 'Tax', value: 0.13, isPercentage: true },
      { label: 'Service Tax 5%', type: 'Tax', value: 0.05, isPercentage: true },
      { label: 'Flat Shipping', type: 'Freight', value: 500, isPercentage: false },
      { label: 'Cash Discount', type: 'Discount', value: 1000, isPercentage: false },
      { label: 'Offer', type: 'Discount', value: 1000, isPercentage: false },
      { label: 'Festival Discount', type: 'Discount', value: 1000, isPercentage: false },
      { label: 'Foreign Tax', type: 'Tax', value: 0.08, isPercentage: true }, 
      { label: 'Handling Charges', type: 'Charges', value: 200, isPercentage: false } 
  ]

  // --- CALCULATIONS ---
  const totalBasic = items.reduce((sum, i) => sum + Number(i.basicAmt), 0)
  const totalVoucherTerms = voucherTerms.reduce((sum, t) => {
    const val = t.isPercentage ? (totalBasic * t.value) : Number(t.value);
    return t.type === 'Discount' ? sum - val : sum + val;
  }, 0)
  const finalTotal = totalBasic + totalVoucherTerms

  // Core Row Update Logic
  const calculateRow = (row) => {
    const discountedPrice = Number(row.price) * (1 - (Number(row.discountPercent) / 100));
    const basic = Number(row.qty) * discountedPrice;
    return {
      ...row,
      basicAmt: basic,
      netAmt: basic + Number(row.itemTerm)
    };
  }

  const updateItemField = (id, field, value) => {
    setItems(items.map(item => {
      if (item.id === id) {
        return calculateRow({ ...item, [field]: value });
      }
      return item;
    }));
  }

  // Price Modal Logic
  const openPriceModal = (item) => {
    setActiveRowId(item.id);
    setTempPriceData({ price: item.price, discountPercent: item.discountPercent });
    setIsPriceModalOpen(true);
  }

  const applyPriceData = () => {
    setItems(items.map(item => {
      if (item.id === activeRowId) {
        return calculateRow({ ...item, price: tempPriceData.price, discountPercent: tempPriceData.discountPercent });
      }
      return item;
    }));
    setIsPriceModalOpen(false);
  }

  return (
    <div className="p-6 space-y-4 bg-[#F1F5F9] min-h-screen font-sans text-slate-900">
      
      {/* ACTION BAR */}
      <div className="flex justify-between items-center bg-[#4e5d70] p-4 rounded-t-lg border-b-2 border-blue-200">
        <div className="flex items-center gap-3">
          <FileText className="text-blue-400 w-5 h-5" />
          <h1 className="text-md font-bold tracking-widest text-white uppercase">Sales Invoice Entry</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" className="bg-slate-700 text-white hover:bg-slate-600 border-none h-8 text-[10px] font-bold">
            <Printer className="w-3 h-3 mr-2"/> PRINT
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 h-8 px-5 text-[10px] font-black shadow-lg">
            <Save className="w-3 h-3 mr-2 text-white"/> 
            <span className='text-white text-xs'>SAVE</span>
          </Button>
        </div>
      </div>

      {/* MASTER HEADER */}
      <Card className="rounded-none border-slate-300 shadow-sm bg-white">
  <CardContent className="p-4 grid grid-cols-6 gap-3">
    {['Voucher No', 'Date', 'Ref Order#', 'Ref Challan#', 'Customer', 'Agent', 'Due Dates', 'Date', 'Sub Ledger', "Class", "Currency", "Rate"].map((label, index) => (
      <div key={label} className="space-y-1">
        <Label className="text-[10px] font-black text-slate-500 uppercase">{label}</Label>
        {label === 'Date' ? (
          <input type="date" className="h-8 w-full text-xs bg-slate-50 border-slate-200 focus:bg-white" />
        ) : label === 'Customer' ? (
          <select className="h-8 text-xs w-full bg-slate-50 border-slate-200 focus:bg-white">
           <option value="">Select Customer</option>
            <option value="customer1">Sita Rai</option>
            <option value="customer2">Ravi Sharma</option>
            <option value="customer3">Anita KC</option>
            <option value="customer4">Hari Prasad Shrestha</option>
            <option value="customer5">Pooja Ghimire</option>
            <option value="customer6">Bikash Thapa</option>
            <option value="customer7">Maya Gurung</option>
            <option value="customer8">Sanjay Tamang</option>
          </select>
        ) : (
          <Input className="h-8 text-xs bg-slate-50 border-slate-200 focus:bg-white" />
        )}
      </div>
    ))}
  </CardContent>
</Card>

      {/* ITEM TABLE */}
      <Card className="border-slate-300 shadow-sm rounded-sm overflow-hidden bg-white">
        <Table>
          <TableHeader className="bg-[#4e5d70]">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-10 text-center text-[10px] font-bold text-white uppercase">SNo</TableHead>
              <TableHead className="w-[25%] text-[10px] font-bold text-white border-l border-slate-500 uppercase">Item Description</TableHead>
              <TableHead className="text-[10px] font-bold text-white border-l border-slate-500 uppercase">Alt Qty</TableHead>
              <TableHead className="text-[10px] font-bold text-white border-l border-slate-500 uppercase">Alt Unit</TableHead>
              <TableHead className="text-[10px] font-bold text-white border-l border-slate-500 uppercase">Qty</TableHead>
              <TableHead className="text-[10px] font-bold text-white border-l border-slate-500 uppercase">Unit</TableHead>
              <TableHead className="text-[10px] font-bold text-white border-l border-slate-500 uppercase text-right">Unit Price</TableHead>
              <TableHead className="text-[10px] font-bold text-white border-l border-slate-500 uppercase text-right">Basic Amt</TableHead>
              <TableHead className="text-[10px] font-bold text-white border-l border-slate-500 uppercase text-right">Net Amt</TableHead>
              <TableHead className="w-10 border-l border-slate-500"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={item.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                <TableCell className="text-center text-[10px] font-black bg-slate-100 border-r border-slate-200">{index + 1}</TableCell>
                <TableCell className="p-1"><Input className="h-7 text-xs border-none shadow-none" placeholder="Enter Item..." /></TableCell>
                <TableCell className="p-1 border-l border-slate-100"><Input type="number" className="h-7 text-xs text-center border-none" value={item.altQty} onChange={(e) => updateItemField(item.id, 'altQty', e.target.value)} /></TableCell>
                <TableCell className="p-1 border-l border-slate-100"><Input type="number" className="h-7 text-xs text-center border-none" value={item.altUnit} onChange={(e) => updateItemField(item.id, 'altUnit', e.target.value)} /></TableCell>
                <TableCell className="p-1 border-l border-slate-100 bg-blue-50/30"><Input type="number" className="h-7 text-xs text-center border-none font-bold" value={item.qty} onChange={(e) => updateItemField(item.id, 'qty', e.target.value)} /></TableCell>
                <TableCell className="p-1 border-l border-slate-100"><Input type="number" className="h-7 text-xs text-center border-none" value={item.unit} onChange={(e) => updateItemField(item.id, 'unit', e.target.value)} /></TableCell>
                
                {/* Unit Price Cell - Opens Modal */}
                <TableCell className="p-1 border-l border-slate-100 bg-slate-50 cursor-pointer hover:bg-blue-100 transition-colors" onClick={() => openPriceModal(item)}>
                  <div className="flex flex-col items-end pr-2">
                    <span className="text-[11px] font-bold text-blue-800">{Number(item.price).toFixed(2)}</span>
                    {item.discountPercent > 0 && <span className="text-[8px] text-red-500 font-bold">-{item.discountPercent}% OFF</span>}
                  </div>
                </TableCell>

                <TableCell className="p-1 border-l border-slate-100 bg-slate-100 text-right text-xs font-black px-3 tabular-nums">
                  {item.basicAmt.toLocaleString(undefined, {minimumFractionDigits: 2})}
                </TableCell>
                <TableCell className="p-1 border-l border-slate-100 text-right text-[11px] font-black pr-4 text-blue-900 bg-blue-50/50">
                  {item.netAmt.toLocaleString(undefined, {minimumFractionDigits: 2})}
                </TableCell>
                <TableCell className="p-1 text-center border-l border-slate-100">
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500 hover:bg-red-50" onClick={() => setItems(items.filter(i => i.id !== item.id))} disabled={items.length === 1}><Trash2 className="w-3 h-3" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="p-2 border-t border-slate-300 bg-slate-100">
          <Button variant="outline" size="sm" className="h-7 text-[10px] font-black bg-white border-slate-400" onClick={() => setItems([...items, { id: Date.now(), item: '', altQty: 0, altUnit: 0, qty: 0, unit: 0, price: 0, discountPercent: 0, basicAmt: 0, itemTerm: 0, netAmt: 0 }])}>
            <Plus className="w-3 h-3 mr-1"/> ADD ROW 
          </Button>
        </div>
      </Card>

      {/* FOOTER AREA */}
      <div className="grid grid-cols-2 gap-6 mt-2 items-start">
        <div className="space-y-2 bg-white p-4 border border-slate-300 rounded shadow-sm">
          <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Remarks</Label>
          <Textarea className="min-h-[80px] text-xs border-slate-200 bg-slate-50 focus:bg-white" />
          <br />
          <div>Stock Qty :</div>
          <div>Total Qty :</div>
        </div>

        <Card className="bg-[#E2E8F0] border-slate-400 shadow-inner rounded-sm">
          <CardContent className="p-4 space-y-3">
            <div className="flex justify-between items-center text-[11px] font-bold text-slate-600 uppercase">
              <span>Basic Amount Total:</span>
              <span className="text-sm text-slate-900 tabular-nums">{totalBasic.toFixed(2)}</span>
            </div>

            <div className="space-y-1">
              {voucherTerms.map(term => (
                <div key={term.id} className="flex justify-between items-center text-[10px] bg-white p-1.5 border border-slate-300 rounded shadow-sm">
                  <span className="flex items-center gap-2 font-bold text-blue-800 uppercase">
                    <Trash2 className="w-3 h-3 cursor-pointer text-red-400" onClick={() => setVoucherTerms(voucherTerms.filter(t => t.id !== term.id))} />
                    {term.label}
                  </span>
                  <span className="font-black tabular-nums">
                    {term.type === 'Discount' ? '-' : '+'} 
                    {(term.isPercentage ? (totalBasic * term.value) : term.value).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <Button variant="outline" size="sm" onClick={() => setIsVoucherModalOpen(true)} className="w-full text-[10px] font-black h-8 border-2 border-slate-400 text-slate-700 bg-slate-50 uppercase">
               Voucher Term
            </Button>

            <div className="border-t border-slate-400 pt-2 flex justify-between items-end">
              <span className="text-[11px] font-black text-slate-800 uppercase tracking-tighter">Total Net Amount:</span>
              <span className="text-xl font-black text-[#1E293B] tabular-nums tracking-tighter">
                RS. {finalTotal.toLocaleString(undefined, {minimumFractionDigits: 2})}
              </span>
            </div>
            
            <div className="bg-[#1E293B] text-white p-3 rounded shadow-md border-l-4 border-blue-500">
              <span className="text-[9px] font-black text-blue-300 block mb-1 uppercase tracking-widest text-center">Currency: NPR | Exch Rate: 1.00</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* --- PRICE & DISCOUNT MODAL --- */}
      <Dialog open={isPriceModalOpen} onOpenChange={setIsPriceModalOpen}>
        <DialogContent className="sm:max-w-[350px] p-0 border-none overflow-hidden rounded-lg shadow-2xl">
          <DialogHeader className="bg-[#1E293B] p-4 text-white">
            <DialogTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
              <Calculator className="w-4 h-4 text-blue-400" /> Item Price Setup
            </DialogTitle>
          </DialogHeader>
          <div className="p-6 bg-slate-50 space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-slate-500">Standard Unit Price</Label>
              <div className="relative">
                <Input type="number" className="pl-8 font-bold border-slate-300" value={tempPriceData.price} onChange={(e) => setTempPriceData({...tempPriceData, price: e.target.value})} />
                <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">RS</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-slate-500">Row Discount (%)</Label>
              <div className="relative">
                <Input type="number" className="pl-8 font-bold border-slate-300 text-red-600" value={tempPriceData.discountPercent} onChange={(e) => setTempPriceData({...tempPriceData, discountPercent: e.target.value})} />
                <Tag className="absolute left-3 top-2.5 w-3 h-3 text-red-400" />
              </div>
            </div>
            <Button onClick={applyPriceData} className="w-full bg-blue-600 hover:bg-blue-700 font-black uppercase text-xs h-10 mt-2">
              Update Row Amount
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* --- VOUCHER TERM MODAL --- */}
      <Dialog open={isVoucherModalOpen} onOpenChange={setIsVoucherModalOpen}>
        <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none rounded-lg">
          <DialogHeader className="bg-[#1E293B] p-4 text-white">
            <DialogTitle className="text-[10px] font-black uppercase tracking-widest">Select Global Voucher Term</DialogTitle>
          </DialogHeader>
          <div className="p-6 bg-slate-100 grid grid-cols-2 gap-3">
            {TERM_OPTIONS.map((option, idx) => (
              <button key={idx} onClick={() => { setVoucherTerms([...voucherTerms, { ...option, id: Date.now() }]); setIsVoucherModalOpen(false); }} className="flex flex-col items-start p-3 bg-white border border-slate-300 rounded hover:border-blue-500 transition-all text-left">
                <span className="text-[9px] font-black text-slate-400 uppercase">{option.type}</span>
                <span className="text-xs font-bold text-slate-800">{option.label}</span>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

    </div>
  )
}

export default SalesInvoice