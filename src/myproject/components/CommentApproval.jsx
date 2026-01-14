import React, { useState, useEffect, useCallback } from 'react';
import "./CommentApproval.css";
import { getPendingComments, getAllComments, approveComment, rejectComment, deleteComment } from "../../api/media/mediaApi";

const CommentApproval = () => {
  const [pendingComments, setPendingComments] = useState([]);
  const [allComments, setAllComments] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState({});

  const fetchPendingComments = useCallback(async () => {
    try {
      const response = await getPendingComments();
      setPendingComments(response.data);
    } catch (error) {
      console.error('Error fetching pending comments:', error);
    }
  }, []);

  const fetchAllComments = useCallback(async () => {
    try {
      const response = await getAllComments();
      setAllComments(response.data);
    } catch (error) {
      console.error('Error fetching all comments:', error);
    }
  }, []);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([fetchPendingComments(), fetchAllComments()]);
      setError('');
    } catch (error) {
      setError('Failed to load comments');
    } finally {
      setLoading(false);
    }
  }, [fetchPendingComments, fetchAllComments]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleAction = async (commentId, action) => {
    setActionLoading(prev => ({ ...prev, [commentId]: action }));

    try {
      let response;
      if (action === 'approve') {
        response = await approveComment(commentId);
      } else if (action === 'reject') {
        response = await rejectComment(commentId);
      }

      if (response.data.status) {
        await fetchComments();
      } else {
        setError(response.data.message || `Failed to ${action} comment`);
      }
    } catch (error) {
      setError(`Error ${action}ing comment`);
      console.error('Error:', error);
    } finally {
      setActionLoading(prev => ({ ...prev, [commentId]: null }));
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    setActionLoading(prev => ({ ...prev, [commentId]: 'delete' }));

    try {
      const response = await deleteComment(commentId);

      if (response.data.status) {
        await fetchComments();
      } else {
        setError(response.data.message || 'Failed to delete comment');
      }
    } catch (error) {
      setError('Error deleting comment');
      console.error('Error:', error);
    } finally {
      setActionLoading(prev => ({ ...prev, [commentId]: null }));
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusClass = status.toLowerCase();
    return <span className={`status-badge ${statusClass}`}>{status}</span>;
  };

  if (loading) {
    return <div className="approval-container loading">Loading comments...</div>;
  }

  const currentComments = activeTab === 'pending' ? pendingComments : allComments;

  return (
    <div className="approval-container">
      <h2>Comment Management</h2>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          Pending ({pendingComments.length})
        </button>
        <button
          className={`tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Comments ({allComments.length})
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="comments-container">
        {currentComments.length === 0 ? (
          <div className="no-comments">
            <p>No {activeTab === 'pending' ? 'pending' : ''} comments found.</p>
          </div>
        ) : (
          <div className="comments-grid">
            {currentComments.map((comment) => (
              <div key={comment.id} className="comment-card">
                <div className="comment-header">
                  <div className="comment-info">
                    <strong>{comment.name}</strong>
                    {activeTab === 'all' && getStatusBadge(comment.status)}
                  </div>
                  <span className="comment-date">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>

                <div className="comment-content">
                  {comment.content}
                </div>

                <div className="comment-actions">
                  {comment.status === 'PENDING' && (
                    <>
                      <button
                        className="action-btn approve"
                        onClick={() => handleAction(comment.id, 'approve')}
                        disabled={actionLoading[comment.id]}
                      >
                        {actionLoading[comment.id] === 'approve' ? 'Approving...' : 'Approve'}
                      </button>
                      <button
                        className="action-btn reject"
                        onClick={() => handleAction(comment.id, 'reject')}
                        disabled={actionLoading[comment.id]}
                      >
                        {actionLoading[comment.id] === 'reject' ? 'Rejecting...' : 'Reject'}
                      </button>
                    </>
                  )}
                  <button
                    className="action-btn delete"
                    onClick={() => handleDelete(comment.id)}
                    disabled={actionLoading[comment.id]}
                  >
                    {actionLoading[comment.id] === 'delete' ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentApproval;