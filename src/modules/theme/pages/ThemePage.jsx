"use client";

import { Card, Spin } from "antd";
import ThemeForm from "../components/ThemeForm";
import { useTheme } from "../hooks/useTheme";

export default function ThemePage() {
  const { theme, isLoading, updateTheme } = useTheme();

  if (isLoading) {
    return <Spin size="large" />;
  }

  return (
    <Card title="Website Theme Settings" variant="borderless">
      <ThemeForm theme={theme} updateTheme={updateTheme} />
    </Card>
  );
}
