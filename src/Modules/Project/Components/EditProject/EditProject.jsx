import React, { useEffect, useReducer, useState } from "react";

import { Container } from "@mui/system";
import {
  Chip,
  InputLabel,
  Box,
  TextField,
  Typography,
  colors,
  alpha,
  styled,
  Alert,
  Button,
  Drawer,
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import RichTextEditor from "../../Pages/CreateProject/RichTextEditor";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faPen } from "@fortawesome/free-solid-svg-icons";

import { useRequest } from "../../../../app/hooks/request/useRequest";
import projectCategory from "../../../../app/apis/projectCategory/projectCategory";
import { useForm } from "react-hook-form";

import { useDispatch, useSelector } from "react-redux";
import { projectSelector } from "../../../../app/store";

import {
  updateProjectThunk,
  getProjectDetailThunk,
  getAllProjectsThunk,
} from "../../slice/projectSlice";
import { current } from "@reduxjs/toolkit";

const { getProjectCategory } = projectCategory;
const categoryProjectMap = {
  app: "Dự án phần mềm",
  web: "Dự án web",
  mobile: "Dự án di động",
};

const CategorySelection = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-start",
  gap: "8px",
  alignItems: "center",
}));
const alertCase = {
  loading: "ALERT_LOADING",
  error: "ALERT_ERROR",
  success: "ALERT_SUCCESS",
};

const initialAlertState = {
  isLoading: false,
  errorMessage: "",
  successMessage: "",
};

const alertReducer = (state, { type, payload }) => {
  switch (type) {
    case alertCase.loading:
      return {
        ...state,
        isLoading: true,
      };
    case alertCase.error:
      return {
        ...state,
        isLoading: false,
        successMessage: "",
        errorMessage: payload,
      };
    case alertCase.success:
      return {
        ...state,
        isLoading: false,
        errorMessage: "",
        successMessage: "Edit Project Successfully",
      };
    default:
      return state;
  }
};

