-- CreateTable
CREATE TABLE "Supplier" (
    "id" TEXT NOT NULL,
    "f_name" TEXT NOT NULL,
    "l_name" TEXT,
    "email" TEXT NOT NULL,
    "supplier_code" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_f_name_key" ON "Supplier"("f_name");

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_email_key" ON "Supplier"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_supplier_code_key" ON "Supplier"("supplier_code");
