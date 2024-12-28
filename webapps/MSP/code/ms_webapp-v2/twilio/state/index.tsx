import React, { createContext, useContext, useReducer, useState } from "react";
import { RecordingRules, RoomType } from "../types";
import { TwilioError } from "twilio-video";
import {
  settingsReducer,
  initialSettings,
  Settings,
  SettingsAction,
} from "./settings/settingsReducer";
import useActiveSinkId from "./useActiveSinkId";
import meetService from "../../services/meet-service";

export interface StateContextType {
  error: TwilioError | Error | null;
  setError(error: TwilioError | Error | null): void;
  getToken(channelRef: string): Promise<{ token: string }>;
  user?: { displayName: undefined; photoURL: undefined; passcode?: string };
  signIn?(passcode?: string): Promise<void>;
  signOut?(): Promise<void>;
  isAuthReady?: boolean;
  isFetching: boolean;
  activeSinkId: string;
  setActiveSinkId(sinkId: string): void;
  settings: Settings;
  dispatchSetting: React.Dispatch<SettingsAction>;
  roomType?: RoomType;
  updateRecordingRules(room_sid: string, rules: RecordingRules): Promise<any>;
}

export const StateContext = createContext<StateContextType>(null!);

/*
  The 'react-hooks/rules-of-hooks' linting rules prevent React Hooks from being called
  inside of if() statements. This is because hooks must always be called in the same order
  every time a component is rendered. The 'react-hooks/rules-of-hooks' rule is disabled below
  because the "if (process.env.REACT_APP_SET_AUTH === 'firebase')" statements are evaluated
  at build time (not runtime). If the statement evaluates to false, then the code is not
  included in the bundle that is produced (due to tree-shaking). Thus, in this instance, it
  is ok to call hooks inside if() statements.
*/
export default function TwilioStateProvider(
  props: React.PropsWithChildren<any>
) {
  const [error, setError] = useState<TwilioError | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [activeSinkId, setActiveSinkId] = useActiveSinkId();
  const [settings, dispatchSetting] = useReducer(
    settingsReducer,
    initialSettings
  );
  const [roomType, setRoomType] = useState<RoomType>();

  let contextValue = {
    error,
    setError,
    isFetching,
    activeSinkId,
    setActiveSinkId,
    settings,
    dispatchSetting,
    roomType,
  } as StateContextType;

  contextValue = {
    ...contextValue,
    getToken: async (roomRef) => {
      return meetService
        .fetchToken(roomRef)
        .then((res) => ({ token: res.data.result }));
    },
    updateRecordingRules: async (room_sid, rules) => {
      return (
        meetService
          // TODO: Use real data
          .record({ passcode: "00597489045634", room_sid, rules })
          .then(async (res) => {
            if (!res?.data?.ok) {
              const recordingError = new Error(
                res?.data.error?.message ||
                  "There was an error updating recording rules"
              );
              recordingError.code = res?.data?.error?.code as undefined;
              return Promise.reject(recordingError);
            }

            return res;
          })
          .catch((err) => setError(err))
      );
    },
  };

  const getToken: StateContextType["getToken"] = (roomRef) => {
    setIsFetching(true);
    return contextValue
      .getToken(roomRef)
      .then((res) => {
        setIsFetching(false);
        return res;
      })
      .catch((err) => {
        setError(err);
        setIsFetching(false);
        return Promise.reject(err);
      });
  };

  const updateRecordingRules: StateContextType["updateRecordingRules"] = (
    room_sid,
    rules
  ) => {
    setIsFetching(true);
    return contextValue
      .updateRecordingRules(room_sid, rules)
      .then((res) => {
        setIsFetching(false);
        return res;
      })
      .catch((err) => {
        setError(err);
        setIsFetching(false);
        return Promise.reject(err);
      });
  };

  return (
    <StateContext.Provider
      value={{ ...contextValue, getToken, updateRecordingRules }}
    >
      {props.children}
    </StateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error("useAppState must be used within the TwilioStateProvider");
  }
  return context;
}
