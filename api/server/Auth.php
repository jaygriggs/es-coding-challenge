<?php

require_once( dirname(__FILE__) . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'shared' . DIRECTORY_SEPARATOR . 'UserModel.php');

class Auth {

    public function verifyCredentials($username, $password) {


        $model = new UserModel();
        $user_data = $model->getByUsername($username);

        if ( empty($user_data) ) {
            return false;
        }

        $db_password = $user_data->password;

        if ( password_verify($password, $db_password) ) {
            return $user_data;
        }

        return false;
    }

    public function doLogin( $username, $password ) {

        if ( $user = $this->verifyCredentials($username, $password) ) {
            session_start();
            $_SESSION['user_id'] = $user->id;
            $_SESSION['is_admin'] = (int) $user->is_admin;
            return [ 'success' => true, 'id' => $user->id, 'is_admin' => (int) $user->is_admin ];
        }
        else {
            return ['success' => false, 'msg' => 'Invalid credentials'];
        }
        
    }

    public function requireLogin() {

        session_start();
        if ( empty($_SESSION['user_id']) ) {
            header("HTTP/1.1 403 Access Denied");
            exit;
        }

        return [ 'success' => true, 'id' => $_SESSION['user_id'], 'is_admin' => !empty($_SESSION['is_admin']) ? 1 : 0 ];
    }

    public function requireAdmin() {

        $auth_data = $this->requireLogin();
        if ( empty($auth_data['is_admin']) ) {
            header("HTTP/1.1 403 Access Denied");
            exit;
        }

        return $auth_data;
    }

    public function doLogout() {

        session_start();
        session_unset();
        session_destroy();
        return [ 'success' => true ];
    }

}
