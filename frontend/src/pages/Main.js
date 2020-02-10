import React, { useEffect, PureComponent } from 'react';
import { connect, useStore } from 'react-redux';

import { changeCurrentInfo, modalOpend } from '../store/modules/checker';
import { insertMemberData, initMemberData } from '../store/modules/inserted';

import { Modal, FortalModal } from '../components/Modal'
import ChurchForm from '../components/AddForm/ChurchForm';

const spreadChurchList = ({ churches, isAdmin, handleToggleModal, handleChange, addChurch }) => {

  return (
    <>
      {churches.map(({ name, attached }) => {
        return (
          <div className="card card-box">
            <a href={isAdmin ? `admin/${name}` : name}>
              <div className="card-body">
                <h5 className="card-title card-box__title">{name}</h5>
                <h5 className="card-title card-box__subtitle">{attached}</h5>
              </div>
            </a>
          </div>
        )
      })}
      {isAdmin ? (
        <div
          className="card card-box"
          onClick={() => handleToggleModal({
            inner: (
              <Modal>
                <ChurchForm handleChange={handleChange} confirmAction={addChurch} />
              </Modal>)
          })}>
          <div className="card-body">
            <div className="icon-plus blue w25" />
            <div className="card-box__p">페이지 추가</div>
          </div>
        </div>) : null}

    </>
  );
};

const Main = (props) => {
  const { match: { path }, modalOpend, church, attached, churches, changeCurrentInfo } = props
  
  useEffect(() => {
    fetch('http://localhost:7000/api/church/all')
      .then(res => res.json())
      .then(res => changeCurrentInfo('churches', res));
  }, []);
  
  const isAdmin = path.match(/admin/) ? true : false;
  const handleChange = (key, value) => {
    changeCurrentInfo(key, value);
  }
  const handleToggleModal = ({ inner }) => {
    changeCurrentInfo('currentModal', !modalOpend ? inner : null);
    changeCurrentInfo('modalOpend', !modalOpend);
  }

  const addChurch = ({church, attached, churches}) => {
    console.log(church);
    // const { church, attached, churches } = props;
    fetch('http://localhost:7000/api/church', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: church, attached })
    }).then(res => {
      handleToggleModal({});
      return res.json()
    }).then(res => {
      changeCurrentInfo('churches', [...churches, res]);
    })
  }

  return (
    <>
      <h3 className="title"><a href={isAdmin ? '/admin' : '/'}>Yaein 출석부</a>{isAdmin ? <div className="admin-title">admin</div> : null}</h3>
      {church}
      <div className="card-wrapper">
        {spreadChurchList({ churches, isAdmin, handleToggleModal, handleChange, addChurch, church, attached })}
      </div>
    </>
  );
}

// class Main2 extends PureComponent {
//   state = {
//     modalOpend: false
//   };

//   async componentDidMount() {
//     const { changeCurrentInfo } = this.props;
//     const churchList = await fetch('http://localhost:7000/api/church/all').then(res => res.json()).then();
//     changeCurrentInfo('churches', churchList);
//   }

//   addChurch = () => {
//     const { changeCurrentInfo, insertedMember: { church, attached }, churches } = this.props;
//     fetch('http://localhost:7000/api/church', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({ name: church, attached })
//     }).then(res => {
//       this.handleToggleModal();
//       return res.json()
//     }).then(res => {
//       changeCurrentInfo('churches', [...churches, res]);
//     })
//   }
//   handleChange = (key, value) => {
//     this.props.changeCurrentInfo(key, value);
//   }

//   spreadChurchList = ({ churches, isAdmin }) => {
//     return (
//       <>
//         {churches.map(({ name, attached }) => {
//           return (
//             <div className="card card-box">
//               <a href={isAdmin ? `admin/${name}` : name}>
//                 <div className="card-body">
//                   <h5 className="card-title card-box__title">{name}</h5>
//                   <h5 className="card-title card-box__subtitle">{attached}</h5>
//                 </div>
//               </a>
//             </div>
//           )
//         })}
//         {isAdmin ? (<div className="card card-box" onClick={this.handleToggleModal}>
//           <div className="card-body">
//             <div className="icon-plus blue w25" />
//             <div className="card-box__p">페이지 추가</div>
//           </div>
//         </div>) : null}

//       </>
//     );
//   };
//   handleToggleModal = () => {
//     this.setState({ modalOpend: !this.state.modalOpend });
//   }

//   render() {
//     const { match: { path }, churches } = this.props;
//     const isAdmin = path.match(/admin/) ? true : false;
//     return (
//       <>
//         <h3 className="title"><a href={isAdmin ? '/admin' : '/'}>Yaein 출석부</a>{isAdmin ? <div className="admin-title">admin</div> : null}</h3>
//         <div className="card-wrapper">
//           {this.spreadChurchList({ churches, isAdmin })}
//         </div>
//         {this.state.modalOpend ?
//           (<FortalModal>
//             <Modal onToggleModal={this.handleToggleModal}>
//               <ChurchForm handleChange={this.handleChange} confirmAction={() => this.addChurch()} />
//             </Modal>
//           </FortalModal>) : null
//         }
//       </>
//     );
//   };
// };

const mapStateToProps = state => ({
  insertedMember: state.inserted.insertedMember,
  churches: state.checker.churches,
  modalOpend: state.checker.modalOpend,
  church: state.checker.church,
  attached: state.checker.attached
})

const mapDispatchToProps = dispatch => ({
  insertMemberData: (left, value) => dispatch(insertMemberData(left, value)),
  initMemberData: () => initMemberData(),
  changeCurrentInfo: (left, right) => dispatch(changeCurrentInfo(left, right))
})

export default connect(mapStateToProps, mapDispatchToProps)(Main);