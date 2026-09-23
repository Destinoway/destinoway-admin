export const useAdmins = () => {
  return useQuery({
    queryKey: ["admins"],
    queryFn: () =>
      getUsers({
        type: "admin",
      }),
  });
};
