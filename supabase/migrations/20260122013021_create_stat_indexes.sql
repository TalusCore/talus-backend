CREATE INDEX idx_stat_talus_id ON stats(talus_id);

CREATE INDEX idx_stat_talus_timestamp ON stats(talus_id, timestamp DESC);

CREATE INDEX idx_stat_talus_name_timestamp ON stats(talus_id, stat_name, timestamp DESC);
