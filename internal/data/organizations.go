package data

import (
	"database/sql"
	"time"

	"greenlight.alexedwards.net/internal/validator"
)

type Organization struct {
	ID            string    `json:"id"`
	Name          string    `json:"name"`
	PrimaryDomain string    `json:"primary_domain"`
	Status        string    `json:"status"`
	MemberLimit   int       `json:"member_limit"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
	Version       int       `json:"version"`
}

type OrganizationModel struct {
	DB *sql.DB
}

func ValidateOrganization(v *validator.Validator, org *Organization) {
	v.Check(org.Name != "", "organization_name", "must be provided")
	v.Check(len(org.Name) <= 500, "organization_name", "must not be more than 500 bytes long")
}
