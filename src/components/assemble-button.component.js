import assembledIcon from '../images/assembled.png';
import needToAssemble from '../images/needToAssemble.png';
import React from 'react';
import IconButton from "./icon-button.component";

class AssembleButton extends React.Component {

    render() {
        let image;
        let titleId;
        let localDisabled = false;
        if (this.props.disabled || this.props.assembled) {
            localDisabled = true
        }
        if (this.props.assembled) {
            image = assembledIcon;
            titleId = "assembly-button_title-assembled"
        } else {
            image = needToAssemble;
            titleId = "assembly-button_title-assembly-required"
        }
        return (
            <IconButton objectId={this.props.objectId}
                        disabled={localDisabled}
                        icon={image}
                        titleId={titleId}
                        onClickHandler={this.props.onClickHandler}/>
        )
    }
}

export default AssembleButton;