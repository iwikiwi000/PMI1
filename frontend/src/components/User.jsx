import '../css/User.css'

export default function User({ name, role, onRemove }) {
    
    return (
        <div className="user p-2">
            <div className="user-info">
                <p className="user-name mt-3 mx-3">{name}</p>
                <p className="user-role mt-3">{role}</p>
            </div>

            <div className="user-actions">
                <button onClick={onRemove}>Odstrániť</button>
            </div>
        </div>
    );
}
