import {
    getAllCategories,
    getCategoryDetails,
    getProjectsByCategoryId
} from "../models/categories.js";

const showCategoriesPage = async (req, res) => {

    const categories = await getAllCategories();

    const title = "Service Categories";

    res.render("categories", {
        title,
        categories
    });

};

const showCategoryDetailsPage = async (req, res) => {

    const categoryId = req.params.id;

    const category = await getCategoryDetails(categoryId);

    const projects = await getProjectsByCategoryId(categoryId);

    const title = category.name;

    res.render("category", {
        title,
        category,
        projects
    });

};

export {
    showCategoriesPage,
    showCategoryDetailsPage
};