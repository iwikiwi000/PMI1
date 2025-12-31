import test from '../assets/image.png';

export default function Recording() {
  return (
    <div className="mb-2">
      <p className="text-start fw-bold">Kamer na chodbe</p>

      <div className="d-flex gap-2 flex-wrap">
        <div>
            <img src={test} alt="recording" style={{
                width: "360px",
                height: "200px",
                objectFit: "cover",
                borderRadius: "6px"
            }} />
            <p>11.10.2025</p>
        </div>
        <div>
            <img src={test} alt="recording" style={{
                width: "360px",
                height: "200px",
                objectFit: "cover",
                borderRadius: "6px"
            }} />
            <p>12.10.2025</p>
        </div>
        <div>
            <img src={test} alt="recording" style={{
                width: "360px",
                height: "200px",
                objectFit: "cover",
                borderRadius: "6px"
            }} />
            <p>13.10.2025</p>
        </div>
        
      </div>
    </div>
  );
}