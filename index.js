import express from "express";
import cors from "cors";
import qr from "qr-image";
import fs from "fs";

const app = express();
app.use(express.json());
app.use(cors());

app.post("/generate", (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });

    try {
        // Generate QR code
        const qr_svg = qr.image(url, { type: "png" });
        const filePath = "qr_code.png";

        // Save to file
        const writeStream = fs.createWriteStream(filePath);
        qr_svg.pipe(writeStream);

        writeStream.on("finish", () => {
            res.json({ 
                message: "QR Code generated successfully!", 
                downloadUrl: `http://localhost:5000/download` 
            });
        });

    } catch (error) {
        res.status(500).json({ error: "Failed to generate QR Code" });
    }
});

// Route to download the generated QR Code
app.get("/download", (req, res) => {
    const filePath = "qr_code.png";
    res.download(filePath, "qr_code.png", (err) => {
        if (err) {
            res.status(500).json({ error: "Error downloading the file" });
        }
    });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
