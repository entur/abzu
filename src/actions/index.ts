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

import StopPlaceActions from "./StopPlaceActions";
import UserActions from "./UserActions";
import AssessmentActions from "./AssessmentActions";
import EquipmentActions from "./EquipmentActions";
import StopPlacesGroupActions from "./StopPlacesGroupActions";
import { getOperationAST } from "graphql";

export {
  StopPlaceActions,
  UserActions,
  AssessmentActions,
  EquipmentActions,
  StopPlacesGroupActions,
};

export const createThunk = (type: string, payload: any) => ({
  type,
  payload,
});

export type ApolloQueryResult = {
  type: string;
  result: any;
  operationName?: string;
  variables: any;
};

export const createApolloThunk = (
  type: string,
  result: any,
  doc: any,
  variables: Record<string, any>,
): ApolloQueryResult => ({
  type,
  result,
  operationName: doc ? getOperationAST(doc)?.name?.value : undefined,
  variables,
});

export const createApolloErrorThunk = (
  type: string,
  error: any,
  doc: any,
  variables: Record<string, any>,
) => ({
  type,
  error,
  operationName: doc ? getOperationAST(doc)?.name?.value : undefined,
  variables,
});
