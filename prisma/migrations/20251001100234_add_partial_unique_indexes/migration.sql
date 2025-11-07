-- case-insensitive unique email for active users
CREATE UNIQUE INDEX users_email_unique_not_deleted ON "user"(LOWER(email)) WHERE deleted_at IS NULL AND email IS NOT NULL;

-- unique contact number for active users
CREATE UNIQUE INDEX users_contact_number_unique_not_deleted ON "user"(contact_number) WHERE deleted_at IS NULL AND contact_number IS NOT NULL;