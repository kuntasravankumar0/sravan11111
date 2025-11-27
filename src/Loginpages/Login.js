import React, { useState } from 'react';
import axios from 'axios';

function Login() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = 'https://besravan11111.onrender.com/api/users/create';

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation
    if (mobileNumber.length !== 10) {
      setMessage('⚠ Mobile number must be exactly 10 digits.');
      return;
    }

    setMessage('Creating user...');
    setIsLoading(true);

    try {
      const postData = {
        username: name,
        useremail: email,
        number: mobileNumber,
      };

      const response = await axios.post(API_URL, postData);

      if (response.data?.status === true) {
        // SUCCESS MESSAGE (FIXED)
        setMessage(`✅ User created successfully! Customer ID: ${response.data.customerId}`);
        setName('');
        setEmail('');
        setMobileNumber('');
      } 
      else if (response.data?.status === false) {

        const backendMessage = response.data.message || 'User creation failed.';

        if (backendMessage.includes('(email)')) {
          setMessage('⚠ ఈమెయిల్ ఇప్పటికే ఉంది (Email already exists).');
        } else if (backendMessage.includes('(number)')) {
          setMessage('⚠ మొబైల్ నెంబర్ ఇప్పటికే ఉంది (Mobile number already exists).');
        } else {
          // ERROR MESSAGE (FIXED)
          setMessage(`❌ User creation failed: ${backendMessage}`);
        }
      } 
      else {
        setMessage('❌ Unexpected response format from server.');
      }

    } catch (error) {
      console.error("API Call Error:", error);
      setMessage('❌ Network error. Check server or CORS.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>User Registration</h2>

      <form onSubmit={handleSubmit} style={styles.form}>

        {/* NAME FIELD */}
        <div style={styles.inputGroup}>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); setMessage(''); }}
            required
            style={styles.input}
            disabled={isLoading}
          />
        </div>

        {/* EMAIL FIELD */}
        <div style={styles.inputGroup}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setMessage(''); }}
            required
            style={styles.input}
            disabled={isLoading}
          />
        </div>

        {/* MOBILE FIELD */}
        <div style={styles.inputGroup}>
          <label>Mobile Number:</label>
          <input
            type="tel"
            value={mobileNumber}
            onChange={(e) => { setMobileNumber(e.target.value); setMessage(''); }}
            required
            maxLength="10"
            style={styles.input}
            disabled={isLoading}
          />
        </div>

        <button 
          type="submit"
          style={{
            ...styles.button,
            opacity: isLoading ? 0.7 : 1,
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
          disabled={isLoading}
        >
          {isLoading ? 'Creating...' : 'Create User'}
        </button>
      </form>

      {message && (
        <p
          style={{
            ...styles.message,
            backgroundColor:
              message.startsWith('✅') ? '#d4edda' :
              message.startsWith('⚠') ? '#fff3cd' :
              '#f8d7da',
            color:
              message.startsWith('✅') ? '#155724' :
              message.startsWith('⚠') ? '#856404' :
              '#721c24'
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', fontFamily: 'Arial' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  inputGroup: { display: 'flex', flexDirection: 'column' },
  input: { padding: '10px', border: '1px solid #ddd', borderRadius: '4px' },
  button: { padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', transition: 'background-color 0.3s' },
  message: { marginTop: '15px', padding: '10px', borderRadius: '4px', textAlign: 'center', border: '1px solid' }
};

export default Login;
