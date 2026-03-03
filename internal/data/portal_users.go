package data

import (
	"database/sql"
	"errors"
	"time"

	"greenlight.alexedwards.net/internal/validator"
)

var ErrDuplicateOrgEmail = errors.New("duplicate organization email")

type PortalUser struct {
	ID             string    `json:"id"`
	OrganizationID string    `json:"organization_id"`
	Email          string    `json:"email"`
	Name           string    `json:"name"`
	Password       password  `json:"-"`
	Role           string    `json:"role"`
	Status         string    `json:"status"`
	Activated      bool      `json:"activated"`
	LastLoginAt    *time.Time `json:"last_login_at,omitempty"`
	InactivatedAt  *time.Time `json:"inactivated_at,omitempty"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
	Version        int       `json:"version"`
}

type PortalUserModel struct {
	DB *sql.DB
}

func ValidatePortalUser(v *validator.Validator, user *PortalUser) {
	v.Check(user.Name != "", "name", "must be provided")
	v.Check(len(user.Name) <= 500, "name", "must not be more than 500 bytes long")

	ValidateEmail(v, user.Email)

	if user.Password.plaintext != nil {
		ValidatePasswordPlaintext(v, *user.Password.plaintext)
	}

	if user.Password.hash == nil {
		panic("missing password hash for portal user")
	}
}
