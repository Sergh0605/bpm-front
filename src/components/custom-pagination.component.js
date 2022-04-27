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
            if (this.props.pageCount > 20) {
                if (number < 11) {
                    items.push(
                        <PageItem key={number} active={number === active} onClick={() => {
                            this.props.onSetPage(number - 1)
                        }}>
                            {number}
                        </PageItem>
                    )
                }
                if (number === 11) {
                    items.push(<Pagination.Ellipsis/>)
                }
                if (number > this.props.pageCount - 10) {
                    items.push(
                        <PageItem key={number} active={number === active} onClick={() => {
                            this.props.onSetPage(number - 1)
                        }}>
                            {number}
                        </PageItem>
                    )
                }
            } else {
                items.push(
                    <PageItem key={number} active={number === active} onClick={() => {
                        this.props.onSetPage(number - 1)
                    }}>
                        {number}
                    </PageItem>
                )
            }
        }
        return (
            <Pagination>
                <Pagination.First onClick={() => {
                    this.props.onSetPage(0)
                }}/>
                <Pagination.Prev onClick={() => {
                    if (active >= 2) {
                        this.props.onSetPage(active - 2)
                    }
                }}/>
                {items}
                <Pagination.Next onClick={() => {
                    if (active < this.props.pageCount)
                        this.props.onSetPage(active)
                }}/>
                <Pagination.Last onClick={() => {
                    this.props.onSetPage(this.props.pageCount - 1)
                }}/>
            </Pagination>

        )
    }
}

export default CustomPaginator;