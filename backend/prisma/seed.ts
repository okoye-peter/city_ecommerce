import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";

dotenv.config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// ─── Seed data ────────────────────────────────────────────────────────────────

const categories = [
  {
    name: "Fashion & Clothing",
    description:
      "Clothing, footwear, and accessories for men, women, and children",
  },
  {
    name: "Electronics",
    description: "Phones, laptops, TVs, and other electronic devices",
  },
  {
    name: "Food & Groceries",
    description:
      "Fresh produce, packaged foods, and everyday household groceries",
  },
  {
    name: "Beauty & Skincare",
    description: "Skincare, haircare, cosmetics, and personal care products",
  },
  {
    name: "Home & Kitchen",
    description: "Furniture, cookware, home décor, and kitchen appliances",
  },
  {
    name: "Health & Wellness",
    description:
      "Supplements, medical supplies, fitness, and wellness products",
  },
  {
    name: "Baby & Kids",
    description: "Baby essentials, toys, and children's clothing",
  },
  {
    name: "Agriculture & Farming",
    description: "Seeds, fertilisers, farm tools, and agricultural inputs",
  },
  {
    name: "Building & Construction",
    description: "Building materials, tools, and construction supplies",
  },
  {
    name: "Automotive",
    description: "Car parts, accessories, and vehicle maintenance products",
  },
  {
    name: "Books & Stationery",
    description: "Textbooks, novels, office supplies, and stationery",
  },
  {
    name: "Sports & Fitness",
    description: "Gym equipment, sportswear, and outdoor gear",
  },
  {
    name: "Phones & Accessories",
    description: "Mobile phones, chargers, cases, and accessories",
  },
  {
    name: "Computers & Tablets",
    description: "Laptops, desktops, tablets, and computing accessories",
  },
  {
    name: "Jewellery & Watches",
    description: "Necklaces, bracelets, rings, earrings, and wristwatches",
  },
  {
    name: "Bags & Luggage",
    description: "Handbags, backpacks, travel bags, and wallets",
  },
  {
    name: "Office & Business",
    description: "Office furniture, equipment, and business supplies",
  },
  {
    name: "Industrial & Machinery",
    description: "Industrial equipment, heavy machinery, and tools",
  },
  {
    name: "Fabric & Textiles",
    description: "Ankara, Aso-Oke, lace, and other fabrics sold by the yard",
  },
  {
    name: "Drinks & Beverages",
    description:
      "Soft drinks, water, juice, energy drinks, and alcoholic beverages",
  },
  {
    name: "Frozen & Dairy Foods",
    description: "Frozen fish, chicken, ice cream, milk, and dairy products",
  },
  {
    name: "Electrical & Solar",
    description: "Wiring, inverters, solar panels, and electrical components",
  },
  {
    name: "Cleaning & Laundry",
    description: "Detergents, disinfectants, mops, and cleaning equipment",
  },
  {
    name: "Pet Supplies",
    description: "Pet food, grooming products, and accessories for pets",
  },
  {
    name: "Art & Crafts",
    description: "Handmade crafts, art supplies, and creative materials",
  },
  {
    name: "Music & Instruments",
    description: "Musical instruments, studio equipment, and accessories",
  },
  {
    name: "Photography & Video",
    description: "Cameras, lenses, tripods, and video equipment",
  },
  {
    name: "Security & Surveillance",
    description: "CCTV cameras, alarms, padlocks, and security systems",
  },
  {
    name: "Party & Events",
    description: "Party decorations, catering supplies, and event materials",
  },
  {
    name: "Secondhand & Thrift",
    description:
      "Quality used goods including clothing, electronics, and furniture",
  },
];

