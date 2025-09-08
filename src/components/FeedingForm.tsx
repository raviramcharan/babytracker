import React, { useState } from 'react';
import { Plus, Bot as Bottle, Heart, Clock, Calendar, FileText, Droplet } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { FeedingEntry } from '../types';
import { generateId, getCurrentDate, getCurrentTime } from '../utils';

interface FeedingFormProps {
  onClose: () => void;
  editEntry?: FeedingEntry | null;
}

export default function FeedingForm({ onClose, editEntry }: FeedingFormProps) {
  const { currentUser, selectedChild, dispatch } = useApp();
  const [formData, setFormData] = useState({
    date: editEntry ? editEntry.date.toISOString().split('T')[0] : getCurrentDate(),
    time: editEntry ? editEntry.time : getCurrentTime(),
    feedingType: editEntry ? editEntry.feedingType : 'bottle' as 'bottle' | 'breast',
    amountMl: editEntry?.amountMl?.toString() || '',
    leftBreastMinutes: editEntry?.leftBreastMinutes?.toString() || '',
    rightBreastMinutes: editEntry?.rightBreastMinutes?.toString() || '',
    notes: editEntry?.notes || '',
    spitUp: editEntry?.spitUp || false,
    peed: editEntry?.peed || false,
    pooped: editEntry?.pooped || false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const entry: FeedingEntry = {
      id: editEntry ? editEntry.id : generateId(),
      childId: selectedChild!.id,
      userId: currentUser!.id,
      date: new Date(formData.date),
      time: formData.time,
      feedingType: formData.feedingType,
      amountMl: formData.feedingType === 'bottle' && formData.amountMl ? parseInt(formData.amountMl) : undefined,
      leftBreastMinutes: formData.feedingType === 'breast' && formData.leftBreastMinutes ? parseInt(formData.leftBreastMinutes) : undefined,
      rightBreastMinutes: formData.feedingType === 'breast' && formData.rightBreastMinutes ? parseInt(formData.rightBreastMinutes) : undefined,
      notes: formData.notes || undefined,
      spitUp: formData.spitUp,
      peed: formData.peed,
      pooped: formData.pooped,
      createdAt: editEntry ? editEntry.createdAt : new Date(),
    };

    if (editEntry) {
      dispatch({ type: 'UPDATE_FEEDING_ENTRY', payload: entry });
    } else {
      dispatch({ type: 'ADD_FEEDING_ENTRY', payload: entry });
    }
    
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleFeedingTypeChange = (type: 'bottle' | 'breast') => {
    setFormData(prev => ({
      ...prev,
      feedingType: type,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {editEntry ? 'Edit Feeding' : 'Add Feeding Entry'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline mr-2" size={16} />
                Date
              </label>
              <input
                type="date"
                name="date"
                required
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="inline mr-2" size={16} />
                Time
              </label>
              <input
                type="time"
                name="time"
                required
                value={formData.time}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          {/* Feeding Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Feeding Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleFeedingTypeChange('bottle')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  formData.feedingType === 'bottle'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Bottle className="mx-auto mb-2" size={24} />
                <span className="block font-medium">Bottle</span>
              </button>
              <button
                type="button"
                onClick={() => handleFeedingTypeChange('breast')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  formData.feedingType === 'breast'
                    ? 'border-pink-500 bg-pink-50 text-pink-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Heart className="mx-auto mb-2" size={24} />
                <span className="block font-medium">Breast</span>
              </button>
            </div>
          </div>

          {/* Feeding Amount/Time */}
          {formData.feedingType === 'bottle' && (
            <div>
              <label htmlFor="amountMl" className="block text-sm font-medium text-gray-700 mb-2">
                Amount (ml)
              </label>
              <input
                type="number"
                id="amountMl"
                name="amountMl"
                min="0"
                max="500"
                value={formData.amountMl}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                placeholder="Enter amount in ml"
              />
            </div>
          )}

          {formData.feedingType === 'breast' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="leftBreastMinutes" className="block text-sm font-medium text-gray-700 mb-2">
                  Left Breast (min)
                </label>
                <input
                  type="number"
                  id="leftBreastMinutes"
                  name="leftBreastMinutes"
                  min="0"
                  max="120"
                  value={formData.leftBreastMinutes}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
                  placeholder="Minutes"
                />
              </div>
              <div>
                <label htmlFor="rightBreastMinutes" className="block text-sm font-medium text-gray-700 mb-2">
                  Right Breast (min)
                </label>
                <input
                  type="number"
                  id="rightBreastMinutes"
                  name="rightBreastMinutes"
                  min="0"
                  max="120"
                  value={formData.rightBreastMinutes}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
                  placeholder="Minutes"
                />
              </div>
            </div>
          )}

          {/* Optional Checkboxes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Additional Notes
            </label>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="spitUp"
                  checked={formData.spitUp}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <span className="ml-3 text-gray-700">Spit up</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="peed"
                  checked={formData.peed}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                />
                <span className="ml-3 text-gray-700">Peed</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="pooped"
                  checked={formData.pooped}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                />
                <span className="ml-3 text-gray-700">Pooped</span>
              </label>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="inline mr-2" size={16} />
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              value={formData.notes}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-none"
              placeholder="Any additional notes..."
            />
          </div>

          {/* Submit Buttons */}
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
              className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all"
            >
              {editEntry ? 'Update' : 'Add Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}