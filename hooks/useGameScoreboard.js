import useSWR from "swr";

// import axios from "axios";

const fetcher = async (obj) => {
    const url = new URL(obj.url, window.location.origin);
    url.searchParams.append("game", obj.game);
    const response = await fetch(url.toString(), {
        method: "GET",
        credentials: "same-origin",
        headers: {
            "Accept": "application/json"
        }
    });
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return response.json();
};

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