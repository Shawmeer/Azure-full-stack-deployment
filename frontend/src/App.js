import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'https://full-stack-backend-hggremahddf6ewgf.centralindia-01.azurewebsites.net';

function App() {
  const [messages, setMessages] = useState([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`${API_URL}/messages`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else {
        setError('Failed to fetch messages');
      }
    } catch (err) {
      setError('Failed to connect to server');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, message }),
      });

      if (response.ok) {
        setName('');
        setMessage('');
        fetchMessages();
      } else {
        setError('Failed to submit message');
      }
    } catch (err) {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Message Board</h1>
      </header>

      <main className="main">
        <section className="form-section">
          <h2>Submit a Message</h2>
          <form onSubmit={handleSubmit} className="message-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your message"
                rows="4"
                required
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </section>

        <section className="messages-section">
          <h2>Messages ({messages.length})</h2>
          {messages.length === 0 ? (
            <p className="no-messages">No messages yet. Be the first to submit!</p>
          ) : (
            <ul className="messages-list">
              {messages.map((msg) => (
                <li key={msg.id} className="message-item">
                  <div className="message-header">
                    <span className="message-name">{msg.name}</span>
                    <span className="message-date">
                      {new Date(msg.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="message-content">{msg.message}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
