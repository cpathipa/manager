import type { LinodeTypeClass } from '@linode/api-v4';
import { Capabilities } from '@linode/api-v4/lib/regions/types';
import { Region } from '@linode/api-v4/lib/regions';
import { ExtendedType } from 'src/utilities/extendType';
import arrayToList from 'src/utilities/arrayToDelimiterSeparatedList';
import { PlanSelectionType } from './PlansPanel';

export type PlansTypes<T> = Record<LinodeTypeClass, T[]>;

type PlansByType<T> = Omit<PlansTypes<T>, 'nanode' | 'standard'> & {
  shared: T[];
};

/**
 * getPlanSelectionsByPlanType function takes an array of types, groups
 * them based on their class property into different plan types, filters out empty
 * plan types, and returns an object containing the filtered plan selections.
 * getPlanSelectionsByPlanType is common util funtion used to provide plans by
 * type to Linode, Database and LKE plan tables.
 * The planTypeOrder array specifies the order in which the Linode types should be processed.
 * Any change to the order can result in incorrect rendering of plan tabs.
 */

export const getPlanSelectionsByPlanType = <
  T extends { class: LinodeTypeClass }
>(
  types: T[]
): PlansByType<T> => {
  const planTypeOrder: (
    | Exclude<LinodeTypeClass, 'nanode' | 'standard'>
    | 'shared'
  )[] = [
    'prodedicated',
    'dedicated',
    'shared',
    'highmem',
    'gpu',
    'metal',
    'premium',
  ];

  const plansByType: PlansByType<T> = planTypeOrder.reduce((acc, key) => {
    acc[key] = [];
    return acc;
  }, {} as PlansByType<T>);

  for (const type of types) {
    if (type.class === 'nanode' || type.class === 'standard') {
      plansByType['shared'].push(type);
    } else {
      plansByType[type.class].push(type);
    }
  }

  Object.keys(plansByType).forEach((key) => {
    if (plansByType[key].length === 0) {
      delete plansByType[key];
    }
  });

  return plansByType;
};

export const determineInitialPlanCategoryTab = <T>(
  types: (ExtendedType | PlanSelectionType)[],
  selectedID?: string,
  currentPlanHeading?: string
) => {
  const plans = getPlanSelectionsByPlanType(types);

  const tabOrder: LinodeTypeClass[] = Object.keys(plans).map((plan) =>
    plan === 'shared' ? 'standard' : (plan as LinodeTypeClass)
  );

  // Determine initial plan category tab based on current plan selection
  // (if there is one).
  const _selectedTypeClass =
    types.find(
      (type) => type.id === selectedID || type.heading === currentPlanHeading
    )?.class ?? 'dedicated';

  // We don't have a "Nanodes" tab anymore, so use `standard` (labeled as "Shared CPU").
  const selectedTypeClass =
    _selectedTypeClass === 'nanode' ? 'standard' : _selectedTypeClass;

  const initialTab = tabOrder.indexOf(selectedTypeClass);

  return initialTab;
};

export const getRegionsWithCapability = (
  capability: Capabilities,
  regions: Region[]
) => {
  const withCapability = regions
    ?.filter((thisRegion: Region) =>
      thisRegion.capabilities.includes(capability)
    )
    .map((thisRegion: Region) => thisRegion.label);
  return arrayToList(withCapability ?? []);
};

export const planTabInfoContent = {
  prodedicated: {
    typography:
      'Pro Dedicated CPU instances are for very demanding workloads. They only have AMD 2nd generation processors or newer.',
    title: 'Pro Dedicated CPU',
    key: 'prodedicated',
    dataId: 'data-qa-prodedi',
  },
  dedicated: {
    typography:
      'Dedicated CPU instances are good for full-duty workloads where consistent performance is important.',
    title: 'Dedicated CPU',
    key: 'dedicated',
    dataId: 'data-qa-dedicated',
  },
  shared: {
    typography:
      ' Shared CPU instances are good for medium-duty workloads and are a good mix of performance, resources, and price.',
    title: 'Shared CPU',
    key: 'shared',
    dataId: 'data-qa-standard',
  },
  highmem: {
    typography:
      'High Memory instances favor RAM over other resources, and can be good for memory hungry use cases like caching and in-memory databases. All High Memory plans use dedicated CPU cores.',
    title: 'High Memory',
    key: 'highmem',
    dataId: 'data-qa-highmem',
  },
  gpu: {
    typography:
      'Linodes with dedicated GPUs accelerate highly specialized applications such as machine learning, AI, and video transcoding.',
    title: 'GPU',
    key: 'gpu',
    dataId: 'data-qa-gpu',
  },
  metal: {
    typography:
      'Bare Metal Linodes give you full, dedicated access to a single physical machine. Some services, including backups, VLANs, and disk management, are not available with these plans.',
    title: 'Bare Metal',
    key: 'metal',
    dataId: 'data-qa-metal',
  },
  premium: {
    typography:
      'Premium CPU instances guarantee a minimum processor model, AMD Epyc\u2122 7713 or higher, to ensure consistent high performance for more demanding workloads.',
    title: 'Premium',
    key: 'premium',
    dataId: 'data-qa-premium',
  },
};
