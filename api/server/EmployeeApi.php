<?php

require_once( dirname(__FILE__) . '/../shared/EmployeeModel.php');

class EmployeeApi {

    public function employeeDataGet( $id ) {

        $model = new EmployeeModel();
        return $model->getById($id);

    }

    public function employeeDataUpdate( $id, $data ) {

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

        $model = new EmployeeModel();
        $id = $model->create($data);
        return [ 'success' => true, 'id' => $id ];

    }

    public function employeeListGet() {

        $model = new EmployeeModel();
        return $model->getAll();

    }

}
