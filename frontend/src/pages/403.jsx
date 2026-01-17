import { Link } from 'react-router-dom';

export default function AutorizationError(){
    return(
        <div className="error-page text-center p-5">
            <img src="/assets/403 Error Forbidden-pana.png" alt="403" className="img-fluid mb-4" style={{maxHeight: '300px'}} />
            <h2>Zakázaný prístup</h2>
            <p>Nemáš oprávnenie.</p>
        </div>
    );
}
