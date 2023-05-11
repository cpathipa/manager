import type { LinodeTypeClass } from '@linode/api-v4';

type FilteredPlansTypes<T> = Record<LinodeTypeClass, T[]>;

/**
 * getPlanSelectionsByPlanType is common util funtion used to provide filtered plans by
 * type to Linode, Databse and LKE plan tables.
 */

export const getPlanSelectionsByPlanType = <
  T extends { class: LinodeTypeClass }
>(
  types: T[]
) => {
  const filteredPlansByType: FilteredPlansTypes<T> = {
    nanode: [],
    standard: [],
    highmem: [],
    prodedicated: [],
    dedicated: [],
    gpu: [],
    metal: [],
    premium: [],
  };

  for (const type of types) {
    switch (type.class) {
      case 'nanode':
        filteredPlansByType.nanode.push(type);
        break;
      case 'standard':
        filteredPlansByType.standard.push(type);
        break;
      case 'highmem':
        filteredPlansByType.highmem.push(type);
        break;
      case 'prodedicated':
        filteredPlansByType.prodedicated.push(type);
        break;
      case 'dedicated':
        filteredPlansByType.dedicated.push(type);
        break;
      case 'gpu':
        filteredPlansByType.gpu.push(type);
        break;
      case 'metal':
        filteredPlansByType.metal.push(type);
        break;
      case 'premium':
        filteredPlansByType.premium.push(type);
        break;
      default:
        break;
    }
  }

  return filteredPlansByType;
};
