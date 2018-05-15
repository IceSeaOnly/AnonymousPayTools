// 以下文件格式为描述路由的协议格式
// 你可以调整 routerConfig 里的内容
// 变量名 routerConfig 为 iceworks 检测关键字，请不要修改名称

import HeaderAsideFooterLayout from './layouts/HeaderAsideFooterLayout';
import Home from './pages/Home';
import AddAccout from './pages/AddAccout';
import TransLog from './pages/TransLog';
import HeaderAsideFooterResponsiveLayout from './layouts/HeaderAsideFooterResponsiveLayout';
import NotFound from './pages/NotFound';

const routerConfig = [
  {
    path: '/',
    layout: HeaderAsideFooterResponsiveLayout,
    component: Home,
  },
  {
    path: '/addAccout',
    layout: HeaderAsideFooterResponsiveLayout,
    component: AddAccout,
  },
  {
    path: '/transLog',
    layout: HeaderAsideFooterResponsiveLayout,
    component: TransLog,
  },
];

export default routerConfig;