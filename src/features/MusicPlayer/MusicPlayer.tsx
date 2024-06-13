import Window from "../../components/Window/Window";

export function MusicPlayer({containerRef}) {
	return (
		<Window containerRef={containerRef}>
			<Window.Header> <h1>this is header</h1></Window.Header>
			<Window.Body> Music body </Window.Body>
		</Window>
	);
}
