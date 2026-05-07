import { useEffect, useState } from "react";
import { Category } from "../types";
import { getCategories } from "../services/category.service";

export const useGetCategories = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCategories = () => {
        setLoading(true);
        setError(null);
        getCategories()
            .then((data) => setCategories(data.data))
            .catch(err => setError(err.message || 'Failed to fetch categories'))
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchCategories(); }, []);

    return { categories, loading, error, refetch: fetchCategories };
}