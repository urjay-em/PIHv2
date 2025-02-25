import React, { useState } from 'react';
import { Form, Input, Button, notification } from 'antd';
import { UserOutlined, MailOutlined } from '@ant-design/icons';

const Setting = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Submit handler for the form
  const handleSubmit = (values) => {
    setLoading(true);
    
    // Simulate an API call to save the settings
    setTimeout(() => {
      setLoading(false);
      notification.success({
        message: 'Profile Updated',
        description: 'Your profile has been updated successfully.',
      });
    }, 1000);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Edit Profile</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ maxWidth: '400px', margin: '0 auto' }}
      >
        {/* Name Field */}
        <Form.Item
          label="Full Name"
          name="name"
          rules={[{ required: true, message: 'Please enter your full name' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Michael" />
        </Form.Item>

        {/* Email Field */}
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Please enter your email' }, { type: 'email', message: 'Invalid email address' }]}
        >
          <Input prefix={<MailOutlined />} placeholder="michael@example.com" />
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
          >
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Setting;
