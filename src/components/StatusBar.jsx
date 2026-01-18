import React from 'react';

const StatusBar = ({ message, progress, type = 'normal' }) => {
    const getStatusColor = () => {
        if (type === 'error') return 'var(--danger)';
        if (type === 'success') return 'var(--success)';
        return 'var(--text-color)';
    };

    return (
        <div className="status-bar" style={{ borderLeftColor: getStatusColor() }}>
            <span style={{ color: getStatusColor(), fontWeight: 'bold' }}>
                {message}
            </span>
            <div className="progress-container" style={{ display: progress > 0 ? 'block' : 'none' }}>
                <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
            </div>
        </div>
    );
};

export default StatusBar;