import AccountCircle from "@mui/icons-material/AccountCircle";
import CloseIcon from "@mui/icons-material/Close"; // Import CloseIcon
import SearchIcon from "@mui/icons-material/Search";
import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import logo from "../theme/logo.png";
import "../theme/style.css";
import { useSearch } from "./SearchContext";
import Settings from "./Settings";

const Header: React.FC = () => {
  const intl = useIntl();
  const title = intl.formatMessage({ id: "_title" });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { searchBox } = useSearch();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <AppBar position="static">
      <Toolbar>
        {isMobile ? (
          mobileSearchOpen ? (
            <div className="search-container">
              <IconButton
                color="inherit"
                aria-label="close search"
                onClick={() => setMobileSearchOpen(false)}
              >
                <CloseIcon />
              </IconButton>
              {searchBox}
            </div>
          ) : (
            <div className="header-mobile">
              <div className="header-top">
                <a href="/" className="logo-link">
                  <img src={logo} alt="Logo" className="header-logo" />
                </a>
                <Typography variant="body1" className="header-title">
                  {title}
                </Typography>
              </div>
              <div className="header-bottom">
                <IconButton
                  color="inherit"
                  aria-label="search"
                  onClick={() => setMobileSearchOpen(true)}
                >
                  <SearchIcon />
                </IconButton>
                <div className="header-bottom-right">
                  <IconButton color="inherit" aria-label="user account">
                    <AccountCircle />
                  </IconButton>
                  <Settings />
                </div>
              </div>
            </div>
          )
        ) : (
          <div className="header">
            <div className="header-left">
              <a href="/" className="logo-link">
                <img src={logo} alt="Logo" className="header-logo" />
              </a>
              <Typography variant="body1" className="header-title">
                {title}
              </Typography>
            </div>
            <div className="header-center">{searchBox}</div>
            <div className="header-right">
              <IconButton color="inherit" aria-label="user account">
                <AccountCircle />
              </IconButton>
              <Settings />
            </div>
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
