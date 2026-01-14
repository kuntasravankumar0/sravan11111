import React, { useState } from 'react';
import { submitContactForm } from '../../api/contact/contactApi';

export default function ContactPage() {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');

    const handleSubmitAction = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await submitContactForm(formData);
            if (res.data.status) {
                setSent(true);
                setFormData({ name: '', email: '', message: '' });
                setTimeout(() => setSent(false), 5000);
            } else {
                setError(res.data.message || 'Failed to send message.');
            }
        } catch (err) {
            console.error('Contact submit error:', err);
            const msg = err.response?.data?.message || err.message || 'Failed to connect to server.';
            setError(`Error: ${msg}`);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div style={{ padding: '100px 20px', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '15px' }}>Contact Us 📞</h1>
                <p style={{ color: '#666', fontSize: '1.2rem' }}>We'd love to hear from you. Send us a message!</p>
            </div>

            <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px'
            }}>
                <div style={{ background: 'white', padding: '40px', borderRadius: '30px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
                    <form onSubmit={handleSubmitAction}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Full Name</label>
                            <input
                                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #ddd' }}
                                placeholder="Your Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Email Address</label>
                            <input
                                type="email"
                                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #ddd' }}
                                placeholder="your@email.com"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div style={{ marginBottom: '30px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Message</label>
                            <textarea
                                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #ddd', minHeight: '150px' }}
                                placeholder="How can we help you?"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {error && <p style={{ color: '#ef4444', marginBottom: '15px' }}>{error}</p>}

                        <button
                            disabled={sent || loading}
                            style={{
                                width: '100%', padding: '15px', background: sent ? '#10b981' : '#4f46e5', color: 'white',
                                border: 'none', borderRadius: '12px', fontWeight: '800', cursor: 'pointer',
                                opacity: loading ? 0.7 : 1
                            }}
                        >
                            {loading ? 'Sending...' : (sent ? '✅ Sent Successfully!' : 'Send Message')}
                        </button>
                    </form>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    <div style={{ background: '#f8fafc', padding: '30px', borderRadius: '24px' }}>
                        <h3 style={{ marginBottom: '10px' }}>📧 Support Email</h3>
                        <p style={{ color: '#4f46e5', fontWeight: '600' }}>support@example.com</p>
                    </div>
                    <div style={{ background: '#f8fafc', padding: '30px', borderRadius: '24px' }}>
                        <h3 style={{ marginBottom: '10px' }}>🏢 Office Address</h3>
                        <p style={{ color: '#64748b' }}>123 Innovation Drive, Tech City, 560001</p>
                    </div>
                    <div style={{ background: '#f8fafc', padding: '30px', borderRadius: '24px' }}>
                        <h3 style={{ marginBottom: '10px' }}>🕒 Working Hours</h3>
                        <p style={{ color: '#64748b' }}>Mon - Fri: 9:00 AM - 6:00 PM</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
