"use client";

// Form đăng nhập khu quản trị (FR1).
import { useActionState } from "react";
import { Alert, Button, Card, Input, Typography } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { loginAction, type LoginState } from "@/lib/content/auth-actions";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    loginAction,
    {}
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        background: "#f5f5f5",
      }}
    >
      <Card style={{ width: "100%", maxWidth: 380 }}>
        <Typography.Title level={4} style={{ marginTop: 0, color: "#2e7d32" }}>
          Trăng Sáng CMS
        </Typography.Title>
        <Typography.Paragraph type="secondary" style={{ fontSize: 13 }}>
          Khu quản trị nội dung dành cho Ban Tổ chức.
        </Typography.Paragraph>

        <form action={formAction}>
          <Input.Password
            name="password"
            placeholder="Mật khẩu quản trị"
            prefix={<LockOutlined />}
            autoComplete="current-password"
            autoFocus
          />
          {state.error ? (
            <Alert
              type="error"
              message={state.error}
              showIcon
              style={{ marginTop: 12 }}
            />
          ) : null}
          <Button
            type="primary"
            htmlType="submit"
            loading={pending}
            block
            style={{ marginTop: 16 }}
          >
            Đăng nhập
          </Button>
        </form>
      </Card>
    </div>
  );
}
