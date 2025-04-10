const express = require('express')
const PDFDocument = require('pdfkit')
const pdfRouter = express.Router()

pdfRouter.get('/', (req, res) => {
  const doc = new PDFDocument();
  res.setHeader('Content-Disposition', 'attachment; filename=documento.pdf')
  res.setHeader('Content-Type', 'application/pdf')
  doc.pipe(res); // que genere el fichero en res, lo vamos a enviar en la respuesta
  doc.text("Generando un texto en pdf")
  doc.end()
});

module.exports = pdfRouter;