CREATE TABLE stats (
    stat_name TEXT NOT NULL,
    talus_id UUID NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL,
    value DOUBLE PRECISION NOT NULL,
    PRIMARY KEY (stat_name, talus_id, timestamp),
    CONSTRAINT fk_talus
        FOREIGN KEY (talus_id)
        REFERENCES talus(talus_id)
        ON DELETE CASCADE
);
