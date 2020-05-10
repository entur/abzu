/*
 *  Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
the European Commission - subsequent versions of the EUPL (the "Licence");
You may not use this work except in compliance with the Licence.
You may obtain a copy of the Licence at:

  https://joinup.ec.europa.eu/software/page/eupl

Unless required by applicable law or agreed to in writing, software
distributed under the Licence is distributed on an "AS IS" basis,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the Licence for the specific language governing permissions and
limitations under the Licence. */

import React from "react";
import { connect } from "react-redux";
import { IntlProvider } from "react-intl";
import { UserActions } from "../actions/";
import configureLocalization from "../localization/localization";
import RouterContainer from "./RouterContainer";
import axios from "axios";

class Root extends React.Component {
  componentDidMount() {
    const { dispatch, appliedLocale } = this.props;

    configureLocalization(appliedLocale).then((localization) => {
      dispatch(UserActions.changeLocalization(localization));
    });

    setTimeout(() => {
      const timeBeforeRequest = new Date().getTime();
      axios
        .post(window.config.endpointBase + "timeOffset", {
          clientTime: timeBeforeRequest,
        })
        .then((response) => {
          const resolvedTime = new Date().getTime();
          const serverClientOffset = response.data.offset;
          const timeSpentOnRequest = resolvedTime - timeBeforeRequest;
          const diff = (serverClientOffset - timeSpentOnRequest) / 2;
          dispatch(UserActions.setServerDiffTime(diff));
        });
    }, 5000);
  }

  render() {
    const { history, path } = this.props;
    const { localization } = this.props;

    if (localization.locale == null) return null;

    return (
      <IntlProvider
        locale={localization.locale}
        messages={localization.messages}
      >
        <RouterContainer path={path} history={history} />
      </IntlProvider>
    );
  }
}

const mapStateToProps = (state) => ({
  localization: state.user.localization,
  appliedLocale: state.user.appliedLocale,
});

export default connect(mapStateToProps)(Root);
