<?php

class DB {

    static $DB_name='es_challenge';
    static $Connection;

    public static function connect() {

        if ( !self::$Connection) {
            $host = getenv('DB_HOST') ?: 'localhost';
            $db_name = getenv('DB_NAME') ?: self::$DB_name;
            $user = getenv('DB_USER') ?: 'sqluser';
            $pass = getenv('DB_PASS') ?: 'sqlpass';
            $dsn = 'mysql:host=' . $host . ';dbname=' . $db_name . ';charset=utf8mb4';
            self::$Connection = new PDO($dsn, $user, $pass, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_OBJ,
            ]);
        }

        return self::$Connection;
    }
    
}
