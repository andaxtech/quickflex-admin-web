import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function App() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const res = await axios.get('https://quickflex-admin-backend-production.up.railway.app/drivers/pending-details');
        setDrivers(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  const handleDecision = async (driver_id, decision) => {
    try {
      await axios.post('https://quickflex-admin-backend-production.up.railway.app/drivers/update-status', {
        driver_id,
        status: decision
      });
      setDrivers(prev => prev.filter(d => d.driver_id !== driver_id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading drivers...</div>;

  return (
    <div className="grid gap-4 p-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      {drivers.map(d => (
        <div key={d.driver_id} className="p-4 shadow rounded-2xl bg-white">
          <h2 className="text-xl font-semibold mb-2">{d.first_name} {d.last_name}</h2>
          <p><strong>Email:</strong> {d.email}</p>
          <p><strong>Phone:</strong> {d.phone_number}</p>
          <p><strong>License:</strong> {d.license_number} (Exp: {d.license_expiration})</p>
          <p><strong>DOB:</strong> {d.birth_date}</p>
          <p><strong>Status:</strong> {d.status}</p>
          <hr className="my-2" />
          <h3 className="font-bold">Background Check</h3>
          <p><strong>Status:</strong> {d.check_status} (Date: {d.check_date})</p>
          <p><strong>Verified By:</strong> {d.verified_by}</p>
          <p><strong>Notes:</strong> {d.background_notes}</p>
          <hr className="my-2" />
          <h3 className="font-bold">Car</h3>
          <p>{d.year} {d.make} {d.model} ({d.color})</p>
          <p>VIN: {d.vin_number}</p>
          <p>Plate: {d.license_plate} (Exp: {d.registration_expiration})</p>
          <hr className="my-2" />
          <h3 className="font-bold">Insurance</h3>
          <p>{d.provider} | Policy: {d.policy_number}</p>
          <p>Valid: {d.ins_start_date} to {d.ins_end_date}</p>
          <hr className="my-2" />
          <h3 className="font-bold">Bank</h3>
          <p>{d.bank_name}</p>
          <p>Account: {d.account_number}</p>
          <p>Routing: {d.routing_number}</p>
          <div className="flex gap-4 mt-4">
            <button onClick={() => handleDecision(d.driver_id, 'Approved')} className="bg-green-500 text-white px-4 py-2 rounded-xl">Approve</button>
            <button onClick={() => handleDecision(d.driver_id, 'Rejected')} className="bg-red-500 text-white px-4 py-2 rounded-xl">Reject</button>
          </div>
        </div>
      ))}
    </div>
  );
}
