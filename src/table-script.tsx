import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { useMemo } from "react";
import sourceData from "./source-data.json";
import type { SourceDataType, TableDataType } from "./types";

/**
 * Example of how a tableData object should be structured.
 *
 * Each `row` object has the following properties:
 * @prop {string} person - The full name of the employee.
 * @prop {number} past12Months - The value for the past 12 months.
 * @prop {number} y2d - The year-to-date value.
 * @prop {number} may - The value for May.
 * @prop {number} june - The value for June.
 * @prop {number} july - The value for July.
 * @prop {number} netEarningsPrevMonth - The net earnings for the previous month.
 */

const tableData: TableDataType[] = (
  sourceData as unknown as SourceDataType[]
).map((dataRow, index) => {
  const person = `${dataRow?.employees?.firstname} ${dataRow?.employees?.lastname}`;

  const util = dataRow?.employees?.workforceUtilisation;
  const y2d = util?.utilisationRateYearToDate;
  const past12Months = util?.utilisationRateLastTwelveMonths;

  // For extracting the utilisation rate by month
  const get_utilByMonth = (month: string) => {
    return util?.lastThreeMonthsIndividually?.find(
      (util) => util?.month === month
    )?.utilisationRate;
  }

  // A utility funtion for formatting the util rate
  const formatPercent = (value?: string | null) => {
    const num = Number(value);
    return isNaN(num) ? "..." : (num * 100).toFixed(1) + "%";
  };
  
  // Extracting the last month cost
  // const lastCostEntry = dataRow?.employees?.costsByMonth?.costsByMonth?.at(-1);
  console.log(dataRow?.employees?.costsByMonth?.potentialEarningsByMonth?.at(-1)?.costs);

  const row: TableDataType = {
    person: `${person}`,
    past12Months: formatPercent(past12Months),
    y2d: formatPercent(y2d),
    june: formatPercent(get_utilByMonth("June")),
    july: formatPercent(get_utilByMonth("July")),
    august: formatPercent(get_utilByMonth("August")),
    netEarningsPrevMonth: "netEarningsPrevMonth",
  };

  return row;
});

const Example = () => {
  const columns = useMemo<MRT_ColumnDef<TableDataType>[]>(
    () => [
      {
        accessorKey: "person",
        header: "Person",
      },
      {
        accessorKey: "past12Months",
        header: "Past 12 Months",
      },
      {
        accessorKey: "y2d",
        header: "Y2D",
      },
      {
        accessorKey: "june",
        header: "June",
      },
      {
        accessorKey: "july",
        header: "July",
      },
      {
        accessorKey: "august",
        header: "August",
      },
      {
        accessorKey: "netEarningsPrevMonth",
        header: "Net Earnings Prev Month",
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: tableData,
  });

  return <MaterialReactTable table={table} />;
};

export default Example;
