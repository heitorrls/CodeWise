CREATE TABLE IF NOT EXISTS activity_progress (
  user_id INT NOT NULL,
  module_key VARCHAR(100) NOT NULL,
  completed_activities INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, module_key),
  CONSTRAINT fk_activity_progress_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
