-- CreateTable
CREATE TABLE "Program" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "parentName" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "alliance" TEXT,
    "region" TEXT[],
    "badgeBg" TEXT NOT NULL,
    "badgeText" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Program_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StatusTier" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "earningMultiplier" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "qualificationType" TEXT NOT NULL DEFAULT 'miles',
    "requiredMiles" INTEGER,
    "requiredSegments" INTEGER,
    "requiredSpendEur" INTEGER,
    "periodMonths" INTEGER NOT NULL DEFAULT 12,
    "benefits" TEXT[],
    "color" TEXT NOT NULL DEFAULT '#1D9E75',
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "StatusTier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProgramStatus" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "currentTierId" TEXT,
    "currentQualifyingMiles" INTEGER NOT NULL DEFAULT 0,
    "currentQualifyingSegments" INTEGER NOT NULL DEFAULT 0,
    "currentQualifyingSpend" INTEGER NOT NULL DEFAULT 0,
    "tierValidUntil" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserProgramStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deal" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "milesMax" INTEGER,
    "bonusPercent" INTEGER,
    "sourceUrl" TEXT NOT NULL,
    "affiliateUrl" TEXT,
    "expiresAt" TIMESTAMP(3),
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isHot" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "detectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Deal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EarningOpportunity" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "milesEstimate" INTEGER NOT NULL,
    "milesPerMonth" INTEGER,
    "confidenceScore" INTEGER NOT NULL DEFAULT 50,
    "budgetRequired" INTEGER,
    "monthStart" INTEGER NOT NULL DEFAULT 1,
    "isPriority" BOOLEAN NOT NULL DEFAULT false,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "region" TEXT[] DEFAULT ARRAY['WORLDWIDE']::TEXT[],
    "notes" TEXT,
    "requiredStatusCode" TEXT,
    "unlockedByStatus" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "EarningOpportunity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAlert" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT,
    "programIds" TEXT[],
    "threshold" INTEGER NOT NULL DEFAULT 30,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserAlert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlertLog" (
    "id" TEXT NOT NULL,
    "alertId" TEXT NOT NULL,
    "dealId" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AlertLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Program_code_key" ON "Program"("code");

-- CreateIndex
CREATE UNIQUE INDEX "StatusTier_programId_code_key" ON "StatusTier"("programId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "UserProgramStatus_email_programId_key" ON "UserProgramStatus"("email", "programId");

-- CreateIndex
CREATE UNIQUE INDEX "AlertLog_alertId_dealId_key" ON "AlertLog"("alertId", "dealId");

-- AddForeignKey
ALTER TABLE "StatusTier" ADD CONSTRAINT "StatusTier_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProgramStatus" ADD CONSTRAINT "UserProgramStatus_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProgramStatus" ADD CONSTRAINT "UserProgramStatus_currentTierId_fkey" FOREIGN KEY ("currentTierId") REFERENCES "StatusTier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deal" ADD CONSTRAINT "Deal_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EarningOpportunity" ADD CONSTRAINT "EarningOpportunity_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlertLog" ADD CONSTRAINT "AlertLog_alertId_fkey" FOREIGN KEY ("alertId") REFERENCES "UserAlert"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlertLog" ADD CONSTRAINT "AlertLog_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "Deal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
