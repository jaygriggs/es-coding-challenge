<?php

require_once( dirname(__FILE__) . DIRECTORY_SEPARATOR . 'DB.php');

class UserModel {

    public function getByUsername($username) {
        
        $db = DB::connect();
        $stmt = $db->prepare('SELECT id, username, password, is_admin FROM employees WHERE username = :username');
        $stmt->bindValue(':username', $username, PDO::PARAM_STR);
        $stmt->execute();
        
        if ( $stmt ) {
            $row = $stmt->fetchObject();
            return $row;
        }
    }

}
