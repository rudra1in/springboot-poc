-- V3: Sports table
-- Flyway migration — GameX platform

CREATE TABLE IF NOT EXISTS sports (
    id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    name             VARCHAR(100) NOT NULL UNIQUE,
    sport_type       VARCHAR(50),
    status           VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE',
    description      TEXT,
    players_per_team INT,
    referees_per_match INT,
    scorers_per_match  INT,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sports_status ON sports(status);
CREATE INDEX IF NOT EXISTS idx_sports_name   ON sports(LOWER(name));

COMMENT ON TABLE  sports                   IS 'Registered sports / game formats on the GameX platform';
COMMENT ON COLUMN sports.sport_type        IS 'TEAM | INDIVIDUAL | ESPORT';
COMMENT ON COLUMN sports.status            IS 'ACTIVE | INACTIVE';
COMMENT ON COLUMN sports.players_per_team  IS 'Including starters and bench';
