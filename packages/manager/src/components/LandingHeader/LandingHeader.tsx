import { Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { styled, useTheme } from '@mui/material/styles';
import * as React from 'react';

import ExternalLinkIcon from 'src/assets/icons/external-link.svg';
import {
  Breadcrumb,
  BreadcrumbProps,
} from 'src/components/Breadcrumb/Breadcrumb';
import { Button } from 'src/components/Button/Button';
import { DocsLink } from 'src/components/DocsLink/DocsLink';
import { Link } from 'src/components/Link';

export interface LandingHeaderProps {
  analyticsLabel?: string;
  breadcrumbDataAttrs?: { [key: string]: boolean };
  breadcrumbProps?: BreadcrumbProps;
  buttonDataAttrs?: { [key: string]: boolean | string };
  createButtonText?: string;
  disabledCreateButton?: boolean;
  docsLabel?: string;
  docsLink?: string;
  entity?: string;
  extraActions?: JSX.Element;
  feedbackLink?: string;
  feedbackLinkLabel?: string;
  loading?: boolean;
  onButtonClick?: () => void;
  onButtonKeyPress?: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
  onDocsClick?: () => void;
  removeCrumbX?: number;
  shouldHideDocsAndCreateButtons?: boolean;
  title?: JSX.Element | string;
}

/**
 * @note Passing a title prop will override the final `breadcrumbProps` label.
 * If you don't want this behavior, omit a title prop.
 */
export const LandingHeader = ({
  analyticsLabel,
  breadcrumbDataAttrs,
  breadcrumbProps,
  buttonDataAttrs,
  createButtonText,
  disabledCreateButton,
  docsLabel,
  docsLink,
  entity,
  extraActions,
  feedbackLink,
  feedbackLinkLabel,
  loading,
  onButtonClick,
  onButtonKeyPress,
  onDocsClick,
  removeCrumbX,
  shouldHideDocsAndCreateButtons,
  title,
}: LandingHeaderProps) => {
  const theme = useTheme();
  const renderActions = Boolean(onButtonClick || extraActions);
  const labelTitle = title?.toString();

  const docsAnalyticsLabel = analyticsLabel
    ? analyticsLabel
    : `${title} Landing`;

  const sxButton = {
    marginLeft: theme.spacing(1),
  };

  return (
    <Grid
      alignItems="center"
      container
      data-qa-entity-header
      justifyContent="space-between"
      sx={{ width: '100%' }}
    >
      <Grid>
        <Breadcrumb
          data-qa-title
          labelTitle={labelTitle}
          // The pathname set by "breadcrumbProps" is just a fallback to satisfy the type.
          pathname={location.pathname}
          removeCrumbX={removeCrumbX}
          {...breadcrumbDataAttrs}
          {...breadcrumbProps}
        />
      </Grid>

      <Grid
        alignItems="center"
        columnGap={1}
        container
        justifyContent="flex-end"
      >
        {feedbackLink && (
          <Grid container>
            <Typography>
              <Link external hideIcon={true} to={feedbackLink}>
                <ExternalLinkIcon style={{ verticalAlign: 'text-top' }} />{' '}
                {feedbackLinkLabel}
              </Link>
            </Typography>
          </Grid>
        )}
        {!shouldHideDocsAndCreateButtons && (
          <Grid container>
            {docsLink ? (
              <DocsLink
                analyticsLabel={docsAnalyticsLabel}
                href={docsLink}
                label={docsLabel}
                onClick={onDocsClick}
              />
            ) : null}
            {renderActions && (
              <Actions>
                {extraActions}
                {onButtonClick ? (
                  <Button
                    buttonType="primary"
                    disabled={disabledCreateButton}
                    loading={loading}
                    onClick={onButtonClick}
                    onKeyPress={onButtonKeyPress}
                    sx={sxButton}
                    {...buttonDataAttrs}
                  >
                    {createButtonText ?? `Create ${entity}`}
                  </Button>
                ) : null}
              </Actions>
            )}
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

const Actions = styled('div')(({ theme }) => ({
  marginLeft: `${theme.spacing(2)}`,
}));
