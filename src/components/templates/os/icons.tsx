import React from 'react';

// Note: These are simplified, pixel-art inspired icons for the Win95 theme.

export const NotepadIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M6 2H22L28 8V30H6V2ZM8 4V28H26V9H21V4H8Z" fill="white"/>
    <path d="M10 12H20V14H10V12ZM10 16H20V18H10V16ZM10 20H16V22H10V20Z" fill="#2E3192"/>
  </svg>
);

export const AddressBookIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 4H28V28H4V4Z" fill="#FFC90E"/>
        <path d="M4 4H28V8H4V4Z" fill="#E8B80C"/>
        <path d="M26 4H28V28H26V4Z" fill="#E8B80C"/>
        <path d="M8 12H14V14H8V12ZM8 18H12V20H8V18ZM18 14C19.1046 14 20 13.1046 20 12C20 10.8954 19.1046 10 18 10C16.8954 10 16 10.8954 16 12C16 13.1046 16.8954 14 18 14Z" fill="black"/>
        <path d="M22 22C22 19.7909 20.2091 18 18 18C15.7909 18 14 19.7909 14 22H22Z" fill="black"/>
    </svg>
);

export const BriefcaseIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 10H28V26H4V10Z" fill="#A54B00"/>
        <path d="M2 8H30V12H2V8Z" fill="#C45700"/>
        <path d="M12 4H20V8H12V4Z" fill="#C45700"/>
        <path d="M14 6H18V8H14V6Z" fill="#A54B00"/>
        <path d="M14 16H18V18H14V16Z" fill="#FFC90E"/>
    </svg>
);

export const DiplomaIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 4H24V28H8V4Z" fill="white"/>
        <path d="M6 2H26V6H6V2Z" fill="#C0C0C0"/>
        <path d="M6 26H26V30H6V26Z" fill="#C0C0C0"/>
        <path d="M16 10L18 14H22L19 16.5L20 20.5L16 18L12 20.5L13 16.5L10 14H14L16 10Z" fill="#FFC90E"/>
        <path d="M12 22H20V24H12V22Z" fill="#ED1C24"/>
    </svg>
);

export const ToolboxIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 10H28V26H4V10Z" fill="#ED1C24"/>
        <path d="M2 8H30V12H2V8Z" fill="#BF171D"/>
        <path d="M10 16L4 22V24H8L14 18L10 16Z" fill="#C0C0C0"/>
        <path d="M24 16H18V20H24V16Z" fill="#2E3192"/>
    </svg>
);

export const FolderIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 6H14V4H28V26H4V6Z" fill="#FFC90E"/>
    <path d="M2 8H30V28H2V8Z" fill="#FFC90E"/>
  </svg>
);

export const UsersIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="10" cy="12" r="4" fill="#2E3192"/>
        <path d="M16 22H4C4 17.5817 7.58172 14 12 14H8C5.79086 14 4 15.7909 4 18V22Z" fill="#2E3192"/>
        <circle cx="22" cy="12" r="4" fill="#ED1C24"/>
        <path d="M28 22H16C16 17.5817 19.5817 14 24 14H20C17.7909 14 16 15.7909 16 18V22Z" fill="#ED1C24"/>
    </svg>
);

export const StarIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 2L20 10L29 11L22 18L24 27L16 22L8 27L10 18L3 11L12 10L16 2Z" fill="#FFC90E"/>
    </svg>
);

export const CalculatorIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 2H24V30H8V2Z" fill="#C0C0C0"/>
        <path d="M10 4H22V12H10V4Z" fill="white"/>
        <path d="M12 16H15V19H12V16ZM17 16H20V19H17V16ZM12 21H15V24H12V21ZM17 21H20V24H17V21Z" fill="black"/>
    </svg>
);

export const MailIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 8H28V24H4V8Z" fill="white"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M4 8L16 18L28 8V6H4V8Z" fill="#C0C0C0"/>
    </svg>
);

export const WindowsFlagIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 105 105" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 15L48 8V48L0 55V15Z" fill="#FF3B3B"/>
      <path d="M52 7L104 0V41L52 48V7Z" fill="#05E288"/>
      <path d="M0 60L48 53V93L0 100V60Z" fill="#00A9E2"/>
      <path d="M52 53L104 46V88L52 95V53Z" fill="#FFC90E"/>
    </svg>
);

export const CoverLetterIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 2H22L28 8V30H6V2Z" fill="white"/>
        <path d="M8 4V28H26V9H21V4H8Z" fill="white"/>
        <path d="M10 12H20V14H10V12ZM10 16H20V18H10V16ZM10 20H18V22H10V20Z" fill="#2E3192"/>
        <path d="M22 4L26 8H22V4Z" fill="#C0C0C0"/>
    </svg>
);

export const DownloadIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="4" width="20" height="24" rx="2" fill="#C0C0C0" stroke="#888" strokeWidth="2"/>
    <rect x="10" y="8" width="12" height="8" rx="1" fill="#fff" stroke="#888" strokeWidth="1"/>
    <path d="M16 12v8m0 0l-4-4m4 4l4-4" stroke="#2E3192" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="10" y="22" width="12" height="2" rx="1" fill="#2E3192"/>
  </svg>
);
