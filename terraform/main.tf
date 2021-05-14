# Contains main description of bulk of terraform?
terraform {
  required_version = ">= 0.13.2"
}

provider "google" {
  version = "~> 3.0"
}

provider "kubernetes" {
  version = "~> 1.13.3"
  load_config_file = var.load_config_file
}

resource "kubernetes_secret" "ror-abzu-secrets" {
  metadata {
  name      = "${var.labels.team}-${var.labels.app}-secrets"
  namespace = var.kube_namespace
  }

  data = {
  "mapbox-tariff-zones-style" = var.ror-mapbox-tariff-zones-style
  "mapbox-access-token" = var.ror-mapbox-access-token
  "sentry-dsn" = var.ror-sentry-dsn
  "google-api-key" = var.ror-abzu-google-api-key
  }
}
