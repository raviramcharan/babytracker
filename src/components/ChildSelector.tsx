import React, { useState } from 'react';
import { Plus, Baby, Users, Calendar, Settings } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Child } from '../types';
import { generateId, formatDate } from '../utils';
import ChildProfile from './ChildProfile';

export default function ChildSelector() {
  const { currentUser, children, selectedChild, dispatch } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingChild, setEditingChild] = useState<Child | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    parentEmail: '',
  });

  // Filter children accessible to current user
  const accessibleChildren = children.filter(child => 
    child.parentIds.includes(currentUser!.id)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newChild: Child = {
      id: generateId(),
      name: formData.name,
      dateOfBirth: new Date(formData.dateOfBirth),
      parentIds: [currentUser!.id],
      createdAt: new Date(),
    };

    dispatch({ type: 'ADD_CHILD', payload: newChild });
    setFormData({ name: '', dateOfBirth: '', parentEmail: '' });
    setShowAddForm(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (selectedChild) {
    return null; // Child is selected, show main app
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome, {currentUser?.name}!</h1>
          <p className="text-gray-600">Select a child to start tracking or add a new one</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {accessibleChildren.map(child => (
            <div
              key={child.id}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-2 border-transparent hover:border-emerald-200 relative group"
            >
              <div 
                className="text-center cursor-pointer"
                onClick={() => dispatch({ type: 'SELECT_CHILD', payload: child })}
              >
                <div className="bg-gradient-to-r from-pink-400 to-purple-400 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Baby className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{child.name}</h3>
                <div className="flex items-center justify-center text-gray-600 mb-2">
                  <Calendar size={16} className="mr-2" />
                  <span className="text-sm">Born {formatDate(child.dateOfBirth)}</span>
                </div>
                <div className="flex items-center justify-center text-gray-500">
                  <Users size={14} className="mr-1" />
                  <span className="text-xs">{child.parentIds.length} parent{child.parentIds.length !== 1 ? 's' : ''}</span>
                </div>
              </div>
              
              {/* Edit Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingChild(child);
                }}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                title="Edit child profile"
              >
                <Settings size={16} />
              </button>
            </div>
          ))}

          <div
            onClick={() => setShowAddForm(true)}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 cursor-pointer border-2 border-dashed border-gray-300 hover:border-emerald-400 flex flex-col items-center justify-center min-h-[200px]"
          >
            <Plus className="text-emerald-500 mb-4" size={32} />
            <span className="text-gray-600 font-medium">Add New Child</span>
          </div>
        </div>

        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Child</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Child's Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    placeholder="Enter child's name"
                  />
                </div>

                <div>
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    required
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all"
                  >
                    Add Child
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {editingChild && (
          <ChildProfile
            child={editingChild}
            onClose={() => setEditingChild(null)}
          />
        )}
      </div>
    </div>
  );
}