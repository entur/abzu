import type { Reducer } from "redux";
interface UserState {
  newStopCreated: {
    open: boolean;
    stopPlaceId: string;
  };
}

declare const initialState: UserState;

export { initialState };

declare const userReducer: Reducer<UserState, AnyAction>;

export default userReducer;
