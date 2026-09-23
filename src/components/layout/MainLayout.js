"use client";

import { useTheme } from "@/context/ThemeContext";
import { useDashboardUIStore } from "@/modules/shared/store/dashboardUI.store";
import { darkTheme, lightTheme } from "@/theme/themeConfig";
import { ConfigProvider, Layout, theme } from "antd";
import { useEffect, useMemo, useState } from "react";
import HeaderBar from "./HeaderBar";
import Sidebar from "./Sidebar";

const { Content } = Layout;

const MainLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { isDark } = useTheme();

  const isScrollLocked = useDashboardUIStore((state) => state.isScrollLocked);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Ant Design theme
  const antdTheme = useMemo(() => {
    return {
      algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,

      ...(isDark ? darkTheme : lightTheme),
    };
  }, [isDark]);

  return (
    <ConfigProvider theme={antdTheme}>
      {mounted ? (
        <Layout className="min-h-screen">
          {/* ================= SIDEBAR ================= */}
          <Sidebar collapsed={collapsed} />

          {/* ================= MAIN LAYOUT ================= */}
          <Layout
            className={`
              h-screen
              ${isDark ? "bg-[#08161A]" : "bg-[#edf7fa]"}
            `}
          >
            {/* ================= HEADER ================= */}
            <HeaderBar collapsed={collapsed} setCollapsed={setCollapsed} />

            {/* ================= CONTENT ================= */}
            <Content
              className={`
                m-4
                flex-1
                h-[calc(100vh-64px)]
                rounded-[5px]
                p-6
                ${
                  isDark
                    ? "bg-[#102027] shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
                    : "bg-[#f8fcfd] shadow-[0_10px_30px_rgba(15,106,117,0.05)]"
                }
                ${isScrollLocked ? "overflow-y-hidden" : "overflow-y-auto"}
              `}
            >
              {children}
            </Content>
          </Layout>
        </Layout>
      ) : null}
    </ConfigProvider>
  );
};

export default MainLayout;
