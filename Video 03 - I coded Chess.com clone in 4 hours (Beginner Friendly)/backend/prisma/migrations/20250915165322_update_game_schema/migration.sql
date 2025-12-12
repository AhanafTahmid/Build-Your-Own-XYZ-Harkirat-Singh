/*
  Warnings:

  - The primary key for the `Game` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `gameState` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `player1Id` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `player2Id` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Game` table. All the data in the column will be lost.
  - The `id` column on the `Game` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Move` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `gameId` on the `Move` table. All the data in the column will be lost.
  - You are about to drop the column `move` on the `Move` table. All the data in the column will be lost.
  - You are about to drop the column `moveData` on the `Move` table. All the data in the column will be lost.
  - The `id` column on the `Move` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `from` to the `Move` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gid` to the `Move` table without a default value. This is not possible if the table is not empty.
  - Added the required column `to` to the `Move` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Move" DROP CONSTRAINT "Move_gameId_fkey";

-- AlterTable
ALTER TABLE "public"."Game" DROP CONSTRAINT "Game_pkey",
DROP COLUMN "gameState",
DROP COLUMN "player1Id",
DROP COLUMN "player2Id",
DROP COLUMN "status",
ADD COLUMN     "boardState" TEXT NOT NULL DEFAULT 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
ADD COLUMN     "currentTurn" TEXT NOT NULL DEFAULT 'w',
ADD COLUMN     "gameStatus" TEXT NOT NULL DEFAULT 'ongoing',
ADD COLUMN     "moveCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "pid1" TEXT,
ADD COLUMN     "pid2" TEXT,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Game_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."Move" DROP CONSTRAINT "Move_pkey",
DROP COLUMN "gameId",
DROP COLUMN "move",
DROP COLUMN "moveData",
ADD COLUMN     "captured" TEXT,
ADD COLUMN     "from" TEXT NOT NULL,
ADD COLUMN     "gid" INTEGER NOT NULL,
ADD COLUMN     "piece" TEXT,
ADD COLUMN     "to" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Move_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "public"."Move" ADD CONSTRAINT "Move_gid_fkey" FOREIGN KEY ("gid") REFERENCES "public"."Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;
