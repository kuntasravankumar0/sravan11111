import React from 'react';

export default function SupportPage() {
    const tutorials = [
        { id: 1, title: 'Getting Started', icon: '🚀', desc: 'Learn how to create your account and setup your profile.' },
        { id: 2, title: 'Security & Privacy', icon: '🛡️', desc: 'Manage your account security and data preferences.' },
        { id: 3, title: 'Connected Apps', icon: '🔗', desc: 'How to integrate Google and other services safely.' },
        { id: 4, title: 'Live Presence', icon: '🟢', desc: 'Understanding how the real-time online status works.' }
    ];

    const faqs = [
        { q: 'How do I reset my password?', a: 'Go to the Login page and click on "Forgot Password". Follow the link sent to your email.' },
        { q: 'Can I delete my data?', a: 'Yes, you can permanently delete your account and all associated data from the "Account Actions" tab in your profile.' },
        { q: 'Is my location shared?', a: 'Your location is only updated when you are logged in to provide live presence features. You can disable this in your browser settings.' }
    ];

    return (
        <div style={{ padding: '100px 20px', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '15px' }}>Support Hub 🎯</h1>
                <p style={{ color: '#666', fontSize: '1.2rem' }}>Need help? We have got you covered with guides and FAQs.</p>
            </div>

            <div style={{ marginBottom: '80px' }}>
                <h2 style={{ marginBottom: '30px', fontWeight: '800' }}>Quick Help Guides</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                    {tutorials.map(item => (
                        <div key={item.id} style={{
                            background: 'white', padding: '30px', borderRadius: '24px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #f0f0f0',
                            transition: 'transform 0.2s', cursor: 'pointer'
                        }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                            <div style={{ fontSize: '30px', marginBottom: '15px' }}>{item.icon}</div>
                            <h3 style={{ marginBottom: '10px' }}>{item.title}</h3>
                            <p style={{ color: '#777', fontSize: '14px', lineHeight: '1.5' }}>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h2 style={{ marginBottom: '30px', fontWeight: '800' }}>Frequently Asked Questions</h2>
                <div style={{ background: 'white', borderRadius: '30px', padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                    {faqs.map((faq, i) => (
                        <div key={i} style={{ padding: '20px', borderBottom: i === faqs.length - 1 ? 'none' : '1px solid #f0f0f0' }}>
                            <h4 style={{ color: '#4f46e5', marginBottom: '10px', fontSize: '1.1rem' }}>Q: {faq.q}</h4>
                            <p style={{ color: '#555', lineHeight: '1.6' }}>{faq.a}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
