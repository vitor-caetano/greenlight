package data

import (
	"context"
	"database/sql"
	"time"
)

type BlockedDomainModel struct {
	DB *sql.DB
}

func (m BlockedDomainModel) Exists(domain string) (bool, error) {
	query := `SELECT EXISTS(SELECT 1 FROM blocked_email_domains WHERE domain = $1)`

	var exists bool

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	err := m.DB.QueryRowContext(ctx, query, domain).Scan(&exists)
	if err != nil {
		return false, err
	}

	return exists, nil
}
