<?php
function writeErrorLog($e)
{
    global $conn;
    $message = $e->getMessage();
    $file = $e->getFile();
    $line = $e->getLine();
    $trace = $e->getTraceAsString();
    if ($message != '') {
        try {
            $conn->query('INSERT INTO error_log (error_message,error_file,error_line,error_trace)
                VALUES (:message, :file, :line, :trace)');
            $conn->bind(':message', $message);
            $conn->bind(':file', $file);
            $conn->bind(':line', $line);
            $conn->bind(':trace', $trace);
            if ($conn->execute()) {
                return true;
            } else {
                return false;
            }
        } catch (Exception $e) {
            $error = $e->getMessage();
            die($error);
        }
    }
}
