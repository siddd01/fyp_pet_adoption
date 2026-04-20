ALTER TABLE adoption_applications
ADD CONSTRAINT unique_adoption_user_pet UNIQUE (user_id, pet_id);
