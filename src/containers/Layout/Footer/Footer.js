import React from 'react';

const Footer = () => {
    return (
        <footer className="footer has-background-grey has-text-white" style={{ paddingBottom: '3rem' }}>
            <div className="content has-text-centered">
                <p>
                    <strong className="has-text-white">Caltrain Delay Watch</strong> by <a className="has-text-info" target="_blank" rel="noopener noreferrer" href="https://www.mikedunham.org">Mike Dunham</a>
                </p>
                <p style={{margin: '0.75rem auto'}}>
                    © {new Date().getFullYear()}
                </p>
            </div>
        </footer>
    );
}

export default Footer;