export default function EditProject(projectId) {
  const { dataFromParent } = projectId;

  const { projectDetail } = useSelector(projectSelector);

  const [state, setState] = React.useState({
    right: false,
  });


  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };
  const { data: projectCategory } = useRequest(getProjectCategory);
  const [alertState, dispatchAlert] = useReducer(
    alertReducer,
    initialAlertState
  );
  const [project, setProject] = useState({
    projectName: "",
    description: "",
    categoryId: "",
  }); //

  const [selectedCategory, setSelectedCategory] = useState(null); //
  // const [description, setDescription] = useState(null); //
  // const [tfValue, setTFValue] = useState(null); //
  const dispatch = useDispatch();

  const {
    handleSubmit,

    formState: { errors },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
     
    },
  });
  //Neu em ko biet xai react-hook-form thi viet thuan
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProject((current) => {
      return {
        ...current,
        [name]: value,
      };
    });
  };


  useEffect(() => {
    if (projectDetail) {
      setProject(projectDetail);
      // const name = projectDetail.projectName;
      // setTFValue(name);

      // const desc = projectDetail.description;
      // setDescription(desc);

      if (projectDetail.projectCategory) {
        const seleccategory = projectDetail?.projectCategory.id;
        setSelectedCategory(seleccategory);
      }
    }
  }, [projectDetail]);

  const onSubmit = async () => {
    const projectInfo = {
      projectName: project.projectName,
    description: project.description,
    categoryId: project.categoryId,
    id: projectDetail.id
    }
    console.log(projectInfo);
    
    try {

      dispatch(updateProjectThunk(projectInfo))
        .unwrap()
        .then(() => dispatch(getAllProjectsThunk()))
        .catch((error) => {
          throw error;
        });


      dispatchAlert({ type: alertCase.loading });
      if (!selectedCategory) {
        dispatchAlert({
          type: alertCase.error,
          payload: "You haven't selected category",
        });
        return;
      }

      // const data = await dispatch(updateProjectThunk(projectInfo)).unwrap();

      dispatchAlert({
        type: alertCase.success,
        payload: "Edit Successfully",
      });
    } catch (error) {
      console.log(error);
      dispatchAlert({
        type: alertCase.error,
        payload: error,
      });
    }
  };

  const selectCategoryHandler = (id) => {
    if (selectedCategory !== id) {
      setSelectedCategory(id);
    } else {
      setSelectedCategory(null);
    }
  };

  const activeCategoryStyle = (id, theme) => {
    if (selectedCategory === id) {
      return {
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.common.white,
      };
    }
  };

  // const watchEditor = (html) => {
  //   setDescription(html);
  // };

  const list = (anchor) => (
    <Container sx={{ marginTop: "32px", width: 700 }} maxWidth="lg">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Typography variant="h5" fontWeight={700}>
          Create New Project
        </Typography>
        <Grid2 sx={{ textAlign: "left" }} container>
          <Grid2 marginTop={2} xs={4}>
            <InputLabel
              sx={{
                fontSize: "14px",
                fontWeight: 700,
                color: colors.grey[900],
              }}
            >
              Project Name
            </InputLabel>
            <TextField
              size="small"
              value={project?.projectName}
              name="projectName"
              // onChange={(event) => {
              //   setTFValue(event.target.value);
              // }}
              onChange={handleChange}
              placeholder="Input your project's name"
              // {...register("projectName", {
              //   required: {
              //     value: true,
              //     message: "This is required",
              //   },
              //   pattern: {
              //     value: /^[^'"!@#$%^&*()?,:;~`+=-]*$/,
              //     message: "Not contain special character",
              //   },
              // })}

              fullWidth
              color={errors.projectName ? "error" : ""}
              error={!!errors.projectName}
              helperText={errors.projectName?.message}
            />
          </Grid2>
        </Grid2>
        <Grid2 marginTop={2} container>
          <Grid2 marginBottom={1} xs={12}>
            <Typography
              sx={{ display: "block" }}
              align="left"
              variant="subtitle1"
              fontWeight={700}
            >
              Write description
            </Typography>
          </Grid2>
          <textarea name="description" id="" cols="30" rows="10" value={project?.description} onChange={handleChange}></textarea>
          {/* <Grid2 xs={8}>
            <RichTextEditor
              value={project?.description}
              onWatch={(state) => watchEditor(state)}
            />
          </Grid2> */}
        </Grid2>
        <Grid2 marginTop={2} container>
          <Grid2 xs={12}>
            <Typography
              sx={{ display: "block", marginBottom: "16px" }}
              align="left"
              variant="subtitle1"
              fontWeight={700}
            >
              Project Category
            </Typography>
            <Grid2 xs={12}>
              <CategorySelection>
                {projectCategory?.map((item) => (
                  <Chip
                    key={item.id} 
                    name="categoryId"
                    value={item.id}
                    sx={(theme) => ({
                      color:
                        item.projectCategoryName === categoryProjectMap["app"]
                          ? theme.palette.primary.light
                          : item.projectCategoryName ===
                            categoryProjectMap["web"]
                          ? colors.green[500]
                          : colors.amber[500],
                      backgroundColor:
                        item.projectCategoryName === categoryProjectMap["app"]
                          ? alpha(theme.palette.primary.light, 0.2)
                          : item.projectCategoryName ===
                            categoryProjectMap["web"]
                          ? colors.green[50]
                          : colors.amber[50],
                      "&:hover": {
                        backgroundColor:
                          selectedCategory === item.id
                            ? theme.palette.secondary.light
                            : item.projectCategoryName ===
                              categoryProjectMap["app"]
                            ? alpha(theme.palette.primary.main, 0.2)
                            : item.projectCategoryName ===
                              categoryProjectMap["web"]
                            ? colors.green[100]
                            : colors.amber[100],
                      },
                      ...activeCategoryStyle(item.id, theme),
                    })}
                    onClick={() =>{ selectCategoryHandler(item.id) ;
                      setProject((current) => {
                        return {
                          ...current,
                          categoryId: item.id
                        }
                      })
                    
                    }} 
                    
                    label={item.projectCategoryName}
                  />
                ))}
              </CategorySelection>
              <InputLabel></InputLabel>
            </Grid2>
          </Grid2>
        </Grid2>
        <Grid2 marginTop={4} container>
          <Box>
            <Button
              type="submit"
              sx={{ borderRadius: "8px" }}
              variant="contained"
              color="primary"
              disabled={alertState.isLoading}
            >
              Update Project
            </Button>
          </Box>
        </Grid2>
      </form>
      <Grid2 container>
        <Grid2>
          <Box marginTop={4}>
            {alertState.errorMessage ? (
              <Alert severity="error">{alertState.errorMessage}</Alert>
            ) : alertState.successMessage ? (
              <Alert severity="success">{alertState.successMessage}</Alert>
            ) : null}
          </Box>
        </Grid2>
      </Grid2>
    </Container>
  );

  return (
    <div>
      <React.Fragment key={"right"}>
        <Button color="success" onClick={toggleDrawer("right", true)}>
          <FontAwesomeIcon
            icon={faPen}
            onClick={() => {
              dispatch(getProjectDetailThunk(dataFromParent));
            }}
          />
        </Button>
        <Drawer
          anchor={"right"}
          open={state["right"]}
          onClose={toggleDrawer("right", false)}
        >
          {list("right")}
        </Drawer>
      </React.Fragment>
    </div>
  );
}

