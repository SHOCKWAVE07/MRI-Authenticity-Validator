import React, { useState, useEffect } from 'react';

export function ControlPanel({ onSubmit, currentCaseIndex, totalCases, phase }) {
    const [selection, setSelection] = useState(null); // 'Real' | 'Synthetic'
    const [confidence, setConfidence] = useState(3); // 1-5

    // Reset state when case index changes
    useEffect(() => {
        setSelection(null);
        setConfidence(3);
    }, [currentCaseIndex]);

    const handleSubmit = () => {
        if (selection) {
            onSubmit(selection, confidence);
        }
    };

    return (
        <div className="control-panel" style={styles.container}>
            <div style={styles.header}>
                <div style={styles.phaseBadge}>
                    {phase === 'warmup' ? 'Warm-up Phase' : 'Test Phase'}
                </div>
                <div style={styles.progress}>
                    Case {currentCaseIndex + 1} / {totalCases}
                </div>
            </div>

            <div style={styles.section}>
                <label style={styles.label}>Prediction</label>
                <div style={styles.buttonGroup}>
                    <button
                        className={`btn ${selection === 'Real' ? 'selected' : ''}`}
                        style={{ ...styles.choiceBtn, ...(selection === 'Real' ? styles.selectedReal : {}) }}
                        onClick={() => setSelection('Real')}
                    >
                        Real
                    </button>
                    <button
                        className={`btn ${selection === 'Synthetic' ? 'selected' : ''}`}
                        style={{ ...styles.choiceBtn, ...(selection === 'Synthetic' ? styles.selectedSynth : {}) }}
                        onClick={() => setSelection('Synthetic')}
                    >
                        Synthetic
                    </button>
                </div>
            </div>

            <div style={styles.section}>
                <label style={styles.label}>Confidence: {confidence}</label>
                <div style={styles.sliderContainer}>
                    <span>Low</span>
                    <input
                        type="range"
                        min="1"
                        max="5"
                        step="1"
                        value={confidence}
                        onChange={(e) => setConfidence(Number(e.target.value))}
                        style={styles.slider}
                    />
                    <span>High</span>
                </div>
            </div>

            <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={!selection}
                style={styles.submitBtn}
            >
                Submit Evaluation
            </button>
        </div>
    );
}

const styles = {
    container: {
        background: 'var(--bg-secondary)',
        padding: '1.5rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        width: '300px',
        flexShrink: 0,
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '0.5rem',
        fontSize: '0.85rem',
        color: 'var(--text-muted)',
    },
    phaseBadge: {
        background: 'var(--bg-tertiary)',
        padding: '0.2rem 0.6rem',
        borderRadius: '99px',
        fontSize: '0.75rem',
        textTransform: 'uppercase',
        fontWeight: 600,
        letterSpacing: '0.05em',
    },
    section: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
    label: {
        fontSize: '0.9rem',
        fontWeight: 500,
        color: 'var(--text-main)',
    },
    buttonGroup: {
        display: 'flex',
        gap: '0.5rem',
    },
    choiceBtn: {
        flex: 1,
        padding: '0.75rem',
        justifyContent: 'center',
        border: '2px solid transparent',
    },
    selectedReal: {
        background: 'rgba(34, 197, 94, 0.2)',
        borderColor: 'var(--success)',
        color: 'var(--success)',
    },
    selectedSynth: {
        background: 'rgba(239, 68, 68, 0.2)',
        borderColor: 'var(--error)',
        color: 'var(--error)',
    },
    sliderContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
    },
    slider: {
        flex: 1,
        accentColor: 'var(--accent-color)',
    },
    submitBtn: {
        marginTop: 'auto',
        padding: '0.8rem',
        fontSize: '1rem',
    },
};
