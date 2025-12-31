// --- DOM Elements ---
const productListDiv = document.getElementById('product-list');
const addProductBtn = document.getElementById('addProductBtn');
const generateInvoiceBtn = document.getElementById('generateInvoiceBtn');
const invoiceTemplateDiv = document.getElementById('invoice-template');
const saveAsImageBtn = document.getElementById('saveAsImageBtn');
const saveAsPdfBtn = document.getElementById('saveAsPdfBtn');

// --- Company Constants ---
const COMPANY_NAME = "Mahin's Classroom";
const COMPANY_LOGO = "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgw_5wvBB4GUpJ3a2QyLxt_YwpHOlB0fU_RTJIlGqYZqGDmvgDvMlURYvgbI6hdiWbU3JhMkUNUUA35xydMa7pe5UVdf6IoIiuW0fGVHS-gez2ckD-ij8wdF_2l-Qz846Ct59hVD1z6aBPMxJty5xXPcykITtVrTPYiyIIk9qaWIHNwZ-KQ27T-h0-ClUI/s1600/%E0%A6%B6%E0%A6%BF%E0%A6%96%E0%A7%8B%20%E0%A6%8F%E0%A6%AC%E0%A6%82%20%E0%A6%85%E0%A6%A8%E0%A7%8D%E0%A6%AC%E0%A7%87%E0%A6%B7%E0%A6%A3%20%E0%A6%95%E0%A6%B0%E0%A7%8B_20260101_024044_0000.png";
const COMPANY_LOCATION = "Sadar, Mymensingh";
const COMPANY_PHONE = "01931923910";
const COMPANY_EMAIL = "maahin728@gmail.com";
const CURRENCY = "৳"; // Bangladeshi Taka symbol

// --- Functions for Product Management ---

/**
 * Creates an HTML element for a single product row input.
 */
function createProductRow() {
    const row = document.createElement('div');
    row.classList.add('product-row');
    row.innerHTML = `
        <input type="text" placeholder="Product/Service Description" class="product-name" required>
        <input type="number" placeholder="Qty" class="product-qty" min="1" value="1" required>
        <input type="number" placeholder="Price (${CURRENCY})" class="product-price" min="0" required>
        <button type="button" class="remove-product-btn">X</button>
    `;

    // Add event listener to remove the row
    row.querySelector('.remove-product-btn').addEventListener('click', () => {
        row.remove();
        // Check if all rows are removed, and add one back if so
        if (productListDiv.children.length === 0) {
            addProductRow();
        }
    });

    return row;
}

function addProductRow() {
    productListDiv.appendChild(createProductRow());
}

// Initialize with one product row
addProductRow();

// Event listener for "Add Product" button
addProductBtn.addEventListener('click', addProductRow);

// --- Core Invoice Generation Logic ---

