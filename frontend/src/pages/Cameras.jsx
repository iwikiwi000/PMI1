import Camera from "../components/Camera";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import api from "../api/token";

import { useEffect, useState } from "react";
import axios from "axios";

import "../css/cameras.css";
import { useCameraStore } from "../storage/cameraStorage";

export default function Cameras() {
    const {cameras, fetchCameras, removeCamera, loading} = useCameraStore();
    const [newCamera, setNewCamera] = useState({title: "", source: ""});
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [bitrateData, setBitrateData] = useState({});

    useEffect(()=>{
        fetchCameras();
    }, [fetchCameras]);

    const handleFormSubmit = async(e) => {
        e.preventDefault();

        await api.post("/cameras", {
            title: newCamera.title,
            source: newCamera.source,
        });
        setNewCamera({ title: "", link: "" });
        setIsFormVisible(false);
    };

    useEffect(() => {
    const interval = setInterval(async () => {
        try {
        const res = await api.get("/cameras/streams/status");
        setBitrateData(res.data);
        } catch (err) {
        console.error("Chyba pri načítaní bitrate:", err);
        }
    }, 1000);

    return () => clearInterval(interval);
    }, []);

    if(loading) return <p>Načítava sa ...</p>

    const handleCancel = (e) => {
        e.preventDefault();
        setIsFormVisible(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewCamera(prev => ({ ...prev, [name]: value }));
    };

    const handleAdding = () => {
        setIsFormVisible(true);
    };

    const handleRemoving = async (id) => {
        await removeCamera(id);
    };

    const actions = [
        { icon: <AddIcon />, name: "Add camera", onClick: handleAdding },
    ];

    return (
        <div style={{ display: "flex", gap: "10px", position: "relative", padding: "20px" }}>

        {isFormVisible && (
            <form
            onSubmit={handleFormSubmit}
            className="form-container"
            style={{
                position: "absolute",
                top: "50px",
                left: "50%",
                transform: "translateX(-50%)",
                backgroundColor: "#ffffffff",
                padding: "20px",
                borderRadius: "8px",
                boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
                zIndex: 10,
                width: "300px",
            }}
            >
            <h3>Pridať novú kameru</h3>

            <label>Názov kamery:</label>
            <input
                type="text"
                name="title"
                value={newCamera.title}
                onChange={handleChange}
                required
                style={{ display: "block", marginBottom: "10px", width: "100%" }}
            />

            <label>RTSP URL kamery:</label>
            <input
                type="text"
                name="source"
                value={newCamera.source || ""}
                onChange={handleChange}
                required
                style={{ display: "block", marginBottom: "10px", width: "100%" }}
            />

            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button
                type="submit"
                style={{
                    backgroundColor: "#ff6b17",
                    color: "white",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "4px",
                }}
                >
                Pridať
                </button>
                <button
                onClick={handleCancel}
                style={{
                    backgroundColor: "gray",
                    color: "white",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "4px",
                }}
                >
                Zrušiť
                </button>
            </div>
            </form>
        )}

        {cameras.map((cam) => (
            <div key={cam.c_id} style={{ position: "relative" }}>
                <Camera 
                    link={cam.link} 
                    title={cam.title}
                    cameraName={cam.title.toLowerCase().replace(/\s+/g, "_")}
                    bitrate={bitrateData[cam.title.toLowerCase().replace(/\s+/g, "_")]?.bitrate || 0}
                />

                <button
                    onClick={() => handleRemoving(cam.c_id)}
                    style={{
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        background: "rgba(0, 0, 0, 0.7)",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        padding: "4px 8px",
                        cursor: "pointer",
                    }}
                >
                    ✕
                </button>
            </div>
        ))}


        <SpeedDial
            ariaLabel="Camera actions"
            sx={{
            position: "absolute",
            bottom: 16,
            right: 16,
            "& .MuiFab-primary": {
                backgroundColor: "#ff6b17",
                "&:hover": { backgroundColor: "#e65c00" },
            },
            }}
            icon={<SpeedDialIcon />}
        >
            {actions.map((action) => (
            <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
                onClick={action.onClick}
            />
            ))}
        </SpeedDial>
        </div>
    );
}