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

import { Box } from "@mui/material";
import { Component } from "react";
import { Link } from "react-router-dom";
import Routes from "../../routes/";
import CopyIdButton from "../Shared/CopyIdButton";

// Error boundary component to catch router context errors
class LinkErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error if needed
    console.warn(
      "Router context not available, using fallback link:",
      error.message,
    );
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI when Link fails
      return (
        <span
          style={{
            color: "#1976d2",
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          {this.props.children}
        </span>
      );
    }

    return this.props.children;
  }
}

export default ({ id, style }) => {
  const url = `/${Routes.STOP_PLACE}/${id}`;

  return (
    <Box sx={{ ...style, display: "inline-flex" }}>
      <LinkErrorBoundary>
        <Link to={url}>{id}</Link>
      </LinkErrorBoundary>
      <CopyIdButton idToCopy={id} />
    </Box>
  );
};
