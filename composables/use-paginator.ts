import { useRoute } from "vue-router";

export default () => {
	const page = reactive({
		index: 1,
		pages: 0,
		total: 0,
		limit: 5,
	});

	const route: any = useRoute();

	if (route && route.query && route.query.page && parseInt(route?.query?.page.toString())) {
		let toAssignPage = parseInt(route.query.page.toString());

		// if (toAssignPage < 1) {
		// 	toAssignPage = 1;
		// } else if (toAssignPage > page.pages) {
		// 	toAssignPage = page.pages;
		// }

		page.index = toAssignPage;
	}

	return { page };
};
