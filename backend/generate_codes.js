const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const dbPath = path.join(__dirname, 'licenses.json');

function getDB() {
  if (!fs.existsSync(dbPath)) {
    return { licenses: {} };
  }
  return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
}

function saveDB(db) {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

function generateLicense() {
  return 'PRO-' + crypto.randomBytes(4).toString('hex').toUpperCase() + '-' + crypto.randomBytes(4).toString('hex').toUpperCase();
}

const args = process.argv.slice(2);
if (args.length < 1) {
  console.log("❌ Errore: Devi specificare l'ID Account del giocatore a cui assegnare il codice.");
  console.log("Uso: node generate_codes.js <AccountId> [Quantità]");
  console.log("Esempio: node generate_codes.js mario_rossi_123 1");
  process.exit(1);
}

const accountId = args[0];
const amount = parseInt(args[1]) || 1;

const db = getDB();

console.log(`\nGenerazione di ${amount} codici per l'account: ${accountId}...`);

const generatedCodes = [];
for (let i = 0; i < amount; i++) {
  const code = generateLicense();
  db.licenses[code] = {
    active: true,
    createdAt: new Date().toISOString(),
    accountId: accountId, // Vincolato immediatamente all'account
    type: "offline_gift"
  };
  generatedCodes.push(code);
}

saveDB(db);

console.log("\n✅ Codici Generati e Salvati con Successo!");
console.log("-----------------------------------------");
generatedCodes.forEach(c => console.log(c));
console.log("-----------------------------------------\n");
