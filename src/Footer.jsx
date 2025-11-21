import React from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

const Footer = ({ data }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <style>{`
        .footer-container {
          background-color: #C6F6D5;
          color: black;
          padding: 24px;
          margin: 30px auto;
        }

        .footer-content {
          max-width: 1152px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
        }

        @media (max-width: 768px) {
          .footer-content {
            flex-direction: column;
          }
        }

        .footer-branding {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .footer-logo {
          width: 40px;
          height: 40px;
        }

        .footer-app-name {
          font-size: 1.2rem;
          font-weight: 600;
        }

        .footer-contact {
          display: flex;
          flex-direction: column;
          gap: 4px;
          align-items: center;
        }

        .footer-email {
          color: #2563EB;
          text-decoration: none;
        }

        .footer-email:hover {
          color: #60A5FA;
        }

        .footer-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .footer-icon-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 8px;
          background: transparent;
          border: none;
          cursor: pointer;
          text-decoration: none;
        }

        .footer-icon-button-blue {
          color: #2563EB;
        }

        .footer-icon-button-blue:hover {
          color: #60A5FA;
        }

        .footer-icon-button-red {
          color: #EF4444;
        }

        .footer-icon-button-red:hover {
          color: #F87171;
        }

        .scroll-to-top-icon {
          border: ${Math.max(2, data.meta.iconSize * 0.05)}px solid currentColor;
          border-radius: 50%;
          padding: ${data.meta.iconSize * 0.15}px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: ${data.meta.iconSize}px;
          height: ${data.meta.iconSize}px;
        }

        .scroll-to-top-icon svg {
          width: 100%;
          height: 100%;
        }
      `}</style>

      <div className="footer-container">
        <div className="footer-content">
          {/* Left Section */}
          <div className="footer-branding">
            <img
              className="footer-logo"
              src={data.meta.icon}
              alt={data.meta.appName}
            />
            <span className="footer-app-name">
              {data.meta.appName}
            </span>
          </div>

          {/* Middle Section */}
          <div className="footer-contact">
            <span className="footer-author">🧑‍💻 {data.personal.author}</span>
            <a
              className="footer-email"
              href={`mailto:${data.personal.email}`}
            >
              📧 {data.personal.email}
            </a>
          </div>

          {/* Right Section */}
          <div className="footer-actions">
            {data.personal.github && (
              <a
                className="footer-icon-button footer-icon-button-blue"
                href={data.personal.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <FaGithub size={36} />
              </a>
            )}
            {data.personal.linked && (
              <a
                className="footer-icon-button footer-icon-button-blue"
                href={data.personal.linked}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <FaLinkedin size={36} />
              </a>
            )}
            <button
              onClick={scrollToTop}
              aria-label="Scroll to top"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: `${data.meta.iconSize}px`,
                height: `${data.meta.iconSize}px`,
                padding: `${data.meta.iconSize * 0.15}px`,
                border: `${Math.max(2, data.meta.iconSize * 0.05)}px solid #EF4444`,
                borderRadius: '50%',
                background: 'transparent',
                color: '#EF4444',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = '#F87171';
                e.currentTarget.style.borderColor = '#F87171';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = '#EF4444';
                e.currentTarget.style.borderColor = '#EF4444';
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  width: '100%',
                  height: '100%',
                }}
              >
                <polyline points="18 15 12 9 6 15" />
              </svg>
            </button>

          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;