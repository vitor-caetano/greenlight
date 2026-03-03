package data

import (
	"context"
	"database/sql"
	"time"
)

func RegisterOrgAndLead(db *sql.DB, org *Organization, user *PortalUser) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	tx, err := db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}

	defer tx.Rollback()

	orgQuery := `
		INSERT INTO organizations (name, primary_domain)
		VALUES ($1, $2)
		RETURNING id, status, member_limit, created_at, updated_at, version`

	err = tx.QueryRowContext(ctx, orgQuery, org.Name, org.PrimaryDomain).Scan(
		&org.ID,
		&org.Status,
		&org.MemberLimit,
		&org.CreatedAt,
		&org.UpdatedAt,
		&org.Version,
	)
	if err != nil {
		return err
	}

	userQuery := `
		INSERT INTO portal_users (organization_id, email, name, password_hash, role, activated)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id, status, created_at, updated_at, version`

	err = tx.QueryRowContext(ctx, userQuery,
		org.ID,
		user.Email,
		user.Name,
		user.Password.hash,
		user.Role,
		user.Activated,
	).Scan(
		&user.ID,
		&user.Status,
		&user.CreatedAt,
		&user.UpdatedAt,
		&user.Version,
	)
	if err != nil {
		switch {
		case err.Error() == `pq: duplicate key value violates unique constraint "portal_users_organization_id_email_key"`:
			return ErrDuplicateOrgEmail
		default:
			return err
		}
	}

	user.OrganizationID = org.ID

	return tx.Commit()
}
