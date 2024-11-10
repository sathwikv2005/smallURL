export default function login({ url }) {
	return (
		<div className="login">
			<h1 className="sour-gummy home--h1">You must login first</h1>
			<a href={`/login?from=${url}`} className="google--btn">
				<button type="button" className="login-with-google-btn">
					Sign in with Google
				</button>
			</a>
		</div>
	)
}
