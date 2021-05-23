import React,{ Component } from 'react'
import {Form, Input, Tree } from 'antd'
import menuList from '../../config/menuConfig'
import PropTypes from 'prop-types'

// Change account accessibility 
export default class AuthModel extends Component {
  static propTypes = {
    role: PropTypes.object
  }
  constructor(props) {
    super(props)
    const {menus} = this.props.role

    this.state = {
      treeData: [{
        title: 'Platform Accessibility',
        key: 'all',
        children: []
    }],
      checkedKeys: menus,
    }
  }

  // Use new prop role to update checkedKeys
  componentWillReceiveProps(nextProps){
    const menus = nextProps.role.menus
    this.setState({
      checkedKeys: menus
    })
  }
  
  getTreeNodes = (menuList) => {
    return menuList.reduce((pre, item)=>{
      pre.push(
        {
          title: item.title,
          key: item.key,
          children: item.children ? this.getTreeNodes(item.children):null
        }
      )
      return pre
    },[])
  }
  getMenus = () => this.state.checkedKeys
  
  onCheck = checkedKeys => {
      this.setState({checkedKeys})
  };

  componentWillMount(){
    let treeDatas = this.state.treeData
    treeDatas[0].children = this.getTreeNodes(menuList)
    this.setState({
      treeData: treeDatas
    })
  } 
  
  render() {
    const {checkedKeys, treeData} = this.state
    const {role} = this.props
    return (
        <div>
          <Form.Item  label='Account name'>
            <Input value={role.name} disabled/>
          </Form.Item >
          <Tree
            treeData={treeData} 
            defaultExpandAll={true}
            checkable
            checkedKeys={{checked:checkedKeys}}
            onCheck={this.onCheck}         
            />
        </div>
    )
  }
}