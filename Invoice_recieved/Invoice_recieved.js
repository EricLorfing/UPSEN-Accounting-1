function getClients() {
  return JSON.parse(localStorage.getItem('clients') || '[]');
}

function getClientById(id) {
  const clients = getClients();
  return clients.find(c => c.id === id);
}

function seedClients() {
  if (!localStorage.getItem('clients')) {
    const clients = [
      { id: '1', name: 'Material de Oficina AG' },
      { id: '2', name: 'Servicios IT GmbH' },
      { id: '3', name: 'Proveedor Eléctrico AG' }
    ];
    localStorage.setItem('clients', JSON.stringify(clients));
  }
}

const btnFilter = document.getElementById('filterBtn');
const filterCard = document.getElementById('filterCard');

btnFilter.addEventListener('click', () => {
  filterCard.classList.toggle('d-none');
});

const btnNewInvoice = document.getElementById('newInvoiceBtn');
btnNewInvoice.addEventListener('click', () => {
  const modal = new bootstrap.Modal(document.getElementById('modalNewInvoice'));
  modal.show();
});

const btnNewInvoiceOCR = document.getElementById('newInvoiceOCRBtn');
btnNewInvoiceOCR.addEventListener('click', () => {
  const modal = new bootstrap.Modal(document.getElementById('modalNewInvoiceOCR'));
  modal.show();
});

document.getElementById('saveInvoiceBtn').addEventListener('click', () => {
  const form = document.getElementById('formNewInvoice');
  const formData = new FormData(form);

  let inv = {};
  formData.forEach((value, key) => {
    inv[key] = value;
  });

  if (inv.supplier) {
    inv.clienteId = inv.supplier;
    delete inv.supplier;
  }

  let invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
  invoices.push(inv);
  localStorage.setItem('invoices', JSON.stringify(invoices));

  updateTable();

  bootstrap.Modal.getInstance(document.getElementById('modalNewInvoice')).hide();
  form.reset();
});

document.getElementById('saveOCRBtn').addEventListener('click', () => {
  const form = document.getElementById('formOCRInvoice');
  const fileInput = form.elements['ocrFile'];
  const file = fileInput.files[0];

  if (!file) {
    alert('Please select a file');
    return;
  }

  let invoices = JSON.parse(localStorage.getItem('invoices') || '[]');

  invoices.push({
    invoiceNumber: 'OCR-' + Date.now(),
    date: new Date().toISOString().split('T')[0],
    clienteId: '1',
    amount: 0,
    ocrFileName: file.name
  });

  localStorage.setItem('invoices', JSON.stringify(invoices));

  updateTable();

  bootstrap.Modal.getInstance(document.getElementById('modalNewInvoiceOCR')).hide();
  form.reset();
});

document.getElementById('downloadPDFBtn').addEventListener('click', () => {
  alert('Download as PDF - Not implemented yet');
});

document.getElementById('applyFilter').addEventListener('click', () => {
  updateTable();
  filterCard.classList.add('d-none');
});

function updateTable() {
  const tbody = document.getElementById('invoiceTbody');
  let invoices = JSON.parse(localStorage.getItem('invoices') || '[]');

  tbody.innerHTML = '';

  if (invoices.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="text-center text-muted">
          There are no invoices for the selected period.<br>
          You can change the period using the selector on the top right.
        </td>
      </tr>`;
    return;
  }

  invoices.forEach(inv => {
    const tr = document.createElement('tr');

    const client = getClientById(inv.clienteId);
    const clientName = client ? client.name : 'Sin cliente';

    tr.innerHTML = `
      <td>${inv.invoiceNumber || ''}</td>
      <td>${inv.state || ''}</td>
      <td>${inv.invoiceDate || inv.date || ''}</td>
      <td>${clientName}</td>
      <td>${inv.amount || ''}</td>
    `;

    tbody.appendChild(tr);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  seedClients();
  updateTable();
});
