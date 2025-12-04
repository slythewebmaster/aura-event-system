import { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import apiClient from '../api/client';

function CheckinScanner() {
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const scannerRef = useRef(null);
  const html5QrcodeScannerRef = useRef(null);

  useEffect(() => {
    if (scannerRef.current && !html5QrcodeScannerRef.current) {
      html5QrcodeScannerRef.current = new Html5QrcodeScanner(
        'qr-reader',
        {
          qrbox: { width: 250, height: 250 },
          fps: 10,
          aspectRatio: 1.0,
        },
        false
      );

      html5QrcodeScannerRef.current.render(
        (decodedText) => {
          handleScan(decodedText);
        },
        () => {
          // ignore per-frame decode errors
        }
      );
    }

    return () => {
      if (html5QrcodeScannerRef.current) {
        html5QrcodeScannerRef.current.clear().catch(() => {});
        html5QrcodeScannerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleScan = async (decodedText) => {
    try {
      let qrPayload;
      try {
        qrPayload = JSON.parse(decodedText);
      } catch {
        qrPayload = { inviteCode: decodedText };
      }

      setLoading(true);
      setError(null);
      setScanResult(null);

      const response = await apiClient.post('/checkins/scan', {
        inviteCode: qrPayload.inviteCode,
        eventId: qrPayload.eventId,
        deviceInfo: navigator.userAgent,
      });

      setScanResult(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetScanner = () => {
    setScanResult(null);
    setError(null);
  };

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '16px', textAlign: 'center' }}>Check-in scanner</h1>
      <p style={{ fontSize: '13px', textAlign: 'center', color: 'var(--aura-text-muted)', marginBottom: '16px' }}>
        Point the camera at a guest&apos;s Aura QR code. We&apos;ll confirm their invite status in real time.
      </p>

      <div className="aura-card" style={{ marginBottom: '16px' }}>
        <div id="qr-reader" ref={scannerRef}></div>
      </div>

      {loading && (
        <div className="aura-card" style={{ textAlign: 'center' }}>
          <div className="aura-loading">
            <div className="aura-spinner"></div>
          </div>
          <p style={{ marginTop: '16px' }}>Processing check‑in...</p>
        </div>
      )}

      {error && (
        <div className="aura-card" style={{ marginTop: '8px' }}>
          <div className="aura-error">{error}</div>
          <button onClick={resetScanner} className="aura-btn aura-btn-primary" style={{ marginTop: '16px', width: '100%' }}>
            Try again
          </button>
        </div>
      )}

      {scanResult && (
        <div className="aura-card" style={{ marginTop: '8px' }}>
          {scanResult.isDuplicate ? (
            <>
              <div className="aura-error" style={{ marginBottom: '16px' }}>
                Already checked in
              </div>
              <p style={{ marginBottom: '8px' }}>
                <strong>Guest:</strong> {scanResult.guest.name}
              </p>
              <p style={{ marginBottom: '8px' }}>
                <strong>Email:</strong> {scanResult.guest.email}
              </p>
              <p style={{ marginBottom: '16px' }}>
                <strong>Previously checked in at:</strong> {new Date(scanResult.checkedInAt).toLocaleString()}
              </p>
            </>
          ) : (
            <>
              <div className="aura-success" style={{ marginBottom: '16px' }}>
                Check‑in successful
              </div>
              <p style={{ marginBottom: '8px' }}>
                <strong>Guest:</strong> {scanResult.guest.name}
              </p>
              <p style={{ marginBottom: '8px' }}>
                <strong>Email:</strong> {scanResult.guest.email}
              </p>
              <p style={{ marginBottom: '8px' }}>
                <strong>Phone:</strong> {scanResult.guest.phone}
              </p>
              <p style={{ marginBottom: '16px', color: 'var(--aura-gold)' }}>
                <strong>Checked in at:</strong> {new Date(scanResult.checkedInAt).toLocaleString()}
              </p>
            </>
          )}
          <button onClick={resetScanner} className="aura-btn aura-btn-primary" style={{ width: '100%' }}>
            Scan next guest
          </button>
        </div>
      )}
    </div>
  );
}

export default CheckinScanner;
