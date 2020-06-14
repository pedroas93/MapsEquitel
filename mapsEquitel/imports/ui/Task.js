import React, {Component} from 'react';

class Task extends Component{
    constructor(props){
        super(props);
    }

    render(){
        const {task} = this.props;
        return <li>{task.text}</li>
    }
}

export default Task;