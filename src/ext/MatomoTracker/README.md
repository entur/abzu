# Matomo Analytics

Matomo Analytics is a web analytics tool. More info: https://matomo.org/

## Enabling the feature

Once enabled in bootstrap.json with:

    "featureFlags": {
        "MatomoTracker": true
    }

As well as tracker configuration provided in bootstrap.json with:

    "matomo": {
        "src": "<url with Matomo script>",
    }

MatomoTracker feature can be wired in as:

    <ComponentToggle
        feature="MatomoTracker"
    />

## Cookie consent management

Cookie consent can be managed, for example, by using the CookieInformation feature.
