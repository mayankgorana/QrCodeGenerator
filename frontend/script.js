document.addEventListener("DOMContentLoaded", function () {
    function generateQRCode() {
        const urlInput = document.getElementById("urlInput");
        if (!urlInput) {
            console.error("Error: 'urlInput' not found in the DOM.");
            return;
        }

        const url = urlInput.value;
        if (!url) {
            alert("Please enter a URL");
            return;
        }

        fetch("http://localhost:5000/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url })
        })
        .then(response => response.json())
        .then(data => {
            if (data.downloadUrl) {
                const qrImage = document.getElementById("qrImage");
                qrImage.src = data.downloadUrl;
                qrImage.style.display = "block";

                // Show download button and set the href
                const downloadBtn = document.getElementById("downloadBtn");
                downloadBtn.style.display = "block";
                downloadBtn.onclick = function () {
                    const link = document.createElement("a");
                    link.href = data.downloadUrl;
                    link.download = "QR_Code.png";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                };
            } else {
                alert("Failed to generate QR Code");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Could not connect to the server. Make sure the backend is running.");
        });
    }

    // Attach function to global scope so the button can access it
    window.generateQRCode = generateQRCode;
});
