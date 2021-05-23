import React, { Component } from 'react'
import { Card , Button, Table, Modal, message} from 'antd'
import { connect } from 'react-redux'
import { loadRoles, addRole, updateRole } from '../../request/index'
import { formateTime } from '../../utils/dateUtils'
import AddModel from './addModel'
import AuthModel from './authModel'

class Role extends Component {
    state = {
      roles: [],  
      role: {},  
      isDisplayAdd: false,  
      isDisplayAuth: false, 
    }
    constructor(props){
      super(props)
      this.authSection = React.createRef()
    }

    createColumn = () => {
      this.columns = [
        {
          title: 'Account name',
          dataIndex: 'name',
        },
        {
          title: 'Create Time',
          dataIndex: 'create_time',
          render: (create_time) => formateTime(create_time)
        },
        {
          title: 'Autorize Time',
          dataIndex: 'auth_time',
          render: formateTime
        },
        {
          title: 'Autorized from',
          dataIndex: 'auth_name'
        }
      ] 
    }

    // load account list
    loadRoles = async () => {
      const result = await loadRoles()
      if (result.status === 0) {
        const roles = result.data
        this.setState({roles})
      }
    }

    handleRow = (role) => {
      return {
        onClick: event => {
          this.setState({role})
        }
      }
    }

    addRole = () => {
      this.form.validateFields()
      .then(async (values)=>{
        this.setState({isDisplayAdd:false})
        const {roleName} = values
        this.form.resetFields()
        const response = await addRole(roleName)
        if (response.status === 0) {
          const role = response.data      // New account
          this.setState(state => ({       // Update account role
            roles: [...state.roles, role]
          }))
        } else {
          message.error('Create account fail')
        }
      }
    ).catch(err => {
        alert('Error',err)
      });
    }

    handleCancel = () => {
      this.form.resetFields()
      this.setState({isDisplayAdd:false})
    }

    updateRole = async () => {
      this.setState({ isDisplayAuth: false })
      const role = this.state.role
      const menus = this.authSection.current.getMenus()
      role.menus = menus
      role.auth_time = Date.now()
      role.auth_name = this.props.user.username

      // Request for update 
      const response = await updateRole(role)
      if (response.status === 0) {
        message.success('Role update success')
        this.setState({
          roles: [...this.state.roles]
        }) 
      }
    }

    handleCancelChange = () => {
      this.setState({isDisplayAuth:false})
    }
    componentDidMount(){
      this.loadRoles()
    }
    componentWillMount(){
      this.createColumn()
    }

    render() {
        const {role, roles, isDisplayAdd, isDisplayAuth} = this.state

        const title = (
          <span>
            <Button style={{marginRight: "20px"}} onClick={()=>{this.setState({isDisplayAdd: true})}} type='primary'>Create account</Button> 
            <Button type='primary' disabled={!role._id}
             onClick={()=>{this.setState({isDisplayAuth: true})}} >Update accessibility</Button>
          </span>
        )
        return (
          <Card title={title}>
            <Table 
              bordered  
              rowKey='_id'
              dataSource={roles}
              columns={this.columns}
              pagination={{defaultPageSize: 5}}
              rowSelection={{
                type:'radio', 
                selectedRowKeys:[role._id],
                onSelect: (role)=>{this.setState({role})}
              }}
              onRow={this.handleRow} 
            />
            <Modal 
              title='Create account'
              visible={isDisplayAdd}
              onOk={this.addRole}
              onCancel={this.handleCancel}
            >
              <AddModel setForm={form =>this.form = form} />
            </Modal>
            <Modal 
              title='Set account accessibility'
              visible={isDisplayAuth}
              onOk={this.updateRole}
              onCancel={this.handleCancelChange}
            >
              <AuthModel ref={this.authSection} role={role}/>
            </Modal>
          </Card>
        )
    }
}

export default connect(
  state => ({user:state.user})
)(Role)