import {imageMap} from "../../imageMap";
import Modal from "../../modal";

export default async function InterceptingModal(props) {
	const params = await props.params;
	const photoId = params.id;
	const image = imageMap.find(p => Number(p.id) === Number(photoId));
	const photo = image?.src || null;
	const found = photo !== null;
	return <Modal>
		<div>Photo id page: {photoId} - full view</div>
		{found && <Image src={photo}
		                 alt="basic"
		                 className="w-full object-cover aspect-square"
		                 width={100}
		                 height={100}
		                 sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
		/>}
	</Modal>;
}