import  axiosClient  from '../axiosClient';

const projectAPIs = {
  getAllProjects: () => {
    return axiosClient.get('Project/getAllProject');
  },

  getSearchProjects: (keyword) => {
    if (!keyword) {
      return axiosClient.get("Project/getAllProject");
    } else {
      return axiosClient.get("Project/getAllProject", {
        params: {
         keyword: keyword,
        },
       
      });
    }
    
  },
  getProjectDetail: (id) => {
  
    const params = new URLSearchParams();
    params.append('id', id);
    return axiosClient.get('Project/getProjectDetail', {
      params,
    });
  },

  createProject: (projectInfo) => {
    return axiosClient.post('Project/createProjectAuthorize', projectInfo);
  },

  deleteProject: (id) => {
    const params = new URLSearchParams();
    params.append('projectId', id);
    return axiosClient.delete('Project/deleteProject', {
      params,
    });
  },
  updateProject: (id) => {
    const params = new URLSearchParams();
    params.append('projectId', id);
    return axiosClient.put('Project/updateProject', {
      params,
    });
  },
 
  removeUserFromProject: (userProject) => {
   
    return axiosClient.post('Project/removeUserFromProject', userProject);
  },

  assignUser: (userProject) => {
    return axiosClient.post('Project/assignUserProject', userProject);
  },
};

export default projectAPIs;
