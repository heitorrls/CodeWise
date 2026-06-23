CREATE TABLE IF NOT EXISTS economy_events (
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  event_type VARCHAR(50) NOT NULL,
  event_key VARCHAR(190) NOT NULL,
  coins_delta INT NOT NULL,
  correct_answers INT DEFAULT NULL,
  total_questions INT DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY economy_event_once (user_id, event_type, event_key),
  CONSTRAINT fk_economy_events_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
