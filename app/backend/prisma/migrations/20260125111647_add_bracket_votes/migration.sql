-- CreateTable
CREATE TABLE "BracketVote" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BracketVote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BracketVote_matchId_deviceId_key" ON "BracketVote"("matchId", "deviceId");

-- AddForeignKey
ALTER TABLE "BracketVote" ADD CONSTRAINT "BracketVote_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "BracketMatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;
