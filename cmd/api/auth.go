package main

import (
	"errors"
	"net/http"
	"strings"

	"greenlight.alexedwards.net/internal/data"
	"greenlight.alexedwards.net/internal/validator"
)

func (app *application) registerOrgHandler(w http.ResponseWriter, r *http.Request) {
	var input struct {
		OrganizationName string `json:"organization_name"`
		Name             string `json:"name"`
		Email            string `json:"email"`
		Password         string `json:"password"`
	}

	err := app.readJSON(w, r, &input)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	domain := extractEmailDomain(input.Email)

	blocked, err := app.models.BlockedDomains.Exists(domain)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	if blocked {
		v := validator.New()
		v.AddError("email", "email domain is not allowed for registration")
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	org := &data.Organization{
		Name:          input.OrganizationName,
		PrimaryDomain: domain,
	}

	user := &data.PortalUser{
		Email:     input.Email,
		Name:      input.Name,
		Role:      "ORG_LEAD",
		Activated: false,
	}

	err = user.Password.Set(input.Password)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	v := validator.New()

	data.ValidateOrganization(v, org)
	data.ValidatePortalUser(v, user)

	if !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	err = data.RegisterOrgAndLead(app.models.DB, org, user)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrDuplicateOrgEmail):
			v.AddError("email", "a user with this email address already exists in this organization")
			app.failedValidationResponse(w, r, v.Errors)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	err = app.writeJSON(w, http.StatusCreated, envelope{"organization": org, "user": user}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func extractEmailDomain(email string) string {
	parts := strings.SplitN(email, "@", 2)
	if len(parts) != 2 {
		return ""
	}
	return strings.ToLower(parts[1])
}
