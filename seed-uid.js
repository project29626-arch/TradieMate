import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCYg2vmNuXsRJQQ_-8kbLY87yLP69_xAIo",
  authDomain: "tradiemate-30c7e.firebaseapp.com",
  projectId: "tradiemate-30c7e",
  storageBucket: "tradiemate-30c7e.firebasestorage.app",
  messagingSenderId: "77343872027",
  appId: "1:77343872027:web:0d38ac84a08fea472a54be"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Get UID from command line arguments
const uid = process.argv[2];

if (!uid) {
  console.error("Please provide a UID: node seed-uid.js <YOUR_FIREBASE_UID>");
  process.exit(1);
}

async function run() {
  console.log(`Seeding data for UID: ${uid}...`);

  // 1. Create Business Profile
  console.log("Seeding business profile...");
  const profileRef = doc(db, 'users', uid, 'profile', 'business');
  await setDoc(profileRef, {
    name: "Aussie Sparky & Plumbing Services",
    abn: "12 345 678 910",
    tradeType: "General Trade",
    gstRegistered: true,
    phone: "0412 345 678",
    email: "contact@aussiesparky.com.au",
    serviceArea: "Melbourne SE Suburbs",
    defaultLabourRate: 110,
    defaultCallOutFee: 95,
    quoteTerms: "Payment within 7 days of invoice date.",
    quoteFooter: "Cheers for choosing Aussie Sparky & Plumbing Services!",
    logoUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=200&auto=format&fit=crop&q=80",
    updatedAt: new Date().toISOString()
  });
  console.log("Business profile seeded successfully.");

  // 2. Create Test Quotes
  console.log("Seeding test quotes...");
  const quotesRef = collection(db, 'users', uid, 'quotes');

  // Quote 1: Draft Quote
  await addDoc(quotesRef, {
    quoteNumber: "QM-9001",
    customerName: "Bruce Wayne",
    customerPhone: "0499 999 999",
    jobAddress: "100 Bat Cave Road, Richmond VIC 3121",
    scopeOfWork: "Install new double power points (GPOs) in the main hall and replace a broken light switch.",
    lineItems: [
      { description: "Electrical Service Call-out Fee", quantity: 1, unitPrice: 95, total: 95 },
      { description: "Double GPO Wall Outlets (Clipsal)", quantity: 4, unitPrice: 25, total: 100 },
      { description: "Electrical Labour (Install & Test RCD)", quantity: 2.5, unitPrice: 110, total: 275 }
    ],
    subtotal: 470,
    gst: 47,
    total: 517,
    status: "Draft",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    followUpDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    terms: "Payment within 7 days of invoice date.",
    footer: "Cheers for choosing Aussie Sparky & Plumbing Services!",
    jobSummary: "Install Double Power Points & Replace Switch",
    missingInformation: ["Verify circuit safety switch presence"],
    tasks: [
      { title: "Procure GPOs from Bunnings", assignee: "tradie", completed: true },
      { title: "Install wall outlets and test switchboard RCD", assignee: "tradie", completed: false }
    ],
    draftMessages: [
      { channel: "sms", recipient: "Bruce Wayne", body: "G'day Bruce, just sent over the draft quote for those new GPOs. Let me know if that works for you. Cheers, Aussie Sparky" }
    ]
  });

  // Quote 2: Sent Quote (Overdue)
  await addDoc(quotesRef, {
    quoteNumber: "QM-9002",
    customerName: "Kylie Minogue",
    customerPhone: "0411 222 333",
    jobAddress: "45 Pop Diva Avenue, South Yarra VIC 3141",
    scopeOfWork: "Repair leaking toilet (dunny) inlet valve and replace rusted copper pipes under the kitchen sink.",
    lineItems: [
      { description: "Plumbing Service Call-out Fee", quantity: 1, unitPrice: 95, total: 95 },
      { description: "Toilet Inlet Valve Replacement (Caroma)", quantity: 1, unitPrice: 55, total: 55 },
      { description: "Copper Piping & Fittings Pack", quantity: 1, unitPrice: 40, total: 40 },
      { description: "Plumbing Labour (Leak repairs)", quantity: 3, unitPrice: 110, total: 330 }
    ],
    subtotal: 520,
    gst: 52,
    total: 572,
    status: "Sent",
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    followUpDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    terms: "Payment within 7 days of invoice date.",
    footer: "Cheers for choosing Aussie Sparky & Plumbing Services!",
    jobSummary: "Leaking Toilet Dunny & Kitchen Pipe Repair",
    missingInformation: [],
    tasks: [
      { title: "Pick up Caroma inlet valve from Reece", assignee: "tradie", completed: true },
      { title: "Fix toilet leak and kitchen copper pipes", assignee: "tradie", completed: true }
    ],
    draftMessages: [
      { channel: "sms", recipient: "Kylie", body: "G'day Kylie, just following up on the toilet valve repair quote. Let me know if you want to book it in. Cheers, Aussie Sparky" }
    ]
  });

  // Quote 3: Follow-Up Quote (Overdue)
  await addDoc(quotesRef, {
    quoteNumber: "QM-9003",
    customerName: "Steve Irwin",
    customerPhone: "0433 444 555",
    jobAddress: "123 Crocodile Way, Beerwah QLD 4519",
    scopeOfWork: "Install outdoor weatherproof double GPO for water pump filter and wire up garden floodlights.",
    lineItems: [
      { description: "Electrical Service Call-out Fee", quantity: 1, unitPrice: 95, total: 95 },
      { description: "Weatherproof IP66 WeatherShield GPO", quantity: 1, unitPrice: 65, total: 65 },
      { description: "LED Outdoor Floodlights 50W", quantity: 2, unitPrice: 85, total: 170 },
      { description: "Electrical Labour (Cabling & installation)", quantity: 4, unitPrice: 110, total: 440 }
    ],
    subtotal: 770,
    gst: 77,
    total: 847,
    status: "Follow-Up",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    followUpDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    terms: "Payment within 7 days of invoice date.",
    footer: "Cheers for choosing Aussie Sparky & Plumbing Services!",
    jobSummary: "Outdoor Weatherproof GPO & Garden LED Floodlights",
    missingInformation: ["Confirm trenching requirements for garden cabling"],
    tasks: [
      { title: "Dig shallow trench for cables", assignee: "helper", completed: false },
      { title: "Install weatherproof GPO & test floodlights", assignee: "tradie", completed: false }
    ],
    draftMessages: [
      { channel: "sms", recipient: "Steve", body: "G'day Steve, hope you're having a ripper day. Just following up on the garden floodlights quote. Ready to head out when you are. Cheers!" }
    ]
  });

  // Quote 4: Won Quote
  await addDoc(quotesRef, {
    quoteNumber: "QM-9004",
    customerName: "Chris Hemsworth",
    customerPhone: "0455 555 777",
    jobAddress: "1 Thor Hammer Lane, Byron Bay NSW 2481",
    scopeOfWork: "Fit off 15 smart LED downlights in living room and check safety switches on main switchboard.",
    lineItems: [
      { description: "Electrical Service Call-out Fee", quantity: 1, unitPrice: 95, total: 95 },
      { description: "Smart Tricolour LED Downlights", quantity: 15, unitPrice: 30, total: 450 },
      { description: "Electrical Labour (Install Downlights & RCD Test)", quantity: 5, unitPrice: 110, total: 550 }
    ],
    subtotal: 1095,
    gst: 109.50,
    total: 1204.50,
    status: "Won",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    followUpDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    terms: "Payment within 7 days of invoice date.",
    footer: "Cheers for choosing Aussie Sparky & Plumbing Services!",
    jobSummary: "Living Room Downlights & Safety Switch Audit",
    missingInformation: [],
    tasks: [
      { title: "Buy 15 smart downlights from Middy's", assignee: "tradie", completed: true },
      { title: "Install downlights & verify RCD operation", assignee: "tradie", completed: true }
    ],
    draftMessages: [
      { channel: "sms", recipient: "Chris", body: "G'day Chris, glad we got this quote approved. I'll head over on Monday morning. Cheers!" }
    ]
  });

  // Quote 5: Lost Quote
  await addDoc(quotesRef, {
    quoteNumber: "QM-9005",
    customerName: "Ned Kelly",
    customerPhone: "0400 123 456",
    jobAddress: "88 Bushranger Hideout, Glenrowan VIC 3675",
    scopeOfWork: "Install iron plating reinforcement around storage shed and add security floodlights.",
    lineItems: [
      { description: "Electrical Service Call-out Fee", quantity: 1, unitPrice: 95, total: 95 },
      { description: "Shed Metal Sheets & Rivets", quantity: 10, unitPrice: 50, total: 500 },
      { description: "Heavy Duty Security Floodlight", quantity: 2, unitPrice: 120, total: 240 },
      { description: "Labour Fee (Iron works & lighting wiring)", quantity: 8, unitPrice: 110, total: 880 }
    ],
    subtotal: 1715,
    gst: 171.50,
    total: 1886.50,
    status: "Lost",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    followUpDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    terms: "Payment within 7 days.",
    footer: "Thanks, mate.",
    jobSummary: "Iron Plated Shed Reinforcement & Security Lights",
    missingInformation: [],
    tasks: [
      { title: "Procure iron sheets", assignee: "helper", completed: false }
    ],
    draftMessages: []
  });

  console.log("Seeding test quotes completed successfully.");
  console.log("ALL DONE!");
  process.exit(0);
}

run().catch(err => {
  console.error("Execution error:", err);
  process.exit(1);
});
