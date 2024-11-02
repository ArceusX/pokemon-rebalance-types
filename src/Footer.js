import React from 'react';

const Footer = ({ appName, author, link }) => {
    return (
      <footer>
        <div>
          {appName && <p>{appName}</p>}
          {author && <p>Created By {author}</p>}
          {link && (
            <p><a 
              href={link} 
              target="_blank" 
              rel="noopener noreferrer">
              Github Repo
            </a></p>
          )}
        </div>
      </footer>
    );
  };

export default Footer;