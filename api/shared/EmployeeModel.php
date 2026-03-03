<?php

require_once( dirname(__FILE__) . DIRECTORY_SEPARATOR . 'DB.php');

class EmployeeModel {

    public function getById($id) {
        
        $db = DB::connect();
        $stmt = $db->prepare('SELECT id, first_name, last_name, phone, office_number, username, date_of_birth, employee_category FROM employees WHERE id = :id');
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        
        if ( $stmt ) {
            $row = $stmt->fetchObject();
            return $row;
        }
    }

}
