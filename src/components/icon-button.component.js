import React from 'react';

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
        let disabled;
        if (this.props.disabled) {
            disabled = "disabled"
        } else {
            disabled = "";
        }
        return (
            <button type="button"
                    className={"btn btn-outline-info " + disabled}
                    onClick={this.buttonClick}>
                <img src={this.props.icon} alt="" width="40" height="40"/>
            </button>
        )

    }
}

export default IconButton;