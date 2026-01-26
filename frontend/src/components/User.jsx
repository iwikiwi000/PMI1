import '../css/User.css'

export default function User({ name, role, onRemove }) {
    
    return (
        <div className="user">
            <div className="user-info">
                <p className="user-name">{name}</p>
                <p className="user-role">{role}</p>
            </div>

            <div className="user-actions">
                <button onClick={onRemove}>Odstrániť</button>
            </div>
        </div>
    );
}
