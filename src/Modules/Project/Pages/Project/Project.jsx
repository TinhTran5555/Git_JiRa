import React, { useEffect } from 'react';

import { alpha, Container } from '@mui/system';
import {
  Typography,
  Box,
  styled,
  Chip,
  colors,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Table,
  Button,
  TextField,
  InputBase 
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';

import { useDispatch, useSelector } from 'react-redux';

import { useRequest } from '../../../../app/hooks/request/useRequest';
import projectAPIs from '../../../../app/apis/projectAPIs/projectAPIs';

import Loader from '../../../../UI/Display/Loader';
import Members from '../../Components/Members';
import { useState } from 'react';
import DialogProject from '../../Components/DialogProject/DialogProject';
import DialogProjectDelete from '../../Components/DialogProject/DialogProjectDelete';
import {
  deleteProjectThunk,
  getAllProjectsThunk,


} from '../../slice/projectSlice';
import { authSelector, projectSelector } from '../../../../app/store';
import useAlert, {
  alertCase,
  initialAlertState,
} from '../../../../app/hooks/alert/useAlert';

const Heading = styled(Box)(({ theme }) => ({
  textAlign: 'left',
}));

const TableCellHead = styled(TableCell)(({ theme }) => ({
  fontSize: '12px',
  fontWeight: 700,
  color: colors.blueGrey[700],
  backgroundColor: colors.blueGrey[50],
  borderBottom: `none`,
}));

const TableCellBody = styled(TableCell)(({ theme }) => ({
  color: theme.palette.text,
  borderBottom: `1.5px solid ${colors.blueGrey[50]}`,
}));

const categoryProject = {
  app: 'Dự án phần mềm',
  web: 'Dự án web',
  mobile: 'Dự án di động',
};

const Project = () => {
  const [isDialogOpen, setIsDialog] = useState(false);
  const [projectPayload, setProjectPayload] = useState(null);
  const { alertState, dispatchAlert } = useAlert();
  const dispatch = useDispatch();

  const { data: userData } = useSelector(authSelector);
  const {
    searchs,
    projects,
    isLoading: getLoading,
    error: projectError,
  } = useSelector(projectSelector);
  console.log(projects);
console.log(searchs);
  const deleteProjectHandler = async (id) => {
    try {
      dispatch(deleteProjectThunk(id))
        .unwrap()
        .then(() => dispatch(getAllProjectsThunk()))
        .catch((error) => {
          throw error;
        });
      dispatchAlert({
        type: alertCase.success,
        payload: 'Delete Successfully',
      });
    } catch (error) {}
  };

  useEffect(() => {
    dispatch(getAllProjectsThunk());
  }, []);
  // useEffect(() => {
  //   dispatch(getSearchProjectsThunk());
  // },  );
  // useEffect((keyword) => {
  //   if (!keyword) {
      
  //     dispatch(getSearchProjectsThunk(""));
  //   } else {
  //     dispatch(getSearchProjectsThunk(keyword));
  //   }
  // }, keyword);

  const rows = projects?.map((row) => {
    const { id, projectName, categoryName, members, creator, description } =
      row;
    const formattedDescription = description.replace(/<[^>]*>/g, '');

    const dialogSettingHandler = (id, projectName) => {
      setIsDialog(true);
      setProjectPayload({ id, projectName });
    };



    return (
      <TableRow
        key={id}
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      >
        
        <TableCellBody>
          <Chip
            color={`${creator.name === userData.name ? 'success' : 'info'}`}
            size='small'
            sx={(theme) => ({
              borderRadius: '4px',
              fontSize: '12px',
            })}
            variant={`${
              creator.name === userData.name ? 'contained' : 'outlined'
            }`}
            label={`ID: ${id}`}
          />
        </TableCellBody>
        <TableCellBody
          sx={{
            maxWidth: 160,
          }}
        >
          <Typography variant='subtitle1' fontWeight={700}>
            {projectName}
          </Typography>
        </TableCellBody>
        <TableCellBody component='th' scope='row'>
          <Chip
            label={categoryName}
            sx={(theme) => ({
              color:
                categoryName === categoryProject['app']
                  ? theme.palette.primary.light
                  : categoryName === categoryProject['web']
                  ? colors.green[500]
                  : categoryName === categoryProject['mobile']
                  ? colors.amber[500]
                  : '',
              backgroundColor:
                categoryName === categoryProject['app']
                  ? alpha(theme.palette.primary.light, 0.2)
                  : categoryName === categoryProject['web']
                  ? colors.green[50]
                  : colors.amber[50],
            })}
          />
        </TableCellBody>
        <TableCellBody align='left'>
          <Members members={members} projectId={id} />
        </TableCellBody>
        <TableCellBody component='th' scope='row'>
          {creator.name}
        </TableCellBody>
        <TableCellBody
          sx={(theme) => ({
            maxWidth: 200,
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          })}
          align='left'
        >
          {formattedDescription}
        </TableCellBody>
        <TableCellBody align='left'>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Button color='success'>
              <FontAwesomeIcon icon={faPen} />
            </Button>
            <Button
              onClick={() => {
                dispatchAlert({ type: alertCase.reset });
                dialogSettingHandler(id, projectName);
              }}
              color='error'
            >
              <FontAwesomeIcon icon={faTrash} />
            </Button>
          </Box>
        </TableCellBody>
      </TableRow>
    );
  });


  return (
    <Container maxWidth='xl'>
      <DialogProject
        onClose={() => setIsDialog(false)}
        isDialogOpen={isDialogOpen}
        label={'Are you sure you want to delete this project?'}
        content={
          alertState.successMessage === '' ? (
            <DialogProjectDelete payload={projectPayload} />
          ) : (
            <Typography
              align='center'
              variant='h6'
              component='h2'
              color='green'
              fontWeight={700}
            >
              {alertState.successMessage}
            </Typography>
          )
        }
        actionError='Cancel'
        actionPrimary='Delete'
        payload={projectPayload}
        onControl={() => deleteProjectHandler(projectPayload.id)}
      />

      <Grid marginTop={2} container>
        <Grid xs={4}>
          <Heading>
            <Typography fontWeight={700} variant='h5' component='h1'>
              Project Management
            </Typography>         
          </Heading>
        </Grid>
      </Grid>
      {getLoading && <Loader />}
      {!getLoading && (
        <TableContainer
          sx={(theme) => ({
            position: 'relative',
            overflowYz: 'scroll',
            marginTop: '24px',
            maxHeight: '80vh',
            borderRadius: '4px',
          })}
        >
          <Table stickyHeader aria-label='sticky table'>
            <TableHead>
             
              <TableRow
                sx={(theme) => ({
                  backgroundColor: colors.blueGrey[50],
                })}
              >
                <TableCellHead align='left'>ID</TableCellHead>
                <TableCellHead align='left'>Project Name</TableCellHead>
                <TableCellHead align='left'>Category</TableCellHead>
                <TableCellHead align='left'>Members</TableCellHead>
                <TableCellHead align='left'>Creator</TableCellHead>
                <TableCellHead align='left'>Description</TableCellHead>
                <TableCellHead align='left'></TableCellHead>
              </TableRow>
            </TableHead>
            <TableBody>{rows}</TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default Project;