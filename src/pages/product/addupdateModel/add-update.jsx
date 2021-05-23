import React, { Component } from 'react'
import {Card,Form,Input,Cascader,Button, message} from 'antd'
import { queryCategorys, addOrUpdateProduct} from '../../../request/index'
import ImageSection from '../image-section' 

import { ArrowLeftOutlined } from '@ant-design/icons';
const {Item} = Form

export default class ProductAddUpdate extends Component {
  formRef = React.createRef();

  state = {
    options: [],
  }

  constructor(props) {
    super(props)
    this.pw = React.createRef()
  }

  // Update Category Options array, based on categorys list
  initOptions = async (categorys) => {
    const options = categorys.map(item => ({
      value: item._id,
      label: item.name,
      isLeaf: false,  
    }))

    // If this is a sub-category product update
    const {isUpdate, product} = this
    const {pCategoryId} = product
    
    if (isUpdate && pCategoryId !== '0') {
      const subCategorys = await this.getCategorys(pCategoryId)
      // Generate sub-category dropdown options 
      const subOptions = subCategorys.map(item =>({
        value: item._id,
        label: item.name,
        isLeaf: true,
      }))

      // Find the cooresponding main category 
      const currentOption = options.find(option => option.value === pCategoryId)
      // Connect the main and sub category option
      currentOption.children = subOptions
    }

    this.setState({options})
  }

  getCategorys = async (parentId) => {
    const result = await queryCategorys(parentId)
    if (result.status === 0) {
      const categorys = result.data
      // Check if this is main or sub category
      if (parentId === '0') {
        this.initOptions(categorys)
      } else {
        return categorys
      }
    }
  }

  validatePrice = (rule, value, callback) => {
    if (value * 1 > 0) {
      return Promise.resolve()
    } else { 
      return Promise.reject('Price should be greater than 0')
    }
  }

  loadData = async selectedOptions => {
    const selected = selectedOptions[0]
    selected.loading = true

    // Request sub-category list
    const subCategorys = await this.getCategorys(selected.value)
    selected.loading = false

    if (subCategorys && subCategorys.length > 0) {
      // Sub-category exist, generate sub-category options 
      const subOptions = subCategorys.map(item =>({
        value: item._id,
        label: item.name,
        isLeaf: true,  
      }))
      selected.children = subOptions
    } else {
      // Current list does not have sub-category
      selected.isLeaf = true 
    }
    
    this.setState({
      options: [...this.state.options],
    })
  }

  submit = () => {
    // Form validation before sending request
    this.formRef.current.validateFields()
    .then( async values => {

      const {name,desc,price,categoryIds} = values
      let pCategoryId,categoryId
      if (categoryIds.length === 1) {
        pCategoryId = '0'
        categoryId = categoryIds[0]
      } else {
        pCategoryId = categoryIds[0]
        categoryId = categoryIds[1]
      }
      const imageCollection = this.pw.current.getImgs()
      const detail = "";   // TODO: text editor

      const product = {name, desc, price, imgs: imageCollection, detail, pCategoryId, categoryId}

      if (this.isUpdate) {  // required ID if update
        product._id = this.product._id
      }

      const result = await addOrUpdateProduct(product)
      if (result && result.status == 0) {
        message.success('Success')
      } else if (result && result.status != 0){
        message.error(`Fail to ${this.isUpdate ? 'Update' : 'Add'} product`)
      }
      this.props.history.goBack()
    })
    .catch(error => {
      console.log('Request error', error);
    })
  }

  componentDidMount() {
    this.getCategorys('0')  
  }

  componentWillMount(){
    const product = this.props.location.state
    this.isUpdate = !!product  // convert to boolean
    this.product = product || {}
  }
  
  render() {
      const {isUpdate, product} = this
      const {pCategoryId, categoryId, imgs} = product
      const categorys = []
      if (isUpdate) {
        if (pCategoryId === '0') {
          categorys.push(categoryId)
        } else {
          categorys.push(pCategoryId)
          categorys.push(categoryId)
        }
      }

      const title = (
        <span>
          <Button type="link" onClick={()=>this.props.history.goBack()}>
            <ArrowLeftOutlined style={{marginRight:10, fontSize:20}}/>
          </Button>
          <span>{isUpdate?'Update':'Add'}</span>
        </span>
      )

        return (
          <Card title={title}>
            <Form ref={this.formRef} labelCol={{ span: 7}} wrapperCol={{ span: 10}} >
              <Item name='name' 
                rules={[ { required: true, message: 'Name is required' }]} 
                initialValue={product.name} label='Product name'>
                <Input placeholder='Please enter product name'/>
              </Item>
              <Item name='desc' initialValue={product.desc} 
                rules={[ { required: true, message: 'Description is required' }]} 
                label='Prduct Description'>
                <Input.TextArea placeholder='Please enter description' autoSize={{minRows:2,maxRows:5}}/>
              </Item>
              <Item name='price' initialValue={product.price} 
                rules={[ 
                  { required: true, message: 'Price is required' },
                  { validator: this.validatePrice}
                ]} 
                label='Price'>
                <Input type='number' addonAfter='CAD' placeholder='Please enter price'/>
              </Item>
              <Item name='categoryIds' initialValue={categorys} 
                rules={[{required:true,message: 'Please specify category'},]} 
                label='Product Category'>
                <Cascader
                  placeholder='Please specify category'
                  options={this.state.options}  
                  loadData={this.loadData}   
                />
              </Item>
              <Item label='product-images'>
                <ImageSection ref={this.pw} imgs={imgs}/>
              </Item>
              <Item>
                <Button onClick={this.submit} type='primary'>Submit</Button>
              </Item>
            </Form>
          </Card>
        )
  }
}
