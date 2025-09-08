import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User, Child, FeedingEntry, AppState } from '../types';

type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'ADD_CHILD'; payload: Child }
  | { type: 'UPDATE_CHILD'; payload: Child }
  | { type: 'SELECT_CHILD'; payload: Child | null }
  | { type: 'ADD_FEEDING_ENTRY'; payload: FeedingEntry }
  | { type: 'UPDATE_FEEDING_ENTRY'; payload: FeedingEntry }
  | { type: 'DELETE_FEEDING_ENTRY'; payload: string }
  | { type: 'LOAD_DATA'; payload: AppState };

interface AppContextType extends AppState {
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | null>(null);

const initialState: AppState = {
  currentUser: null,
  children: [],
  feedingEntries: [],
  selectedChild: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, currentUser: action.payload };
    case 'UPDATE_USER':
      return { ...state, currentUser: action.payload };
    case 'ADD_CHILD':
      return { ...state, children: [...state.children, action.payload] };
    case 'UPDATE_CHILD':
      return {
        ...state,
        children: state.children.map(child =>
          child.id === action.payload.id ? action.payload : child
        ),
        selectedChild: state.selectedChild?.id === action.payload.id ? action.payload : state.selectedChild,
      };
    case 'SELECT_CHILD':
      return { ...state, selectedChild: action.payload };
    case 'ADD_FEEDING_ENTRY':
      return { ...state, feedingEntries: [...state.feedingEntries, action.payload] };
    case 'UPDATE_FEEDING_ENTRY':
      return {
        ...state,
        feedingEntries: state.feedingEntries.map(entry =>
          entry.id === action.payload.id ? action.payload : entry
        ),
      };
    case 'DELETE_FEEDING_ENTRY':
      return {
        ...state,
        feedingEntries: state.feedingEntries.filter(entry => entry.id !== action.payload),
      };
    case 'LOAD_DATA':
      return action.payload;
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('babyFeedingApp');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        // Convert date strings back to Date objects
        if (parsedData.currentUser) {
          parsedData.currentUser.createdAt = new Date(parsedData.currentUser.createdAt);
        }
        parsedData.children = parsedData.children.map((child: any) => ({
          ...child,
          dateOfBirth: new Date(child.dateOfBirth),
          createdAt: new Date(child.createdAt),
        }));
        parsedData.feedingEntries = parsedData.feedingEntries.map((entry: any) => ({
          ...entry,
          date: new Date(entry.date),
          createdAt: new Date(entry.createdAt),
        }));
        if (parsedData.selectedChild) {
          parsedData.selectedChild.dateOfBirth = new Date(parsedData.selectedChild.dateOfBirth);
          parsedData.selectedChild.createdAt = new Date(parsedData.selectedChild.createdAt);
        }
        dispatch({ type: 'LOAD_DATA', payload: parsedData });
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem('babyFeedingApp', JSON.stringify(state));
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
    }
  }, [state]);

  const value: AppContextType = {
    ...state,
    dispatch,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}