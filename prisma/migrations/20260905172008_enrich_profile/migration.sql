-- AlterTable
ALTER TABLE "ClientProfile" ADD COLUMN     "annualIncomeRange" TEXT,
ADD COLUMN     "aviosStatus" TEXT,
ADD COLUMN     "departureCity" TEXT,
ADD COLUMN     "flyingBlueStatus" TEXT,
ADD COLUMN     "hasExistingAmex" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hiltonStatus" TEXT,
ADD COLUMN     "isHomeowner" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "mainAirline" TEXT,
ADD COLUMN     "mainBank" TEXT,
ADD COLUMN     "marriottStatus" TEXT,
ADD COLUMN     "travelType" TEXT;
