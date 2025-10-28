import prisma from "../db.js"

export const generateBarcodeNo = async () => {
    const checkBarcode = await prisma.barcodeSetting.findUnique({
        where: { isDefault: true },
        select: {
            barcodePrefix: true,
            barcodeSeries: true
        }
    });

    if (!checkBarcode) throw new Error('Barcode Setting Not Found');

    const maxBarcode = await prisma.itemCodeRegistry.findFirst({
        where: { itemCode: { startsWith: `${checkBarcode.barcodePrefix}` } },
        orderBy: { itemCode: 'desc' },
        select: { itemCode: true }
    });

    let nextSeries = Number(checkBarcode.barcodeSeries) + 1;
    if (maxBarcode) {
        const numericPart = maxBarcode.itemCode.replace(checkBarcode.barcodePrefix, '');
        const currentNum = parseInt(numericPart, 10) || 0;
        

        nextSeries = Math.max(nextSeries, currentNum + 1);
    }

    const barcode = await prisma.barcodeSetting.update({
        where: { isDefault: true },
        data: {
            barcodeSeries: nextSeries
        },
        select: {
            barcodeSeries: true
        }
    });
    const padded = String(barcode.barcodeSeries).padStart(7, '0');
    return `${checkBarcode.barcodePrefix}${padded}`;

}