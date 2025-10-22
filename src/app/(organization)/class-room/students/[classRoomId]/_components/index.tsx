"use client";

import { Box, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { TABLE_HEAD } from "../../../list/constants";
import { grey } from "@mui/material/colors";

interface IStudentsSection {
    classRoomId: string;
}

const StudentsSection = ({ classRoomId }: IStudentsSection) => {
    return (
        <Box sx={{ borderColor: "divider", overflow: "hidden" }}>
            <TableContainer>
                <Table aria-label="Danh sách lớp học trực tuyến">
                    <TableHead sx={{ backgroundColor: grey[100] }}>
                        <TableRow>
                            {
                                TABLE_HEAD.map((item) => {
                                    return <TableCell key={item.id} sx={{ width: item.width }}>{item.label}</TableCell>
                                })
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Array(10).map((room, index) => {
                            return (
                                <TableRow
                                    key={room.id ?? `${room.title}-${index}`}
                                    sx={{
                                        "&:last-child td": { borderBottom: "none" },
                                    }}
                                >
                                    <TableCell>

                                    </TableCell>
                                    <TableCell>123</TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle2">
                                            456
                                        </Typography>
                                    </TableCell>
                                    <TableCell>

                                    </TableCell>
                                    <TableCell>

                                    </TableCell>
                                    <TableCell>
                                        <Stack spacing={0.5}>
                                            <Typography variant="subtitle2">789</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                000
                                            </Typography>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default StudentsSection;
