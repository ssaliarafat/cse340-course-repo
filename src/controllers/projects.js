import {
    getUpcomingProjects,
    getProjectDetails,
    getCategoriesByProjectId,
    createProject
} from "../models/projects.js";

import { getAllOrganizations } from "../models/organizations.js";
import { body, validationResult } from "express-validator";


const projectValidation = [
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Project title is required")
        .isLength({ min: 3, max: 200 })
        .withMessage("Project title must be between 3 and 200 characters"),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Project description is required")
        .isLength({ max: 1000 })
        .withMessage("Project description cannot exceed 1000 characters"),

    body("location")
        .trim()
        .notEmpty()
        .withMessage("Project location is required")
        .isLength({ max: 200 })
        .withMessage("Project location cannot exceed 200 characters"),

    body("date")
        .notEmpty()
        .withMessage("Project date is required")
        .isISO8601()
        .withMessage("Please provide a valid date"),

    body("organizationId")
        .notEmpty()
        .withMessage("Please select an organization")
        .isInt()
        .withMessage("Invalid organization selected")
];

const NUMBER_OF_UPCOMING_PROJECTS = 5;

const showProjectsPage = async (req, res) => {

    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);

    const title = "Upcoming Service Projects";

    res.render("projects", {
        title,
        projects
    });

};

const showProjectDetailsPage = async (req, res) => {

    const projectId = req.params.id;

    const project = await getProjectDetails(projectId);

    const categories = await getCategoriesByProjectId(projectId);

    const title = "Project Details";

    res.render("project", {
        title,
        project,
        categories
    });

};

const showNewProjectForm = async (req, res) => {

    const organizations = await getAllOrganizations();

    res.render("new-project", {
        title: "Add New Project",
        organizations
    });

};
const processNewProjectForm = async (req, res) => {

    const results = validationResult(req);

    if (!results.isEmpty()) {

        results.array().forEach(error => {
            req.flash("error", error.msg);
        });

        return res.redirect("/new-project");
    }

    const {
        organizationId,
        title,
        description,
        location,
        date
    } = req.body;

    await createProject(
        title,
        description,
        location,
        date,
        organizationId
    );

    req.flash(
        "success",
        "Project added successfully!"
    );

    res.redirect("/projects");

};

export {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    projectValidation
};