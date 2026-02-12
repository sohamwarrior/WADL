<?php
// save_appointment.php
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';
$gender = isset($_POST['gender']) ? trim($_POST['gender']) : '';
$subject = isset($_POST['subject']) ? trim($_POST['subject']) : '';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';

$preferred = [];
foreach ($_POST as $k => $v) {
    if ($k === 'days') {
        if (is_array($v)) $preferred = array_merge($preferred, $v);
        else $preferred[] = $v;
    }
}

if ($name === '' || $email === '' || $phone === '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

$entry = [
    'name' => $name,
    'email' => $email,
    'phone' => $phone,
    'gender' => $gender,
    'subject' => $subject,
    'message' => $message,
    'preferredDays' => $preferred,
    'submittedAt' => date('c')
];

$file = __DIR__ . '/appointments.json';
$tries = 0;
while ($tries++ < 3) {
    if (!file_exists($file)) {
        file_put_contents($file, json_encode([]));
    }
    $raw = file_get_contents($file);
    $list = json_decode($raw, true);
    if (!is_array($list)) $list = [];
    $list[] = $entry;
    $tmp = $file . '.tmp';
    if (file_put_contents($tmp, json_encode($list, JSON_PRETTY_PRINT)) !== false) {
        if (@rename($tmp, $file)) {
            echo json_encode(['success' => true, 'data' => $entry]);
            exit;
        }
    }
    usleep(50000);
}
http_response_code(500);
echo json_encode(['success' => false, 'message' => 'Could not save the data']);
exit;
