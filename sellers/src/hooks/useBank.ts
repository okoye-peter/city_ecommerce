import { useEffect, useState } from "react";
import { Bank } from "../types";
import { getBanks } from "../services/bank.service";

export const useGetBanks =  () => {
    const [banks, setBanks] = useState<Bank[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchBanks = () => {
        setLoading(true);
        setError(null);
        getBanks()
            .then((data) => setBanks(data.data))
            .catch(err => setError(err.message || 'Failed to fetch banks'))
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchBanks(); }, []);

    return { banks, loading, error, refetch: fetchBanks };
}