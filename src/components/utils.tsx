import rough from "roughjs";

const scrollToBottom = () => {
    window.scrollTo({ left: 0, top: document.body.scrollHeight, behavior: "smooth" });
}


function scrollPostIntoView(postID: string | number) {
    const post = document.getElementById(`post-${postID}`);
    const navbarHeight = document.querySelector('.navbar')?.clientHeight || 0;


    if (post) {
        const postPosition = post.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = postPosition - navbarHeight;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

const Input = (props: any) => {
    return (
        <div style={{ position: "relative" }}>
            <input
                placeholder={props.placeholder}
                type={props.type ? props.type : "password"}
                value={props.value}
                onChange={(e) => props.setValue(e.target.value)}
                style={{ width: "100%", border: "none", outline: "none" }}
            />
            <canvas
                ref={props.canvasRef}
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    pointerEvents: "none",
                }}
            />
        </div>
    )
}

const drawRoughBorder = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (canvas) {
        const rc = rough.canvas(canvas);
        const width = canvas.offsetWidth;
        
        const color = getComputedStyle(document.documentElement).getPropertyValue("--secondary-color").trim();
    
        rc.line(0, 0, width, 0, {
            roughness: 2,
            strokeWidth: 2,
            stroke: color,
        });
    }
};


export { scrollToBottom, scrollPostIntoView, Input, drawRoughBorder };