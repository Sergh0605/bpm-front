import React from 'react';
import {Link} from "react-router-dom";
import {FormattedMessage} from "react-intl";
class LinkButton extends React.Component {

    render() {
        let disabled;
        if (this.props.disabled) {
            disabled = "disabled"
        } else {
            disabled = "";
        }

        return (
            <FormattedMessage id={this.props.titleId}>
                {(msg) =>
                    <Link
                        title={msg[0]}
                        className={"btn btn-outline-info " + disabled}
                        to={this.props.to}>
                        <img src={this.props.icon} alt="" width="40" height="40"/>
                    </Link>
                }
            </FormattedMessage>
        )
    }
}

export default LinkButton;