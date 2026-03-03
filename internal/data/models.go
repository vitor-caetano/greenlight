package data

import (
	"database/sql"
	"errors"
)

var (
	ErrRecordNotFound = errors.New("record not found")
	ErrEditConflict   = errors.New("edit conflict")
)

type Models struct {
	DB             *sql.DB
	Movies         MovieModel
	Permissions    PermissionModel
	Tokens         TokenModel
	Users          UserModel
	Organizations  OrganizationModel
	BlockedDomains BlockedDomainModel
	PortalUsers    PortalUserModel
}

func NewModels(db *sql.DB) Models {
	return Models{
		DB:             db,
		Movies:         MovieModel{DB: db},
		Permissions:    PermissionModel{DB: db},
		Tokens:         TokenModel{DB: db},
		Users:          UserModel{DB: db},
		Organizations:  OrganizationModel{DB: db},
		BlockedDomains: BlockedDomainModel{DB: db},
		PortalUsers:    PortalUserModel{DB: db},
	}
}
