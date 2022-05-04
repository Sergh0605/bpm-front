import React from "react";

export const required = (value, props) => {
    if (!value || value < 1) {
        return (
            <div className="alert alert-danger" role="alert">
                <div className="align-items-center">
                    {props.validerrormessage}
                </div>
            </div>
        );
    }
};

export const extensionMismatch = (value, props) => {
    if (value) {
        let extension = "." + value.split('.').pop();
        if (!props.fileExtensions.includes(extension)) {
            return (
                <div className="alert alert-danger" role="alert">
                    <div className="align-items-center">
                        {props.validerrormessage}
                    </div>
                </div>
            );
        }
    }
}

export const passwordLength = (value, props) => {
    if (!props.disabled && (!value || value.length) < 8) {
        return (
            <div className="alert alert-danger" role="alert">
                <div className="align-items-center">
                    {props.validerrormessage}
                </div>
            </div>
        );
    }
};
