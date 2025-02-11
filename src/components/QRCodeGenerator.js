import React, { useState } from "react";
import { Form, Button, InputGroup, Alert } from "react-bootstrap";
import { QRCodeCanvas } from "qrcode.react";

const QRCodeGenerator = () => {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [error, setError] = useState("");
  const [copySuccess, setCopySuccess] = useState("");

  const BITLY_API_KEY = process.env.REACT_APP_BITLY_API_KEY; // Replace with your API key

  const shortenUrl = async () => {
    setError("");
    if (!longUrl) return;

    try {
      const response = await fetch("https://api-ssl.bitly.com/v4/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${BITLY_API_KEY}`,
        },
        body: JSON.stringify({ long_url: longUrl }),
      });

      const data = await response.json();
      if (data.id) {
        setShortUrl(data.link);
        setQrCode(data.link);
      } else {
        setError("Failed to shorten URL. Check your API key or URL.");
      }
    } catch (err) {
      setError("Error connecting to Bitly API.");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopySuccess("Shortened URL copied to clipboard!");
    setTimeout(() => setCopySuccess(""), 3000);
  };

  const downloadQRCode = () => {
    const canvas = document.querySelector("canvas");
    const pngUrl = canvas.toDataURL("image/png");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = "qr_code.png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      shortenUrl();
    }
  };

  const handleKeyDownCopy = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      copyToClipboard();
    }
  };

  return (
    <>
      <h1>QR Code Generator with Bitly</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      {copySuccess && <Alert variant="success">{copySuccess}</Alert>}

      <Form>
        <Form.Group>
          <Form.Label>Enter URL</Form.Label>
          <InputGroup>
            <Form.Control
              size="lg"
              type="url"
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              placeholder="Enter a long URL"
              onKeyDown={handleKeyDown}
            />
            <Button variant="primary" onClick={shortenUrl}>
              Shorten & Generate QR
            </Button>
          </InputGroup>
        </Form.Group>
      </Form>

      {shortUrl && (
        <div className="mt-4 text-center">
          <h5>Shortened URL:</h5>
          <InputGroup>
            <Form.Control
              type="text"
              size="lg"
              value={shortUrl}
              onKeyDown={handleKeyDownCopy}
              readOnly
            />
            <Button variant="secondary" onClick={copyToClipboard}>
              Copy
            </Button>
          </InputGroup>

          <h5 className="mt-3">QR Code:</h5>
          <QRCodeCanvas value={qrCode} size={300} />

          <div className="mt-3">
            <Button variant="success" onClick={downloadQRCode}>
              Download QR Code
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default QRCodeGenerator;
