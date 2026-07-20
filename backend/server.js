const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../landing-page')));

const DB_PATH = path.join(__dirname, 'licenses.json');

// Assicura che il mock DB esista
if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify({ licenses: {} }, null, 2));
}

function getDB() {
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

function saveDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

function generateLicense() {
  return 'PRO-' + uuidv4().split('-')[0].toUpperCase() + '-' + Date.now().toString().slice(-4);
}

// ── ENDPOINTS DI PAGAMENTO (Mock Sandbox) ───────────────────────────────────

app.post('/buy/stripe', (req, res) => {
  // Simulazione Stripe Checkout completato con successo
  const db = getDB();
  const code = generateLicense();
  
  db.licenses[code] = {
    valid: true,
    accountId: null, // Si legherà al primo utilizzo
    createdAt: new Date().toISOString(),
    provider: 'Stripe'
  };
  
  saveDB(db);
  
  setTimeout(() => {
    res.json({ success: true, licenseCode: code, message: "Pagamento Stripe Sandbox approvato" });
  }, 1000);
});

app.post('/buy/paypal', (req, res) => {
  // Simulazione PayPal Order Capture
  const db = getDB();
  const code = generateLicense();
  
  db.licenses[code] = {
    valid: true,
    accountId: null,
    createdAt: new Date().toISOString(),
    provider: 'PayPal'
  };
  
  saveDB(db);
  
  setTimeout(() => {
    res.json({ success: true, licenseCode: code, message: "Pagamento PayPal Sandbox approvato" });
  }, 1000);
});

// ── ENDPOINT DI VERIFICA (Estensione) ───────────────────────────────────────

app.post('/verify', (req, res) => {
  const { code, accountId } = req.body;
  if (!code || !accountId) return res.status(400).json({ error: "Missing parameters" });

  const db = getDB();
  const license = db.licenses[code];

  if (!license) {
    return res.status(400).json({ success: false, error: "Codice inesistente." });
  }

  if (!license.valid) {
    return res.status(400).json({ success: false, error: "Codice disabilitato o revocato." });
  }

  if (license.accountId && license.accountId !== accountId) {
    // Il codice è già legato a un altro account
    return res.status(400).json({ 
      success: false, 
      error: "Questo codice è già in uso da un altro account Pokelike." 
    });
  }

  if (!license.accountId) {
    // Primo utilizzo, leghiamolo!
    license.accountId = accountId;
    saveDB(db);
  }

  // Se arriviamo qui, il codice è valido e appartiene all'account giusto
  res.json({ success: true, pro: true });
});

app.listen(3000, () => {
  console.log('Backend in esecuzione su http://localhost:3000');
});
