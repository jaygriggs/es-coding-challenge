<?php

require_once('api/server/EmployeeApi.php');
require_once('api/server/Auth.php');

$auth = new Auth();

$req_obj = isset($_REQUEST['obj']) ? $_REQUEST['obj'] : null;
$req_type = isset($_REQUEST['req']) ? $_REQUEST['req'] : null;

$data = [ 'success' => 'false', 'msg' => 'invalid request'];

switch( $req_obj ) {

    case 'employee':
        $auth_data = $auth->requireLogin();
        $api = new EmployeeApi();
        $is_admin = !empty($auth_data['is_admin']);

        if ( $req_type === 'list' ) {
            if ( !$is_admin ) {
                header("HTTP/1.1 403 Access Denied");
                $data = [ 'success' => false, 'msg' => 'Access denied' ];
                break;
            }
            $data = $api->employeeListGet();
            break;
        }

        $request_id = isset($_REQUEST['id']) ? (int) $_REQUEST['id'] : 0;

        if ( !$is_admin && $request_id !== (int) $auth_data['id'] ) {
            header("HTTP/1.1 403 Access Denied");
            $data = [ 'success' => false, 'msg' => 'Access denied' ];
            break;
        }

        if ( $req_type === 'update' ) {
            if ( $_SERVER['REQUEST_METHOD'] !== 'POST' ) {
                header("HTTP/1.1 405 Method Not Allowed");
                $data = [ 'success' => false, 'msg' => 'Invalid request method' ];
                break;
            }

            $errors = [];
            if ( empty($_POST['first_name']) ) { $errors[] = 'First name is required'; }
            if ( empty($_POST['last_name']) ) { $errors[] = 'Last name is required'; }
            if ( empty($_POST['phone']) ) { $errors[] = 'Phone is required'; }
            if ( !empty($_POST['phone']) && !preg_match('/^[0-9\\-\\(\\)\\s\\+\\.]{7,20}$/', $_POST['phone']) ) {
                $errors[] = 'Phone format is invalid';
            }
            if ( !empty($_POST['date_of_birth']) && !preg_match('/^\\d{4}-\\d{2}-\\d{2}$/', $_POST['date_of_birth']) ) {
                $errors[] = 'Date of birth format is invalid';
            }
            if ( !empty($_POST['employee_category']) && !in_array($_POST['employee_category'], ['full_time','part_time','intern','contractor'], true) ) {
                $errors[] = 'Employee category is invalid';
            }

            if ( !empty($errors) ) {
                header("HTTP/1.1 400 Bad Request");
                $data = [ 'success' => false, 'msg' => implode('; ', $errors) ];
                break;
            }

            if ( empty($_POST['date_of_birth']) ) {
                $_POST['date_of_birth'] = null;
            }
            if ( empty($_POST['employee_category']) ) {
                $_POST['employee_category'] = null;
            }

            $data = $api->employeeDataUpdate( $request_id, $_POST );
        }
        else {
            $data = $api->employeeDataGet( $request_id );
        }
        break;
    case 'auth':
        if ( $req_type == 'doLogin' ) {
            $data = $auth->doLogin( $_REQUEST['username'], $_REQUEST['password'] );
        }
        else if ( $req_type == 'requireLogin' ) {
            $data = $auth->requireLogin();
        }
        else if ( $req_type == 'logout' ) {
            $data = $auth->doLogout();
        }
        break;
}

if ( $data ) {
    echo json_encode($data);
    exit;
}
