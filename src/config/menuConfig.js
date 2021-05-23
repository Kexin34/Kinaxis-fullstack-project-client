import {
  AppstoreOutlined,
  ProfileOutlined,
  ShopOutlined,
  DesktopOutlined,
  ContainerOutlined,
} from '@ant-design/icons';

const menuList = [
    {
      title: 'Dashboard',
      key: '/dashboard', 
      icon: <DesktopOutlined />,  
      isPublic: true 
    },
    {
      title: 'Product', 
      key: '/products',  
      icon: <AppstoreOutlined /> ,
      children: [  
        {
          title: 'Category', 
          key: '/category',  
          icon: <ProfileOutlined />
        },
        {
          title: 'Product Management', 
          key: '/product',  
          icon: <ShopOutlined />
        }
      ]
    },
    {
        title: 'Account', 
        key: '/role',  
        icon: <ContainerOutlined />,  
    },
]
export default menuList