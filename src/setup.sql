-- ========================================
-- Organization Table
-- ========================================

CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);


-- ========================================
-- Service Project Table
-- ========================================

CREATE TABLE service_project (
    project_id SERIAL PRIMARY KEY,
    organization_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(150) NOT NULL,
    project_date DATE NOT NULL,

    CONSTRAINT fk_organization
        FOREIGN KEY (organization_id)
        REFERENCES organization (organization_id)
        ON DELETE CASCADE
);

INSERT INTO service_project
(
    organization_id,
    title,
    description,
    location,
    project_date
)
VALUES

(1,'Neighborhood Playground Renovation','Help renovate an aging playground by painting equipment and installing new benches.','Lagos Mainland','2026-08-15'),

(1,'Community Housing Repair','Assist skilled volunteers in repairing homes for low-income families.','Ikeja','2026-08-29'),

(1,'School Building Maintenance','Volunteer to repaint classrooms and perform minor repairs at a local primary school.','Yaba','2026-09-12'),

(1,'Bridge Cleanup Initiative','Work with community members to clean and beautify a neighborhood pedestrian bridge.','Surulere','2026-09-26'),

(1,'Public Park Improvement','Install park benches, plant flowers, and improve walking paths.','Lekki','2026-10-10'),

(2,'Community Garden Planting','Help prepare garden beds and plant vegetables for community use.','Victoria Island','2026-08-18'),

(2,'Urban Farming Workshop','Teach residents sustainable gardening and composting techniques.','Ajah','2026-09-02'),

(2,'School Garden Project','Create a vegetable garden to support environmental education.','Ikorodu','2026-09-16'),

(2,'Tree Planting Campaign','Plant native trees to improve green spaces and reduce erosion.','Epe','2026-09-30'),

(2,'Farmers Market Volunteer Day','Assist local farmers with organizing and operating the weekly community market.','Maryland','2026-10-14'),

(3,'Food Bank Distribution','Sort and distribute donated food packages to families in need.','Apapa','2026-08-22'),

(3,'Senior Citizen Outreach','Visit senior citizens and provide companionship through games and conversation.','Festac Town','2026-09-05'),

(3,'Youth Mentorship Program','Volunteer as a mentor for teenagers preparing for higher education.','Mushin','2026-09-19'),

(3,'Charity Clothing Drive','Collect, organize, and distribute donated clothing to local shelters.','Ojodu','2026-10-03'),

(3,'Community Health Awareness Day','Support health professionals by assisting with registration and public education.','Agege','2026-10-17');


-- ========================================
-- Category Table
-- ========================================

CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- ========================================
-- Project Category Junction Table
-- ========================================

CREATE TABLE project_category (
    project_id INT NOT NULL,
    category_id INT NOT NULL,

    PRIMARY KEY (project_id, category_id),

    FOREIGN KEY (project_id)
        REFERENCES service_project(project_id)
        ON DELETE CASCADE,

    FOREIGN KEY (category_id)
        REFERENCES category(category_id)
        ON DELETE CASCADE
);

INSERT INTO project_category (project_id, category_id)
VALUES
(1,2),
(2,2),
(3,1),
(4,2),
(5,3),

(6,3),
(7,1),
(8,1),
(9,3),
(10,2),

(11,2),
(12,2),
(13,1),
(14,2),
(15,2);