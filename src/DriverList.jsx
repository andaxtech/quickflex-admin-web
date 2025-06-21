import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function DriverList() {
  const [drivers, setDrivers] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const res = await axios.get('https://quickflex-admin-backend-production.up.railway.app/drivers/all');
        setDrivers(res.data);
      } catch (err) {
        console.error('Error fetching drivers:', err);
      }
    };
    fetchDrivers();
  }, []);

  const filteredDrivers = drivers.filter(driver => {
    const fullName = `${driver.first_name} ${driver.last_name}`.toLowerCase();
    const searchMatch = fullName.includes(search.toLowerCase());
    const statusMatch = statusFilter ? driver.status === statusFilter : true;
    return searchMatch && statusMatch;
  });

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#2c3e50' }}>Driver Dashboard</h1>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #ccc', flex: 1 }}
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #ccc' }}
        >
          <option value=''>All Statuses</option>
          <option value='New Registered'>New Registered</option>
          <option value='Approved'>Approved</option>
          <option value='Rejected'>Rejected</option>
        </select>
      </div>
      <div style={{ overflowX: 'auto', background: '#fff', borderRadius: '1rem', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
          <thead style={{ backgroundColor: '#f1f1f1' }}>
            <tr>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Phone</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredDrivers.map(driver => (
              <tr key={`${driver.driver_id}-${driver.email}`} style={{ borderBottom: '1px solid #eee' }}>
                <td style={tdStyle}>{driver.first_name} {driver.last_name}</td>
                <td style={tdStyle}>{driver.email}</td>
                <td style={tdStyle}>{driver.phone_number}</td>
                <td style={tdStyle}>{driver.status}</td>
                <td style={tdStyle}>
                  <button
                    onClick={() => navigate(`/review/${driver.driver_id}`)}
                    style={btnStyle}
                  >
                    {driver.status === 'New Registered' ? 'Review' : 'Driver Profile'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const thStyle = {
  textAlign: 'left',
  padding: '0.75rem',
  fontWeight: '600',
  color: '#34495e',
  borderBottom: '2px solid #ddd'
};

const tdStyle = {
  padding: '0.75rem',
  color: '#555'
};

const btnStyle = {
  padding: '0.5rem 1rem',
  background: '#3498db',
  color: '#fff',
  border: 'none',
  borderRadius: '0.5rem',
  cursor: 'pointer'
};
