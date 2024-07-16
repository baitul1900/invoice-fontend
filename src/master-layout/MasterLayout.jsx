/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import {
  ProductOutlined,
  PoundCircleFilled,
  AppstoreFilled,
  UserOutlined 
} from "@ant-design/icons";
import { FiLogIn } from "react-icons/fi";
import { Layout, Menu, theme, Avatar, Dropdown } from "antd";

import { useLocation, NavLink, Link } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
const { Header, Content, Footer, Sider } = Layout;

const items = [
  {
    key: '1',
    icon: <ProductOutlined />,
    label: <NavLink to="/product">Product</NavLink>
  },
  {
    key: '2',
    icon: <AppstoreFilled />,
    label: <NavLink to="/inventory">Inventory</NavLink>
  },
  {
    key: '3',
    icon: <PoundCircleFilled />,
    label: <NavLink to="/invoice">Invoice</NavLink>
  }
];

const MasterLayout = (props) => {
  const [selectedKey, setSelectedKey] = useState('1');
  const location = useLocation();

  useEffect(() => {
    // Update selected key based on current path
    const currentPath = location.pathname;
    const matchingItem = items.find(item => currentPath.startsWith(item.label.props.to));
    if (matchingItem) {
      setSelectedKey(matchingItem.key);
    }
  }, [location.pathname]);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { token, user, checkAuth, logout } = useAuthStore();

  useEffect(() => {
    (async () => {
      await checkAuth();
    })();
  }, []);

  const handleLogout = () => {
    logout();
  };

  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
      >
        <div className="demo-logo-vertical">
          <h1 className="text-blue-100 text-xl text-center my-5">Invoice</h1>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={items}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            paddingInline: "20px",
            height: "70px",
          }}
        >
          <div className="flex justify-between">
            <div></div>
            <div>
              <div className="flex gap-4">
                {token ? (
                  <Dropdown overlay={menu} className="cursor-pointer my-4" placement="bottomRight">
                    {user ? (
                      <Avatar size="large" src={user.data.image} />
                    ) : (
                      <Avatar size="large" icon={<UserOutlined />} />
                    )}
                  </Dropdown>
                ) : (
                  <>
                    <Link to="/login" className="bg-violet-600 text-white px-4 my-2 flex items-center h-12 rounded-md transition-all hover:bg-violet-700">
                      <FiLogIn className="text-1xl me-1" />
                      Login
                    </Link>

                    <Link to="/register" className="bg-violet-600 text-white px-4 my-2 flex items-center h-12 rounded-md transition-all hover:bg-violet-700">
                      <FiLogIn className="text-1xl me-1" />
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </Header>

        <Content
          style={{
            margin: "24px 16px 0",
          }}
        >
          <div
            style={{
              padding: 24,
              minHeight: "100vh",
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {props.children}
          </div>
        </Content>
        <Footer
          style={{
            textAlign: "center",
          }}
        ></Footer>
      </Layout>
    </Layout>
  );
};

export default MasterLayout;
