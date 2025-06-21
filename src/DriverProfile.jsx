import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function DriverProfile() {
  const { driverId } = useParams();
  const navigate = useNavigate();
  const [driver, setDriver] = useState(null);
  const [car, setCar] = useState({});
  const [origCar, setOrigCar] = useState({});
  const [editCar, setEditCar] = useState(false);

  const [insurance, setInsurance] = useState({});
  const [origIns, setOrigIns] = useState({});
  const [editIns, setEditIns] = useState(false);

  const [bank, setBank] = useState({});
  const [origBank, setOrigBank] = useState({});
  const [editBank, setEditBank] = useState(false);

  const [background, setBackground] = useState({});
  const [origBg, setOrigBg] = useState({});
  const [editBg, setEditBg] = useState(false);

  const [loading, setLoading] = useState(true);
  const BACKEND_URL = 'https://quickflex-admin-backend-production.up.railway.app';

  useEffect(() => {
    async function fetchData() {
      try {
        const [d, c, i, b, bg] = await Promise.all([
          axios.get(`${BACKEND_URL}/drivers/${driverId}`),
          axios.get(`${BACKEND_URL}/drivers/${driverId}/car`),
          axios.get(`${BACKEND_URL}/drivers/${driverId}/insurance`),
          axios.get(`${BACKEND_URL}/drivers/${driverId}/banking`),
          axios.get(`${BACKEND_URL}/drivers/${driverId}/background`)
        ]);
        setDriver(d.data);
        setCar(c.data || {}); setOrigCar(c.data || {});
        setInsurance(i.data || {}); setOrigIns(i.data || {});
        setBank(b.data || {}); setOrigBank(b.data || {});
        setBackground(bg.data || {}); setOrigBg(bg.data || {});
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [driverId]);

  const updateStatus = async newStatus => {
    const confirm = window.confirm(
      `Change status from "${driver.status}" to "${newStatus}"?`
    );
    if (!confirm) return;
    try {
      await axios.post(`${BACKEND_URL}/drivers/update-status`, {
        driver_id: driver.driver_id,
        new_status: newStatus
      });
      alert(`Status set to ${newStatus}`);
      navigate('/');
    } catch (e) {
      console.error(e);
    }
  };

  const onChange = setter => e => {
    const { name, value } = e.target;
    setter(prev => ({ ...prev, [name]: value }));
  };

  const saveDetails = async (endpoint, data, origSetter, toggleEdit) => {
    try {
      await axios.post(
        `${BACKEND_URL}/drivers/${driverId}/${endpoint}`,
        data
      );
      alert(`${endpoint} saved`);
      origSetter(data);
      toggleEdit(false);
    } catch (e) {
      console.error(e);
    }
  };

  const renderCard = (title, fields, data, orig, editing, setEdit, setData, origSetter, endpoint) => (
    <div style={cardStyle}>
      <div style={cardHeaderStyle}>
        <h3>{title}</h3>
        {editing ? (
          <div>
            <button
              onClick={() => saveDetails(endpoint, data, origSetter, setEdit)}
              style={{ ...btnStyle('#38a169'), marginRight: '0.5rem' }}
            >
              Save
            </button>
            <button
              onClick={() => {
                setData(orig);
                setEdit(false);
              }}
              style={btnStyle('#e53e3e')}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button onClick={() => setEdit(true)} style={btnStyle('#3182ce')}>
            Edit
          </button>
        )}
      </div>
      <div>
        {Object.entries(fields).map(([label, key]) => (
          <div key={key} style={{ marginBottom: '0.75rem' }}>
            <strong>{label}:</strong>{' '}
            {editing ? (
              <input
                name={key}
                value={data[key] || ''}
                onChange={onChange(setData)}
                style={inputStyle}
              />
            ) : (
              <span>{data[key] || 'N/A'}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>;
  if (!driver) return <div style={{ padding: '2rem' }}>Driver not found.</div>;

  return (
    <div style={containerStyle}>
      <h2>
        {driver.first_name} {driver.last_name} - Profile
      </h2>
      {['status','email','phone_number','license_number'].map((k,i) => (
        <p key={i}>
          <strong>{k.replace('_',' ')}:</strong> {driver[k]}
        </p>
      ))}

      <p>
        <strong>License Exp:</strong>{' '}
        {new Date(driver.license_expiration).toLocaleDateString()}
      </p>
      <p>
        <strong>DOB:</strong>{' '}
        {new Date(driver.birth_date).toLocaleDateString()}
      </p>
      <p>
        <strong>Registered:</strong>{' '}
        {new Date(driver.registration_date).toLocaleDateString()}
      </p>

      {renderCard(
        'Car Info',
        displayCarFields,
        car,
        origCar,
        editCar,
        setEditCar,
        setCar,
        setOrigCar,
        'car'
      )}
      {renderCard(
        'Insurance Info',
        displayInsuranceFields,
        insurance,
        origIns,
        editIns,
        setEditIns,
        setInsurance,
        setOrigIns,
        'insurance'
      )}
      {renderCard(
        'Banking Info',
        displayBankingFields,
        bank,
        origBank,
        editBank,
        setEditBank,
        setBank,
        setOrigBank,
        'banking'
      )}
      {renderCard(
        'Background Check',
        displayBgFields,
        background,
        origBg,
        editBg,
        setEditBg,
        setBackground,
        setOrigBg,
        'background'
      )}

      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
        {['Approved','Rejected','Pending background check','Suspended'].map(status => (
          <button
            key={status}
            onClick={() => updateStatus(status)}
            style={btnStyle(btnColors[status])}
          >
            {status}
          </button>
        ))}
      </div>
    </div>
  );
}

const displayCarFields = {
  Make: 'make',
  Model: 'model',
  Year: 'year',
  VIN: 'vin_number',
  'License Plate': 'license_plate',
  'Inspection Status': 'inspection_status',
  'Inspection Date': 'inspection_date'
};

const displayInsuranceFields = {
  Provider: 'provider',
  'Policy Number': 'policy_number',
  'Start Date': 'start_date',
  'End Date': 'end_date'
};

const displayBankingFields = {
  'Bank Name': 'bank_name',
  'Account Number': 'account_number',
  'Routing Number': 'routing_number'
};

const displayBgFields = {
  'Check Status': 'check_status',
  'Check Date': 'check_date',
  'Verified By': 'verified_by',
  Notes: 'notes'
};

const btnColors = {
  Approved: '#38a169',
  Rejected: '#e53e3e',
  'Pending background check': '#ed8936',
  Suspended: '#718096'
};

const btnStyle = bg => ({
  background: bg,
  color: '#fff',
  border: 'none',
  borderRadius: '0.5rem',
  padding: '0.5rem 1rem',
  cursor: 'pointer'
});

const inputStyle = {
  display: 'block',
  width: '100%',
  marginTop: '0.25rem',
  padding: '0.5rem',
  borderRadius: '0.5rem',
  border: '1px solid #ccc'
};

const cardStyle = {
  marginTop: '2rem',
  background: '#fff',
  borderRadius: '1rem',
  padding: '1.5rem',
  boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
};

const cardHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const containerStyle = {
  padding: '2rem',
  fontFamily: 'sans-serif',
  backgroundColor: '#f9f9f9',
  minHeight: '100vh'
};
