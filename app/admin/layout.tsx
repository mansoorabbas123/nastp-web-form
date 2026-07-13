import AdminLayout from '@/components/AdminLayout';
import React from 'react'

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <AdminLayout>
      {children}
    </AdminLayout>
  )
}

export default layout
