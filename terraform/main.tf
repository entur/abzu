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
  name      = "${var.labels.team}-${var.labels.app}-abzu-secrets"
  namespace = var.kube_namespace
  }

  data = {
  "mapbox_tariff_zones_style"     = var.ror_mapbox_tariff_zones_style
  "mapbox_access_token"     = var.ror_mapbox_access_token
  "sentry_dsn"     = var.ror_sentry_dsn
  }
}