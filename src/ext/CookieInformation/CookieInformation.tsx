import { Helmet } from "react-helmet";
import { useIntl } from "react-intl";

export const CookieInformation = () => {
  const { locale } = useIntl();

  return (
    <Helmet>
      <script
        data-culture={locale.toUpperCase()}
        id="CookieConsent"
        src={"https://policy.app.cookieinformation.com/uc.js"}
        type="text/javascript"
      />
    </Helmet>
  );
};
