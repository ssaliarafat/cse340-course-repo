import {
    getAllCategories,
    getCategoryDetails,
    getProjectsByCategoryId,
    getCategoriesByProjectId,
    updateCategoryAssignments,
    createCategory,
    updateCategory
} from "../models/categories.js";

import {
    getProjectDetails
} from "../models/projects.js";

import { body, validationResult } from "express-validator";

const categoryValidation = [

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Category name is required")
        .isLength({ min: 3, max: 100 })
        .withMessage("Category name must be between 3 and 100 characters")

];


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


// Display assign categories form
const showAssignCategoriesForm = async (req, res) => {

    const projectId = req.params.projectId;


    const projectDetails = await getProjectDetails(projectId);

    const categories = await getAllCategories();


    // Get categories already assigned to this project
    const assignedCategories = await getCategoriesByProjectId(projectId);


    const title = "Assign Categories to Project";


    res.render("assign-categories", {
        title,
        projectId,
        projectDetails,
        categories,
        assignedCategories
    });

};


// Process checkbox submission
const processAssignCategoriesForm = async (req, res) => {

    const projectId = req.params.projectId;


    let selectedCategoryIds = req.body.categoryIds || [];


    // Make sure it is always an array
    if (!Array.isArray(selectedCategoryIds)) {
        selectedCategoryIds = [selectedCategoryIds];
    }


    await updateCategoryAssignments(
        projectId,
        selectedCategoryIds
    );


    req.flash(
        "success",
        "Categories updated successfully."
    );


    res.redirect(`/project/${projectId}`);

};


const showNewCategoryForm = async (req, res) => {

    const title = "Add New Category";

    res.render("new-category", {
        title
    });

};

const processNewCategoryForm = async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {

        errors.array().forEach(error => {
            req.flash("error", error.msg);
        });

        return res.redirect("/new-category");
    }


    const { name } = req.body;


    await createCategory(name);


    req.flash(
        "success",
        "Category created successfully!"
    );


    res.redirect("/categories");

};

const showEditCategoryForm = async (req, res) => {

    const categoryId = req.params.id;


    const category = await getCategoryDetails(categoryId);


    const title = "Edit Category";


    res.render("edit-category", {
        title,
        category
    });

};

const processEditCategoryForm = async (req, res) => {

    const errors = validationResult(req);


    if (!errors.isEmpty()) {

        errors.array().forEach(error => {
            req.flash("error", error.msg);
        });


        return res.redirect(
            `/edit-category/${req.params.id}`
        );

    }


    const categoryId = req.params.id;

    const { name } = req.body;


    await updateCategory(
        categoryId,
        name
    );


    req.flash(
        "success",
        "Category updated successfully!"
    );


    res.redirect(
        `/category/${categoryId}`
    );

};


export {
    showCategoriesPage,
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm,
    categoryValidation
};