const axios = require('axios');
const fs = require('fs');
const { PDFDocument, rgb } = require('pdf-lib');

const imageUrl = "https://na1.documents.adobe.com/document/ci/CBSCTBABDUAAABACAABAALPDdQ6FYfGb-rv9mBZiLWz_f8YhdTXMq7BWhu5u9hCOw2QfgZV9jM8Zs5E-ksyry1_VoTS5d0jLsvfEFmtlERqTyno78GiTLXriPiCT4HOw*/z125.png&sns=z125&snp=5";
const imagePath = "downloaded_image.png";
const pdfPath = "output.pdf";

async function downloadImage() {
    const response = await axios({
        url: imageUrl,
        responseType: 'arraybuffer'
    });
    fs.writeFileSync(imagePath, response.data);
    console.log('Image downloaded.');
}

async function convertImageToPDF() {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const imageBytes = fs.readFileSync(imagePath);
    const pngImage = await pdfDoc.embedPng(imageBytes);

    const { width, height } = pngImage.scale(1);
    page.setSize(width, height);
    page.drawImage(pngImage, {
        x: 0,
        y: 0,
        width: width,
        height: height
    });

    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(pdfPath, pdfBytes);
    console.log('Image converted to PDF.');
}

async function main() {
    await downloadImage();
    await convertImageToPDF();
}

main();
