-- CreateTable
CREATE TABLE "NetworkingMatch" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "registrationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "personDescription" TEXT NOT NULL,
    "matchReason" TEXT NOT NULL,

    CONSTRAINT "NetworkingMatch_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "NetworkingMatch" ADD CONSTRAINT "NetworkingMatch_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NetworkingMatch" ADD CONSTRAINT "NetworkingMatch_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NetworkingMatch" ADD CONSTRAINT "NetworkingMatch_registrationId_fkey" FOREIGN KEY ("registrationId") REFERENCES "EventRegistration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
