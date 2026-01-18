import React from 'react';

const DataPreviewModal = ({ isOpen, onClose, data }) => {
    if (!isOpen) return null;

    return (
        <div className={`modal-overlay ${isOpen ? 'open' : ''}`}>
            <div className="modal-content" style={{ maxWidth: '800px' }}>
                <div className="modal-header">
                    <span>名單預覽 (共 {data.length} 人)</span>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>
                
                <div className="modal-list">
                    <table className="preview-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>姓名</th>
                                <th>分數</th>
                                <th>隊長 (隊名)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((player) => (
                                <tr key={player.id}>
                                    <td>{player.id}</td>
                                    <td>{player.name}</td>
                                    <td>{player.score}</td>
                                    <td>{player.team || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DataPreviewModal;