import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function App() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  const BACKEND_URL = 'https://quickflex-admin-backend-production.up.railway.app';

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/drivers/pending-details`);
        setDrivers(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Fetch failed:', err);
        setDrivers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  const handleDecision = async (driver_id, decision) => {
    try {
      await axios.post(`${BACKEND_URL}/drivers/update-status`, {
        driver_id,
        status: decision
      });
      setDrivers(prev => prev.filter(d => d.driver_id !== driver_id));
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading drivers...</div>;
  if (drivers.length === 0) return <div style={{ padding: '2rem', textAlign: 'center' }}>No pending drivers found.</div>;

  return (
    <div style={{ padding: '2rem', background: '#f7fafc', minHeight: '100vh' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '2rem'
      }}>
        {drivers.map(d => (
          <div key={`${d.driver_id}-${d.email}`} style={{
            background: '#fff',
            borderRadius: '1rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{d.first_name} {d.last_name}</h2>
              <p><strong>Email:</strong> {d.email}</p>
              <p><strong>Phone:</strong> {d.phone_number}</p>
              <p><strong>License:</strong> {d.license_number} (Exp: {d.license_expiration})</p>
              <p><strong>DOB:</strong> {d.birth_date}</p>
              <p><strong>Status:</strong> {d.status}</p>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.3rem' }}>Background Check</h3>
              <p><strong>Status:</strong> {d.check_status || 'N/A'}</p>
              <p><strong>Date:</strong> {d.check_date || 'N/A'}</p>
              <p><strong>Verified By:</strong> {d.verified_by || 'N/A'}</p>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.3rem' }}>Car Details</h3>
              <p>{d.year} {d.make} {d.model} ({d.color})</p>
              <p>VIN: {d.vin_number}</p>
              <p>Plate: {d.license_plate} (Exp: {d.registration_expiration})</p>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.3rem' }}>Insurance</h3>
              <p>{d.provider} | Policy: {d.policy_number}</p>
              <p>Valid: {d.ins_start_date} to {d.ins_end_date}</p>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.3rem' }}>Bank Info</h3>
              <p>{d.bank_name}</p>
              <p>Account: {d.account_number}</p>
              <p>Routing: {d.routing_number}</p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={() => handleDecision(d.driver_id, 'Approved')} style={{
                background: '#38a169',
                color: 'white',
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer'
              }}>Approve</button>
              <button onClick={() => handleDecision(d.driver_id, 'Rejected')} style={{
                background: '#e53e3e',
                color: 'white',
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer'
              }}>Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
