CREATE TABLE IF NOT EXISTS activity_answers (
  user_id INT NOT NULL,
  module_key VARCHAR(100) NOT NULL,
  lesson_index INT NOT NULL,
  question_index INT NOT NULL,
  selected_answer INT NOT NULL,
  is_correct TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, module_key, lesson_index, question_index),
  CONSTRAINT fk_activity_answers_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS activity_completions (
  user_id INT NOT NULL,
  module_key VARCHAR(100) NOT NULL,
  lesson_index INT NOT NULL,
  total_questions INT NOT NULL,
  correct_count INT NOT NULL,
  wrong_count INT NOT NULL,
  percentage INT NOT NULL,
  completed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, module_key, lesson_index),
  CONSTRAINT fk_activity_completions_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
