import { visuallyHidden } from '@mui/utils';
import React, { useEffect, useMemo, useState } from 'react';

import { Autocomplete } from 'src/components/Autocomplete/Autocomplete';
import { StyledListItem as SelectAndDeselectAll } from 'src/components/Autocomplete/Autocomplete.styles';
import { Box } from 'src/components/Box';
import { Flag } from 'src/components/Flag';
import { Link } from 'src/components/Link';
import { Tooltip } from 'src/components/Tooltip';
import { useFlags } from 'src/hooks/useFlags';
import { useAccountAvailabilitiesQueryUnpaginated } from 'src/queries/accountAvailability';

import {
  SelectedIcon,
  StyledAutocompleteContainer,
  StyledFlagContainer,
  StyledListItem,
} from './RegionSelect.styles';
import {
  getRegionOptions,
  getSelectedRegionsByIds,
} from './RegionSelect.utils';

import type {
  RegionMultiSelectProps,
  RegionSelectOption,
} from './RegionSelect.types';
import type { ListItemComponentsPropsOverrides } from '@mui/material/ListItem';

export const RegionMultiSelect = React.memo((props: RegionMultiSelectProps) => {
  const {
    SelectedRegionsList,
    currentCapability,
    disabled,
    errorText,
    handleSelection,
    helperText,
    isClearable,
    label,
    onBlur,
    placeholder,
    regions,
    required,
    selectedIds,
    sortRegionOptions,
    width,
  } = props;

  const flags = useFlags();
  const {
    data: accountAvailability,
    isLoading: accountAvailabilityLoading,
  } = useAccountAvailabilitiesQueryUnpaginated(flags.dcGetWell);

  const [selectedRegions, setSelectedRegions] = useState<RegionSelectOption[]>(
    getSelectedRegionsByIds({
      accountAvailabilityData: accountAvailability,
      currentCapability,
      regions,
      selectedRegionIds: selectedIds ?? [],
    })
  );

  const handleRegionChange = (selection: RegionSelectOption[]) => {
    setSelectedRegions(selection);
    const selectedIds = selection.map((region) => region.value);
    handleSelection(selectedIds);
  };

  useEffect(() => {
    setSelectedRegions(
      getSelectedRegionsByIds({
        accountAvailabilityData: accountAvailability,
        currentCapability,
        regions,
        selectedRegionIds: selectedIds ?? [],
      })
    );
  }, [selectedIds, accountAvailability, currentCapability, regions]);

  const options = useMemo(
    () =>
      getRegionOptions({
        accountAvailabilityData: accountAvailability,
        currentCapability,
        regions,
      }),
    [accountAvailability, currentCapability, regions]
  );

  const handleRemoveOption = (optionToRemove: RegionSelectOption) => {
    const updatedSelectedOptions = selectedRegions.filter(
      (option) => option.value !== optionToRemove.value
    );
    const updatedSelectedIds = updatedSelectedOptions.map(
      (region) => region.value
    );
    setSelectedRegions(updatedSelectedOptions);
    handleSelection(updatedSelectedIds);
  };

  return (
    <>
      <StyledAutocompleteContainer sx={{ width }}>
        <Autocomplete
          getOptionDisabled={(option: RegionSelectOption) =>
            Boolean(flags.dcGetWell) && Boolean(option.unavailable)
          }
          groupBy={(option: RegionSelectOption) => {
            return option?.data?.region;
          }}
          isOptionEqualToValue={(
            option: RegionSelectOption,
            value: RegionSelectOption
          ) => option.value === value.value}
          onChange={(_, selectedOption) =>
            handleRegionChange(selectedOption as RegionSelectOption[])
          }
          renderOption={(props, option, { selected }) => {
            const isDisabledMenuItem =
              Boolean(flags.dcGetWell) && Boolean(option.unavailable);
            if (!option.data) {
              // Render options like "Select All / Deselect All "
              return (
                <SelectAndDeselectAll {...props}>
                  {option.label}
                </SelectAndDeselectAll>
              );
            }

            // Render regular options
            return (
              <Tooltip
                PopperProps={{
                  sx: { '& .MuiTooltip-tooltip': { minWidth: 215 } },
                }}
                title={
                  isDisabledMenuItem ? (
                    <>
                      There may be limited capacity in this region.{' '}
                      <Link to="https://www.linode.com/global-infrastructure/availability">
                        Learn more
                      </Link>
                      .
                    </>
                  ) : (
                    ''
                  )
                }
                disableFocusListener={!isDisabledMenuItem}
                disableHoverListener={!isDisabledMenuItem}
                disableTouchListener={!isDisabledMenuItem}
                enterDelay={200}
                enterNextDelay={200}
                enterTouchDelay={200}
                key={option.value}
              >
                <StyledListItem
                  {...props}
                  className={
                    isDisabledMenuItem
                      ? `${props.className} Mui-disabled`
                      : props.className
                  }
                  componentsProps={{
                    root: {
                      'data-qa-option': option.value,
                      'data-testid': option.value,
                    } as ListItemComponentsPropsOverrides,
                  }}
                  onClick={(e) =>
                    isDisabledMenuItem
                      ? e.preventDefault()
                      : props.onClick
                      ? props.onClick(e)
                      : null
                  }
                  aria-disabled={undefined}
                >
                  <>
                    <Box alignItems="center" display="flex" flexGrow={1}>
                      <StyledFlagContainer>
                        <Flag country={option.data.country} />
                      </StyledFlagContainer>
                      {option.label}
                      {isDisabledMenuItem && (
                        <Box sx={visuallyHidden}>
                          Disabled option - There may be limited capacity in
                          this region. Learn more at
                          https://www.linode.com/global-infrastructure/availability.
                        </Box>
                      )}
                    </Box>
                    {selected && <SelectedIcon visible={selected} />}
                  </>
                </StyledListItem>
              </Tooltip>
            );
          }}
          textFieldProps={{
            InputProps: {
              required,
            },
            tooltipText: helperText,
          }}
          autoHighlight
          clearOnBlur
          data-testid="region-select"
          disableClearable={!isClearable}
          disabled={disabled}
          errorText={errorText}
          label={label ?? 'Regions'}
          loading={accountAvailabilityLoading}
          multiple
          noOptionsText="No results"
          onBlur={onBlur}
          options={options}
          placeholder={placeholder ?? 'Select Regions'}
          renderTags={() => null}
          value={selectedRegions}
        />
      </StyledAutocompleteContainer>
      {selectedRegions.length > 0 && SelectedRegionsList && (
        <SelectedRegionsList
          selectedRegions={
            sortRegionOptions
              ? [...selectedRegions].sort(sortRegionOptions)
              : selectedRegions
          }
          onRemove={handleRemoveOption}
        />
      )}
    </>
  );
});
