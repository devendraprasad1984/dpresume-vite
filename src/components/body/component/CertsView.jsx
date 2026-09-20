import {useMemo} from "react";
import {generateHexColor} from "../../../core/colors";

const imgStyle = {
	padding: "10px",
	height: "220px",
	width: "350px"
};
const certs = [
	"cert1.png",
	"cert2.png",
	"cert3.png"
];
const CertsView = () => {
	return <div className="col gap2 margin--y-20">
		<h2 className="underline bold text-success">Certificates</h2>
		<div className="grid grid3x3 pad5 gap5 mflex mcol">
			{certs.map((c, i) => {
				const color = useMemo(() => generateHexColor(), []);
				const colorStyle = {border: `5px solid ${color}`};
				return <a href={`/images/${c}`} target="_blank">
					<img key={`cert-${c}-${i}`} style={{...imgStyle, ...colorStyle}} height="200px" width="200px" src={`/images/${c}`}/>
				</a>
			})}
		</div>
	</div>;
};
export default CertsView;