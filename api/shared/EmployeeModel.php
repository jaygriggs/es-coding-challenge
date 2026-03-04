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

    public function deleteById($id) {

        $db = DB::connect();
        $stmt = $db->prepare('DELETE FROM employees WHERE id = :id');
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        return $stmt->execute();
    }

    public function create($data) {

        $db = DB::connect();
        $sql = 'INSERT INTO employees (first_name, last_name, phone, office_number, date_of_birth, employee_category, username, password) VALUES (:first_name, :last_name, :phone, :office_number, :date_of_birth, :employee_category, :username, :password)';
        $stmt = $db->prepare($sql);
        $stmt->execute([
            ':first_name' => $data['first_name'],
            ':last_name' => $data['last_name'],
            ':phone' => !empty($data['phone']) ? $data['phone'] : null,
            ':office_number' => !empty($data['office_number']) ? $data['office_number'] : null,
            ':date_of_birth' => !empty($data['date_of_birth']) ? $data['date_of_birth'] : null,
            ':employee_category' => !empty($data['employee_category']) ? $data['employee_category'] : null,
            ':username' => $data['username'],
            ':password' => password_hash($data['password'], PASSWORD_DEFAULT)
        ]);
        return $db->lastInsertId();
    }

    public function getAll() {

        $db = DB::connect();
        $stmt = $db->prepare('SELECT id, first_name, last_name, username, date_of_birth, office_number, employee_category, is_admin, phone FROM employees ORDER BY last_name, first_name');
        $stmt->execute();
        return $stmt->fetchAll();
    }

}
