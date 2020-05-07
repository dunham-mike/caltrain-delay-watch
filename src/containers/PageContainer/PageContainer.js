import React from 'react';

const PageContainer = (props) => {
    return(
        <div style={{ maxWidth: '850px', width: '100%', margin: '0 auto', padding: '1.5rem 1.5rem' }}>
            {props.children}
        </div>
    );
}

export default PageContainer;