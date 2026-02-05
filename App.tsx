import React, { useState } from 'react';
import Layout from './components/Layout';
import SplitCalculator from './components/SplitCalculator';
import ProStopwatch from './components/ProStopwatch';
import MultiRunnerTimer from './components/MultiRunnerTimer';
import { AppTab } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.CALCULATOR);

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.CALCULATOR:
        return <SplitCalculator />;
      case AppTab.STOPWATCH:
        return <ProStopwatch />;
      case AppTab.MULTI_RUNNER:
        return <MultiRunnerTimer />;
      default:
        return <SplitCalculator />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="animate-in fade-in duration-300">
        {renderContent()}
      </div>
    </Layout>
  );
};

export default App;