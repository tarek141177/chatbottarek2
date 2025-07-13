-- Create a default user for the application since authentication pages are removed.
-- This user will own all chat agents and API configurations.
INSERT INTO "User" (id, name, email, "createdAt", "updatedAt")
VALUES ('00000000-0000-0000-0000-000000000001', 'Default Admin', 'admin@example.com', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;
