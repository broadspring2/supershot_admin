import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DownloadIcon from '@mui/icons-material/Download';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { client } from '../../routes/routes';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from "react-router-dom";
import { darken, lighten } from '@mui/material/styles';
import './styles.css'

const headingTextStyle = {
    fontWeight: 550,
}

export default function DataTable(props) {
    const rows = props.data
    const [selectedRows, setSelectedRows] = React.useState([]);
    let navigate = useNavigate();

    function routeChange(data) {
        let path = `/management/` + data;
        navigate(path);

    }

    const columns = [
        { field: 'id', headerName: '번호', width: 90 },
        {
            field: 'fileName',
            headerName: '파일명',
            width: 450,
            editable: true,
            renderCell: (params) => {
                const onClick = (e) => {
                    e.stopPropagation();

                    const api = params.api;
                    const thisRow = {};

                    api
                        .getAllColumns()
                        .filter((c) => c.field !== '__check__' && !!c)
                        .forEach(
                            (c) => (thisRow[c.field] = params.getValue(params.id, c.field)),
                        );
                    return routeChange(thisRow["id"]);

                };
                return <Button onClick={onClick}>{params.row['fileName']}</Button>;
            },
        },
        {
            field: 'status',
            headerName: '상태',
            width: 110,
            editable: true,
        },
        {
            field: 'date',
            headerName: '등록일자',
            width: 140,
            editable: true,
        },
        {
            field: 'device_id',
            headerName: '디바이스 ID',
            width: 200,
            editable: true,
        },
        {
            field: 'flag_size',
            headerName: '깃발 크기',
            width: 200,
            editable: true,
        }
    ];


    const downloadImage = () => {
        selectedRows.map((item) => {
            let dataId = item['id']
            const FileSaver = require('file-saver');
            let path = 'getimage/' + dataId
            client.get(path, { responseType: 'blob' }).then((response) => {
                FileSaver.saveAs(response.data, item['fileName']);
            })
        })

    }

    const getBackgroundColor = (color, mode) =>
        mode === 'dark' ? darken(color, 0.6) : lighten(color, 0.6);

    return (
        <div>
            <Typography variant="h7" noWrap component="div"
                sx={headingTextStyle}>
                이미지리스트 (총 건수 : {rows.length} 건)
            </Typography>
            <Divider sx={{ padding: 2, border: 'none' }} />
            <Box sx={{
                height: 860, width: '100%',
                '& .super-app-theme--unsuccess': {
                    bgcolor: (theme) =>
                        getBackgroundColor(theme.palette.warning.main, theme.palette.mode),
                },
            }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={15}
                    rowHeight={50}
                    rowsPerPageOptions={[15]}
                    getRowClassName={(params) => `super-app-theme--${params.row.status}`}
                    checkboxSelection
                    experimentalFeatures={{ newEditingApi: true }}
                    onSelectionModelChange={(ids) => {
                        const selectedIDs = new Set(ids);
                        const selectedRows = rows.filter((row) =>
                            selectedIDs.has(row.id),
                        );

                        setSelectedRows(selectedRows);
                    }}
                />
            </Box>
            <Divider sx={{ padding: 1, border: 'none' }} />
            <Button variant="contained" className='downloadButton' startIcon={<DownloadIcon />} onClick={downloadImage}>다운로드</Button>
            {/* <Button variant="outlined" className='selectBtn' sx={btnStyle} size="small">삭제</Button> */}

        </div>
    );
}
