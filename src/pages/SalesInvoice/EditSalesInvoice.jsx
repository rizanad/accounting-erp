import React, { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
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
import { Trash2, Plus, Save, ArrowLeft } from "lucide-react"

const EditSalesInvoice = ({ invoiceId }) => {
  const [items, setItems] = useState([])
  const [voucherTerms, setVoucherTerms] = useState([])
  const [headerData, setHeaderData] = useState({})
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false)
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false)
  const [activeRowId, setActiveRowId] = useState(null)
  const [tempPriceData, setTempPriceData] = useState({ price: 0, discountPercent: 0 })

  const TERM_OPTIONS = [
    { label: 'VAT 13%', type: 'Tax', value: 0.13, isPercentage: true },
    { label: 'Service Tax 5%', type: 'Tax', value: 0.05, isPercentage: true },
    { label: 'Flat Shipping', type: 'Freight', value: 500, isPercentage: false },
    { label: 'Cash Discount', type: 'Discount', value: 1000, isPercentage: false }
  ]

  // --- FETCH DATA FROM LOCALSTORAGE ON LOAD ---
  useEffect(() => {
    const savedInvoices = JSON.parse(localStorage.getItem("salesInvoices")) || []
    const invoiceToEdit = savedInvoices.find(inv => inv.id === Number(invoiceId))

    if (invoiceToEdit) {
      setItems(invoiceToEdit.items)
      setVoucherTerms(invoiceToEdit.voucherTerms || [])
      // Set other header fields if you saved them
      setHeaderData(invoiceToEdit)
    } else {
      alert("Invoice not found!")
    }
  }, [invoiceId])

  // --- CALCULATIONS (Same logic as Add form) ---
  const totalBasic = items.reduce((sum, i) => sum + Number(i.basicAmt), 0)
  const totalVoucherTerms = voucherTerms.reduce((sum, t) => {
    const val = t.isPercentage ? (totalBasic * t.value) : Number(t.value);
    return t.type === 'Discount' ? sum - val : sum + val;
  }, 0)
  const finalTotal = totalBasic + totalVoucherTerms

  const calculateRow = (row) => {
    const discountedPrice = Number(row.price) * (1 - (Number(row.discountPercent) / 100));
    const basic = Number(row.qty) * discountedPrice;
    return { ...row, basicAmt: basic, netAmt: basic + (Number(row.itemTerm) || 0) };
  }

  const updateItemField = (id, field, value) => {
    setItems(items.map(item => item.id === id ? calculateRow({ ...item, [field]: value }) : item));
  }

  const openPriceModal = (item) => {
    setActiveRowId(item.id);
    setTempPriceData({ price: item.price, discountPercent: item.discountPercent });
    setIsPriceModalOpen(true);
  }

  const applyPriceData = () => {
    setItems(items.map(item => item.id === activeRowId ? calculateRow({ ...item, price: tempPriceData.price, discountPercent: tempPriceData.discountPercent }) : item));
    setIsPriceModalOpen(false);
  }

  // --- UPDATE LOGIC ---
  const handleUpdateInvoice = () => {
    const existing = JSON.parse(localStorage.getItem("salesInvoices")) || []
    const updatedInvoices = existing.map(inv => {
      if (inv.id === Number(invoiceId)) {
        return {
          ...inv,
          items,
          voucherTerms,
          totalBasic,
          finalTotal,
          lastModified: new Date().toISOString()
        }
      }
      return inv
    })

    localStorage.setItem("salesInvoices", JSON.stringify(updatedInvoices))
    alert("Invoice Updated Successfully!")
  }

  return (
    <div className="p-6 space-y-4 bg-[#F1F5F9] min-h-screen font-sans text-slate-900">
      
      {/* ACTION BAR */}
      <div className="flex justify-between items-center bg-brand-navy p-4 rounded-t-lg border-b-2 border-orange-400">
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="text-white hover:bg-slate-700" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <h1 className="text-md font-bold tracking-widest text-white uppercase">Edit Invoice #{invoiceId}</h1>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleUpdateInvoice} size="sm" className="bg-orange-600 hover:bg-orange-700 h-8 px-5 text-[10px] font-black shadow-lg text-white">
            <Save className="w-3 h-3 mr-2"/> UPDATE CHANGES
          </Button>
        </div>
      </div>

      {/* MASTER HEADER (Simplified for display) */}
      <Card className="rounded-none border-slate-300 shadow-sm bg-white">
        <CardContent className="p-4 grid grid-cols-4 gap-4">
           <div>
              <Label className="text-[10px] font-black text-slate-500 uppercase">Customer</Label>
              <div className="text-sm font-bold">{headerData.customer || "Walking Customer"}</div>
           </div>
           <div>
              <Label className="text-[10px] font-black text-slate-500 uppercase">Original Date</Label>
              <div className="text-sm font-bold">{headerData.date?.split('T')[0]}</div>
           </div>
        </CardContent>
      </Card>

      {/* ITEM TABLE */}
      <Card className="border-slate-300 shadow-sm rounded-sm overflow-hidden bg-white">
        <Table>
          <TableHeader className="bg-[#4e5d70]">
            <TableRow>
              <TableHead className="w-10 text-white text-[10px]">SNo</TableHead>
              <TableHead className="text-white text-[10px]">Item Description</TableHead>
              <TableHead className="text-white text-[10px] text-center">Qty</TableHead>
              <TableHead className="text-white text-[10px] text-right">Unit Price</TableHead>
              <TableHead className="text-white text-[10px] text-right">Basic Amt</TableHead>
              <TableHead className="text-white text-[10px] text-right">Net Amt</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell className="text-center text-[10px] font-bold">{index + 1}</TableCell>
                <TableCell className="p-1">
                  <Input 
                    className="h-7 text-xs" 
                    value={item.item} 
                    onChange={(e) => updateItemField(item.id, 'item', e.target.value)}
                  />
                </TableCell>
                <TableCell className="p-1">
                  <Input 
                    type="number" 
                    className="h-7 text-xs text-center" 
                    value={item.qty} 
                    onChange={(e) => updateItemField(item.id, 'qty', e.target.value)}
                  />
                </TableCell>
                <TableCell className="p-1 text-right cursor-pointer hover:text-blue-600 font-bold" onClick={() => openPriceModal(item)}>
                  {Number(item.price).toFixed(2)}
                </TableCell>
                <TableCell className="p-1 text-right text-xs font-bold bg-slate-50">
                  {item.basicAmt.toLocaleString()}
                </TableCell>
                <TableCell className="p-1 text-right text-xs font-bold text-blue-900">
                  {item.netAmt.toLocaleString()}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => setItems(items.filter(i => i.id !== item.id))}>
                    <Trash2 className="w-3 h-3 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="p-2 bg-slate-100">
          <Button variant="outline" size="sm" onClick={() => setItems([...items, { id: Date.now(), item: '', qty: 0, price: 0, discountPercent: 0, basicAmt: 0, netAmt: 0 }])}>
            <Plus className="w-3 h-3 mr-1"/> ADD ROW
          </Button>
        </div>
      </Card>

      {/* TOTALS PANEL */}
      <div className="flex justify-end">
        <Card className="w-1/2 bg-slate-800 text-white">
          <CardContent className="p-4 space-y-2">
            <div className="flex justify-between text-xs">
              <span>Basic Total:</span>
              <span>{totalBasic.toFixed(2)}</span>
            </div>
            {voucherTerms.map(term => (
              <div key={term.id} className="flex justify-between text-xs text-orange-300">
                <span className="flex items-center gap-2">
                  <Trash2 className="w-3 h-3 cursor-pointer" onClick={() => setVoucherTerms(voucherTerms.filter(t => t.id !== term.id))} />
                  {term.label}
                </span>
                <span>{(term.isPercentage ? (totalBasic * term.value) : term.value).toFixed(2)}</span>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full text-black h-7 text-[10px]" onClick={() => setIsVoucherModalOpen(true)}>Add Term</Button>
            <div className="border-t border-slate-600 pt-2 flex justify-between font-black text-lg">
              <span>Total:</span>
              <span className="text-orange-400">RS. {finalTotal.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* MODALS (Same as Add Form) */}
      <Dialog open={isPriceModalOpen} onOpenChange={setIsPriceModalOpen}>
        <DialogContent className="sm:max-w-75">
          <DialogHeader><DialogTitle>Update Price</DialogTitle></DialogHeader>
          <div className="space-y-4 p-4">
            <Input type="number" value={tempPriceData.price} onChange={(e) => setTempPriceData({...tempPriceData, price: e.target.value})} />
            <Button className="w-full" onClick={applyPriceData}>Apply</Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isVoucherModalOpen} onOpenChange={setIsVoucherModalOpen}>
         <DialogContent>
            <div className="grid grid-cols-2 gap-2">
               {TERM_OPTIONS.map((opt, i) => (
                 <Button key={i} variant="outline" onClick={() => {setVoucherTerms([...voucherTerms, {...opt, id: Date.now()}]); setIsVoucherModalOpen(false)}}>
                   {opt.label}
                 </Button>
               ))}
            </div>
         </DialogContent>
      </Dialog>
    </div>
  )
}

export default EditSalesInvoice