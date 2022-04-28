import React from 'react';
import {FormattedMessage} from "react-intl";

class IconButton extends React.Component {
    constructor(props) {
        super(props);
        this.buttonClick = this.buttonClick.bind(this);
    }

    buttonClick(event) {
        event.stopPropagation();
        this.props.onClickHandler(this.props.objectId)
    }

    render() {
        let titleId
        if (this.props.titleId) {
            titleId = this.props.titleId
        } else {
            titleId = "undefined"
        }
        let disabled;
        if (this.props.disabled) {
            disabled = "disabled"
        } else {
            disabled = "";
        }
        return (
            <FormattedMessage id={titleId}>
                {(msg) =>
                    <button type="button"
                            className={"btn btn-outline-info " + disabled}
                            title={msg[0]}
                            onClick={this.buttonClick}>
                        <img src={this.props.icon} alt="" width="40" height="40"/>
                    </button>
                }
            </FormattedMessage>
        )

    }
}

export default IconButton;