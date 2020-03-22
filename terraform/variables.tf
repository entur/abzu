#Enviroment variables
variable "gcp_project" {
    description = "The GCP project id"
}

variable "kube_namespace" {
  description = "The Kubernetes namespace"
}

variable "labels" {
  description = "Labels used in all resources"
  type        = map(string)
     default = {
       manager = "terraform"
       team    = "ror"
       slack   = "talk-ror"
       app     = "abzu"
     }
}

variable ror_mapbox_tariff_zones_style {
  description = "Mapbox tariffzone styles"
}

variable ror_mapbox_access_token {
  description = "Mapbox access token"
}

variable ror_sentry_dsn {
  description = "Sentry DSN"
}

