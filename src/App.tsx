import React, { useState } from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import Login from './components/Login';
import ChildSelector from './components/ChildSelector';
import Header from './components/Header';
import FeedingList from './components/FeedingList';
import FeedingForm from './components/FeedingForm';
import AccountSettings from './components/AccountSettings';
import { FeedingEntry } from './types';

function AppContent() {
  const { currentUser, selectedChild } = useApp();
  const [showFeedingForm, setShowFeedingForm] = useState(false);
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const [editingEntry, setEditingEntry] = useState<FeedingEntry | null>(null);

  const handleAddFeeding = () => {
    setEditingEntry(null);
    setShowFeedingForm(true);
  };

  const handleEditEntry = (entry: FeedingEntry) => {
    setEditingEntry(entry);
    setShowFeedingForm(true);
  };

  const handleCloseFeedingForm = () => {
    setShowFeedingForm(false);
    setEditingEntry(null);
  };

  // Show login if no user
  if (!currentUser) {
    return <Login />;
  }

  // Show child selector if no child selected
  if (!selectedChild) {
    return <ChildSelector />;
  }

  // Show main app
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-pink-50">
      <Header 
        onAddFeeding={handleAddFeeding} 
        onOpenAccountSettings={() => setShowAccountSettings(true)}
      />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <FeedingList onEditEntry={handleEditEntry} />
      </main>

      {showFeedingForm && (
        <FeedingForm 
          onClose={handleCloseFeedingForm}
          editEntry={editingEntry}
        />
      )}

      {showAccountSettings && (
        <AccountSettings onClose={() => setShowAccountSettings(false)} />
      )}
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;