import * as React from 'react';
import FirewallIcon from 'src/assets/icons/entityIcons/firewall.svg';
import { ResourcesSection } from 'src/components/EmptyLandingPageResources/ResourcesSection';
import { sendEvent } from 'src/utilities/ga';
import {
  gettingStartedGuides,
  headers,
  linkGAEvent,
  youtubeLinkData,
} from './StackScriptsEmptyResourcesData';

interface Props {
  goToCreateStackScript: () => void;
}

export const StackScriptsEmptyLandingState = (props: Props) => {
  const { goToCreateStackScript } = props;

  return (
    <ResourcesSection
      buttonProps={[
        {
          onClick: () => {
            sendEvent({
              category: linkGAEvent.category,
              action: 'Click:button',
              label: 'Create StackScript',
            });
            goToCreateStackScript();
          },
          children: 'Create StackScript',
        },
      ]}
      gettingStartedGuidesData={gettingStartedGuides}
      headers={headers}
      icon={FirewallIcon}
      linkGAEvent={linkGAEvent}
      youtubeLinkData={youtubeLinkData}
    />
  );
};
