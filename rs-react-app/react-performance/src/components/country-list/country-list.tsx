import { useMemo } from 'react';
import type { CSSProperties } from 'react';
import { List } from 'react-window';
import type { Country } from '../../types';
import { CountryCard } from '../country-card/country-card';
import { getPopulationForYear, createYearDataMap } from '../../utils/data-transformers';

import styles from './country-list.module.css';

type CountryListProps = {
  countries: Country[];
  searchQuery: string;
  selectedColumns: string[];
  selectedRegion: string;
  selectedYear: number;
  sortField: 'name' | 'population';
  sortOrder: 'asc' | 'desc';
  onYearChange: (year: number) => void;
};

const ITEM_HEIGHT = 280;
const LIST_HEIGHT = 700;

type RowProps = {
  filteredCountries: Country[];
  selectedYear: number;
  selectedColumns: string[];
};

const Row = ({
  ariaAttributes,
  index,
  style,
  filteredCountries,
  selectedYear,
  selectedColumns,
}: {
  ariaAttributes: { 'aria-posinset': number; 'aria-setsize': number; role: 'listitem' };
  index: number;
  style: CSSProperties;
} & RowProps) => {
  const country = filteredCountries[index];
  return (
    <div style={style} {...ariaAttributes}>
      <CountryCard country={country} selectedYear={selectedYear} selectedColumns={selectedColumns} />
    </div>
  );
};

export const CountryList = ({
  countries,
  searchQuery,
  selectedColumns,
  selectedRegion,
  selectedYear,
  sortField,
  sortOrder,
}: CountryListProps) => {
  const filteredCountries = useMemo(() => {
    return countries
      .filter((c) => {
        const matchesSearch = c.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRegion = !selectedRegion || c.data.some((d) => d.region === selectedRegion);
        return matchesSearch && matchesRegion;
      })
      .sort((a, b) => {
        if (sortField === 'name') {
          return sortOrder === 'asc' ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id);
        } else {
          const popA = getPopulationForYear(createYearDataMap(a.data), selectedYear) || 0;
          const popB = getPopulationForYear(createYearDataMap(b.data), selectedYear) || 0;
          return sortOrder === 'asc' ? popA - popB : popB - popA;
        }
      });
  }, [countries, searchQuery, selectedRegion, sortField, sortOrder, selectedYear]);

  const rowProps = useMemo(
    (): RowProps => ({
      filteredCountries,
      selectedYear,
      selectedColumns,
    }),
    [filteredCountries, selectedYear, selectedColumns]
  );

  return (
    <div className={styles.countryList}>
      <List<RowProps>
        rowComponent={Row}
        rowCount={filteredCountries.length}
        rowHeight={ITEM_HEIGHT}
        rowProps={rowProps}
        style={{ height: LIST_HEIGHT }}
      />
    </div>
  );
};
