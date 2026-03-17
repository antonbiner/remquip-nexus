import type { Order, Customer } from "@/types/admin";

// ─── BILINGUAL TRANSLATIONS ───

export type InvoiceLanguage = "en" | "fr";

const translations = {
  en: {
    invoice: "INVOICE",
    invoiceNumber: "Invoice #",
    date: "Date",
    dueDate: "Due Date",
    billTo: "Bill To",
    shipTo: "Ship To",
    item: "Item",
    description: "Description",
    sku: "SKU",
    qty: "Qty",
    unitPrice: "Unit Price",
    amount: "Amount",
    subtotal: "Subtotal",
    tax: "Tax (GST/HST)",
    shipping: "Shipping",
    discount: "Discount",
    total: "Total",
    paymentMethod: "Payment Method",
    paymentTerms: "Payment Terms",
    paymentStatus: "Payment Status",
    orderNumber: "Order #",
    purchaseOrder: "PO #",
    thankYou: "Thank you for your business!",
    remittanceInfo: "Remittance Information",
    bankName: "Bank",
    accountNumber: "Account #",
    transitNumber: "Transit #",
    institutionNumber: "Institution #",
    wireTransfer: "Wire Transfer Details",
    creditCard: "Credit Card",
    bankTransfer: "Bank Transfer",
    invoicePayment: "Invoice (Net Terms)",
    paid: "Paid",
    pending: "Pending",
    failed: "Failed",
    refunded: "Refunded",
    net30: "Net 30 Days",
    net60: "Net 60 Days",
    net90: "Net 90 Days",
    dueOnReceipt: "Due on Receipt",
    notes: "Notes",
    questions: "Questions? Contact us at",
    page: "Page",
    of: "of",
    generated: "Generated on",
    companyInfo: {
      name: "REMQUIP Inc.",
      address: "123 Industrial Blvd",
      city: "Montreal, QC H1A 2B3",
      country: "Canada",
      phone: "+1 (514) 555-0123",
      email: "billing@remquip.ca",
      website: "www.remquip.ca",
      taxId: "GST/HST: 123456789 RT0001",
    },
    bankDetails: {
      bankName: "National Bank of Canada",
      accountNumber: "1234567890",
      transitNumber: "12345",
      institutionNumber: "006",
    },
  },
  fr: {
    invoice: "FACTURE",
    invoiceNumber: "Facture #",
    date: "Date",
    dueDate: "Date d'échéance",
    billTo: "Facturer à",
    shipTo: "Livrer à",
    item: "Article",
    description: "Description",
    sku: "SKU",
    qty: "Qté",
    unitPrice: "Prix unitaire",
    amount: "Montant",
    subtotal: "Sous-total",
    tax: "Taxes (TPS/TVH)",
    shipping: "Livraison",
    discount: "Remise",
    total: "Total",
    paymentMethod: "Mode de paiement",
    paymentTerms: "Conditions de paiement",
    paymentStatus: "Statut du paiement",
    orderNumber: "Commande #",
    purchaseOrder: "BC #",
    thankYou: "Merci pour votre confiance!",
    remittanceInfo: "Informations de paiement",
    bankName: "Banque",
    accountNumber: "Compte #",
    transitNumber: "Transit #",
    institutionNumber: "Institution #",
    wireTransfer: "Détails du virement",
    creditCard: "Carte de crédit",
    bankTransfer: "Virement bancaire",
    invoicePayment: "Facture (Termes nets)",
    paid: "Payé",
    pending: "En attente",
    failed: "Échoué",
    refunded: "Remboursé",
    net30: "Net 30 jours",
    net60: "Net 60 jours",
    net90: "Net 90 jours",
    dueOnReceipt: "Payable à réception",
    notes: "Notes",
    questions: "Questions? Contactez-nous à",
    page: "Page",
    of: "de",
    generated: "Généré le",
    companyInfo: {
      name: "REMQUIP Inc.",
      address: "123 Boul. Industriel",
      city: "Montréal, QC H1A 2B3",
      country: "Canada",
      phone: "+1 (514) 555-0123",
      email: "facturation@remquip.ca",
      website: "www.remquip.ca",
      taxId: "TPS/TVH: 123456789 RT0001",
    },
    bankDetails: {
      bankName: "Banque Nationale du Canada",
      accountNumber: "1234567890",
      transitNumber: "12345",
      institutionNumber: "006",
    },
  },
};

// ─── HELPER FUNCTIONS ───

