import { useLoadingBar } from "react-top-loading-bar";

function useTopLoadingBar(): { start: () => void; complete: () => void; } {
    const { start, complete } = useLoadingBar({
        color: "#007aff",
        height: 3,
    });

    return { start, complete };
}

export default useTopLoadingBar;