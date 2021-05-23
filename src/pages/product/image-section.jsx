import React from 'react'
import PropTypes from 'prop-types'
import { message, Upload, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {BASE_IMG_URL} from '../../utils/constants'
import { deleteImg } from '../../request'

const changeBase = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default class ImageSection extends React.Component {
  static propTypes = {
    imgs: PropTypes.array
  }

  state = {
    previewDisplay: false,    
    previewImage: '',         // URL
    ImgList: [],
  };

  constructor(props){
    super(props)
    const {imgs} = this.props
    let ImgList = []
    
    if (imgs && imgs.length > 0 ) {
      ImgList = imgs.map((img,index) => ({
        uid: -index,
        name: img,
        status: 'done',
        url: BASE_IMG_URL + img
      }))
    }

    this.state = ({
      previewDisplay: false, 
      smallImage: '',
      ImgList  
    })
  }

  getImgs = () => {
      return this.state.ImgList.map(file => file.name)
  }

  showPreview = async (img) => {
    if (!img.url && !img.preview) {
      img.preview = await changeBase(img.originFileObj);
    }
    this.setState({
      smallImage: img.url || img.preview,
      previewDisplay: true,
    });
  };

  handleImgChange = async ({ file, fileList }) => {
    if (file.status === 'done') {
        const result = file.response   
        if (result.status === 0) {
            message.success('Upload success')
            const {name,url} = result.data
            file = fileList[fileList.length-1]
            file.name = name
            file.url = url
        } else {
            message.error('Upload fail')
        }
    } else if (file.status === 'removed') {
        const result = await deleteImg(file.name)
        if (result.status === 0) {
            message.success('Delete success')
        } else {
            message.error('Delete fail')
        }
    }
    this.setState({ ImgList: fileList })
  };

  handleCancel = () => this.setState({ previewDisplay: false });

  render() {
    const { ImgList, previewDisplay, smallImage } = this.state;
    
    return (
      <div>
        <Upload
          //action="http://localhost:5000/manage/img/upload"  
          action="https://mysterious-fjord-53168.herokuapp.com/manage/img/upload"
          fileList={ImgList} 
          accept='image/*' 
          name='image'  
          listType="picture-card" 
          onPreview={this.showPreview}
          onChange={this.handleImgChange}
        >
          {ImgList.length >= 4 ? null 
            :(<div>
                <PlusOutlined /> 
                <div>Upload</div>
              </div>
          )}
        </Upload>
        <Modal visible={previewDisplay} onCancel={this.handleCancel}>
          <img alt="img" style={{ width: '100%' }} src={smallImage} />
        </Modal>
      </div>
    );
  }
}
