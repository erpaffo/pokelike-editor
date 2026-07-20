require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const Stripe = require('stripe');

const app = express();
app.use(cors());

// Se non è fornita, usiamo un fallback per evitare crash in fase di test
const stripe = Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock'); 
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_mock';

const DB_PATH = path.join(__dirname, 'licenses.json');

// Assicura che il DB esista
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
  return 'PRO-' + crypto.randomBytes(4).toString('hex').toUpperCase() + '-' + crypto.randomBytes(4).toString('hex').toUpperCase();
}

// ── STRIPE WEBHOOK (DEVE ESSERE PRIMA DI express.json) ───────────────────────

app.post('/webhook/stripe', express.raw({type: 'application/json'}), (request, response) => {
  const sig = request.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Gestione del pagamento completato
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const accountId = session.client_reference_id; // Leggiamo l'ID Account da Stripe!

    if (accountId) {
      const code = generateLicense();
      const db = getDB();
      
      db.licenses[code] = {
        active: true,
        accountId: accountId, // Vincolo permanente automatico
        createdAt: new Date().toISOString(),
        provider: 'Stripe',
        sessionId: session.id
      };
      
      saveDB(db);
      console.log(`✅ Licenza ${code} generata con successo per l'account ${accountId}!`);
    } else {
      console.error("⚠️ Pagamento ricevuto ma nessun client_reference_id (accountId) fornito!");
    }
  }

  response.send();
});

// Da qui in poi possiamo parsare JSON
app.use(express.json());
app.use(express.static(path.join(__dirname, '../landing-page')));

// ── CHECKOUT ENDPOINT ─────────────────────────────────────────────────────────

app.post('/buy/checkout', async (req, res) => {
  const { accountId } = req.body;
  
  if (!accountId) {
    return res.status(400).json({ error: "Nessun Account ID fornito per vincolare la licenza." });
  }

  try {
    // Creazione della sessione di Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Pokélike Editor PRO (Licenza a vita)',
              description: 'Sblocca starter leggendari perfetti, manipolazione della fortuna e costo zero.',
              images: ['https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png'],
            },
            unit_amount: 299, // 2,99€
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      client_reference_id: accountId, // QUI leghiamo il pagamento all'utente!
      success_url: 'http://localhost:3000/success.html',
      cancel_url: 'http://localhost:3000/cancel.html',
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── ENDPOINT DI VERIFICA (Estensione) ───────────────────────────────────────

app.post('/verify', (req, res) => {
  const { code, accountId } = req.body;
  if (!code || !accountId) return res.status(400).json({ error: "Missing parameters" });

  const db = getDB();
  const license = db.licenses[code];

  // 1. Controllo Whitelist
  if (!license) {
    return res.status(400).json({ success: false, error: "Codice inesistente." });
  }

  if (!license.active && license.valid === false) {
    return res.status(400).json({ success: false, error: "Codice disabilitato o revocato." });
  }

  // 2. Controllo Account Vincolato
  // A differenza di prima, non ci leghiamo al primo utilizzo se è vuoto, 
  // perché ora lo leghiamo GIA' IN FASE DI ACQUISTO (Stripe Webhook o generate_codes.js).
  if (license.accountId !== accountId) {
    return res.status(400).json({ 
      success: false, 
      error: "Questo codice appartiene a un altro account Pokélike!" 
    });
  }

  // Se arriviamo qui, il codice è valido e appartiene all'account giusto
  res.json({ success: true, pro: true });
});

app.listen(3000, () => {
  console.log('Backend in esecuzione su http://localhost:3000');
});
