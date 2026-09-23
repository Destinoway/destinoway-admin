"use client";

import { Avatar, Button, Dropdown, Layout, Space, Switch } from "antd";

import {
  BellOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";

import { useTheme } from "@/context/ThemeContext";
import { logoutUser } from "@/modules/auth/api/auth.service";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { useRouter } from "next/navigation";

const { Header } = Layout;

const HeaderBar = ({ collapsed, setCollapsed }) => {
  const { isDark, toggleTheme } = useTheme();
  const router = useRouter();

  const { user, clearUser } = useAuthStore();

  // Logout
  const handleLogout = async () => {
    try {
      await logoutUser();
    } finally {
      clearUser();
      router.replace("/");
    }
  };

  // Dropdown menu click
  const handleMenuClick = ({ key }) => {
    if (key === "logout") {
      handleLogout();
      return;
    }

    if (key === "profile") {
      router.push("/profile");
      return;
    }

    if (key === "settings") {
      router.push("/settings");
      return;
    }
  };

  // User dropdown items
  const menuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Profile",
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Settings",
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      danger: true,
    },
  ];

  return (
    <Header
      className={`
        !flex
        !h-[70px]
        !items-center
        !justify-between
        !border-b
        !px-3
        !py-2
        md:!px-5

        ${
          isDark
            ? "!bg-[#0F1C20] !border-[rgba(255,255,255,0.06)] shadow-[0_2px_15px_rgba(0,0,0,0.25)]"
            : "!bg-[#f8fcfd] !border-[#d9edf5] shadow-[0_2px_15px_rgba(15,106,117,0.05)]"
        }
      `}
    >
      {/* ================= LEFT SECTION ================= */}
      <div className="flex items-center gap-3">
        {/* Sidebar Toggle */}
        <Button
          type="text"
          onClick={() => setCollapsed((prev) => !prev)}
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          className="!text-lg"
        />

        {/* Dashboard Title */}
        <span
          className={`
            text-sm
            font-semibold
            md:text-base
            ${isDark ? "text-white" : "text-[#1f2937]"}
          `}
        >
          Dashboard
        </span>
      </div>

      {/* ================= RIGHT SECTION ================= */}
      <div className="flex items-center gap-4 md:gap-6">
        {/* Theme Toggle */}
        <Switch
          checked={isDark}
          onChange={toggleTheme}
          checkedChildren="🌙"
          unCheckedChildren="☀️"
        />

  

        {/* User Dropdown */}
        <Dropdown
          menu={{
            items: menuItems,
            onClick: handleMenuClick,
          }}
          placement="bottomRight"
        >
          <Space className="cursor-pointer">
            {/* Avatar */}
            <Avatar
              size={42}
              className="!bg-[#05144B]"
            >
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </Avatar>

            {/* Desktop User Info */}
            <div className="hidden leading-tight lg:block">
              {/* User Name */}
              <div
                className={`
                  text-sm
                  font-medium
                  ${isDark ? "text-white" : "text-[#1f2937]"}
                `}
              >
                {user?.name || "User"}
              </div>

              {/* User Role */}
              <div
                className={`
                  text-xs
                  ${isDark ? "text-gray-400" : "text-gray-500"}
                `}
              >
                {user?.role || "User"}
              </div>
            </div>
          </Space>
        </Dropdown>
      </div>
    </Header>
  );
};

export default HeaderBar;
