import React from 'react';
import { useSession } from './hooks/useSession';
import { DualPaneViewer } from './components/DualPaneViewer';
import { ControlPanel } from './components/ControlPanel';
import { FeedbackModal } from './components/FeedbackModal';
import { exportResultsToCSV } from './utils/csvExporter';
import { parseFolder } from './utils/folderParser';
import { AdminPortal } from './components/AdminPortal';

import logo from './assets/logo.jpeg';

// Common Header Component
const Header = ({ userId }) => (
  <header>
    <div
      style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}
      onClick={() => window.location.reload()}
      title="Return to Home"
    >
      <img src={logo} alt="Logo" style={{ height: '40px', width: 'auto' }} />
      <h1>MRI Authenticity Validator</h1>
    </div>
    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
      {userId && `User: ${userId}`}
    </div>
  </header>
);

function App() {
  const {
    phase,
    currentIndex,
    totalCases,
    currentPair,
    submitAnswer,
    feedback,
    nextAfterFeedback,
    results,
    userId,
    startDemo,
    startCustom,
    registerExpert,
    resetSession
  } = useSession();

  // State for registration input
  const [expertName, setExpertName] = React.useState('');

  const handleExport = () => {
    const filename = `${userId}_results.csv`;
    exportResultsToCSV(results, filename);
  };

  const handleFolderSelect = async (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      try {
        const manifest = await parseFolder(files);
        const count = manifest.warmup.length + manifest.test.length;
        if (count === 0) {
          alert("No valid cases found (looking for triplets of input/real/synth in folders named 'warmup' or 'test').");
        } else {
          startCustom(manifest);
        }
      } catch (err) {
        console.error(err);
        alert("Error parsing folder.");
      }
    }
  };

  const [adminMode, setAdminMode] = React.useState(false);

  if (adminMode) {
    return (
      <div className="layout-container">
        <Header userId={userId} />
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '10vh', flex: 1 }}>
          <AdminPortal onExit={() => setAdminMode(false)} />
        </div>
      </div>
    );
  }

  if (phase === 'loading') {
    return (
      <div className="layout-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', textAlign: 'center' }}>
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <img src={logo} alt="Logo" style={{ width: '120px', height: 'auto', marginBottom: '1rem' }} />
          </div>
          <h1>MRI Authenticity Validator</h1>
          <p style={{ color: 'var(--text-muted)' }}>Select a data source to begin evaluation.</p>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', overflow: 'hidden' }}>
              <button className="btn btn-primary">
                Load Image Folder
              </button>
              <input
                type="file"
                // Accept zip if possible, or directory if expert extracts it. 
                // User Prompt says "Upload the blinded directory". So expecting a folder.
                // But Admin generates a ZIP. Expert probably extracts it first? 
                // "Expert enters their name and uploads the blinded directory."
                // I'll support directory upload here.
                webkitdirectory=""
                directory=""
                multiple
                onChange={handleFolderSelect}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  opacity: 0,
                  cursor: 'pointer'
                }}
              />
            </div>
          </div>

          <div style={{ marginTop: '3rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', width: '100%' }}>
            <button
              onClick={() => setAdminMode(true)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer', opacity: 0.5 }}
            >
              Admin Access
            </button>
          </div>

          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            <strong>Expert Upload Guide:</strong> Unzip the package and upload the folder containing 'warmup' and 'test' subfolders.
          </p>
        </div>
      </div>
    );
  }



  if (phase === 'registration') {
    return (
      <div className="layout-container">
        <Header userId={userId} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <div style={styles.resultsContainer}>
            <h1>Expert Registration</h1>
            <p>Please enter your ID or Name to begin the session.</p>

            <input
              type="text"
              value={expertName}
              onChange={(e) => setExpertName(e.target.value)}
              placeholder="Enter Expert Name/ID"
              style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid var(--border-color)', minWidth: '250px' }}
            />

            <button
              className="btn btn-primary"
              onClick={() => {
                if (expertName.trim()) registerExpert(expertName.trim());
              }}
              disabled={!expertName.trim()}
            >
              Start Session
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'finished') {
    return (
      <div className="layout-container">
        <Header userId={userId} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <div style={styles.resultsContainer}>
            <h1>Session Complete</h1>
            <p>Thank you for participating.</p>

            <div style={styles.statBox}>
              <p><strong>Total Cases:</strong> {results.length}</p>
              <p><strong>User ID:</strong> {userId}</p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button className="btn btn-primary" onClick={handleExport}>
                Download Results (CSV)
              </button>

              <button className="btn" onClick={() => {
                window.location.reload();
              }}>
                Home
              </button>

              <button className="btn" onClick={() => {
                if (confirm("Have you downloaded the results? Clicking OK will reset for the next user.")) {
                  setExpertName('');
                  resetSession();
                }
              }}>
                Start New Session
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'transition_warmup_to_test') {
    return (
      <div className="layout-container">
        <Header userId={userId} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <div style={{ ...styles.resultsContainer, borderColor: 'var(--accent-color)' }}>
            <h1>Warm-up Complete</h1>
            <p>Starting Test Phase...</p>
            <div style={{ marginTop: '1rem', fontSize: '2rem' }}>⏳</div>
          </div>
        </div>
      </div>
    );
  }

  // Active Phase (Warmup or Test)
  // Ensure we have a pair to show
  if (!currentPair) {
    return <div className="layout-container"><div>Loading case...</div></div>;
  }

  return (
    <div className="layout-container">
      <Header userId={userId} />

      <div style={styles.mainContent}>
        <div style={styles.viewerSection}>
          <DualPaneViewer
            leftSrc={currentPair.input}
            rightSrc={currentPair.target}
            leftModality={currentPair.inputModality}
            rightModality={currentPair.targetModality}
          />
        </div>

        <div style={styles.sidebar}>
          <ControlPanel
            onSubmit={submitAnswer}
            currentCaseIndex={currentIndex}
            totalCases={totalCases}
            phase={phase}
          />
        </div>
      </div>

      {feedback && (
        <FeedbackModal
          correct={feedback.correct}
          actual={feedback.actualTarget}
          onNext={nextAfterFeedback}
        />
      )}
    </div>
  );
}

const styles = {
  mainContent: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden', // Contain scrolling
    height: '100%',
  },
  viewerSection: {
    flex: 1,
    height: '100%',
    overflow: 'hidden',
    position: 'relative',
  },
  sidebar: {
    width: '320px',
    background: 'var(--bg-primary)',
    borderLeft: '1px solid var(--border-color)',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 10,
  },
  resultsContainer: {
    background: 'var(--bg-secondary)',
    padding: '3rem',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-color)',
    textAlign: 'center',
    gap: '2rem',
    display: 'flex',
    flexDirection: 'column',
  },
  statBox: {
    background: 'var(--bg-tertiary)',
    padding: '1rem',
    borderRadius: 'var(--radius-md)',
    textAlign: 'left',
  }
};

export default App;
