import { useMutation } from "@tanstack/react-query";
import { verifyIdentity } from "./api";
import { useGetAuthUser } from "../auth/queries";

export const useVerifyIdentity = () => {
    const { mutateAsync: refreshUser } = useGetAuthUser()

    return useMutation({
        mutationFn: verifyIdentity,
        onSuccess: async () => {
            try {
                await refreshUser()
            } catch (e) {
                console.error('refreshUser failed:', e)
            }
        },
    })
}