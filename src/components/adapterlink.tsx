import React from "react";
import { Link, LinkProps } from "react-router-dom";

// This component taken from https://material-ui.com/components/buttons/#third-party-routing-library

// The usage of React.forwardRef will no longer be required for react-router-dom v6.
// see https://github.com/ReactTraining/react-router/issues/6056
export const AdapterLink = React.forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => (
  <Link innerRef={ref as any} {...props} />
));
