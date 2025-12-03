import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Generate Challan/Receipt PDF
export const generateChallanPDF = async (feeData, studentInfo, type = 'unpaid') => {
  const isPaid = type === 'paid';
  
  // Create a temporary div for the challan
  const challanDiv = document.createElement('div');
  challanDiv.style.position = 'absolute';
  challanDiv.style.left = '-9999px';
  challanDiv.style.width = '794px'; // A4 width in pixels at 96 DPI
  challanDiv.style.padding = '40px';
  challanDiv.style.backgroundColor = '#ffffff';
  challanDiv.style.fontFamily = 'Arial, sans-serif';
  
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];
  
  challanDiv.innerHTML = `
    <div style="max-width: 700px; margin: 0 auto;">
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px solid ${isPaid ? '#10b981' : '#f59e0b'}; padding-bottom: 20px;">
        <div style="display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 10px;">
          <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
            <span style="color: white; font-size: 28px; font-weight: bold;">H</span>
          </div>
          <h1 style="margin: 0; font-size: 32px; font-weight: bold; color: #1f2937;">HostelAI</h1>
        </div>
        <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">Smart Hostel Management System</p>
        <p style="margin: 5px 0; color: #6b7280; font-size: 12px;">123 University Road, Islamabad, Pakistan | Phone: +92-300-1234567</p>
      </div>

      <!-- Challan Type Badge -->
      <div style="text-align: center; margin-bottom: 25px;">
        <div style="display: inline-block; padding: 12px 30px; background: ${isPaid ? '#d1fae5' : '#fef3c7'}; border-radius: 25px; border: 2px solid ${isPaid ? '#10b981' : '#f59e0b'};">
          <span style="font-size: 20px; font-weight: bold; color: ${isPaid ? '#065f46' : '#92400e'}; text-transform: uppercase; letter-spacing: 1px;">
            ${isPaid ? '✓ Payment Receipt' : '⚠ Fee Challan'}
          </span>
        </div>
      </div>

      <!-- Student & Fee Info -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; background: #f9fafb; padding: 20px; border-radius: 10px; border: 1px solid #e5e7eb;">
        <div>
          <p style="margin: 8px 0; font-size: 13px; color: #6b7280;">Student Name</p>
          <p style="margin: 8px 0; font-size: 16px; font-weight: 600; color: #111827;">${studentInfo.name}</p>
        </div>
        <div>
          <p style="margin: 8px 0; font-size: 13px; color: #6b7280;">Student ID</p>
          <p style="margin: 8px 0; font-size: 16px; font-weight: 600; color: #111827;">${studentInfo.email}</p>
        </div>
        <div>
          <p style="margin: 8px 0; font-size: 13px; color: #6b7280;">Room Number</p>
          <p style="margin: 8px 0; font-size: 16px; font-weight: 600; color: #111827;">${studentInfo.room || 'N/A'}</p>
        </div>
        <div>
          <p style="margin: 8px 0; font-size: 13px; color: #6b7280;">Fee Month</p>
          <p style="margin: 8px 0; font-size: 16px; font-weight: 600; color: #111827;">${monthNames[feeData.month - 1]} ${feeData.year}</p>
        </div>
      </div>

      <!-- Fee Breakdown Table -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
        <thead>
          <tr style="background: #f3f4f6;">
            <th style="padding: 15px; text-align: left; font-size: 14px; font-weight: 600; color: #374151; border-bottom: 2px solid #e5e7eb;">Description</th>
            <th style="padding: 15px; text-align: right; font-size: 14px; font-weight: 600; color: #374151; border-bottom: 2px solid #e5e7eb;">Amount (PKR)</th>
          </tr>
        </thead>
        <tbody>
          <tr style="background: white;">
            <td style="padding: 15px; font-size: 14px; color: #4b5563; border-bottom: 1px solid #e5e7eb;">Room Rent</td>
            <td style="padding: 15px; text-align: right; font-size: 15px; font-weight: 500; color: #111827; border-bottom: 1px solid #e5e7eb;">${feeData.roomRent?.toLocaleString() || 0}</td>
          </tr>
          <tr style="background: white;">
            <td style="padding: 15px; font-size: 14px; color: #4b5563; border-bottom: 1px solid #e5e7eb;">Mess Fee (Compulsory)</td>
            <td style="padding: 15px; text-align: right; font-size: 15px; font-weight: 500; color: #111827; border-bottom: 1px solid #e5e7eb;">${feeData.messFee?.toLocaleString() || 0}</td>
          </tr>
          <tr style="background: ${isPaid ? '#d1fae5' : '#fef3c7'};">
            <td style="padding: 18px 15px; font-size: 16px; font-weight: 700; color: #111827;">TOTAL AMOUNT</td>
            <td style="padding: 18px 15px; text-align: right; font-size: 20px; font-weight: 700; color: ${isPaid ? '#065f46' : '#92400e'};">${feeData.amount?.toLocaleString() || 0}</td>
          </tr>
        </tbody>
      </table>

      <!-- Payment Details (for paid) or Due Date (for unpaid) -->
      ${isPaid ? `
        <div style="background: #d1fae5; padding: 20px; border-radius: 8px; margin-bottom: 25px; border: 1px solid #10b981;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <div>
              <p style="margin: 5px 0; font-size: 13px; color: #065f46; font-weight: 500;">Payment Date</p>
              <p style="margin: 5px 0; font-size: 15px; color: #047857; font-weight: 600;">${new Date(feeData.paidDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <div>
              <p style="margin: 5px 0; font-size: 13px; color: #065f46; font-weight: 500;">Payment Status</p>
              <p style="margin: 5px 0; font-size: 15px; color: #047857; font-weight: 600;">✓ PAID IN FULL</p>
            </div>
          </div>
        </div>
      ` : `
        <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin-bottom: 25px; border: 1px solid #f59e0b;">
          <p style="margin: 5px 0; font-size: 13px; color: #92400e; font-weight: 500;">Due Date</p>
          <p style="margin: 5px 0; font-size: 18px; color: #b45309; font-weight: 700;">${new Date(feeData.dueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p style="margin: 10px 0 5px 0; font-size: 12px; color: #92400e;">Please pay before the due date to avoid late fees.</p>
        </div>
      `}

      <!-- Bank Details (for unpaid) -->
      ${!isPaid ? `
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 25px; border: 1px solid #e5e7eb;">
          <h3 style="margin: 0 0 15px 0; font-size: 14px; font-weight: 600; color: #374151; text-transform: uppercase;">Bank Details for Payment</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 13px;">
            <div>
              <p style="margin: 4px 0; color: #6b7280;">Bank Name:</p>
              <p style="margin: 4px 0; font-weight: 600; color: #111827;">Allied Bank Limited</p>
            </div>
            <div>
              <p style="margin: 4px 0; color: #6b7280;">Account Title:</p>
              <p style="margin: 4px 0; font-weight: 600; color: #111827;">HostelAI Management</p>
            </div>
            <div>
              <p style="margin: 4px 0; color: #6b7280;">Account Number:</p>
              <p style="margin: 4px 0; font-weight: 600; color: #111827;">0123-4567-8901-2345</p>
            </div>
            <div>
              <p style="margin: 4px 0; color: #6b7280;">Branch Code:</p>
              <p style="margin: 4px 0; font-weight: 600; color: #111827;">0123</p>
            </div>
          </div>
        </div>
      ` : ''}

      <!-- Footer -->
      <div style="text-align: center; padding-top: 20px; border-top: 2px solid #e5e7eb; margin-top: 30px;">
        <p style="margin: 5px 0; font-size: 11px; color: #9ca3af;">This is a computer-generated ${isPaid ? 'receipt' : 'challan'} and does not require a signature.</p>
        <p style="margin: 5px 0; font-size: 11px; color: #9ca3af;">For queries, contact: accounts@hostelai.com | +92-300-1234567</p>
        <p style="margin: 15px 0 5px 0; font-size: 10px; color: #d1d5db;">Generated on: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
      </div>
    </div>
  `;
  
  document.body.appendChild(challanDiv);
  
  try {
    // Convert to canvas
    const canvas = await html2canvas(challanDiv, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });
    
    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    
    // Download
    const filename = isPaid 
      ? `Receipt_${monthNames[feeData.month - 1]}_${feeData.year}.pdf`
      : `Challan_${monthNames[feeData.month - 1]}_${feeData.year}.pdf`;
    
    pdf.save(filename);
  } finally {
    document.body.removeChild(challanDiv);
  }
};
