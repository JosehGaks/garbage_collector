import React from 'react';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import MainLayout from './container/layouts/main';
import ClientLayout from './container/layouts/client';
import HomeView from './container/views/HomeView';
import MapView from './container/views/MapView';
import NotFoundView from './container/views/NotFoundView';
import AuthProvider from './contexts/AuthContext';
import SignUp from './component/SignUp';
import Login from './component/Login';
import AuthRoute from './component/AuthRoute';
import GuardRoute from './component/GuardRoute';
import UserView from './container/views/UserView';
import RoleView from './container/views/RoleView';
import PermissionView from './container/views/PermissionView';
import RoleDetailsView from './container/views/RoleDetailsView';
import ConfirmationView from './container/views/ConfirmationView';
import ProfileView from './container/views/ProfileView';
import Activate from './component/Activate';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Switch>
          <AuthRoute exact path="/">
            <ClientLayout>
              <HomeView />
            </ClientLayout>
          </AuthRoute>
          <AuthRoute exact path="/profile">
            <ClientLayout>
              <ProfileView />
            </ClientLayout>
          </AuthRoute>
          <AuthRoute path="/dashboard" appPermissions={['basket:read']}>
            <MainLayout>
              <Typography variant="h3">Dashborad Page</Typography>
            </MainLayout>
          </AuthRoute>
          <AuthRoute
            path="/baskets/:action"
            appPermissions={[
              'basket:read',
              'basket:create',
              'basket:update',
              'basket:software-update',
            ]}
          >
            <MainLayout hasPadding={false}>
              <MapView />
            </MainLayout>
          </AuthRoute>
          <AuthRoute path="/users/show" appPermissions={['users:read']}>
            <MainLayout>
              <UserView />
            </MainLayout>
          </AuthRoute>
          <AuthRoute exact path="/roles" appPermissions={['roles:read']}>
            <MainLayout>
              <RoleView />
            </MainLayout>
          </AuthRoute>
          <AuthRoute exact path="/roles/:role" appPermissions={['role:read']}>
            <MainLayout>
              <RoleDetailsView />
            </MainLayout>
          </AuthRoute>
          <AuthRoute path="/permissions" appPermissions={['permissions:read']}>
            <MainLayout>
              <PermissionView />
            </MainLayout>
          </AuthRoute>
          <AuthRoute path="/confirm" exclude>
            <ClientLayout>
              <ConfirmationView />
            </ClientLayout>
          </AuthRoute>
          <Route path="/activate">
            <Activate />
          </Route>
          <GuardRoute path="/register">
            <ClientLayout>
              <SignUp />
            </ClientLayout>
          </GuardRoute>
          <GuardRoute path="/login">
            <ClientLayout>
              <Login />
            </ClientLayout>
          </GuardRoute>
          <Route>
            <NotFoundView />
          </Route>
        </Switch>
      </AuthProvider>
    </Router>
  );
}

export default App;
