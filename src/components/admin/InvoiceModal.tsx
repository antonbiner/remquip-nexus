import React, { useState } from "react";
import { X, Download, Printer, Globe, FileText } from "lucide-react";
import type { Order, Customer } from "@/types/admin";
import { 
  generateInvoiceHTML, 
  printInvoice, 
  downloadInvoiceHTML,
  generateInvoiceNumber,
  type InvoiceLanguage 
} from "@/utils/invoiceGenerator";

interface InvoiceModalProps {
  order: Order;
  customer: Customer;
  isOpen: boolean;
  onClose: () => void;
}

export default function InvoiceModal({ order, customer, isOpen, onClose }: InvoiceModalProps) {
  const [language, setLanguage] = useState<InvoiceLanguage>("en");
  const [notes, setNotes] = useState("");

  if (!isOpen) return null;

  const invoiceNumber = generateInvoiceNumber(order);

  const handlePrint = () => {
    printInvoice({ order, customer, language, invoiceNumber, notes: notes || undefined });
  };

  const handleDownload = () => {
    downloadInvoiceHTML({ order, customer, language, invoiceNumber, notes: notes || undefined });
  };

  const handlePreview = () => {
    const html = generateInvoiceHTML({ order, customer, language, invoiceNumber, notes: notes || undefined });
    const previewWindow = window.open("", "_blank");
    if (previewWindow) {
      previewWindow.document.write(html);
      previewWindow.document.close();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-background rounded-lg shadow-xl w-full max-w-lg z-10">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-accent" />
            <h2 className="font-display font-bold text-lg">Generate Invoice</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-secondary rounded-sm transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Order Info */}
          <div className="bg-secondary/50 p-3 rounded-sm">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Order</span>
              <span className="font-mono font-medium">{order.orderNumber}</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-muted-foreground">Invoice #</span>
              <span className="font-mono font-medium">{invoiceNumber}</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-muted-foreground">Customer</span>
              <span className="font-medium">{customer.companyName}</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-muted-foreground">Total</span>
              <span className="font-bold">C${order.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Language Selection */}
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-1.5">
              <Globe className="h-4 w-4" /> Language / Langue
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setLanguage("en")}
                className={`px-4 py-3 rounded-sm text-sm font-medium border transition-colors ${
                  language === "en" 
                    ? "border-accent bg-accent/10 text-accent" 
                    : "border-border hover:bg-secondary"
                }`}
              >
                <span className="text-lg mr-2">🇬🇧</span>
                English
              </button>
              <button
                onClick={() => setLanguage("fr")}
                className={`px-4 py-3 rounded-sm text-sm font-medium border transition-colors ${
                  language === "fr" 
                    ? "border-accent bg-accent/10 text-accent" 
                    : "border-border hover:bg-secondary"
                }`}
              >
                <span className="text-lg mr-2">🇫🇷</span>
                Français
              </button>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium mb-2">
              {language === "fr" ? "Notes additionnelles (optionnel)" : "Additional Notes (optional)"}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={language === "fr" 
                ? "Ajouter des notes à la facture..." 
                : "Add notes to the invoice..."
              }
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-sm text-sm bg-background outline-none focus:ring-2 focus:ring-accent resize-none"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-border flex flex-col sm:flex-row gap-2">
          <button
            onClick={handlePreview}
            className="flex-1 px-4 py-2 border border-border rounded-sm text-sm font-medium hover:bg-secondary transition-colors flex items-center justify-center gap-1.5"
          >
            <FileText className="h-4 w-4" />
            {language === "fr" ? "Aperçu" : "Preview"}
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 px-4 py-2 border border-border rounded-sm text-sm font-medium hover:bg-secondary transition-colors flex items-center justify-center gap-1.5"
          >
            <Printer className="h-4 w-4" />
            {language === "fr" ? "Imprimer" : "Print"}
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 px-4 py-2 btn-accent rounded-sm text-sm font-medium flex items-center justify-center gap-1.5"
          >
            <Download className="h-4 w-4" />
            {language === "fr" ? "Télécharger" : "Download"}
          </button>
        </div>
      </div>
    </div>
  );
}
