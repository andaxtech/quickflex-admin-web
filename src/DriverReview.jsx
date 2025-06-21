import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = 'https://quickflex-admin-backend-production.up.railway.app';

export default function DriverReview() {
  const { driverId } = useParams();
  const navigate = useNavigate();
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDriver = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/drivers/pending-details`);
        const match = res.data.find(d => String(d.driver_id) === driverId);
        setDriver(match);
      } catch (err) {
        console.error('Fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDriver();
  }, [driverId]);

  const handleDecision = async (status) => {
    try {
      await axios.post(`${BACKEND_URL}/drivers/update-status`, {
        driver_id: driver.driver_id,
        new_status: status
      });
      navigate('/');
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading driver...</div>;
  if (!driver) return <div style={{ padding: '2rem', textAlign: 'center' }}>Driver not found.</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '2rem', background: '#fff', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <button onClick={() => navigate('/')} style={{ marginBottom: '1rem', background: '#ccc', border: 'none', padding: '0.5rem 1rem', borderRadius: '5px', cursor: 'pointer' }}>
        ← Back to Driver List
      </button>

      <h2 style={{ marginBottom: '1rem', fontSize: '1.75rem', color: '#2d3748' }}>
        {driver.first_name} {driver.last_name}
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
        <div><strong>Email:</strong> {driver.email}</div>
        <div><strong>Phone:</strong> {driver.phone_number}</div>
        <div><strong>DOB:</strong> {driver.birth_date}</div>
        <div><strong>License:</strong> {driver.license_number} (Exp: {driver.license_expiration})</div>
        <div><strong>Status:</strong> {driver.status}</div>
        <div><strong>Registered:</strong> {new Date(driver.registration_date).toLocaleDateString()}</div>
      </div>

      <hr style={{ margin: '1rem 0' }} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', fontSize: '0.95rem' }}>
        <section>
          <h3 style={{ marginBottom: '0.5rem' }}>🚗 Car Details</h3>
          <p>{driver.year} {driver.make} {driver.model}</p>
          <p><strong>Color:</strong> {driver.color || 'N/A'}</p>
          <p><strong>VIN:</strong> {driver.vin_number}</p>
          <p><strong>Plate:</strong> {driver.license_plate}</p>
          <p><strong>Inspected:</strong> {driver.inspection_date}</p>
        </section>

        <section>
          <h3 style={{ marginBottom: '0.5rem' }}>📄 Insurance</h3>
          <p><strong>Provider:</strong> {driver.provider}</p>
          <p><strong>Policy #:</strong> {driver.policy_number}</p>
          <p><strong>Valid:</strong> {driver.insurance_start} to {driver.insurance_end}</p>
        </section>

        <section>
          <h3 style={{ marginBottom: '0.5rem' }}>🏦 Banking Info</h3>
          <p><strong>Bank:</strong> {driver.bank_name}</p>
          <p><strong>Account:</strong> {driver.account_number}</p>
          <p><strong>Routing:</strong> {driver.routing_number}</p>
        </section>

        <section>
          <h3 style={{ marginBottom: '0.5rem' }}>✅ Background Check</h3>
          <p><strong>Status:</strong> {driver.check_status}</p>
          <p><strong>Date:</strong> {driver.check_date}</p>
          <p><strong>Verified by:</strong> {driver.verified_by}</p>
          <p><strong>Notes:</strong> {driver.background_notes || 'None'}</p>
        </section>
      </div>

      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <button onClick={() => handleDecision('Approved')} style={{ background: '#38a169', color: '#fff', padding: '0.75rem 1.5rem', marginRight: '1rem', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          ✅ Approve
        </button>
        <button onClick={() => handleDecision('Rejected')} style={{ background: '#e53e3e', color: '#fff', padding: '0.75rem 1.5rem', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          ❌ Reject
        </button>
      </div>
    </div>
  );
}
