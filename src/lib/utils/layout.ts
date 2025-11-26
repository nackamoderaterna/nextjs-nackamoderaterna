export const CONTAINER_MAX_WIDTH = "max-w-6xl";
export const CONTAINER_PADDING = "px-4";
export const TEXT_COLUMN_MAX_WIDTH = "max-w-xl";

export const containerClasses = {
  full: "w-full",
  contained: `w-full ${CONTAINER_MAX_WIDTH} mx-auto rounded`,
  narrow: "w-full max-w-3xl mx-auto rounded",
};

export const textColumnClasses = {
  1: {
    container: TEXT_COLUMN_MAX_WIDTH, // Single column = reading width
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

export type ContainerWidth = keyof typeof containerClasses;

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
