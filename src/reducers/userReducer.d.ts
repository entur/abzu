import type { Reducer } from "redux";
interface UserState {
  newStopCreated: {
    open: boolean;
    stopPlaceId: string;
  };
  auth: any;
  uiMode?: "legacy" | "modern";
}

declare const initialState: UserState;

export { initialState };

declare const userReducer: Reducer<UserState, AnyAction>;

export default userReducer;
