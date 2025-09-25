import useSWR from "swr";

import axios from "axios";

const fetcher = (obj) => axios.get(obj.url, {
    params: {
        game: obj.game,
    }
}).then((res) => res.data);

const options = {
    dedupingInterval: ((1000 * 60) * 30),
    // fallbackData: []
}

const useGameScoreboard = (params) => {

    const { data, error, isLoading, isValidating, mutate } = useSWR(
        params?.game ?
            {
                url: "https://articles.media/api/community/games/scoreboard",
                // url: "http://localhost:3001/api/community/games/scoreboard",
                game: params.game,
            }
            :
            null,
        fetcher,
        options
    );

    return {
        data,
        error,
        isLoading,
        isValidating,
        mutate,
    };
};

export default useGameScoreboard;