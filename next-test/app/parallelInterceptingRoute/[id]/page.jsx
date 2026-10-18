import Image from "next/image";
import {imageMap} from "../imageMap";

export default async function photoIdPage(props) {
	const params = await props.params;
	const photoId = params.id;
	const image = imageMap.find(p => Number(p.id) === Number(photoId));
	const photo = image?.src || null;
	const found = photo !== null;
	return <div>
		<div>Photo id page: {photoId} - full view</div>
		{found && <Image src={photo}
		                 className="w-full object-cover aspect-square"
		                 width={100}
		                 height={100}
		                 sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
		/>}
	</div>;
}