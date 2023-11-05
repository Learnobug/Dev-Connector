import React,{Fragment, useEffect} from 'react'
import PropTypes from 'prop-types';
import Spin from '../layout/Spin'
import { connect } from 'react-redux'
import DashboardAction from './DashboardAction';
import { Link } from 'react-router-dom';
import { deleteAcoount, getCurrentProfile } from '../../actions/profile'
import Experince from './Experince';
import Education from './Education'

const Dashboard = ({getCurrentProfile,auth:{user},profile:{profile,loading},deleteAcoount}) => {
   useEffect(()=>{
    getCurrentProfile();
   },[getCurrentProfile]);

  return loading && profile === null ? <Spin/>:<Fragment>
    <h1 className='large text-primary'>Dashboard</h1>
    <p className='lead'>
       <i className='fas fa-user'></i> Welcome {user && user.name}
    </p>
    {profile !==null ? (<Fragment>
      <DashboardAction/>
      <Experince experience={profile.experience}/>
      <Education education={profile.education}/>
      <div className='my-2'>
        <button className='btn btn-danger' on onClick={()=>deleteAcoount()}>
          <i className='fas fa-user-minus'></i> Delete Account
        </button>
      </div>
      
    </Fragment>) :
    (<Fragment>
      <p>You have not yet setup a Profile ,please add some info</p>
      <Link to="/create-profile" className='btn btn-primary my-1'>
        Create Profile
        </Link>
      </Fragment>)}
  </Fragment>
}

Dashboard.propTypes = {
  getCurrentProfile:PropTypes.func.isRequired,
  auth:PropTypes.object.isRequired,
  profile:PropTypes.object.isRequired,
  deleteAcoount:PropTypes.func.isRequired,

}
const mapStateToProps = state => ({
  auth:state.auth,
  profile: state.profile
})


export default connect(mapStateToProps,{getCurrentProfile,deleteAcoount})(Dashboard)
