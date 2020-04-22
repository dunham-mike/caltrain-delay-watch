import React from 'react';

export const AuthorizationErrorModal = (props) => {
    return(
        <div class={"modal"  + (props.isAuthorizationErrorModalActive ? " is-active" : "" )}>
            <div 
                class="modal-background" 
                onClick={props.closeAuthorizationErrorModal}
                onKeyDown={props.closeAuthorizationErrorModal}
            ></div>
            
            <div class="modal-content" style={{ minWidth: '300px', width: '0' }}>
                <div class="box has-text-primary has-text-centered">
                    {props.errorMessage}
                </div>
            </div>
            <button class="modal-close is-large" aria-label="close" onClick={props.closeAuthorizationErrorModal}></button>

        </div>
    );
}

export default AuthorizationErrorModal;