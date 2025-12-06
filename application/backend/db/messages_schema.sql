SET @constraint_exists = (
    SELECT COUNT(*)
    FROM information_schema.TABLE_CONSTRAINTS
    WHERE CONSTRAINT_SCHEMA = DATABASE()
      AND TABLE_NAME = 'in_site_message'
      AND CONSTRAINT_NAME = 'unique_sender_recipient'
      AND CONSTRAINT_TYPE = 'UNIQUE'
);

SET @drop_constraint = IF(@constraint_exists > 0,
    'ALTER TABLE in_site_message DROP INDEX unique_sender_recipient',
    'SELECT "Constraint does not exist, skipping drop"'
);

PREPARE stmt FROM @drop_constraint;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

DELETE m1 FROM in_site_message m1
INNER JOIN in_site_message m2 
WHERE m1.sender_user_id = m2.sender_user_id
  AND m1.recipient_user_id = m2.recipient_user_id
  AND m1.message_id > m2.message_id;

ALTER TABLE in_site_message
ADD CONSTRAINT unique_sender_recipient UNIQUE (sender_user_id, recipient_user_id);

CREATE INDEX IF NOT EXISTS idx_message_sender ON in_site_message(sender_user_id);

CREATE INDEX IF NOT EXISTS idx_message_recipient ON in_site_message(recipient_user_id);

CREATE INDEX IF NOT EXISTS idx_message_created ON in_site_message(created_at);

CREATE INDEX IF NOT EXISTS idx_message_status ON in_site_message(message_status);

CREATE INDEX IF NOT EXISTS idx_message_user_date 
ON in_site_message(sender_user_id, recipient_user_id, created_at);

SELECT 
    CONSTRAINT_NAME,
    CONSTRAINT_TYPE,
    TABLE_NAME
FROM information_schema.TABLE_CONSTRAINTS
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'in_site_message'
  AND CONSTRAINT_NAME = 'unique_sender_recipient';

