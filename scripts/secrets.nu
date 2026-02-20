#!/usr/bin/env nu

# Creates a Kubernetes Secret from SMTP_USERNAME and SMTP_PASSWORD env vars,
# writes it to secret.yaml at the project root (gitignored), and applies it.
#
# Requires: SMTP_USERNAME and SMTP_PASSWORD environment variables
#
# Examples:
# > main create secret
def "main create secret" [] {

    let smtp_username = (
        if "SMTP_USERNAME" in $env { $env.SMTP_USERNAME }
        else { error make { msg: "SMTP_USERNAME environment variable is not set" } }
    )

    let smtp_password = (
        if "SMTP_PASSWORD" in $env { $env.SMTP_PASSWORD }
        else { error make { msg: "SMTP_PASSWORD environment variable is not set" } }
    )

    {
        apiVersion: "v1"
        kind: "Secret"
        metadata: {
            name: "greenlight-secret"
            namespace: "greenlight"
        }
        type: "Opaque"
        stringData: {
            smtp-username: $smtp_username
            smtp-password: $smtp_password
        }
    }
    | to yaml
    | save secret.yaml --force

    kubectl apply --filename secret.yaml

    print "Secret applied to cluster (secret.yaml is gitignored)."

}
