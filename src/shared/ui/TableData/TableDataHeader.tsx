import { useEffect, useRef } from "react";
import { TableDataColumn } from "./TableDataRow";
import { TableCell } from "@mui/material";
import { TableRowStyled } from "./table-row-styled";
export interface TableRowDataProps<T> {
  showRowCount?: boolean;
  hoverRow?: boolean;
  columns: TableDataColumn<T>[];
}

const TableDataHeader = <T,>({ columns, showRowCount }: TableRowDataProps<T>) => {
  const nodeListLeft = useRef<HTMLTableCellElement[]>([]);
  const nodeListRight = useRef<HTMLTableCellElement[]>([]);

  const splitCellsRefs = (fixed?: "left" | "right") => (el: HTMLTableCellElement) => {
    if (!fixed) return;
    fixed === "left" && nodeListLeft.current.push(el);
    fixed === "right" && nodeListRight.current.push(el);
  };

  useEffect(() => {
    const nodesLeft = [...nodeListLeft.current];
    const nodesRight = [...nodeListRight.current];

    nodesLeft.forEach((cellNode, _index) => {
      let leftPosition = 0;
      for (let i = 0; i < _index; i++) {
        const nodeItem = nodesLeft[i];
        if (nodeItem) {
          const { width } = getClientInfo(nodeItem);
          leftPosition += width;
        }
      }

      cellNode.style.left = leftPosition + "px";
      cellNode.classList.add("fixed-left");
      cellNode.style.background = "rgb(245 246 248)";
    });

    const nodelistRightReverse = [...nodesRight].reverse();

    nodelistRightReverse.forEach((cellNode, _index) => {
      let rightPosition = 0;
      for (let i = 0; i < _index; i++) {
        const nodeItem = nodelistRightReverse[i];
        if (nodeItem) {
          const { width } = getClientInfo(nodeItem);
          rightPosition += width;
        }
      }

      cellNode.style.right = rightPosition + "px";
      cellNode.classList.add("fixed-right");
      cellNode.style.background = "rgb(245 246 248)";
    });
  }, []);

  return (
    <TableRowStyled className="table-data-row table-data-row-header">
      {showRowCount && <TableCell className="w-20 table-cell-head">STT</TableCell>}
      {columns.map(({ headerName, field, renderCell, ...restProps }, _index) => (
        <TableCell
          ref={splitCellsRefs(restProps.fixed)}
          key={field.toString()}
          className="table-cell-head"
          {...restProps}
        >
          {headerName}
        </TableCell>
      ))}
    </TableRowStyled>
  );
};
export default TableDataHeader;

const getClientInfo = (el: HTMLElement | Element) => {
  return {
    x: el.getBoundingClientRect().x,
    y: el.getBoundingClientRect().y,
    width: el.getBoundingClientRect().width,
    height: el.getBoundingClientRect().height,
  };
};
