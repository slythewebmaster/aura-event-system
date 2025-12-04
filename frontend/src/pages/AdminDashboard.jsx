import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import apiClient from '../api/client';

function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [invites, setInvites] = useState([]);
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      fetchEventDetails(selectedEvent._id);
      const interval = setInterval(() => {
        fetchEventDetails(selectedEvent._id);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [selectedEvent]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/events');
      setEvents(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchEventDetails = async (eventId) => {
    try {
      const [eventRes, invitesRes, guestsRes] = await Promise.all([
        apiClient.get(`/events/${eventId}`),
        apiClient.get(`/events/${eventId}/invites?limit=200`),
        apiClient.get(`/events/${eventId}/guests`),
      ]);
      setSelectedEvent(eventRes.data);
      setInvites(invitesRes.data.invites);
      setGuests(guestsRes.data);
    } catch (err) {
      setError(err.message);
    }
  };

  const onCreateEvent = async (data) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.post('/events', { ...data, maxGuests: 200 });
      setSuccess(`Event "${response.data.event.name}" created with 200 invites!`);
      reset();
      fetchEvents();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = async (eventId) => {
    try {
      const response = await apiClient.get(`/events/${eventId}/invites/export`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `event-${eventId}-invites.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError(err.message);
    }
  };

  if (selectedEvent) {
    return (
      <div>
        <button onClick={() => setSelectedEvent(null)} className="aura-btn aura-btn-secondary" style={{ marginBottom: '24px' }}>
          ← Back to Events
        </button>
        <div className="aura-card">
          <h2 style={{ marginBottom: '16px', fontSize: '28px' }}>{selectedEvent.name}</h2>
          {success && <div className="aura-success" style={{ marginBottom: '16px' }}>{success}</div>}
          {error && <div className="aura-error" style={{ marginBottom: '16px' }}>{error}</div>}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div className="aura-card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--aura-purple)' }}>{selectedEvent.stats.totalInvites}</div>
              <div style={{ color: 'var(--aura-text-muted)' }}>Total Invites</div>
            </div>
            <div className="aura-card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--aura-indigo)' }}>{selectedEvent.stats.registered}</div>
              <div style={{ color: 'var(--aura-text-muted)' }}>Registered</div>
            </div>
            <div className="aura-card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--aura-gold)' }}>{selectedEvent.stats.checkedIn}</div>
              <div style={{ color: 'var(--aura-text-muted)' }}>Checked In</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
            <button onClick={() => fetchEventDetails(selectedEvent._id)} className="aura-btn aura-btn-secondary">
              Refresh
            </button>
            <button onClick={() => exportCSV(selectedEvent._id)} className="aura-btn aura-btn-gold">
              Export CSV
            </button>
            <button 
              onClick={() => {
                const unusedInvites = invites.filter(inv => inv.status === 'unused');
                const links = unusedInvites.map(inv => `${window.location.origin}/register/${inv.code}`).join('\n');
                navigator.clipboard.writeText(links);
                setSuccess(`Copied ${unusedInvites.length} registration links to clipboard!`);
                setTimeout(() => setSuccess(null), 3000);
              }}
              className="aura-btn aura-btn-primary"
            >
              Copy All Unused Links
            </button>
          </div>
          <div style={{ marginTop: '24px' }}>
            <h3 style={{ marginBottom: '16px' }}>Invites & Guests</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(99, 102, 241, 0.3)' }}>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Code</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Registration Link</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Guest Name</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {invites.map((invite) => {
                    const registrationLink = `${window.location.origin}/register/${invite.code}`;
                    return (
                      <tr key={invite._id} style={{ borderBottom: '1px solid rgba(99, 102, 241, 0.1)' }}>
                        <td style={{ padding: '12px', fontFamily: 'monospace', fontWeight: 'bold' }}>{invite.code}</td>
                        <td style={{ padding: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input
                              type="text"
                              readOnly
                              value={registrationLink}
                              onClick={(e) => e.target.select()}
                              style={{
                                flex: 1,
                                padding: '6px 10px',
                                fontSize: '12px',
                                border: '1px solid rgba(99, 102, 241, 0.2)',
                                borderRadius: '6px',
                                backgroundColor: '#f9fafb',
                                fontFamily: 'monospace',
                                cursor: 'text',
                                minWidth: '300px'
                              }}
                            />
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(registrationLink);
                                setSuccess(`Registration link copied!`);
                                setTimeout(() => setSuccess(null), 2000);
                              }}
                              className="aura-btn aura-btn-secondary"
                              style={{ 
                                padding: '6px 12px', 
                                fontSize: '12px',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              Copy
                            </button>
                          </div>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <span className={`aura-badge aura-badge-${invite.status.replace('_', '-')}`}>
                            {invite.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td style={{ padding: '12px' }}>{invite.guest?.name || '-'}</td>
                        <td style={{ padding: '12px' }}>{invite.guest?.email || '-'}</td>
                        <td style={{ padding: '12px' }}>{invite.guest?.phone || '-'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ fontSize: '36px', marginBottom: '32px', background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        Admin Dashboard
      </h1>

      <div className="aura-card" style={{ marginBottom: '32px' }}>
        <h2 style={{ marginBottom: '16px' }}>Create New Event</h2>
        {error && <div className="aura-error">{error}</div>}
        {success && <div className="aura-success">{success}</div>}
        <form onSubmit={handleSubmit(onCreateEvent)}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Event Name *</label>
              <input
                {...register('name', { required: 'Event name is required' })}
                className="aura-input"
                placeholder="Exclusive Gala 2025"
              />
              {errors.name && <div style={{ color: '#fca5a5', fontSize: '14px', marginTop: '4px' }}>{errors.name.message}</div>}
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Date & Time *</label>
              <input
                {...register('date', { required: 'Date is required' })}
                type="datetime-local"
                className="aura-input"
              />
              {errors.date && <div style={{ color: '#fca5a5', fontSize: '14px', marginTop: '4px' }}>{errors.date.message}</div>}
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Location *</label>
              <input
                {...register('location', { required: 'Location is required' })}
                className="aura-input"
                placeholder="Grand Ballroom, Downtown"
              />
              {errors.location && <div style={{ color: '#fca5a5', fontSize: '14px', marginTop: '4px' }}>{errors.location.message}</div>}
            </div>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Description</label>
            <textarea
              {...register('description')}
              className="aura-input"
              rows="3"
              placeholder="Event description..."
            />
          </div>
          <button type="submit" className="aura-btn aura-btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Event (200 Invites)'}
          </button>
        </form>
      </div>

      <div>
        <h2 style={{ marginBottom: '16px' }}>Events</h2>
        {loading && events.length === 0 ? (
          <div className="aura-loading">
            <div className="aura-spinner"></div>
          </div>
        ) : events.length === 0 ? (
          <div className="aura-card" style={{ textAlign: 'center', padding: '48px' }}>
            <p style={{ color: 'var(--aura-text-muted)' }}>No events yet. Create your first event above!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {events.map((event) => (
              <div
                key={event._id}
                className="aura-card"
                style={{ cursor: 'pointer' }}
                onClick={() => setSelectedEvent(event)}
              >
                <h3 style={{ marginBottom: '12px', fontSize: '20px' }}>{event.name}</h3>
                <p style={{ color: 'var(--aura-text-muted)', marginBottom: '8px' }}>
                  {new Date(event.date).toLocaleString()}
                </p>
                <p style={{ color: 'var(--aura-text-muted)', marginBottom: '16px' }}>{event.location}</p>
                <div style={{ display: 'flex', gap: '16px', fontSize: '14px' }}>
                  <div>
                    <span style={{ color: 'var(--aura-text-muted)' }}>Invites: </span>
                    <span style={{ fontWeight: 'bold' }}>{event.stats.totalInvites}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--aura-text-muted)' }}>Registered: </span>
                    <span style={{ fontWeight: 'bold', color: 'var(--aura-indigo)' }}>{event.stats.registered}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--aura-text-muted)' }}>Checked In: </span>
                    <span style={{ fontWeight: 'bold', color: 'var(--aura-gold)' }}>{event.stats.checkedIn}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;