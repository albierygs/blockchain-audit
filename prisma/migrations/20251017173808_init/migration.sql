/*
  Warnings:

  - A unique constraint covering the columns `[public_id]` on the table `donor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[public_id]` on the table `organization_member` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `donor_public_id_key` ON `donor`(`public_id`);

-- CreateIndex
CREATE UNIQUE INDEX `organization_member_public_id_key` ON `organization_member`(`public_id`);
