import React from "react";
import AssembleButton from "./assemble-button.component";
import IconButton from "./icon-button.component";
import newDocIcon from "../images/newDocument.png";
import pdfIcon from "../images/pdf.png";
import assemblyListIcon from "../images/assemblyList.png";
import editIcon from "../images/edit.png";
import commentIcon from "../images/comments.png";
import deleteIcon from "../images/delete.png";


class ButtonsPanel extends React.Component {
    render() {
        return(
            <div className="row g-3 mb-4 mt-2" hidden={this.props.hidden}>
                <div className="col-auto" hidden={!this.props.assembleButtonClick}>
                    <AssembleButton disabled={!this.props.editable}
                                    assembled={!this.props.reassemblyRequired}
                                    onClickHandler={this.props.assembleButtonClick}/>
                </div>
                <div className="col-auto" hidden={!this.props.newDocButtonClick}>
                    <IconButton disabled={!this.props.editable}
                                icon={newDocIcon}
                                titleId={"new-doc-button_title"}
                                onClickHandler={this.props.newDocButtonClick}/>
                </div>
                <div className="col-auto" hidden={!this.props.downloadButtonClick}>
                    <IconButton disabled={false}
                                icon={pdfIcon}
                                titleId={"download-button_title"}
                                onClickHandler={this.props.downloadButtonClick}/>
                </div>
                <div className="col-auto" hidden={!this.props.historyButtonClick}>
                    <IconButton disabled={false}
                                icon={assemblyListIcon}
                                titleId={"history-button_title"}
                                onClickHandler={this.props.historyButtonClick}/>
                </div>
                <div className="col-auto" hidden={!this.props.editButtonClick}>
                    <IconButton disabled={!this.props.editable}
                                icon={editIcon}
                                titleId={"edit-button_title"}
                                onClickHandler={this.props.editButtonClick}/>
                </div>
                <div className="col-auto" hidden={!this.props.commentButtonClick}>
                    <IconButton disabled={false}
                                icon={commentIcon}
                                titleId={"comment-button_title"}
                                onClickHandler={this.props.commentButtonClick}/>
                </div>
                <div className="col-auto" hidden={!this.props.deleteButtonClick}>
                    <IconButton disabled={!this.props.editable}
                                icon={deleteIcon}
                                titleId={"delete-button_title"}
                                onClickHandler={this.props.deleteButtonClick}/>
                </div>

            </div>
        )
    }
}

export default ButtonsPanel;