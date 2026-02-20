#!/usr/bin/env nu

source scripts/common.nu
source scripts/kubernetes.nu
source scripts/crossplane.nu
source scripts/argocd.nu

def main [] {}

def "main setup" [] {

    rm --force .env

    main create kubernetes kind

    # main apply crossplane --provider none --app-config true --db-config true

    main apply argocd --apply-apps true

    kubectl create namespace a-team

    main print source

}

def "main destroy" [] {

    main destroy kubernetes kind

}
