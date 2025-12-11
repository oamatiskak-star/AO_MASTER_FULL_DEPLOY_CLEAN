import express from "express";
import PDFDocument from "pdfkit";

const router = express.Router();

router.get("/test", (req, res) => {
  const doc = new PDFDocument();
  const chunks = [];

  doc.on("data", (chunk) => chunks.push(chunk));
  doc.on("end", () => {
    const pdf = Buffer.concat(chunks);
    res.setHeader("Content-Type", "application/pdf");
    res.send(pdf);
  });

  doc.text("Juridisch v2 PDF test OK");
  doc.end();
});

export default router;
