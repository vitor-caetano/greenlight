#!/usr/bin/env nu

# Installs the Traefik ingress controller using Helm
#
# Examples:
# > main apply traefik
# > main apply traefik --namespace traefik --release-name traefik
def "main apply traefik" [
    --namespace = "traefik",     # Namespace to install Traefik into
    --release-name = "traefik"   # Helm release name
] {

    print $"\nInstalling (ansi green_bold)Traefik(ansi reset) ingress controller...\n"

    helm repo add traefik https://helm.traefik.io/traefik

    helm repo update

    (
        helm upgrade --install $release_name traefik/traefik
            --namespace $namespace --create-namespace
            --set "ports.web.hostPort=80"
            --set "ports.websecure.hostPort=443"
            --set "service.type=ClusterIP"
            --set "tolerations[0].key=node-role.kubernetes.io/control-plane"
            --set "tolerations[0].operator=Equal"
            --set "tolerations[0].effect=NoSchedule"
            --set-string "nodeSelector.ingress-ready=true"
            --wait
    )

    print $"\n(ansi green_bold)Traefik(ansi reset) installed successfully in namespace (ansi yellow_bold)($namespace)(ansi reset).\n"

}
