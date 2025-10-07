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

import {
  Close as CloseIcon,
  GroupWork as GroupIcon,
} from "@mui/icons-material";
import WheelChair from "@mui/icons-material/Accessible";
import {
  Box,
  Divider,
  IconButton,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";
import { useIntl } from "react-intl";
import { getPrimaryDarkerColor } from "../../../../config/themeConfig";
import { AccessibilityLimitationType } from "../../../../models/AccessibilityLimitation";
import { Entities } from "../../../../models/Entities";
import { getIn } from "../../../../utils/";
import Code from "../../../EditStopPage/Code";
import BelongsToGroup from "../../../MainPage/BelongsToGroup";
import CircularNumber from "../../../MainPage/CircularNumber";
import HasExpiredInfo from "../../../MainPage/HasExpiredInfo";
import ModalityIconImg from "../../../MainPage/ModalityIconImg";
import TagTray from "../../../MainPage/TagTray";
import ModalityTray from "../../../ReportPage/ModalityIconTray";
import { SearchResultDetailsProps } from "../types";
import { SearchBoxEdit } from "./SearchBoxEdit";
import { SearchBoxGeoWarning } from "./SearchBoxGeoWarning";
import { SearchBoxUsingTempGeo } from "./SearchBoxUsingTempGeo";
import { SimpleStopPlaceLink } from "./SimpleStopPlaceLink";

export const SearchResultDetails: React.FC<
  SearchResultDetailsProps & { onClose?: () => void }
> = ({
  result,
  canEdit,
  userSuppliedCoordinates,
  onEdit,
  onChangeCoordinates,
  onClose,
}) => {
  const theme = useTheme();
  const { formatMessage } = useIntl();
  const primaryDarker = getPrimaryDarkerColor();

  const text = {
    emptyDescription: formatMessage({ id: "empty_description" }),
    edit: formatMessage({ id: "edit" }),
    view: formatMessage({ id: "view" }),
  };

  const { entityType } = result;

  const hasWheelchairAccess =
    getIn(
      result,
      ["accessibilityAssessment", "limitations", "wheelchairAccess"],
      null,
    ) === AccessibilityLimitationType.TRUE;

  const renderStopPlaceInfo = () => {
    if (result.isParent) {
      return (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 1,
              pr: 5,
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {result.name}
            </Typography>
            <ModalityTray
              modalities={
                result.children?.map((child: any) => ({
                  submode: child.submode,
                  stopPlaceType: child.stopPlaceType,
                })) || []
              }
            />
          </Box>
          <HasExpiredInfo show={result.hasExpired} />
          <Box sx={{ display: "flex", flexDirection: "column", ml: 1 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {result.topographicPlace && result.parentTopographicPlace && (
                <Typography variant="body1">
                  {`${result.topographicPlace}, ${result.parentTopographicPlace}`}
                </Typography>
              )}
              <Typography variant="body2" color="text.secondary">
                {formatMessage({ id: "multimodal" })}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {result.id}
            </Typography>
          </Box>
          {result.belongsToGroup && (
            <Box sx={{ ml: 1 }}>
              <BelongsToGroup
                formatMessage={formatMessage}
                groups={(result.groups as any) || []}
                style={{}}
              />
            </Box>
          )}
          {result.importedId && result.importedId.length > 0 && (
            <Typography variant="caption" sx={{ ml: 1 }}>
              <strong>{formatMessage({ id: "local_reference" })}</strong>
              {result.importedId.join(", ")}
            </Typography>
          )}
          <TagTray tags={result.tags} style={{ marginLeft: 8 }} />
          <Box sx={{ display: "flex", justifyContent: "space-between", p: 1 }}>
            <Typography variant="body2" sx={{ textTransform: "capitalize" }}>
              {formatMessage({ id: "stop_places" })}
            </Typography>
            <CircularNumber
              number={result.children?.length || 0}
              color={primaryDarker}
            />
          </Box>
          <Box
            sx={{
              maxHeight: 150,
              overflow: "auto",
              width: "95%",
              mx: "auto",
              mb: 2,
            }}
          >
            {result.children?.map((childStopPlace: any, i: number) => (
              <Paper
                key={`child-${childStopPlace.id}`}
                variant="outlined"
                sx={{
                  p: 0.5,
                  mb: 0.5,
                  backgroundColor:
                    i % 2 ? theme.palette.grey[50] : "transparent",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "0.8rem",
                  }}
                >
                  <ModalityIconImg
                    type={childStopPlace.stopPlaceType}
                    submode={childStopPlace.submode}
                    svgStyle={{ transform: "scale(0.8)" }}
                    style={{ marginRight: 4 }}
                  />
                  <Typography variant="caption" sx={{ flexGrow: 1 }}>
                    {childStopPlace.name}
                  </Typography>
                  <SimpleStopPlaceLink id={childStopPlace.id} />
                </Box>
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  {formatMessage({ id: "local_reference" }).replace(":", "")}
                </Typography>
                <Typography variant="caption">
                  {childStopPlace.importedId
                    ? childStopPlace.importedId.join(", ")
                    : ""}
                </Typography>
              </Paper>
            ))}
          </Box>
        </>
      );
    } else {
      return (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 1,
              pr: 5,
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {result.name}
            </Typography>
            <ModalityIconImg
              submode={result.submode}
              type={result.stopPlaceType}
            />
          </Box>
          <HasExpiredInfo show={result.hasExpired} />
          <Box sx={{ display: "flex", flexDirection: "column", ml: 1 }}>
            {result.topographicPlace && result.parentTopographicPlace && (
              <Typography variant="body1">
                {`${result.topographicPlace}, ${result.parentTopographicPlace}`}
              </Typography>
            )}
            {result.belongsToGroup && (
              <BelongsToGroup
                formatMessage={formatMessage}
                groups={(result.groups as any) || []}
                style={{}}
              />
            )}
            <Typography variant="body2" color="text.secondary">
              {result.id}
            </Typography>
          </Box>
          {result.importedId && (
            <Typography variant="caption" sx={{ ml: 1 }}>
              <strong>{formatMessage({ id: "local_reference" })}</strong>
              {result.importedId.join(", ")}
            </Typography>
          )}
          <TagTray tags={result.tags} style={{ marginLeft: 8 }} />
          <Box sx={{ display: "flex", justifyItems: "center", p: 1 }}>
            <Typography variant="body2" sx={{ textTransform: "capitalize" }}>
              {formatMessage({ id: "quays" })}
            </Typography>
            <Box sx={{ ml: 1 }}>
              <CircularNumber
                number={result.quays?.length || 0}
                color={primaryDarker}
              />
            </Box>
          </Box>
          <Box
            sx={{
              maxHeight: 120,
              overflow: "auto",
              width: "95%",
              mx: "auto",
              mb: 2,
            }}
          >
            {result.quays?.map((quay: any, i: number) => (
              <Paper
                key={`quay-${quay.id}`}
                variant="outlined"
                sx={{
                  p: 0.5,
                  mb: 0.5,
                  backgroundColor:
                    i % 2 ? theme.palette.grey[50] : "transparent",
                }}
              >
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  {quay.id}
                  <Code
                    type="publicCode"
                    value={quay.publicCode}
                    defaultValue={formatMessage({ id: "not_assigned" })}
                  />
                  <Code
                    type="privateCode"
                    value={quay.privateCode ? quay.privateCode.value : ""}
                    defaultValue={formatMessage({ id: "not_assigned" })}
                  />
                </Typography>
                <Typography variant="caption">
                  {quay.importedId ? quay.importedId.join(", ") : ""}
                </Typography>
              </Paper>
            ))}
          </Box>
        </>
      );
    }
  };

  const renderGroupInfo = () => (
    <>
      <Box
        sx={{ display: "flex", justifyContent: "space-between", mb: 1, pr: 5 }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          {result.name}
        </Typography>
        <GroupIcon sx={{ m: 0.5 }} />
      </Box>
      <Typography variant="body2" color="text.secondary">
        {formatMessage({ id: "group_of_stop_places" })}
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between", p: 1 }}>
        <Typography variant="body2" sx={{ textTransform: "capitalize" }}>
          {formatMessage({ id: "stop_places" })}
        </Typography>
        <CircularNumber
          number={result.members?.length || 0}
          color={primaryDarker}
        />
      </Box>
      <Box
        sx={{
          maxHeight: 150,
          overflow: "auto",
          width: "95%",
          mx: "auto",
          mb: 2,
        }}
      >
        {result.members?.map((member: any, i: number) => (
          <Paper
            key={`member-${member.id}`}
            variant="outlined"
            sx={{
              p: 0.5,
              mb: 0.5,
              backgroundColor: i % 2 ? theme.palette.grey[50] : "transparent",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.8rem",
              }}
            >
              <Typography variant="caption">{member.name}</Typography>
              <SimpleStopPlaceLink id={member.id} />
            </Box>
          </Paper>
        ))}
      </Box>
    </>
  );

  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        border: `1px dotted ${theme.palette.primary.light}`,
        backgroundColor: theme.palette.background.paper,
        position: "relative",
      }}
    >
      {onClose && (
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            zIndex: 1,
          }}
          aria-label={formatMessage({ id: "close" })}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      )}

      {entityType === Entities.STOP_PLACE && renderStopPlaceInfo()}
      {entityType === Entities.GROUP_OF_STOP_PLACE && renderGroupInfo()}

      {hasWheelchairAccess && (
        <Box sx={{ display: "flex", alignItems: "center", ml: 1, mt: 1 }}>
          <WheelChair sx={{ color: primaryDarker, mr: 1 }} />
          <Typography variant="caption">
            {formatMessage({ id: "wheelchairAccess" })}
          </Typography>
        </Box>
      )}

      <Divider sx={{ my: 2 }} />

      <SearchBoxGeoWarning
        userSuppliedCoordinates={userSuppliedCoordinates}
        result={result}
        handleChangeCoordinates={onChangeCoordinates}
      />

      <SearchBoxUsingTempGeo
        userSuppliedCoordinates={userSuppliedCoordinates}
        result={result}
        handleChangeCoordinates={onChangeCoordinates}
      />

      <SearchBoxEdit
        canEdit={canEdit}
        handleEdit={onEdit}
        onClose={onClose}
        text={text}
        result={result}
      />
    </Paper>
  );
};
