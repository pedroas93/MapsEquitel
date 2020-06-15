import React from 'react';
import 'antd/dist/antd.css';
import { Meteor } from 'meteor/meteor';
import { Modal } from 'antd';
import ReactDOM from 'react-dom'


export default class ModalInfoMarker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open_TC: false
    }

    this.updateThisTask = this._updateThisTask.bind(this);
  }

  _updateThisTask(event) {
    event.preventDefault();

    const { id } = this.props;
    console.log('ENTER HERE IN THE PROPS????--->', id);
    const restaurantCommentInput = ReactDOM.findDOMNode(this.refs.comment);
    const restaurantComment = restaurantCommentInput.value.trim();
    const restaurantScoreInput = ReactDOM.findDOMNode(this.refs.score);
    const restauranScore = restaurantScoreInput.value.trim();

    Meteor.call('tasks.updateOwnCommentScore', id, restaurantComment, restauranScore);
  }


  render() {
    const { name, comment, score, id, open_TC, handleClose_TC } = this.props;
    const nameRestauran = "Restaurante: " + name;
    return (
      <section>
        <Modal
          style={{ top: 20 }}
          title={nameRestauran}
          visible={open_TC}
          onOk={this.handleOk_TC}
          onCancel={handleClose_TC}
          onClose={handleClose_TC}
          footer={null}
          width={760}
        >
          {/* <p align="justify"> <strong>Your RESTAURANT ID</strong>:{id}</p> */}

          <form className="new-task" onSubmit={this.updateThisTask}>
            <div>
              <p align="justify"> <strong>The original comment</strong>:</p>

              <input type="text"
                ref="comment"
                placeholder={comment} />
            </div>
            <div>
              <p align="justify"> <strong>The original Score</strong></p>
              <input type="text"
                ref="score"
                placeholder={score} />
            </div>
            <div className="col col-lg-3">
              <button className="btn btn-primary btn-sm" id="updateForm" type="submit">Update</button>
            </div>
          </form>

        </Modal>
      </section>
    );
  }

}