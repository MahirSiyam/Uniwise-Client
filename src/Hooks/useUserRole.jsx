import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from './useAxiosSecure';
import { use } from 'react';
import { AuthContext } from '../Provider/AuthProvider';


const useUserRole = () => {
    const { user, loading: authLoading } = use(AuthContext);
    const axiosSecure = useAxiosSecure();

    const {
        data: role = 'user',
        isLoading: roleLoading,
        refetch,
    } = useQuery({
        queryKey: ['userRole', user?.email],
        enabled: !authLoading && !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/${user.email}/role`);
            return res.data.role;
        },
    });

    return { role, roleLoading: authLoading || roleLoading, refetch };
};

export default useUserRole;