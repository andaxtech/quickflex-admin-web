import { useState, useEffect } from 'react';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [form, setForm] = useState({ username: '', password: '' });
  const [drivers, setDrivers] = useState([]);

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
        .then((data) => setDrivers(data))
        .catch((err) => console.error('Failed to fetch drivers:', err));
    }
  }, [loggedIn]);

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
      <h1>Pending Drivers</h1>
      {drivers.length === 0 ? (
        <p>No drivers with status 'New Registered'</p>
      ) : (
        <ul>
          {drivers.map((d) => (
            <li key={d.driver_id}>
              {d.first_name} {d.last_name} — {d.email}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
