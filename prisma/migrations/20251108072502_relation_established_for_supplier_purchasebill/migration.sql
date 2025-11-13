-- AddForeignKey
ALTER TABLE "purchase_bill" ADD CONSTRAINT "purchase_bill_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "contact_management"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
