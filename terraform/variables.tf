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

variable ror-mapbox-tariff-zones-style {
  description = "Mapbox tariffzone styles"
}

variable ror-mapbox-access-token {
  description = "Mapbox access token"
}

variable ror-sentry-dsn {
  description = "Sentry DSN"
}