const markets = [
  {
    name: "Alaba International Market",
    description: "One of West Africa's largest electronics markets, located in Lagos",
    url: "https://i.pinimg.com/736x/55/17/12/5517121ac9b4c5d6b49c53809a64a97f.jpg",
  },
  {
    name: "Computer Village",
    description: "Nigeria's largest technology and electronics hub in Ikeja, Lagos",
    url: "https://i.pinimg.com/736x/6a/58/ef/6a58eff6fc97289bd86b7f01f0126604.jpg",
  },
  {
    name: "Balogun Market",
    description: "Massive textile, fashion, and general goods market in Lagos Island",
    url: "https://i.pinimg.com/736x/9e/b9/0a/9eb90ad60dc1a2d5d999b1cefcd298eb.jpg",
  },
  {
    name: "Trade Fair Complex",
    description: "Large-scale market for household goods, furniture, and electronics in Lagos",
    url: "https://i.pinimg.com/736x/29/50/fe/2950fe844a75aecebbea331259d36ae9.jpg",
  },
  {
    name: "Onitsha Main Market",
    description: "One of the largest markets in Africa, specialising in general merchandise in Anambra State",
    url: "https://i.pinimg.com/736x/10/cd/8b/10cd8bf4a1c7e04e5c7fdcdc09a429f1.jpg",
  },
  {
    name: "Wuse Market",
    description: "Major commercial market for food, clothing, and general goods in Abuja",
    url: "https://i.pinimg.com/736x/a4/8d/24/a48d24618366740f6dce85e16cc983c8.jpg",
  },
  {
    name: "Bodija Market",
    description: "Popular open-air market for fresh produce and food items in Ibadan",
    url: "https://i.pinimg.com/736x/bc/6b/e2/bc6be23660500358e6b716873026a17c.jpg",
  },
  {
    name: "Kasuwan Kurmi",
    description: "Historic market in Kano city known for textiles, crafts, and traditional goods",
    url: "https://i.pinimg.com/736x/6e/d3/24/6ed32458c53b06568557b7d99f466582.jpg",
  },
  {
    name: "Ariaria International Market",
    description: "Major market in Aba known for locally manufactured leather goods and clothing",
    url: "https://i.pinimg.com/736x/74/c2/64/74c2643064ce769f2718338f062c9529.jpg",
  },
  {
    name: "Garki Market",
    description: "Busy general goods and food market in Garki, Abuja",
    url: "https://i.pinimg.com/736x/04/5c/9a/045c9a3333301bfb4236bba3b8a6672a.jpg",
  },
  {
    name: "Idumota Market",
    description: "Large wholesale and retail market for electronics and goods on Lagos Island",
    url: "https://i.pinimg.com/736x/4c/82/84/4c828484dcfae4bbdb045372c3db1386.jpg",
  },
  {
    name: "Gbagi Market",
    description: "Textile and clothing market in Ibadan, popular for wholesale fabric",
    url: "https://i.pinimg.com/736x/ed/5a/45/ed5a4558d956d83278203d695a5d22c2.jpg",
  },
  {
    name: "Sabon Gari Market",
    description: "Major commercial hub for general merchandise in Kano",
    url: "https://i.pinimg.com/736x/21/2b/35/212b359d8ab1f8399fdeb7c1daf08ad9.jpg",
  },
  {
    name: "Oshodi Market",
    description: "Busy open market for clothing, food, and everyday goods in Lagos",
    url: "https://i.pinimg.com/736x/15/8f/c5/158fc595807ad0c332ad86be0f08b58f.jpg",
  },
  {
    name: "Timber Market Warri",
    description: "Largest timber and building materials market in Delta State",
    url: "https://i.pinimg.com/736x/40/50/22/405022059a823ec23043d26c52d57746.jpg",
  },
  {
    name: "Katampe Market",
    description: "Emerging market for fresh produce and general goods in Abuja",
    url: "https://i.pinimg.com/736x/11/4d/eb/114deb7e5c76322e7f5903df774e038c.jpg",
  },
  {
    name: "Relief Market Owerri",
    description: "Central market in Owerri, Imo State, known for food and general trade",
    url: "https://i.pinimg.com/736x/c0/a4/d2/c0a4d283242e060cb44666dd98c7aa7a.jpg",
  },
  {
    name: "Ogbete Main Market",
    description: "One of the largest markets in Enugu State for general merchandise",
    url: "https://i.pinimg.com/474x/b7/f4/56/b7f45634849aa8f3f49e3d4f9adffa9a.jpg",
  },
  {
    name: "Dugbe Market",
    description: "Major commercial market in central Ibadan for clothing and goods",
    url: "https://i.pinimg.com/736x/f1/f5/22/f1f5226be836fe6acdb3f4591071adc8.jpg",
  },
  {
    name: "New Benin Market",
    description: "Popular market in Benin City for clothing, food, and general goods",
    url: "https://i.pinimg.com/736x/98/9a/26/989a264fad3906e24544b6c9c1fefa4b.jpg",
  },
  {
    name: "Effurun Market",
    description: "Busy market in Warri, Delta State, for food, clothing, and electronics",
    url: "https://i.pinimg.com/736x/51/32/14/513214192ff6b15f9cdbc57bf66c6fec.jpg",
  },
  {
    name: "Rumuola Market",
    description: "Key market in Port Harcourt for general goods and fresh produce",
    url: "https://i.pinimg.com/736x/ab/3e/ce/ab3ece76c74ce71495d82d038d076569.jpg",
  },
  {
    name: "Sura Shopping Complex",
    description: "Multi-storey shopping complex in Lagos Island for retail goods",
    url: "https://i.pinimg.com/736x/60/69/10/6069103fcae95685a49d028e0482496e.jpg",
  },
  {
    name: "Nyanya Market",
    description: "Major food and general goods market on the outskirts of Abuja",
    url: "https://i.pinimg.com/736x/e1/2b/24/e12b24d9228aab33f8ec977b379fdf4e.jpg",
  },
  {
    name: "Maiduguri Monday Market",
    description: "One of the largest traditional markets in northeast Nigeria",
    url: "https://i.pinimg.com/736x/3e/d5/4e/3ed54ef229adfa1a90e291ad1a97f845.jpg",
  },
  {
    name: "Lokoja Market",
    description: "Central market in Lokoja, Kogi State, for food and general trade",
    url: "https://i.pinimg.com/736x/de/ed/cc/deedccd4d684adfa68a954e1fb082b0d.jpg",
  },
  {
    name: "Akure Central Market",
    description: "Main commercial market in Akure, Ondo State",
    url: "https://i.pinimg.com/736x/a1/ec/61/a1ec61f14e854f6994be28f3c3cddc73.jpg",
  },
  {
    name: "Abeokuta Kuto Market",
    description: "Major market in Abeokuta, Ogun State, known for Aso-Oke and traditional goods",
    url: "https://i.pinimg.com/736x/1e/b1/52/1eb1526dea5e7d7c8eda3868ba6be066.jpg",
  },
  {
    name: "Makurdi Modern Market",
    description: "Central market in Makurdi, Benue State, for food and general merchandise",
    url: "https://i.pinimg.com/736x/6d/d8/d6/6dd8d62fcb9750738052a7db82527926.jpg",
  },
  {
    name: "Calabar Watt Market",
    description: "Historic market in Calabar, Cross River State, for fresh produce and crafts",
    url: "https://i.pinimg.com/736x/c9/f8/2f/c9f82f384e48abe07007753d65caee29.jpg",
  },
];

