
export default async function PropertiesByIdPage(props){
	const params = await props.params;
	const id = params.id;
	return <div>
		<h2 className="font-semibold">PropertiesByIdPage - {id}</h2>
	</div>
}
