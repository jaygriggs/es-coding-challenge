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

    public function updateById($id, $data) {

        $db = DB::connect();
        $fields = [
            'first_name',
            'last_name',
            'phone',
            'office_number',
            'date_of_birth',
            'employee_category'
        ];

        $set_clauses = [];
        $params = [ ':id' => $id ];

        foreach ( $fields as $field ) {
            if ( array_key_exists($field, $data) ) {
                $set_clauses[] = $field . ' = :' . $field;
                $params[':' . $field] = $data[$field];
            }
        }

        if ( empty($set_clauses) ) {
            return false;
        }

        $sql = 'UPDATE employees SET ' . implode(', ', $set_clauses) . ' WHERE id = :id';
        $stmt = $db->prepare($sql);
        return $stmt->execute($params);
    }

}
