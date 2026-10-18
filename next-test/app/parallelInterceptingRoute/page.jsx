import Link from "next/link";
import Image from "next/image";
import {imageMap} from "./imageMap";

export default function ParallelRoutePage() {
	return <div>
		<div>Parallel route examples</div>
		<div className="grid grid-cols-3 gap-5">
			{imageMap.map((image) => {
				return <Link href={`/parallelInterceptingRoute/${image.id}`} key={`image-${image.id}`}>
					<Image src={image.src}
					       className="w-full object-cover aspect-square"
					       width={100}
					       height={100}
					       sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
					/>
				</Link>;
			})}
		</div>
	</div>;
}