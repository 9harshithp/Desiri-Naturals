import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, ordersTable } from "@workspace/db";

const router: IRouter = Router();

function getHsnAndGst(categorySlug?: string, productName?: string) {
  const name = (productName || "").toLowerCase();
  const cat = (categorySlug || "").toLowerCase();

  if (name.includes("ghee")) {
    return { hsn: "04059020", gstRate: 12 };
  }
  if (name.includes("milk")) {
    return { hsn: "04012000", gstRate: 0 };
  }
  if (cat.includes("oil") || name.includes("oil")) {
    if (name.includes("groundnut")) return { hsn: "15081000", gstRate: 5 };
    if (name.includes("coconut")) return { hsn: "15131100", gstRate: 5 };
    if (name.includes("sesame")) return { hsn: "15155091", gstRate: 5 };
    if (name.includes("mustard")) return { hsn: "15149120", gstRate: 5 };
    return { hsn: "15159099", gstRate: 5 };
  }
  if (name.includes("honey")) {
    return { hsn: "04090000", gstRate: 5 };
  }
  if (name.includes("jaggery")) {
    return { hsn: "17011490", gstRate: 5 };
  }
  if (cat.includes("grains") || name.includes("flour") || name.includes("millet")) {
    return { hsn: "11010000", gstRate: 5 };
  }
  // Fresh vegetables/fruits are GST exempt in India
  return { hsn: "07099990", gstRate: 0 };
}

function numberToWords(amount: number): string {
  const units = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
  const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  function convertNumber(n: number): string {
    if (n === 0) return "";
    if (n < 10) return units[n];
    if (n < 20) return teens[n - 10];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + units[n % 10] : "");
    if (n < 1000) return units[Math.floor(n / 100)] + " Hundred" + (n % 100 !== 0 ? " and " + convertNumber(n % 100) : "");
    if (n < 100000) return convertNumber(Math.floor(n / 1000)) + " Thousand" + (n % 1000 !== 0 ? " " + convertNumber(n % 1000) : "");
    if (n < 10000000) return convertNumber(Math.floor(n / 100000)) + " Lakh" + (n % 100000 !== 0 ? " " + convertNumber(n % 100000) : "");
    return convertNumber(Math.floor(n / 10000000)) + " Crore" + (n % 10000000 !== 0 ? " " + convertNumber(n % 10000000) : "");
  }

  const rounded = Math.round(amount);
  const words = convertNumber(rounded);
  return (words ? words + " Rupees Only" : "Zero Rupees").trim();
}

