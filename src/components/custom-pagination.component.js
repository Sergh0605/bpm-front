import React from 'react';
import {PageItem, Pagination} from "react-bootstrap";

class CustomPaginator extends React.Component {
    constructor(props) {
        super(props);
        this.onClickHandler = this.onClickHandler.bind(this);
    }

    onClickHandler(number) {
        this.props.onSetPage(number - 1)
    }

    render() {
        let active = this.props.active + 1;
        let items = [];
        for (let number = 1; number <= this.props.pageCount; number++) {
            items.push(
                <PageItem key={number} active={number === active} onClick={() => {
                    this.props.onSetPage(number-1)
                }}>
                    {number}
                </PageItem>,
            );
        }
        return (
            <Pagination>{items}</Pagination>

        )
    }
}

export default CustomPaginator;