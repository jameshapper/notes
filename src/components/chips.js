import React from "react";
import Chip from "@material-ui/core/Chip";

export default function Chips(props) {

  return (
    <div>
      {props.activities.map(activity => (
        <Chip size="small" label={activity} key={activity} />
      ))}
    </div>
  );
}