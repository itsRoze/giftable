-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_WishlistItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "WishlistItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_WishlistItem" ("id", "name", "url", "userId") SELECT "id", "name", "url", "userId" FROM "WishlistItem";
DROP TABLE "WishlistItem";
ALTER TABLE "new_WishlistItem" RENAME TO "WishlistItem";
CREATE TABLE "new_Friend" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "requesterId" TEXT NOT NULL,
    "requestedId" TEXT NOT NULL,
    CONSTRAINT "Friend_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Friend_requestedId_fkey" FOREIGN KEY ("requestedId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Friend" ("id", "requestedId", "requesterId", "status") SELECT "id", "requestedId", "requesterId", "status" FROM "Friend";
DROP TABLE "Friend";
ALTER TABLE "new_Friend" RENAME TO "Friend";
CREATE UNIQUE INDEX "Friend_requesterId_requestedId_key" ON "Friend"("requesterId", "requestedId");
CREATE TABLE "new_GiftIdea" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "giftFromUserId" TEXT NOT NULL,
    "giftToUserId" TEXT NOT NULL,
    CONSTRAINT "GiftIdea_giftFromUserId_fkey" FOREIGN KEY ("giftFromUserId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "GiftIdea_giftToUserId_fkey" FOREIGN KEY ("giftToUserId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_GiftIdea" ("giftFromUserId", "giftToUserId", "id", "name", "url") SELECT "giftFromUserId", "giftToUserId", "id", "name", "url" FROM "GiftIdea";
DROP TABLE "GiftIdea";
ALTER TABLE "new_GiftIdea" RENAME TO "GiftIdea";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
