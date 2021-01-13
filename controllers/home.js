const { layout } = require("../layout")

const home = (req, res) => {
    res.render("home", {
        locals: {
            title: "Asia NGO Home",
            errormsg: ""
        },
        ...layout,
    })
}

module.exports = {
    home
}