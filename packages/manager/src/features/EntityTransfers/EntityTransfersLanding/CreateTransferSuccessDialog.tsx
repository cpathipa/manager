import { EntityTransfer } from '@linode/api-v4/lib/entity-transfers/types';
import * as copy from 'copy-to-clipboard';
import { DateTime } from 'luxon';
import { update } from 'ramda';
import * as React from 'react';
import Button from 'src/components/Button';
import CopyableTextField from 'src/components/CopyableTextField';
import { makeStyles, Theme } from 'src/components/core/styles';
import ToolTip from 'src/components/core/Tooltip';
import Typography from 'src/components/core/Typography';
import InformationDialog from 'src/components/InformationDialog';
import { parseAPIDate } from 'src/utilities/date';
import { pluralize } from 'src/utilities/pluralize';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    paddingBottom: theme.spacing(),
  },
  tokenInput: {
    maxWidth: '100%',
  },
  copyButton: {
    marginTop: theme.spacing(2),
    maxWidth: 220,
    alignSelf: 'flex-end',
  },
  text: {
    marginBottom: theme.spacing(),
  },
  inputSection: {
    display: 'flex',
    flexFlow: 'column nowrap',
    paddingBottom: theme.spacing(1),
  },
}));

interface Props {
  isOpen: boolean;
  transfer?: EntityTransfer;
  onClose: () => void;
}

export const CreateTransferSuccessDialog: React.FC<Props> = (props) => {
  const { isOpen, onClose, transfer } = props;
  const [tooltipOpen, setTooltipOpen] = React.useState([false, false]);
  const classes = useStyles();

  const handleCopy = (idx: number, text: string) => {
    copy(text);
    setTooltipOpen((state) => update(idx, true, state));
    setTimeout(
      () => setTooltipOpen((state) => update(idx, false, state)),
      1000
    );
  };

  if (!transfer) {
    // This isn't possible; just to reassure TS
    return null;
  }

  const pluralizedEntities = pluralize(
    'Linode',
    'Linodes',
    transfer.entities.linodes.length
  );

  const draftEmail = `This token authorizes transfer of ${pluralizedEntities} to you:\n
  ${transfer.token}\n\t
   1) Log in to your account at cloud.linode.com.\t
   2) Navigate to the Service Transfers tab on your Account page.\t
   3) Copy and paste the token into the Receive a Service Transfer field to view\n\tdetails and accept the transfer.\n
   If you do not have an account with Linode you will need to create one.
   This token will expire ${parseAPIDate(transfer.expiry).toLocaleString(
     DateTime.DATETIME_FULL
   )}.`;

  return (
    <InformationDialog
      title="Service Transfer Token"
      open={isOpen}
      onClose={onClose}
      className={classes.root}
    >
      <Typography className={classes.text}>
        This token authorizes the transfer of {pluralizedEntities}.
      </Typography>
      <Typography>
        Copy and paste the token or draft text into an email or other secure
        delivery method. It may take up to an hour for the service transfer to
        take effect once accepted by the recipient.
      </Typography>
      <div className={classes.inputSection}>
        <CopyableTextField
          className={classes.tokenInput}
          value={transfer.token}
          label="Token"
          hideIcon
          fullWidth
          aria-disabled
        />
        <ToolTip open={tooltipOpen[0]} title="copied!">
          <div className={classes.copyButton}>
            <Button
              buttonType="secondary"
              onClick={() => handleCopy(0, transfer.token)}
              outline
            >
              Copy Token
            </Button>
          </div>
        </ToolTip>
      </div>
      <div className={classes.inputSection}>
        <CopyableTextField
          className={classes.tokenInput}
          value={draftEmail}
          label="Draft Email"
          hideIcon
          fullWidth
          aria-disabled
          multiline
        />
        <ToolTip open={tooltipOpen[1]} title="copied!">
          <div className={classes.copyButton}>
            <Button
              buttonType="primary"
              onClick={() => handleCopy(1, draftEmail)}
            >
              Copy Draft Email
            </Button>
          </div>
        </ToolTip>
      </div>
    </InformationDialog>
  );
};

export default React.memo(CreateTransferSuccessDialog);
