import { useEffect, useState } from "react";
import { Market } from "../types";
import { getMarkets } from "../services/market.service";

export const useGetMarkets = () => {
    const [markets, setMarkets] = useState<Market[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchMarkets = () => {
        setLoading(true);
        setError(null);
        getMarkets()
            .then((data) => setMarkets(data.data))
            .catch(err => setError(err.message || 'Failed to fetch markets'))
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchMarkets(); }, []);

    return { markets, loading, error, refetch: fetchMarkets };
}