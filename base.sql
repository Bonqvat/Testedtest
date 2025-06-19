CREATE TABLE cars (
    id SERIAL PRIMARY KEY,
    brand VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    year INTEGER NOT NULL,
    price INTEGER NOT NULL,
    description TEXT,
    type VARCHAR(20),
    features JSONB,
    images JSONB,
    specs JSONB,
    body_type VARCHAR(20),
    drive VARCHAR(20),
    power INTEGER,
    status VARCHAR(20) DEFAULT 'Новый',
    is_recommended BOOLEAN DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
);

CREATE TABLE feedback (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);