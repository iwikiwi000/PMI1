import Camera from "../components/Camera";

export default function Cameras(){

    return(
        <div style={{ display: "flex", gap: "10px" }}>
            <Camera streamUrl="http://localhost:5000/hls/cam1/stream.m3u8" title="Kamera" />
            <Camera streamUrl="http://localhost:5000/hls/cam2/stream.m3u8" title="Termo Kamera" />
        </div>
    )
}