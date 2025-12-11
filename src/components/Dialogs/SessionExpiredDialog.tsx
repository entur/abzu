import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useEffect, useState } from "react";
import { injectIntl, IntlShape } from "react-intl";
import { useAuth } from "../../auth/auth";

interface SessionExpiredDialogProps {
  intl: IntlShape;
}

const SessionExpiredDialog = ({ intl }: SessionExpiredDialogProps) => {
  const { login, logout, addAccessTokenExpiredCallback } = useAuth();
  const { formatMessage } = intl;
  const [showSessionExpiredDialog, setShowSessionExpiredDialog] =
    useState(false);

  useEffect(() => {
    return addAccessTokenExpiredCallback(() =>
      setShowSessionExpiredDialog(true),
    );
  }, [setShowSessionExpiredDialog, addAccessTokenExpiredCallback]);

  return (
    <Dialog open={showSessionExpiredDialog}>
      <DialogTitle>
        {formatMessage({ id: "session_expired_title" })}
      </DialogTitle>
      <DialogContent>
        {formatMessage({ id: "session_expired_body" })}
      </DialogContent>
      <DialogActions>
        <ButtonGroup fullWidth sx={{ justifyContent: "space-between", gap: 2 }}>
          <Button
            variant="text"
            onClick={() => logout({ returnTo: window.location.origin })}
            color="secondary"
          >
            {formatMessage({ id: "log_out" })}
          </Button>
          <Button variant="text" onClick={() => login()} color="primary">
            {formatMessage({ id: "log_in" })}
          </Button>
        </ButtonGroup>
      </DialogActions>
    </Dialog>
  );
};

export default injectIntl(SessionExpiredDialog);
