import { defineConfig } from "tinacms";
import dotenv from "dotenv";

// Load .env.local if it exists (for local development)
// In GitHub Actions, environment variables are set directly via secrets
// dotenv.config() won't throw if the file doesn't exist
try {
	dotenv.config({ path: ".env.local" });
} catch (e) {
	// Ignore errors (file doesn't exist in GitHub Actions)
}

// Prefer CI-provided branch names when available.
const branch = process.env.HEAD || process.env.GITHUB_REF_NAME || "main";
const apiURL =
	process.env.NODE_ENV == "development"
		? "http://localhost:4321/"
		: `https://content.tinajs.io/content/${process.env.TINA_CLIENT_ID}/github/${branch}`;

export default defineConfig({
	branch,
	clientId: process.env.TINA_CLIENT_ID, // 
	token: process.env.TINATOKEN, // 

	build: {
		outputFolder: "admin",
		publicFolder: "public",
	},
	media: {
		tina: {
			mediaRoot: "assets",
			publicFolder: "public",
		},
	},
	schema: {
		collections: [
			{
				label: "Site Settings",
				name: "settings",
				path: "src/settings",
				format: "json",
				fields: [
					{
						type: "string",
						label: "Site Title",
						name: "title",
					},
					{
						type: "string",
						label: "Site subtitle",
						name: "subtitle",
					},
				],
				ui: {
					allowedActions: {
						create: false,
						delete: false,
					},
				},
			},
			{
				name: "post",
				label: "Posts",
				path: "posts",
				defaultItem: () => ({
					title: "New Post",
					added: new Date(),
					tags: [],
				}),
				ui: {
					dateFormat: "MMM DD YYYY",
					filename: {
						readonly: false,
						slugify: (values) => {
							return values?.slug?.toLowerCase().replace(/ /g, "-");
						},
					},
				},
				fields: [
					{
						name: "title",
						label: "Title",
						type: "string",
						isTitle: true,
						required: true,
					},
					{
						label: "Slug",
						name: "slug",
						type: "string",
						required: true,
					},
					{
						label: "Description",
						name: "description",
						type: "string",
						required: true,
					},
					{
						label: "Tags",
						name: "tags",
						type: "string",
						list: true,
						options: [
							{
								value: "technical",
								label: "Technical",
							},
							{
								value: "advice",
								label: "Advice",
							},
							{
								value: "events",
								label: "Events",
							},
							{
								value: "learning",
								label: "Learning",
							},
							{
								value: "meta",
								label: "Meta",
							},
							{
								value: "work",
								label: "Work",
							},
							{
								value: "personal",
								label: "Personal",
							},
							{
								value: "projects",
								label: "Projects",
							},
						],
					},
					{
						label: "Added",
						name: "added",
						type: "datetime",
						dateFormat: "MMM DD YYYY",
						required: true,
					},
					{
						label: "Updated",
						name: "updated",
						type: "datetime",
						dateFormat: "MMM DD YYYY",
					},
					{
						type: "rich-text",
						name: "body",
						label: "Body",
						isBody: true,
					},
				],
			},
		],
	},
	search: {
		tina: {
			indexerToken: process.env.TINASEARCH,
			stopwordLanguages: ["eng"],
		},
		indexBatchSize: 50,
		maxSearchIndexFieldLength: 100,
	},
});
