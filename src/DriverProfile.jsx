import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function DriverProfile() {
  const { driverId } = useParams();
  const navigate = useNavigate();
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);

  const BACKEND_URL = 'https://quickflex-admin-backend-production.up.railway.app';

  useEffect(() => {
    const fetchDriver = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/drivers/${driverId}`);
        setDriver(res.data);
      } catch (err) {
        console.error('Error fetching driver:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDriver();
  }, [driverId]);

  const updateStatus = async (newStatus) => {
    try {
      await axios.post(`${BACKEND_URL}/drivers/update-status`, {
        driver_id: driver.driver_id,
        new_status: newStatus
      });
      alert(`Driver status updated to ${newStatus}`);
      navigate('/');
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>;
  if (!driver) return <div style={{ padding: '2rem' }}>Driver not found.</div>;

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>
        {driver.first_name} {driver.last_name} - Profile
      </h2>
      <p><strong>Status:</strong> {driver.status}</p>
      <p><strong>Email:</strong> {driver.email}</p>
      <p><strong>Phone:</strong> {driver.phone_number}</p>
      <p><strong>License:</strong> {driver.license_number} (Exp: {driver.license_expiration})</p>
      <p><strong>DOB:</strong> {driver.birth_date}</p>

      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
        <button onClick={() => updateStatus('Approved')} style={btnStyle('#38a169')}>Approve</button>
        <button onClick={() => updateStatus('Rejected')} style={btnStyle('#e53e3e')}>Reject</button>
        <button onClick={() => updateStatus('Pending background check')} style={btnStyle('#ed8936')}>Pending Check</button>
        <button onClick={() => updateStatus('Suspended')} style={btnStyle('#718096')}>Suspend</button>
      </div>
    </div>
  );
}

const btnStyle = (bg) => ({
  background: bg,
  color: '#fff',
  border: 'none',
  borderRadius: '0.5rem',
  padding: '0.5rem 1rem',
  cursor: 'pointer'
});
