import React from 'react';
import 'antd/dist/antd.css';

import {Modal} from 'antd';


export default class ModalInfoMarker extends React.Component {
  state = {open_TC: false};


  render() {
    const {  name, open_TC, handleClose_TC,  } = this.props;
    const nameRestauran = "Restaurante: "+name;
    return (
      <div>
        <Modal
          style={{top: 20}}
          title={nameRestauran}
          visible={open_TC}
          onOk={this.handleOk_TC}
          onCancel={handleClose_TC}
          onClose={handleClose_TC}
          footer={null}
          width={760}
        >
          <p align="justify">Con esta suscripción, obrando por mi propia cuenta y nombre.</p>
         
        </Modal>
      </div>
    );
  }

}