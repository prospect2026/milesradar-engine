-- CreateTable
CREATE TABLE "ClientProfile" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "country" TEXT NOT NULL DEFAULT 'FR',
    "region" TEXT NOT NULL DEFAULT 'EU',
    "hasAmexGold" BOOLEAN NOT NULL DEFAULT false,
    "hasAmexPlatine" BOOLEAN NOT NULL DEFAULT false,
    "hasVisaInfinite" BOOLEAN NOT NULL DEFAULT false,
    "hasMarriottCard" BOOLEAN NOT NULL DEFAULT false,
    "hasHiltonCard" BOOLEAN NOT NULL DEFAULT false,
    "hasAirlineCard" BOOLEAN NOT NULL DEFAULT false,
    "hasChaseCard" BOOLEAN NOT NULL DEFAULT false,
    "hasCitiCard" BOOLEAN NOT NULL DEFAULT false,
    "monthlySpendEur" INTEGER NOT NULL DEFAULT 1000,
    "flightsPerYear" INTEGER NOT NULL DEFAULT 4,
    "preferredCabin" TEXT NOT NULL DEFAULT 'business',
    "targetProgramCode" TEXT,
    "targetMiles" INTEGER,
    "deadlineMonths" INTEGER,
    "budgetMonthly" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PortfolioBalance" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PortfolioBalance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClientProfile_email_key" ON "ClientProfile"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PortfolioBalance_email_programId_key" ON "PortfolioBalance"("email", "programId");

-- AddForeignKey
ALTER TABLE "PortfolioBalance" ADD CONSTRAINT "PortfolioBalance_email_fkey" FOREIGN KEY ("email") REFERENCES "ClientProfile"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortfolioBalance" ADD CONSTRAINT "PortfolioBalance_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
