import React, { useState } from 'react';
import { Edit3, Trash2, Bot as Bottle, Heart, Clock, Calendar, FileText, Droplet } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { FeedingEntry } from '../types';
import { formatDate, formatTime, sortFeedingEntries } from '../utils';

interface FeedingListProps {
  onEditEntry: (entry: FeedingEntry) => void;
}

export default function FeedingList({ onEditEntry }: FeedingListProps) {
  const { selectedChild, feedingEntries, dispatch } = useApp();
  const [filter, setFilter] = useState<'all' | 'bottle' | 'breast'>('all');

  // Filter entries for selected child
  const childEntries = feedingEntries.filter(entry => entry.childId === selectedChild?.id);
  
  // Apply feeding type filter
  const filteredEntries = filter === 'all' 
    ? childEntries 
    : childEntries.filter(entry => entry.feedingType === filter);
  
  // Sort by most recent first
  const sortedEntries = sortFeedingEntries(filteredEntries);

  const handleDelete = (entryId: string) => {
    if (window.confirm('Are you sure you want to delete this feeding entry?')) {
      dispatch({ type: 'DELETE_FEEDING_ENTRY', payload: entryId });
    }
  };

  if (sortedEntries.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <Bottle size={48} className="mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No feeding entries yet</h3>
        <p className="text-gray-500">Add your first feeding entry to get started!</p>
      </div>
    );
  }

  return (
    <div>
      {/* Filter Tabs */}
      <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
            filter === 'all' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          All Feedings
        </button>
        <button
          onClick={() => setFilter('bottle')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
            filter === 'bottle' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Bottle Only
        </button>
        <button
          onClick={() => setFilter('breast')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
            filter === 'breast' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Breast Only
        </button>
      </div>

      {/* Feeding Entries */}
      <div className="space-y-4">
        {sortedEntries.map(entry => (
          <div key={entry.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                {/* Icon */}
                <div className={`rounded-full p-3 ${
                  entry.feedingType === 'bottle' 
                    ? 'bg-emerald-100 text-emerald-600' 
                    : 'bg-pink-100 text-pink-600'
                }`}>
                  {entry.feedingType === 'bottle' ? <Bottle size={20} /> : <Heart size={20} />}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center text-gray-600">
                      <Calendar size={16} className="mr-2" />
                      <span className="font-medium">{formatDate(entry.date)}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock size={16} className="mr-2" />
                      <span className="font-medium">{formatTime(entry.time)}</span>
                    </div>
                  </div>

                  {/* Feeding Details */}
                  <div className="mb-3">
                    {entry.feedingType === 'bottle' && entry.amountMl && (
                      <div className="text-lg font-semibold text-emerald-600">
                        {entry.amountMl} ml
                      </div>
                    )}
                    {entry.feedingType === 'breast' && (
                      <div className="flex space-x-4 text-sm">
                        {entry.leftBreastMinutes && (
                          <span className="text-pink-600 font-medium">
                            Left: {entry.leftBreastMinutes}m
                          </span>
                        )}
                        {entry.rightBreastMinutes && (
                          <span className="text-pink-600 font-medium">
                            Right: {entry.rightBreastMinutes}m
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Additional Info */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {entry.spitUp && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                        <Droplet size={12} className="mr-1" />
                        Spit up
                      </span>
                    )}
                    {entry.peed && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                        💧 Peed
                      </span>
                    )}
                    {entry.pooped && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">
                        💩 Pooped
                      </span>
                    )}
                  </div>

                  {/* Notes */}
                  {entry.notes && (
                    <div className="flex items-start text-gray-600 text-sm">
                      <FileText size={14} className="mr-2 mt-0.5 flex-shrink-0" />
                      <p>{entry.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => onEditEntry(entry)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit entry"
                >
                  <Edit3 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete entry"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}