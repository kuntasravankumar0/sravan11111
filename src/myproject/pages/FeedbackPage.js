import React, { useState, useEffect } from 'react';
import { submitFeedback } from '../../api/device/deviceApi';
import './FeedbackPage.css';

export default function FeedbackPage() {
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("googleUser") || localStorage.getItem("headerUser");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (err) {
                console.error("Error parsing user data", err);
            }
        }
    }, []);

    const handleSubmit = async () => {
        if (!rating || !feedback.trim()) {
            setMessage({ type: 'error', text: 'Please provide both rating and feedback.' });
            return;
        }

        if (!user) {
            setMessage({ type: 'error', text: 'Please login to submit feedback.' });
            return;
        }

        setIsSubmitting(true);
        setMessage({ type: '', text: '' });

        try {
            const payload = {
                userId: user.googleId || user.number || localStorage.getItem("userNumber"),
                authProvider: user.googleId ? "GOOGLE" : "MANUAL",
                feedback: `[Rating: ${rating}/5] ${feedback}`
            };

            const response = await submitFeedback(payload);
            if (response.data.status) {
                setMessage({ type: 'success', text: 'Thank you! Your feedback has been saved to your profile.' });
                setRating(0);
                setFeedback('');
            } else {
                setMessage({ type: 'error', text: response.data.message || 'Failed to submit feedback.' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Error connecting to server. Please try again.' });
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="feedback-premium-container">
            <div className="feedback-glass-card">
                <div className="feedback-header">
                    <h1>Your Feedback Matters ✨</h1>
                    <p > Help us improve the platform for everyone. Your thoughts are valuable.</p>
                </div>

                <div className="rating-section">
                    <h3>Rate your experience</h3>
                    <div className="stars-wrapper">
                        {[1, 2, 3, 4, 5].map(star => (
                            <span
                                key={star}
                                className={`star-icon ${rating >= star ? 'active' : ''}`}
                                onClick={() => setRating(star)}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                </div>

                <div className="input-section">
                    <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="What can we do better? Any suggestions or issues?"
                        className="feedback-textarea"
                    />
                </div>

                {message.text && (
                    <div className={`feedback-message ${message.type}`}>
                        {message.text}
                    </div>
                )}

                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="submit-feedback-btn"
                >
                    {isSubmitting ? 'Sending...' : 'Send Feedback 🚀'}
                </button>
            </div>
        </div>
    );
}
