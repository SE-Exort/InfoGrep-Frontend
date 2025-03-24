import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { selectSessions } from '../../redux/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { AppDispatch } from '../../redux/store';
import { sessionsListThunk } from '../../redux/slices/authSlice';

export default function SessionsList() {
    const sessions = useSelector(selectSessions);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(sessionsListThunk());
    }, [dispatch])

    return (
        <TableContainer component={Paper}>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Session</TableCell>
                        <TableCell >Timestamp</TableCell>
                        <TableCell >Logged out</TableCell>
                        <TableCell >IP Address</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sessions.map((s) => (
                        <TableRow
                            key={s.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {s.id}
                            </TableCell>
                            <TableCell >{s.timestamp}</TableCell>
                            <TableCell >{s.logged_out.toString()}</TableCell>
                            <TableCell >{s.ip_address}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}