function formatCurrency(amount: number, currency: string = "CAD"): string {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: currency,
  }).format(amount);
}

function formatDate(dateString: string, lang: InvoiceLanguage): string {
  return new Date(dateString).toLocaleDateString(lang === "fr" ? "fr-CA" : "en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getDueDate(orderDate: string, paymentTerms?: string): string {
  const date = new Date(orderDate);
  const days = paymentTerms?.includes("60") ? 60 : paymentTerms?.includes("90") ? 90 : 30;
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

function getPaymentMethodLabel(method: string, lang: InvoiceLanguage): string {
  const t = translations[lang];
  const methodMap: Record<string, string> = {
    credit_card: t.creditCard,
    bank_transfer: t.bankTransfer,
    invoice: t.invoicePayment,
    paypal: "PayPal",
  };
  return methodMap[method] || method;
}

function getPaymentStatusLabel(status: string, lang: InvoiceLanguage): string {
  const t = translations[lang];
  const statusMap: Record<string, string> = {
    paid: t.paid,
    pending: t.pending,
    failed: t.failed,
    refunded: t.refunded,
  };
  return statusMap[status] || status;
}

// ─── INVOICE HTML GENERATION ───

export interface InvoiceOptions {
  order: Order;
  customer: Customer;
  language: InvoiceLanguage;
  invoiceNumber?: string;
  notes?: string;
}

export function generateInvoiceNumber(order: Order): string {
  const date = new Date(order.createdAt);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const seq = order.orderNumber.replace(/\D/g, "").slice(-4);
  return `INV-${year}${month}-${seq}`;
}

export function generateInvoiceHTML(options: InvoiceOptions): string {
  const { order, customer, language, notes } = options;
  const t = translations[language];
  const invoiceNumber = options.invoiceNumber || generateInvoiceNumber(order);
  const dueDate = getDueDate(order.createdAt, customer.paymentTerms);

  return `
<!DOCTYPE html>
<html lang="${language}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${t.invoice} ${invoiceNumber}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      font-size: 11px;
      line-height: 1.5;
      color: #1a1a1a;
      background: #fff;
    }
    .invoice {
      max-width: 800px;
      margin: 0 auto;
      padding: 40px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 2px solid #1e3a5f;
    }
    .logo {
      font-size: 28px;
      font-weight: 700;
      color: #1e3a5f;
      letter-spacing: -1px;
    }
    .logo span {
      color: #c9a227;
    }
    .company-info {
      text-align: right;
      font-size: 10px;
      color: #666;
    }
    .company-info p {
      margin-bottom: 2px;
    }
    .invoice-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }
    .invoice-title h1 {
      font-size: 32px;
      font-weight: 700;
      color: #1e3a5f;
      letter-spacing: 2px;
    }
    .invoice-meta {
      text-align: right;
    }
    .invoice-meta p {
      margin-bottom: 4px;
    }
    .invoice-meta strong {
      color: #1e3a5f;
    }
    .addresses {
      display: flex;
      gap: 40px;
      margin-bottom: 30px;
    }
    .address-block {
      flex: 1;
    }
    .address-block h3 {
      font-size: 10px;
      font-weight: 600;
      color: #888;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 8px;
      padding-bottom: 4px;
      border-bottom: 1px solid #eee;
    }
    .address-block p {
      margin-bottom: 2px;
    }
    .address-block .company-name {
      font-weight: 600;
      font-size: 12px;
      color: #1e3a5f;
    }
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    .items-table thead {
      background: #1e3a5f;
      color: #fff;
    }
    .items-table th {
      padding: 10px 12px;
      text-align: left;
      font-weight: 600;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .items-table th.text-right {
      text-align: right;
    }
    .items-table th.text-center {
      text-align: center;
    }
    .items-table td {
      padding: 12px;
      border-bottom: 1px solid #eee;
      vertical-align: top;
    }
    .items-table td.text-right {
      text-align: right;
    }
    .items-table td.text-center {
      text-align: center;
    }
    .items-table .product-name {
      font-weight: 500;
    }
    .items-table .sku {
      font-size: 9px;
      color: #888;
      font-family: monospace;
    }
    .totals {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 30px;
    }
    .totals-table {
      width: 280px;
    }
    .totals-table tr td {
      padding: 6px 0;
    }
    .totals-table tr td:last-child {
      text-align: right;
      font-weight: 500;
    }
    .totals-table .total-row {
      border-top: 2px solid #1e3a5f;
      font-size: 14px;
      font-weight: 700;
    }
    .totals-table .total-row td {
      padding-top: 10px;
      color: #1e3a5f;
    }
    .payment-info {
      display: flex;
      gap: 40px;
      margin-bottom: 30px;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 4px;
    }
    .payment-block {
      flex: 1;
    }
    .payment-block h3 {
      font-size: 10px;
      font-weight: 600;
      color: #888;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 8px;
    }
    .payment-block p {
      margin-bottom: 4px;
    }
    .status-badge {
      display: inline-block;
      padding: 3px 10px;
      border-radius: 3px;
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
    }
    .status-paid {
      background: #d4edda;
      color: #155724;
    }
    .status-pending {
      background: #fff3cd;
      color: #856404;
    }
    .notes-section {
      margin-bottom: 30px;
      padding: 15px;
      background: #fffbeb;
      border-left: 3px solid #c9a227;
      border-radius: 0 4px 4px 0;
    }
    .notes-section h3 {
      font-size: 10px;
      font-weight: 600;
      color: #888;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 6px;
    }
    .footer {
      text-align: center;
      padding-top: 20px;
      border-top: 1px solid #eee;
      color: #888;
      font-size: 10px;
    }
    .footer .thank-you {
      font-size: 14px;
      color: #1e3a5f;
      font-weight: 600;
      margin-bottom: 10px;
    }
    @media print {
      body {
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
      }
      .invoice {
        padding: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="invoice">
    <div class="header">
      <div class="logo">REM<span>QUIP</span></div>
      <div class="company-info">
        <p><strong>${t.companyInfo.name}</strong></p>
        <p>${t.companyInfo.address}</p>
        <p>${t.companyInfo.city}</p>
        <p>${t.companyInfo.country}</p>
        <p>${t.companyInfo.phone}</p>
        <p>${t.companyInfo.email}</p>
        <p>${t.companyInfo.taxId}</p>
      </div>
    </div>

    <div class="invoice-title">
      <h1>${t.invoice}</h1>
      <div class="invoice-meta">
        <p><strong>${t.invoiceNumber}</strong> ${invoiceNumber}</p>
        <p><strong>${t.orderNumber}</strong> ${order.orderNumber}</p>
        <p><strong>${t.date}</strong> ${formatDate(order.createdAt, language)}</p>
        <p><strong>${t.dueDate}</strong> ${formatDate(dueDate, language)}</p>
      </div>
    </div>

    <div class="addresses">
      <div class="address-block">
        <h3>${t.billTo}</h3>
        <p class="company-name">${customer.companyName}</p>
        <p>${customer.firstName} ${customer.lastName}</p>
        <p>${order.billingAddress.addressLine1}</p>
        ${order.billingAddress.addressLine2 ? `<p>${order.billingAddress.addressLine2}</p>` : ""}
        <p>${order.billingAddress.city}, ${order.billingAddress.province} ${order.billingAddress.postalCode}</p>
        <p>${order.billingAddress.country}</p>
        ${customer.email ? `<p>${customer.email}</p>` : ""}
        ${customer.phone ? `<p>${customer.phone}</p>` : ""}
      </div>
      <div class="address-block">
        <h3>${t.shipTo}</h3>
        <p class="company-name">${customer.companyName}</p>
        <p>${order.shippingAddress.addressLine1}</p>
        ${order.shippingAddress.addressLine2 ? `<p>${order.shippingAddress.addressLine2}</p>` : ""}
        <p>${order.shippingAddress.city}, ${order.shippingAddress.province} ${order.shippingAddress.postalCode}</p>
        <p>${order.shippingAddress.country}</p>
      </div>
    </div>

    <table class="items-table">
      <thead>
        <tr>
          <th style="width: 45%">${t.description}</th>
          <th style="width: 15%">${t.sku}</th>
          <th class="text-center" style="width: 10%">${t.qty}</th>
          <th class="text-right" style="width: 15%">${t.unitPrice}</th>
          <th class="text-right" style="width: 15%">${t.amount}</th>
        </tr>
      </thead>
      <tbody>
        ${order.items
          .map(
            (item) => `
          <tr>
            <td>
              <div class="product-name">${item.productName}</div>
            </td>
            <td><span class="sku">${item.sku}</span></td>
            <td class="text-center">${item.quantity}</td>
            <td class="text-right">${formatCurrency(item.unitPrice, order.currency)}</td>
            <td class="text-right">${formatCurrency(item.totalPrice, order.currency)}</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>

    <div class="totals">
      <table class="totals-table">
        <tr>
          <td>${t.subtotal}</td>
          <td>${formatCurrency(order.subtotal, order.currency)}</td>
        </tr>
        <tr>
          <td>${t.tax}</td>
          <td>${formatCurrency(order.tax, order.currency)}</td>
        </tr>
        <tr>
          <td>${t.shipping}</td>
          <td>${order.shippingCost === 0 ? (language === "fr" ? "Gratuit" : "Free") : formatCurrency(order.shippingCost, order.currency)}</td>
        </tr>
        ${
          order.discount > 0
            ? `
        <tr>
          <td>${t.discount}</td>
          <td style="color: #22c55e">-${formatCurrency(order.discount, order.currency)}</td>
        </tr>
        `
            : ""
        }
        <tr class="total-row">
          <td>${t.total}</td>
          <td>${formatCurrency(order.total, order.currency)}</td>
        </tr>
      </table>
    </div>

    <div class="payment-info">
      <div class="payment-block">
        <h3>${t.paymentMethod}</h3>
        <p>${getPaymentMethodLabel(order.paymentMethod, language)}</p>
      </div>
      <div class="payment-block">
        <h3>${t.paymentStatus}</h3>
        <span class="status-badge ${order.paymentStatus === "paid" ? "status-paid" : "status-pending"}">
          ${getPaymentStatusLabel(order.paymentStatus, language)}
        </span>
      </div>
      ${
        order.paymentMethod === "bank_transfer" || order.paymentMethod === "invoice"
          ? `
      <div class="payment-block">
        <h3>${t.remittanceInfo}</h3>
        <p><strong>${t.bankName}:</strong> ${t.bankDetails.bankName}</p>
        <p><strong>${t.transitNumber}:</strong> ${t.bankDetails.transitNumber}</p>
        <p><strong>${t.institutionNumber}:</strong> ${t.bankDetails.institutionNumber}</p>
        <p><strong>${t.accountNumber}:</strong> ${t.bankDetails.accountNumber}</p>
      </div>
      `
          : ""
      }
    </div>

    ${
      notes
        ? `
    <div class="notes-section">
      <h3>${t.notes}</h3>
      <p>${notes}</p>
    </div>
    `
        : ""
    }

    <div class="footer">
      <p class="thank-you">${t.thankYou}</p>
      <p>${t.questions} ${t.companyInfo.email}</p>
      <p>${t.generated} ${formatDate(new Date().toISOString(), language)}</p>
    </div>
  </div>
</body>
</html>
`;
}

// ─── PDF GENERATION (via print) ───

export function printInvoice(options: InvoiceOptions): void {
  const html = generateInvoiceHTML(options);
  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
    };
  }
}

export function downloadInvoiceHTML(options: InvoiceOptions): void {
  const html = generateInvoiceHTML(options);
  const invoiceNumber = options.invoiceNumber || generateInvoiceNumber(options.order);
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${invoiceNumber}_${options.language.toUpperCase()}.html`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── INVOICE PREVIEW COMPONENT DATA ───

export function getInvoicePreviewData(options: InvoiceOptions) {
  const { order, customer, language } = options;
  const t = translations[language];
  const invoiceNumber = options.invoiceNumber || generateInvoiceNumber(order);
  const dueDate = getDueDate(order.createdAt, customer.paymentTerms);

  return {
    translations: t,
    invoiceNumber,
    orderNumber: order.orderNumber,
    date: formatDate(order.createdAt, language),
    dueDate: formatDate(dueDate, language),
    customer,
    billingAddress: order.billingAddress,
    shippingAddress: order.shippingAddress,
    items: order.items.map((item) => ({
      ...item,
      formattedUnitPrice: formatCurrency(item.unitPrice, order.currency),
      formattedTotal: formatCurrency(item.totalPrice, order.currency),
    })),
    subtotal: formatCurrency(order.subtotal, order.currency),
    tax: formatCurrency(order.tax, order.currency),
    shipping: order.shippingCost === 0 ? (language === "fr" ? "Gratuit" : "Free") : formatCurrency(order.shippingCost, order.currency),
    discount: order.discount > 0 ? formatCurrency(order.discount, order.currency) : null,
    total: formatCurrency(order.total, order.currency),
    paymentMethod: getPaymentMethodLabel(order.paymentMethod, language),
    paymentStatus: getPaymentStatusLabel(order.paymentStatus, language),
    isPaid: order.paymentStatus === "paid",
  };
}
