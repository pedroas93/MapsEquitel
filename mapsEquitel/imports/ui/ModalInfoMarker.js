import React from 'react';
import 'antd/dist/antd.css';
import { Meteor } from 'meteor/meteor';
import { Modal } from 'antd';
import ReactDOM from 'react-dom'
import { Qualifications } from '../api/qualifications';
import { withTracker } from 'meteor/react-meteor-data';



class ModalInfoMarker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open_TC: false
    }
  }

  componentDidMount
    () {
    this.updateOwnQualification = this._updateOwnQualification.bind(this);
    this.updateAnotherQualification = this._updateAnotherQualification.bind(this);
  }

  _updateOwnQualification(event) {
    event.preventDefault();

    const { id } = this.props;
    console.log('ENTER HERE IN THE PROPS????--->', id);
    const restaurantCommentInput = ReactDOM.findDOMNode(this.refs.comment);
    const restaurantComment = restaurantCommentInput.value.trim();
    const restaurantScoreInput = ReactDOM.findDOMNode(this.refs.score);
    const restauranScore = restaurantScoreInput.value.trim();

    Meteor.call('tasks.updateOwnCommentScore', id, restaurantComment, restauranScore);
  }

  _updateAnotherQualification(event) {
    event.preventDefault();

    const { id } = this.props;
    console.log('ENTER HERE IN THE PROPS????--->', id);
    const restaurantCommentInput = ReactDOM.findDOMNode(this.refs.newComment);
    const restaurantComment = restaurantCommentInput.value.trim();
    const restaurantScoreInput = ReactDOM.findDOMNode(this.refs.newScore);
    const restauranScore = restaurantScoreInput.value.trim();

    Meteor.call('qualification.updateAnotherQualification', id, restaurantComment, restauranScore);
  }


  render() {
    const { name, comment, score, id, open_TC, handleClose_TC, qualifications } = this.props;
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

          <form className="new-task" onSubmit={this.updateOwnQualification}>
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

          <form className="new-task" onSubmit={this.updateAnotherQualification}>
            <div>
              <p align="justify"> <strong>Add a new comment</strong>:</p>
              <input type="text"
                ref="newComment" />
            </div>
            <div>
              <p align="justify"> <strong>Add a new Score</strong></p>
              <input type="text"
                ref="newScore" />
            </div>
            <div className="col col-lg-3">
              <button className="btn btn-primary btn-sm" id="updateForm" type="submit">Add</button>
            </div>
          </form>

          <br />

          <div>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col" className="text-center">User name |</th>
                  <th scope="col" className="text-center">Comment </th>
                  <th scope="col" className="text-center">|Score </th>
                </tr>
              </thead>
              <tbody>
                {qualifications.map(qualification => {
                  if(qualification.taskId === id ){
                    return (
                      <tr key={qualification._id}>
                        <td className="text-center">{qualification.username}</td>
                        <td className="text-center">{qualification.setRestaurantComment}</td>
                        <td className="text-center">{qualification.setRestauranScore}</td>
                      </tr>
                    )
                  }
                })}
              </tbody>
            </table>
          </div>
        </Modal>
      </section>
    );
  }

}

export default withTracker(() => {
  Meteor.subscribe('qualifications');

  return {
    qualifications: Qualifications.find({}, { sort: { createAt: -1 } }).fetch(),
    incompleteCount: Qualifications.find({ checked: { $ne: true } }).count(),
    currentUser: Meteor.user(),
  };
})(ModalInfoMarker);