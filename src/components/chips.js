import React from "react";
import Chip from "@material-ui/core/Chip";

export default function Chips() {
  const [chipData] = React.useState([
    { key: 0, label: "app/it" },
    { key: 1, label: "study" },
    { key: 2, label: "problems" },
    { key: 3, label: "hands-on" },
    { key: 4, label: "sharing" },
    { key: 5, label: "connect"}
  ]);
  return (
    <div>
      {chipData.map(c => (
        <Chip size="small" label={c.label} key={c.key} />
      ))}
    </div>
  );
}