router.get("/orders/:id/invoice", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    res.status(400).send("Invalid Order ID");
    return;
  }

  const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, id));
  if (!order) {
    res.status(404).send("Order not found");
    return;
  }

  const total = parseFloat(order.total);
  const items = Array.isArray(order.items) ? (order.items as any[]) : [];
  const isKarnataka = (order.deliveryAddress || "").toLowerCase().includes("karnataka") ||
                      (order.deliveryAddress || "").toLowerCase().includes("bengaluru") ||
                      (order.deliveryAddress || "").toLowerCase().includes("bangalore") ||
                      (order.deliveryAddress || "").toLowerCase().includes("mysore") ||
                      (order.deliveryAddress || "").toLowerCase().includes("mysuru");

  let totalTaxable = 0;
  let totalCgst = 0;
  let totalSgst = 0;
  let totalIgst = 0;

  const enrichedItems = items.map((item, index) => {
    const { hsn, gstRate } = getHsnAndGst(item.categorySlug, item.productName);
    const itemTotal = item.price * item.quantity;
    // Calculate reverse GST (prices are inclusive of tax)
    const taxable = gstRate > 0 ? itemTotal / (1 + gstRate / 100) : itemTotal;
    const taxAmount = itemTotal - taxable;

    totalTaxable += taxable;

    let cgst = 0;
    let sgst = 0;
    let igst = 0;

    if (isKarnataka) {
      cgst = taxAmount / 2;
      sgst = taxAmount / 2;
      totalCgst += cgst;
      totalSgst += sgst;
    } else {
      igst = taxAmount;
      totalIgst += igst;
    }

    return {
      index: index + 1,
      name: item.productName,
      unit: item.unit || "Unit",
      hsn,
      quantity: item.quantity,
      rate: (item.price / (gstRate > 0 ? 1 + gstRate / 100 : 1)).toFixed(2),
      taxable: taxable.toFixed(2),
      gstRate,
      cgst: cgst.toFixed(2),
      sgst: sgst.toFixed(2),
      igst: igst.toFixed(2),
      amount: itemTotal.toFixed(2),
    };
  });

  const invoiceNumber = `DN-2026-${String(order.id).padStart(5, "0")}`;
  const orderDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Tax Invoice - ${invoiceNumber} - Desiri Naturals</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    body { background-color: #f8fafc; padding: 30px 15px; color: #1e293b; }
    .invoice-card { max-width: 850px; margin: 0 auto; background: #fff; padding: 35px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
    .no-print-bar { max-width: 850px; margin: 0 auto 15px auto; display: flex; justify-content: space-between; align-items: center; }
    .print-btn { background: #166534; color: #fff; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; font-size: 14px; text-decoration: none; }
    .print-btn:hover { background: #14532d; }
    .header-row { display: flex; justify-content: space-between; border-bottom: 2px solid #166534; padding-bottom: 20px; margin-bottom: 20px; }
    .brand-title { font-size: 26px; font-weight: 800; color: #166534; letter-spacing: -0.5px; }
    .brand-subtitle { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #64748b; font-weight: 600; margin-top: 2px; }
    .seller-meta { font-size: 12px; color: #475569; margin-top: 8px; line-height: 1.5; }
    .invoice-meta-box { text-align: right; }
    .tax-invoice-badge { display: inline-block; background: #dcfce7; color: #166534; padding: 4px 12px; border-radius: 6px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
    .meta-line { font-size: 12px; color: #475569; line-height: 1.6; }
    .meta-line strong { color: #0f172a; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; background: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 20px; font-size: 12px; line-height: 1.6; border: 1px solid #edf2f7; }
    .section-title { font-weight: 700; color: #166534; margin-bottom: 4px; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 11px; }
    th { background: #166534; color: #fff; padding: 8px; text-align: left; font-weight: 600; }
    td { padding: 9px 8px; border-bottom: 1px solid #e2e8f0; color: #334155; }
    tr:nth-child(even) { background-color: #fdfdfd; }
    .text-right { text-align: right; }
    .text-center { text-align: center; }
    .totals-area { display: flex; justify-content: space-between; gap: 30px; margin-top: 15px; padding-top: 15px; border-top: 1px solid #e2e8f0; }
    .words-box { flex: 1; font-size: 12px; color: #475569; background: #f8fafc; padding: 12px; border-radius: 8px; border: 1px dashed #cbd5e1; }
    .summary-box { width: 320px; font-size: 12px; }
    .summary-line { display: flex; justify-content: space-between; padding: 4px 0; color: #475569; }
    .summary-line.grand-total { border-top: 2px solid #166534; margin-top: 8px; padding-top: 8px; font-weight: 800; font-size: 16px; color: #166534; }
    .footer-notes { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: flex-end; font-size: 11px; color: #64748b; }
    .fssai-pill { display: inline-flex; align-items: center; gap: 6px; background: #f1f5f9; padding: 4px 10px; border-radius: 6px; font-weight: 600; color: #334155; margin-top: 6px; }
    .signature-area { text-align: right; }
    .sig-img { font-style: italic; font-weight: 700; color: #1e3a29; font-size: 16px; margin-bottom: 4px; font-family: Georgia, serif; }

    @media print {
      body { background: #fff; padding: 0; }
      .no-print-bar { display: none; }
      .invoice-card { box-shadow: none; border: none; padding: 0; }
    }
  </style>
</head>
<body>

  <div class="no-print-bar">
    <div style="font-size: 13px; color: #64748b;">
      Tax Invoice for Order #<strong>${order.id}</strong>
    </div>
    <div>
      <button class="print-btn" onclick="window.print()">
        🖨️ Print or Save as PDF
      </button>
    </div>
  </div>

  <div class="invoice-card">
    <!-- Header -->
    <div class="header-row">
      <div>
        <div class="brand-title">DESIRI NATURALS</div>
        <div class="brand-subtitle">Bull-Driven Pure & Farm-Fresh Essentials</div>
        <div class="seller-meta">
          <strong>Desiri Naturals Private Limited</strong><br>
          Sy No. 42/1, Mysore-Nanjangud Heritage Corridor, Mysuru, KA - 570025<br>
          <strong>GSTIN:</strong> 29AAACD4829E1Z8 | <strong>State:</strong> Karnataka (Code 29)<br>
          <div class="fssai-pill">🌿 FSSAI Lic. No: 11221334000192</div>
        </div>
      </div>
      <div class="invoice-meta-box">
        <div class="tax-invoice-badge">Original Tax Invoice</div>
        <div class="meta-line"><strong>Invoice No:</strong> ${invoiceNumber}</div>
        <div class="meta-line"><strong>Invoice Date:</strong> ${orderDate}</div>
        <div class="meta-line"><strong>Order ID:</strong> #${order.id}</div>
        <div class="meta-line"><strong>Payment Mode:</strong> ${(order.paymentMethod || "UPI").toUpperCase()}</div>
        <div class="meta-line"><strong>Delivery Slot:</strong> ${order.deliverySlot || "Standard Express"}</div>
      </div>
    </div>

    <!-- Bill To / Ship To -->
    <div class="info-grid">
      <div>
        <div class="section-title">Billed & Shipped To:</div>
        <strong style="font-size: 13px; color: #0f172a;">${order.customerName || "Valued Customer"}</strong><br>
        📞 ${order.customerPhone || "N/A"}<br>
        📍 ${order.deliveryAddress || "Home Delivery"}<br>
        <strong>Place of Supply:</strong> ${isKarnataka ? "Karnataka (29)" : "Inter-State"}
      </div>
      <div>
        <div class="section-title">Logistics & Farm Dispatch:</div>
        <strong>Dispatch Hub:</strong> Desiri Heritage Groves (Mother Unit)<br>
        <strong>Cold-Chain Guarantee:</strong> 100% Raw Unrefined (Pressing Temp &lt; 35°C)<br>
        <strong>Delivery Promise:</strong> ${order.deliveryDate || "Within 24 Hours"}
      </div>
    </div>

    <!-- Line Items Table -->
    <table>
      <thead>
        <tr>
          <th class="text-center" style="width: 30px;">#</th>
          <th>Description of Natural Produce</th>
          <th class="text-center">HSN</th>
          <th class="text-center">Qty</th>
          <th class="text-right">Unit Rate (₹)</th>
          <th class="text-right">Taxable (₹)</th>
          <th class="text-center">GST</th>
          ${isKarnataka ? '<th class="text-right">CGST (₹)</th><th class="text-right">SGST (₹)</th>' : '<th class="text-right">IGST (₹)</th>'}
          <th class="text-right">Total (₹)</th>
        </tr>
      </thead>
      <tbody>
        ${enrichedItems
          .map(
            (item) => `
          <tr>
            <td class="text-center">${item.index}</td>
            <td>
              <strong>${item.name}</strong>
              <div style="font-size: 10px; color: #64748b;">Packing: ${item.unit}</div>
            </td>
            <td class="text-center font-mono">${item.hsn}</td>
            <td class="text-center font-semibold">${item.quantity}</td>
            <td class="text-right">${item.rate}</td>
            <td class="text-right">${item.taxable}</td>
            <td class="text-center font-semibold">${item.gstRate}%</td>
            ${
              isKarnataka
                ? `<td class="text-right">${item.cgst}</td><td class="text-right">${item.sgst}</td>`
                : `<td class="text-right">${item.igst}</td>`
            }
            <td class="text-right font-bold">${item.amount}</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>

    <!-- Totals & Words -->
    <div class="totals-area">
      <div class="words-box">
        <div style="font-weight: 700; margin-bottom: 4px; color: #166534;">Total Amount in Words:</div>
        <div>${numberToWords(total)}</div>
        <div style="margin-top: 10px; font-size: 11px; color: #64748b; line-height: 1.4;">
          <strong>Purity Certification:</strong> All bull-driven oils extracted using indigenous Indian cattle at 2-3 RPM in wooden expellers. No synthetic bleaching, no hexane, no mineral oils.
        </div>
      </div>
      <div class="summary-box">
        <div class="summary-line">
          <span>Total Taxable Value:</span>
          <span>₹${totalTaxable.toFixed(2)}</span>
        </div>
        ${
          isKarnataka
            ? `
          <div class="summary-line">
            <span>CGST Total:</span>
            <span>₹${totalCgst.toFixed(2)}</span>
          </div>
          <div class="summary-line">
            <span>SGST Total:</span>
            <span>₹${totalSgst.toFixed(2)}</span>
          </div>
        `
            : `
          <div class="summary-line">
            <span>IGST Total:</span>
            <span>₹${totalIgst.toFixed(2)}</span>
          </div>
        `
        }
        <div class="summary-line">
          <span>Shipping & Farm Freight:</span>
          <span style="color: #166534; font-weight: 600;">FREE</span>
        </div>
        <div class="summary-line grand-total">
          <span>Grand Total (INR):</span>
          <span>₹${total.toFixed(2)}</span>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer-notes">
      <div>
        <div>This is a computer generated tax invoice in compliance with Section 31 of CGST Act 2017.</div>
        <div>Customer Helpline: <strong>+91 99000 88222</strong> | <strong>support@desirinaturals.com</strong></div>
      </div>
      <div class="signature-area">
        <div class="sig-img">Desiri Naturals Pvt Ltd</div>
        <div style="font-weight: 600;">Authorized Signatory</div>
      </div>
    </div>
  </div>

</body>
</html>`;

  res.setHeader("Content-Type", "text/html");
  res.send(html);
});

export default router;