function generateInvoiceTemplate() {
    const customerName = document.getElementById('customerName').value.trim();
    const customerPhone = document.getElementById('customerPhone').value.trim();
    const paymentMethod = document.getElementById('paymentMethod').value;
    const transactionId = document.getElementById('transactionId').value.trim();

    if (!customerName || !customerPhone || productListDiv.children.length === 0) {
        alert("Please fill in Customer Name, Phone Number, and at least one Product detail.");
        return;
    }

    const products = [];
    let subTotal = 0;

    // 1. Collect Product Data and Calculate Subtotal
    const productRows = productListDiv.querySelectorAll('.product-row');
    productRows.forEach(row => {
        const name = row.querySelector('.product-name').value.trim();
        const qty = parseInt(row.querySelector('.product-qty').value);
        const price = parseFloat(row.querySelector('.product-price').value);
        
        if (name && qty > 0 && price >= 0) {
            const total = qty * price;
            subTotal += total;
            products.push({ name, qty, price: price.toFixed(2), total: total.toFixed(2) });
        }
    });

    if (products.length === 0) {
        alert("Please enter valid details for at least one product.");
        return;
    }

    // 2. Define Summary Calculations (Example: 0% Tax, 0 BDT Discount for simplicity)
    const taxRate = 0.00; // 0%
    const taxAmount = subTotal * taxRate;
    const discount = 0.00;
    const grandTotal = subTotal + taxAmount - discount;

    const invoiceNumber = 'INV-' + new Date().getTime().toString().slice(-6);
    const invoiceDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    // 3. Construct the Invoice HTML
    let itemsTable = products.map((item, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${item.name}</td>
            <td class="text-center">${item.qty}</td>
            <td class="text-right">${CURRENCY} ${item.price}</td>
            <td class="text-right">${CURRENCY} ${item.total}</td>
        </tr>
    `).join('');

    const templateHTML = `
        <div class="invoice-header">
            <div class="company-info">
                <img src="${COMPANY_LOGO}" alt="${COMPANY_NAME} Logo">
                <h1>${COMPANY_NAME}</h1>
            </div>
            <div class="invoice-meta">
                <div class="invoice-title">INVOICE</div>
                <div class="invoice-number">Invoice No: <strong>${invoiceNumber}</strong></div>
                <div class="invoice-date">Date: <strong>${invoiceDate}</strong></div>
            </div>
        </div>

        <div class="invoice-details">
            <div class="customer-details">
                <strong>BILL TO:</strong>
                <p>
                    ${customerName}<br>
                    Phone: ${customerPhone}<br>
                </p>
            </div>
            <div class="company-contact">
                <strong>FROM:</strong>
                <p>
                    ${COMPANY_NAME}<br>
                    Location: ${COMPANY_LOCATION}<br>
                    Phone: ${COMPANY_PHONE}<br>
                    Email: ${COMPANY_EMAIL}
                </p>
            </div>
        </div>

        <div class="invoice-items">
            <table>
                <thead>
                    <tr>
                        <th style="width: 5%;">#</th>
                        <th style="width: 50%;">Description</th>
                        <th style="width: 15%;" class="text-center">Qty</th>
                        <th style="width: 15%;" class="text-right">Unit Price</th>
                        <th style="width: 15%;" class="text-right">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsTable}
                </tbody>
            </table>
        </div>

        <div class="invoice-summary">
            <div class="summary-box">
                <div class="summary-row"><span>Subtotal:</span><span>${CURRENCY} ${subTotal.toFixed(2)}</span></div>
                <div class="summary-row"><span>Discount:</span><span>${CURRENCY} ${discount.toFixed(2)}</span></div>
                <div class="summary-row"><span>Tax (${(taxRate * 100).toFixed(0)}%):</span><span>${CURRENCY} ${taxAmount.toFixed(2)}</span></div>
                <div class="summary-row"><span>GRAND TOTAL:</span><span>${CURRENCY} ${grandTotal.toFixed(2)}</span></div>
            </div>
        </div>

        <div class="invoice-footer">
            <div class="payment-info">
                <strong>Payment Method:</strong> ${paymentMethod}
                ${transactionId ? ` | <strong>Transaction ID:</strong> ${transactionId}` : ''}
            </div>
            <p>Thank you for your business with ${COMPANY_NAME}!</p>
        </div>
    `;

    // 4. Render and Enable Export Buttons
    invoiceTemplateDiv.innerHTML = templateHTML;
    saveAsImageBtn.disabled = false;
    saveAsPdfBtn.disabled = false;
}

// Event listener for "Generate Invoice" button
generateInvoiceBtn.addEventListener('click', generateInvoiceTemplate);

// --- Export Functions ---

/**
 * Saves the invoice as an image (PNG). Requires html2canvas library.
 */
saveAsImageBtn.addEventListener('click', () => {
    html2canvas(invoiceTemplateDiv, { scale: 2, logging: false }).then(canvas => {
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = `Invoice_${document.getElementById('customerName').value || 'New'}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }).catch(error => {
        console.error("Image generation failed:", error);
        alert("Could not generate image. Check console for details.");
    });
});


/**
 * Saves the invoice as a PDF. Requires jsPDF and html2canvas.
 */
saveAsPdfBtn.addEventListener('click', () => {
    // We use html2canvas to render the HTML, then jsPDF to create the document
    const { jsPDF } = window.jspdf;
    
    html2canvas(invoiceTemplateDiv, { scale: 2, logging: false }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4'); // 'p' for portrait, 'mm' for units, 'a4' size
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 295; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        // If content is longer than one page, add new pages
        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        pdf.save(`Invoice_${document.getElementById('customerName').value || 'New'}.pdf`);
    }).catch(error => {
        console.error("PDF generation failed:", error);
        alert("Could not generate PDF. Check console for details.");
    });
});
