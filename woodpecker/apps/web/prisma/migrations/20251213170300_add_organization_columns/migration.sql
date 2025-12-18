-- CreateTable
CREATE TABLE "Legacy" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "description" TEXT,
    "organizationId" TEXT,
    "professionalId" TEXT,
    "executorId" TEXT,
    "completionPercentage" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Legacy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EstateTask" (
    "id" TEXT NOT NULL,
    "legacyId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'backlog',
    "assignee" TEXT,
    "beneficiary" TEXT,
    "documentId" TEXT,
    "deadlineType" TEXT,
    "dueDate" TIMESTAMP(3),
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EstateTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "clerkUserId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "avatarUrl" TEXT,
    "organizationId" TEXT,
    "subscriptionTier" TEXT,
    "subscriptionStatus" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Professional" (
    "id" TEXT NOT NULL,
    "clerkUserId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "firmName" TEXT,
    "licenseNumber" TEXT,
    "role" TEXT NOT NULL DEFAULT 'lawyer',
    "organizationId" TEXT,
    "subscriptionTier" TEXT,
    "subscriptionStatus" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Professional_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamMember" (
    "id" TEXT NOT NULL,
    "professionalId" TEXT NOT NULL,
    "subAccountId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'member',
    "permissions" TEXT[],
    "status" TEXT NOT NULL DEFAULT 'active',
    "invitedBy" TEXT,
    "invitedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "joinedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Executor" (
    "id" TEXT NOT NULL,
    "clerkUserId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Executor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invitation" (
    "id" TEXT NOT NULL,
    "inviterId" TEXT NOT NULL,
    "inviterType" TEXT NOT NULL,
    "recipientEmail" TEXT NOT NULL,
    "recipientId" TEXT,
    "recipientType" TEXT NOT NULL,
    "legacyId" TEXT,
    "accessLevel" TEXT NOT NULL DEFAULT 'view',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "token" TEXT NOT NULL,
    "professionalId" TEXT,
    "recipientProfessionalId" TEXT,
    "executorId" TEXT,
    "expiresAt" TIMESTAMP(3),
    "acceptedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Memory" (
    "id" TEXT NOT NULL,
    "legacyId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "audioUrl" TEXT,
    "transcript" TEXT,
    "photos" TEXT[],
    "scheduledRelease" TIMESTAMP(3),
    "releasedTo" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Memory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "legacyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "sharedWith" TEXT[],
    "accessLevel" TEXT NOT NULL DEFAULT 'view',
    "fileSize" INTEGER,
    "mimeType" TEXT,
    "signedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Beneficiary" (
    "id" TEXT NOT NULL,
    "legacyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "relationship" TEXT NOT NULL,
    "phone" TEXT,
    "allocation" DOUBLE PRECISION,
    "allocationType" TEXT,
    "contactInfo" JSONB,
    "hasAccess" BOOLEAN NOT NULL DEFAULT false,
    "accessToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Beneficiary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Execution" (
    "id" TEXT NOT NULL,
    "legacyId" TEXT NOT NULL,
    "executorId" TEXT NOT NULL,
    "executorName" TEXT,
    "executorEmail" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "deathVerified" BOOLEAN NOT NULL DEFAULT false,
    "deathCertificateUrl" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "verifiedBy" TEXT,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "serviceTier" TEXT,
    "serviceCost" DOUBLE PRECISION,
    "stepsCompleted" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Execution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transmission" (
    "id" TEXT NOT NULL,
    "legacyId" TEXT NOT NULL,
    "memoryId" TEXT,
    "documentId" TEXT,
    "recipientId" TEXT NOT NULL,
    "recipientEmail" TEXT,
    "scheduledDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "sentAt" TIMESTAMP(3),
    "openedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userType" TEXT NOT NULL,
    "organizationId" TEXT,
    "tier" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "payfastSubscriptionId" TEXT,
    "payfastToken" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'ZAR',
    "interval" TEXT NOT NULL,
    "currentPeriodStart" TIMESTAMP(3),
    "currentPeriodEnd" TIMESTAMP(3),
    "cancelAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "subscriptionId" TEXT,
    "userId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'ZAR',
    "payfastPaymentId" TEXT,
    "payfastSignature" TEXT,
    "status" TEXT NOT NULL,
    "itemName" TEXT,
    "description" TEXT,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankAccount" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userType" TEXT NOT NULL DEFAULT 'client',
    "organizationId" TEXT,
    "stitchAccountId" TEXT,
    "stitchAccessToken" TEXT,
    "stitchLinkToken" TEXT,
    "accountName" TEXT NOT NULL,
    "accountType" TEXT NOT NULL,
    "bankName" TEXT,
    "accountNumber" TEXT,
    "balance" DOUBLE PRECISION,
    "currency" TEXT NOT NULL DEFAULT 'ZAR',
    "status" TEXT NOT NULL DEFAULT 'connected',
    "lastSyncedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BankAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "transactionId" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'ZAR',
    "category" TEXT,
    "subcategory" TEXT,
    "description" TEXT,
    "merchant" TEXT,
    "type" TEXT NOT NULL,
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "tags" TEXT[],
    "notes" TEXT,
    "source" TEXT NOT NULL DEFAULT 'manual',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinancialProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accountId" TEXT,
    "age" INTEGER,
    "location" TEXT,
    "occupation" TEXT,
    "skills" TEXT[],
    "monthlyIncome" DOUBLE PRECISION,
    "monthlyExpenses" DOUBLE PRECISION,
    "savingsRate" DOUBLE PRECISION,
    "totalSavings" DOUBLE PRECISION,
    "ageGroup" TEXT,
    "lifestyleType" TEXT,
    "financialHealthScore" INTEGER,
    "lastAnalyzedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinancialProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinancialInsight" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "insights" JSONB NOT NULL,
    "skills" JSONB NOT NULL,
    "earningOpportunities" JSONB NOT NULL,
    "warnings" JSONB NOT NULL,
    "weeklyRoutine" TEXT,
    "projected30Days" DOUBLE PRECISION,
    "projected60Days" DOUBLE PRECISION,
    "projected90Days" DOUBLE PRECISION,
    "analyzedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataSnapshot" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinancialInsight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "participant1Id" TEXT NOT NULL,
    "participant2Id" TEXT NOT NULL,
    "lastMessageAt" TIMESTAMP(3),
    "lastMessage" TEXT,
    "unreadCount1" INTEGER NOT NULL DEFAULT 0,
    "unreadCount2" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userType" TEXT NOT NULL DEFAULT 'client',
    "organizationId" TEXT,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "color" TEXT,
    "link" TEXT,
    "resourceType" TEXT,
    "resourceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Legacy_clientId_idx" ON "Legacy"("clientId");

-- CreateIndex
CREATE INDEX "Legacy_organizationId_idx" ON "Legacy"("organizationId");

-- CreateIndex
CREATE INDEX "Legacy_professionalId_idx" ON "Legacy"("professionalId");

-- CreateIndex
CREATE INDEX "Legacy_executorId_idx" ON "Legacy"("executorId");

-- CreateIndex
CREATE INDEX "EstateTask_legacyId_idx" ON "EstateTask"("legacyId");

-- CreateIndex
CREATE INDEX "EstateTask_status_idx" ON "EstateTask"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Client_clerkUserId_key" ON "Client"("clerkUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Client_email_key" ON "Client"("email");

-- CreateIndex
CREATE INDEX "Client_clerkUserId_idx" ON "Client"("clerkUserId");

-- CreateIndex
CREATE INDEX "Client_organizationId_idx" ON "Client"("organizationId");

-- CreateIndex
CREATE INDEX "Client_email_idx" ON "Client"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Professional_clerkUserId_key" ON "Professional"("clerkUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Professional_email_key" ON "Professional"("email");

-- CreateIndex
CREATE INDEX "Professional_clerkUserId_idx" ON "Professional"("clerkUserId");

-- CreateIndex
CREATE INDEX "Professional_organizationId_idx" ON "Professional"("organizationId");

-- CreateIndex
CREATE INDEX "Professional_role_idx" ON "Professional"("role");

-- CreateIndex
CREATE UNIQUE INDEX "TeamMember_subAccountId_key" ON "TeamMember"("subAccountId");

-- CreateIndex
CREATE INDEX "TeamMember_professionalId_idx" ON "TeamMember"("professionalId");

-- CreateIndex
CREATE INDEX "TeamMember_subAccountId_idx" ON "TeamMember"("subAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "TeamMember_professionalId_subAccountId_key" ON "TeamMember"("professionalId", "subAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Executor_clerkUserId_key" ON "Executor"("clerkUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Executor_email_key" ON "Executor"("email");

-- CreateIndex
CREATE INDEX "Executor_clerkUserId_idx" ON "Executor"("clerkUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Invitation_token_key" ON "Invitation"("token");

-- CreateIndex
CREATE INDEX "Invitation_recipientEmail_idx" ON "Invitation"("recipientEmail");

-- CreateIndex
CREATE INDEX "Invitation_token_idx" ON "Invitation"("token");

-- CreateIndex
CREATE INDEX "Invitation_status_idx" ON "Invitation"("status");

-- CreateIndex
CREATE INDEX "Invitation_legacyId_idx" ON "Invitation"("legacyId");

-- CreateIndex
CREATE INDEX "Memory_legacyId_idx" ON "Memory"("legacyId");

-- CreateIndex
CREATE INDEX "Memory_scheduledRelease_idx" ON "Memory"("scheduledRelease");

-- CreateIndex
CREATE INDEX "Document_legacyId_idx" ON "Document"("legacyId");

-- CreateIndex
CREATE INDEX "Document_category_idx" ON "Document"("category");

-- CreateIndex
CREATE INDEX "Document_status_idx" ON "Document"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Beneficiary_accessToken_key" ON "Beneficiary"("accessToken");

-- CreateIndex
CREATE INDEX "Beneficiary_legacyId_idx" ON "Beneficiary"("legacyId");

-- CreateIndex
CREATE INDEX "Beneficiary_email_idx" ON "Beneficiary"("email");

-- CreateIndex
CREATE INDEX "Execution_legacyId_idx" ON "Execution"("legacyId");

-- CreateIndex
CREATE INDEX "Execution_executorId_idx" ON "Execution"("executorId");

-- CreateIndex
CREATE INDEX "Execution_status_idx" ON "Execution"("status");

-- CreateIndex
CREATE INDEX "Transmission_legacyId_idx" ON "Transmission"("legacyId");

-- CreateIndex
CREATE INDEX "Transmission_scheduledDate_idx" ON "Transmission"("scheduledDate");

-- CreateIndex
CREATE INDEX "Transmission_status_idx" ON "Transmission"("status");

-- CreateIndex
CREATE INDEX "Subscription_userId_idx" ON "Subscription"("userId");

-- CreateIndex
CREATE INDEX "Subscription_organizationId_idx" ON "Subscription"("organizationId");

-- CreateIndex
CREATE INDEX "Subscription_status_idx" ON "Subscription"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_payfastPaymentId_key" ON "Payment"("payfastPaymentId");

-- CreateIndex
CREATE INDEX "Payment_userId_idx" ON "Payment"("userId");

-- CreateIndex
CREATE INDEX "Payment_status_idx" ON "Payment"("status");

-- CreateIndex
CREATE INDEX "Payment_payfastPaymentId_idx" ON "Payment"("payfastPaymentId");

-- CreateIndex
CREATE UNIQUE INDEX "BankAccount_stitchAccountId_key" ON "BankAccount"("stitchAccountId");

-- CreateIndex
CREATE INDEX "BankAccount_userId_idx" ON "BankAccount"("userId");

-- CreateIndex
CREATE INDEX "BankAccount_organizationId_idx" ON "BankAccount"("organizationId");

-- CreateIndex
CREATE INDEX "BankAccount_status_idx" ON "BankAccount"("status");

-- CreateIndex
CREATE INDEX "BankAccount_stitchAccountId_idx" ON "BankAccount"("stitchAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_transactionId_key" ON "Transaction"("transactionId");

-- CreateIndex
CREATE INDEX "Transaction_accountId_idx" ON "Transaction"("accountId");

-- CreateIndex
CREATE INDEX "Transaction_date_idx" ON "Transaction"("date");

-- CreateIndex
CREATE INDEX "Transaction_category_idx" ON "Transaction"("category");

-- CreateIndex
CREATE INDEX "Transaction_type_idx" ON "Transaction"("type");

-- CreateIndex
CREATE INDEX "Transaction_transactionId_idx" ON "Transaction"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "FinancialProfile_userId_key" ON "FinancialProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "FinancialProfile_accountId_key" ON "FinancialProfile"("accountId");

-- CreateIndex
CREATE INDEX "FinancialProfile_userId_idx" ON "FinancialProfile"("userId");

-- CreateIndex
CREATE INDEX "FinancialInsight_profileId_idx" ON "FinancialInsight"("profileId");

-- CreateIndex
CREATE INDEX "FinancialInsight_analyzedAt_idx" ON "FinancialInsight"("analyzedAt");

-- CreateIndex
CREATE INDEX "Conversation_participant1Id_idx" ON "Conversation"("participant1Id");

-- CreateIndex
CREATE INDEX "Conversation_participant2Id_idx" ON "Conversation"("participant2Id");

-- CreateIndex
CREATE INDEX "Conversation_lastMessageAt_idx" ON "Conversation"("lastMessageAt");

-- CreateIndex
CREATE UNIQUE INDEX "Conversation_participant1Id_participant2Id_key" ON "Conversation"("participant1Id", "participant2Id");

-- CreateIndex
CREATE INDEX "Message_conversationId_idx" ON "Message"("conversationId");

-- CreateIndex
CREATE INDEX "Message_senderId_idx" ON "Message"("senderId");

-- CreateIndex
CREATE INDEX "Message_createdAt_idx" ON "Message"("createdAt");

-- CreateIndex
CREATE INDEX "Activity_userId_idx" ON "Activity"("userId");

-- CreateIndex
CREATE INDEX "Activity_organizationId_idx" ON "Activity"("organizationId");

-- CreateIndex
CREATE INDEX "Activity_type_idx" ON "Activity"("type");

-- CreateIndex
CREATE INDEX "Activity_createdAt_idx" ON "Activity"("createdAt");

-- CreateIndex
CREATE INDEX "Activity_resourceType_resourceId_idx" ON "Activity"("resourceType", "resourceId");

-- AddForeignKey
ALTER TABLE "Legacy" ADD CONSTRAINT "Legacy_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Legacy" ADD CONSTRAINT "Legacy_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "Professional"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Legacy" ADD CONSTRAINT "Legacy_executorId_fkey" FOREIGN KEY ("executorId") REFERENCES "Executor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EstateTask" ADD CONSTRAINT "EstateTask_legacyId_fkey" FOREIGN KEY ("legacyId") REFERENCES "Legacy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "Professional"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_subAccountId_fkey" FOREIGN KEY ("subAccountId") REFERENCES "Professional"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_legacyId_fkey" FOREIGN KEY ("legacyId") REFERENCES "Legacy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "Professional"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_recipientProfessionalId_fkey" FOREIGN KEY ("recipientProfessionalId") REFERENCES "Professional"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_executorId_fkey" FOREIGN KEY ("executorId") REFERENCES "Executor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Memory" ADD CONSTRAINT "Memory_legacyId_fkey" FOREIGN KEY ("legacyId") REFERENCES "Legacy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_legacyId_fkey" FOREIGN KEY ("legacyId") REFERENCES "Legacy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Beneficiary" ADD CONSTRAINT "Beneficiary_legacyId_fkey" FOREIGN KEY ("legacyId") REFERENCES "Legacy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Execution" ADD CONSTRAINT "Execution_legacyId_fkey" FOREIGN KEY ("legacyId") REFERENCES "Legacy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "BankAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinancialProfile" ADD CONSTRAINT "FinancialProfile_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "BankAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinancialInsight" ADD CONSTRAINT "FinancialInsight_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "FinancialProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
