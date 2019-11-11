import React, { Component } from 'react';
import { CellTable } from '../../components/CellTable';
import Tab from '../../components/Tab/Tab';
import './Admin.scss'


class AdminPage extends Component {

  render() {
    return (
      <div>
        <div className="edit-box">
          <div className="button-box"><button className="edit-box__button--print">어드민</button></div>
        </div>
        <Tab isAdmin={true} />
        <div className="printArea"><CellTable current={this.props.match.params.name} isAdmin={true} /></div>
      </div>
    )
  }
}


export default AdminPage;