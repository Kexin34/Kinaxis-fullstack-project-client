import React, {  useState, useEffect   } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Menu } from 'antd';
import { connect } from 'react-redux'
import { setTitle } from '../../redux/actions'
import logo from '../../assets/imgs/logo.png'
import menuList from '../../config/menuConfig'
import './index.less'

// Left menu navigation bar

const LeftNav = (props) => {
  const [openKey, setOpenKey] = useState([]);   
  const [menuItems, setMenuItems] = useState([]);  // dynamically display menu item
  
  // Check current use's access right to each menu item
  const hasAccessRight = (item) => {
    const {key, isPublic} = item
    const menus = props.user.role.menus
    const username = props.user.username

    // If current user has full access right for an menu section
    if (username === 'admin' || isPublic || menus.indexOf(key) !== -1) {
      return true
    } else if(item.children) {
      // If user has access right to some children section of current menu
      return !!item.children.find(child => menus.indexOf(child.key) !== -1)
    }
    return false
  }
   
  const getMenuNodes = (menuList) => {
    const path = props.location.pathname

    // Display menu items that under user's authority
    return menuList.map(item => {
      if (hasAccessRight(item)) {
        if (!item.children) { 
          // Check if the end menu is the same as path, update head title in redux
          if (item.key === path || path.indexOf(item.key) === 0) {
            props.setTitle(item.title)
          }
          return (
            <Menu.Item key={item.key} icon={item.icon}>
              <Link to={item.key} onClick={()=>props.setTitle(item.title)}>{item.title}</Link>
            </Menu.Item>
          )
        } else {
          // If current is not end menu, find the match end child node with the path
          const currItem = item.children.find(currItem => path.indexOf(currItem.key) === 0 )
          // Expand the child menu
          if (currItem) {
            setOpenKey(item.key)
          }
          return (
            <Menu.SubMenu key={item.key} icon={item.icon} title={item.title}>
               {getMenuNodes(item.children)}
            </Menu.SubMenu>
          )
        }
      }else{
        return (null);
      }
    })
  } 

  useEffect(() => {
    setMenuItems(getMenuNodes(menuList))
  }, []);

  let path = props.location.pathname



  return (
      <div className="left-nav">
        <Link to="/" className="left-nav-header">
          <img src={logo} alt="logo"/>
          <h1>Management Platform</h1>
        </Link>
        <Menu
          selectedKeys={[path]}
          defaultOpenKeys={[openKey]}
          mode="inline"
          theme="dark"
        >
          {menuItems}  
        </Menu>
      </div> 
    )
}

export default connect(
  state => ({user: state.user}),
  {setTitle}
)(withRouter(LeftNav))    // HOC, to access the location