const nigerianStates = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT (Abuja)",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
];

type BankSeed = {
  name: string;
};

// sortCode = CBN routing code; code = NIP interInstitutionCode (used in transfer API calls)
const banks: BankSeed[] = [
  // ── Tier-1 commercial banks ────────────────────────────────────────────────
  { name: "Access Bank"                          },
  { name: "Zenith Bank"                          },
  { name: "First Bank of Nigeria"                },
  { name: "Guaranty Trust Bank (GTBank)"         },
  { name: "United Bank for Africa (UBA)"         },
  { name: "Fidelity Bank"                        },
  { name: "First City Monument Bank (FCMB)"      },
  { name: "Union Bank of Nigeria"                },
  { name: "Ecobank Nigeria"                      },
  { name: "Stanbic IBTC Bank"                   },
  { name: "Sterling Bank"                        },
  { name: "Polaris Bank"                         },
  { name: "Wema Bank"                            },
  { name: "Keystone Bank"                        },
  { name: "Heritage Bank"                        },
  { name: "Citibank Nigeria"                     },
  { name: "Standard Chartered Bank Nigeria"      },
  { name: "Jaiz Bank"                            },
  { name: "SunTrust Bank Nigeria"                },
  { name: "Providus Bank"                        },
  { name: "Titan Trust Bank"                     },
  { name: "Globus Bank"                          },
  { name: "Premium Trust Bank"                   },
  { name: "Optimus Bank"                         },

  // ── Digital / mobile-first banks ──────────────────────────────────────────
  { name: "Kuda Bank"                            },
  { name: "OPay (One Finance)"                   },
  { name: "PalmPay"                              },
  { name: "Moniepoint Microfinance Bank"         },
  { name: "Carbon (One Finance)"                 },
  { name: "VFD Microfinance Bank"                },
  { name: "Rubies (Highstreet) Microfinance Bank"},
  { name: "Sparkle Microfinance Bank"            },
  { name: "ALAT by Wema"                         },
  { name: "Fairmoney Microfinance Bank"          },
  { name: "Umba Microfinance Bank"               },
  { name: "Raven Bank"                           },

  // ── Merchant / payment service banks ──────────────────────────────────────
  { name: "Paystack-Titan (PSB)"                 },
  { name: "Paga"                                 },
  { name: "Interswitch (Quickteller)"            },
  { name: "TeamApt (Moniepoint PSB)"             },
  { name: "9PSB (9 Payment Service Bank)"        },
  { name: "MTN Momo PSB"                         },
  { name: "Airtel Smartcash PSB",                 },

  // ── Microfinance banks ─────────────────────────────────────────────────────
  { name: "Accion Microfinance Bank",             },
  { name: "LAPO Microfinance Bank",               },
  { name: "AB Microfinance Bank",                 },
  { name: "Baobab Microfinance Bank",             },
  { name: "Nirsal Microfinance Bank",             },
  { name: "Mint Microfinance Bank",               },
  { name: "Paddy Coverker Microfinance Bank",     },
  { name: "Fina Trust Microfinance Bank",         },
  { name: "Hasal Microfinance Bank",              },
  { name: "Mkobo Microfinance Bank",              },
  { name: "Boctrust Microfinance Bank",           },
  { name: "Covenant Microfinance Bank",           },
  { name: "Yes Microfinance Bank",                },
  { name: "Stanford Microfinance Bank",           },
  { name: "Mutual Trust Microfinance Bank",       },
  { name: "Baines Credit Microfinance Bank",      },
  { name: "Lagos Building Investment Company (LBIC)"},
  { name: "Empire Trust Microfinance Bank",       },
  { name: "Infinity Microfinance Bank",           },
  { name: "Grooming Microfinance Bank",           },
  { name: "Fidfund Microfinance Bank",            },
  { name: "Unaab Microfinance Bank",              },
  { name: "Trustfund Microfinance Bank",          },
  { name: "Quick Fund Microfinance Bank",         },
];

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("Seeding states...");
  for (const name of nigerianStates) {
    await prisma.state.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log(`✓ ${nigerianStates.length} states seeded`);

  const lagosState = await prisma.state.findUniqueOrThrow({ where: { name: "Lagos" } });

  console.log("Seeding categories...");
  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: { description: category.description },
      create: category,
    });
  }
  console.log(`✓ ${categories.length} categories seeded`);

  console.log("Seeding markets...");
  for (const market of markets) {
    await prisma.market.upsert({
      where: { name: market.name },
      update: { description: market.description, url: market.url },
      create: market,
    });
  }
  console.log(`✓ ${markets.length} markets seeded`);

  console.log("Updating all markets with Lagos state ID...");
  const { count } = await prisma.market.updateMany({
    data: { stateId: lagosState.id },
  });
  console.log(`✓ ${count} markets updated with Lagos state ID (${lagosState.id})`);

  console.log("Seeding banks...");
  for (const bank of banks) {
    await prisma.bank.upsert({
      where:  { name: bank.name },
      update: { name: bank.name },
      create: bank,
    });
  }
  console.log(`✓ ${banks.length} banks seeded`);
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
