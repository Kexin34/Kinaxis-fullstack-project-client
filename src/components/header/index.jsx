import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { Modal, Button} from 'antd'
import { connect } from 'react-redux'
import { formateTime } from '../../utils/dateUtils'
import { logout } from '../../redux/actions'
import './index.less'

const Header = (props) => {
  const [currentTime, setCurrentTime] = useState(formateTime(Date.now())); 
  const [timer, setTimer] = useState({}); 
  
  // Timer, update per second
  const getTime = () => {
    const timer = setInterval(() => {
      const currentTime = formateTime(Date.now())
      setCurrentTime(currentTime);
    }, 1000);
    setTimer(timer);
  }

  // Logout
  const logout = () => {
    Modal.confirm({
      content: 'Are you sure you want to logout?',
      onOk: () => {
        props.logout()
      }
    })
  }

  useEffect(() => {
    getTime();
  }, [])

  // Remove timer
  useEffect(() => {
    return () => {
      clearInterval(timer)
    }
  }, [timer])

  const username = props.user.username
  const title = props.headTitle 

  return (
      <div className="header">
          <div className="header-top">
            <span>{username}</span>
            <Button type="link" onClick={logout}>Logout</Button>
          </div>
          <div className="header-bottom">
            <div className="header-bottom-left">{title}</div>
            <div className="header-bottom-right">
              <span>{currentTime}</span>
            </div>
          </div>
      </div>
  )
}

export default connect(
  state => ({headTitle: state.headTitle, user: state.user}),
  {logout}
)(withRouter(Header)) 
