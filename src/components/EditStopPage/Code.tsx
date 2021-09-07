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
import "../../styles/Code.css";

type CodeBadgeProps = {
  icon: React.ReactElement;
  type: string;
};

export const CodeBadge = ({ icon, type }: CodeBadgeProps) => {
  return (
    <div className={type}>
      <div style={{ marginTop: 2 }}>{icon}</div>
    </div>
  );
};

type CodeProps = {
  type: string;
  value?: null | string | number;
  defaultValue: string | number;
};

const Code = ({ type, value, defaultValue }: CodeProps) => {
  const valueIsSet = isSet(value);

  return (
    <div className={type}>
      {valueIsSet ? (
        <div style={{ marginTop: 2 }}>{value}</div>
      ) : (
        <div style={{ marginTop: 4, fontSize: 8 }}>{defaultValue}</div>
      )}
    </div>
  );
};

const isSet = (value?: null | string | number): boolean => {
  if (typeof value === "undefined" || value === null) {
    return false;
  }

  if (typeof value === "string") {
    return value.length > 0;
  }

  if (typeof value === "number") {
    return true;
  }
  return false;
};

export default Code;
