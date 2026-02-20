#!/usr/bin/env nu

# Installs the CloudNative-PG operator using Helm
#
# Examples:
# > main apply cloudnative-pg
# > main apply cloudnative-pg --namespace cnpg-system --release-name cnpg
def "main apply cloudnative-pg" [
    --namespace = "cnpg-system",     # Namespace to install the operator into
    --release-name = "cnpg"          # Helm release name
] {

    print $"\nInstalling (ansi green_bold)CloudNative-PG(ansi reset) operator...\n"

    helm repo add cnpg https://cloudnative-pg.github.io/charts

    helm repo update

    (
        helm upgrade --install $release_name cnpg/cloudnative-pg
            --namespace $namespace --create-namespace
            --wait
    )

    print $"\n(ansi green_bold)CloudNative-PG(ansi reset) operator installed successfully in namespace (ansi yellow_bold)($namespace)(ansi reset).\n"

}
