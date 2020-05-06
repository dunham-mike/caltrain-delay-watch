import React from 'react';

export const ErrorModal = (props) => {
    return(
        <div className={"modal"  + (props.isErrorModalActive ? " is-active" : "" )}>
            <div 
                className="modal-background" 
                onClick={props.closeErrorModal}
                onKeyDown={props.closeErrorModal}
            ></div>
            
            <div className="modal-content" style={{ minWidth: '300px', width: '0' }}>
                <div className="box has-text-primary has-text-centered" style={{ display: 'flex', flexDirection: 'column' }}>
                    {props.errorMessage}
                    <div>
                        <button className="button is-primary" style={{ marginTop: '1rem'}} onClick={props.closeErrorModal}>
                            Close
                        </button>
                    </div>
                </div>
            </div>
            <button className="modal-close is-large" aria-label="close" onClick={props.closeErrorModal}></button>

        </div>
    );
}

export default ErrorModal;