import { useState, useEffect } from 'react';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [form, setForm] = useState({ username: '', password: '' });
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  const backendURL = 'https://quickflex-admin-backend-production.up.railway.app';

  const handleLogin = (e) => {
    e.preventDefault();
    if (form.username === 'admin' && form.password === 'quickflex123') {
      setLoggedIn(true);
    } else {
      alert('Invalid credentials');
    }
  };

  useEffect(() => {
    if (loggedIn) {
      fetch(`${backendURL}/drivers/pending`)
        .then((res) => res.json())
        .then((data) => {
          setDrivers(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Failed to fetch drivers:', err);
          setLoading(false);
        });
    }
  }, [loggedIn]);

  const handleDecision = (driver_id, decision) => {
    // Here you'd call a POST or PUT endpoint to update status
    alert(`${decision.toUpperCase()} driver ID ${driver_id}`);
  };

  if (!loggedIn) {
    return (
      <div style={{ padding: 40 }}>
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin}>
          <div>
            <label>Username: </label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          </div>
          <br />
          <div>
            <label>Password: </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <br />
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Driver Review Dashboard</h1>
      {loading ? (
        <p>Loading drivers...</p>
      ) : drivers.length === 0 ? (
        <p>No drivers to review.</p>
      ) : (
        drivers.map((d) => (
          <div
            key={d.driver_id}
            style={{
              border: '1px solid #ccc',
              padding: 20,
              marginBottom: 20,
              borderRadius: 10
            }}
          >
            <h3>
              {d.first_name} {d.last_name}
            </h3>
            <p>Email: {d.email}</p>
            <p>Phone: {d.phone_number}</p>
            <p>Status: {d.status}</p>

            {/* Future: Show background checks, car details, etc. */}

            <button onClick={() => handleDecision(d.driver_id, 'approve')} style={{ marginRight: 10 }}>
              ✅ Approve
            </button>
            <button onClick={() => handleDecision(d.driver_id, 'reject')}>❌ Reject</button>
          </div>
        ))
      )}
    </div>
  );
}

export default App;
