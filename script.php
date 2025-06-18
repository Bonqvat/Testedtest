<?php
header('Content-Type: application/json');

$host = 'localhost';
$dbname = 'futureauto';
$user = 'postgres';
$password = 'your_password'; // Замените на реальный пароль

try {
    $pdo = new PDO("pgsql:host=$host;dbname=$dbname", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Connection failed: ' . $e->getMessage()]);
    exit;
}

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'getCars':
        getCars($pdo);
        break;
    case 'addFeedback':
        addFeedback($pdo);
        break;
    default:
        echo json_encode(['error' => 'Invalid action']);
}

function getCars($pdo) {
    try {
        $stmt = $pdo->query("
            SELECT 
                id, brand, model, year, price, description, 
                body_type AS bodyType, 
                drive, 
                features, 
                images, 
                specs,
                power,
                status,
                created_at AS createdAt
            FROM cars 
            ORDER BY created_at DESC
        ");
        $cars = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($cars);
    } catch (PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function addFeedback($pdo) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $name = $data['name'] ?? '';
    $phone = $data['phone'] ?? '';
    $email = $data['email'] ?? '';
    $subject = $data['subject'] ?? '';
    $message = $data['message'] ?? '';

    if (empty($name) || empty($phone) || empty($email) || empty($subject) || empty($message)) {
        echo json_encode(['error' => 'All fields are required']);
        return;
    }

    try {
        $stmt = $pdo->prepare("
            INSERT INTO feedback (name, phone, email, subject, message) 
            VALUES (?, ?, ?, ?, ?)
        ");
        $stmt->execute([$name, $phone, $email, $subject, $message]);
        echo json_encode(['success' => true]);
    } catch (PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}
?>