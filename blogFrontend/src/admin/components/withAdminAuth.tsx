import React from 'react';
import AdminRouteGuard from './AdminRouteGuard/AdminRouteGuard';

export function withAdminAuth<P extends object>(WrappedComponent: React.ComponentType<P>) {
  return function WithAdminAuthComponent(props: P) {
    return (
      <AdminRouteGuard>
        <WrappedComponent {...props} />
      </AdminRouteGuard>
    );
  };
} 