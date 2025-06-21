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
    case 'registerUser':
        registerUser($pdo);
        break;
    case 'addToCart':
        addToCart($pdo);
        break;
    case 'removeFromCart':
        removeFromCart($pdo);
        break;
    case 'getCart':
        getCart($pdo);
        break;
    case 'addToFavorites':
        addToFavorites($pdo);
        break;
    case 'removeFromFavorites':
        removeFromFavorites($pdo);
        break;
    case 'getFavorites':
        getFavorites($pdo);
        break;
    case 'placeOrder':
        placeOrder($pdo);
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
        foreach ($cars as &$car) {
            if (isset($car['bodytype'])) {
                $car['bodyType'] = $car['bodytype'];
                unset($car['bodytype']);
            }
            if (isset($car['createdat'])) {
                $car['createdAt'] = $car['createdat'];
                unset($car['createdat']);
            }
        }
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

        $_SESSION['user_id'] = $user['id'];
        
        $updateStmt = $pdo->prepare("UPDATE users SET last_login = NOW() WHERE id = ?");
        $updateStmt->execute([$user['id']]);

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
        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        if ($stmt->fetch()) {
            echo json_encode(['error' => 'Email already registered']);
            return;
        }

        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        
        $stmt = $pdo->prepare("
            INSERT INTO users (email, password, name, phone, address, created_at) 
            VALUES (?, ?, ?, ?, ?, NOW())
        ");
        $stmt->execute([$email, $hashedPassword, $name, $phone, $address]);
        $userId = $pdo->lastInsertId();

        $_SESSION['user_id'] = $userId;

        echo json_encode(['success' => true, 'userId' => $userId]);
    } catch (PDOException $e) {
        if ($e->getCode() == 23505) {
            echo json_encode(['error' => 'Email already registered']);
        } else {
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}

function addToCart($pdo) {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['error' => 'Not authorized']);
        return;
    }

    $data = json_decode(file_get_contents('php://input'), true);
    $carId = $data['carId'] ?? null;

    if (!$carId) {
        echo json_encode(['error' => 'Car ID required']);
        return;
    }

    $userId = $_SESSION['user_id'];

    try {
        $stmt = $pdo->prepare("SELECT id FROM cart WHERE user_id = ? AND car_id = ?");
        $stmt->execute([$userId, $carId]);
        if ($stmt->fetch()) {
            echo json_encode(['success' => true, 'message' => 'Already in cart']);
            return;
        }

        $stmt = $pdo->prepare("INSERT INTO cart (user_id, car_id) VALUES (?, ?)");
        $stmt->execute([$userId, $carId]);
        echo json_encode(['success' => true]);
    } catch (PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function removeFromCart($pdo) {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['error' => 'Not authorized']);
        return;
    }

    $data = json_decode(file_get_contents('php://input'), true);
    $carId = $data['carId'] ?? null;

    if (!$carId) {
        echo json_encode(['error' => 'Car ID required']);
        return;
    }

    $userId = $_SESSION['user_id'];

    try {
        $stmt = $pdo->prepare("DELETE FROM cart WHERE user_id = ? AND car_id = ?");
        $stmt->execute([$userId, $carId]);
        $count = $stmt->rowCount();
        if ($count > 0) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['error' => 'Item not found in cart']);
        }
    } catch (PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function getCart($pdo) {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['error' => 'Not authorized']);
        return;
    }

    $userId = $_SESSION['user_id'];

    try {
        $stmt = $pdo->prepare("
            SELECT c.id, c.brand, c.model, c.year, c.price, c.images 
            FROM cart 
            JOIN cars c ON cart.car_id = c.id 
            WHERE cart.user_id = ?
        ");
        $stmt->execute([$userId]);
        $cartItems = $stmt->fetchAll(PDO::FETCH_ASSOC);
        foreach ($cartItems as &$item) {
            if (isset($item['images'])) {
                $item['images'] = json_decode($item['images'], true);
            }
        }
        echo json_encode($cartItems);
    } catch (PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function addToFavorites($pdo) {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['error' => 'Not authorized']);
        return;
    }

    $data = json_decode(file_get_contents('php://input'), true);
    $carId = $data['carId'] ?? null;

    if (!$carId) {
        echo json_encode(['error' => 'Car ID required']);
        return;
    }

    $userId = $_SESSION['user_id'];

    try {
        $stmt = $pdo->prepare("SELECT id FROM favorites WHERE user_id = ? AND car_id = ?");
        $stmt->execute([$userId, $carId]);
        if ($stmt->fetch()) {
            echo json_encode(['success' => true, 'message' => 'Already in favorites']);
            return;
        }

        $stmt = $pdo->prepare("INSERT INTO favorites (user_id, car_id) VALUES (?, ?)");
        $stmt->execute([$userId, $carId]);
        echo json_encode(['success' => true]);
    } catch (PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function removeFromFavorites($pdo) {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['error' => 'Not authorized']);
        return;
    }

    $data = json_decode(file_get_contents('php://input'), true);
    $carId = $data['carId'] ?? null;

    if (!$carId) {
        echo json_encode(['error' => 'Car ID required']);
        return;
    }

    $userId = $_SESSION['user_id'];

    try {
        $stmt = $pdo->prepare("DELETE FROM favorites WHERE user_id = ? AND car_id = ?");
        $stmt->execute([$userId, $carId]);
        $count = $stmt->rowCount();
        if ($count > 0) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['error' => 'Item not found in favorites']);
        }
    } catch (PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function getFavorites($pdo) {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['error' => 'Not authorized']);
        return;
    }

    $userId = $_SESSION['user_id'];

    try {
        $stmt = $pdo->prepare("
            SELECT c.id, c.brand, c.model, c.year, c.price, c.images 
            FROM favorites 
            JOIN cars c ON favorites.car_id = c.id 
            WHERE favorites.user_id = ?
        ");
        $stmt->execute([$userId]);
        $favItems = $stmt->fetchAll(PDO::FETCH_ASSOC);
        foreach ($favItems as &$item) {
            if (isset($item['images'])) {
                $item['images'] = json_decode($item['images'], true);
            }
        }
        echo json_encode($favItems);
    } catch (PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function placeOrder($pdo) {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['error' => 'Not authorized']);
        return;
    }

    $data = json_decode(file_get_contents('php://input'), true);
    $userId = $_SESSION['user_id'];
    
    if (empty($data['carId']) || empty($data['dealer']) || empty($data['totalPrice'])) {
        echo json_encode(['error' => 'Missing required data']);
        return;
    }

    try {
        $carStmt = $pdo->prepare("
            SELECT id, brand, model, year, price 
            FROM cars WHERE id = ?
        ");
        $carStmt->execute([$data['carId']]);
        $car = $carStmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$car) {
            echo json_encode(['error' => 'Car not found']);
            return;
        }

        $stmt = $pdo->prepare("
            INSERT INTO orders (
                user_id, car_id, car_brand, car_model, car_year, car_price,
                services, options, dealer, total_price, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
            RETURNING id
        ");
        
        $services = $data['services'] ?? [];
        $options = $data['options'] ?? [];
        
        $stmt->execute([
            $userId,
            $car['id'],
            $car['brand'],
            $car['model'],
            $car['year'],
            $car['price'],
            json_encode($services),
            json_encode($options),
            $data['dealer'],
            $data['totalPrice']
        ]);
        
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        $orderId = $result['id'] ?? null;
        
        echo json_encode(['success' => true, 'orderId' => $orderId]);
    } catch (PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}