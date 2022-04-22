import assembledIcon from '../images/assembled.png';
import needToAssemble from '../images/needToAssemble.png';
import React from 'react';
import IconButton from "./icon-button.component";

class AssembleButton extends React.Component {

    render() {
        let image;
        let localDisabled = false;
        if (this.props.assembled) {
            image = assembledIcon;
        } else {
            image = needToAssemble;
        }
        if (this.props.disabled || this.props.assembled) {
            localDisabled = true
        }
        return (
            <IconButton objectId={this.props.objectId}
                        disabled={localDisabled}
                        icon={image}
                        onClickHandler={this.props.onClickHandler}
            >
            </IconButton>
        )
    }
}

export default AssembleButton;