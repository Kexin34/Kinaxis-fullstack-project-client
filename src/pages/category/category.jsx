import React, { Component } from 'react'
import { Card, Table, Button, message, Modal, Form,Input, Select} from 'antd'
import {PlusOutlined, ArrowRightOutlined} from  '@ant-design/icons'
import {queryCategorys, addCategory, updateCategory} from '../../request/index'

// 商品分类路由
export default class Category extends Component {

    state = {
      loading: false, 
      categorys: [],    // main category list
      subCategorys: [], // sub category list
      parentId: '0',    
      parentName: '', 
      showStatus: 0,    // display add/update module, 0: hidden, 1: add, 2: update 
      updatedCategoryName: "",
      addedCategoryName: "",
      selectedParentId: '0',
    }

    componentWillMount() {
      this.createColumns()
    }

    componentDidMount() {
      this.loadCategorys()   // load main category list
    }

    createColumns = () => {
      this.columns = [
        {
          title: 'Category',
          dataIndex: 'name',
        },
        {
          title: 'Operation',
          width: 300,
          render: (category) => (  
            <span>
              <Button type="link" onClick={() => {this.showUpdateModel(category)}}>Update</Button>
              {this.state.parentId === '0' ? 
                <Button type="link" onClick={()=>{this.displaySubCategory(category)}}>Sub Category</Button> : 
                null
              }
            </span>
          )
        },
      ]; 
    }

    // Load main/sub category list
    loadCategorys = async (parentId) => {
      this.setState({
        loading: true
      })   
      parentId = parentId || this.state.parentId
      const response = await queryCategorys(parentId)

      this.setState({loading: false})

      if (response.status === 0) {    // success, update corresponding category list
        if (parentId === '0') {       
          this.setState({categorys: response.data})
        } else {                      
          this.setState({subCategorys: response.data})
        }
      } else {
        message.error('Request Fail')
      }
    }

    // Given main category, load its sub cateroty list
    displaySubCategory = (category) => {
      this.setState({
        parentId: category._id,
        parentName: category.name,
        selectedParentId: category._id,
      },() => {           
          this.loadCategorys()  
      })
    }

    // Display main category
    displayCategorys = () => {
      this.setState({ 
        parentId: '0',
        parentName: '',
        subCategorys: []
      })
    }

    handleCancel = () => {   
      this.setState({     
        showStatus: 0,
        updatedCategoryName: "",
        addedCategoryName:"",
        selectedParentId:'0',
      })
    }

    parendIdChange = (option) => {
      this.setState({
        selectedParentId: option
      },() => {          
        console.log(this.state.selectedParentId);
      })
    };

    showAddModel = () => {
      this.setState({
        showStatus: 1
      })
    }

    // Add new category, once added, reload category list
    addNewCategory = async() => {
      const parentId = this.state.selectedParentId
      const categoryName = this.state.addedCategoryName

      this.setState({             
        showStatus: 0,
        updatedCategoryName: ""
      })

      const result = await addCategory(categoryName, parentId)
      if (parentId === this.state.parentId) {
        this.loadCategorys()
      } else if (parentId === '0') {
        this.loadCategorys('0')
      }
      
    }

    // Display category update model
    showUpdateModel = (category) => {
      this.category = category 
      this.setState({
        showStatus: 2,
      })
    }
    
    // Update category requst
    updateCategory = async() => {
      const categoryId = this.category._id
      const categoryName = this.state.updatedCategoryName
      this.setState({     
        showStatus: 0,
        updatedCategoryName: ""
      })

      const result = await updateCategory({categoryId,categoryName})
      if (result.status  === 0) {
        this.loadCategorys()
      } 
    }

    render() {
        const {loading, categorys, subCategorys, parentId, parentName, showStatus} = this.state              
        const category = this.category || {} 

        // Left panel
        const title = parentId === '0' ? 'Main Category' : (
          <span>
            <Button type="link" onClick={this.displayCategorys}>Main Category</Button>
            <ArrowRightOutlined style={{margin: 10}}/>
            <span>{parentName}</span>
          </span>
        )

        // Right panel
        const addButton = (
          <Button onClick={this.showAddModel} type='primary'>
            <PlusOutlined />
            Add
          </Button>
      )

        return (
            <Card title={title} extra={addButton}>
              <Table loading={loading} 
                pagination={{defaultPageSize: 8, showQuickJumper: true}} 
                bordered rowKey='_id' 
                dataSource={parentId === '0' ? categorys : subCategorys} 
                columns={this.columns} />
              <Modal
                visible={showStatus === 1}
                title="Add category"
                onOk={this.addNewCategory}
                onCancel={this.handleCancel}      
              >
                <Form form={this.form}>
                  <Form.Item name='parentId' initialValue={parentId}>
                    <Select
                      onChange={(value) => this.parendIdChange(value)}
                    >
                      <Select.Option value='0'>Main Catergory</Select.Option>
                      {
                        categorys.map((item) => {
                          return(
                            <Select.Option key={item._id} value={item._id}>{item.name}</Select.Option>
                          )
                        })
                      }
                    </Select>
                  </Form.Item>
                  
                  <Form.Item 
                    name='categoryName' 
                    initialValue=''
                    rules={[{ required: true, message: 'Name required' },]}
                  >
                    <Input placeholder='Pleace enter Category name'
                      onChange={e => this.setState({addedCategoryName: e.target.value})}
                      value={this.addedCategoryName}
                    />
                  </Form.Item>
                </Form>
              </Modal> 
              <Modal
                visible={showStatus === 2}
                title="Update Category"
                onOk={this.updateCategory}
                onCancel={this.handleCancel}
              >
                <Form form={this.form}>
                  <Form.Item name='categoryName' 
                    initialValue={category.name}
                    rules={[{ required: true, message: 'Name is required' }]}>
                    <Input 
                      placeholder='Please enter category name'
                      onChange={e => this.setState({updatedCategoryName: e.target.value})}
                      value={this.updatedCategoryName}
                    />
                  </Form.Item>
                </Form>
              </Modal>
            </Card>
        )
    }
}
