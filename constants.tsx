
import React from 'react';

export const COLORS = {
  // Dark mode colors (neon)
  neonRed: '#FA114F',
  neonOrange: '#FF9500',
  neonBlue: '#00F5EA',
  neonGreen: '#A8FF2E',
  bgBlack: '#000000',
  cardGray: '#1C1C1E',
  textGray: '#8E8E93',
  trackRed: '#330b15',
  trackOrange: '#332200',
  trackBlue: '#002927',

  // Light mode colors (accessible)
  lightRed: '#dc2626',      // red-600
  lightOrange: '#ea580c',   // orange-600
  lightBlue: '#0284c7',     // sky-600
  lightGreen: '#16a34a'     // green-600
};

export const Icons = {
  Alert: () => (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4m0 4h.01" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Clock: () => (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Edit: () => (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  ),
  Check: () => (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
      <path d="M22 4L12 14.01l-3-3"/>
    </svg>
  ),
  Search: () => (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="8"/>
      <path d="M21 21l-4.35-4.35" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  File: () => (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" />
      <path d="M13 2v7h7" />
    </svg>
  ),
  Activity: () => (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  ChevronDown: () => (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
};
