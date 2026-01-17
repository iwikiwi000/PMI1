import { Link } from 'react-router-dom';

export default function ServerError(){
    return(
        <div className="error-page text-center p-5">
            <img src="/assets/500 Internal Server Error-pana.png" alt="500" className="img-fluid mb-4" style={{maxHeight: '300px'}} />
            <h2>Server chyba</h2>
            <p>Skús neskôr.</p>
        </div>
    );
}
