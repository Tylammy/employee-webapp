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
      const res = await axios.post('http://localhost:5000/login', {
        username,
        password,
      });

      const data = res.data;

      if (data.success) {
        localStorage.setItem('role', data.role);
        localStorage.setItem('username', username);
        if (data.role === 'admin') {
          navigate('/admin');
        } else if (data.role === 'employee') {
          navigate('/employee');
        } else {
          alert('⚠️ Unknown role: ' + data.role);
        }
      } else {
        alert('❌ Login failed: ' + (data.message || 'Invalid credentials'));
      }
    } catch (err) {
      console.error('❌ Server error during login:', err);
      alert('❌ Server error. Please try again later.');
    }
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Employee Portal Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username or Email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{ padding: '10px', width: '250px' }}
        /><br /><br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: '10px', width: '250px' }}
        /><br /><br />
        <button type="submit" style={{ padding: '10px 20px' }}>Login</button>
      </form>
    </div>
  );
}

export default LoginPage;