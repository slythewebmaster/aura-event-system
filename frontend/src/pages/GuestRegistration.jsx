import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import QRCode from 'qrcode';
import apiClient from '../api/client';

function GuestRegistration() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [invite, setInvite] = useState(null);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const [registeredGuest, setRegisteredGuest] = useState(null);
  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    if (code) {
      fetchInvite();
    }
  }, [code]);

  const fetchInvite = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get(`/invites/${code}`);
      setInvite(response.data.invite);
      setEvent(response.data.event);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.post('/guests/register', {
        inviteCode: code,
        ...data,
      });

      setRegisteredGuest(response.data.guest);
      const qrPayload = JSON.stringify(response.data.qrPayload);
      const qrUrl = await QRCode.toDataURL(qrPayload, {
        width: 300,
        margin: 2,
        color: {
          dark: '#6366f1',
          light: '#ffffff',
        },
      });
      setQrDataUrl(qrUrl);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadQR = () => {
    if (qrDataUrl) {
      const link = document.createElement('a');
      link.href = qrDataUrl;
      link.download = `aura-qr-${code}.png`;
      link.click();
    }
  };

  if (loading && !invite) {
    return (
      <div className="aura-loading">
        <div className="aura-spinner"></div>
      </div>
    );
  }

  if (error && !invite) {
    return (
      <div className="aura-card">
        <div className="aura-error">{error}</div>
        <button onClick={() => navigate('/admin')} className="aura-btn aura-btn-primary" style={{ marginTop: '16px' }}>
          Go to Admin Dashboard
        </button>
      </div>
    );
  }

  if (registeredGuest && qrDataUrl) {
    return (
      <div className="aura-card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <div className="aura-success" style={{ marginBottom: '24px' }}>
          Registration Successful!
        </div>
        <h2 style={{ marginBottom: '16px' }}>Welcome, {registeredGuest.name}!</h2>
        <p style={{ color: 'var(--aura-text-muted)', marginBottom: '32px' }}>
          Your QR code for check-in at {event.name}
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <img src={qrDataUrl} alt="QR Code" style={{ border: '2px solid var(--aura-purple)', borderRadius: '12px', padding: '16px', background: 'white' }} />
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={downloadQR} className="aura-btn aura-btn-primary">
            Download QR Code
          </button>
          <button onClick={() => window.print()} className="aura-btn aura-btn-secondary">
            Print QR Code
          </button>
        </div>
        <div style={{ marginTop: '32px', padding: '16px', background: 'var(--aura-surface-soft)', borderRadius: '8px' }}>
          <p style={{ fontSize: '14px', color: 'var(--aura-text-muted)' }}>
            <strong>Event:</strong> {event.name}<br />
            <strong>Date:</strong> {new Date(event.date).toLocaleString()}<br />
            <strong>Location:</strong> {event.location}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="aura-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '8px' }}>Guest Registration</h2>
      {event && (
        <div style={{ marginBottom: '24px', padding: '16px', background: 'var(--aura-surface-soft)', borderRadius: '8px' }}>
          <h3 style={{ marginBottom: '8px', fontSize: '20px' }}>{event.name}</h3>
          <p style={{ color: 'var(--aura-text-muted)', marginBottom: '4px' }}>
            {new Date(event.date).toLocaleString()}
          </p>
          <p style={{ color: 'var(--aura-text-muted)' }}>{event.location}</p>
        </div>
      )}
      {error && <div className="aura-error">{error}</div>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Full Name *</label>
          <input
            {...register('name', { required: 'Name is required' })}
            className="aura-input"
            placeholder="John Doe"
          />
          {errors.name && <div style={{ color: '#fca5a5', fontSize: '14px', marginTop: '4px' }}>{errors.name.message}</div>}
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Email *</label>
          <input
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
            type="email"
            className="aura-input"
            placeholder="john@example.com"
          />
          {errors.email && <div style={{ color: '#fca5a5', fontSize: '14px', marginTop: '4px' }}>{errors.email.message}</div>}
        </div>
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Phone *</label>
          <input
            {...register('phone', { required: 'Phone is required' })}
            type="tel"
            className="aura-input"
            placeholder="+1 234 567 8900"
          />
          {errors.phone && <div style={{ color: '#fca5a5', fontSize: '14px', marginTop: '4px' }}>{errors.phone.message}</div>}
        </div>
        <button type="submit" className="aura-btn aura-btn-primary" style={{ width: '100%' }} disabled={loading}>
          {loading ? 'Registering...' : 'Complete Registration'}
        </button>
      </form>
    </div>
  );
}

export default GuestRegistration;
