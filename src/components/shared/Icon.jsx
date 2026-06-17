import React from 'react'

const Icon = {
  arrow: (p) => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" {...p}><path d="M3 11L11 3M11 3H5M11 3V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  arrowR: (p) => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" {...p}><path d="M2 7H12M12 7L8 3M12 7L8 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  play: (p) => <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" {...p}><path d="M3 1.5L10.5 6 3 10.5V1.5Z"/></svg>,
  pin: (p) => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" {...p}><path d="M7 1C4.5 1 2.5 3 2.5 5.5c0 3 4.5 7.5 4.5 7.5s4.5-4.5 4.5-7.5C11.5 3 9.5 1 7 1z" stroke="currentColor" strokeWidth="1.5"/><circle cx="7" cy="5.5" r="1.5" fill="currentColor"/></svg>,
  sun: (p) => <svg width="48" height="48" viewBox="0 0 48 48" fill="none" {...p}><circle cx="24" cy="24" r="8" fill="#d4a017"/><g stroke="#d4a017" strokeWidth="2" strokeLinecap="round"><path d="M24 6v6M24 36v6M6 24h6M36 24h6M11 11l4 4M33 33l4 4M37 11l-4 4M11 37l4-4"/></g></svg>,
  cloud: (p) => <svg width="48" height="48" viewBox="0 0 48 48" fill="none" {...p}><path d="M14 30c-3 0-6-2-6-6s3-6 6-6c1-5 5-8 10-8s9 3 10 8c4 0 8 3 8 7s-4 7-8 7H14z" fill="#a8b8c8" stroke="#6b7888" strokeWidth="1"/></svg>,
};

export default Icon
