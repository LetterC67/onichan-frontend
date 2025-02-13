import { FireSVG } from "./svg";

function Loading(): JSX.Element {
    return (
        <div className="loading">
            <FireSVG />
            <div className="loading__content">loading</div>
        </div>
    );
}

export default Loading;