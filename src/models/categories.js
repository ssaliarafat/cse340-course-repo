import db from "./db.js";

const getAllCategories = async () => {

    const query = `
        SELECT
            category_id,
            name
        FROM category;
    `;

    const result = await db.query(query);

    return result.rows;

};


const getCategoryDetails = async (categoryId) => {

    const query = `
        SELECT
            category_id,
            name
        FROM category
        WHERE category_id = $1;
    `;

    const queryParams = [categoryId];

    const result = await db.query(query, queryParams);

    return result.rows.length > 0 ? result.rows[0] : null;

};


const getProjectsByCategoryId = async (categoryId) => {

    const query = `
        SELECT
            sp.project_id,
            sp.title,
            sp.project_date,
            sp.location
        FROM service_project sp

        JOIN project_category pc
            ON sp.project_id = pc.project_id

        WHERE pc.category_id = $1

        ORDER BY sp.project_date;
    `;

    const queryParams = [categoryId];

    const result = await db.query(query, queryParams);

    return result.rows;

};


// Add one category to one project
const assignCategoryToProject = async (categoryId, projectId) => {

    const query = `
        INSERT INTO project_category
            (category_id, project_id)
        VALUES
            ($1, $2);
    `;

    await db.query(query, [
        categoryId,
        projectId
    ]);

};


// Remove old categories and add new ones
const updateCategoryAssignments = async (projectId, categoryIds) => {

    // Remove existing category assignments
    const deleteQuery = `
        DELETE FROM project_category
        WHERE project_id = $1;
    `;

    await db.query(deleteQuery, [projectId]);


    // Add the newly selected categories
    for (const categoryId of categoryIds) {

        await assignCategoryToProject(
            categoryId,
            projectId
        );

    }

};

const getCategoriesByProjectId = async (projectId) => {

    const query = `
        SELECT
            c.category_id,
            c.name
        FROM category c

        JOIN project_category pc
            ON c.category_id = pc.category_id

        WHERE pc.project_id = $1;
    `;

    const result = await db.query(query, [projectId]);

    return result.rows;

};

export {
    getAllCategories,
    getCategoryDetails,
    getProjectsByCategoryId,
    getCategoriesByProjectId,
    updateCategoryAssignments
};

