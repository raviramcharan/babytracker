import React from 'react';
import { Baby, LogOut, ArrowLeft, Plus, Settings } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

interface HeaderProps {
  onAddFeeding: () => void;
  onOpenAccountSettings: () => void;
}

export default function Header({ onAddFeeding, onOpenAccountSettings }: HeaderProps) {
  const { currentUser, selectedChild, dispatch } = useApp();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      dispatch({ type: 'SET_USER', payload: null });
      dispatch({ type: 'SELECT_CHILD', payload: null });
    }
  };

  const handleBackToChildren = () => {
    dispatch({ type: 'SELECT_CHILD', payload: null });
  };

  return (
    <header className="bg-white shadow-lg border-b-2 border-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button
              onClick={handleBackToChildren}
              className="mr-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Back to children"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-emerald-400 to-pink-400 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                <Baby className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{selectedChild?.name}</h1>
                <p className="text-sm text-gray-500">Feeding Tracker</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={onAddFeeding}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:from-emerald-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center"
            >
              <Plus size={18} className="mr-2" />
              Add Feeding
            </button>

            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">{currentUser?.name}</div>
                <div className="text-xs text-gray-500">{currentUser?.email}</div>
              </div>
              <button
                onClick={onOpenAccountSettings}
                className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                title="Account settings"
              >
                <Settings size={20} />
              </button>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Log out"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}