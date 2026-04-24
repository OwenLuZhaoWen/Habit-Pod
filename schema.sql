DROP TABLE IF EXISTS scanned_items;

CREATE TABLE scanned_items (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    calories INTEGER,
    health_score INTEGER,
    description TEXT,
    image_b64 TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
