import { Link } from 'react-router-dom';

export default function PageNotFound(){
    return(
        <div className="error-page text-center p-5">
            <img src={"/assets/404 error with portals-rafiki.png"} alt="404" className="img-fluid mb-4" style={{maxHeight: '300px'}} />
            <h2>Stránka nenájdená</h2>
            <p>Táto stránka neexistuje.</p>
        </div>
    );
}
