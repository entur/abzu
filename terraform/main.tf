# Contains main description of bulk of terraform?
terraform {
  required_version = ">= 0.12"
}

provider "google" {
  version = "~> 2.19"
}

provider "kubernetes" {
  load_config_file = var.load_config_file
}

resource "kubernetes_secret" "ror-abzu-secrets" {
  metadata {
  name      = "${var.labels.team}-${var.labels.app}-secrets"
  namespace = var.kube_namespace
  }

  data = {
  "mapbox-tariff-zones-style"     = var.ror-mapbox-tariff-zones-style
  "mapbox-access-token"     = var.ror-mapbox-access-token
  "sentry-dsn"     = var.ror-sentry-dsn
  }
}