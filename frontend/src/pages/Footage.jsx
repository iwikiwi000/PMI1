import { useEffect, useState } from "react";
import Recording from "../components/Recording";

export default function Footage(){

    const [error, setError] = useState();

    return(
        <>
        <h3 className="my-3">Archív záznamov</h3>
            <div className='d-flex flex-column m-5' style={{ display: "flex", gap: "10px" }}>
                <div className="d-flex flex-row">
                    <Recording></Recording>
                </div>

                <div className="d-flex flex-row">
                    <Recording></Recording>
                </div>

                <div className="d-flex flex-row">
                    <Recording></Recording>
                </div>

                <div className="d-flex flex-row">
                    <Recording></Recording>
                </div>
            </div>
        </>
    )
}