import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import {
  Box,
  Paper,
  MenuList,
  MenuItem,
  ListItemIcon,
  ListItemText,
  colors,
  Typography,
  Divider,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBarsProgress,
  faBorderNone,
  faBug,
  faChartSimple,
  faFilter,
  faGear,
  faPager,
  faSection,
  faShip,
} from '@fortawesome/free-solid-svg-icons';
import { NavLink, useLocation, useParams } from 'react-router-dom';

const SidebarWrapper = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 72,
  display: 'flex',
  flexDirection: 'column',
  textAlign: 'left',
  height: '100vh',
  width: '240px',
  overflowX: 'hidden',
  backgroundColor: colors.grey[100],
}));

const ProjectOverview = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
  marginLeft: '8px',
  marginRight: '8px',
  display: 'flex',
  alignItems: 'center',
  textAlign: 'center',
}));

const mainMenuData = [
  {
    label: 'Kaban Board',
    icon: <FontAwesomeIcon icon={faChartSimple} />,
    link: 'project/board',
  },
  {
    label: 'Project Setting',
    icon: <FontAwesomeIcon icon={faGear} />,
    link: 'project/setting',
  },
];

const featuresMenuData = [
  {
    label: 'Releases',
    icon: <FontAwesomeIcon icon={faShip} />,
  },
  {
    label: 'Issues and Filter',
    icon: <FontAwesomeIcon icon={faFilter} />,
  },
  {
    label: 'Pages',
    icon: <FontAwesomeIcon icon={faPager} />,
  },
  {
    label: 'Reports',
    icon: <FontAwesomeIcon icon={faBug} />,
  },
  {
    label: 'Components',
    icon: <FontAwesomeIcon icon={faSection} />,
  },
];

const Sidebar = () => {
  const [isMouseEnterData, setIsMouseEnterData] = useState(null);

  return (
    <SidebarWrapper>
      <ProjectOverview>
        <img height='48px' src='/project.png' alt='project.png' />
        <Box sx={{ width: '100%' }}>
          <Typography variant='subtitle2' component='h1'>
            Jira Cloner
          </Typography>
          <Typography
            variant='body1'
            fontWeight={700}
            sx={(theme) => ({
              color: theme.palette.primary.main,
            })}
          >
            ProjectName
          </Typography>
        </Box>
      </ProjectOverview>
      <Paper
        sx={(theme) => ({
          width: 320,
          maxWidth: '100%',
          backgroundColor: 'transparent',
          boxShadow: 'unset',
          color: colors.grey[900],
        })}
      >
        <MenuList>
          {mainMenuData.map((item) => (
            <NavLink
              key={item.label}
              style={{
                textDecoration: 'none',
              }}
              to={item.link}
            >
              {({ isActive }) => (
                <MenuItem
                  sx={(theme) => ({
                    padding: '12px 24px',
                    backgroundColor: isActive ? colors.grey[200] : undefined,
                  })}
                >
                  <ListItemIcon
                    sx={(theme) => ({
                      color: isActive
                        ? theme.palette.primary.dark
                        : colors.grey[900],
                    })}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    sx={(theme) => ({
                      color: isActive
                        ? theme.palette.primary.dark
                        : colors.grey[900],
                    })}
                  >
                    {item.label}
                  </ListItemText>
                </MenuItem>
              )}
            </NavLink>
          ))}
        </MenuList>
        <Divider />
        <MenuList>
          {featuresMenuData.map((item) => (
            <MenuItem
              key={item.label}
              onMouseEnter={() => setIsMouseEnterData(item.label)}
              onMouseLeave={() => setIsMouseEnterData(null)}
              sx={{
                cursor: 'not-allowed',
                padding: '12px 24px',
                '&:hover': {
                  backgroundColor: 'transparent',
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              {isMouseEnterData !== item.label && (
                <ListItemText>{item.label}</ListItemText>
              )}
              {isMouseEnterData === item.label && (
                <ListItemText
                  sx={(theme) => ({
                    color: colors.blueGrey[600],
                    backgroundColor: colors.grey[300],
                    fontWeight: 700,
                    borderRadius: '2px',
                    padding: '0 8px',
                    transform: 'scale(110%)',
                  })}
                >
                  Not Implemented
                </ListItemText>
              )}
            </MenuItem>
          ))}
        </MenuList>
      </Paper>
    </SidebarWrapper>
  );
};

export default Sidebar;
