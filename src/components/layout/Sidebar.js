
"use client";

import { useTheme } from "@/context/ThemeContext";
import { logoutUser } from "@/modules/auth/api/auth.service";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { useFilteredMenu } from "@/modules/shared/hooks/useFilteredMenu";
import { Layout, Menu } from "antd";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

const { Sider } = Layout;

const Sidebar = ({ collapsed }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { isDark } = useTheme();

  const {
    user,
    clearUser,
    permissions,
    isLoading,
  } = useAuthStore();

  console.log("USER:", user);
  console.log("ROLE:", user?.role);
  console.log("PERMISSIONS:", permissions);
  console.log("LOADING:", isLoading);

  const {
    menuItems,
    bottomMenuItems,
  } = useFilteredMenu();

  // Logout
  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout error:", error);
    }

    clearUser();
    router.replace("/");
  };

  // Menu click
  const handleMenuClick = ({ key }) => {
    if (key === "logout") {
      handleLogout();
      return;
    }

    router.push(key);
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      trigger={null}
      width={260}
      collapsedWidth={80}
      breakpoint="lg"
      className={`
        !h-screen
        !z-[100]
        !overflow-hidden
        ${
          isDark
            ? "!bg-[linear-gradient(180deg,#0D1B1E_0%,#08161A_100%)]"
            : "!bg-[#05144B]"
        }
        ${
          isDark
            ? "shadow-[2px_0_25px_rgba(0,0,0,0.35)]"
            : "shadow-[2px_0_25px_rgba(15,106,117,0.25)]"
        }
      `}
    >
      {/* Sidebar Scroll Container */}
      <div
        className="
          sidebar-scroll
          flex
          h-full
          flex-col
          overflow-x-hidden
          overflow-y-auto
          px-3
          py-4
        "
      >
        {/* ================= LOGO + MAIN MENU ================= */}
        <div>
          {/* Logo */}
          <div
            className="
              mb-4
              flex
              h-[72px]
              items-center
              justify-center
            "
          >
            <div
              className={`
                relative
                ${
                  collapsed
                    ? "h-[60px] w-[40px]"
                    : "h-[100px] w-[130px]"
                }
              `}
            >
              <Image
                src="/images/LOGO-DW-w.webp"
                alt="Destinoway Logo"
                fill
                priority
                className="object-contain"
              />
            </div>
          </div>

          {/* Main Menu */}
          <Menu
            mode="inline"
            selectedKeys={[pathname]}
            defaultOpenKeys={["/dashboard/staff"]}
            items={menuItems}
            theme="dark"
            inlineCollapsed={collapsed}
            className="
              !border-r-0
              !bg-transparent
            "
          />
        </div>

        {/* ================= BOTTOM MENU ================= */}
        <div className="mt-auto">
          <Menu
            mode="inline"
            items={bottomMenuItems}
            onClick={handleMenuClick}
            theme="dark"
            selectable={false}
            inlineCollapsed={collapsed}
            className="
              mt-3
              !border-r-0
              !bg-transparent
            "
          />
        </div>
      </div>
    </Sider>
  );
};

export default Sidebar;


