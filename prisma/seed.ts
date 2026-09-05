import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // ============================================
  // A) 122 PROGRAMMES
  // ============================================

  const priorityPrograms = [
    { code: "FB", name: "Flying Blue", parentName: "Air France / KLM", type: "airline", alliance: "skyteam", region: ["EU", "FR", "WORLDWIDE"], badgeBg: "#E6F1FB", badgeText: "#0C447C", priority: 100 },
    { code: "AV", name: "Avios", parentName: "British Airways Executive Club", type: "airline", alliance: "oneworld", region: ["EU", "UK", "WORLDWIDE"], badgeBg: "#EEEDFE", badgeText: "#534AB7", priority: 95 },
    { code: "AMEX_MR", name: "Membership Rewards", parentName: "American Express", type: "credit_card", alliance: null, region: ["WORLDWIDE"], badgeBg: "#F0F9FF", badgeText: "#0C4A6E", priority: 95 },
    { code: "MM", name: "Miles & More", parentName: "Lufthansa Group", type: "airline", alliance: "star", region: ["EU", "DE", "WORLDWIDE"], badgeBg: "#FAEEDA", badgeText: "#633806", priority: 90 },
    { code: "SK", name: "SkyMiles", parentName: "Delta Air Lines", type: "airline", alliance: "skyteam", region: ["US", "WORLDWIDE"], badgeBg: "#EAF3DE", badgeText: "#3B6D11", priority: 85 },
    { code: "AC_ACCOR", name: "Accor Live Limitless", parentName: "Accor Hotels", type: "hotel", alliance: null, region: ["EU", "FR", "WORLDWIDE"], badgeBg: "#E1F5EE", badgeText: "#085041", priority: 85 },
    { code: "UA", name: "MileagePlus", parentName: "United Airlines", type: "airline", alliance: "star", region: ["US", "WORLDWIDE"], badgeBg: "#EEEDFE", badgeText: "#26215C", priority: 80 },
    { code: "MR", name: "Marriott Bonvoy", parentName: "Marriott International", type: "hotel", alliance: null, region: ["WORLDWIDE"], badgeBg: "#FEE2E2", badgeText: "#991B1B", priority: 80 },
    { code: "CHASE_UR", name: "Ultimate Rewards", parentName: "Chase", type: "credit_card", alliance: null, region: ["US"], badgeBg: "#EDE9FE", badgeText: "#4C1D95", priority: 80 },
    { code: "AA", name: "AAdvantage", parentName: "American Airlines", type: "airline", alliance: "oneworld", region: ["US", "WORLDWIDE"], badgeBg: "#FAECE7", badgeText: "#712B13", priority: 78 },
    { code: "EK", name: "Skywards", parentName: "Emirates", type: "airline", alliance: "independent", region: ["UAE", "WORLDWIDE"], badgeBg: "#E6F1FB", badgeText: "#0C447C", priority: 75 },
    { code: "HH", name: "Hilton Honors", parentName: "Hilton Hotels", type: "hotel", alliance: null, region: ["WORLDWIDE"], badgeBg: "#EDE9FE", badgeText: "#4C1D95", priority: 75 },
    { code: "CITI_TY", name: "ThankYou Points", parentName: "Citi", type: "credit_card", alliance: null, region: ["US"], badgeBg: "#E6F1FB", badgeText: "#185FA5", priority: 75 },
    { code: "EY", name: "Etihad Guest", parentName: "Etihad Airways", type: "airline", alliance: "independent", region: ["UAE", "WORLDWIDE"], badgeBg: "#E1F5EE", badgeText: "#085041", priority: 70 },
    { code: "HY", name: "World of Hyatt", parentName: "Hyatt Hotels", type: "hotel", alliance: null, region: ["WORLDWIDE"], badgeBg: "#FEF3C7", badgeText: "#92400E", priority: 70 },
    { code: "QR", name: "Privilege Club", parentName: "Qatar Airways", type: "airline", alliance: "oneworld", region: ["QA", "WORLDWIDE"], badgeBg: "#FAECE7", badgeText: "#712B13", priority: 68 },
    { code: "CA", name: "Aeroplan", parentName: "Air Canada", type: "airline", alliance: "star", region: ["CA", "WORLDWIDE"], badgeBg: "#FCEBEB", badgeText: "#A32D2D", priority: 65 },
    { code: "TK", name: "Miles&Smiles", parentName: "Turkish Airlines", type: "airline", alliance: "star", region: ["TR", "WORLDWIDE"], badgeBg: "#FAEEDA", badgeText: "#412402", priority: 63 },
    { code: "SQ", name: "KrisFlyer", parentName: "Singapore Airlines", type: "airline", alliance: "star", region: ["SG", "ASIA", "WORLDWIDE"], badgeBg: "#E6F1FB", badgeText: "#0C447C", priority: 60 },
    { code: "VS", name: "Flying Club", parentName: "Virgin Atlantic", type: "airline", alliance: "independent", region: ["UK", "WORLDWIDE"], badgeBg: "#FCEBEB", badgeText: "#A32D2D", priority: 58 },
  ];

  const additionalPrograms = [
    // Asia-Pacific Airlines
    { code: "CX", name: "Asia Miles", parentName: "Cathay Pacific", type: "airline", alliance: "oneworld", region: ["HK", "ASIA", "WORLDWIDE"], badgeBg: "#E1F5EE", badgeText: "#085041", priority: 55 },
    { code: "QF", name: "Qantas Frequent Flyer", parentName: "Qantas", type: "airline", alliance: "oneworld", region: ["AU", "OCEANIA", "WORLDWIDE"], badgeBg: "#FCEBEB", badgeText: "#A32D2D", priority: 53 },
    { code: "JL", name: "JAL Mileage Bank", parentName: "Japan Airlines", type: "airline", alliance: "oneworld", region: ["JP", "ASIA"], badgeBg: "#FCEBEB", badgeText: "#712B13", priority: 50 },
    { code: "NH", name: "ANA Mileage Club", parentName: "All Nippon Airways", type: "airline", alliance: "star", region: ["JP", "ASIA"], badgeBg: "#E6F1FB", badgeText: "#0C447C", priority: 50 },
    { code: "KE", name: "SKYPASS", parentName: "Korean Air", type: "airline", alliance: "skyteam", region: ["KR", "ASIA"], badgeBg: "#E6F1FB", badgeText: "#185FA5", priority: 48 },
    { code: "OZ", name: "Asiana Club", parentName: "Asiana Airlines", type: "airline", alliance: "star", region: ["KR", "ASIA"], badgeBg: "#FAEEDA", badgeText: "#633806", priority: 40 },
    { code: "CI", name: "Dynasty Flyer", parentName: "China Airlines", type: "airline", alliance: "skyteam", region: ["TW", "ASIA"], badgeBg: "#EDE9FE", badgeText: "#4C1D95", priority: 35 },
    { code: "BR", name: "Infinity MileageLands", parentName: "EVA Air", type: "airline", alliance: "star", region: ["TW", "ASIA"], badgeBg: "#E1F5EE", badgeText: "#085041", priority: 35 },
    { code: "TG", name: "Royal Orchid Plus", parentName: "Thai Airways", type: "airline", alliance: "star", region: ["TH", "ASIA"], badgeBg: "#EDE9FE", badgeText: "#534AB7", priority: 38 },
    { code: "MH", name: "Enrich", parentName: "Malaysia Airlines", type: "airline", alliance: "oneworld", region: ["MY", "ASIA"], badgeBg: "#E6F1FB", badgeText: "#0C447C", priority: 35 },
    { code: "GA", name: "GarudaMiles", parentName: "Garuda Indonesia", type: "airline", alliance: "skyteam", region: ["ID", "ASIA"], badgeBg: "#E1F5EE", badgeText: "#085041", priority: 30 },
    { code: "AI", name: "Flying Returns", parentName: "Air India", type: "airline", alliance: "star", region: ["IN", "ASIA"], badgeBg: "#FAECE7", badgeText: "#712B13", priority: 35 },
    { code: "VN", name: "Lotusmiles", parentName: "Vietnam Airlines", type: "airline", alliance: "skyteam", region: ["VN", "ASIA"], badgeBg: "#FAEEDA", badgeText: "#633806", priority: 30 },
    { code: "PR", name: "Mabuhay Miles", parentName: "Philippine Airlines", type: "airline", alliance: "independent", region: ["PH", "ASIA"], badgeBg: "#E6F1FB", badgeText: "#185FA5", priority: 25 },
    { code: "CZ", name: "Sky Pearl Club", parentName: "China Southern", type: "airline", alliance: "skyteam", region: ["CN", "ASIA"], badgeBg: "#E6F1FB", badgeText: "#0C447C", priority: 38 },
    { code: "MU", name: "Eastern Miles", parentName: "China Eastern", type: "airline", alliance: "skyteam", region: ["CN", "ASIA"], badgeBg: "#FCEBEB", badgeText: "#A32D2D", priority: 35 },
    { code: "CA_AIR", name: "PhoenixMiles", parentName: "Air China", type: "airline", alliance: "star", region: ["CN", "ASIA"], badgeBg: "#FCEBEB", badgeText: "#712B13", priority: 35 },
    { code: "HU", name: "Fortune Wings Club", parentName: "Hainan Airlines", type: "airline", alliance: "independent", region: ["CN", "ASIA"], badgeBg: "#FAECE7", badgeText: "#712B13", priority: 28 },
    { code: "9W", name: "JPMiles", parentName: "Jet Airways (InterMiles)", type: "airline", alliance: "independent", region: ["IN", "ASIA"], badgeBg: "#FAEEDA", badgeText: "#412402", priority: 25 },
    { code: "SL", name: "FlySmiles", parentName: "SriLankan Airlines", type: "airline", alliance: "oneworld", region: ["LK", "ASIA"], badgeBg: "#E6F1FB", badgeText: "#0C447C", priority: 20 },
    // Middle East
    { code: "WY", name: "Sindbad", parentName: "Oman Air", type: "airline", alliance: "independent", region: ["OM", "ME"], badgeBg: "#E1F5EE", badgeText: "#085041", priority: 30 },
    { code: "GF", name: "Falconflyer", parentName: "Gulf Air", type: "airline", alliance: "independent", region: ["BH", "ME"], badgeBg: "#FAEEDA", badgeText: "#633806", priority: 28 },
    { code: "SV", name: "Alfursan", parentName: "Saudia", type: "airline", alliance: "skyteam", region: ["SA", "ME"], badgeBg: "#E1F5EE", badgeText: "#085041", priority: 35 },
    { code: "RJ", name: "Royal Plus", parentName: "Royal Jordanian", type: "airline", alliance: "oneworld", region: ["JO", "ME"], badgeBg: "#EDE9FE", badgeText: "#534AB7", priority: 25 },
    { code: "ME_AIR", name: "Cedar Miles", parentName: "Middle East Airlines", type: "airline", alliance: "skyteam", region: ["LB", "ME"], badgeBg: "#E1F5EE", badgeText: "#085041", priority: 22 },
    // Africa
    { code: "ET", name: "ShebaMiles", parentName: "Ethiopian Airlines", type: "airline", alliance: "star", region: ["ET", "AFRICA"], badgeBg: "#E1F5EE", badgeText: "#085041", priority: 35 },
    { code: "SA_AIR", name: "Voyager", parentName: "South African Airways", type: "airline", alliance: "star", region: ["ZA", "AFRICA"], badgeBg: "#E6F1FB", badgeText: "#0C447C", priority: 30 },
    { code: "KQ", name: "Asante", parentName: "Kenya Airways", type: "airline", alliance: "skyteam", region: ["KE", "AFRICA"], badgeBg: "#FCEBEB", badgeText: "#A32D2D", priority: 28 },
    { code: "AT", name: "Safar Flyer", parentName: "Royal Air Maroc", type: "airline", alliance: "oneworld", region: ["MA", "AFRICA"], badgeBg: "#FAECE7", badgeText: "#712B13", priority: 30 },
    { code: "MS", name: "EgyptAir Plus", parentName: "EgyptAir", type: "airline", alliance: "star", region: ["EG", "AFRICA"], badgeBg: "#E6F1FB", badgeText: "#185FA5", priority: 28 },
    // Latin America
    { code: "CM", name: "ConnectMiles", parentName: "Copa Airlines", type: "airline", alliance: "star", region: ["PA", "LATAM"], badgeBg: "#E6F1FB", badgeText: "#0C447C", priority: 35 },
    { code: "LA", name: "LATAM Pass", parentName: "LATAM Airlines", type: "airline", alliance: "independent", region: ["CL", "BR", "LATAM"], badgeBg: "#FCEBEB", badgeText: "#A32D2D", priority: 45 },
    { code: "AM", name: "Club Premier", parentName: "Aeromexico", type: "airline", alliance: "skyteam", region: ["MX", "LATAM"], badgeBg: "#E6F1FB", badgeText: "#185FA5", priority: 38 },
    { code: "AV_COL", name: "LifeMiles", parentName: "Avianca", type: "airline", alliance: "star", region: ["CO", "LATAM"], badgeBg: "#FCEBEB", badgeText: "#A32D2D", priority: 40 },
    { code: "G3", name: "Smiles", parentName: "GOL Linhas Aéreas", type: "airline", alliance: "independent", region: ["BR", "LATAM"], badgeBg: "#FAECE7", badgeText: "#712B13", priority: 35 },
    { code: "AR", name: "Aerolíneas Plus", parentName: "Aerolíneas Argentinas", type: "airline", alliance: "skyteam", region: ["AR", "LATAM"], badgeBg: "#E6F1FB", badgeText: "#0C447C", priority: 25 },
    // European Airlines (secondary)
    { code: "IB", name: "Iberia Plus", parentName: "Iberia", type: "airline", alliance: "oneworld", region: ["ES", "EU"], badgeBg: "#FAECE7", badgeText: "#712B13", priority: 50 },
    { code: "AZ", name: "Volare", parentName: "ITA Airways", type: "airline", alliance: "skyteam", region: ["IT", "EU"], badgeBg: "#E1F5EE", badgeText: "#085041", priority: 40 },
    { code: "SK_AIR", name: "EuroBonus", parentName: "SAS Scandinavian", type: "airline", alliance: "skyteam", region: ["SE", "NO", "DK", "EU"], badgeBg: "#E6F1FB", badgeText: "#0C447C", priority: 45 },
    { code: "TP", name: "Miles&Go", parentName: "TAP Air Portugal", type: "airline", alliance: "star", region: ["PT", "EU"], badgeBg: "#E1F5EE", badgeText: "#085041", priority: 38 },
    { code: "AY", name: "Finnair Plus", parentName: "Finnair", type: "airline", alliance: "oneworld", region: ["FI", "EU"], badgeBg: "#E6F1FB", badgeText: "#185FA5", priority: 38 },
    { code: "OS", name: "Miles & More Partner", parentName: "Austrian Airlines", type: "airline", alliance: "star", region: ["AT", "EU"], badgeBg: "#FAEEDA", badgeText: "#633806", priority: 35 },
    { code: "LX", name: "Miles & More Partner", parentName: "SWISS", type: "airline", alliance: "star", region: ["CH", "EU"], badgeBg: "#FCEBEB", badgeText: "#A32D2D", priority: 38 },
    { code: "SN", name: "Miles & More Partner", parentName: "Brussels Airlines", type: "airline", alliance: "star", region: ["BE", "EU"], badgeBg: "#E6F1FB", badgeText: "#0C447C", priority: 30 },
    { code: "LO", name: "Miles & More Partner", parentName: "LOT Polish Airlines", type: "airline", alliance: "star", region: ["PL", "EU"], badgeBg: "#E6F1FB", badgeText: "#185FA5", priority: 28 },
    { code: "AF", name: "Flying Blue Partner", parentName: "Air France", type: "airline", alliance: "skyteam", region: ["FR", "EU"], badgeBg: "#E6F1FB", badgeText: "#0C447C", priority: 48 },
    { code: "KL", name: "Flying Blue Partner", parentName: "KLM", type: "airline", alliance: "skyteam", region: ["NL", "EU"], badgeBg: "#E6F1FB", badgeText: "#185FA5", priority: 45 },
    { code: "RO", name: "Flying Blue Partner", parentName: "TAROM", type: "airline", alliance: "skyteam", region: ["RO", "EU"], badgeBg: "#E6F1FB", badgeText: "#0C447C", priority: 20 },
    { code: "U2", name: "easyJet Plus", parentName: "easyJet", type: "airline", alliance: "independent", region: ["UK", "EU"], badgeBg: "#FAECE7", badgeText: "#712B13", priority: 35 },
    { code: "FR", name: "Ryanair Choice", parentName: "Ryanair", type: "airline", alliance: "independent", region: ["IE", "EU"], badgeBg: "#E6F1FB", badgeText: "#0C447C", priority: 30 },
    { code: "W6", name: "Wizz Discount Club", parentName: "Wizz Air", type: "airline", alliance: "independent", region: ["HU", "EU"], badgeBg: "#EDE9FE", badgeText: "#534AB7", priority: 28 },
    { code: "VY", name: "Vueling Club", parentName: "Vueling", type: "airline", alliance: "independent", region: ["ES", "EU"], badgeBg: "#FEF3C7", badgeText: "#92400E", priority: 25 },
    { code: "A3", name: "Miles+Bonus", parentName: "Aegean Airlines", type: "airline", alliance: "star", region: ["GR", "EU"], badgeBg: "#E6F1FB", badgeText: "#0C447C", priority: 32 },
    { code: "PC", name: "Pegasus BolBol", parentName: "Pegasus Airlines", type: "airline", alliance: "independent", region: ["TR", "EU"], badgeBg: "#FEF3C7", badgeText: "#92400E", priority: 25 },
    { code: "BT", name: "PINS", parentName: "airBaltic", type: "airline", alliance: "independent", region: ["LV", "EU"], badgeBg: "#E1F5EE", badgeText: "#085041", priority: 22 },
    { code: "OK", name: "OK Plus", parentName: "Czech Airlines", type: "airline", alliance: "skyteam", region: ["CZ", "EU"], badgeBg: "#E6F1FB", badgeText: "#185FA5", priority: 20 },
    // North American (secondary)
    { code: "WS", name: "WestJet Rewards", parentName: "WestJet", type: "airline", alliance: "independent", region: ["CA", "NA"], badgeBg: "#E1F5EE", badgeText: "#085041", priority: 35 },
    { code: "B6", name: "TrueBlue", parentName: "JetBlue", type: "airline", alliance: "independent", region: ["US", "NA"], badgeBg: "#E6F1FB", badgeText: "#0C447C", priority: 38 },
    { code: "AS", name: "Mileage Plan", parentName: "Alaska Airlines", type: "airline", alliance: "oneworld", region: ["US", "NA"], badgeBg: "#E1F5EE", badgeText: "#085041", priority: 45 },
    { code: "F9", name: "Frontier Miles", parentName: "Frontier Airlines", type: "airline", alliance: "independent", region: ["US", "NA"], badgeBg: "#E1F5EE", badgeText: "#085041", priority: 20 },
    { code: "NK", name: "Spirit Saver$ Club", parentName: "Spirit Airlines", type: "airline", alliance: "independent", region: ["US", "NA"], badgeBg: "#FEF3C7", badgeText: "#92400E", priority: 18 },
    { code: "WN", name: "Rapid Rewards", parentName: "Southwest Airlines", type: "airline", alliance: "independent", region: ["US", "NA"], badgeBg: "#FAECE7", badgeText: "#712B13", priority: 42 },
    { code: "HA", name: "HawaiianMiles", parentName: "Hawaiian Airlines", type: "airline", alliance: "independent", region: ["US", "NA"], badgeBg: "#EDE9FE", badgeText: "#534AB7", priority: 22 },
    // Hotels (secondary)
    { code: "IHG", name: "IHG One Rewards", parentName: "IHG Hotels", type: "hotel", alliance: null, region: ["WORLDWIDE"], badgeBg: "#E1F5EE", badgeText: "#085041", priority: 65 },
    { code: "WH", name: "Wyndham Rewards", parentName: "Wyndham Hotels", type: "hotel", alliance: null, region: ["WORLDWIDE"], badgeBg: "#E6F1FB", badgeText: "#0C447C", priority: 45 },
    { code: "BW", name: "Best Western Rewards", parentName: "Best Western", type: "hotel", alliance: null, region: ["WORLDWIDE"], badgeBg: "#FAEEDA", badgeText: "#633806", priority: 35 },
    { code: "CH", name: "Choice Privileges", parentName: "Choice Hotels", type: "hotel", alliance: null, region: ["US", "WORLDWIDE"], badgeBg: "#E6F1FB", badgeText: "#185FA5", priority: 35 },
    { code: "RD", name: "Radisson Rewards", parentName: "Radisson Hotels", type: "hotel", alliance: null, region: ["EU", "WORLDWIDE"], badgeBg: "#EDE9FE", badgeText: "#534AB7", priority: 38 },
    { code: "SHA", name: "Shangri-La Circle", parentName: "Shangri-La Hotels", type: "hotel", alliance: null, region: ["ASIA", "WORLDWIDE"], badgeBg: "#FAEEDA", badgeText: "#633806", priority: 35 },
    { code: "MO", name: "Fans of M.O.", parentName: "Mandarin Oriental", type: "hotel", alliance: null, region: ["ASIA", "WORLDWIDE"], badgeBg: "#FEF3C7", badgeText: "#92400E", priority: 30 },
    { code: "FS", name: "Four Seasons Preferred", parentName: "Four Seasons", type: "hotel", alliance: null, region: ["WORLDWIDE"], badgeBg: "#FAEEDA", badgeText: "#412402", priority: 30 },
    { code: "RZ", name: "Ritz-Carlton Rewards", parentName: "Ritz-Carlton (Marriott)", type: "hotel", alliance: null, region: ["WORLDWIDE"], badgeBg: "#FEE2E2", badgeText: "#991B1B", priority: 28 },
    { code: "PH", name: "Peninsula PenClub", parentName: "The Peninsula Hotels", type: "hotel", alliance: null, region: ["ASIA", "WORLDWIDE"], badgeBg: "#E1F5EE", badgeText: "#085041", priority: 25 },
    { code: "MEL", name: "Melia Rewards", parentName: "Melia Hotels", type: "hotel", alliance: null, region: ["ES", "EU", "WORLDWIDE"], badgeBg: "#FAECE7", badgeText: "#712B13", priority: 30 },
    { code: "NH_HTL", name: "NH Rewards", parentName: "NH Hotels", type: "hotel", alliance: null, region: ["ES", "EU"], badgeBg: "#E6F1FB", badgeText: "#0C447C", priority: 28 },
    // Car Rental
    { code: "HERTZ", name: "Hertz Gold Plus", parentName: "Hertz", type: "car_rental", alliance: null, region: ["WORLDWIDE"], badgeBg: "#FEF3C7", badgeText: "#92400E", priority: 35 },
    { code: "AVIS", name: "Avis Preferred", parentName: "Avis", type: "car_rental", alliance: null, region: ["WORLDWIDE"], badgeBg: "#FCEBEB", badgeText: "#A32D2D", priority: 32 },
    { code: "EURO", name: "Europcar Privilege", parentName: "Europcar", type: "car_rental", alliance: null, region: ["EU", "WORLDWIDE"], badgeBg: "#E1F5EE", badgeText: "#085041", priority: 30 },
    { code: "SIXT", name: "Sixt Plus", parentName: "Sixt", type: "car_rental", alliance: null, region: ["DE", "EU", "WORLDWIDE"], badgeBg: "#FAECE7", badgeText: "#712B13", priority: 30 },
    { code: "NATL", name: "Emerald Club", parentName: "National Car Rental", type: "car_rental", alliance: null, region: ["US", "WORLDWIDE"], badgeBg: "#E1F5EE", badgeText: "#085041", priority: 28 },
    // Credit Cards (secondary)
    { code: "CAP1", name: "Capital One Miles", parentName: "Capital One", type: "credit_card", alliance: null, region: ["US"], badgeBg: "#FCEBEB", badgeText: "#A32D2D", priority: 55 },
    { code: "BILT", name: "Bilt Rewards", parentName: "Bilt", type: "credit_card", alliance: null, region: ["US"], badgeBg: "#E6F1FB", badgeText: "#0C447C", priority: 50 },
    { code: "AMEX_PLAT", name: "Centurion Rewards", parentName: "American Express Platinum", type: "credit_card", alliance: null, region: ["US", "EU", "WORLDWIDE"], badgeBg: "#FAEEDA", badgeText: "#412402", priority: 50 },
    { code: "HSBC", name: "HSBC Rewards", parentName: "HSBC", type: "credit_card", alliance: null, region: ["UK", "ASIA", "WORLDWIDE"], badgeBg: "#FCEBEB", badgeText: "#A32D2D", priority: 35 },
    { code: "BARCLAYS", name: "Barclays Avios", parentName: "Barclaycard", type: "credit_card", alliance: null, region: ["UK"], badgeBg: "#E6F1FB", badgeText: "#185FA5", priority: 35 },
    // Oceania / Pacific
    { code: "NZ", name: "Airpoints", parentName: "Air New Zealand", type: "airline", alliance: "star", region: ["NZ", "OCEANIA"], badgeBg: "#E6F1FB", badgeText: "#0C447C", priority: 38 },
    { code: "VA", name: "Velocity Frequent Flyer", parentName: "Virgin Australia", type: "airline", alliance: "independent", region: ["AU", "OCEANIA"], badgeBg: "#FCEBEB", badgeText: "#A32D2D", priority: 35 },
    { code: "FJ", name: "Tabua Club", parentName: "Fiji Airways", type: "airline", alliance: "oneworld", region: ["FJ", "OCEANIA"], badgeBg: "#E1F5EE", badgeText: "#085041", priority: 18 },
    // Rail
    { code: "SNCF", name: "Grand Voyageur", parentName: "SNCF TGV", type: "airline", alliance: null, region: ["FR", "EU"], badgeBg: "#EDE9FE", badgeText: "#534AB7", priority: 40 },
    { code: "EURO_RAIL", name: "Eurostar Club", parentName: "Eurostar", type: "airline", alliance: null, region: ["UK", "FR", "BE", "NL", "EU"], badgeBg: "#E6F1FB", badgeText: "#0C447C", priority: 35 },
    { code: "DB", name: "BahnBonus", parentName: "Deutsche Bahn", type: "airline", alliance: null, region: ["DE", "EU"], badgeBg: "#FCEBEB", badgeText: "#A32D2D", priority: 32 },
    // Misc / Regional
    { code: "EI", name: "AerClub", parentName: "Aer Lingus", type: "airline", alliance: "independent", region: ["IE", "EU"], badgeBg: "#E1F5EE", badgeText: "#085041", priority: 32 },
    { code: "DY", name: "Norwegian Reward", parentName: "Norwegian Air", type: "airline", alliance: "independent", region: ["NO", "EU"], badgeBg: "#FCEBEB", badgeText: "#A32D2D", priority: 32 },
    { code: "FZ", name: "OPEN", parentName: "flydubai", type: "airline", alliance: "independent", region: ["UAE", "ME"], badgeBg: "#FAECE7", badgeText: "#712B13", priority: 25 },
    { code: "XY", name: "flynas Naas", parentName: "flynas", type: "airline", alliance: "independent", region: ["SA", "ME"], badgeBg: "#E1F5EE", badgeText: "#085041", priority: 20 },
    { code: "WB", name: "RwandAir Dream Miles", parentName: "RwandAir", type: "airline", alliance: "independent", region: ["RW", "AFRICA"], badgeBg: "#E6F1FB", badgeText: "#0C447C", priority: 15 },
    { code: "JQ", name: "Jetstar Rewards", parentName: "Jetstar", type: "airline", alliance: "independent", region: ["AU", "ASIA"], badgeBg: "#FAECE7", badgeText: "#712B13", priority: 20 },
    { code: "AK", name: "BIG Points", parentName: "AirAsia", type: "airline", alliance: "independent", region: ["MY", "ASIA"], badgeBg: "#FCEBEB", badgeText: "#A32D2D", priority: 30 },
    { code: "5J", name: "GetGo", parentName: "Cebu Pacific", type: "airline", alliance: "independent", region: ["PH", "ASIA"], badgeBg: "#FEF3C7", badgeText: "#92400E", priority: 22 },
    { code: "KC", name: "Nomad Club", parentName: "Air Astana", type: "airline", alliance: "independent", region: ["KZ", "ASIA"], badgeBg: "#E6F1FB", badgeText: "#185FA5", priority: 20 },
    { code: "UL", name: "FlySmiLes", parentName: "SriLankan Airlines", type: "airline", alliance: "oneworld", region: ["LK", "ASIA"], badgeBg: "#EDE9FE", badgeText: "#534AB7", priority: 18 },
    { code: "PK", name: "Awards+", parentName: "PIA Pakistan", type: "airline", alliance: "independent", region: ["PK", "ASIA"], badgeBg: "#E1F5EE", badgeText: "#085041", priority: 15 },
  ];

  console.log(`Creating ${priorityPrograms.length} priority programs...`);
  for (const p of priorityPrograms) {
    await prisma.program.upsert({
      where: { code: p.code },
      update: {},
      create: p,
    });
  }

  console.log(`Creating ${additionalPrograms.length} additional programs...`);
  for (const p of additionalPrograms) {
    await prisma.program.upsert({
      where: { code: p.code },
      update: {},
      create: p,
    });
  }

  const totalPrograms = priorityPrograms.length + additionalPrograms.length;
  console.log(`Total programs: ${totalPrograms}`);

  // ============================================
  // B) STATUS TIERS
  // ============================================

  const fbProgram = await prisma.program.findUnique({ where: { code: "FB" } });
  const avProgram = await prisma.program.findUnique({ where: { code: "AV" } });
  const mmProgram = await prisma.program.findUnique({ where: { code: "MM" } });
  const skProgram = await prisma.program.findUnique({ where: { code: "SK" } });
  const uaProgram = await prisma.program.findUnique({ where: { code: "UA" } });
  const caProgram = await prisma.program.findUnique({ where: { code: "CA" } });

  const statusTiers = [
    // FLYING BLUE (FB)
    { programId: fbProgram!.id, code: "membre", name: "Membre", rank: 1, earningMultiplier: 1.0, qualificationType: "miles", requiredMiles: 0, benefits: ["Miles sur tous les vols"], color: "#9CA3AF" },
    { programId: fbProgram!.id, code: "silver", name: "Silver", rank: 2, earningMultiplier: 1.25, qualificationType: "combo", requiredMiles: 25000, requiredSegments: 40, benefits: ["+25% miles bonus", "Priorité enregistrement", "File dédiée"], color: "#C0C0C0" },
    { programId: fbProgram!.id, code: "gold", name: "Gold", rank: 3, earningMultiplier: 1.50, qualificationType: "combo", requiredMiles: 50000, requiredSegments: 70, benefits: ["+50% miles bonus", "Accès salons", "Surclassement prioritaire", "Bagages supplémentaires"], color: "#FFD700" },
    { programId: fbProgram!.id, code: "platinum", name: "Platinum", rank: 4, earningMultiplier: 1.75, qualificationType: "combo", requiredMiles: 100000, requiredSegments: 120, benefits: ["+75% miles bonus", "Accès salons worldwide", "Surclassement gratuit", "Service dédié"], color: "#E5E4E2" },
    { programId: fbProgram!.id, code: "ultimate", name: "Ultimate", rank: 5, earningMultiplier: 2.0, qualificationType: "combo", requiredMiles: 200000, requiredSegments: 200, benefits: ["×2 miles", "Tous les bénéfices Platinum", "Invitation seulement"], color: "#1D9E75" },

    // AVIOS / BA (AV)
    { programId: avProgram!.id, code: "blue", name: "Blue", rank: 1, earningMultiplier: 1.0, qualificationType: "miles", benefits: ["Miles sur vols BA"], color: "#9CA3AF" },
    { programId: avProgram!.id, code: "bronze", name: "Bronze", rank: 2, earningMultiplier: 1.25, qualificationType: "segments", requiredSegments: 25, requiredMiles: 300, benefits: ["+25% miles", "Enregistrement prioritaire"], color: "#CD7F32" },
    { programId: avProgram!.id, code: "silver", name: "Silver", rank: 3, earningMultiplier: 1.50, qualificationType: "segments", requiredSegments: 50, requiredMiles: 600, benefits: ["+50% miles", "Accès salons", "Bagages extra"], color: "#C0C0C0" },
    { programId: avProgram!.id, code: "gold", name: "Gold", rank: 4, earningMultiplier: 2.0, qualificationType: "segments", requiredSegments: 100, requiredMiles: 1500, benefits: ["×2 miles", "Tous les accès", "Gold Guest List éligible"], color: "#FFD700" },

    // MILES & MORE (MM)
    { programId: mmProgram!.id, code: "member", name: "Member", rank: 1, earningMultiplier: 1.0, qualificationType: "miles", benefits: ["Miles standard"], color: "#9CA3AF" },
    { programId: mmProgram!.id, code: "frequent_traveller", name: "Frequent Traveller", rank: 2, earningMultiplier: 1.25, qualificationType: "miles", requiredMiles: 35000, benefits: ["+25% miles", "Lounge access LH"], color: "#C0C0C0" },
    { programId: mmProgram!.id, code: "senator", name: "Senator", rank: 3, earningMultiplier: 1.50, qualificationType: "miles", requiredMiles: 100000, benefits: ["+50% miles", "HON Circle éligible", "Accès tous les lounges"], color: "#FFD700" },
    { programId: mmProgram!.id, code: "hon_circle", name: "HON Circle", rank: 4, earningMultiplier: 2.0, qualificationType: "miles", requiredMiles: 600000, benefits: ["×2 miles", "Service privé", "Accès illimité first class lounges"], color: "#E5E4E2" },

    // SKYMILES DELTA (SK)
    { programId: skProgram!.id, code: "member", name: "Member", rank: 1, earningMultiplier: 1.0, qualificationType: "miles", benefits: ["Miles standard"], color: "#9CA3AF" },
    { programId: skProgram!.id, code: "silver", name: "Silver Medallion", rank: 2, earningMultiplier: 1.25, qualificationType: "combo", requiredMiles: 25000, requiredSpendEur: 2800, benefits: ["+25% bonus", "Upgrade prioritaire", "Bagages gratuits"], color: "#C0C0C0" },
    { programId: skProgram!.id, code: "gold", name: "Gold Medallion", rank: 3, earningMultiplier: 1.50, qualificationType: "combo", requiredMiles: 50000, requiredSpendEur: 5600, benefits: ["+50% bonus", "Lounge access", "Upgrade garanti"], color: "#FFD700" },
    { programId: skProgram!.id, code: "platinum", name: "Platinum Medallion", rank: 4, earningMultiplier: 1.75, qualificationType: "combo", requiredMiles: 75000, requiredSpendEur: 8400, benefits: ["+75% bonus", "Global Upgrade Certificates"], color: "#E5E4E2" },
    { programId: skProgram!.id, code: "diamond", name: "Diamond Medallion", rank: 5, earningMultiplier: 2.0, qualificationType: "combo", requiredMiles: 125000, requiredSpendEur: 14000, benefits: ["×2 miles", "360 Service", "Suite de luxe upgrades"], color: "#1D9E75" },

    // MILEAGEPLUS UNITED (UA)
    { programId: uaProgram!.id, code: "member", name: "Member", rank: 1, earningMultiplier: 1.0, qualificationType: "spend", benefits: ["Miles standard"], color: "#9CA3AF" },
    { programId: uaProgram!.id, code: "silver", name: "Silver", rank: 2, earningMultiplier: 1.25, qualificationType: "spend", requiredSpendEur: 11200, benefits: ["+25% PQP bonus", "Upgrade prioritaire"], color: "#C0C0C0" },
    { programId: uaProgram!.id, code: "gold", name: "Gold", rank: 3, earningMultiplier: 1.50, qualificationType: "spend", requiredSpendEur: 22400, benefits: ["+50% bonus", "United Club access"], color: "#FFD700" },
    { programId: uaProgram!.id, code: "platinum", name: "Platinum", rank: 4, earningMultiplier: 1.75, qualificationType: "spend", requiredSpendEur: 33600, benefits: ["+75% bonus", "Global Services eligible"], color: "#E5E4E2" },
    { programId: uaProgram!.id, code: "1k", name: "1K", rank: 5, earningMultiplier: 2.0, qualificationType: "spend", requiredSpendEur: 50400, benefits: ["×2 miles", "Global Services", "Dedicated 1K line"], color: "#1D9E75" },

    // AEROPLAN AIR CANADA (CA)
    { programId: caProgram!.id, code: "basic", name: "Basic", rank: 1, earningMultiplier: 1.0, qualificationType: "miles", benefits: ["Miles standard"], color: "#9CA3AF" },
    { programId: caProgram!.id, code: "25k", name: "Aeroplan 25K", rank: 2, earningMultiplier: 1.25, qualificationType: "miles", requiredMiles: 25000, benefits: ["+25% bonus", "Priority check-in"], color: "#C0C0C0" },
    { programId: caProgram!.id, code: "35k", name: "Aeroplan 35K", rank: 3, earningMultiplier: 1.50, qualificationType: "miles", requiredMiles: 35000, benefits: ["+50% bonus", "Maple Leaf Lounge"], color: "#FFD700" },
    { programId: caProgram!.id, code: "50k", name: "Aeroplan 50K", rank: 4, earningMultiplier: 1.75, qualificationType: "miles", requiredMiles: 50000, benefits: ["+75% bonus", "Upgrade priority"], color: "#E5E4E2" },
    { programId: caProgram!.id, code: "super_elite", name: "Super Elite", rank: 5, earningMultiplier: 2.0, qualificationType: "miles", requiredMiles: 100000, benefits: ["×2 miles", "All benefits maximized"], color: "#1D9E75" },
  ];

  console.log(`Creating ${statusTiers.length} status tiers...`);
  for (const tier of statusTiers) {
    await prisma.statusTier.upsert({
      where: { programId_code: { programId: tier.programId, code: tier.code } },
      update: {},
      create: tier,
    });
  }

  // ============================================
  // C) 20 EARNING OPPORTUNITIES
  // ============================================

  const opportunities = [
    { programId: fbProgram!.id, title: "Carte Amex Flying Blue", type: "credit_card", milesEstimate: 30000, milesPerMonth: 2500, confidenceScore: 90, budgetRequired: 0, monthStart: 1, isPriority: true, region: ["FR", "EU"], notes: "Bonus bienvenue 10000 + 2500/mois sur dépenses courantes" },
    { programId: fbProgram!.id, title: "Shopping Flying Blue Mall", type: "portal", milesEstimate: 12000, milesPerMonth: 1000, confidenceScore: 75, budgetRequired: 0, monthStart: 1, region: ["FR", "EU", "WORLDWIDE"], notes: "Jusqu'à 10x miles sur achats partenaires via le portail" },
    { programId: fbProgram!.id, title: "Transfert Amex MR → Flying Blue", type: "transfer", milesEstimate: 50000, confidenceScore: 85, budgetRequired: 0, monthStart: 3, region: ["WORLDWIDE"], notes: "Transfert 1:1 + bonus réguliers de 25-50%" },
    { programId: fbProgram!.id, title: "Bonus miles vol Flying Blue Gold", type: "status_run", milesEstimate: 30000, confidenceScore: 70, budgetRequired: 500, monthStart: 1, unlockedByStatus: true, requiredStatusCode: "gold", region: ["WORLDWIDE"], notes: "Avec le statut Gold, tu gagnes 1.5x sur chaque vol Flying Blue" },
    { programId: avProgram!.id, title: "Carte BA Amex Premium Plus", type: "credit_card", milesEstimate: 26000, milesPerMonth: 2000, confidenceScore: 88, budgetRequired: 250, monthStart: 1, isPriority: true, region: ["UK", "EU"], notes: "Bonus bienvenue 26000 Avios + 3 Avios/£ en dépenses" },
    { programId: avProgram!.id, title: "Shopping BA Avios eStore", type: "portal", milesEstimate: 8000, milesPerMonth: 650, confidenceScore: 70, budgetRequired: 0, monthStart: 1, region: ["UK", "WORLDWIDE"], notes: "Jusqu'à 15 Avios/£ via le portail en ligne BA" },
    { programId: mmProgram!.id, title: "Carte Miles & More Lufthansa", type: "credit_card", milesEstimate: 20000, milesPerMonth: 1500, confidenceScore: 85, budgetRequired: 89, monthStart: 1, isPriority: true, region: ["DE", "EU"], notes: "Bonus bienvenue + 1 mile/€ sur toutes les dépenses" },
    { programId: mmProgram!.id, title: "Miles & More Hotels", type: "hotel", milesEstimate: 15000, milesPerMonth: 1250, confidenceScore: 65, budgetRequired: 200, monthStart: 2, region: ["EU", "WORLDWIDE"], notes: "500-2000 miles par nuit selon l'hôtel partenaire" },
    { programId: skProgram!.id, title: "Carte Delta SkyMiles Amex", type: "credit_card", milesEstimate: 40000, milesPerMonth: 3000, confidenceScore: 90, budgetRequired: 0, monthStart: 1, isPriority: true, region: ["US"], notes: "Bonus 40k miles + 2x miles restaurants + 1x partout" },
    { programId: skProgram!.id, title: "Delta SkyMiles Dining", type: "dining", milesEstimate: 6000, milesPerMonth: 500, confidenceScore: 70, budgetRequired: 0, monthStart: 1, region: ["US"], notes: "5 miles/$ dans les restaurants participants aux US" },
    { programId: uaProgram!.id, title: "United Explorer Card", type: "credit_card", milesEstimate: 50000, milesPerMonth: 2500, confidenceScore: 88, budgetRequired: 95, monthStart: 1, isPriority: true, region: ["US"], notes: "Bonus 50k + 2x United + 2x restaurants, hôtels" },
    { programId: uaProgram!.id, title: "MileagePlus Shopping Portal", type: "portal", milesEstimate: 10000, milesPerMonth: 800, confidenceScore: 72, budgetRequired: 0, monthStart: 1, region: ["US", "WORLDWIDE"], notes: "Jusqu'à 10x miles sur 900+ marchands en ligne" },
    { programId: caProgram!.id, title: "TD Aeroplan Visa Infinite", type: "credit_card", milesEstimate: 20000, milesPerMonth: 1500, confidenceScore: 85, budgetRequired: 139, monthStart: 1, isPriority: true, region: ["CA"], notes: "Bonus bienvenue + 1.5 pts/$ en épicerie + voyage" },
    { programId: caProgram!.id, title: "Aeroplan eStore Portal", type: "portal", milesEstimate: 8000, milesPerMonth: 650, confidenceScore: 70, budgetRequired: 0, monthStart: 1, region: ["CA", "WORLDWIDE"], notes: "Miles bonus via portail sur 150+ marchands" },
    { programId: fbProgram!.id, title: "Parrainage Flying Blue", type: "referral", milesEstimate: 4000, confidenceScore: 95, budgetRequired: 0, monthStart: 1, region: ["FR", "EU", "WORLDWIDE"], notes: "2000 miles par filleul inscrit et ayant voyagé" },
    { programId: fbProgram!.id, title: "Hôtels partenaires Flying Blue", type: "hotel", milesEstimate: 10000, milesPerMonth: 800, confidenceScore: 65, budgetRequired: 150, monthStart: 2, region: ["WORLDWIDE"], notes: "500-1500 miles par nuit selon catégorie hôtel" },
    { programId: avProgram!.id, title: "Transfert Chase UR → Avios", type: "transfer", milesEstimate: 40000, confidenceScore: 80, budgetRequired: 0, monthStart: 3, region: ["US"], notes: "Transfert 1:1 depuis Chase Ultimate Rewards" },
    { programId: mmProgram!.id, title: "Parrainage Miles & More", type: "referral", milesEstimate: 3000, confidenceScore: 90, budgetRequired: 0, monthStart: 1, region: ["DE", "EU"], notes: "1500 miles par ami inscrit" },
    { programId: skProgram!.id, title: "Transfert Amex MR → SkyMiles", type: "transfer", milesEstimate: 30000, confidenceScore: 78, budgetRequired: 0, monthStart: 3, region: ["US", "WORLDWIDE"], notes: "Transfert 1:1 + bonus promotionnels fréquents" },
    { programId: uaProgram!.id, title: "United MileagePlus Dining", type: "dining", milesEstimate: 5000, milesPerMonth: 400, confidenceScore: 68, budgetRequired: 0, monthStart: 1, region: ["US"], notes: "5 miles/$ dans restaurants participants" },
  ];

  console.log(`Creating ${opportunities.length} earning opportunities...`);
  for (const opp of opportunities) {
    await prisma.earningOpportunity.create({ data: opp });
  }

  // ============================================
  // SUMMARY
  // ============================================

  const programCount = await prisma.program.count();
  const tierCount = await prisma.statusTier.count();
  const oppCount = await prisma.earningOpportunity.count();

  console.log("\n=== SEED COMPLETE ===");
  console.log(`Programs: ${programCount}`);
  console.log(`StatusTiers: ${tierCount}`);
  console.log(`EarningOpportunities: ${oppCount}`);

  const fbTiers = await prisma.statusTier.findMany({
    where: { program: { code: "FB" } },
    orderBy: { rank: "asc" },
  });
  console.log("\nFlying Blue StatusTiers:");
  for (const t of fbTiers) {
    console.log(`  ${t.code} (rank ${t.rank}) — multiplier ${t.earningMultiplier}x`);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
