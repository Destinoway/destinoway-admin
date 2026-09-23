let messageApi;

export const setMessageInstance = (api) => {
  messageApi = api;
};

export const showMessage = {
  success: (msg) => messageApi?.success(msg),
  error: (msg) => messageApi?.error(msg),
};