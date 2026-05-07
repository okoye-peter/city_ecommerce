import api from "@/src/lib/axios";
import { ApiResponse } from "../auth/api";

export const verifyIdentity = (payload: { verificationType: string; verificationId: string }): Promise<ApiResponse<null>> =>
    api.post('/users/verify-identity', payload).then(r => r.data)