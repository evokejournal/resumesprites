"use client";

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '4rem' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem' }}>404 - Page Not Found</h1>
      <p style={{ fontSize: '1.2rem', color: '#888' }}>
        The page you are looking for does not exist.<br />
        Please check the URL or return to the homepage.
      </p>
      <a href="/" style={{
        display: 'inline-block',
        marginTop: '2rem',
        padding: '0.75rem 2rem',
        background: 'linear-gradient(90deg, #E6B17C 0%, #F9CBA7 100%)',
        color: '#222',
        borderRadius: '999px',
        fontWeight: 700,
        textDecoration: 'none',
        fontSize: '1.1rem',
        boxShadow: '0 2px 8px #e6b17c33',
      }}>
        Go Home
      </a>
    </div>
  );
} 