CREATE TABLE bugs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    priority VARCHAR(20),
    status VARCHAR(20) DEFAULT 'Open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample Query
SELECT * FROM bugs WHERE status = 'Open' ORDER BY priority DESC;