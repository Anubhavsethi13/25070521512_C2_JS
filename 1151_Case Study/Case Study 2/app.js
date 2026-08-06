// Simple Online Shopping Bill Calculator Script

// 1. DOM Elements Cache
const elements = {
    form: document.getElementById("bill-form"),
    customerName: document.getElementById("customer-name"),
    customerMobile: document.getElementById("customer-mobile"),
    invoiceNumber: document.getElementById("invoice-number"),
    btnGenerateInv: document.getElementById("btn-generate-inv"),
    
    productName: document.getElementById("product-name"),
    productQty: document.getElementById("product-qty"),
    productRate: document.getElementById("product-rate"),
    productDiscount: document.getElementById("product-discount"),
    productGST: document.getElementById("product-gst"),
    packingCharges: document.getElementById("packing-charges"),
    
    btnClear: document.getElementById("btn-clear"),
    resultCard: document.getElementById("result-card"),
    resultPlaceholder: document.getElementById("result-placeholder"),
    resultContent: document.getElementById("result-content"),
    btnPrint: document.getElementById("btn-print"),
    
    // Receipt Bindings
    resCustName: document.getElementById("res-cust-name"),
    resCustMobile: document.getElementById("res-cust-mobile"),
    resInvNum: document.getElementById("res-inv-num"),
    resInvDate: document.getElementById("res-inv-date"),
    resProdName: document.getElementById("res-prod-name"),
    resProdMath: document.getElementById("res-prod-math"),
    resSubtotal: document.getElementById("res-subtotal"),
    resDiscPct: document.getElementById("res-disc-pct"),
    resDiscAmt: document.getElementById("res-disc-amt"),
    resTaxable: document.getElementById("res-taxable"),
    resGstPct: document.getElementById("res-gst-pct"),
    resGstAmt: document.getElementById("res-gst-amt"),
    resPacking: document.getElementById("res-packing"),
    resPayMode: document.getElementById("res-pay-mode"),
    resGrandTotal: document.getElementById("res-grand-total")
};

// 2. Invoice Generator Helper
function generateInvoiceNumber() {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const rand = String(Math.floor(Math.random() * 900) + 100);
    return `INV-${year}${month}${day}-${rand}`;
}

function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${day}/${month}/${year} ${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
}

function formatCurrency(val) {
    return `Rs. ${parseFloat(val).toFixed(2)}`;
}

// 3. Mark Field Invalid
function markField(element, isValid) {
    if (isValid) {
        element.classList.remove("input-error");
    } else {
        element.classList.add("input-error");
    }
}

// 4. Initialize System
function init() {
    // Fill initial invoice number
    const initialInv = generateInvoiceNumber();
    elements.invoiceNumber.value = initialInv;
    
    // Auto-generate invoice listener
    elements.btnGenerateInv.addEventListener("click", () => {
        elements.invoiceNumber.value = generateInvoiceNumber();
    });

    // Mobile input filtering (digits only, max 10)
    elements.customerMobile.addEventListener("input", (e) => {
        let val = e.target.value.replace(/\D/g, "");
        if (val.length > 10) val = val.substring(0, 10);
        elements.customerMobile.value = val;
    });

    // Form submission
    elements.form.addEventListener("submit", calculateBill);

    // Reset button
    elements.btnClear.addEventListener("click", resetForm);

    // Print button
    elements.btnPrint.addEventListener("click", () => {
        window.print();
    });
}

