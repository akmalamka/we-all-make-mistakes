require('dotenv').config()

const bodyParser = require('body-parser')
const errorHandler = require('errorhandler')
const express = require('express')
const logger = require('morgan')
const methodOverride = require('method-override')
const path = require('path')
const prismic = require('@prismicio/client')
const prismicDOM = require('prismic-dom')
const prismicH = require('@prismicio/helpers')

const fetch = (...args) =>
	import('node-fetch').then(({ default: fetch }) => fetch(...args))

const app = express()
const port = 3000

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(methodOverride())
app.use(errorHandler())

const handleRequest = async () => {
	const meta = await client.getSingle('meta')
	// you can just remove navbar and preloader if you don't wanna use it :)
	const navbar = await client.getSingle('navbar')
	const preloader = await client.getSingle('preloader')

	return {
		meta,
		navbar,
		preloader,
	}
}
app.use((req, res, next) => {
	res.locals.ctx = {
		prismicH,
	}
	res.locals.prismicDOM = prismicDOM
	// res.locals.Link = handleLinkResolver if needed
	next()
})

const repoName = 'akmalportfolio'
const accessToken = process.env.PRISMIC_ACCESS_TOKEN

const routes = [
	{
		type: 'home',
		path: '/',
	},
	// Add your routes for another pages here
]

const client = prismic.createClient(repoName, {
	fetch,
	accessToken,
	routes,
})

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.get('/', async (req, res) => {
	const defaults = await handleRequest()
	const home = await client.getSingle('home')

	res.render('pages/home', {
		...defaults,
		home,
	})
})

// add anohther app.get with another route below here

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})
