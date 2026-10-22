import type { Reducer } from "redux";
interface UserState {
  newStopCreated: {
    open: boolean;
    stopPlaceId: string;
  };
  auth: any;
  /** null until the user picks a UI with the switch. */
  uiMode?: "legacy" | "modern" | null;
  membershipDisplay?: string;
  elementStatusDisplay?: string;
}

declare const initialState: UserState;

export { initialState };

declare const userReducer: Reducer<UserState, AnyAction>;

export default userReducer;
