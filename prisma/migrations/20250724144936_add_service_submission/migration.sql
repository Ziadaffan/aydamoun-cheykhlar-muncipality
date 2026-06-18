-- CreateTable
CREATE TABLE "ServiceSubmission" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "address" TEXT NOT NULL,
    "description" TEXT,
    "additionalInfo" JSONB NOT NULL,
    "status" "ServiceStatus" NOT NULL DEFAULT 'PENDING',
    "userId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceSubmission_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ServiceSubmission" ADD CONSTRAINT "ServiceSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceSubmission" ADD CONSTRAINT "ServiceSubmission_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
