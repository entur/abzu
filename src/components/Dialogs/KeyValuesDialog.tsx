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

import Add from "@mui/icons-material/Add";
import MdRemove from "@mui/icons-material/Delete";
import MdEdit from "@mui/icons-material/ModeEdit";
import Fab from "@mui/material/Fab";
import { UnknownAction } from "@reduxjs/toolkit";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { StopPlaceActions, UserActions } from "../../actions/";
import { useConfig } from "../../config/ConfigContext";
import { getPrimaryColor } from "../../config/themeConfig";
import { KeyValues } from "../../models/KeyValues";
import {
  selectKeyValuesDataSource,
  selectMandatoryKeyValuesDataSource,
} from "../../reducers/selectors";
import CreateKeyValuePair from "../EditStopPage/CreateKeyValuePair";
import EditKeyValuePair from "../EditStopPage/EditKeyValuePair";
import DialogHeader from "./DialogHeader";

type KeyValuesDialogProps = {
  disabled: boolean;
};

const KeyValuesDialog = ({ disabled }: KeyValuesDialogProps) => {
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();
  const open = useSelector((state: any) => state.user.keyValuesDialogOpen);
  const keyValues: KeyValues[] = useSelector((state: any) =>
    selectKeyValuesDataSource(
      state.user.keyValuesOrigin,
      state.stopPlace.current,
    ),
  );
  const keyValuesOrigin = useSelector(
    (state: any) => state.user.keyValuesOrigin?.type,
  );
  disabled = false;

  const { mandatoryKeyValuesSet } = useConfig();

  const mandatoryKeys: string[] = useSelector((state: any) =>
    selectMandatoryKeyValuesDataSource(
      state.user.keyValuesOrigin,
      state.stopPlace.current,
      mandatoryKeyValuesSet,
    ),
  );

  // Because some of the mandatory keys may already be in use in keyValues and have a value there:
  const mandatoryKeyValues: KeyValues[] = mandatoryKeys
    ? mandatoryKeys.map((mandatoryKey) => {
        const existingKeyValues = keyValues.find(
          (kv) => kv.key === mandatoryKey,
        );
        if (!existingKeyValues) {
          return {
            key: mandatoryKey,
            values: null,
          };
        } else {
          return existingKeyValues;
        }
      })
    : [];
  const nonMandatoryKeyValues = mandatoryKeys
    ? keyValues?.filter((kv) => !mandatoryKeys.find((mk) => mk === kv.key))
    : keyValues;

  // This is meant to group mandatory keys together and show them in the beginning of the key values list:
  const keyValuesCompleteSet: KeyValues[] = [
    ...mandatoryKeyValues,
    ...nonMandatoryKeyValues,
  ];

  const [isEditingOpen, setIsEditingOpen] = useState<boolean>(false);
  const [isCreatingOpen, setIsCreatingOpen] = useState<boolean>(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);

  const translations = {
    value: formatMessage({ id: "name" }),
    keyValuesTitle: formatMessage({ id: "key_values_hint" }),
    noKeyValues: formatMessage({ id: "key_values_no" }),
  };

  const handleEditValuesForKey = (key: string) => {
    setIsEditingOpen(true);
    setIsCreatingOpen(false);
    setEditingKey(key);
  };

  const handleDeleteKey = (key: string) => {
    dispatch(
      StopPlaceActions.deleteKeyValuesByKey(key) as unknown as UnknownAction,
    );
  };

  const handleUpdateValues = (key: string, values: string[]) => {
    setIsEditingOpen(false);

    if (!keyValues.find((kv) => kv.key === key)) {
      dispatch(
        StopPlaceActions.createKeyValuesPair(
          key,
          values,
        ) as unknown as UnknownAction,
      );
    }

    dispatch(
      StopPlaceActions.updateKeyValuesForKey(
        key,
        values,
      ) as unknown as UnknownAction,
    );
  };

  const handleCreateValues = (key: string, values: string[]) => {
    setIsCreatingOpen(false);
    dispatch(
      StopPlaceActions.createKeyValuesPair(
        key,
        values,
      ) as unknown as UnknownAction,
    );
  };

  const handleOpenCreateValues = () => {
    setIsEditingOpen(false);
    setIsCreatingOpen(true);
  };

  const handleClose = () => {
    dispatch(UserActions.closeKeyValuesDialog() as unknown as UnknownAction);
    setIsEditingOpen(false);
    setIsCreatingOpen(false);
  };

  const style: React.CSSProperties = {
    position: "fixed",
    left: 400,
    top: 105,
    background: "#fff",
    border: "1px solid black",
    width: "auto",
    minWidth: 350,
    zIndex: 999,
  };

  const itemStyle: React.CSSProperties = {
    flexBasis: "100%",
    textAlign: "left",
    flex: 2,
    padding: 5,
  };

  if (!open) return null;

  return (
    <div style={style}>
      <DialogHeader
        title={translations.keyValuesTitle}
        handleClose={handleClose}
      />
      <div
        style={{
          fontSize: 14,
          maxHeight: 300,
          overflowY: "auto",
          marginLeft: 15,
          marginBottom: 5,
        }}
      >
        {!keyValuesCompleteSet.length ? (
          <div
            style={{
              width: "100%",
              textAlign: "center",
              marginBottom: 10,
              fontSize: 12,
            }}
          >
            {translations.noKeyValues}
          </div>
        ) : (
          <div
            style={{
              fontSize: 12,
              overflowY: "overlay",
              marginLeft: 5,
            }}
          >
            {keyValuesCompleteSet.map((kvp, i) => (
              <div
                key={"key-value-" + i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  lineHeight: 1.2,
                }}
              >
                <div style={{ ...itemStyle, fontWeight: 600, flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      flexBasis: "100%",
                    }}
                  >
                    <span>{kvp.key}</span>
                    {!disabled && (
                      <div style={{ display: "flex" }}>
                        <MdEdit
                          style={{
                            height: 16,
                            width: 16,
                            color: getPrimaryColor(),
                            marginTop: -2,
                            marginLeft: 5,
                            cursor: "pointer",
                          }}
                          onClick={() => handleEditValuesForKey(kvp.key)}
                        />
                        {!mandatoryKeys?.includes(kvp.key) && (
                          <MdRemove
                            style={{
                              height: 16,
                              width: 16,
                              color: "#df544a",
                              marginTop: -2,
                              marginLeft: 5,
                              cursor: "pointer",
                            }}
                            onClick={() => handleDeleteKey(kvp.key)}
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div style={itemStyle}>
                  {kvp.values?.map((v, i) => (
                    <p key={"value-" + i}>{v}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {!disabled && (
        <Fab
          onClick={handleOpenCreateValues}
          style={{
            marginLeft: 20,
            marginBottom: 10,
            height: 10,
            width: 40,
            backgroundColor: getPrimaryColor(),
          }}
        >
          <Add />
        </Fab>
      )}
      <EditKeyValuePair
        isOpen={isEditingOpen}
        editingKey={editingKey}
        keyValues={keyValues}
        handleUpdateValues={handleUpdateValues}
      />
      <CreateKeyValuePair
        isOpen={isCreatingOpen}
        keyValues={keyValues}
        handleCreateValues={handleCreateValues}
      />
    </div>
  );
};

export default KeyValuesDialog;
