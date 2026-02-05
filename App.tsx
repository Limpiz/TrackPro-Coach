import React, { useState } from 'react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('CALCULATOR');

  return (
    <div style={{ padding: '20px', backgroundColor: '#0f172a', minHeight: '100vh', color: 'white' }}>
      <nav style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button onClick={() => setActiveTab('CALCULATOR')}>Calculator</button>
        <button onClick={() => setActiveTab('STOPWATCH')}>Stopwatch</button>
      </nav>
      
      <h1>TrackPro Coach</h1>
      <p>Current Tab: {activeTab}</p>
      <div style={{ border: '1px solid #334155', padding: '20px', borderRadius: '8px' }}>
        {activeTab === 'CALCULATOR' && <div>Split Calculator coming soon...</div>}
        {activeTab === 'STOPWATCH' && <div>Pro Stopwatch coming soon...</div>}
      </div>
    </div>
  );
};

export default App;