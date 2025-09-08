import React, { useState } from 'react';
import { Baby, Calendar, Save, X, UserPlus, Users, Mail, Trash2 } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Child, User as UserType } from '../types';
import { formatDate, generateId } from '../utils';

interface ChildProfileProps {
  child: Child;
  onClose: () => void;
}

export default function ChildProfile({ child, onClose }: ChildProfileProps) {
  const { currentUser, children, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState<'edit' | 'parents'>('edit');
  const [formData, setFormData] = useState({
    name: child.name,
    dateOfBirth: child.dateOfBirth.toISOString().split('T')[0],
  });
  const [inviteEmail, setInviteEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedChild: Child = {
      ...child,
      name: formData.name,
      dateOfBirth: new Date(formData.dateOfBirth),
    };
    
    dispatch({ type: 'UPDATE_CHILD', payload: updatedChild });
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleInviteParent = (e: React.FormEvent) => {
    e.preventDefault();
    
    // For demo purposes, create a mock user and add them to the child
    const newParent: UserType = {
      id: generateId(),
      email: inviteEmail,
      name: inviteEmail.split('@')[0],
      createdAt: new Date(),
    };

    const updatedChild: Child = {
      ...child,
      parentIds: [...child.parentIds, newParent.id],
    };

    dispatch({ type: 'UPDATE_CHILD', payload: updatedChild });
    setInviteEmail('');
    
    // Show success message
    alert(`Invitation sent to ${inviteEmail}! They can now access ${child.name}'s feeding data.`);
  };

  const handleRemoveParent = (parentId: string) => {
    if (child.parentIds.length <= 1) {
      alert('Cannot remove the last parent from a child.');
      return;
    }

    if (window.confirm('Are you sure you want to remove this parent\'s access?')) {
      const updatedChild: Child = {
        ...child,
        parentIds: child.parentIds.filter(id => id !== parentId),
      };
      
      dispatch({ type: 'UPDATE_CHILD', payload: updatedChild });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-pink-400 to-purple-400 rounded-full w-12 h-12 flex items-center justify-center mr-3">
              <Baby className="text-white" size={20} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">{child.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
          <button
            onClick={() => setActiveTab('edit')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              activeTab === 'edit' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Edit Profile
          </button>
          <button
            onClick={() => setActiveTab('parents')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              activeTab === 'parents' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Parents ({child.parentIds.length})
          </button>
        </div>

        {activeTab === 'edit' && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                <Baby className="inline mr-2" size={16} />
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
                <Calendar className="inline mr-2" size={16} />
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

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center text-gray-600 mb-2">
                <Calendar size={16} className="mr-2" />
                <span className="text-sm">Current birth date: {formatDate(child.dateOfBirth)}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Users size={16} className="mr-2" />
                <span className="text-sm">{child.parentIds.length} parent{child.parentIds.length !== 1 ? 's' : ''} have access</span>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all flex items-center justify-center"
              >
                <Save size={18} className="mr-2" />
                Save Changes
              </button>
            </div>
          </form>
        )}

        {activeTab === 'parents' && (
          <div className="space-y-6">
            {/* Current Parents */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Current Parents</h3>
              <div className="space-y-3">
                {child.parentIds.map(parentId => (
                  <div key={parentId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="bg-emerald-100 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                        <Users size={16} className="text-emerald-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {parentId === currentUser?.id ? 'You' : `Parent ${parentId.slice(0, 8)}`}
                        </div>
                        <div className="text-sm text-gray-500">
                          {parentId === currentUser?.id ? currentUser.email : 'parent@example.com'}
                        </div>
                      </div>
                    </div>
                    {parentId !== currentUser?.id && (
                      <button
                        onClick={() => handleRemoveParent(parentId)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove parent access"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Invite New Parent */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Invite Another Parent</h3>
              <form onSubmit={handleInviteParent} className="space-y-4">
                <div>
                  <label htmlFor="inviteEmail" className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="inline mr-2" size={16} />
                    Parent's Email Address
                  </label>
                  <input
                    type="email"
                    id="inviteEmail"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    placeholder="Enter email address"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all flex items-center justify-center"
                >
                  <UserPlus size={18} className="mr-2" />
                  Send Invitation
                </button>
              </form>
              <p className="text-sm text-gray-500 mt-2">
                The invited parent will be able to view and add feeding entries for {child.name}.
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}