function calculateBill(e) {
    e.preventDefault();

    let isFormValid = true;

    // Retrieve input values
    const name = elements.customerName.value.trim();
    const mobile = elements.customerMobile.value.trim();
    const invoice = elements.invoiceNumber.value.trim();
    const product = elements.productName.value.trim();
    
    const qty = parseFloat(elements.productQty.value);
    const rate = parseFloat(elements.productRate.value);
    let discount = parseFloat(elements.productDiscount.value);
    let gst = parseInt(elements.productGST.value);
    let packing = parseFloat(elements.packingCharges.value);

    // Default modifiers if blank
    if (isNaN(discount) || discount < 0) discount = 0;
    if (isNaN(gst) || gst < 0) gst = 0;
    if (isNaN(packing) || packing < 0) packing = 0;

    // Field-by-field validation
    markField(elements.customerName, name.length > 0);
    markField(elements.customerMobile, mobile.length === 10);
    markField(elements.invoiceNumber, invoice.length > 0);
    markField(elements.productName, product.length > 0);
    markField(elements.productQty, !isNaN(qty) && qty > 0);
    markField(elements.productRate, !isNaN(rate) && rate > 0);
    markField(elements.productDiscount, discount >= 0 && discount <= 100);
    markField(elements.productGST, gst >= 0 && gst <= 100);
    markField(elements.packingCharges, packing >= 0);

    if (
        name.length === 0 || 
        mobile.length !== 10 || 
        invoice.length === 0 || 
        product.length === 0 || 
        isNaN(qty) || qty <= 0 || 
        isNaN(rate) || rate <= 0 || 
        discount < 0 || discount > 100 || 
        gst < 0 || gst > 100 || 
        packing < 0
    ) {
        alert("Please correct the highlighted inputs before generating the bill.");
        return;
    }

    // Mathematical Formulas
    const subtotal = qty * rate;
    const discountAmount = subtotal * (discount / 100);
    const taxable = subtotal - discountAmount;
    const gstAmount = taxable * (gst / 100);
    
    // Total calculation
    let grandTotal = taxable + gstAmount + packing;

    // Payment Mode rounding rules
    const paymentModeElement = document.querySelector('input[name="payment-mode"]:checked');
    const paymentMode = paymentModeElement ? paymentModeElement.value : "UPI";
    
    let originalGrandTotal = grandTotal;
    let isRounded = false;

    if (paymentMode === "Cash") {
        grandTotal = Math.round(grandTotal);
        isRounded = true;
    }

    // Render receipt text variables
    elements.resCustName.textContent = name;
    elements.resCustMobile.textContent = `+91 ${mobile}`;
    elements.resInvNum.textContent = invoice;
    elements.resInvDate.textContent = `Date: ${formatDate(new Date())}`;
    
    elements.resProdName.textContent = product;
    elements.resProdMath.textContent = `${qty.toFixed(2)} Kg @ ${formatCurrency(rate)}/Kg`;
    
    elements.resSubtotal.textContent = formatCurrency(subtotal);
    elements.resDiscPct.textContent = discount.toFixed(1);
    elements.resDiscAmt.textContent = formatCurrency(discountAmount);
    elements.resTaxable.textContent = formatCurrency(taxable);
    
    elements.resGstPct.textContent = gst.toString();
    elements.resGstAmt.textContent = formatCurrency(gstAmount);
    
    elements.resPacking.textContent = formatCurrency(packing);
    elements.resPayMode.textContent = paymentMode;

    if (isRounded && Math.abs(grandTotal - originalGrandTotal) > 0.001) {
        const diff = grandTotal - originalGrandTotal;
        const sign = diff >= 0 ? "+" : "";
        elements.resGrandTotal.innerHTML = `${formatCurrency(grandTotal)} <span style="font-size: 0.75rem; font-weight: normal; color: var(--text-muted);">(${sign}${diff.toFixed(2)} cash round)</span>`;
    } else {
        elements.resGrandTotal.textContent = formatCurrency(grandTotal);
    }

    // Reveal receipt details and hide placeholder
    elements.resultPlaceholder.classList.add("hidden");
    elements.resultContent.classList.remove("hidden");
    
    // Smooth scroll to display invoice details on mobile/small screens
    elements.resultCard.scrollIntoView({ behavior: "smooth" });
}

function resetForm() {
    // Clear all validation errors
    const inputs = [
        elements.customerName, elements.customerMobile, elements.invoiceNumber,
        elements.productName, elements.productQty, elements.productRate,
        elements.productDiscount, elements.productGST, elements.packingCharges
    ];
    inputs.forEach(input => input.classList.remove("input-error"));

    // Reset inputs
    elements.form.reset();
    
    // Re-generate fresh invoice code
    elements.invoiceNumber.value = generateInvoiceNumber();

    // Hide receipt details and show placeholder
    elements.resultContent.classList.add("hidden");
    elements.resultPlaceholder.classList.remove("hidden");
}

// 5. Load App
window.addEventListener("DOMContentLoaded", init);
