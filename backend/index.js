import express from "express";
import cors from "cors";
import qr from "qr-image";
import fs from "fs";
import path from "path";

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(process.cwd())));  // Serve static files

app.post("/generate", (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });

    try {
        const qr_svg = qr.image(url, { type: "png" });
        const filePath = path.join(process.cwd(), "qr_code.png"); // ✅ Dynamic path fix

        // Save to file
        const writeStream = fs.createWriteStream(filePath);
        qr_svg.pipe(writeStream);

        writeStream.on("finish", () => {
            res.json({
                message: "QR Code generated successfully!",
                downloadUrl: `http://localhost:5000/qr_code.png`
            });
        });

    } catch (error) {
        res.status(500).json({ error: "Failed to generate QR Code" });
    }
});

// Route to serve the QR Code file
app.get("/qr_code.png", (req, res) => {
    const filePath = path.join(process.cwd(), "qr_code.png");
    res.sendFile(filePath);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
