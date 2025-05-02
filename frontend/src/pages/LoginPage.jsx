import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('/login', { username, password }); // ✅ proxy handles domain

      if (data.success) {
        localStorage.setItem('username', username); // 🔐 Save for employee info use
        if (data.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/employee');
        }
      } else {
        alert('❌ Login failed: ' + res.data.message);
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('❌ Server error during login.');
    }
  };

  return (
    <div style={{ padding: '30px' }}>
      <h1>Employee Portal Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username or Email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        /><br /><br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br /><br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;
