/* eslint-disable react/prop-types */
import React, { useEffect } from "react";
import {
  ProductOutlined,
  PoundCircleFilled,
  AppstoreFilled,
  UserOutlined,
} from "@ant-design/icons";
import { FiLogIn } from "react-icons/fi";
import { CiViewBoard } from "react-icons/ci";
import { Layout, Menu, Avatar, Dropdown, theme } from "antd";
import { NavLink, Link } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

const { Header, Content, Footer, Sider } = Layout;

const items = [
  {
    key: "1",
    icon: <CiViewBoard />,
    label: "Dashboard",
    path: "/"
  },
  {
    key: "2",
    icon: <ProductOutlined />,
    label: "Product",
    path: "/product"
  },
  {
    key: "3",
    icon: <AppstoreFilled />,
    label: "Inventory",
    path: "/inventory"
  },
  {
    key: "4",
    icon: <PoundCircleFilled />,
    label: "Invoice",
    path: "/invoice"
  },
];

const MasterLayout = (props) => {
  const { token, user, checkAuth, logout } = useAuthStore();

  useEffect(() => {
    (async () => {
      await checkAuth();
    })();
  }, [checkAuth]);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

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
        <Menu theme="dark" mode="inline">
          {items.map((item) => (
            <Menu.Item key={item.key} icon={item.icon}>
              <NavLink
                to={item.path}
                activeClassName="active-menu-item"
              >
                {item.label}
              </NavLink>
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            paddingInline: "20px",
            height: "70px",
            background: colorBgContainer,
          }}
        >
          <div className="flex justify-between">
            <div></div>
            <div>
              <div className="flex gap-4">
                {token ? (
                  <Dropdown
                    overlay={menu}
                    className="cursor-pointer my-4"
                    placement="bottomRight"
                  >
                    {user ? (
                      <Avatar
                        size="large"
                        src={user.image || <UserOutlined />}
                      />
                    ) : (
                      <Avatar size="large" icon={<UserOutlined />} />
                    )}
                  </Dropdown>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="bg-violet-600 text-white px-4 my-2 flex items-center h-12 rounded-md transition-all hover:bg-violet-700"
                    >
                      <FiLogIn className="text-1xl me-1" />
                      Login
                    </Link>

                    <Link
                      to="/register"
                      className="bg-violet-600 text-white px-4 my-2 flex items-center h-12 rounded-md transition-all hover:bg-violet-700"
                    >
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
        >
          {/* Add any footer content if necessary */}
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MasterLayout;
