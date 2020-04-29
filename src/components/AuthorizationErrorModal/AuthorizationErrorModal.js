import React from 'react';

export const AuthorizationErrorModal = (props) => {
    return(
        <div className={"modal"  + (props.isAuthorizationErrorModalActive ? " is-active" : "" )}>
            <div 
                className="modal-background" 
                onClick={props.closeAuthorizationErrorModal}
                onKeyDown={props.closeAuthorizationErrorModal}
            ></div>
            
            <div className="modal-content" style={{ minWidth: '300px', width: '0' }}>
                <div className="box has-text-primary has-text-centered">
                    {props.errorMessage}
                    <button className="button is-primary" style={{ marginTop: '1rem'}} onClick={props.closeAuthorizationErrorModal}>
                        Close
                    </button>
                </div>
            </div>
            <button className="modal-close is-large" aria-label="close" onClick={props.closeAuthorizationErrorModal}></button>

        </div>
    );
}

export default AuthorizationErrorModal;