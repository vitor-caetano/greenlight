#!/usr/bin/env nu

# Installs the Sealed Secrets controller via Helm
#
# Examples:
# > main apply sealed-secrets
def "main apply sealed-secrets" [
    --namespace = "kube-system",
    --controller-name = "sealed-secrets"
] {

    helm repo add sealed-secrets https://bitnami-labs.github.io/sealed-secrets

    helm repo update

    (
        helm upgrade --install $controller_name sealed-secrets/sealed-secrets
            --namespace $namespace --create-namespace --wait
    )

}

# Generates a SealedSecret from SMTP_USERNAME and SMTP_PASSWORD env vars
# and writes it to apps/sealed-secret.yaml, replacing apps/secret.yaml
#
# Requires: SMTP_USERNAME and SMTP_PASSWORD environment variables
#
# Examples:
# > main seal secrets
def "main seal secrets" [
    --namespace = "kube-system",
    --controller-name = "sealed-secrets"
] {

    let smtp_username = (
        if "SMTP_USERNAME" in $env { $env.SMTP_USERNAME }
        else { error make { msg: "SMTP_USERNAME environment variable is not set" } }
    )

    let smtp_password = (
        if "SMTP_PASSWORD" in $env { $env.SMTP_PASSWORD }
        else { error make { msg: "SMTP_PASSWORD environment variable is not set" } }
    )

    let sealed = (
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
        | kubeseal
            --format yaml
            --controller-namespace $namespace
            --controller-name $controller_name
    )

    $sealed | save apps/sealed-secret.yaml --force

    rm --force apps/secret.yaml

    kubectl apply --filename apps/sealed-secret.yaml

    print "Sealed secret saved to apps/sealed-secret.yaml and applied to the cluster."

}
