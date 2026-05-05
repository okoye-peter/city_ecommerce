import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";
import { uptime } from "process";

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
    description:
      "One of West Africa's largest electronics markets, located in Lagos",
  },
  {
    name: "Computer Village",
    description:
      "Nigeria's largest technology and electronics hub in Ikeja, Lagos",
  },
  {
    name: "Balogun Market",
    description:
      "Massive textile, fashion, and general goods market in Lagos Island",
  },
  {
    name: "Trade Fair Complex",
    description:
      "Large-scale market for household goods, furniture, and electronics in Lagos",
  },
  {
    name: "Onitsha Main Market",
    description:
      "One of the largest markets in Africa, specialising in general merchandise in Anambra State",
  },
  {
    name: "Wuse Market",
    description:
      "Major commercial market for food, clothing, and general goods in Abuja",
  },
  {
    name: "Bodija Market",
    description:
      "Popular open-air market for fresh produce and food items in Ibadan",
  },
  {
    name: "Kasuwan Kurmi",
    description:
      "Historic market in Kano city known for textiles, crafts, and traditional goods",
  },
  {
    name: "Ariaria International Market",
    description:
      "Major market in Aba known for locally manufactured leather goods and clothing",
  },
  {
    name: "Garki Market",
    description: "Busy general goods and food market in Garki, Abuja",
  },
  {
    name: "Idumota Market",
    description:
      "Large wholesale and retail market for electronics and goods on Lagos Island",
  },
  {
    name: "Gbagi Market",
    description:
      "Textile and clothing market in Ibadan, popular for wholesale fabric",
  },
  {
    name: "Sabon Gari Market",
    description: "Major commercial hub for general merchandise in Kano",
  },
  {
    name: "Oshodi Market",
    description:
      "Busy open market for clothing, food, and everyday goods in Lagos",
  },
  {
    name: "Timber Market Warri",
    description: "Largest timber and building materials market in Delta State",
  },
  {
    name: "Katampe Market",
    description: "Emerging market for fresh produce and general goods in Abuja",
  },
  {
    name: "Relief Market Owerri",
    description:
      "Central market in Owerri, Imo State, known for food and general trade",
  },
  {
    name: "Ogbete Main Market",
    description:
      "One of the largest markets in Enugu State for general merchandise",
  },
  {
    name: "Dugbe Market",
    description:
      "Major commercial market in central Ibadan for clothing and goods",
  },
  {
    name: "New Benin Market",
    description:
      "Popular market in Benin City for clothing, food, and general goods",
  },
  {
    name: "Effurun Market",
    description:
      "Busy market in Warri, Delta State, for food, clothing, and electronics",
  },
  {
    name: "Rumuola Market",
    description:
      "Key market in Port Harcourt for general goods and fresh produce",
  },
  {
    name: "Sura Shopping Complex",
    description:
      "Multi-storey shopping complex in Lagos Island for retail goods",
  },
  {
    name: "Nyanya Market",
    description:
      "Major food and general goods market on the outskirts of Abuja",
  },
  {
    name: "Maiduguri Monday Market",
    description: "One of the largest traditional markets in northeast Nigeria",
  },
  {
    name: "Lokoja Market",
    description:
      "Central market in Lokoja, Kogi State, for food and general trade",
  },
  {
    name: "Akure Central Market",
    description: "Main commercial market in Akure, Ondo State",
  },
  {
    name: "Abeokuta Kuto Market",
    description:
      "Major market in Abeokuta, Ogun State, known for Aso-Oke and traditional goods",
  },
  {
    name: "Makurdi Modern Market",
    description:
      "Central market in Makurdi, Benue State, for food and general merchandise",
  },
  {
    name: "Calabar Watt Market",
    description:
      "Historic market in Calabar, Cross River State, for fresh produce and crafts",
  },
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
      update: { description: market.description },
      create: market,
    });
  }
  console.log(`✓ ${markets.length} markets seeded`);

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
