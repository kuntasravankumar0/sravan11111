import React, { useEffect, useState } from 'react';
import { getAllMessages } from '../../api/contact/contactApi';

export default function AdminContactMessages() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchMessages = async () => {
        try {
            const res = await getAllMessages();
            if (res.data.status) {
                setMessages(res.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
            } else {
                setError(res.data.message || 'Failed to fetch messages.');
            }
        } catch (err) {
            console.error('Admin fetch error:', err);
            const msg = err.response?.data?.message || err.message || 'Server unreachable.';
            setError(`Error: ${msg}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    if (loading) return <div style={{ padding: '100px', textAlign: 'center' }}><h2>Loading Feedbacks...</h2></div>;

    return (
        <div style={{ padding: '80px 20px', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ marginBottom: '40px' }}>
                <h1 style={{ fontWeight: '800' }}>User Feedbacks 📩</h1>
                <p style={{ color: '#666' }}>Review messages sent by users via the Contact Us page.</p>
            </div>

            {error && <p style={{ color: '#ef4444' }}>{error}</p>}

            <div style={{ display: 'grid', gap: '20px' }}>
                {messages.length === 0 ? (
                    <p>No messages yet.</p>
                ) : (
                    messages.map((msg) => (
                        <div key={msg.id} style={{
                            background: 'white',
                            padding: '25px',
                            borderRadius: '20px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                            border: '1px solid #f0f0f0'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                <div>
                                    <h3 style={{ margin: 0, color: '#111' }}>{msg.name}</h3>
                                    <p style={{ margin: 0, color: '#4f46e5', fontWeight: '600', fontSize: '14px' }}>{msg.email}</p>
                                </div>
                                <span style={{ color: '#aaa', fontSize: '12px' }}>
                                    {new Date(msg.createdAt).toLocaleString()}
                                </span>
                            </div>
                            <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px', color: '#444', lineHeight: '1.6' }}>
                                {msg.message}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
