import PageContainer from "@/shared/ui/PageContainer";
import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button } from "@mui/material";
import Link from "next/link";

interface PageCreateClassRoomProps {}

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number,
) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];
const PageCreateClassRoom: React.FC<PageCreateClassRoomProps> = ({}) => {
  return (
    <PageContainer
      title="Danh sách lớp học"
      breadcrumbs={[{ title: "Danh sách lớp học" }]}
    >
      <div className="mb-3 py-3">
        <div className="ml-auto w-fit">
          <Button LinkComponent={Link} href="/class-room/create">
            Tạo lớp học
          </Button>
        </div>
      </div>
      <div className="list bg-white rounded-lg overflow-hidden p-6">
        <TableContainer className="table-container bg-white">
          <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>Dessert (100g serving)</TableCell>
                <TableCell align="right">Calories</TableCell>
                <TableCell align="right">Fat&nbsp;(g)</TableCell>
                <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                <TableCell align="right">Protein&nbsp;(g)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row" className="py-3">
                    {row.name}
                  </TableCell>
                  <TableCell align="right" className="py-3">
                    {row.calories}
                  </TableCell>
                  <TableCell align="right" className="py-3">
                    {row.fat}
                  </TableCell>
                  <TableCell align="right" className="py-3">
                    {row.carbs}
                  </TableCell>
                  <TableCell align="right" className="py-3">
                    {row.protein}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </PageContainer>
  );
};

export default PageCreateClassRoom;
