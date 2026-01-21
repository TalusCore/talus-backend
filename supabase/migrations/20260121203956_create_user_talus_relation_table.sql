CREATE TABLE user_talus_relation (
    talus_id UUID NOT NULL,
    user_id UUID NOT NULL,
    pairing_date TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (talus_id, user_id),
    CONSTRAINT fk_talus
        FOREIGN KEY (talus_id)
        REFERENCES talus(talus_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);
