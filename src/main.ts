import '@fontsource/nunito/900.css'
import '@fontsource-variable/nunito'
import './app.css'
import App from './App.svelte'

const app = new App({
	target: document.getElementById('app')!,
})

export default app
