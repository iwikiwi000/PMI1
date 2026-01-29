import { useEffect, useState } from 'react';
import User from '../components/User';
import axios from 'axios';
import api from "../api/token";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import AddIcon from "@mui/icons-material/Add";

export default function Admin(){

    const[users, setUsers] = useState([]);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const[newUser, setNewUser] = useState({name: "", role: "admin", password: ""});

    const handleRemoveUser = async (u_id) => {
        try {
            await api.delete(`/admin/deleteUser/${u_id}`);
            fetchUsers();
        } catch (err) {
            console.log("Error deleting User", err);
        }
    };

    const handleAdding = () => {
        setIsFormVisible(true);
    };

    const handleCancel = (e) => {
        e.preventDefault();
        setIsFormVisible(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewUser(prev => ({ ...prev, [name]: value }));
    };

    const actions = [
        { icon: <AddIcon />, name: "Add user", onClick: handleAdding },
    ];

    const handleFormSubmit = async(e) => {
        e.preventDefault();
        try{
            await api.post("/admin/addUser", newUser);
        
            setNewUser({ name: "", role: "", password: "" });
            console.log(newUser);
            setIsFormVisible(false);

            fetchUsers();
        }catch(err){
            console.log("Error adding new User", err);
        }
    };

    const fetchUsers = async() => {
        try{
            const res = await api.get("/admin/getUsers", {
        });
            setUsers(res.data);
        }catch(err){
            console.log("Error fetching users", err);
        }
    };

    useEffect(()=>{
        fetchUsers();
    }, []);

    return(
        <div className='m-4'>
            <h2>Používatelia</h2>
            {users.length > 0 ? (users.map((user)=>(
                <User
                key={user.u_id}
                name={user.name}
                role={user.role}
                onRemove={() => handleRemoveUser(user.u_id)}
                />
            ))):(
                <p>Nepodarilo sa nájsť žiadnych používateľov!</p>
            )}
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
            <h3>Pridať nového používateľa</h3>

            <label>Meno:</label>
            <input
                type="text"
                name="name"
                value={newUser.name}
                onChange={handleChange}
                required
                style={{ display: "block", marginBottom: "10px", width: "100%" }}
            />

            <label>Heslo:</label>
            <input
                type="password"
                name="password"
                value={newUser.password}
                onChange={handleChange}
                required
                style={{ display: "block", marginBottom: "10px", width: "100%" }}
            />

            <label>Rola:</label>
            <select 
                value={newUser.role} 
                onChange={handleChange}
                name="role"
                style={{ display: "block", marginBottom: "10px", width: "100%" }}
            >
                <option value="admin">Admin</option>
                <option value="viewer">Zhliadateľ</option>
            </select>

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
        </div>
    )
}