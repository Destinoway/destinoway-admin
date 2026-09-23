import { LogoutOutlined, SettingOutlined } from "@ant-design/icons";

export const bottomMenuItems = [
  {
    key: "settings",
    icon: <SettingOutlined />,
    label: "Settings",
    children: [

      {
        key: "/dashboard/master-data",
        label: "master-data settings",
        module: "masterData",
      },
      {
        key: "/dashboard/home-content",
        label: "Home-Page settings",
        module: "homeContent",
      },

      {
        key: "/dashboard/theme",
        label: "Theme settings",
        module: "themeSettings",
      }

      // Future
      // {
      //   key: "/dashboard/settings/seo",
      //   label: "SEO",
      //   module: "seoSettings",
      // },
      // {
      //   key: "/dashboard/settings/footer",
      //   label: "Footer",
      //   module: "footerSettings",
      // }, 
    ],
  },

  {
    key: "logout",
    icon: <LogoutOutlined />,
    label: "Logout",
  },
];
