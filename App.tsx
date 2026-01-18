import React, { useState } from 'react';
import Layout from './components/Layout';
import Home from './pages/Home';
import Divination from './pages/Divination';
import Result from './pages/Result';
import Library from './pages/Library';
import Profile from './pages/Profile';
import { TabKey, LineResult, DetailedAnalysis, LibraryTarget } from './types';
import { generateInterpretation } from './services/geminiService';
import { calculateHexagrams } from './utils/iching';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>(TabKey.Home);
  const [divinationResult, setDivinationResult] = useState<{ lines: LineResult[], question: string } | null>(null);
  
  // Navigation Params for Library (Deep Linking)
  const [libraryTarget, setLibraryTarget] = useState<LibraryTarget | null>(null);

  // Store the promise of the ongoing interpretation to pass to Result component
  const [aiPromise, setAiPromise] = useState<Promise<DetailedAnalysis> | null>(null);

  const handleDivinationProcessingStart = (lines: LineResult[], question: string) => {
      const { primary, relating } = calculateHexagrams(lines);
      const promise = generateInterpretation(question, primary, relating, lines);
      setAiPromise(promise);
  };

  const handleDivinationComplete = (lines: LineResult[], question: string) => {
    setDivinationResult({ lines, question });
  };

  const handleBackToDivination = () => {
    setDivinationResult(null);
    setAiPromise(null);
  };
  
  const handleNavigateToLibrary = (target: LibraryTarget) => {
      setLibraryTarget(target);
      setActiveTab(TabKey.Library);
  };

  const renderContent = () => {
    switch (activeTab) {
      case TabKey.Home:
        return <Home onNavigate={setActiveTab} />;
      case TabKey.Divination:
        if (divinationResult) {
            return (
                <Result 
                    lines={divinationResult.lines} 
                    question={divinationResult.question} 
                    onBack={handleBackToDivination} 
                    aiPromise={aiPromise}
                    onNavigateToLibrary={handleNavigateToLibrary}
                />
            );
        }
        return (
            <Divination 
                onComplete={handleDivinationComplete} 
                onProcessingStart={handleDivinationProcessingStart}
                onBack={() => setActiveTab(TabKey.Home)} 
            />
        );
      case TabKey.Library:
        return <Library initialTarget={libraryTarget} />;
      case TabKey.Profile:
        return <Profile />;
      default:
        return <Home onNavigate={setActiveTab} />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

export default App;