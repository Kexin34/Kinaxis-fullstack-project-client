import React, { Component } from 'react'
import {List, Button, Card } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons';
import { BASE_IMG_URL } from '../../utils/constants'
import  {queryCategory} from '../../request/index'
import './product-detail.less'

export default class ProductDetail extends Component {
  state = {
    mainCat: '',  // Main Category
    subCat: '',   // Sub Category
  }

  // Load targeted product's category attribute 
  async componentDidMount() {
    const {pCategoryId, categoryId} = this.props.location.state.product
    if (pCategoryId === '0') {   
      const result = await queryCategory(categoryId)
      const mainCat = result.data.name  
      this.setState({mainCat})
    } else {
      const results = await Promise.all([queryCategory(pCategoryId),queryCategory(categoryId)])
      const mainCat = results[0].data.name
      const subCat = results[1].data.name 
     
      this.setState({mainCat, subCat})
    }
  }

  render() {
    const {name, desc, price, imgs} = this.props.location.state.product
    const {mainCat, subCat} = this.state

    const title = (
      <span>
          <Button type="link">
            <ArrowLeftOutlined 
            style={{marginRight:10,fontSize:20}}
            onClick={()=>this.props.history.goBack()}/>
          </Button>
        <span>Product Detail</span>
      </span>
    )
  return (
    <Card title={title} className='product-detail'>
      <List>
          <List.Item>
            <p className='left'>Product Name:</p>
            <p className='left-desc'>{name}</p>
          </List.Item>
          <List.Item>
            <p className='left'>Description:</p>
            <p className='left-desc'>{desc}</p>
          </List.Item>
          <List.Item>
            <p className='left'>Price:</p>
            <p className='left-desc'>${price}</p>
          </List.Item>
          <List.Item>
            <p className='left'>Category:</p>
            <p className='left-desc'>{mainCat} {subCat ? '--->' + subCat : ''}</p>
          </List.Item>
          <List.Item>
            <p className='left'>Images:</p>
            <p className='left-desc'>
             {
              imgs.map(img => {
                  return(
                    <img 
                    key={img}
                    className='product-img'
                    src={BASE_IMG_URL + img} alt="Product Image"
                    style={{width:200,height:200}}
                    /> 
                  )
              })
            } 
            </p>
          </List.Item>
      </List>
    </Card>
    )
  }
}
