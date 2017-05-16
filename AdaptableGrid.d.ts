declare namespace AdaptableGrid {

  class AdaptableGrid {
    constructor(options: any);
    read(): void;
    render(callback?: void): void;
    getSelectedCells(): any[];
    cellToElement(row: number, col: number): any;
    elementToCell(el: any): Cell;
    getRow(index: number): Row;
    getPositionOfColumn(column: Column): number;
    getColumnFromId(columnId: string): Column;
    getPositionOfRow(row: Row): number;
    getRowFromId(rowId: string): Row;
    getDataType(type: string): DataType;
    getVisibleRows(): (Row)[];
    getAllRows(): (Row)[];
    getHeaderRow(): Row;
    getHiddenRows(): (Row)[];
    getAllColumns(): (Column)[];
    getVisibleColumns(): (Column)[];
    getHiddenColumns(): (Column)[];
    newColumnOrder(ids: string[]): void;
    useAllColumns(ids: string[]): string[];
    clearFiltered(): void;
    addFilter(rs: (Row)[]): void;
  }

  class Cell {
    setValue(v: any): void;
    getValuePairs(): any[];
    getRawValue(): any;
    setType(type: string): void;
    setFormat(format: string): void;
    getType(): string;
    getFormat(): string;
    addClass(c: string): void;
    getClasses(): string[];
    setReadOnly(): void;
    isReadOnly(): boolean;
    getFormattedValue(grid: AdaptableGrid): string;
  }

  class Column {
    constructor(columnId: any, friendlyName: string, type: DataType);
    getId(): string;
    getFriendlyName(): string;
    setFriendlyName(friendlyName: string): void;
    getType(): DataType;
    setVisible(): void;
    setHidden(): void;
    isVisible(): void;
    addCSS(cls: string, grid: AdaptableGrid): void;
  }

  interface DataType {
    String: number;
    Number: number;
    Boolean: number;
    Date: number;
    Object: number;
  }

  class PageUtil {
    static nextPage(): void;
    static prevPage(): void;
    static resetPages(): void;
    static getTotalPages(): void;
    static addPages(): void;
  }

  class Row {
    constructor(rowId: number);
    getId(): number;
    getData(): (Cell)[];
    addCell(cell: Cell): void;
    setCell(key: number, value: Cell): void;
    getCell(key: number): Cell;
    setVisible(grid: AdaptableGrid): void;
    setHidden(grid: AdaptableGrid): void;
    isVisible(): boolean;
    addCSS(cls: string, grid: AdaptableGrid): void;
  }

  class Sorter { 
    constructor(data: any[]);
    process(grid: AdaptableGrid, callback?: void): void;
  }

}