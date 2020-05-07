import React from 'react';
import PropTypes from 'prop-types';

export const Modal = (props) => {
    return(
        <div className={"modal"  + (props.modalMessage !== null ? " is-active" : "" )}>
            <div 
                className="modal-background" 
                onClick={props.closeModal}
                onKeyDown={props.closeModal}
            ></div>
            <div className="modal-content" style={{ minWidth: '300px', width: '0' }}>
                <div className={`box has-text-centered${props.isErrorModal ? ' has-text-primary' : ''}`} 
                    style={{ display: 'flex', flexDirection: 'column', whiteSpace: 'pre-line' }}
                >
                    {props.modalMessage}
                    <div>
                        <button className={`button ${props.isErrorModal ? 'is-primary' : 'is-info'}`} style={{ marginTop: '1rem'}} onClick={props.closeModal}>
                            Close
                        </button>
                    </div>
                </div>
            </div>
            <button className="modal-close is-large" aria-label="close" onClick={props.closeModal}></button>
        </div>
    );
}

Modal.propTypes = {
    modalMessage: PropTypes.string,
    closeModal: PropTypes.func.isRequired,
    isErrorModal: PropTypes.bool.isRequired
}

export default Modal;