ALTER TABLE user_profiles
  ADD COLUMN IF NOT EXISTS foto_perfil LONGTEXT NULL,
  ADD COLUMN IF NOT EXISTS decoracao_foto_id INT NULL;

ALTER TABLE inventario
  MODIFY COLUMN tipo ENUM('visual', 'decoracao', 'utilizavel')
  NOT NULL DEFAULT 'utilizavel';

UPDATE inventario
SET tipo = 'decoracao'
WHERE tipo = 'visual';

UPDATE inventario
SET
  nome = CONCAT('Decoração de Perfil #', id),
  descricao = 'Decoração aplicada sobre a foto de perfil.',
  meta = JSON_OBJECT('decorationType', 'overlay-estelar')
WHERE tipo = 'decoracao' AND meta IS NULL;

ALTER TABLE inventario
  MODIFY COLUMN tipo ENUM('decoracao', 'utilizavel')
  NOT NULL DEFAULT 'utilizavel';
