<?php
session_start();
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
    case 'getUserData':
        getUserData($pdo);
        break;
    case 'updateUserData':
        updateUserData($pdo);
        break;
    case 'loginUser':
        loginUser($pdo);
        break;
    case 'registerUser': // Добавлен новый обработчик
        registerUser($pdo);
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

function getUserData($pdo) {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['error' => 'Not authorized']);
        return;
    }

    $userId = $_SESSION['user_id'];
    try {
        $stmt = $pdo->prepare("SELECT id, email, name, phone, address FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($user) {
            echo json_encode($user);
        } else {
            echo json_encode(['error' => 'User not found']);
        }
    } catch (PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function updateUserData($pdo) {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['error' => 'Not authorized']);
        return;
    }

    $userId = $_SESSION['user_id'];
    $data = json_decode(file_get_contents('php://input'), true);
    $type = $data['type'] ?? '';

    try {
        switch ($type) {
            case 'personal':
                $name = $data['name'] ?? '';
                $phone = $data['phone'] ?? '';
                $stmt = $pdo->prepare("UPDATE users SET name = ?, phone = ? WHERE id = ?");
                $stmt->execute([$name, $phone, $userId]);
                break;
            case 'address':
                $address = $data['address'] ?? '';
                $stmt = $pdo->prepare("UPDATE users SET address = ? WHERE id = ?");
                $stmt->execute([$address, $userId]);
                break;
            case 'security':
                $currentPassword = $data['currentPassword'] ?? '';
                $newPassword = $data['newPassword'] ?? '';
                // Проверяем текущий пароль
                $stmt = $pdo->prepare("SELECT password FROM users WHERE id = ?");
                $stmt->execute([$userId]);
                $user = $stmt->fetch();
                if (!$user || !password_verify($currentPassword, $user['password'])) {
                    echo json_encode(['error' => 'Current password is incorrect']);
                    return;
                }
                $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
                $stmt = $pdo->prepare("UPDATE users SET password = ? WHERE id = ?");
                $stmt->execute([$hashedPassword, $userId]);
                break;
            default:
                echo json_encode(['error' => 'Invalid update type']);
                return;
        }
        echo json_encode(['success' => true]);
    } catch (PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function loginUser($pdo) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';

    if (empty($email) || empty($password)) {
        echo json_encode(['error' => 'Email and password are required']);
        return;
    }

    try {
        $stmt = $pdo->prepare("SELECT id, email, name, password, is_admin FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user || !password_verify($password, $user['password'])) {
            echo json_encode(['error' => 'Invalid email or password']);
            return;
        }

        // Устанавливаем сессию
        $_SESSION['user_id'] = $user['id'];
        
        // Обновляем время последнего входа
        $updateStmt = $pdo->prepare("UPDATE users SET last_login = NOW() WHERE id = ?");
        $updateStmt->execute([$user['id']]);

        // Возвращаем безопасные данные пользователя
        echo json_encode([
            'success' => true, 
            'user' => [
                'id' => $user['id'],
                'email' => $user['email'],
                'name' => $user['name'],
                'isAdmin' => (bool)$user['is_admin']
            ]
        ]);
    } catch (PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}

// Новая функция для регистрации пользователя
function registerUser($pdo) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';
    $name = $data['name'] ?? '';
    $phone = $data['phone'] ?? '';
    $address = $data['address'] ?? '';

    if (empty($email) || empty($password) || empty($name)) {
        echo json_encode(['error' => 'Email, password, and name are required']);
        return;
    }

    try {
        // Проверка существования email
        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        if ($stmt->fetch()) {
            echo json_encode(['error' => 'Email already registered']);
            return;
        }

        // Хеширование пароля
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        
        // Вставка нового пользователя
        $stmt = $pdo->prepare("
            INSERT INTO users (email, password, name, phone, address, created_at) 
            VALUES (?, ?, ?, ?, ?, NOW())
        ");
        $stmt->execute([$email, $hashedPassword, $name, $phone, $address]);
        $userId = $pdo->lastInsertId();

        // Устанавливаем сессию
        $_SESSION['user_id'] = $userId;

        echo json_encode(['success' => true, 'userId' => $userId]);
    } catch (PDOException $e) {
        // Обработка ошибки дубликата (хотя мы уже проверили выше)
        if ($e->getCode() == 23505) {
            echo json_encode(['error' => 'Email already registered']);
        } else {
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}
?>