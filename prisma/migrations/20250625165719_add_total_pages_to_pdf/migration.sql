/*
  Warnings:

  - Added the required column `totalPages` to the `PDF` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PDF" ADD COLUMN  "totalPages" INTEGER NOT NULL;
