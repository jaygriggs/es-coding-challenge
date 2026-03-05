<?php

require_once( dirname(__FILE__) . '/../shared/EmployeeModel.php');

class EmployeeApi {

    public function employeeDataGet( $id ) {

        $model = new EmployeeModel();
        return $model->getById($id);

    }

    public function employeeDataUpdate( $id, $data ) {

        if ( array_key_exists('date_of_birth', $data) && empty($data['date_of_birth']) ) {
            header("HTTP/1.1 400 Bad Request");
            return [ 'success' => false, 'msg' => 'Date of birth is required' ];
        }
        $model = new EmployeeModel();
        $model->updateById($id, $data);
        return [ 'success' => true ];

    }

    public function employeeDelete( $id ) {

        $model = new EmployeeModel();
        $model->deleteById($id);
        return [ 'success' => true ];

    }

    public function employeeCreate( $data ) {

        if ( empty($data['date_of_birth']) ) {
            header("HTTP/1.1 400 Bad Request");
            return [ 'success' => false, 'msg' => 'Date of birth is required' ];
        }
        $model = new EmployeeModel();
        $id = $model->create($data);
        return [ 'success' => true, 'id' => $id ];

    }

    public function employeeListGet() {

        $model = new EmployeeModel();
        return $model->getAll();

    }

}
