import * as React from "react";

export const Code: React.StatelessComponent<{}> = ({ children }) => (
  <pre
    style={{
      backgroundColor: "#EEE",
      fontFamily: "Courier New",
      padding: "15px",
      margin: "10px 0px",
      overflowX: "scroll"
    }}
  >
    {children}
  </pre>
);
