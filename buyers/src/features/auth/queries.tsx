import { useMutation } from "@tanstack/react-query";
import { sendEmailVerification, verifyEmail } from "./api";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/store/slices/authSlice";
import { storage } from "@/libs/storage";


export const useSendEmailVerification = () =>
    useMutation({ mutationFn: sendEmailVerification })

export const useVerifyEmail = () => {
    const dispatch = useDispatch();
    return useMutation({
        mutationFn: ({ email, otp }: { email: string; otp: string }) =>
            verifyEmail(email, otp),
        onSuccess: async (data) => {
            const {user, accessToken, refreshToken} = data.data;
            storage.setAccessToken(accessToken)
            storage.setUser(user)
            await storage.setRefreshToken(refreshToken)
            dispatch(setCredentials({ user, accessToken }))
        }
    })
}