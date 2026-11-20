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

/**
 * `handleMutation` (TiamatActions.js) resolves with nothing when Tiamat
 * answers with GraphQL errors (HTTP 200); only network errors reject. So an
 * empty result is a refusal too: this turns it into a rejection with
 * `failure`, for `.then(requireMutationResult(failure))`.
 */
export const requireMutationResult =
  (failure: unknown) =>
  <Result>(result: Result): NonNullable<Result> => {
    if (!result) throw failure;
    return result as NonNullable<Result>;
  };
