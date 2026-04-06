// Lance 100 appels réels à l'API Google Sheets pour peupler le fichier Excel
// Distribution pondérée : -40% 7.5% | -35% 12.5% | -30% 30% | -25% 50%

const API_URL = 'https://script.google.com/macros/s/AKfycbxl-vNl8iyGZYlTUkcoGmVph6jE8VRFbP1ZFHZAHpcRHk0BybdDoWxabQ2sA8aeaA1j/exec';

const FIRST_NAMES = ['Fatima', 'Khadija', 'Amina', 'Nadia', 'Soukaina', 'Yasmine', 'Imane', 'Salma', 'Hajar', 'Meriem', 'Sara', 'Houda', 'Loubna', 'Sanaa', 'Asmae', 'Karima', 'Najat', 'Latifa', 'Zineb', 'Btissam'];
const LAST_NAMES = ['El Idrissi', 'Bennani', 'Alaoui', 'El Fassi', 'Tazi', 'Berrada', 'Cherkaoui', 'Lahlou', 'Sebti', 'Bouzid', 'El Amrani', 'Naciri', 'Sqalli', 'Belmlih', 'Filali', 'Kabbaj', 'Rami', 'Saidi', 'Ouazzani', 'Mansouri'];
const SALONS = ['Beauty Lounge', 'Nail Studio', 'Glam Institut', 'Bella Donna', 'Pink Beauty', 'Esthetic Pro', 'Luxe Nails', 'Royal Beauty', 'Diva Nails', 'Star Beauty', 'Élégance', 'Charme & Style', 'Magnolia Spa', 'Belle Époque', 'Pure Beauté'];
const CITIES = ['Casablanca', 'Rabat', 'Marrakech', 'Tanger', 'Fès', 'Agadir', 'Meknès', 'Oujda', 'Tétouan', 'Kenitra', 'Mohammedia', 'Salé', 'El Jadida', 'Safi', 'Nador'];
const REPS = ['Ahmed', 'Karim', 'Youssef', 'Said', 'Hassan', 'Omar'];

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const pad = (n, len) => String(n).padStart(len, '0');

function weightedDiscount() {
  const weights = [
    { label: '-40%', weight: 0.075 },
    { label: '-35%', weight: 0.125 },
    { label: '-30%', weight: 0.30 },
    { label: '-25%', weight: 0.50 },
  ];
  const r = Math.random();
  let cum = 0;
  for (const w of weights) {
    cum += w.weight;
    if (r <= cum) return w.label;
  }
  return '-25%';
}

function makeTicket(i) {
  // SD26-T001 ... SD26-T100  (suffixe T pour distinguer des vrais billets)
  return `SD26-T${pad(i, 3)}`;
}

function makeDevis(i) {
  // ST + 4 chars  (préfixe ST pour test, 6 chars total)
  return `ST${pad(i, 4)}`;
}

async function callRegister(payload) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify(payload),
    redirect: 'follow',
  });
  return res.json();
}

async function main() {
  console.log('🎰 Lancement de 100 tests réels vers Google Sheets...\n');
  const stats = { '-25%': 0, '-30%': 0, '-35%': 0, '-40%': 0 };
  let ok = 0;
  let fail = 0;

  for (let i = 1; i <= 100; i++) {
    const firstName = rand(FIRST_NAMES);
    const lastName = rand(LAST_NAMES);
    const discount = weightedDiscount();
    stats[discount]++;
    const attempts = Math.random() < 0.4 ? 2 : 1;

    const payload = {
      action: 'register',
      ticket: makeTicket(i),
      devisNumber: makeDevis(i),
      clientName: `${firstName} ${lastName}`,
      salon: rand(SALONS),
      city: rand(CITIES),
      discount,
      representative: rand(REPS),
      attempts,
    };

    try {
      const result = await callRegister(payload);
      if (result && result.success !== false) {
        ok++;
        console.log(`[${pad(i, 3)}/100] ✅ ${payload.ticket} | ${payload.clientName.padEnd(28)} | ${discount} | ess.${attempts}`);
      } else {
        fail++;
        console.log(`[${pad(i, 3)}/100] ⚠️  ${payload.ticket} → ${result?.message || 'unknown'}`);
      }
    } catch (err) {
      fail++;
      console.log(`[${pad(i, 3)}/100] ❌ ${payload.ticket} → ${err.message}`);
    }

    // Petit délai pour ne pas saturer Apps Script
    await new Promise((r) => setTimeout(r, 250));
  }

  console.log('\n📊 RÉSULTATS');
  console.log('─────────────────────────');
  console.log(`✅ Succès : ${ok} / 100`);
  console.log(`❌ Échecs : ${fail} / 100`);
  console.log('\n📈 Distribution des gains');
  console.log('─────────────────────────');
  for (const [label, count] of Object.entries(stats)) {
    const pct = ((count / 100) * 100).toFixed(1);
    console.log(`${label.padEnd(6)} : ${String(count).padStart(3)} (${pct}%)`);
  }
  console.log('\n🎯 Cible théorique');
  console.log('─────────────────────────');
  console.log('-40%   :   7.5%');
  console.log('-35%   :  12.5%');
  console.log('-30%   :  30.0%');
  console.log('-25%   :  50.0%');
}

main().catch((e) => {
  console.error('Erreur fatale:', e);
  process.exit(1);
});
