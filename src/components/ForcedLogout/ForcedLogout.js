import React from 'react';
import { withRouter } from 'react-router-dom';

export const ForcedLogout = (props) => {
    const closeModal = () => {
        props.history.push("/logout");
    }

    return(
        <div className="modal is-active">
            <div 
                className="modal-background" 
                onClick={closeModal}
                onKeyDown={closeModal}
            ></div>
            <div className="modal-content" style={{ minWidth: '350px', width: '0' }}>
                <div className="box has-text-primary has-text-centered" style={{ display: 'flex', flexDirection: 'column' }}>
                    Caltrain Delay Watch is having trouble communicating with the server.<br/><br/>
                    Please check your internet connection and log back in.
                    <div>
                        <button className="button is-primary" style={{ marginTop: '1rem'}} onClick={closeModal}>
                            OK
                        </button>
                    </div>
                </div>
            </div>
            <button className="modal-close is-large" aria-label="close" onClick={closeModal}></button>
        </div>
    );
}

export default withRouter(ForcedLogout);