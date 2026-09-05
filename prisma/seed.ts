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

  const amexMrProgram = await prisma.program.findUnique({ where: { code: "AMEX_MR" } });
  const chaseUrProgram = await prisma.program.findUnique({ where: { code: "CHASE_UR" } });
  const mrProgram = await prisma.program.findUnique({ where: { code: "MR" } });
  const hhProgram = await prisma.program.findUnique({ where: { code: "HH" } });
  const acAccorProgram = await prisma.program.findUnique({ where: { code: "AC_ACCOR" } });
  const tkProgram = await prisma.program.findUnique({ where: { code: "TK" } });
  const sqProgram = await prisma.program.findUnique({ where: { code: "SQ" } });
  const hyProgram = await prisma.program.findUnique({ where: { code: "HY" } });

  const opportunities = [
    { programId: amexMrProgram!.id, title: "Amex Platine France — Bonus bienvenue", type: "credit_card", milesEstimate: 150000, confidenceScore: 85, budgetRequired: 150000, monthStart: 1, isPriority: true, region: ["EU", "FR"], notes: "Bonus de 150 000 MR (= 150 000 Flying Blue après transfert 1:1). Condition : dépenser 4 000€ dans les 3 premiers mois. Cotisation 1 590€/an mais inclut lounge, assurances, crédits voyage. Éligibilité : revenus > 50 000€/an, pas d'Amex active depuis 24 mois. Délai d'obtention : 8-12 semaines après la condition remplie." },
    { programId: amexMrProgram!.id, title: "Amex Gold France — Bonus bienvenue", type: "credit_card", milesEstimate: 60000, confidenceScore: 85, budgetRequired: 18000, monthStart: 1, isPriority: true, region: ["EU", "FR"], notes: "Bonus de 60 000 MR (= 60 000 Flying Blue). Condition : dépenser 2 000€ dans les 3 premiers mois. Cotisation 180€/an. Éligibilité : revenus > 25 000€/an, pas d'Amex Gold active. Incompatible avec l'Amex Platine (choisir l'un ou l'autre)." },
    { programId: fbProgram!.id, title: "Flying Blue Portail Shopping", type: "portal", milesEstimate: 0, milesPerMonth: 800, confidenceScore: 90, budgetRequired: 0, monthStart: 1, isPriority: true, region: ["EU", "FR", "WORLDWIDE"], notes: "Passer ses achats en ligne par le portail Flying Blue Shopping. En moyenne 3-5 miles par euro. Activer via flyingblue.com/shopping. Valable pour ASOS, Booking, Cdiscount, Fnac, et 200+ boutiques. Délai : miles crédités sous 30 jours." },
    { programId: fbProgram!.id, title: "Transfert Amex MR → Flying Blue (ratio 1:1)", type: "transfer", milesEstimate: 50000, confidenceScore: 95, budgetRequired: 0, monthStart: 1, isPriority: true, region: ["WORLDWIDE"], notes: "Transfert immédiat de tes points Amex Membership Rewards vers Flying Blue. Ratio 1:1 (1 MR = 1 mile FB). Minimum 1 000 points. Sans frais. Prendre avantage des bonus de transfert périodiques (+25% à +100%) pour maximiser. Délai : instantané." },
    { programId: fbProgram!.id, title: "Carte Visa Infinite BNP / LCL — Miles Flying Blue", type: "credit_card", milesEstimate: 25000, confidenceScore: 75, budgetRequired: 30000, monthStart: 2, isPriority: false, region: ["EU", "FR"], notes: "Cartes co-brandées Flying Blue chez BNP Paribas ou LCL. Offre de bienvenue : 10 000 à 25 000 miles selon la banque. Cumul : 1,5 miles par euro dépensé. Cotisation 300€/an environ. Vérifier l'offre actuelle sur flyingblue.com/carte." },
    { programId: fbProgram!.id, title: "Programme Dining Flying Blue", type: "dining", milesEstimate: 0, milesPerMonth: 450, confidenceScore: 85, budgetRequired: 0, monthStart: 1, isPriority: false, region: ["EU", "FR"], notes: "Inscription gratuite au programme Flying Blue Dining. Délai : miles crédités automatiquement quand tu paies avec ta carte liée dans les restaurants partenaires. En moyenne 3 miles par euro. Restaurants partenaires : vérifier l'app Flying Blue pour la liste locale." },
    { programId: mrProgram!.id, title: "Transfert Marriott Bonvoy → Flying Blue", type: "hotel", milesEstimate: 20000, confidenceScore: 70, budgetRequired: 0, monthStart: 1, isPriority: false, region: ["WORLDWIDE"], notes: "Convertir tes points Marriott Bonvoy en miles Flying Blue. Ratio : 3 points Marriott = 1 mile FB. Bonus : pour chaque 60 000 points transférés, 5 000 miles bonus offerts. Minimum 10 000 points. Délai : 2-3 semaines." },
    { programId: fbProgram!.id, title: "Parrainage Flying Blue — 3 filleuls", type: "referral", milesEstimate: 6000, confidenceScore: 65, budgetRequired: 0, monthStart: 2, isPriority: false, region: ["WORLDWIDE"], notes: "2 000 miles par personne parrainée qui effectue un premier vol. Objectif réaliste : 3 filleuls = 6 000 miles. Partager le lien de parrainage depuis l'app Flying Blue. Délai : miles crédités 6 semaines après le vol du filleul." },
    { programId: acAccorProgram!.id, title: "Séjours Accor → Miles Flying Blue", type: "hotel", milesEstimate: 12000, confidenceScore: 75, budgetRequired: 0, monthStart: 1, isPriority: false, region: ["EU", "FR", "WORLDWIDE"], notes: "Choisir de convertir tes points Accor en miles Flying Blue. 2 000 points Accor = 1 000 miles FB. Activer le lien ALL - Flying Blue dans ton profil Accor. Idéal si tu voyages régulièrement avec Accor (ibis, Novotel, Pullman)." },
    { programId: amexMrProgram!.id, title: "Amex Platine — Lounge + Travel Credits (valeur indirecte)", type: "credit_card", milesEstimate: 30000, confidenceScore: 70, budgetRequired: 0, monthStart: 1, isPriority: false, region: ["EU", "FR"], notes: "En plus du bonus bienvenue, l'Amex Platine donne 200€ de crédits voyage/an (= économie cash) + accès 1 300 salons airport worldwide. Valeur indirecte estimée en miles : 30 000 (si économies réinvesties en achats qui génèrent des miles)." },
    { programId: chaseUrProgram!.id, title: "Chase Sapphire Preferred — Welcome Bonus", type: "credit_card", milesEstimate: 75000, confidenceScore: 90, budgetRequired: 0, monthStart: 1, isPriority: true, region: ["US"], notes: "75 000 Ultimate Rewards après 4 000$ de dépenses en 3 mois. Transfert 1:1 vers United, Hyatt, BA Avios, etc. Cotisation 95$/an. Éligibilité : bon historique crédit US (700+ score). Le meilleur rapport bonus/cotisation pour commencer." },
    { programId: amexMrProgram!.id, title: "Amex Platinum USA — Welcome Offer", type: "credit_card", milesEstimate: 150000, confidenceScore: 85, budgetRequired: 0, monthStart: 1, isPriority: true, region: ["US"], notes: "150 000 MR après 8 000$ en 6 mois. Transfert vers Delta, Air France, Singapore, etc. Cotisation 695$/an mais 1 500$+ de crédits annuels. Éligibilité : revenus stables, pas d'Amex Plat depuis 7 ans." },
    { programId: skProgram!.id, title: "Delta SkyMiles Amex Platinum — Welcome", type: "credit_card", milesEstimate: 90000, confidenceScore: 80, budgetRequired: 0, monthStart: 1, isPriority: true, region: ["US"], notes: "90 000 miles + 10 000 MQM après 5 000$ en 6 mois. Les MQM comptent vers le statut Medallion. Cotisation 350$/an. Check-in bagage gratuit, accès Delta Sky Club. Meilleur pour viser le Silver Medallion." },
    { programId: caProgram!.id, title: "Aeroplan — Carte TD ou CIBC", type: "credit_card", milesEstimate: 60000, confidenceScore: 80, budgetRequired: 0, monthStart: 1, isPriority: true, region: ["CA"], notes: "60 000 miles Aeroplan après condition de dépenses. Transfert Star Alliance (United, Lufthansa, Singapore). Cotisation 139$/an CAD. Meilleur point d'entrée pour accumuler Aeroplan au Canada." },
    { programId: sqProgram!.id, title: "Singapore Airlines KrisFlyer — Carte Standard Chartered", type: "credit_card", milesEstimate: 50000, confidenceScore: 75, budgetRequired: 0, monthStart: 1, isPriority: true, region: ["SG", "ASIA"], notes: "50 000 miles KrisFlyer avec la carte Standard Chartered Journey. Dépenses : 3 miles par SGD. Transfert Star Alliance partenaires. Idéal pour vols Asie-Pacifique en Business." },
    { programId: tkProgram!.id, title: "Turkish Miles&Smiles — Bonus partenaires", type: "transfer", milesEstimate: 35000, confidenceScore: 65, budgetRequired: 0, monthStart: 1, isPriority: false, region: ["TR", "EU", "WORLDWIDE"], notes: "Miles&Smiles a des partenaires de transfert intéressants avec des ratios favorables. Certains bonus périodiques jusqu'à +40%. Réseau Star Alliance complet. Idéal pour vols vers la Turquie ou les destinations Star Alliance depuis Istanbul." },
    { programId: hhProgram!.id, title: "Hilton Honors — Amex Surpass Card", type: "credit_card", milesEstimate: 130000, confidenceScore: 80, budgetRequired: 0, monthStart: 1, isPriority: false, region: ["US", "WORLDWIDE"], notes: "130 000 points Hilton après 3 000$ en 6 mois. 1 nuit gratuite par an. Cotisation 150$/an. Conversion possible vers miles airline (taux défavorable — mieux d'utiliser en nuits d'hôtel). Valeur maximale en nuits Hilton." },
    { programId: hyProgram!.id, title: "World of Hyatt — Chase Card", type: "credit_card", milesEstimate: 30000, confidenceScore: 80, budgetRequired: 0, monthStart: 1, isPriority: false, region: ["US", "WORLDWIDE"], notes: "30 000 points Hyatt après 3 000$ en 3 mois. Cotisation 95$/an. 1 nuit gratuite de catégorie 1-4 par an. Points Hyatt parmi les plus précieux (1 point ≈ 2,5¢). Idéal pour nuits d'hôtel de luxe à petit prix." },
    { programId: fbProgram!.id, title: "Flying Blue — Vols bonus statut Silver", type: "status_run", milesEstimate: 25000, confidenceScore: 80, budgetRequired: 0, monthStart: 1, isPriority: false, unlockedByStatus: false, region: ["EU", "WORLDWIDE"], notes: "Si tu es proche du statut Silver Flying Blue (25 000 XP ou 40 segments), effectuer des vols courts stratégiques peut te faire monter de niveau. Avec Silver, tu gagnes 25% de miles bonus sur tous tes vols futurs. Calcul à faire : coût du vol court vs gain sur 12 mois." },
    { programId: avProgram!.id, title: "Carte Avios — British Airways American Express", type: "credit_card", milesEstimate: 25000, confidenceScore: 75, budgetRequired: 0, monthStart: 3, isPriority: false, region: ["EU", "UK", "WORLDWIDE"], notes: "25 000 Avios de bienvenue après 3 000£ en 3 mois. 1 Avios par £1 dépensé. Companion voucher après 10 000£/an (2 vols pour le prix d'un). Cotisation 195£/an. Idéal si tu voyages souvent vers UK ou avec British Airways." },
  ];

  console.log("Deleting old earning opportunities...");
  await prisma.earningOpportunity.deleteMany({});
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
