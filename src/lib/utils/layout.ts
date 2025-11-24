export const CONTAINER_MAX_WIDTH = "max-w-6xl";
export const containerClasses = {
  full: "w-full",
  contained: `w-full ${CONTAINER_MAX_WIDTH} mx-auto rounded`,
  narrow: "w-full max-w-3xl mx-auto rounded",
};

export const TEXT_COLUMN_WIDTH = "max-w-lg";
export const textColumnClasses = {
  1: {
    container: TEXT_COLUMN_WIDTH, // Single column = reading width
    columns: "columns-1",
  },
  2: {
    container: CONTAINER_MAX_WIDTH, // 2 columns = wider container
    columns: "columns-1 md:columns-2 gap-8",
  },
  3: {
    container: CONTAINER_MAX_WIDTH, // 3 columns = full width
    columns: "columns-1 md:columns-2 lg:columns-3 gap-8",
  },
};

export const gridClasses = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  6: "grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
};

export type ContainerWidth = keyof typeof containerClasses;
export type GridColumns = keyof typeof gridClasses;

export function getContainerClasses(width?: ContainerWidth | string) {
  return (
    containerClasses[width as ContainerWidth] || containerClasses.contained
  );
}

export function getTextColumnClasses(columns?: number) {
  return (
    textColumnClasses[columns as keyof typeof textColumnClasses] ||
    textColumnClasses[1]
  );
}

export function getGridClasses(columns?: GridColumns | number) {
  return gridClasses[columns as GridColumns] || gridClasses[1];
}
