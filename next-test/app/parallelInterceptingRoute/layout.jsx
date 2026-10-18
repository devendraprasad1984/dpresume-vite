export default function ParallelRouteLayout(props) {
	return <div>
		{props.modal}
		{props.children}
	</div>;
}