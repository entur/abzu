import React from "react";
import GroupOfStopPlacesLink from "./GroupOfStopPlacesLink";

const BelongsToGroup = ({ formatMessage, groups = [], style }) => {
  return (
    <div style={{ display: "flex", ...style }}>
      <div style={{ fontWeight: 600, fontSize: "0.9em" }}>
        {formatMessage({ id: "belongs_to_groups" })}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {groups.map((group, i) => (
          <GroupOfStopPlacesLink
            key={"group-" + i}
            style={{ marginLeft: 5 }}
            name={group.name}
            id={group.id}
          />
        ))}
      </div>
    </div>
  );
};

export default BelongsToGroup;
