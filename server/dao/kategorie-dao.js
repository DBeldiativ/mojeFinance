const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const categoryFolderPath = path.join(__dirname, "uloziste", "kategorie");

function get(categoryId) {
    try {
        const filePath = path.join(categoryFolderPath, `${categoryId}.json`);
        const fileData = fs.readFileSync(filePath, "utf8");
        return JSON.parse(fileData);
    } catch (error) {
        if (error.code === "ENOENT") return null;
        throw { code: "failedToReadCategory", message: error.message };
    }
}

function create(category) {
    try {
        category.id = crypto.randomBytes(16).toString("hex");
        const filePath = path.join(categoryFolderPath, `${category.id}.json`);
        const fileData = JSON.stringify(category);
        fs.writeFileSync(filePath, fileData, "utf8");
        return category;
    } catch (error) {
        throw { code: "failedToCreateCategory", message: error.message };
    }
}

function edit(category) {
    try {
        const currentCategory = get(category.id);
        if (!currentCategory) return null;
        const newCategory = { ...currentCategory, ...category };
        const filePath = path.join(categoryFolderPath, `${category.id}.json`);
        const fileData = JSON.stringify(newCategory);
        fs.writeFileSync(filePath, fileData, "utf8");
        return newCategory;
    } catch (error) {
        throw { code: "failedToEditCategory", message: error.message };
    }
}

function deletion(categoryId) {
    try {
        const filePath = path.join(categoryFolderPath, `${categoryId}.json`);
        fs.unlinkSync(filePath);
        return {};
    } catch (error) {
        if (error.code === "ENOENT") return {};
        throw { code: "failedToRemoveCategory", message: error.message };
    }
}


function list() {
    try {
        const files = fs.readdirSync(categoryFolderPath);
        const categoryList = files.map((file) => {
            const fileData = fs.readFileSync(
                path.join(categoryFolderPath, file),
                "utf8"
            );
            return JSON.parse(fileData);
        });
        return categoryList;
    } catch (error) {
        throw { code: "failedToListCategories", message: error.message };
    }
}

module.exports = {
    get,
    create,
    edit,
    deletion,
    list
}